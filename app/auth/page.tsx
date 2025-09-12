"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { AuthProvider, useAuth } from "@/hooks/use-auth"
import { Heart, Shield, Users } from "lucide-react"

function AuthPageContent() {
  const [isLogin, setIsLogin] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-primary">HealthHub</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Your comprehensive health platform for nutrition, telemedicine, and wellness tracking
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Personalized Nutrition</h3>
                <p className="text-sm text-muted-foreground">
                  Get customized meal plans based on your lifestyle and health goals
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-secondary/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Telemedicine Access</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with healthcare specialists from the comfort of your home
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-accent/10 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Health Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor symptoms and track your health journey over time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="flex justify-center">
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <SignupForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <AuthProvider>
      <AuthPageContent />
    </AuthProvider>
  )
}
