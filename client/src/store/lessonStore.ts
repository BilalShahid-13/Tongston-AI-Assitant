import { create } from "zustand"

interface LessonStore {
  currentLesson: boolean
  setCurrentLesson: (lesson: boolean) => void
  planData: string
  setPlanData: (data: string) => void
}

export const useLessonStore = create<LessonStore>((set) => ({
  currentLesson: false,
  planData: "",
  setPlanData: (data) => set({ planData: data }),
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
}))
