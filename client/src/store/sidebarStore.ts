import type { SidebarStore } from "@/types";
import type { RefObject } from "react";
import { create } from "zustand";

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: false,
  sidebarRef: null as RefObject<HTMLButtonElement> | null,
  isMobile: false,
  setSidebarRef: (ref) => set({ sidebarRef: ref }),
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),

}));
