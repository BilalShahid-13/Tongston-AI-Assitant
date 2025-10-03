import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface BarChartCustomProps {
  title: string
  description?: string
  data: { name: string; count: number }[]
  xKey: string
  yKey: string
  showYAxis?: boolean // NEW PROP
  chartColor?: string
  yaxisDomain?: [number, number]
  xAxisAngle?: number
}

const schoolLevelColors: Record<string, string> = {
  Nursery: "#F5C242",     // yellow
  Primary: "#E04A2F",     // red
  Secondary: "#111111",   // black/dark
  University: "#707070",  // grey
}

export function BarChartCustom({
  title,
  description,
  data,
  xKey,
  yKey,
  showYAxis = true, // default show
  chartColor,
  yaxisDomain,
  xAxisAngle = 0
}: BarChartCustomProps) {
  // config for ChartContainer
  const chartConfig: ChartConfig = {
    [yKey]: {
      label: yKey,
      color: "var(--chart-1)", // fallback
    },
  }

  return (
    <Card >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data} >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={0}
              angle={xAxisAngle}
              dy={10} // pushes labels downward
              textAnchor="middle"
            />

            {showYAxis && <YAxis domain={yaxisDomain} allowDecimals={false} />}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey={yKey} radius={8}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColor ? chartColor : schoolLevelColors[entry.name] || "#CCCCCC"} // fallback grey
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
