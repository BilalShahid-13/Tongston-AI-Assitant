import type { TimeFilter } from "@/components/CardFilterDropdown"
import type { AnalyticsItem } from "@/types"
import { create } from "zustand"

export type AnalyticsFilters = {
  country: string
  discipline: string
  subject: string
  schoolLevel: string
  dateRange: TimeFilter
}

interface AnalyticsStore {
  analyticsData: AnalyticsItem[]
  setAnalyticsData: (data: AnalyticsItem[]) => void
  clearAnalyticsData: () => void
  activeFilters: string[]
  setActiveFilters: (filters: string[]) => void
  clearFilters: () => void
  getTotalTeachers: (filteredData?: AnalyticsItem[]) => number
  getTotalByPlanType: (planType: string, filteredData?: AnalyticsItem[]) => number

  filters: AnalyticsFilters                 // ✅ add filters here
  setFilters: (newFilters: Partial<AnalyticsFilters>) => void

  timeFilters: {
    totalTeachers: TimeFilter
    subjectAssessments: TimeFilter
    subjectLessonPlans: TimeFilter
    conductLessonPlans: TimeFilter
    conductAssessments: TimeFilter
    projectTasks: TimeFilter
    projectFacilitation: TimeFilter
  }
  setTimeFilter: (card: keyof AnalyticsStore["timeFilters"], value: TimeFilter) => void
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  analyticsData: [],
  setAnalyticsData: (data) => set({ analyticsData: data }),
  clearAnalyticsData: () => set({ analyticsData: [] }),
  activeFilters: [],
  setActiveFilters: (filters) => set({ activeFilters: filters }),

  filters: {
    country: "",
    discipline: "",
    subject: "",
    schoolLevel: "",
    dateRange: "Year",
  },
  setFilters: (newFilters) =>
    set({
      filters: {
        ...get().filters,
        ...newFilters,
      },
    }),

  timeFilters: {
    totalTeachers: "Year",
    subjectAssessments: "Year",
    subjectLessonPlans: "Year",
    conductLessonPlans: "Year",
    conductAssessments: "Year",
    projectTasks: "Year",
    projectFacilitation: "Year",
  },
  setTimeFilter: (card, value) =>
    set((state) => ({
      timeFilters: {
        ...state.timeFilters,
        [card]: value,
      },
    })),

  clearFilters: () =>
    set({
      activeFilters: [],
      filters: {
        country: "",
        discipline: "",
        subject: "",
        schoolLevel: "",
        dateRange: "Year",
      },
      timeFilters: {
        totalTeachers: "Year",
        subjectAssessments: "Year",
        subjectLessonPlans: "Year",
        conductLessonPlans: "Year",
        conductAssessments: "Year",
        projectTasks: "Year",
        projectFacilitation: "Year",
      },
    }),

  getTotalTeachers: (filteredData) => {
    const source = filteredData ?? get().analyticsData
    return new Set(source.map((item) => item.userId.username)).size
  },

  getTotalByPlanType: (planType, filteredData) => {
    const source = filteredData ?? get().analyticsData
    return source.filter((item) => item.plan === planType).length
  },
}))
