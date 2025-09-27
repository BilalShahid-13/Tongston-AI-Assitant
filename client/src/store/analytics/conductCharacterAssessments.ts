import { create } from "zustand";
import type { IPlan } from "@/types";

interface ConductCharacterAssessmentsState {
  conductCharacterAssessmentsPlan: IPlan[];
  filterConductCharacterAssessmentsPlan: IPlan[];
  filterConductCharacterAssessmentsGlobalPlan: IPlan[];

  filterConductCharacterAssessmentsBySubject: string;
  filterConductCharacterAssessmentsByClass: string;
  filterConductCharacterAssessmentsByTerm: string;
  country: string;
  discipline: string;

  setConductCharacterAssessmentsPlan: (plans: IPlan[]) => void;
  setFilterConductCharacterAssessmentsBySubject: (subject: string) => void;
  setFilterConductCharacterAssessmentsByClass: (classLevel: string) => void;
  setFilterConductCharacterAssessmentsByTerm: (term: string) => void;
  setCountry: (country: string) => void;
  setDiscipline: (discipline: string) => void;
  resetFilters: () => void;
}

// 🔥 centralized filtering logic
const applyFilters = (get: () => ConductCharacterAssessmentsState, set: any) => {
  const {
    conductCharacterAssessmentsPlan,
    filterConductCharacterAssessmentsBySubject,
    filterConductCharacterAssessmentsByClass,
    filterConductCharacterAssessmentsByTerm,
    country,
    discipline,
  } = get();

  const filtered = conductCharacterAssessmentsPlan.filter((plan: any) => {
    return (
      (!filterConductCharacterAssessmentsBySubject ||
        plan.fields?.subject === filterConductCharacterAssessmentsBySubject) &&
      (!filterConductCharacterAssessmentsByClass ||
        plan.fields?.yearClass === filterConductCharacterAssessmentsByClass) &&
      (!filterConductCharacterAssessmentsByTerm ||
        plan.fields?.term === filterConductCharacterAssessmentsByTerm) &&
      (!country || plan.fields?.location === country) &&
      (!discipline ||
        plan.fields?.subjectDiscipline?.toLowerCase() === discipline.toLowerCase())
    );
  });

  set({ filterConductCharacterAssessmentsPlan: filtered });
};

export const useConductCharacterAssessmentsStore = create<ConductCharacterAssessmentsState>((set, get) => ({
  conductCharacterAssessmentsPlan: [],
  filterConductCharacterAssessmentsPlan: [],
  filterConductCharacterAssessmentsGlobalPlan: [],
  filterConductCharacterAssessmentsBySubject: "",
  filterConductCharacterAssessmentsByClass: "",
  filterConductCharacterAssessmentsByTerm: "",
  country: "",
  discipline: "",

  setConductCharacterAssessmentsPlan: (plans) =>
    set({
      conductCharacterAssessmentsPlan: plans,
      filterConductCharacterAssessmentsPlan: plans,
      filterConductCharacterAssessmentsGlobalPlan: plans
    }),

  setFilterConductCharacterAssessmentsBySubject: (subject) => {
    set({ filterConductCharacterAssessmentsBySubject: subject });
    applyFilters(get, set);
  },

  setFilterConductCharacterAssessmentsByClass: (classLevel) => {
    set({ filterConductCharacterAssessmentsByClass: classLevel });
    applyFilters(get, set);
  },

  setFilterConductCharacterAssessmentsByTerm: (term) => {
    set({ filterConductCharacterAssessmentsByTerm: term });
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
      filterConductCharacterAssessmentsPlan: state.conductCharacterAssessmentsPlan,
      filterConductCharacterAssessmentsBySubject: "",
      filterConductCharacterAssessmentsByClass: "",
      filterConductCharacterAssessmentsByTerm: "",
      country: "",
      discipline: "",
    }));
  },
}));
