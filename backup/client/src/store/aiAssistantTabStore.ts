import type { TabStore } from "@/types";
import { create } from "zustand";

export const useAiAssistantTabStore = create<TabStore>((set) => ({
  tabValue: "Lesson Plans",
  // tabValue: "Overview",
  addTabValue: (value: string) => set({ tabValue: value }),
}));
