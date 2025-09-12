"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Video, Phone, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import type { Doctor, TimeSlot, BookingRequest, Appointment } from "@/lib/telemedicine"
import { TelemedicineService } from "@/lib/telemedicine"

interface BookingModalProps {
  doctor: Doctor | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (appointment: Appointment) => void
}

export function BookingModal({ doctor, isOpen, onClose, onSuccess }: BookingModalProps) {
  const [step, setStep] = useState<"datetime" | "details" | "confirmation">("datetime")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>()
  const [consultationType, setConsultationType] = useState<"video" | "phone" | "in-person">("video")
  const [symptoms, setSymptoms] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [bookedAppointment, setBookedAppointment] = useState<Appointment>()

  const availableSlots = doctor
    ? TelemedicineService.getAvailableSlots(doctor.id, selectedDate?.toISOString().split("T")[0])
    : []

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedSlot(undefined)
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
  }

  const handleNext = () => {
    if (step === "datetime" && selectedDate && selectedSlot) {
      setStep("details")
    }
  }

  const handleBack = () => {
    if (step === "details") {
      setStep("datetime")
    } else if (step === "confirmation") {
      setStep("details")
    }
  }

  const handleBooking = async () => {
    if (!doctor || !selectedDate || !selectedSlot) return

    setIsLoading(true)
    setError("")

    const request: BookingRequest = {
      doctorId: doctor.id,
      date: selectedSlot.date,
      time: selectedSlot.time,
      type: consultationType,
      symptoms,
      notes,
    }

    try {
      const result = await TelemedicineService.bookAppointment(request)
      if (result.success && result.appointment) {
        setBookedAppointment(result.appointment)
        setStep("confirmation")
      } else {
        setError(result.error || "Booking failed")
      }
    } catch (err) {
      setError("An error occurred while booking")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (bookedAppointment) {
      onSuccess(bookedAppointment)
    }
    // Reset state
    setStep("datetime")
    setSelectedDate(undefined)
    setSelectedSlot(undefined)
    setConsultationType("video")
    setSymptoms("")
    setNotes("")
    setError("")
    setBookedAppointment(undefined)
    onClose()
  }

  if (!doctor) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "confirmation" ? "Appointment Confirmed" : `Book Appointment with ${doctor.name}`}
          </DialogTitle>
          <DialogDescription>
            {step === "datetime" && "Select your preferred date and time"}
            {step === "details" && "Provide consultation details"}
            {step === "confirmation" && "Your appointment has been successfully booked"}
          </DialogDescription>
        </DialogHeader>

        {step === "datetime" && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Calendar */}
              <div>
                <Label className="text-base font-medium">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                  className="rounded-md border"
                />
              </div>

              {/* Time Slots */}
              <div>
                <Label className="text-base font-medium">Available Times</Label>
                {selectedDate ? (
                  <div className="space-y-2 mt-2">
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSlotSelect(slot)}
                            className="justify-center"
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No available slots for this date</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">Please select a date first</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleNext} disabled={!selectedDate || !selectedSlot}>
                Next
              </Button>
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="space-y-6">
            {/* Selected DateTime Summary */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Selected Appointment</h4>
              <p className="text-sm text-muted-foreground">
                {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedSlot?.time}
              </p>
            </div>

            {/* Consultation Type */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Consultation Type</Label>
              <RadioGroup value={consultationType} onValueChange={(value: any) => setConsultationType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer">
                    <Video className="h-4 w-4" />
                    Video Call
                    <Badge variant="secondary">Recommended</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone" className="flex items-center gap-2 cursor-pointer">
                    <Phone className="h-4 w-4" />
                    Phone Call
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Symptoms */}
            <div className="space-y-2">
              <Label htmlFor="symptoms" className="text-base font-medium">
                Symptoms or Reason for Visit *
              </Label>
              <Textarea
                id="symptoms"
                placeholder="Please describe your symptoms or the reason for this consultation..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-base font-medium">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional information you'd like the doctor to know..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleBooking} disabled={!symptoms.trim() || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  `Book Appointment - $${doctor.consultationFee}`
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "confirmation" && bookedAppointment && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-600">Appointment Confirmed!</h3>
              <p className="text-muted-foreground mt-1">Your appointment has been successfully booked.</p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg text-left">
              <h4 className="font-medium mb-3">Appointment Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span>{doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{format(new Date(bookedAppointment.date), "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span>{bookedAppointment.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="capitalize">{bookedAppointment.type.replace("-", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee:</span>
                  <span>${doctor.consultationFee}</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>You will receive a confirmation email with meeting details shortly.</p>
              <p>Please join the consultation 5 minutes before your scheduled time.</p>
            </div>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
