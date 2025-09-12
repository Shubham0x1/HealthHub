"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Edit, Trash2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import type { SymptomEntry } from "@/lib/symptoms"
import { cn } from "@/lib/utils"

interface SymptomTimelineProps {
  entries: SymptomEntry[]
  onEdit?: (entry: SymptomEntry) => void
  onDelete?: (id: string) => void
}

export function SymptomTimeline({ entries, onEdit, onDelete }: SymptomTimelineProps) {
  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return "bg-green-100 text-green-800 border-green-200"
    if (severity <= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getSeverityLabel = (severity: number) => {
    if (severity <= 2) return "Mild"
    if (severity <= 4) return "Mild-Moderate"
    if (severity <= 6) return "Moderate"
    if (severity <= 8) return "Severe"
    return "Very Severe"
  }

  const groupedEntries = entries.reduce(
    (acc, entry) => {
      const date = entry.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(entry)
      return acc
    },
    {} as Record<string, SymptomEntry[]>,
  )

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No symptoms logged yet</h3>
          <p className="text-muted-foreground">Start tracking your symptoms to identify patterns and trends.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((date, dateIndex) => (
        <Card key={date}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{format(parseISO(date), "EEEE, MMMM d, yyyy")}</CardTitle>
            </div>
            <CardDescription>{groupedEntries[date].length} symptom(s) logged</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {groupedEntries[date]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((entry, entryIndex) => (
                <div key={entry.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Symptom Header */}
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-lg">{entry.symptom}</h4>
                        <Badge className={cn("border", getSeverityColor(entry.severity))}>
                          {entry.severity}/10 - {getSeverityLabel(entry.severity)}
                        </Badge>
                        {entry.duration && (
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {entry.duration}
                          </Badge>
                        )}
                      </div>

                      {/* Notes */}
                      {entry.notes && <p className="text-muted-foreground">{entry.notes}</p>}

                      {/* Triggers */}
                      {entry.triggers && entry.triggers.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Possible Triggers:</p>
                          <div className="flex flex-wrap gap-1">
                            {entry.triggers.map((trigger) => (
                              <Badge key={trigger} variant="secondary" className="text-xs">
                                {trigger}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Medications */}
                      {entry.medications && entry.medications.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Medications Taken:</p>
                          <div className="flex flex-wrap gap-1">
                            {entry.medications.map((medication) => (
                              <Badge key={medication} variant="outline" className="text-xs">
                                {medication}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      <p className="text-xs text-muted-foreground">Logged at {format(entry.createdAt, "h:mm a")}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      {onEdit && (
                        <Button variant="ghost" size="icon" onClick={() => onEdit(entry)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="ghost" size="icon" onClick={() => onDelete(entry.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {entryIndex < groupedEntries[date].length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
