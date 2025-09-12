"use client"

import { AuthProvider } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Activity,
  Calendar,
  TrendingUp,
  Apple,
  Stethoscope,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"

function DashboardContent() {
  const router = useRouter()

  // Mock data
  const stats = [
    {
      title: "Health Score",
      value: "85/100",
      description: "Based on recent activities",
      icon: Heart,
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Active Days",
      value: "12",
      description: "This month",
      icon: Activity,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Appointments",
      value: "3",
      description: "Scheduled this month",
      icon: Calendar,
      trend: { value: 2, isPositive: true },
    },
    {
      title: "Nutrition Goals",
      value: "78%",
      description: "Weekly target achieved",
      icon: TrendingUp,
      trend: { value: 12, isPositive: true },
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "nutrition",
      title: "Meal plan updated",
      description: "Mediterranean diet plan for weight management",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "appointment",
      title: "Appointment scheduled",
      description: "Dr. Sarah Johnson - Cardiology consultation",
      time: "1 day ago",
      status: "scheduled",
    },
    {
      id: 3,
      type: "symptoms",
      title: "Symptom logged",
      description: "Mild headache - severity 3/10",
      time: "2 days ago",
      status: "logged",
    },
  ]

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "Tomorrow",
      time: "2:00 PM",
      type: "Video Call",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Nutrition",
      date: "Friday",
      time: "10:30 AM",
      type: "In-Person",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your health journey today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access your most used features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start gap-3 bg-transparent"
                variant="outline"
                onClick={() => router.push("/dashboard/nutrition")}
              >
                <Apple className="h-4 w-4" />
                Plan Nutrition
              </Button>
              <Button
                className="w-full justify-start gap-3 bg-transparent"
                variant="outline"
                onClick={() => router.push("/dashboard/telemedicine")}
              >
                <Stethoscope className="h-4 w-4" />
                Book Appointment
              </Button>
              <Button
                className="w-full justify-start gap-3 bg-transparent"
                variant="outline"
                onClick={() => router.push("/dashboard/symptoms")}
              >
                <BarChart3 className="h-4 w-4" />
                Log Symptoms
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest health activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1">
                    {activity.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {activity.status === "scheduled" && <Clock className="h-4 w-4 text-blue-600" />}
                    {activity.status === "logged" && <AlertCircle className="h-4 w-4 text-orange-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled consultations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{appointment.doctor}</p>
                    <Badge variant="outline" className="text-xs">
                      {appointment.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{appointment.specialty}</p>
                  <p className="text-xs text-primary font-medium">
                    {appointment.date} at {appointment.time}
                  </p>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 bg-transparent"
                onClick={() => router.push("/dashboard/telemedicine")}
              >
                View All Appointments
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Health Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Health Goals</CardTitle>
            <CardDescription>Track your progress towards this week's health objectives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Daily Water Intake</span>
                <span className="text-muted-foreground">6/8 glasses</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Exercise Minutes</span>
                <span className="text-muted-foreground">120/150 min</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Sleep Quality</span>
                <span className="text-muted-foreground">5/7 nights</span>
              </div>
              <Progress value={71} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  )
}
