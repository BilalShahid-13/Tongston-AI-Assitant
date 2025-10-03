import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type DomainValue = number | "auto" | "dataMin" | "dataMax"
type DomainTuple = [DomainValue, DomainValue]

interface BarChartCustomProps {
  title: string
  description?: string
  data: { name: string; count?: number }[] // count is optional too
  xKey: string
  yKey?: string  // now optional
  showYAxis?: boolean
  chartColor?: string
  yaxisDomain?: DomainTuple  // 👈 now accepts both
  xAxisAngle?: number
}

const schoolLevelColors: Record<string, string> = {
  Nursery: "#F5C242",
  Primary: "#E04A2F",
  Secondary: "#111111",
  University: "#707070",
}

export function BarChartCustom({
  title,
  description,
  data,
  xKey,
  yKey,
  showYAxis = true,
  chartColor,
  yaxisDomain,
  xAxisAngle = 0,
}: BarChartCustomProps) {
  const chartConfig: ChartConfig = yKey
    ? {
      [yKey]: {
        label: yKey,
        color: "var(--chart-1)",
      },
    }
    : {}

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        </div>
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
              interval={0}
              angle={xAxisAngle}
              dy={10}
              textAnchor="middle"
            />

            {showYAxis && yKey && (
              <YAxis
                // domain={["auto","auto"]} // only applies if passed
                domain={yaxisDomain ?? ["auto", "auto"]}
                allowDecimals={false}
              />
            )}


            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            {yKey && (
              <Bar dataKey={yKey} radius={8}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      chartColor
                        ? chartColor
                        : schoolLevelColors[entry.name] || "#CCCCCC"
                    }
                  />
                ))}
              </Bar>
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
