import { create } from "zustand";

interface RatingState {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useRatingStore = create<RatingState>((set) => ({
  isOpen: false,
  setIsOpen: (value) =>
    typeof value === "function"
      ? set((state) => ({ isOpen: value(state.isOpen) }))
      : set({ isOpen: value }),
}));
