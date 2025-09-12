// Mock authentication system for the health platform
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
}

// Mock user data
const mockUsers: User[] = [
  {
    id: "1",
    email: "demo@healthhub.com",
    name: "Demo User",
    avatar: "/diverse-user-avatars.png",
    createdAt: new Date("2024-01-01"),
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(email: string, password: string): Promise<{ user: User | null; error?: string }> {
    await delay(1000) // Simulate API call

    const user = mockUsers.find((u) => u.email === email)
    if (user && password === "password") {
      this.currentUser = user
      localStorage.setItem("auth_user", JSON.stringify(user))
      return { user }
    }

    return { user: null, error: "Invalid email or password" }
  }

  async signup(email: string, password: string, name: string): Promise<{ user: User | null; error?: string }> {
    await delay(1000) // Simulate API call

    // Check if user already exists
    if (mockUsers.find((u) => u.email === email)) {
      return { user: null, error: "User already exists" }
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      avatar: "/diverse-user-avatars.png",
      createdAt: new Date(),
    }

    mockUsers.push(newUser)
    this.currentUser = newUser
    localStorage.setItem("auth_user", JSON.stringify(newUser))
    return { user: newUser }
  }

  async logout(): Promise<void> {
    await delay(500)
    this.currentUser = null
    localStorage.removeItem("auth_user")
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser

    // Check localStorage for persisted user
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("auth_user")
      if (stored) {
        this.currentUser = JSON.parse(stored)
        return this.currentUser
      }
    }

    return null
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}
