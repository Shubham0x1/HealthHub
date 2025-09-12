// Mock symptom tracking data and logic
export interface SymptomEntry {
  id: string
  date: string
  symptom: string
  severity: number // 1-10 scale
  notes?: string
  triggers?: string[]
  medications?: string[]
  duration?: string // e.g., "2 hours", "all day"
  createdAt: Date
}

export interface SymptomSummary {
  symptom: string
  frequency: number
  averageSeverity: number
  lastOccurrence: string
  trend: "improving" | "worsening" | "stable"
}

export interface SymptomReport {
  dateRange: {
    start: string
    end: string
  }
  entries: SymptomEntry[]
  summary: SymptomSummary[]
  insights: string[]
}

// Common symptoms list
export const COMMON_SYMPTOMS = [
  "Headache",
  "Fatigue",
  "Nausea",
  "Dizziness",
  "Back Pain",
  "Joint Pain",
  "Muscle Pain",
  "Chest Pain",
  "Shortness of Breath",
  "Cough",
  "Fever",
  "Chills",
  "Sore Throat",
  "Runny Nose",
  "Congestion",
  "Stomach Pain",
  "Diarrhea",
  "Constipation",
  "Heartburn",
  "Anxiety",
  "Depression",
  "Insomnia",
  "Rash",
  "Itching",
  "Swelling",
]

export const COMMON_TRIGGERS = [
  "Stress",
  "Weather Change",
  "Lack of Sleep",
  "Certain Foods",
  "Exercise",
  "Alcohol",
  "Caffeine",
  "Hormonal Changes",
  "Allergies",
  "Dehydration",
  "Screen Time",
  "Poor Posture",
]

// Mock data storage
const mockSymptomEntries: SymptomEntry[] = [
  {
    id: "1",
    date: "2024-12-08",
    symptom: "Headache",
    severity: 6,
    notes: "Started after lunch, possibly stress-related",
    triggers: ["Stress", "Screen Time"],
    duration: "3 hours",
    createdAt: new Date("2024-12-08T14:30:00"),
  },
  {
    id: "2",
    date: "2024-12-07",
    symptom: "Fatigue",
    severity: 4,
    notes: "Mild tiredness throughout the day",
    triggers: ["Lack of Sleep"],
    duration: "all day",
    createdAt: new Date("2024-12-07T09:00:00"),
  },
  {
    id: "3",
    date: "2024-12-06",
    symptom: "Back Pain",
    severity: 7,
    notes: "Lower back pain, sharp when bending",
    triggers: ["Poor Posture"],
    duration: "4 hours",
    createdAt: new Date("2024-12-06T16:20:00"),
  },
  {
    id: "4",
    date: "2024-12-05",
    symptom: "Headache",
    severity: 3,
    notes: "Mild headache in the morning",
    triggers: ["Dehydration"],
    duration: "1 hour",
    createdAt: new Date("2024-12-05T08:15:00"),
  },
  {
    id: "5",
    date: "2024-12-04",
    symptom: "Anxiety",
    severity: 5,
    notes: "Work presentation anxiety",
    triggers: ["Stress"],
    duration: "2 hours",
    createdAt: new Date("2024-12-04T10:30:00"),
  },
]

export class SymptomTrackingService {
  static getAllEntries(): SymptomEntry[] {
    return mockSymptomEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  static getEntriesByDateRange(startDate: string, endDate: string): SymptomEntry[] {
    return mockSymptomEntries.filter((entry) => entry.date >= startDate && entry.date <= endDate)
  }

  static async addEntry(entry: Omit<SymptomEntry, "id" | "createdAt">): Promise<SymptomEntry> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newEntry: SymptomEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date(),
    }

    mockSymptomEntries.push(newEntry)
    return newEntry
  }

  static async updateEntry(id: string, updates: Partial<SymptomEntry>): Promise<SymptomEntry | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const index = mockSymptomEntries.findIndex((entry) => entry.id === id)
    if (index === -1) return null

    mockSymptomEntries[index] = { ...mockSymptomEntries[index], ...updates }
    return mockSymptomEntries[index]
  }

  static async deleteEntry(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const index = mockSymptomEntries.findIndex((entry) => entry.id === id)
    if (index === -1) return false

    mockSymptomEntries.splice(index, 1)
    return true
  }

  static generateSummary(entries: SymptomEntry[]): SymptomSummary[] {
    const symptomGroups = entries.reduce(
      (acc, entry) => {
        if (!acc[entry.symptom]) {
          acc[entry.symptom] = []
        }
        acc[entry.symptom].push(entry)
        return acc
      },
      {} as Record<string, SymptomEntry[]>,
    )

    return Object.entries(symptomGroups).map(([symptom, symptomEntries]) => {
      const frequency = symptomEntries.length
      const averageSeverity = symptomEntries.reduce((sum, entry) => sum + entry.severity, 0) / frequency
      const lastOccurrence = symptomEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
        .date

      // Simple trend calculation based on recent vs older entries
      const recentEntries = symptomEntries.filter(
        (entry) => new Date(entry.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
      )
      const olderEntries = symptomEntries.filter(
        (entry) => new Date(entry.date).getTime() <= Date.now() - 7 * 24 * 60 * 60 * 1000,
      )

      let trend: "improving" | "worsening" | "stable" = "stable"
      if (recentEntries.length > 0 && olderEntries.length > 0) {
        const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.severity, 0) / recentEntries.length
        const olderAvg = olderEntries.reduce((sum, entry) => sum + entry.severity, 0) / olderEntries.length
        if (recentAvg < olderAvg - 0.5) trend = "improving"
        else if (recentAvg > olderAvg + 0.5) trend = "worsening"
      }

      return {
        symptom,
        frequency,
        averageSeverity: Math.round(averageSeverity * 10) / 10,
        lastOccurrence,
        trend,
      }
    })
  }

  static generateReport(startDate: string, endDate: string): SymptomReport {
    const entries = this.getEntriesByDateRange(startDate, endDate)
    const summary = this.generateSummary(entries)

    // Generate insights
    const insights: string[] = []
    const totalEntries = entries.length
    const uniqueSymptoms = new Set(entries.map((e) => e.symptom)).size

    if (totalEntries > 0) {
      insights.push(`You logged ${totalEntries} symptom${totalEntries !== 1 ? "s" : ""} during this period.`)
      insights.push(`You experienced ${uniqueSymptoms} different type${uniqueSymptoms !== 1 ? "s" : ""} of symptoms.`)

      const mostCommon = summary.sort((a, b) => b.frequency - a.frequency)[0]
      if (mostCommon) {
        insights.push(`${mostCommon.symptom} was your most frequent symptom (${mostCommon.frequency} times).`)
      }

      const highSeverity = entries.filter((e) => e.severity >= 7)
      if (highSeverity.length > 0) {
        insights.push(`${highSeverity.length} symptom${highSeverity.length !== 1 ? "s" : ""} had high severity (7+).`)
      }

      // Trigger analysis
      const allTriggers = entries.flatMap((e) => e.triggers || [])
      const triggerCounts = allTriggers.reduce(
        (acc, trigger) => {
          acc[trigger] = (acc[trigger] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )
      const topTrigger = Object.entries(triggerCounts).sort(([, a], [, b]) => b - a)[0]
      if (topTrigger) {
        insights.push(
          `"${topTrigger[0]}" was identified as a trigger ${topTrigger[1]} time${topTrigger[1] !== 1 ? "s" : ""}.`,
        )
      }
    }

    return {
      dateRange: { start: startDate, end: endDate },
      entries,
      summary,
      insights,
    }
  }

  static exportToCSV(entries: SymptomEntry[]): string {
    const headers = ["Date", "Symptom", "Severity", "Duration", "Triggers", "Notes"]
    const rows = entries.map((entry) => [
      entry.date,
      entry.symptom,
      entry.severity.toString(),
      entry.duration || "",
      (entry.triggers || []).join("; "),
      entry.notes || "",
    ])

    return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
  }
}
