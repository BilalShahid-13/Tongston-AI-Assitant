import type { LessonPlanData } from "@/types"
import { create } from "zustand"

interface LessonStore {
  currentLesson: LessonPlanData | null
  setCurrentLesson: (lesson: LessonPlanData | null) => void
  clearCurrentLesson: () => void
}

export const useMyFileStore = create<LessonStore>((set) => ({
  currentLesson: null,
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
  clearCurrentLesson: () => set({ currentLesson: null }),
}))
