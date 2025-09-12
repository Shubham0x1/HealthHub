"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Heart, ArrowRight } from "lucide-react"

function HomeContent() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold text-primary">HealthHub</h1>
          </div>

          <h2 className="text-2xl md:text-4xl font-semibold text-foreground text-balance">
            Your Complete Health & Wellness Platform
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Manage your nutrition, connect with healthcare professionals, and track your health journey all in one
            place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button size="lg" onClick={() => router.push("/auth")} className="text-lg px-8 py-6">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push("/auth")} className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center space-y-4 p-6 rounded-lg bg-card border">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Personalized Nutrition</h3>
            <p className="text-muted-foreground">
              Get customized meal plans and nutrition advice tailored to your specific health goals and dietary
              preferences.
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg bg-card border">
            <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <svg className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Telemedicine</h3>
            <p className="text-muted-foreground">
              Connect with qualified healthcare specialists and book appointments from the comfort of your home.
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg bg-card border">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Health Tracking</h3>
            <p className="text-muted-foreground">
              Monitor your symptoms, track progress, and maintain a comprehensive health history over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  )
}
