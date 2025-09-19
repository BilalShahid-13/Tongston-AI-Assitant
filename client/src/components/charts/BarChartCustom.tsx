import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { BaseChart } from "./BaseChart"

interface BarChartCustomProps {
  title: string
  data: any[]
  xKey: string
  yKey: string
  color?: string
}

export function BarChartCustom({
  title,
  data,
  xKey,
  yKey,
  color = "#3b82f6", // default Tailwind blue-500
}: BarChartCustomProps) {
  return (
    <BaseChart title={title}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            type="category"
            interval={0}              // show all categories
            angle={-30}               // rotate labels
            textAnchor="end"          // align properly
            height={60}               // extra space for rotated text
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey={yKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </BaseChart>
  )
}