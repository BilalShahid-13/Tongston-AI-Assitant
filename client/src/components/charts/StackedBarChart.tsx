import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { BaseChart } from "./BaseChart"

interface StackedBarChartProps {
  title: string
  data: any[]
  xKey: string
  stacks: { key: string; color: string }[]
}

export function StackedBarChart({
  title,
  data,
  xKey,
  stacks,
}: StackedBarChartProps) {
  return (
    <BaseChart title={title}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {stacks.map((stack) => (
          <Bar
            key={stack.key}
            dataKey={stack.key}
            stackId="a"
            fill={stack.color}
          />
        ))}
      </BarChart>
    </BaseChart>
  )
}
