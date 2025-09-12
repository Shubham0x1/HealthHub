"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, DollarSign, Calendar } from "lucide-react"
import type { Doctor } from "@/lib/telemedicine"

interface DoctorCardProps {
  doctor: Doctor
  onBookAppointment: (doctorId: string) => void
  onViewProfile: (doctorId: string) => void
}

export function DoctorCard({ doctor, onBookAppointment, onViewProfile }: DoctorCardProps) {
  const nextAvailableSlot = doctor.availability.find((slot) => slot.available)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {doctor.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-background rounded-full" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg text-foreground">{doctor.name}</h3>
                <p className="text-primary font-medium">{doctor.specialty}</p>
                <p className="text-sm text-muted-foreground">
                  {doctor.credentials.join(", ")} • {doctor.experience} years exp.
                </p>
              </div>
              <Badge variant={doctor.isOnline ? "default" : "secondary"} className="shrink-0">
                {doctor.isOnline ? "Online" : "Offline"}
              </Badge>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{doctor.rating}</span>
                <span className="text-sm text-muted-foreground">({doctor.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>${doctor.consultationFee}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>

        <div className="flex flex-wrap gap-1">
          {doctor.languages.map((language) => (
            <Badge key={language} variant="outline" className="text-xs">
              {language}
            </Badge>
          ))}
        </div>

        {nextAvailableSlot && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
            <Calendar className="h-4 w-4" />
            <span>
              Next available: {new Date(nextAvailableSlot.date).toLocaleDateString()} at {nextAvailableSlot.time}
            </span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => onViewProfile(doctor.id)}
          >
            View Profile
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onBookAppointment(doctor.id)}
            disabled={!nextAvailableSlot}
          >
            {nextAvailableSlot ? "Book Now" : "No Slots"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
