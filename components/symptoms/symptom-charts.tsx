"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import type { SymptomEntry, SymptomSummary } from "@/lib/symptoms"
import { format, parseISO, subDays } from "date-fns"

interface SymptomChartsProps {
  entries: SymptomEntry[]
  summary: SymptomSummary[]
}

export function SymptomCharts({ entries, summary }: SymptomChartsProps) {
  // Prepare data for severity trend chart
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    const dateStr = format(date, "yyyy-MM-dd")
    const dayEntries = entries.filter((entry) => entry.date === dateStr)
    const avgSeverity =
      dayEntries.length > 0 ? dayEntries.reduce((sum, entry) => sum + entry.severity, 0) / dayEntries.length : null

    return {
      date: dateStr,
      displayDate: format(date, "MMM d"),
      severity: avgSeverity ? Math.round(avgSeverity * 10) / 10 : null,
      count: dayEntries.length,
    }
  })

  // Prepare data for symptom frequency chart
  const symptomFrequency = summary
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 8)
    .map((item) => ({
      symptom: item.symptom.length > 12 ? item.symptom.substring(0, 12) + "..." : item.symptom,
      frequency: item.frequency,
      avgSeverity: item.averageSeverity,
    }))

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingDown className="h-4 w-4 text-green-600" />
      case "worsening":
        return <TrendingUp className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600 bg-green-50 border-green-200"
      case "worsening":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Severity Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Severity Trend (Last 30 Days)</CardTitle>
          <CardDescription>Average daily symptom severity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last30Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(label, payload) => {
                  const data = payload?.[0]?.payload
                  return data ? format(parseISO(data.date), "EEEE, MMMM d") : label
                }}
                formatter={(value: any, name: string) => [value ? `${value}/10` : "No data", "Avg Severity"]}
              />
              <Line
                type="monotone"
                dataKey="severity"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Symptom Frequency Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Symptom Frequency</CardTitle>
          <CardDescription>Most common symptoms in your history</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={symptomFrequency} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="symptom" tick={{ fontSize: 12 }} width={80} />
              <Tooltip formatter={(value: any, name: string) => [`${value} times`, "Frequency"]} />
              <Bar dataKey="frequency" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Symptom Summary</CardTitle>
          <CardDescription>Overview of your tracked symptoms and trends</CardDescription>
        </CardHeader>
        <CardContent>
          {summary.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {summary.slice(0, 6).map((item) => (
                <div key={item.symptom} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{item.symptom}</h4>
                    <Badge className={`border ${getTrendColor(item.trend)}`}>
                      {getTrendIcon(item.trend)}
                      <span className="ml-1 capitalize">{item.trend}</span>
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Frequency</p>
                      <p className="font-medium">{item.frequency} times</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Severity</p>
                      <p className="font-medium">{item.averageSeverity}/10</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Last: {format(parseISO(item.lastOccurrence), "MMM d")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No symptom data available. Start logging symptoms to see your summary.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
