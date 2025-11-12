import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { BaseChart } from "./BaseChart"

interface LineChartCustomProps {
  title: string
  data: any[]
  xKey: string
  lines: { key: string; color: string }[]
  description:string
}

export function LineChartCustom({
  title,
  data,
  xKey,
  lines,
  description
}: LineChartCustomProps) {
  return (
    <BaseChart title={title}>
      <LineChart data={data}>
         <div className="max-w-4xl">
          {/* <CardTitle>{title}</CardTitle> */}
          {description && <p>{description}</p>}
        </div>
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
