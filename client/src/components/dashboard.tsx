import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { motion } from "framer-motion"
import {
  CalendarClock,
  Package,
  Users
} from "lucide-react"

// import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { backendApi } from "@/lib/constant"
import { parseLessonMetadata } from "@/lib/data-parser"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Error, Loader } from "./Loader"

// Function to fetch analytics data
async function fetchAnalyticsData() {
  const { data } = await axios.get(`${backendApi}/api/getPlanFiles`)
  return data
}

// Function to process raw data for charts
function processChartData(rawData: any) {
  const subjects: Record<string, number> = {}
  const bloomLevels: Record<string, number> = {}
  const schoolLevels: Record<string, number> = {}
  const classSizes: Record<string, number> = {}

  rawData.data.forEach((item: any) => {
    const metadata = parseLessonMetadata(item.answer)

    // Subject & Discipline
    const subject = metadata["Subject & Discipline"]
    if (subject) {
      subjects[subject] = (subjects[subject] || 0) + 1
    }

    // Bloom's Taxonomy Level
    const bloomLevel = metadata["Bloom’s Taxonomy Level"]
    if (bloomLevel) {
      bloomLevels[bloomLevel] = (bloomLevels[bloomLevel] || 0) + 1
    }

    // School Level
    const schoolLevel = metadata["School Level"]
    if (schoolLevel) {
      schoolLevels[schoolLevel] = (schoolLevels[schoolLevel] || 0) + 1
    }

    // Class Size (handling ranges by taking the first number or the range itself as a category)
    const classSize = metadata["Class Size"]
    if (classSize) {
      classSizes[classSize] = (classSizes[classSize] || 0) + 1
    }
  })
  return {
    subjects: Object.entries(subjects).map(([name, count]) => ({
      name,
      count,
    })),
    bloomLevels: Object.entries(bloomLevels).map(([name, count]) => ({
      name,
      count,
    })),
    schoolLevels: Object.entries(schoolLevels).map(([name, count]) => ({
      name,
      count,
    })),
    classSizes: Object.entries(classSizes).map(([name, count]) => ({
      name,
      count,
    })),
  }
}

export default function AnalyticsDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analyticsData"],
    queryFn: fetchAnalyticsData,
  })

  const chartData = data ? processChartData(data) : null

  if (isLoading) {
    return (
      <Loader />
    )
  }

  if (isError) {
    return (
      <Error />
    )
  }

  return (
    <div className="min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Subject Lesson Plans</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.count || 0}</div>
                  <p className="text-xs text-muted-foreground">Total plans generated</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Unique Teachers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Set(data?.data.map((item: any) => item.userId.username)).size || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Teachers using the platform</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Time Available</CardTitle>
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {chartData?.subjects.length
                      ? // Calculate average time available if data exists
                      (
                        data?.data.reduce((sum: number, item: any) => {
                          const metadata = parseLessonMetadata(item.answer)
                          const timeStr = metadata["Time Available"]
                          const match = timeStr ? timeStr.match(/(\d+)\s*minutes/) : null
                          return sum + (match ? Number.parseInt(match[1]) : 0)
                        }, 0) / data?.data.length
                      ).toFixed(0) + " min"
                      : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">Average lesson duration</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Number of Teachers Year to Date</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {chartData?.subjects.length
                      ? // Calculate average class size if data exists
                      (
                        data?.data.reduce((sum: number, item: any) => {
                          const metadata = parseLessonMetadata(item.answer)
                          const sizeStr = metadata["Class Size"]
                          const match = sizeStr ? sizeStr.match(/(\d+)-?(\d+)?/) : null
                          if (match) {
                            const min = Number.parseInt(match[1])
                            const max = match[2] ? Number.parseInt(match[2]) : min
                            return sum + (min + max) / 2
                          }
                          return sum
                        }, 0) / data?.data.length
                      ).toFixed(0)
                      : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">Average students per class</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardDescription>Lesson Plans by Subject</CardDescription>
                  <CardTitle>Subject Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData?.subjects && chartData.subjects.length > 0 ? (
                    <ChartContainer
                      config={{
                        count: {
                          label: "Count",
                          color: "#ffb900", // Using k12-primary
                        },
                      }}
                      className="aspect-[4/3] h-[250px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.subjects}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} className="text-xs" />
                          <YAxis tickLine={false} axisLine={false} className="text-xs" />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                          <Bar dataKey="count" fill="var(--color-count)" radius={8} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                      No subject data available.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardDescription>Lesson Plans by Bloom's Taxonomy Level</CardDescription>
                  <CardTitle>Bloom's Level Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData?.bloomLevels && chartData.bloomLevels.length > 0 ? (
                    <ChartContainer
                      config={{
                        count: {
                          label: "Count",
                          color: "#fe9a00", // Using k12-secondary
                        },
                      }}
                      className="aspect-[4/3] h-[250px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.bloomLevels}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} className="text-xs" />
                          <YAxis tickLine={false} axisLine={false} className="text-xs" />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                          <Bar dataKey="count" fill="var(--color-count)" radius={8} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                      No Bloom's Level data available.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardDescription>Lesson Plans by School Level</CardDescription>
                  <CardTitle>School Level Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  {chartData?.schoolLevels && chartData.schoolLevels.length > 0 ? (
                    <ChartContainer
                      config={{
                        count: {
                          label: "Count",
                          color: "#ffb900", // Using k12-primary
                        },
                      }}
                      className="aspect-square h-[250px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="name" />} />
                          <Pie
                            data={chartData.schoolLevels}
                            dataKey="count"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={80}
                            fill="hsl(var(--color-count))" // Use var(--color-count) to pick from config
                            label
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                      No school level data available.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardDescription>Lesson Plans by Class Size</CardDescription>
                  <CardTitle>Class Size Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData?.classSizes && chartData.classSizes.length > 0 ? (
                    <ChartContainer
                      config={{
                        count: {
                          label: "Count",
                          color: "#fe9a00", // Using k12-secondary
                        },
                      }}
                      className="aspect-[4/3] h-[250px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.classSizes}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} className="text-xs" />
                          <YAxis tickLine={false} axisLine={false} className="text-xs" />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                          <Bar dataKey="count" fill="var(--color-count)" radius={8} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                      No class size data available.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
