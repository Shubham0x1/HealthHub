"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Loader2, Plus, X, CalendarIcon, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { COMMON_SYMPTOMS, COMMON_TRIGGERS, type SymptomEntry } from "@/lib/symptoms"

interface SymptomFormProps {
  onSubmit: (entry: Omit<SymptomEntry, "id" | "createdAt">) => Promise<void>
  onCancel?: () => void
  initialData?: Partial<SymptomEntry>
  isLoading?: boolean
}

export function SymptomForm({ onSubmit, onCancel, initialData, isLoading }: SymptomFormProps) {
  const [date, setDate] = useState<Date>(initialData?.date ? new Date(initialData.date) : new Date())
  const [symptom, setSymptom] = useState(initialData?.symptom || "")
  const [customSymptom, setCustomSymptom] = useState("")
  const [severity, setSeverity] = useState([initialData?.severity || 5])
  const [duration, setDuration] = useState(initialData?.duration || "")
  const [notes, setNotes] = useState(initialData?.notes || "")
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(initialData?.triggers || [])
  const [customTrigger, setCustomTrigger] = useState("")
  const [medications, setMedications] = useState<string[]>(initialData?.medications || [])
  const [newMedication, setNewMedication] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: string[] = []

    const finalSymptom = symptom === "custom" ? customSymptom : symptom
    if (!finalSymptom.trim()) {
      newErrors.push("Please select or enter a symptom")
    }

    if (severity[0] < 1 || severity[0] > 10) {
      newErrors.push("Severity must be between 1 and 10")
    }

    setErrors(newErrors)

    if (newErrors.length === 0) {
      const entry: Omit<SymptomEntry, "id" | "createdAt"> = {
        date: format(date, "yyyy-MM-dd"),
        symptom: finalSymptom,
        severity: severity[0],
        duration: duration.trim() || undefined,
        notes: notes.trim() || undefined,
        triggers: selectedTriggers.length > 0 ? selectedTriggers : undefined,
        medications: medications.length > 0 ? medications : undefined,
      }

      await onSubmit(entry)
    }
  }

  const handleTriggerToggle = (trigger: string, checked: boolean) => {
    setSelectedTriggers((prev) => (checked ? [...prev, trigger] : prev.filter((t) => t !== trigger)))
  }

  const handleAddCustomTrigger = () => {
    if (customTrigger.trim() && !selectedTriggers.includes(customTrigger.trim())) {
      setSelectedTriggers((prev) => [...prev, customTrigger.trim()])
      setCustomTrigger("")
    }
  }

  const handleRemoveTrigger = (trigger: string) => {
    setSelectedTriggers((prev) => prev.filter((t) => t !== trigger))
  }

  const handleAddMedication = () => {
    if (newMedication.trim() && !medications.includes(newMedication.trim())) {
      setMedications((prev) => [...prev, newMedication.trim()])
      setNewMedication("")
    }
  }

  const handleRemoveMedication = (medication: string) => {
    setMedications((prev) => prev.filter((m) => m !== medication))
  }

  const getSeverityLabel = (value: number) => {
    if (value <= 2) return "Mild"
    if (value <= 4) return "Mild-Moderate"
    if (value <= 6) return "Moderate"
    if (value <= 8) return "Severe"
    return "Very Severe"
  }

  const getSeverityColor = (value: number) => {
    if (value <= 3) return "text-green-600"
    if (value <= 6) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Log Symptom</CardTitle>
        <CardDescription>Record your symptoms to track patterns and share with healthcare providers</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Symptom */}
          <div className="space-y-3">
            <Label>Symptom</Label>
            <Select value={symptom} onValueChange={setSymptom}>
              <SelectTrigger>
                <SelectValue placeholder="Select a symptom" />
              </SelectTrigger>
              <SelectContent>
                {COMMON_SYMPTOMS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Other (specify below)</SelectItem>
              </SelectContent>
            </Select>

            {symptom === "custom" && (
              <Input
                placeholder="Enter custom symptom"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
              />
            )}
          </div>

          {/* Severity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Severity</Label>
              <div className="text-right">
                <div className="text-2xl font-bold">{severity[0]}/10</div>
                <div className={cn("text-sm font-medium", getSeverityColor(severity[0]))}>
                  {getSeverityLabel(severity[0])}
                </div>
              </div>
            </div>
            <Slider value={severity} onValueChange={setSeverity} max={10} min={1} step={1} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 - Mild</span>
              <span>5 - Moderate</span>
              <span>10 - Severe</span>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (Optional)</Label>
            <Input
              id="duration"
              placeholder="e.g., 2 hours, all day, 30 minutes"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          {/* Triggers */}
          <div className="space-y-3">
            <Label>Possible Triggers (Optional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {COMMON_TRIGGERS.map((trigger) => (
                <div key={trigger} className="flex items-center space-x-2">
                  <Checkbox
                    id={`trigger-${trigger}`}
                    checked={selectedTriggers.includes(trigger)}
                    onCheckedChange={(checked) => handleTriggerToggle(trigger, checked as boolean)}
                  />
                  <Label htmlFor={`trigger-${trigger}`} className="text-sm">
                    {trigger}
                  </Label>
                </div>
              ))}
            </div>

            {/* Custom Trigger */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom trigger"
                value={customTrigger}
                onChange={(e) => setCustomTrigger(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomTrigger())}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleAddCustomTrigger}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected Triggers */}
            {selectedTriggers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTriggers.map((trigger) => (
                  <Badge key={trigger} variant="secondary" className="gap-1">
                    {trigger}
                    <button
                      type="button"
                      onClick={() => handleRemoveTrigger(trigger)}
                      className="ml-1 hover:bg-muted-foreground/20 rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Medications */}
          <div className="space-y-3">
            <Label>Medications Taken (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add medication"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddMedication())}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleAddMedication}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {medications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {medications.map((medication) => (
                  <Badge key={medication} variant="outline" className="gap-1">
                    {medication}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(medication)}
                      className="ml-1 hover:bg-muted-foreground/20 rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details about the symptom, what you were doing, how you felt, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Symptom"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
