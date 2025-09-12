"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Target, Activity, AlertCircle } from "lucide-react"
import type { NutritionProfile } from "@/lib/nutrition"

interface NutritionFormProps {
  onSubmit: (profile: NutritionProfile) => void
  isLoading?: boolean
}

export function NutritionForm({ onSubmit, isLoading }: NutritionFormProps) {
  const [profile, setProfile] = useState<Partial<NutritionProfile>>({
    dietaryRestrictions: [],
    allergies: [],
    preferences: [],
  })
  const [errors, setErrors] = useState<string[]>([])

  const dietaryOptions = ["vegetarian", "vegan", "gluten-free", "dairy-free", "keto", "paleo", "mediterranean"]

  const allergyOptions = ["nuts", "shellfish", "eggs", "dairy", "soy", "gluten", "fish"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: string[] = []

    // Validation
    if (!profile.age || profile.age < 18 || profile.age > 100) {
      newErrors.push("Please enter a valid age (18-100)")
    }
    if (!profile.gender) {
      newErrors.push("Please select your gender")
    }
    if (!profile.height || profile.height < 100 || profile.height > 250) {
      newErrors.push("Please enter a valid height (100-250 cm)")
    }
    if (!profile.weight || profile.weight < 30 || profile.weight > 300) {
      newErrors.push("Please enter a valid weight (30-300 kg)")
    }
    if (!profile.activityLevel) {
      newErrors.push("Please select your activity level")
    }
    if (!profile.goal) {
      newErrors.push("Please select your health goal")
    }

    setErrors(newErrors)

    if (newErrors.length === 0) {
      onSubmit(profile as NutritionProfile)
    }
  }

  const handleDietaryChange = (option: string, checked: boolean) => {
    setProfile((prev) => ({
      ...prev,
      dietaryRestrictions: checked
        ? [...(prev.dietaryRestrictions || []), option]
        : (prev.dietaryRestrictions || []).filter((item) => item !== option),
    }))
  }

  const handleAllergyChange = (option: string, checked: boolean) => {
    setProfile((prev) => ({
      ...prev,
      allergies: checked
        ? [...(prev.allergies || []), option]
        : (prev.allergies || []).filter((item) => item !== option),
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Nutrition Profile Setup
        </CardTitle>
        <CardDescription>Tell us about yourself to get a personalized nutrition plan</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={profile.age || ""}
                  onChange={(e) => setProfile((prev) => ({ ...prev, age: Number.parseInt(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={profile.gender}
                  onValueChange={(value: any) => setProfile((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Enter height in cm"
                  value={profile.height || ""}
                  onChange={(e) => setProfile((prev) => ({ ...prev, height: Number.parseInt(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight in kg"
                  value={profile.weight || ""}
                  onChange={(e) => setProfile((prev) => ({ ...prev, weight: Number.parseInt(e.target.value) }))}
                />
              </div>
            </div>
          </div>

          {/* Activity & Goals */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity & Goals
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity">Activity Level</Label>
                <Select
                  value={profile.activityLevel}
                  onValueChange={(value: any) => setProfile((prev) => ({ ...prev, activityLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                    <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                    <SelectItem value="very-active">Very Active (2x/day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Health Goal</Label>
                <Select
                  value={profile.goal}
                  onValueChange={(value: any) => setProfile((prev) => ({ ...prev, goal: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose-weight">Lose Weight</SelectItem>
                    <SelectItem value="maintain-weight">Maintain Weight</SelectItem>
                    <SelectItem value="gain-weight">Gain Weight</SelectItem>
                    <SelectItem value="build-muscle">Build Muscle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-4 w-4" />
              Dietary Preferences
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Dietary Restrictions</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {dietaryOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`diet-${option}`}
                        checked={(profile.dietaryRestrictions || []).includes(option)}
                        onCheckedChange={(checked) => handleDietaryChange(option, checked as boolean)}
                      />
                      <Label htmlFor={`diet-${option}`} className="text-sm capitalize">
                        {option.replace("-", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Allergies</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {allergyOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`allergy-${option}`}
                        checked={(profile.allergies || []).includes(option)}
                        onCheckedChange={(checked) => handleAllergyChange(option, checked as boolean)}
                      />
                      <Label htmlFor={`allergy-${option}`} className="text-sm capitalize">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Preferences */}
          <div className="space-y-2">
            <Label htmlFor="preferences">Additional Preferences (Optional)</Label>
            <Textarea
              id="preferences"
              placeholder="Any specific food preferences, dislikes, or additional information..."
              value={profile.preferences?.join(", ") || ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  preferences: e.target.value
                    .split(",")
                    .map((p) => p.trim())
                    .filter(Boolean),
                }))
              }
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Plan...
              </>
            ) : (
              "Generate Nutrition Plan"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
