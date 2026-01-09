"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TrendPoint = {
  date: string
  count: number
}

function groupByDate(dates: string[]): TrendPoint[] {
  const map: Record<string, number> = {}

  dates.forEach((date) => {
    const day = date.split("T")[0] // YYYY-MM-DD
    map[day] = (map[day] || 0) + 1
  })

  return Object.entries(map)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function IncidentsTrendChart({
  dates,
}: {
  dates: string[]
}) {
  const data = groupByDate(dates)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidents Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
