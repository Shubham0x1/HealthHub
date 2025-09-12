"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Clock, ChefHat, Download, Share, Calendar } from "lucide-react"
import type { MealPlan, Meal } from "@/lib/nutrition"
import Image from "next/image"

interface MealPlanDisplayProps {
  mealPlan: MealPlan
  onNewPlan: () => void
}

export function MealPlanDisplay({ mealPlan, onNewPlan }: MealPlanDisplayProps) {
  const macroPercentages = {
    protein: Math.round(((mealPlan.protein * 4) / mealPlan.calories) * 100),
    carbs: Math.round(((mealPlan.carbs * 4) / mealPlan.calories) * 100),
    fat: Math.round(((mealPlan.fat * 9) / mealPlan.calories) * 100),
  }

  const MealCard = ({ meal }: { meal: Meal }) => (
    <Card className="overflow-hidden">
      <div className="aspect-video relative bg-muted">
        <Image
          src={meal.image || "/placeholder.svg?height=200&width=300&query=healthy meal"}
          alt={meal.name}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-2 left-2 capitalize">{meal.type}</Badge>
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{meal.name}</CardTitle>
        <CardDescription>{meal.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Nutrition Info */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{meal.calories}</p>
            <p className="text-xs text-muted-foreground">Calories</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{meal.protein}g</p>
            <p className="text-xs text-muted-foreground">Protein</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{meal.carbs}g</p>
            <p className="text-xs text-muted-foreground">Carbs</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{meal.fat}g</p>
            <p className="text-xs text-muted-foreground">Fat</p>
          </div>
        </div>

        <Separator />

        {/* Prep Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{meal.prepTime} minutes prep time</span>
        </div>

        {/* Ingredients */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            Ingredients
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {meal.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h4 className="font-medium mb-2">Instructions</h4>
          <ol className="text-sm text-muted-foreground space-y-1">
            {meal.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-2">
                <span className="font-medium text-primary">{index + 1}.</span>
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{mealPlan.name}</CardTitle>
              <CardDescription className="mt-1">{mealPlan.description}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Daily Totals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-3xl font-bold text-primary">{mealPlan.calories}</p>
              <p className="text-sm text-muted-foreground">Total Calories</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{mealPlan.protein}g</p>
              <p className="text-sm text-muted-foreground">Protein</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{mealPlan.carbs}g</p>
              <p className="text-sm text-muted-foreground">Carbohydrates</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{mealPlan.fat}g</p>
              <p className="text-sm text-muted-foreground">Fat</p>
            </div>
          </div>

          {/* Macro Distribution */}
          <div className="space-y-4">
            <h3 className="font-semibold">Macronutrient Distribution</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Protein</span>
                  <span>{macroPercentages.protein}%</span>
                </div>
                <Progress value={macroPercentages.protein} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Carbohydrates</span>
                  <span>{macroPercentages.carbs}%</span>
                </div>
                <Progress value={macroPercentages.carbs} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Fat</span>
                  <span>{macroPercentages.fat}%</span>
                </div>
                <Progress value={macroPercentages.fat} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Today's Meals</h2>
          <Button onClick={onNewPlan} variant="outline">
            Generate New Plan
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mealPlan.meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </div>
    </div>
  )
}
