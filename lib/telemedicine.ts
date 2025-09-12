// Mock telemedicine data and booking logic
export interface Doctor {
  id: string
  name: string
  specialty: string
  credentials: string[]
  rating: number
  reviewCount: number
  experience: number // years
  languages: string[]
  availability: TimeSlot[]
  consultationFee: number
  avatar: string
  bio: string
  education: string[]
  certifications: string[]
  isOnline: boolean
}

export interface TimeSlot {
  id: string
  date: string
  time: string
  available: boolean
}

export interface Appointment {
  id: string
  doctorId: string
  patientId: string
  date: string
  time: string
  type: "video" | "phone" | "in-person"
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  notes?: string
  symptoms?: string
  createdAt: Date
}

export interface BookingRequest {
  doctorId: string
  date: string
  time: string
  type: "video" | "phone" | "in-person"
  symptoms: string
  notes?: string
}

// Mock doctors database
const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    credentials: ["MD", "FACC"],
    rating: 4.9,
    reviewCount: 127,
    experience: 12,
    languages: ["English", "Spanish"],
    availability: [
      { id: "1", date: "2024-12-10", time: "09:00", available: true },
      { id: "2", date: "2024-12-10", time: "10:30", available: true },
      { id: "3", date: "2024-12-10", time: "14:00", available: false },
      { id: "4", date: "2024-12-11", time: "09:00", available: true },
      { id: "5", date: "2024-12-11", time: "11:00", available: true },
    ],
    consultationFee: 150,
    avatar: "/doctor-sarah-johnson.jpg",
    bio: "Dr. Johnson is a board-certified cardiologist with over 12 years of experience treating heart conditions. She specializes in preventive cardiology and heart disease management.",
    education: ["Harvard Medical School", "Johns Hopkins Residency"],
    certifications: ["Board Certified in Cardiology", "Advanced Heart Failure Specialist"],
    isOnline: true,
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Dermatology",
    credentials: ["MD", "FAAD"],
    rating: 4.8,
    reviewCount: 89,
    experience: 8,
    languages: ["English", "Mandarin"],
    availability: [
      { id: "6", date: "2024-12-10", time: "11:00", available: true },
      { id: "7", date: "2024-12-10", time: "15:30", available: true },
      { id: "8", date: "2024-12-11", time: "10:00", available: true },
      { id: "9", date: "2024-12-12", time: "09:30", available: true },
    ],
    consultationFee: 120,
    avatar: "/doctor-michael-chen.jpg",
    bio: "Dr. Chen is a dermatologist specializing in medical and cosmetic dermatology. He has extensive experience in treating skin conditions and aesthetic procedures.",
    education: ["Stanford Medical School", "UCSF Dermatology Residency"],
    certifications: ["Board Certified in Dermatology", "Mohs Surgery Certified"],
    isOnline: false,
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Family Medicine",
    credentials: ["MD", "AAFP"],
    rating: 4.7,
    reviewCount: 203,
    experience: 15,
    languages: ["English", "Spanish", "Portuguese"],
    availability: [
      { id: "10", date: "2024-12-10", time: "08:00", available: true },
      { id: "11", date: "2024-12-10", time: "13:00", available: true },
      { id: "12", date: "2024-12-11", time: "08:30", available: true },
      { id: "13", date: "2024-12-11", time: "16:00", available: true },
    ],
    consultationFee: 100,
    avatar: "/doctor-emily-rodriguez.jpg",
    bio: "Dr. Rodriguez is a family medicine physician with 15 years of experience providing comprehensive healthcare for patients of all ages.",
    education: ["UCLA Medical School", "Kaiser Family Medicine Residency"],
    certifications: ["Board Certified in Family Medicine", "Geriatric Medicine Certificate"],
    isOnline: true,
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    credentials: ["MD", "AAOS"],
    rating: 4.6,
    reviewCount: 156,
    experience: 18,
    languages: ["English"],
    availability: [
      { id: "14", date: "2024-12-11", time: "12:00", available: true },
      { id: "15", date: "2024-12-11", time: "15:00", available: true },
      { id: "16", date: "2024-12-12", time: "10:00", available: true },
      { id: "17", date: "2024-12-12", time: "14:30", available: true },
    ],
    consultationFee: 180,
    avatar: "/doctor-james-wilson.jpg",
    bio: "Dr. Wilson is an orthopedic surgeon specializing in sports medicine and joint replacement. He has treated professional athletes and weekend warriors alike.",
    education: ["Mayo Clinic Medical School", "Hospital for Special Surgery Fellowship"],
    certifications: ["Board Certified in Orthopedic Surgery", "Sports Medicine Specialist"],
    isOnline: false,
  },
  {
    id: "5",
    name: "Dr. Lisa Park",
    specialty: "Mental Health",
    credentials: ["MD", "APA"],
    rating: 4.9,
    reviewCount: 94,
    experience: 10,
    languages: ["English", "Korean"],
    availability: [
      { id: "18", date: "2024-12-10", time: "16:00", available: true },
      { id: "19", date: "2024-12-10", time: "17:30", available: true },
      { id: "20", date: "2024-12-11", time: "13:30", available: true },
      { id: "21", date: "2024-12-12", time: "11:00", available: true },
    ],
    consultationFee: 140,
    avatar: "/doctor-lisa-park.jpg",
    bio: "Dr. Park is a psychiatrist specializing in anxiety, depression, and stress management. She takes a holistic approach to mental health treatment.",
    education: ["Columbia Medical School", "NYU Psychiatry Residency"],
    certifications: ["Board Certified in Psychiatry", "Cognitive Behavioral Therapy Certified"],
    isOnline: true,
  },
  {
    id: "6",
    name: "Dr. Robert Thompson",
    specialty: "Nutrition",
    credentials: ["MD", "RD"],
    rating: 4.8,
    reviewCount: 67,
    experience: 7,
    languages: ["English", "French"],
    availability: [
      { id: "22", date: "2024-12-10", time: "12:30", available: true },
      { id: "23", date: "2024-12-11", time: "09:30", available: true },
      { id: "24", date: "2024-12-11", time: "14:30", available: true },
      { id: "25", date: "2024-12-12", time: "08:00", available: true },
    ],
    consultationFee: 110,
    avatar: "/doctor-robert-thompson.jpg",
    bio: "Dr. Thompson is a physician and registered dietitian specializing in clinical nutrition and weight management programs.",
    education: ["University of Michigan Medical School", "Cornell Nutrition Program"],
    certifications: ["Board Certified in Internal Medicine", "Registered Dietitian"],
    isOnline: true,
  },
]

export class TelemedicineService {
  static getAllDoctors(): Doctor[] {
    return mockDoctors
  }

  static searchDoctors(query: string, specialty?: string): Doctor[] {
    let filtered = mockDoctors

    if (specialty && specialty !== "all") {
      filtered = filtered.filter((doctor) => doctor.specialty.toLowerCase() === specialty.toLowerCase())
    }

    if (query) {
      const searchTerm = query.toLowerCase()
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm) ||
          doctor.specialty.toLowerCase().includes(searchTerm) ||
          doctor.bio.toLowerCase().includes(searchTerm),
      )
    }

    return filtered.sort((a, b) => b.rating - a.rating)
  }

  static getDoctorById(id: string): Doctor | null {
    return mockDoctors.find((doctor) => doctor.id === id) || null
  }

  static getAvailableSlots(doctorId: string, date?: string): TimeSlot[] {
    const doctor = this.getDoctorById(doctorId)
    if (!doctor) return []

    let slots = doctor.availability.filter((slot) => slot.available)

    if (date) {
      slots = slots.filter((slot) => slot.date === date)
    }

    return slots.sort((a, b) => new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime())
  }

  static async bookAppointment(
    request: BookingRequest,
  ): Promise<{ success: boolean; appointment?: Appointment; error?: string }> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const doctor = this.getDoctorById(request.doctorId)
    if (!doctor) {
      return { success: false, error: "Doctor not found" }
    }

    const slot = doctor.availability.find((s) => s.date === request.date && s.time === request.time && s.available)
    if (!slot) {
      return { success: false, error: "Time slot not available" }
    }

    // Mark slot as unavailable
    slot.available = false

    const appointment: Appointment = {
      id: Date.now().toString(),
      doctorId: request.doctorId,
      patientId: "current-user", // In real app, get from auth
      date: request.date,
      time: request.time,
      type: request.type,
      status: "scheduled",
      symptoms: request.symptoms,
      notes: request.notes,
      createdAt: new Date(),
    }

    return { success: true, appointment }
  }

  static getSpecialties(): string[] {
    const specialties = [...new Set(mockDoctors.map((doctor) => doctor.specialty))]
    return specialties.sort()
  }
}
