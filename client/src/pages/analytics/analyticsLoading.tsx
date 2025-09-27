import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoadingState {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>()(
  persist(
    (set) => ({
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "loading-storage", // unique name for localStorage
    }
  )
);