import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { BookOpen, ClipboardCheck, FileText, FolderOpen, Settings, User, Users, Download, Filter } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { backendApi } from "@/lib/constant"
import { parseLessonMetadata } from "@/lib/data-parser"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { Loader } from "./Loader"

// Plan type mappings
const PLAN_TYPE_MAPPING = {
  subjectLessonPlan: "Subject Lesson Plans",
  subjectAssessmentPlan: "Subject Assessments",
  studentConductCharacterPlan: "Student Conduct & Character Lesson Plans",
  studentConductCharacterAssessmentPlan: "Student Conduct & Character Assessments",
  projectTaskPlan: "Project (Tasks)",
  projectTaskFacilitationPlan: "Project (Tasks) Facilitation Plans",
  reportGenerator: "Lesson Plan Marking & Reports",
}

const FILTER_BUTTONS = [
  {
    key: "subjectLessonPlan",
    label: "Subject Lesson Plans",
    icon: BookOpen,
    color: "from-[#ffb900] to-[#fe9a00]",
  },
  {
    key: "subjectAssessmentPlan",
    label: "Subject Assessments",
    icon: ClipboardCheck,
    color: "from-[#E04A2F] to-[#ff6b4a]",
  },
  {
    key: "studentConductCharacterAssessmentPlan",
    label: "Student Conduct & Character Assessments",
    icon: Users,
    color: "from-[#111111] to-[#333333]",
  },
  {
    key: "projectTaskPlan",
    label: "Project (Tasks)",
    icon: FolderOpen,
    color: "from-[#F5C242] to-[#ffd700]",
  },
  {
    key: "projectTaskFacilitationPlan",
    label: "Project (Tasks) Facilitation Plans",
    icon: Settings,
    color: "from-[#707070] to-[#909090]",
  },
  {
    key: "studentConductCharacterPlan",
    label: "Student Conduct & Character Lesson Plans",
    icon: User,
    color: "from-[#E04A2F] to-[#ff6b4a]",
  },
  {
    key: "reportGenerator",
    label: "Lesson Plan Marking & Reports",
    icon: FileText,
    color: "from-[#ffb900] to-[#fe9a00]",
  },
]

// Fetch analytics data
async function fetchAnalyticsData() {
  const { data } = await axios.get(`${backendApi}/api/getPlanFiles`)
  return data
}

// Process chart data with filtering
function processChartData(rawData: any, activeFilters: string[]) {
  const filteredData =
    activeFilters.length > 0 ? rawData.data.filter((item: any) => activeFilters.includes(item.plan)) : rawData.data

  const subjects: Record<string, number> = {}
  const disciplines: Record<string, number> = {}
  const schoolLevels: Record<string, number> = {}
  const planTypes: Record<string, number> = {}
  const weeklyTrend: Record<string, { lessonPlans: number; assessments: number }> = {}

  filteredData.forEach((item: any) => {
    const metadata = parseLessonMetadata(item.answer)

    // Subject & Discipline
    const subject = metadata["Subject & Discipline"]
    if (subject) {
      subjects[subject] = (subjects[subject] || 0) + 1
    }

    // Discipline mapping
    const discipline = getDisciplineFromSubject(subject)
    if (discipline) {
      disciplines[discipline] = (disciplines[discipline] || 0) + 1
    }

    // School Level
    const schoolLevel = metadata["School Level"]
    if (schoolLevel) {
      schoolLevels[schoolLevel] = (schoolLevels[schoolLevel] || 0) + 1
    }

    // Plan Types
    const planType = PLAN_TYPE_MAPPING[item.plan as keyof typeof PLAN_TYPE_MAPPING] || item.plan
    planTypes[planType] = (planTypes[planType] || 0) + 1

    // Weekly trend (simplified - using creation date)
    const date = new Date(item.createdAt)
    const weekKey = `Week ${Math.ceil(date.getDate() / 7)}`
    if (!weeklyTrend[weekKey]) {
      weeklyTrend[weekKey] = { lessonPlans: 0, assessments: 0 }
    }

    if (item.plan.includes("Assessment")) {
      weeklyTrend[weekKey].assessments += 1
    } else {
      weeklyTrend[weekKey].lessonPlans += 1
    }
  })

  return {
    subjects: Object.entries(subjects)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count })),
    disciplines: Object.entries(disciplines).map(([name, count]) => ({ name, count })),
    schoolLevels: Object.entries(schoolLevels).map(([name, count]) => ({ name, count })),
    planTypes: Object.entries(planTypes).map(([name, count]) => ({ name, count })),
    weeklyTrend: Object.entries(weeklyTrend).map(([week, data]) => ({
      week,
      lessonPlans: data.lessonPlans,
      assessments: data.assessments,
    })),
    filteredCount: filteredData.length,
  }
}

// Helper function to map subjects to disciplines
function getDisciplineFromSubject(subject: string): string {
  if (!subject) return "Other"

  const disciplineMap: Record<string, string> = {
    Mathematics: "STEM",
    Science: "STEM",
    Physics: "STEM",
    Chemistry: "STEM",
    Biology: "STEM",
    Computer: "Technology",
    ICT: "Technology",
    English: "Languages",
    Literature: "Languages",
    History: "Humanities",
    Geography: "Humanities",
    Economics: "Business",
    Business: "Business",
    Trade: "Business",
  }

  for (const [key, discipline] of Object.entries(disciplineMap)) {
    if (subject.toLowerCase().includes(key.toLowerCase())) {
      return discipline
    }
  }

  return "Other"
}

export default function FilteredDashboard() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const { data, isLoading, isError } = useQuery({
    queryKey: ["analyticsData"],
    queryFn: fetchAnalyticsData,
  })

  const chartData = data ? processChartData(data, activeFilters) : null
  console.log(chartData)
  // Calculate totals by plan type
  const getTotalByPlanType = (planType: string) => {
    if (!data) return 0
    return data.data.filter((item: any) => item.plan === planType).length
  }

  const getTotalTeachers = () => {
    if (!data) return 0
    return new Set(data.data.map((item: any) => item.userId.username)).size
  }

  const toggleFilter = (filterKey: string) => {
    setActiveFilters((prev) => (prev.includes(filterKey) ? prev.filter((f) => f !== filterKey) : [...prev, filterKey]))
  }

  const clearFilters = () => {
    setActiveFilters([])
  }

  const exportData = () => {
    if (!data) return

    const csvContent = [
      ["Plan Type", "Subject", "School Level", "Created Date", "Teacher"].join(","),
      ...data.data.map((item: any) => {
        const metadata = parseLessonMetadata(item.answer)
        return [
          PLAN_TYPE_MAPPING[item.plan as keyof typeof PLAN_TYPE_MAPPING] || item.plan,
          metadata["Subject & Discipline"] || "",
          metadata["School Level"] || "",
          new Date(item.createdAt).toLocaleDateString(),
          item.userId.username,
        ].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "lesson-plans-data.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <Loader />
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Data</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive view of lesson plans and assessments</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportData} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            {activeFilters.length > 0 && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters ({activeFilters.length})
              </Button>
            )}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 mr-4">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters:</span>
          </div>
          {FILTER_BUTTONS.map((filter) => (
            <Button
              key={filter.key}
              onClick={() => toggleFilter(filter.key)}
              variant={activeFilters.includes(filter.key) ? "default" : "outline"}
              className={`flex items-center gap-2 ${activeFilters.includes(filter.key) ? `bg-gradient-to-r ${filter.color} text-white` : ""
                }`}
            >
              <filter.icon className="h-4 w-4" />
              {filter.label}
              {activeFilters.includes(filter.key) && (
                <Badge variant="secondary" className="ml-1">
                  {getTotalByPlanType(filter.key)}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalTeachers()}</div>
              <p className="text-xs text-muted-foreground">Platform-wide teachers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Subject Lesson Plans</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalByPlanType("subjectLessonPlan")}</div>
              <p className="text-xs text-muted-foreground">Total subject lessons</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Subject Assessments</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalByPlanType("subjectAssessmentPlan")}</div>
              <p className="text-xs text-muted-foreground">Total assessments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Project Tasks</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalByPlanType("projectTaskPlan")}</div>
              <p className="text-xs text-muted-foreground">Total project tasks</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lesson Plans by Subject */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Plans by Subject</CardTitle>
              <CardDescription>Top 10 subjects by lesson plan count</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData?.subjects && chartData.subjects.length > 0 ? (
                <ChartContainer
                  config={{
                    count: {
                      label: "Count",
                      color: "#ffb900",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.subjects}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No subject data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lesson Plans by Discipline */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Plans by Discipline</CardTitle>
              <CardDescription>Distribution across 6 main disciplines</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData?.disciplines && chartData.disciplines.length > 0 ? (
                <ChartContainer
                  config={{
                    count: {
                      label: "Count",
                      color: "#fe9a00",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.disciplines}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No discipline data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* School Level Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Plans by School Level</CardTitle>
              <CardDescription>Distribution across education levels</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData?.schoolLevels && chartData.schoolLevels.length > 0 ? (
                <ChartContainer
                  config={{
                    count: {
                      label: "Count",
                      color: "#F5C242",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                      <Pie
                        data={chartData.schoolLevels}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {chartData.schoolLevels.map((entry: any, index: number) => {
                          const name = entry.name.toLowerCase()

                          let fillColor = "#707070" // default grey for unknown/tertiary

                          if (name.includes("nursery")) fillColor = "#F5C242" // Yellow
                          else if (name.includes("primary")) fillColor = "#E04A2F" // Red
                          else if (name.includes("secondary")) fillColor = "#111111" // Black
                          else if (name.includes("university") || name.includes("tertiary"))
                            fillColor = "#707070" // Grey

                          return <Cell key={`cell-${index}`} fill={fillColor} />
                        })}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No school level data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Trend</CardTitle>
              <CardDescription>Lesson plans vs assessments over time</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData?.weeklyTrend && chartData.weeklyTrend.length > 0 ? (
                <ChartContainer
                  config={{
                    lessonPlans: {
                      label: "Lesson Plans",
                      color: "#ffb900",
                    },
                    assessments: {
                      label: "Assessments",
                      color: "#E04A2F",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.weeklyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="lessonPlans" stroke="var(--color-lessonPlans)" strokeWidth={2} />
                      <Line type="monotone" dataKey="assessments" stroke="var(--color-assessments)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No trend data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Filters Summary */}
        {activeFilters.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Active Filters</CardTitle>
              <CardDescription>Showing {chartData?.filteredCount || 0} items with active filters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => {
                  const filterConfig = FILTER_BUTTONS.find((f) => f.key === filter)
                  return (
                    <Badge
                      key={filter}
                      variant="secondary"
                      className={`bg-gradient-to-r ${filterConfig?.color} text-white`}
                    >
                      {filterConfig?.label}
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
