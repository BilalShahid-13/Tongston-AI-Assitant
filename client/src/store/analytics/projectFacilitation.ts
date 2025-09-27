import { create } from "zustand";
import type { IPlan } from "@/types";

interface ProjectFacilitationState {
  projectFacilitationPlan: IPlan[];
  filterProjectFacilitationPlan: IPlan[];
  filterGlobalProjectFacilitationPlan: IPlan[];

  filterProjectFacilitationBySubject: string;
  filterProjectFacilitationByClass: string;
  filterProjectFacilitationByTerm: string;
  country: string;
  discipline: string;

  setProjectFacilitationPlan: (plans: IPlan[]) => void;
  setFilterProjectFacilitationBySubject: (subject: string) => void;
  setFilterProjectFacilitationByClass: (classLevel: string) => void;
  setFilterProjectFacilitationByTerm: (term: string) => void;
  setCountry: (country: string) => void;
  setDiscipline: (discipline: string) => void;
  resetFilters: () => void;
}

export const useProjectFacilitationStore = create<ProjectFacilitationState>((set, get) => ({
  projectFacilitationPlan: [],
  filterProjectFacilitationPlan: [],
  filterGlobalProjectFacilitationPlan: [],
  filterProjectFacilitationBySubject: "",
  filterProjectFacilitationByClass: "",
  filterProjectFacilitationByTerm: "",
  country: "",
  discipline: "",

  setProjectFacilitationPlan: (plans) =>
    set({
      projectFacilitationPlan: plans,
      filterProjectFacilitationPlan: plans,
      filterGlobalProjectFacilitationPlan:plans,
    }),

  setFilterProjectFacilitationBySubject: (subject) => {
    const filtered = get().projectFacilitationPlan.filter(
      (plan: any) => plan.fields?.subject === subject
    );
    set({
      filterProjectFacilitationPlan: filtered,
      filterProjectFacilitationBySubject: subject,
    });
  },

  setFilterProjectFacilitationByClass: (classLevel) => {
    const filtered = get().projectFacilitationPlan.filter(
      (plan: any) => plan.fields?.yearClass === classLevel
    );
    set({
      filterProjectFacilitationPlan: filtered,
      filterProjectFacilitationByClass: classLevel,
    });
  },

  setFilterProjectFacilitationByTerm: (term) => {
    const filtered = get().projectFacilitationPlan.filter(
      (plan: any) => plan.fields?.term === term
    );
    set({
      filterProjectFacilitationPlan: filtered,
      filterProjectFacilitationByTerm: term,
    });
  },

  setCountry: (country: string) => {
    const filtered = get().projectFacilitationPlan.filter(
      (plan: any) => plan.fields?.location === country
    );
    set({
      filterProjectFacilitationPlan: filtered,
      country,
    });
  },

  setDiscipline: (discipline: string) => {
    const filtered = get().projectFacilitationPlan.filter(
      (plan: any) =>
        plan.fields?.subjectDiscipline?.toLowerCase() === discipline.toLowerCase()
    );
    set({
      filterProjectFacilitationPlan: filtered,
      discipline,
    });
  },

  resetFilters: () => {
    set((state) => ({
      filterProjectFacilitationPlan: state.projectFacilitationPlan,
      filterProjectFacilitationBySubject: "",
      filterProjectFacilitationByClass: "",
      filterProjectFacilitationByTerm: "",
      country: "",
      discipline: "",
    }));
  },
}));
