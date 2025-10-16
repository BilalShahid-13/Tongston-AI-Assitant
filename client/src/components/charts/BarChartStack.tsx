import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { BarChartStackedProps } from "@/types"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

export function BarChartStacked({
  title,
  description,
  data,
  xKey,
  stackKeys,
  colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"],
  showYAxis = true,
}: BarChartStackedProps) {
  // config for legend
  const chartConfig: ChartConfig = stackKeys.reduce((acc:any, key:any, i:any) => {
    acc[key] = { label: key, color: colors[i] || "var(--chart-1)" }
    return acc
  }, {} as ChartConfig)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            {showYAxis && <YAxis allowDecimals={false} />}
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            {stackKeys.map((key:any, i:any) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="stack"
                fill={colors[i] || "var(--chart-1)"}
                radius={i === stackKeys.length - 1 ? [4, 4, 0, 0] : undefined}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
