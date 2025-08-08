import { create } from "zustand";

interface IHistory {
  userId?: string;
  fields?: string[];
  answer?: string;
  planName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MyFilesStore {
  plan: IHistory[];
  setPlan: (newPlan: IHistory[]) => void;
  getPlanFiles: () => void;
}

export const useMyFilesStore = create<MyFilesStore>((set) => ({
  plan: [
    {
      userId: "",
      fields: [],
      answer: "",
      planName: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  setPlan: (newPlan) => set({ plan: newPlan }),
  getPlanFiles: () => set({ plan: [] })
}));
