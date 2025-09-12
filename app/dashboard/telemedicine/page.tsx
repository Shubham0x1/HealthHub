"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DoctorCard } from "@/components/telemedicine/doctor-card"
import { DoctorProfile } from "@/components/telemedicine/doctor-profile"
import { BookingModal } from "@/components/telemedicine/booking-modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Stethoscope, Users, Clock, Star } from "lucide-react"
import { TelemedicineService, type Doctor, type Appointment } from "@/lib/telemedicine"
import { useToast } from "@/hooks/use-toast"

function TelemedicineContent() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "profile">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null)
  const { toast } = useToast()

  const specialties = TelemedicineService.getSpecialties()

  useEffect(() => {
    const allDoctors = TelemedicineService.getAllDoctors()
    setDoctors(allDoctors)
    setFilteredDoctors(allDoctors)
  }, [])

  useEffect(() => {
    const filtered = TelemedicineService.searchDoctors(searchQuery, selectedSpecialty)
    setFilteredDoctors(filtered)
  }, [searchQuery, selectedSpecialty])

  const handleViewProfile = (doctorId: string) => {
    const doctor = TelemedicineService.getDoctorById(doctorId)
    if (doctor) {
      setSelectedDoctor(doctor)
      setViewMode("profile")
    }
  }

  const handleBookAppointment = (doctorId: string) => {
    const doctor = TelemedicineService.getDoctorById(doctorId)
    if (doctor) {
      setBookingDoctor(doctor)
      setIsBookingModalOpen(true)
    }
  }

  const handleBookingSuccess = (appointment: Appointment) => {
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${bookingDoctor?.name} has been confirmed.`,
    })
    setIsBookingModalOpen(false)
    setBookingDoctor(null)
  }

  const handleBackToList = () => {
    setViewMode("list")
    setSelectedDoctor(null)
  }

  const stats = [
    {
      title: "Available Doctors",
      value: doctors.length.toString(),
      description: "Specialists ready to help",
      icon: Users,
    },
    {
      title: "Specialties",
      value: specialties.length.toString(),
      description: "Medical specializations",
      icon: Stethoscope,
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      description: "Patient satisfaction",
      icon: Star,
    },
    {
      title: "Response Time",
      value: "< 2 min",
      description: "Average wait time",
      icon: Clock,
    },
  ]

  if (viewMode === "profile" && selectedDoctor) {
    return (
      <DashboardLayout>
        <DoctorProfile
          doctor={selectedDoctor}
          onBack={handleBackToList}
          onBookAppointment={() => handleBookAppointment(selectedDoctor.id)}
        />
        <BookingModal
          doctor={bookingDoctor}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false)
            setBookingDoctor(null)
          }}
          onSuccess={handleBookingSuccess}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Telemedicine</h1>
          <p className="text-muted-foreground mt-1">Connect with healthcare specialists from anywhere</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find a Doctor
            </CardTitle>
            <CardDescription>Search by name, specialty, or condition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search doctors, specialties, or conditions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")} className="ml-1 hover:bg-muted-foreground/20 rounded">
                    ×
                  </button>
                </Badge>
              )}
              {selectedSpecialty !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Specialty: {selectedSpecialty}
                  <button
                    onClick={() => setSelectedSpecialty("all")}
                    className="ml-1 hover:bg-muted-foreground/20 rounded"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {filteredDoctors.length} Doctor{filteredDoctors.length !== 1 ? "s" : ""} Available
            </h2>
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onViewProfile={handleViewProfile}
                  onBookAppointment={handleBookAppointment}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse all available doctors.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedSpecialty("all")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <BookingModal
        doctor={bookingDoctor}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false)
          setBookingDoctor(null)
        }}
        onSuccess={handleBookingSuccess}
      />
    </DashboardLayout>
  )
}

export default function TelemedicinePage() {
  return (
    <AuthProvider>
      <TelemedicineContent />
    </AuthProvider>
  )
}
