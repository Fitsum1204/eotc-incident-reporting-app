"use client"

import { PieChart, Pie, Cell, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function VerificationChart({
  verified,
  rejected,
  pending,
}: {
  verified: number
  rejected: number
  pending: number
}) {
  const data = [
    { name: "Verified", value: verified },
    { name: "Rejected", value: rejected },
    { name: "Pending", value: pending },
  ]

  const COLORS = ["#22c55e", "#ef4444", "#eab308"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Status</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <PieChart width={250} height={250}>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </CardContent>
    </Card>
  )
}
