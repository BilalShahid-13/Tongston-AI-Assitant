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
import { useEffect, useRef, useState, useMemo } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "../ui/button"

const schoolLevelColors: Record<string, string> = {
  Nursery: "#F5C242",
  Primary: "#E04A2F",
  Secondary: "#111111",
  University: "#707070",
}

interface entryProp {
  name: string
  count?: number | undefined
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

  const increment = 20
  const minWidth = 40
  const maxWidth = 120
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // ✅ Default width depends on dataset
  const defaultWidth = useMemo(() => (data.length > 6 ? 40 : 60), [data.length])
  const [barWidth, setBarWidth] = useState(defaultWidth)

  // ✅ Smooth scroll when zooming for large datasets
  useEffect(() => {
    if (scrollRef.current && data.length > 6) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: "smooth",
      })
    }
  }, [barWidth, data.length])

  const handleZoomIn = () =>
    setBarWidth((prev) => Math.min(prev + increment, maxWidth))
  const handleZoomOut = () =>
    setBarWidth((prev) => Math.max(prev - increment, minWidth))

  const truncateLabel = (value: string) =>
    value?.length > 30 ? `${value.slice(0, 8)}…` : value

  // ✅ If data > 6 → make it scrollable; else responsive
  const isScrollable = data.length > 6
  const chartWidth: number | string = isScrollable
    ? data.length * barWidth * 2
    : "100%"
  // Math.max(data.length * barWidth * 2, 500) // allow zoom even if <6

  return (
    <Card>
      <CardHeader className="flex flex-row-reverse gap-4 justify-between items-center">
        <div className="flex justify-between items-center select-none">
          <div className="flex gap-2 justify-center items-center">
            <Button
              variant="outline"
              onClick={handleZoomOut}
              disabled={barWidth === minWidth}
              className="px-2 py-1 text-sm border rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              Zoom {barWidth}px
            </span>
            <Button
              variant="outline"
              onClick={handleZoomIn}
              disabled={barWidth === maxWidth}
              className="px-2 py-1 text-sm border rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="max-w-4xl">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </CardHeader>

      <CardContent>
        <div
          ref={scrollRef}
          className={`${isScrollable ? "overflow-x-auto" : "overflow-x-hidden"}
    overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-md`}
          style={{
            height: "500px", // 🔒 fixed chart area height
          }}
        >
            <div
              style={{
                width: isScrollable ? `${chartWidth}px` : "100%",
                height: "100%",
              }}
            >
              <ChartContainer
                config={chartConfig}
                className="w-full"
                style={{ height: "100%" }} // fixed height
              >
                <BarChart
                  data={data}
                  width={typeof chartWidth === "string" ? 600 : chartWidth}
                  height={500} // 🔒 fixed height for chart itself
                  margin={{ top: 10, right: 20, bottom: 20, left: 40 }}
                >
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
                    tick={({ x, y, payload }) => (
                      <g transform={`translate(${x},${y})`}>
                        <title>{payload.value}</title>
                        <text dy={10} textAnchor="middle" fontSize={10} fill="#555">
                          {truncateLabel(payload.value)}
                        </text>
                      </g>
                    )}
                  />
                  {showYAxis && yKey && (
                    <YAxis domain={yaxisDomain ?? ["auto", "auto"]} allowDecimals={false} />
                  )}
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  {yKey && (
                    <Bar dataKey={yKey} radius={8} barSize={barWidth}>
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
            </div>
          </div>
      </CardContent>

    </Card>
  )
}
