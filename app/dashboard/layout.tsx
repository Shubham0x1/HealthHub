import type React from "react"
import { AuthProvider } from "@/hooks/use-auth"

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
}
