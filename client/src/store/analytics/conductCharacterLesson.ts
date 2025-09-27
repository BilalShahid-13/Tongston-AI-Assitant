import { create } from "zustand";
import type { IPlan } from "@/types";

interface ConductCharacterLessonState {
  conductCharacterLessonPlan: IPlan[];
  filterConductCharacterLessonPlan: IPlan[];
  filterGlobalConductCharacterPlan: IPlan[];

  filterConductCharacterLessonBySubject: string;
  filterConductCharacterLessonByClass: string;
  filterConductCharacterLessonByTerm: string;
  country: string;
  discipline: string;

  setConductCharacterLessonPlan: (plans: IPlan[]) => void;
  setFilterConductCharacterLessonBySubject: (subject: string) => void;
  setFilterConductCharacterLessonByClass: (classLevel: string) => void;
  setFilterConductCharacterLessonByTerm: (term: string) => void;
  setCountry: (country: string) => void;
  setDiscipline: (discipline: string) => void;
  resetFilters: () => void;
}

// 🔥 centralized filtering logic
const applyFilters = (get: () => ConductCharacterLessonState, set: any) => {
  const {
    conductCharacterLessonPlan,
    filterConductCharacterLessonBySubject,
    filterConductCharacterLessonByClass,
    filterConductCharacterLessonByTerm,
    country,
    discipline,
  } = get();

  const filtered = conductCharacterLessonPlan.filter((plan: any) => {
    return (
      (!filterConductCharacterLessonBySubject ||
        plan.fields?.subject === filterConductCharacterLessonBySubject) &&
      (!filterConductCharacterLessonByClass ||
        plan.fields?.yearClass === filterConductCharacterLessonByClass) &&
      (!filterConductCharacterLessonByTerm ||
        plan.fields?.term === filterConductCharacterLessonByTerm) &&
      (!country || plan.fields?.location === country) &&
      (!discipline ||
        plan.fields?.subjectDiscipline?.toLowerCase() === discipline.toLowerCase())
    );
  });

  set({ filterConductCharacterLessonPlan: filtered });
};

export const useConductCharacterLessonStore = create<ConductCharacterLessonState>((set, get) => ({
  conductCharacterLessonPlan: [],
  filterConductCharacterLessonPlan: [],
  filterGlobalConductCharacterPlan:[],
  filterConductCharacterLessonBySubject: "",
  filterConductCharacterLessonByClass: "",
  filterConductCharacterLessonByTerm: "",
  country: "",
  discipline: "",

  setConductCharacterLessonPlan: (plans) =>
    set({
      conductCharacterLessonPlan: plans,
      filterConductCharacterLessonPlan: plans,
      filterGlobalConductCharacterPlan: plans
    }),

  setFilterConductCharacterLessonBySubject: (subject) => {
    set({ filterConductCharacterLessonBySubject: subject });
    applyFilters(get, set);
  },

  setFilterConductCharacterLessonByClass: (classLevel) => {
    set({ filterConductCharacterLessonByClass: classLevel });
    applyFilters(get, set);
  },

  setFilterConductCharacterLessonByTerm: (term) => {
    set({ filterConductCharacterLessonByTerm: term });
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
      filterConductCharacterLessonPlan: state.conductCharacterLessonPlan,
      filterConductCharacterLessonBySubject: "",
      filterConductCharacterLessonByClass: "",
      filterConductCharacterLessonByTerm: "",
      country: "",
      discipline: "",
    }));
  },
}));
