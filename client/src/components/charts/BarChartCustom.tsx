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
import type { BarChartCustomProps } from "@/types"

const schoolLevelColors: Record<string, string> = {
  Nursery: "#F5C242",
  Primary: "#E04A2F",
  Secondary: "#111111",
  University: "#707070",
}

interface entryProp {
  name: string;
  count?: number | undefined;
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
                {data.map((entry: entryProp, index: number) => (
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
