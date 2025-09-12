"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SymptomForm } from "@/components/symptoms/symptom-form"
import { SymptomTimeline } from "@/components/symptoms/symptom-timeline"
import { SymptomCharts } from "@/components/symptoms/symptom-charts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Download, Calendar, BarChart3, Baseline as Timeline, Info } from "lucide-react"
import { SymptomTrackingService, type SymptomEntry, type SymptomSummary } from "@/lib/symptoms"
import { useToast } from "@/hooks/use-toast"
import { format, subDays } from "date-fns"

function SymptomsContent() {
  const [entries, setEntries] = useState<SymptomEntry[]>([])
  const [summary, setSummary] = useState<SymptomSummary[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<SymptomEntry | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("timeline")
  const { toast } = useToast()

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = () => {
    const allEntries = SymptomTrackingService.getAllEntries()
    setEntries(allEntries)

    const generatedSummary = SymptomTrackingService.generateSummary(allEntries)
    setSummary(generatedSummary)
  }

  const handleAddSymptom = async (entryData: Omit<SymptomEntry, "id" | "createdAt">) => {
    setIsLoading(true)
    try {
      await SymptomTrackingService.addEntry(entryData)
      loadEntries()
      setIsFormOpen(false)
      toast({
        title: "Symptom logged successfully",
        description: "Your symptom has been added to your health record.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log symptom. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSymptom = async (entryData: Omit<SymptomEntry, "id" | "createdAt">) => {
    if (!editingEntry) return

    setIsLoading(true)
    try {
      await SymptomTrackingService.updateEntry(editingEntry.id, entryData)
      loadEntries()
      setEditingEntry(null)
      toast({
        title: "Symptom updated",
        description: "Your symptom entry has been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update symptom. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSymptom = async (id: string) => {
    try {
      await SymptomTrackingService.deleteEntry(id)
      loadEntries()
      toast({
        title: "Symptom deleted",
        description: "The symptom entry has been removed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete symptom. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportData = () => {
    const csv = SymptomTrackingService.exportToCSV(entries)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `symptom-history-${format(new Date(), "yyyy-MM-dd")}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export successful",
      description: "Your symptom history has been downloaded as a CSV file.",
    })
  }

  const recentEntries = entries.slice(0, 5)
  const last30DaysEntries = entries.filter((entry) => new Date(entry.date) >= subDays(new Date(), 30))

  const stats = [
    {
      title: "Total Symptoms",
      value: entries.length.toString(),
      description: "All time",
      icon: Calendar,
    },
    {
      title: "Last 30 Days",
      value: last30DaysEntries.length.toString(),
      description: "Recent activity",
      icon: BarChart3,
    },
    {
      title: "Unique Symptoms",
      value: summary.length.toString(),
      description: "Different types",
      icon: Timeline,
    },
    {
      title: "Avg Severity",
      value:
        entries.length > 0
          ? (entries.reduce((sum, entry) => sum + entry.severity, 0) / entries.length).toFixed(1)
          : "0",
      description: "Overall average",
      icon: Info,
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Symptom Tracker</h1>
            <p className="text-muted-foreground mt-1">Monitor your symptoms and identify patterns over time</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportData} disabled={entries.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Log Symptom
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Track your symptoms regularly to help identify patterns and triggers. This information can be valuable when
            discussing your health with healthcare providers.
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-6">
            <SymptomTimeline entries={entries} onEdit={setEditingEntry} onDelete={handleDeleteSymptom} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <SymptomCharts entries={entries} summary={summary} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Symptom Dialog */}
      <Dialog
        open={isFormOpen || !!editingEntry}
        onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false)
            setEditingEntry(null)
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEntry ? "Edit Symptom" : "Log New Symptom"}</DialogTitle>
            <DialogDescription>
              {editingEntry
                ? "Update the details of your symptom entry"
                : "Record a new symptom to track your health patterns"}
            </DialogDescription>
          </DialogHeader>
          <SymptomForm
            onSubmit={editingEntry ? handleEditSymptom : handleAddSymptom}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingEntry(null)
            }}
            initialData={editingEntry || undefined}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

export default function SymptomsPage() {
  return (
    <AuthProvider>
      <SymptomsContent />
    </AuthProvider>
  )
}
