// Mock nutrition data and meal planning logic
export interface NutritionProfile {
  age: number
  gender: "male" | "female" | "other"
  height: number // cm
  weight: number // kg
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very-active"
  goal: "lose-weight" | "maintain-weight" | "gain-weight" | "build-muscle"
  dietaryRestrictions: string[]
  allergies: string[]
  preferences: string[]
}

export interface MealPlan {
  id: string
  name: string
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  meals: Meal[]
  createdAt: Date
}

export interface Meal {
  id: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  name: string
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: string[]
  instructions: string[]
  prepTime: number // minutes
  image?: string
}

// Mock meal database
const mockMeals: Meal[] = [
  {
    id: "1",
    type: "breakfast",
    name: "Greek Yogurt Parfait",
    description: "Protein-rich breakfast with berries and granola",
    calories: 320,
    protein: 20,
    carbs: 35,
    fat: 8,
    ingredients: ["Greek yogurt", "Mixed berries", "Granola", "Honey"],
    instructions: ["Layer yogurt in bowl", "Add berries", "Top with granola", "Drizzle honey"],
    prepTime: 5,
    image: "/greek-yogurt-parfait.png",
  },
  {
    id: "2",
    type: "breakfast",
    name: "Avocado Toast",
    description: "Whole grain toast with avocado and eggs",
    calories: 380,
    protein: 18,
    carbs: 30,
    fat: 22,
    ingredients: ["Whole grain bread", "Avocado", "Eggs", "Cherry tomatoes", "Salt", "Pepper"],
    instructions: ["Toast bread", "Mash avocado", "Fry eggs", "Assemble and season"],
    prepTime: 10,
    image: "/avocado-toast-eggs.png",
  },
  {
    id: "3",
    type: "lunch",
    name: "Mediterranean Salad",
    description: "Fresh salad with feta, olives, and olive oil",
    calories: 420,
    protein: 15,
    carbs: 25,
    fat: 28,
    ingredients: ["Mixed greens", "Feta cheese", "Olives", "Cucumber", "Tomatoes", "Olive oil"],
    instructions: ["Wash greens", "Chop vegetables", "Add feta and olives", "Dress with olive oil"],
    prepTime: 15,
    image: "/mediterranean-salad-with-feta.jpg",
  },
  {
    id: "4",
    type: "lunch",
    name: "Quinoa Buddha Bowl",
    description: "Nutritious bowl with quinoa, vegetables, and tahini",
    calories: 480,
    protein: 18,
    carbs: 65,
    fat: 16,
    ingredients: ["Quinoa", "Roasted vegetables", "Chickpeas", "Tahini", "Lemon"],
    instructions: ["Cook quinoa", "Roast vegetables", "Prepare tahini dressing", "Assemble bowl"],
    prepTime: 25,
    image: "/quinoa-buddha-bowl.png",
  },
  {
    id: "5",
    type: "dinner",
    name: "Grilled Salmon",
    description: "Omega-3 rich salmon with roasted vegetables",
    calories: 520,
    protein: 45,
    carbs: 20,
    fat: 28,
    ingredients: ["Salmon fillet", "Broccoli", "Sweet potato", "Olive oil", "Herbs"],
    instructions: ["Season salmon", "Grill for 6-8 minutes", "Roast vegetables", "Serve together"],
    prepTime: 30,
    image: "/grilled-salmon-with-vegetables.jpg",
  },
  {
    id: "6",
    type: "dinner",
    name: "Chicken Stir Fry",
    description: "Lean protein with colorful vegetables",
    calories: 450,
    protein: 35,
    carbs: 40,
    fat: 15,
    ingredients: ["Chicken breast", "Mixed vegetables", "Brown rice", "Soy sauce", "Ginger"],
    instructions: ["Cook rice", "Stir fry chicken", "Add vegetables", "Season and serve"],
    prepTime: 20,
    image: "/chicken-stir-fry.png",
  },
]

export class NutritionService {
  static calculateBMR(profile: NutritionProfile): number {
    // Mifflin-St Jeor Equation
    let bmr: number
    if (profile.gender === "male") {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
    }

    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      "very-active": 1.9,
    }

    return Math.round(bmr * activityMultipliers[profile.activityLevel])
  }

  static adjustCaloriesForGoal(bmr: number, goal: string): number {
    switch (goal) {
      case "lose-weight":
        return Math.round(bmr * 0.8) // 20% deficit
      case "gain-weight":
        return Math.round(bmr * 1.15) // 15% surplus
      case "build-muscle":
        return Math.round(bmr * 1.1) // 10% surplus
      default:
        return bmr
    }
  }

  static generateMealPlan(profile: NutritionProfile): MealPlan {
    const bmr = this.calculateBMR(profile)
    const targetCalories = this.adjustCaloriesForGoal(bmr, profile.goal)

    // Filter meals based on dietary restrictions
    const availableMeals = mockMeals.filter((meal) => {
      // Simple filtering logic - in real app would be more sophisticated
      if (profile.dietaryRestrictions.includes("vegetarian")) {
        return !meal.ingredients.some((ing) =>
          ["chicken", "salmon", "beef", "pork"].some((meat) => ing.toLowerCase().includes(meat)),
        )
      }
      return true
    })

    // Select meals for the day
    const breakfast = availableMeals.filter((m) => m.type === "breakfast")[0]
    const lunch = availableMeals.filter((m) => m.type === "lunch")[0]
    const dinner = availableMeals.filter((m) => m.type === "dinner")[0]

    const selectedMeals = [breakfast, lunch, dinner].filter(Boolean)

    const totalCalories = selectedMeals.reduce((sum, meal) => sum + meal.calories, 0)
    const totalProtein = selectedMeals.reduce((sum, meal) => sum + meal.protein, 0)
    const totalCarbs = selectedMeals.reduce((sum, meal) => sum + meal.carbs, 0)
    const totalFat = selectedMeals.reduce((sum, meal) => sum + meal.fat, 0)

    return {
      id: Date.now().toString(),
      name: `Personalized ${profile.goal.replace("-", " ")} Plan`,
      description: `Custom meal plan for ${targetCalories} calories per day`,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      fiber: 25, // Mock value
      meals: selectedMeals,
      createdAt: new Date(),
    }
  }
}
