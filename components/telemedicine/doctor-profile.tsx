"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Star, DollarSign, Calendar, Award, GraduationCap, Languages, ArrowLeft } from "lucide-react"
import type { Doctor } from "@/lib/telemedicine"

interface DoctorProfileProps {
  doctor: Doctor
  onBack: () => void
  onBookAppointment: () => void
}

export function DoctorProfile({ doctor, onBack, onBookAppointment }: DoctorProfileProps) {
  const availableSlots = doctor.availability.filter((slot) => slot.available)

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Search
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {doctor.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{doctor.name}</h1>
                      <p className="text-lg text-primary font-medium">{doctor.specialty}</p>
                      <p className="text-muted-foreground">
                        {doctor.credentials.join(", ")} • {doctor.experience} years of experience
                      </p>
                    </div>
                    <Badge variant={doctor.isOnline ? "default" : "secondary"}>
                      {doctor.isOnline ? "Available Now" : "Offline"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{doctor.rating}</span>
                      <span className="text-muted-foreground">({doctor.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-5 w-5" />
                      <span className="font-medium">${doctor.consultationFee} per consultation</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{doctor.bio}</p>
            </CardContent>
          </Card>

          {/* Education & Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education & Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Education</h4>
                <ul className="space-y-1">
                  {doctor.education.map((edu, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      {edu}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Certifications</h4>
                <ul className="space-y-1">
                  {doctor.certifications.map((cert, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <Award className="h-3 w-3" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Languages Spoken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((language) => (
                  <Badge key={language} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Book Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">${doctor.consultationFee}</p>
                <p className="text-sm text-muted-foreground">Consultation Fee</p>
              </div>

              <Button className="w-full" onClick={onBookAppointment} disabled={availableSlots.length === 0}>
                <Calendar className="h-4 w-4 mr-2" />
                {availableSlots.length > 0 ? "Book Appointment" : "No Available Slots"}
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                Consultation types: Video call, Phone call
              </div>
            </CardContent>
          </Card>

          {/* Next Available Slots */}
          {availableSlots.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableSlots.slice(0, 4).map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div>
                        <p className="font-medium text-sm">{new Date(slot.date).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">{slot.time}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={onBookAppointment}>
                        Book
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
