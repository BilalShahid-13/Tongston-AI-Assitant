import { create } from "zustand";
import type { IPlan } from "@/types";

interface SubjectAssessmentState {
  subjectAssessmentPlan: IPlan[];
  filterSubjectAssessmentPlan: IPlan[];
  filterGlobalSubjectAssessmentPlan: IPlan[];

  filterSubjectAssessmentBySubject: string;
  filterSubjectAssessmentByClass: string;
  filterSubjectAssessmentByTerm: string;
  country: string;
  discipline: string;

  setSubjectAssessmentPlan: (plans: IPlan[]) => void;
  setFilterSubjectAssessmentBySubject: (subject: string) => void;
  setFilterSubjectAssessmentByClass: (classLevel: string) => void;
  setFilterSubjectAssessmentByTerm: (term: string) => void;
  setCountry: (country: string) => void;
  setDiscipline: (discipline: string) => void;
  resetFilters: () => void;
}

// 🔥 Centralized filter logic
const applyFilters = (get: () => SubjectAssessmentState, set: any) => {
  const {
    subjectAssessmentPlan,
    filterSubjectAssessmentBySubject,
    filterSubjectAssessmentByClass,
    filterSubjectAssessmentByTerm,
    country,
    discipline,
  } = get();

  const filtered = subjectAssessmentPlan.filter((plan: any) => {
    return (
      (!filterSubjectAssessmentBySubject ||
        plan.fields?.subject === filterSubjectAssessmentBySubject) &&
      (!filterSubjectAssessmentByClass ||
        plan.fields?.yearClass === filterSubjectAssessmentByClass) &&
      (!filterSubjectAssessmentByTerm ||
        plan.fields?.termTheme === filterSubjectAssessmentByTerm) &&
      (!country || plan.fields?.location === country) &&
      (!discipline ||
        plan.fields?.subjectDiscipline?.toLowerCase() === discipline.toLowerCase())
    );
  });

  set({ filterSubjectAssessmentPlan: filtered });
};

export const useSubjectAssessmentStore = create<SubjectAssessmentState>((set, get) => ({
  subjectAssessmentPlan: [],
  filterSubjectAssessmentPlan: [],
  filterGlobalSubjectAssessmentPlan: [],
  filterSubjectAssessmentBySubject: "",
  filterSubjectAssessmentByClass: "",
  filterSubjectAssessmentByTerm: "",
  country: "",
  discipline: "",

  setSubjectAssessmentPlan: (plans) =>
    set({
      subjectAssessmentPlan: plans,
      filterSubjectAssessmentPlan: plans,
      filterGlobalSubjectAssessmentPlan: plans
    }),

  setFilterSubjectAssessmentBySubject: (subject) => {
    set({ filterSubjectAssessmentBySubject: subject });
    applyFilters(get, set);
  },

  setFilterSubjectAssessmentByClass: (classLevel) => {
    set({ filterSubjectAssessmentByClass: classLevel });
    applyFilters(get, set);
  },

  setFilterSubjectAssessmentByTerm: (term) => {
    set({ filterSubjectAssessmentByTerm: term });
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
      filterSubjectAssessmentPlan: state.subjectAssessmentPlan,
      filterSubjectAssessmentBySubject: "",
      filterSubjectAssessmentByClass: "",
      filterSubjectAssessmentByTerm: "",
      country: "",
      discipline: "",
    }));
  },
}));
