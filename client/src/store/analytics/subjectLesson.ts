import { create } from "zustand";
import type { IPlan } from "@/types";

interface SubjectLessonState {
  subjectLessonPlan: IPlan[];
  filterSubjectLessonPlan: IPlan[];
  filterGlobalSubjectLessonPlan: IPlan[];

  filterSubjectLessonBySubject: string;
  filterSubjectLessonByClass: string;
  filterSubjectLessonByTerm: string;
  country: string;
  discipline: string;

  setSubjectLessonPlan: (plans: IPlan[]) => void;
  setFilterSubjectLessonBySubject: (subject: string) => void;
  setFilterSubjectLessonByClass: (classLevel: string) => void;
  setFilterSubjectLessonByTerm: (term: string) => void;
  setCountry: (country: string) => void;
  setDiscipline: (discipline: string) => void;
  resetFilters: () => void;
}

// 🔥 Centralized filter logic
const applyFilters = (get: () => SubjectLessonState, set: any) => {
  const {
    subjectLessonPlan,
    filterSubjectLessonBySubject,
    filterSubjectLessonByClass,
    filterSubjectLessonByTerm,
    country,
    discipline,
  } = get();

  const filtered = subjectLessonPlan.filter((plan: any) => {
    return (
      (!filterSubjectLessonBySubject ||
        plan.fields?.subject === filterSubjectLessonBySubject) &&
      (!filterSubjectLessonByClass ||
        plan.fields?.yearClass === filterSubjectLessonByClass) &&
      (!filterSubjectLessonByTerm ||
        plan.fields?.termTheme === filterSubjectLessonByTerm) &&
      (!country || plan.fields?.location === country) &&
      (!discipline ||
        plan.fields?.subjectDiscipline?.toLowerCase() === discipline.toLowerCase())
    );
  });

  set({ filterSubjectLessonPlan: filtered });
};

export const useSubjectLessonStore = create<SubjectLessonState>((set, get) => ({
  subjectLessonPlan: [],
  filterSubjectLessonPlan: [],
  filterGlobalSubjectLessonPlan: [],
  filterSubjectLessonBySubject: "",
  filterSubjectLessonByClass: "",
  filterSubjectLessonByTerm: "",
  country: "",
  discipline: "",

  setSubjectLessonPlan: (plans) =>
    set({
      subjectLessonPlan: plans,
      filterSubjectLessonPlan: plans,
      filterGlobalSubjectLessonPlan: plans
    }),

  setFilterSubjectLessonBySubject: (subject) => {
    set({ filterSubjectLessonBySubject: subject });
    applyFilters(get, set);
  },

  setFilterSubjectLessonByClass: (classLevel) => {
    set({ filterSubjectLessonByClass: classLevel });
    applyFilters(get, set);
  },

  setFilterSubjectLessonByTerm: (term) => {
    set({ filterSubjectLessonByTerm: term });
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
      filterSubjectLessonPlan: state.subjectLessonPlan,
      filterSubjectLessonBySubject: "",
      filterSubjectLessonByClass: "",
      filterSubjectLessonByTerm: "",
      country: "",
      discipline: "",
    }));
  },
}));
