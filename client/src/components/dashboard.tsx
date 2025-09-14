
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { nurserySchool, primartSchool, secondarySchool, subjectLists, tertiarySchool } from "@/constants/lessonPlanConstant"
import { useIsMobile } from "@/hooks/use-mobile"
import { backendApi } from "@/lib/constant"
import { useSidebarStore } from "@/store/sidebarStore"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { BookOpen, ClipboardCheck, Download, FileText, Filter, FolderOpen, Settings, User, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
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


const SCHOOL_LEVEL_COLORS = {
  nursery: "#F5C242", // yellow
  primary: "#E04A2F", // red
  secondary: "#111111", // black/dark
  university: "#707070", // grey
  tertiary: "#707070", // grey (same as university)
  default: "#707070", // grey for unknown levels
}

function getSchoolLevelColor(schoolLevel: string): string {
  const level = schoolLevel.toLowerCase()

  // Check nursery levels
  if (nurserySchool.some((grade) => level.includes(grade.toLowerCase().split("/")[0]))) {
    return SCHOOL_LEVEL_COLORS.nursery
  }

  // Check primary levels
  if (primartSchool.some((grade) => level.includes(grade.toLowerCase().split("/")[0]))) {
    return SCHOOL_LEVEL_COLORS.primary
  }

  // Check secondary levels
  if (secondarySchool.some((grade) => level.includes(grade.toLowerCase().split("/")[0]))) {
    return SCHOOL_LEVEL_COLORS.secondary
  }

  // Check tertiary/university levels
  if (tertiarySchool.some((grade) => level.includes(grade.toLowerCase().split("/")[0]))) {
    return SCHOOL_LEVEL_COLORS.university
  }

  return SCHOOL_LEVEL_COLORS.default
}

function normalizeSchoolLevel(schoolLevel: string): string {
  if (!schoolLevel) return "Other"

  const level = schoolLevel.toLowerCase()

  if (nurserySchool.some((grade) => level.includes(grade.toLowerCase().split("/")[0]))) {
    return "Nursery"
  }

  if (primartSchool.some((grade) => level.includes(grade.toLowerCase().split("/")[0]))) {
    return "Primary"
  }

  if (secondarySchool.some((grade) => level.includes(grade.toLowerCase().split("/")[0]))) {
    return "Secondary"
  }

  if (tertiarySchool.some((grade) => level.includes(grade.toLowerCase().split("/")[0]))) {
    return "University"
  }

  return "Other"
}

// Process chart data with filtering
function processChartData(rawData: any, activeFilters: string[], globalFilters: any) {
  let filteredData = rawData.data

  // Apply active filters (plan type filters)
  if (activeFilters.length > 0) {
    filteredData = filteredData.filter((item: any) => activeFilters.includes(item.plan))
  }

  // Apply global filters
  if (globalFilters.discipline && globalFilters.discipline !== "all") {
    filteredData = filteredData.filter((item: any) => {
      const discipline = item.fields[13] || ""
      return discipline.toLowerCase().includes(globalFilters.discipline.toLowerCase())
    })
  }

  if (globalFilters.schoolLevel && globalFilters.schoolLevel !== "all") {
    filteredData = filteredData.filter((item: any) => {
      const schoolLevel = item.fields[5] || ""
      const normalizedLevel = normalizeSchoolLevel(schoolLevel)
      return normalizedLevel === globalFilters.schoolLevel
    })
  }

  if (globalFilters.subject && globalFilters.subject !== "all") {
    filteredData = filteredData.filter((item: any) => {
      const subject = item.fields[12] || ""
      return subject.toLowerCase().includes(globalFilters.subject.toLowerCase())
    })
  }

  if (globalFilters.country) {
    filteredData = filteredData.filter((item: any) => {
      const country = item.fields[0] || ""
      return country.toLowerCase().includes(globalFilters.country.toLowerCase())
    })
  }

  if (globalFilters.type && globalFilters.type !== "all") {
    filteredData = filteredData.filter((item: any) => {
      const planType = PLAN_TYPE_MAPPING[item.plan as keyof typeof PLAN_TYPE_MAPPING] || item.plan
      return planType.toLowerCase().includes(globalFilters.type.toLowerCase())
    })
  }

  const subjects: Record<string, number> = {}
  const disciplines: Record<string, number> = {}
  const schoolLevels: Record<string, number> = {}
  const planTypes: Record<string, number> = {}
  const weeklyTrend: Record<string, { lessonPlans: number; assessments: number }> = {}
  const assessmentsBySubject: Record<string, number> = {}

  filteredData.forEach((item: any) => {
    const fields = item.fields || []
    const schoolLevel = fields[5] || ""
    const week = fields[10] || ""
    const subject = fields[12] || ""
    const discipline = fields[13] || ""

    // Subject & Discipline processing
    if (subject) {
      subjects[subject] = (subjects[subject] || 0) + 1

      if (item.plan.includes("Assessment")) {
        assessmentsBySubject[subject] = (assessmentsBySubject[subject] || 0) + 1
      }
    }

    if (discipline) {
      disciplines[discipline] = (disciplines[discipline] || 0) + 1
    }

    const normalizedLevel = normalizeSchoolLevel(schoolLevel)
    if (normalizedLevel) {
      schoolLevels[normalizedLevel] = (schoolLevels[normalizedLevel] || 0) + 1
    }

    // Plan Types
    const planType = PLAN_TYPE_MAPPING[item.plan as keyof typeof PLAN_TYPE_MAPPING] || item.plan
    planTypes[planType] = (planTypes[planType] || 0) + 1

    // Weekly trend (using creation date and week field)
    const date = new Date(item.createdAt)
    const weekKey = week ? `Week ${week}` : `Week ${Math.ceil(date.getDate() / 7)}`
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
    assessmentsBySubject: Object.entries(assessmentsBySubject)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count })),
    disciplines: Object.entries(disciplines).map(([name, count]) => ({ name, count })),
    schoolLevels: Object.entries(schoolLevels).map(([name, count]) => ({ name, count })),
    planTypes: Object.entries(planTypes).map(([name, count]) => ({ name, count })),
    weeklyTrend: Object.entries(weeklyTrend)
      .sort(([a], [b]) => Number.parseInt(a.split(" ")[1]) - Number.parseInt(b.split(" ")[1]))
      .map(([week, data]) => ({
        week,
        lessonPlans: data.lessonPlans,
        assessments: data.assessments,
      })),
    filteredCount: filteredData.length,
  }
}

// Comprehensive filter state interface
interface FilterState {
  dateRange: string
  discipline: string
  subject: string
  schoolLevel: string
  classYear: string
  subjectUnit: string
  conductUnit: string
  task: string
  subTask: string
  week: string
  term: string
  type: string
  subType: string
}

const FILTER_OPTIONS = {
  disciplines: Array.from(new Set(subjectLists.map((item) => item.discipline))),
  schoolLevels: ["Nursery", "Primary", "Secondary", "University"],
  subjects: subjectLists.map((item) => item.subject),
  types: ["Lesson Plan", "Lesson Notes", "Assessments"],
  subTypes: [
    "Subject Lesson Plan",
    "Subject Lesson Notes",
    "Subject Assessments",
    "Student Conduct & Character Lesson Plans",
    "Student Conduct & Character Lesson Notes",
    "Student Conduct & Character Assessments",
    "Project (Tasks)",
    "Project (Tasks) Lesson Facilitation Plans",
    "Project (Tasks) Lesson Notes",
    "Lesson Plan Marking & Reports",
  ],
}

export default function FilteredDashboard() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [globalFilters, setGlobalFilters] = useState<FilterState>({
    dateRange: "",
    discipline: "",
    subject: "",
    schoolLevel: "",
    classYear: "",
    subjectUnit: "",
    conductUnit: "",
    task: "",
    subTask: "",
    week: "",
    term: "",
    type: "",
    subType: "",
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ["analyticsData"],
    queryFn: fetchAnalyticsData,
  })

  const isMobile = useIsMobile()
  const { toggleSidebar } = useSidebarStore()
  useEffect(() => {
    toggleSidebar();
  }, [isMobile])

  const chartData = data ? processChartData(data, activeFilters, globalFilters) : null

  const getFilteredData = () => {
    if (!data) return []

    let filteredData = data.data

    // Apply global filters
    if (globalFilters.discipline && globalFilters.discipline !== "all") {
      filteredData = filteredData.filter((item: any) => {
        const discipline = item.fields[13] || ""
        return discipline.toLowerCase().includes(globalFilters.discipline.toLowerCase())
      })
    }

    if (globalFilters.schoolLevel && globalFilters.schoolLevel !== "all") {
      filteredData = filteredData.filter((item: any) => {
        const schoolLevel = item.fields[5] || ""
        const normalizedLevel = normalizeSchoolLevel(schoolLevel)
        return normalizedLevel === globalFilters.schoolLevel
      })
    }

    if (globalFilters.subject && globalFilters.subject !== "all") {
      filteredData = filteredData.filter((item: any) => {
        const subject = item.fields[12] || ""
        return subject.toLowerCase().includes(globalFilters.subject.toLowerCase())
      })
    }

    // if (globalFilters.country) {
    //   filteredData = filteredData.filter((item: any) => {
    //     const country = item.fields[0] || ""
    //     return country.toLowerCase().includes(globalFilters.country.toLowerCase())
    //   })
    // }

    if (globalFilters.type && globalFilters.type !== "all") {
      filteredData = filteredData.filter((item: any) => {
        const planType = PLAN_TYPE_MAPPING[item.plan as keyof typeof PLAN_TYPE_MAPPING] || item.plan
        return planType.toLowerCase().includes(globalFilters.type.toLowerCase())
      })
    }

    return filteredData
  }

  const getTotalByPlanType = (planType: string) => {
    const filteredData = getFilteredData()
    return filteredData.filter((item: any) => item.plan === planType).length
  }

  const getTotalTeachers = () => {
    const filteredData = getFilteredData()
    return new Set(filteredData.map((item: any) => item.userId.username)).size
  }

  const getTotalSubjectAssessments = () => {
    return getTotalByPlanType("subjectAssessmentPlan")
  }

  const getTotalSubjectLessonPlans = () => {
    return getTotalByPlanType("subjectLessonPlan")
  }

  const getTotalConductLessonPlans = () => {
    return getTotalByPlanType("studentConductCharacterPlan")
  }

  const getTotalConductAssessments = () => {
    return getTotalByPlanType("studentConductCharacterAssessmentPlan")
  }

  const getTotalProjectTasks = () => {
    return getTotalByPlanType("projectTaskPlan")
  }

  const getTotalProjectFacilitationPlans = () => {
    return getTotalByPlanType("projectTaskFacilitationPlan")
  }

  const exportData = () => {
    const filteredData = getFilteredData()

    const csvContent = [
      [
        "Plan Type",
        "Subject",
        "Discipline",
        "School Level",
        "Country",
        "State",
        "Curriculum",
        "Class Year",
        "Term",
        "Week",
        "Created Date",
        "Teacher",
        "Normalized School Level",
      ].join(","),
      ...filteredData.map((item: any) => {
        const fields = item.fields || []
        return [
          PLAN_TYPE_MAPPING[item.plan as keyof typeof PLAN_TYPE_MAPPING] || item.plan,
          fields[12] || "", // subject
          fields[13] || "", // discipline
          fields[5] || "", // school level
          fields[0] || "", // country
          fields[1] || "", // state
          fields[2] || "", // curriculum
          fields[3] || "", // class year
          fields[8] || "", // term
          fields[10] || "", // week
          new Date(item.createdAt).toLocaleDateString(),
          item.userId.username,
          normalizeSchoolLevel(fields[5] || "") || "",
        ].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `lesson-plans-data-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const updateGlobalFilter = (key: keyof FilterState, value: string) => {
    setGlobalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setGlobalFilters({
      dateRange: "",
      discipline: "",
      subject: "",
      schoolLevel: "",
      classYear: "",
      subjectUnit: "",
      conductUnit: "",
      task: "",
      subTask: "",
      week: "",
      term: "",
      type: "",
      subType: "",
    })
  }

  if (isLoading) {
    return <Loader />
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
    <div className="min-h-screen p-4 max-md:p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col max-md:flex-row justify-between max-md:items-center gap-6">
          {/* Left Section (Heading + Subtitle) */}
          <div className="space-y-1 text-center max-md:text-left">
            {/* <h1 className="text-2xl max-sm:text-3xl font-bold">Analytics Dashboard</h1> */}
            <p className="text-sm sm:text-base text-muted-foreground">
              {/* Comprehensive view of lesson plans and assessments */}
            </p>
          </div>

          {/* Right Section (Buttons) */}
          <div className="flex w-full items-center justify-center max-md:justify-start gap-3">
            <Button
              onClick={exportData}
              variant="outline"
              className="w=-full flex items-center gap-2 bg-transparent
              text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>

            {(activeFilters.length > 0 || Object.values(globalFilters).some((v) => v)) && (
              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="text-sm max-sm:text-base px-3 sm:px-4 py-2 rounded-lg"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Global Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row max-md:grid max-lg:grid max-sm:flex max-sm:flex-col
            max-md:grid-cols-3   max-lg:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Date Range</label>
                <Input
                  type="date"
                  value={globalFilters.dateRange}
                  className="w-full"
                  onChange={(e) => updateGlobalFilter("dateRange", e.target.value)}
                />
              </div>
              {/* <div>
                <label className="text-sm font-medium mb-1 block">Country</label>
                <Input
                  placeholder="Enter country"
                  value={globalFilters.country}
                  onChange={(e) => updateGlobalFilter("country", e.target.value)}
                />
              </div> */}
              <div>
                <label className="text-sm font-medium mb-1 block">Discipline</label>
                <Select
                  value={globalFilters.discipline}
                  onValueChange={(value) => updateGlobalFilter("discipline", value)}
                >
                  <SelectTrigger
                    className="w-full"
                  >
                    <SelectValue placeholder="Select discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Disciplines</SelectItem>
                    {FILTER_OPTIONS.disciplines.map((discipline) => (
                      <SelectItem key={discipline} value={discipline}>
                        {discipline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <Select value={globalFilters.subject} onValueChange={(value) => updateGlobalFilter("subject", value)}>
                  <SelectTrigger
                    className="w-full"
                  >
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {FILTER_OPTIONS.subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">School Level</label>
                <Select
                  value={globalFilters.schoolLevel}
                  onValueChange={(value) => updateGlobalFilter("schoolLevel", value)}
                >
                  <SelectTrigger className="w-full"
                  >
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {FILTER_OPTIONS.schoolLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Buttons */}
        <div
          className="
    grid grid-cols-4
    max-md:grid-cols-4
    gap-2 w-full max-sm:justify-center
    max-sm:flex max-sm:flex-col
  "
        >
          {FILTER_BUTTONS.map((filter, idx) => (
            <Button
              key={filter.key}
              onClick={() =>
                setActiveFilters((prev) =>
                  prev.includes(filter.key)
                    ? prev.filter((f) => f !== filter.key)
                    : [...prev, filter.key],
                )
              }
              variant={activeFilters.includes(filter.key) ? "default" : "outline"}
              className={`
        flex items-center gap-2
        ${activeFilters.includes(filter.key) ? `bg-gradient-to-r ${filter.color} text-white` : ""}
        ${FILTER_BUTTONS.length % 2 !== 0 && idx === FILTER_BUTTONS.length - 1 ? "col-span-2" : ""}
      `}
            >
              <filter.icon className="h-4 w-4" />
              <span className="max-sm:text-xs">
                {filter.label}
              </span>
              {activeFilters.includes(filter.key) && (
                <Badge variant="secondary" className="ml-1 ">
                  {getTotalByPlanType(filter.key)}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 max-sm:grid-cols-1 max-xl:grid-cols-2 gap-6">
          <Card className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Teachers</CardTitle>
              <Users className="h-6 w-6 text-blue-500 group-hover:text-blue-600 transition-colors" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-gray-900">{getTotalTeachers()}</div>
              <p className="text-xs text-gray-500">Platform-wide teachers using AI web app</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Subject Assessments</CardTitle>
              <ClipboardCheck className="h-6 w-6 text-green-500 group-hover:text-green-600 transition-colors" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-gray-900">{getTotalSubjectAssessments()}</div>
              <p className="text-xs text-gray-500">Total subject assessments</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Subject Lesson Plans</CardTitle>
              <BookOpen className="h-6 w-6 text-purple-500 group-hover:text-purple-600 transition-colors" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-gray-900">{getTotalSubjectLessonPlans()}</div>
              <p className="text-xs text-gray-500">Total subject lesson plans</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Conduct & Character Lesson Plans</CardTitle>
              <User className="h-6 w-6 text-pink-500 group-hover:text-pink-600 transition-colors" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-gray-900">{getTotalConductLessonPlans()}</div>
              <p className="text-xs text-gray-500">Student conduct & character lesson plans</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Conduct & Character Assessments</CardTitle>
              <ClipboardCheck className="h-6 w-6 text-orange-500 group-hover:text-orange-600 transition-colors" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-gray-900">{getTotalConductAssessments()}</div>
              <p className="text-xs text-gray-500">Total conduct & character assessments</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Project (Tasks)</CardTitle>
              <ClipboardCheck className="h-6 w-6 text-teal-500 group-hover:text-teal-600 transition-colors" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-gray-900">{getTotalProjectTasks()}</div>
              <p className="text-xs text-gray-500">Total project tasks</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Project Facilitation Plans</CardTitle>
              <BookOpen className="h-6 w-6 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-gray-900">{getTotalProjectFacilitationPlans()}</div>
              <p className="text-xs text-gray-500">Project task facilitation plans</p>
            </CardContent>
          </Card>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Lesson Plans by Subject</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Top 10 subjects by lesson plan count (+ more)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData?.subjects && chartData.subjects.length > 0 ? (
                <ChartContainer
                  config={{ count: { label: "Count", color: "#ffb900" } }}
                  className="h-[250px] sm:h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.subjects}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-muted-foreground text-sm">
                  No subject data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Assessments by Subject</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Top 10 subjects by assessment count (+ more)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData?.assessmentsBySubject && chartData.assessmentsBySubject.length > 0 ? (
                <ChartContainer
                  config={{ count: { label: "Count", color: "#E04A2F" } }}
                  className="h-[250px] sm:h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.assessmentsBySubject}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-muted-foreground text-sm">
                  No assessment data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Lesson Plans by Discipline</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Distribution across disciplines
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData?.disciplines && chartData.disciplines.length > 0 ? (
                <ChartContainer
                  config={{ count: { label: "Count", color: "#fe9a00" } }}
                  className="h-[250px] sm:h-[300px] w-full"
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
                <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-muted-foreground text-sm">
                  No discipline data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Lesson Plans by School Level</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Nursery / Primary / Secondary / University distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData?.schoolLevels && chartData.schoolLevels.length > 0 ? (
                <ChartContainer
                  config={{ count: { label: "Count", color: "#F5C242" } }}
                  className="h-[250px] sm:h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.schoolLevels} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={70} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count">
                        {chartData.schoolLevels.map((entry: any, index: number) => {
                          const fillColor = getSchoolLevelColor(entry.name)
                          return <Cell key={`cell-${index}`} fill={fillColor} />
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-muted-foreground text-sm">
                  No school level data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>



        {/* Weekly Trend */}
        <Card className="w-full max-w-sm max-md:max-w-md max-sm:max-w-full">
          <CardHeader>
            <CardTitle className="text-lg max-sm:text-base">
              Trend over Time
            </CardTitle>
            <CardDescription className="text-xs max-sm:text-[10px]">
              Weekly counts for lesson plans vs assessments (last 12 weeks)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData?.weeklyTrend && chartData.weeklyTrend.length > 0 ? (
              <ChartContainer
                config={{
                  lessonPlans: { label: "Lesson Plans", color: "#ffb900" },
                  assessments: { label: "Assessments", color: "#E04A2F" },
                }}
                className="h-[250px] max-sm:h-[180px] max-md:h-[220px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 10 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="lessonPlans"
                      stroke="var(--color-lessonPlans)"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="assessments"
                      stroke="var(--color-assessments)"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] max-sm:h-[200px] text-muted-foreground text-sm max-sm:text-xs">
                No trend data available
              </div>
            )}
          </CardContent>
        </Card>




        {/* Active Filters Summary */}
        {(activeFilters.length > 0 || Object.values(globalFilters).some((v) => v)) && (
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
                {Object.entries(globalFilters).map(([key, value]) => {
                  if (value && value !== "all") {
                    return (
                      <Badge key={key} variant="secondary"
                        className="bg-gradient-to-r from-[var(--k12-primary)] to-[var(--k12-accent)] text-black py-2 px-4 rounded-lg">
                        {key}: {value}
                      </Badge>
                    )
                  }
                  return null
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
