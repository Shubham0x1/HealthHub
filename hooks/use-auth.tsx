"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { AuthService, type User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const authService = AuthService.getInstance()

  useEffect(() => {
    // Check for existing user on mount
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    const result = await authService.login(email, password)

    if (result.user) {
      setUser(result.user)
      setIsLoading(false)
      return { success: true }
    }

    setIsLoading(false)
    return { success: false, error: result.error }
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    const result = await authService.signup(email, password, name)

    if (result.user) {
      setUser(result.user)
      setIsLoading(false)
      return { success: true }
    }

    setIsLoading(false)
    return { success: false, error: result.error }
  }

  const logout = async () => {
    setIsLoading(true)
    await authService.logout()
    setUser(null)
    setIsLoading(false)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
