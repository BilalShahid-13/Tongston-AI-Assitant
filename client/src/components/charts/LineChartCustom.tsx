import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { BaseChart } from "./BaseChart"

interface LineChartCustomProps {
  title: string
  data: any[]
  xKey: string
  lines: { key: string; color: string }[]
}

export function LineChartCustom({
  title,
  data,
  xKey,
  lines,
}: LineChartCustomProps) {
  return (
    <BaseChart title={title}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
          />
        ))}
      </LineChart>
    </BaseChart>
  )
}
