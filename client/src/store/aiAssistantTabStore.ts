import type { TabStore } from "@/types";
import { create } from "zustand";

export const useAiAssistantTabStore = create<TabStore>((set) => ({
  tabValue: "Subject Lesson Plan",
  addTabValue: (value: string) => set({ tabValue: value }),
}));
