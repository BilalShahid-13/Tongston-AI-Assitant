import { sidebarItems } from "@/lib/constant";
import type { TabStore } from "@/types";
import { create } from "zustand";

export const useTabStore = create<TabStore>((set) => ({
  tabValue: sidebarItems[0].name,
  addTabValue: (value: string) => set({ tabValue: value }),
}));
