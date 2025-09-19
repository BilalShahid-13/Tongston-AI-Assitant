import type React from "react"
import {
  ResponsiveContainer
} from "recharts"

interface BaseChartProps {
  title: string
  children: React.ReactElement
  height?: number
}

export function BaseChart({ title, children, height = 300 }: BaseChartProps) {
  return (
    <div className="bg-white shadow rounded-2xl p-4">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}
