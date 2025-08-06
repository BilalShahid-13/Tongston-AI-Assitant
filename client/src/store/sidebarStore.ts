import type { SidebarStore } from "@/types";
import { create } from "zustand";

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
}));
