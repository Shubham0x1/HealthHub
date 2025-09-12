"use client"

import { useState } from "react"
import { AuthProvider } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { NutritionForm } from "@/components/nutrition/nutrition-form"
import { MealPlanDisplay } from "@/components/nutrition/meal-plan-display"
import { NutritionService, type NutritionProfile, type MealPlan } from "@/lib/nutrition"

function NutritionContent() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleProfileSubmit = async (profile: NutritionProfile) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const generatedPlan = NutritionService.generateMealPlan(profile)
    setMealPlan(generatedPlan)
    setIsLoading(false)
  }

  const handleNewPlan = () => {
    setMealPlan(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nutrition Planning</h1>
          <p className="text-muted-foreground mt-1">
            Get personalized meal plans based on your health goals and preferences
          </p>
        </div>

        {!mealPlan ? (
          <NutritionForm onSubmit={handleProfileSubmit} isLoading={isLoading} />
        ) : (
          <MealPlanDisplay mealPlan={mealPlan} onNewPlan={handleNewPlan} />
        )}
      </div>
    </DashboardLayout>
  )
}

export default function NutritionPage() {
  return (
    <AuthProvider>
      <NutritionContent />
    </AuthProvider>
  )
}
