import { create } from "zustand";
import { useSubjectLessonStore } from "./subjectLesson";
import { useSubjectAssessmentStore } from "./subjectAssessment";
import { filterPlans } from "@/utils/analyticsTransform";
import { useConductCharacterLessonStore } from "./conductCharacterLesson";
import { useConductCharacterAssessmentsStore } from "./conductCharacterAssessments";
import { useProjectTaskStore } from "./projectTask";
import { useProjectFacilitationStore } from "./projectFacilitation";
import type { TimeRange } from "@/types";


interface GlobalFiltersState {
  country: string;
  discipline: string;
  subject: string;
  schoolLevel: string;
  timeRange: TimeRange;
  isGlobalFilter: boolean;
  term: string;
  topic: string;

  setCountry: (country: string) => void;
  setDiscipline: (discipline: string) => void;
  setSubject: (subject: string) => void;
  setSchoolLevel: (schoolLevel: string) => void;
  setTimeRange: (timeRange: TimeRange) => void;
  setTerm: (term: string) => void;
  setTopic: (topic: string) => void;

  resetFilters: () => void;
}

// 🔥 Apply global filters (central place)
const applyGlobalFilters = (get: () => GlobalFiltersState) => {
  const { country, discipline, subject, schoolLevel, timeRange, term, topic } = get();

  const { subjectLessonPlan } = useSubjectLessonStore.getState();
  const { subjectAssessmentPlan } = useSubjectAssessmentStore.getState();
  const { conductCharacterLessonPlan } = useConductCharacterLessonStore.getState();
  const { conductCharacterAssessmentsPlan } = useConductCharacterAssessmentsStore.getState();
  const { projectTaskPlan } = useProjectTaskStore.getState();
  const { projectFacilitationPlan } = useProjectFacilitationStore.getState();


  // ✅ Reuse the function
  const filteredLesson = filterPlans(subjectLessonPlan, {
    country,
    discipline,
    subject,
    schoolLevel,
    timeRange: timeRange,
    termTheme: term,
    topic
  });

  const filteredAssessment = filterPlans(subjectAssessmentPlan, {
    country,
    discipline,
    subject,
    schoolLevel,
    timeRange: timeRange,
    termTheme: term,
    topic
  });

  const filteredConductCharacterLesson = filterPlans(conductCharacterLessonPlan, {
    country,
    discipline,
    subject,
    schoolLevel,
    timeRange: timeRange,
    termTheme: term,
    topic
  });

  const filteredConductCharacterAssessments = filterPlans(conductCharacterAssessmentsPlan, {
    country,
    discipline,
    subject,
    schoolLevel,
    timeRange: timeRange,
    termTheme: term,
    topic

  });

  const filteredProjectTask = filterPlans(projectTaskPlan, {
    country,
    discipline,
    subject,
    schoolLevel,
    timeRange: timeRange,
    termTheme: term,
    topic
  });

  const filteredProjectFacilitation = filterPlans(projectFacilitationPlan, {
    country,
    discipline,
    subject,
    schoolLevel,
    timeRange: timeRange,
    termTheme: term,
    topic
  });

  // ✅ update both stores
  useSubjectLessonStore.setState({ filterGlobalSubjectLessonPlan: filteredLesson });
  useSubjectAssessmentStore.setState({ filterGlobalSubjectAssessmentPlan: filteredAssessment });
  useConductCharacterLessonStore.setState({ filterGlobalConductCharacterPlan: filteredConductCharacterLesson });
  useConductCharacterAssessmentsStore.setState({ filterConductCharacterAssessmentsGlobalPlan: filteredConductCharacterAssessments });
  useProjectTaskStore.setState({ filterGlobalProjectTaskPlan: filteredProjectTask });
  useProjectFacilitationStore.setState({ filterGlobalProjectFacilitationPlan: filteredProjectFacilitation });
};

export const useGlobalFiltersStore = create<GlobalFiltersState>((set, get) => ({
  country: "",
  discipline: "",
  subject: "",
  schoolLevel: "",
  timeRange: "",
  term: "",
  topic: "",
  isGlobalFilter: false,


  setCountry: (country: string) => {
    set({ country, isGlobalFilter: true });
    applyGlobalFilters(get);
  },
  setDiscipline: (discipline: string) => {
    set({ discipline, isGlobalFilter: true });
    applyGlobalFilters(get);
  },
  setSubject: (subject: string) => {
    set({ subject, isGlobalFilter: true });
    applyGlobalFilters(get);
  },
  setSchoolLevel: (schoolLevel: string) => {
    set({ schoolLevel, isGlobalFilter: true });
    applyGlobalFilters(get);
  },
  setTimeRange: (timeRange: TimeRange) => {
    set({ timeRange, isGlobalFilter: true });
    applyGlobalFilters(get);
  },
  setTerm: (term: string) => {
    set({ term, isGlobalFilter: true });
    applyGlobalFilters(get);
  },

  setTopic: (topic: string) => {
    set({ topic, isGlobalFilter: true });
    applyGlobalFilters(get);
  },

  resetFilters: () => {
    set({
      country: "",
      discipline: "",
      subject: "",
      schoolLevel: "",
      timeRange: "",
      topic: "",
      term: "",
      isGlobalFilter: false
    });

    // reset subjectLesson global filter
    const { subjectLessonPlan } = useSubjectLessonStore.getState();
    const { subjectAssessmentPlan } = useSubjectAssessmentStore.getState();
    const { conductCharacterLessonPlan } = useConductCharacterLessonStore.getState();
    useSubjectLessonStore.setState({
      filterGlobalSubjectLessonPlan: subjectLessonPlan,
    });
    useSubjectAssessmentStore.setState({
      filterGlobalSubjectAssessmentPlan: subjectAssessmentPlan,
    });
    useConductCharacterLessonStore.setState({
      filterConductCharacterLessonPlan: conductCharacterLessonPlan,
    });

  },
}));
