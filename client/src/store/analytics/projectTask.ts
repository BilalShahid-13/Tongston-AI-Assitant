import { create } from "zustand";
import type { IPlan } from "@/types";

interface ProjectTaskState {
  projectTaskPlan: IPlan[];
  filterProjectTaskPlan: IPlan[];
  filterGlobalProjectTaskPlan: IPlan[];

  filterProjectTaskBySubject: string;
  filterProjectTaskByClass: string;
  filterProjectTaskByTerm: string;
  country: string;
  discipline: string;

  setProjectTaskPlan: (plans: IPlan[]) => void;
  setFilterProjectTaskBySubject: (subject: string) => void;
  setFilterProjectTaskByClass: (classLevel: string) => void;
  setFilterProjectTaskByTerm: (term: string) => void;
  setCountry: (country: string) => void;
  setDiscipline: (discipline: string) => void;
  resetFilters: () => void;
}

// 🔥 centralized filtering logic
const applyFilters = (get: () => ProjectTaskState, set: any) => {
  const {
    projectTaskPlan,
    filterProjectTaskBySubject,
    filterProjectTaskByClass,
    filterProjectTaskByTerm,
    country,
    discipline,
  } = get();

  const filtered = projectTaskPlan.filter((plan: any) => {
    return (
      (!filterProjectTaskBySubject ||
        plan.fields?.subject === filterProjectTaskBySubject) &&
      (!filterProjectTaskByClass ||
        plan.fields?.yearClass === filterProjectTaskByClass) &&
      (!filterProjectTaskByTerm ||
        plan.fields?.term === filterProjectTaskByTerm) &&
      (!country || plan.fields?.location === country) &&
      (!discipline ||
        plan.fields?.subjectDiscipline?.toLowerCase() === discipline.toLowerCase())
    );
  });

  set({ filterProjectTaskPlan: filtered });
};

export const useProjectTaskStore = create<ProjectTaskState>((set, get) => ({
  projectTaskPlan: [],
  filterProjectTaskPlan: [],
  filterGlobalProjectTaskPlan: [],
  filterProjectTaskBySubject: "",
  filterProjectTaskByClass: "",
  filterProjectTaskByTerm: "",
  country: "",
  discipline: "",

  setProjectTaskPlan: (plans) =>
    set({
      projectTaskPlan: plans,
      filterProjectTaskPlan: plans,
      filterGlobalProjectTaskPlan: plans
    }),

  setFilterProjectTaskBySubject: (subject) => {
    set({ filterProjectTaskBySubject: subject });
    applyFilters(get, set);
  },

  setFilterProjectTaskByClass: (classLevel) => {
    set({ filterProjectTaskByClass: classLevel });
    applyFilters(get, set);
  },

  setFilterProjectTaskByTerm: (term) => {
    set({ filterProjectTaskByTerm: term });
    applyFilters(get, set);
  },

  setCountry: (country: string) => {
    set({ country });
    applyFilters(get, set);
  },

  setDiscipline: (discipline: string) => {
    set({ discipline });
    applyFilters(get, set);
  },

  resetFilters: () => {
    set((state) => ({
      filterProjectTaskPlan: state.projectTaskPlan,
      filterProjectTaskBySubject: "",
      filterProjectTaskByClass: "",
      filterProjectTaskByTerm: "",
      country: "",
      discipline: "",
    }));
  },
}));
