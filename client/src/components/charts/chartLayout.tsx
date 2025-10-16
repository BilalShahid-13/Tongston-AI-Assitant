import type { CharListType } from "@/types"
import { useState } from "react"
import { DashboardCustomSelect } from "../dashboardCustomSelect"
import { BarChartCustom } from "./BarChartCustom"
import { BarChartStacked } from "./BarChartStack"

interface ChartLayoutProp {
  planChartList: CharListType // ✅ Changed from planChart to planChartList
}

export default function ChartLayout({ planChartList }: ChartLayoutProp) {
  const [selectedChart, setSelectedChart] = useState("discipline")

  // ✅ Find the selected chart
  const planChart = planChartList.find((c) => c.key === selectedChart)

  return (
    <>
      <div className="flex justify-end">
        <DashboardCustomSelect
          value={selectedChart}
          onValueChange={setSelectedChart}
          items={planChartList.map((c) => ({ label: c.key, value: c.key }))} // ✅ Use planChartList
        />
      </div>
      {planChart && (
        <div className="w-6xl">
          {planChart.type === "bar" && "yKey" in planChart && ( // ✅ Type guard
            <BarChartCustom
              title={planChart.title}
              description={planChart.description}
              data={planChart.data}
              xKey={planChart.xKey}
              yKey={planChart.yKey}
              yaxisDomain={planChart.yaxisDomain} // ✅ No casting needed
              chartColor={planChart.chartColor}
            />
          )}
          {planChart.type === "stacked" && "stackKeys" in planChart && ( // ✅ Type guard
            <BarChartStacked
              title={planChart.title}
              description={planChart.description}
              data={planChart.data}
              xKey={planChart.xKey}
              stackKeys={planChart.stackKeys}
              colors={planChart.colors}
            />
          )}
        </div>
      )}
    </>
  )
}