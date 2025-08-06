
import { create } from "zustand";
import * as XLSX from "xlsx";
import type { CurriculumEntry } from "@/types";

interface CurriculumStore {
  data: CurriculumEntry[];
  isLoaded: boolean;
  loadExcel: () => Promise<void>;
}

export const useCurriculumStore = create<CurriculumStore>((set) => ({
  data: [],
  isLoaded: false,
  loadExcel: async () => {
    try {
      const response = await fetch("/k12 knowledge base.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const worksheet = workbook.Sheets["External Knowledge base"];
      const jsonData = XLSX.utils.sheet_to_json<CurriculumEntry>(worksheet);
      set({ data: jsonData, isLoaded: true });
    } catch (error) {
      console.error("Failed to load curriculum data:", error);
    }
  },
}));
