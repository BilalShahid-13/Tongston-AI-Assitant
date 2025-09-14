import { allCities, juniorSecondarySchool, nurserySchool, primartSchool, secondarySchool, seniorSecondarySchool, studentAge, subjectLists, tertiarySchool, yearClassMappings } from "@/constants/lessonPlanConstant";
import type { CurriculumEntry } from "@/types";
import { createRef, type RefObject } from "react";
import type { UseFormReturn } from "react-hook-form";
import { create } from "zustand";

interface IProjectTaskFacilitation {
  cities: string[];
  handleCities: (form: UseFormReturn<any>) => void;
  handleYearClass: (form: UseFormReturn<any>) => void;
  handleTerm: (form: UseFormReturn<any>) => void;
  resetContinousAssessment: (form: UseFormReturn<any>) => void;
  handleSubjectLearning: (form: UseFormReturn<any>) => void;
  handleSubjectDicipline: (form: UseFormReturn<any>) => void;
  handleCurriculum: (form: UseFormReturn<any>) => void;
  isCurriculumLoaded: boolean;
  CurriculumEntry: CurriculumEntry[];
  setCurriculumEntry: (excelData: CurriculumEntry[], isLoaded: boolean) => void;
  setOtherTeachingAids: (form: UseFormReturn<any>) => void;
  handleOutput: (form: UseFormReturn<any>) => boolean
  isEditClicked: boolean;
  editButton: () => boolean; // returns the updated state
}
export const useProjectTaskFacilitationStore = create<IProjectTaskFacilitation>((set, get) => ({
  cities: [],
  isCurriculumLoaded: false,
  CurriculumEntry: [],
  isEditClicked: false,
  editButton: () => {
    const newState = get().isEditClicked; // toggle true/false
    set({ isEditClicked: newState });
    console.log('new state', newState)
    return newState;
  },
  handleOutput: (form: UseFormReturn) => {
    const yearClass = form.watch("yearClass");
    if (yearClass === "Nursery 3/Kindergarten 3" ||
      yearClass === "Primary 3/Grade 3/Basic 3" ||
      yearClass === "Primary 6/Grade 6/Basic 6" ||
      yearClass === "Junior Secondary 3/JSS3/JS3/Grade 9" ||
      yearClass === "Undergraduate Year 3"
    ) {
      return true
    }
    return false
  },

  handleCities: (form: UseFormReturn<any>) => {
    const stateName = form.getValues("state");
    const citiesName = allCities?.find(item => item.state === stateName)?.cities || [];
    set({ cities: citiesName || [] });
  },
  handleYearClass: (form: UseFormReturn<any>) => {
    const yearClass = form.watch("yearClass");
    const currentSchoolLevel = form.watch("schoolLevel");
    handleSchoolLevel(form, yearClass, currentSchoolLevel);
    handleSubSchoolLevel(form, yearClass);
    handleStudentAge(form, yearClass);
    handleSocioEconomic(form, yearClass);
  },
  handleTerm: (form: UseFormReturn<any>) => {
    const term = form.getValues("term");
    handleTermTheme(form, term);
  },
  resetContinousAssessment: (form: UseFormReturn<any>) => {
    form.setValue("continuousAssessmentWeek", []);
  },
  handleSubjectLearning: (form: UseFormReturn<any>) => {
    const subject = form.getValues("subject");
    if (subject) {
      form.setValue("subjectLearning", subjectLists.find(items => items.subject === subject)?.discipline ?? "")
    }
  },
  handleSubjectDicipline: (form: UseFormReturn<any>) => {
    const subject = form.getValues("subject");
    if (subject) {
      form.setValue("subjectDiscipline", subjectLists.find(items => items.subject === subject)?.discipline ?? "")
    }
  },
  handleCurriculum: (form: UseFormReturn<any>) => {
    const { isCurriculumLoaded, CurriculumEntry } = useProjectTaskFacilitationStore.getState();

    if (!isCurriculumLoaded) {
      return;
    }
    const subject = form.getValues("subject");
    const yearClass = form.getValues("yearClass");
    const yearMatch = yearClassMappings.find(
      (entry) => entry.normalized === yearClass
    );
    const normalizedYearClass = yearMatch?.raw;
    const curriculum = form.getValues("curriculum");
    if (curriculum == "Tongston Entrepreneurial Education - PRIORITY") {
      const match: any = CurriculumEntry.find(
        (entry: any) =>
          entry.Subject === subject &&
          entry["Year/Class"] === normalizedYearClass
      );
      form.setValue("topic", match?.Topic || "No topic found for this subject and class.");
    }
  },
  setCurriculumEntry: (excelData: CurriculumEntry[], isLoaded: boolean) => set({ CurriculumEntry: excelData, isCurriculumLoaded: isLoaded }),
  setOtherTeachingAids: (form: UseFormReturn<any>) => {
    if (form.getValues("teachingAids") === "Others") {
      form.setValue("teachingAids", form.getValues("otherTeachingAids"));
    }
  }
}));


const handleSchoolLevel = (form: any, yearClass: any, currentSchoolLevel: any) => {
  let newSchoolLevel = "";

  if (nurserySchool.includes(yearClass)) {
    newSchoolLevel = "Nursery School";
  } else if (primartSchool.includes(yearClass)) {
    newSchoolLevel = "Primary School";
  } else if (secondarySchool.includes(yearClass)) {
    newSchoolLevel = "Secondary School";
  } else if (tertiarySchool.includes(yearClass)) {
    newSchoolLevel = "Tertiary School";
  }
  if (newSchoolLevel !== currentSchoolLevel) {
    form.setValue("schoolLevel", newSchoolLevel);
  }
}

const handleSubSchoolLevel = (form: any, yearClass: any) => {
  const primary1 = primartSchool.slice(0, 3);
  const primary2 = primartSchool.slice(3, 6);
  // const junior1 =
  if (nurserySchool.includes(yearClass)) {
    form.setValue("subSchoolLevel", "Nursery School");
  }
  else if (primary1.includes(yearClass)) {
    form.setValue("subSchoolLevel", "Lower Primary School");
  }
  else if (primary2.includes(yearClass)) {
    form.setValue("subSchoolLevel", "Upper Primary School");
  }
  else if (juniorSecondarySchool.includes(yearClass)) {
    form.setValue("subSchoolLevel", "Junior Secondary School");
  }
  else if (seniorSecondarySchool.includes(yearClass)) {
    form.setValue("subSchoolLevel", "Senior Secondary School")
  }
  else if (tertiarySchool.includes(yearClass)) {
    form.setValue("subSchoolLevel", "Tertiary School")
  }
}

const handleStudentAge = (form: any, yearClass: any) => {
  const matchedItem = studentAge.find(item => item.name === yearClass);
  if (matchedItem) {
    form.setValue("studentAge", matchedItem.ageRange);
  } else {
    form.setValue("studentAge", "");
  }
}

const handleSocioEconomic = (form: UseFormReturn<any>, yearClass: string) => {
  switch (yearClass) {
    case "Nursery 1/Kindergarten 1/Preparatory 1/Preparatory 2":
      form.setValue("classesSocioEconomic", "House");
      break;
    case "Nursery 2/Kindergarten 2":
      form.setValue("classesSocioEconomic", "Neighbourhood");
      break;
    case "Nursery 2/Kindergarten 3":
      form.setValue("classesSocioEconomic", "TESTS");
      break;
    case "Primary 1/Grade 1/Basic 1":
      form.setValue("classesSocioEconomic", "District");
      break;
    case "Primary 2/Grade 2/Basic 2":
      form.setValue("classesSocioEconomic", "Town");
      break;
    case "Primary 2/Grade 2/Basic 3":
      form.setValue("classesSocioEconomic", "TESTS");
      break;
    case "Primary 4/Grade 4/Basic 4":
      form.setValue("classesSocioEconomic", "County/Local Government Area (LGA)");
      break;
    case "Primary 5/Grade 5/Basic 5":
      form.setValue("classesSocioEconomic", "State");
      break;
    case "Primary 6/Grade 6/Basic 6":
      form.setValue("classesSocioEconomic", "TESTS");
      break;
    case "Junior Secondary 1/JSS1/JS1/Grade 7":
      form.setValue("classesSocioEconomic", "Sub-National Region");
      break;
    case "Junior Secondary 1/JSS1/JS1/Grade 8":
      form.setValue("classesSocioEconomic", "Country");
      break;
    case "Junior Secondary 1/JSS1/JS1/Grade 9":
      form.setValue("classesSocioEconomic", "TESTS");
      break;
    case "Senior Secondary 1/ SS1/Grade 10":
      form.setValue("classesSocioEconomic", "Sub-Continental Region");
      break;
    case "Senior Secondary 1/ SS1/Grade 11":
      form.setValue("classesSocioEconomic", "Continent");
      break;
      // case "Senior Secondary 1/ SS1/Grade 11":
      //   form.setValue("classesSocioEconomic", "TESTS");
      break;
    case "Undergraduate Year 1":
      form.setValue("classesSocioEconomic", "Global Socio-Economic (Trade) Block");
      break;
    case "Undergraduate Year 2":
      form.setValue("classesSocioEconomic", "World");
      break;
    case "Undergraduate Year 3":
      form.setValue("classesSocioEconomic", "TESTS");
      break;
  }
}

const handleTermTheme = (form: any, term: any) => {
  switch (term) {
    case "1":
      form.setValue("termTheme", "Personal Development");
      break;
    case "2":
      form.setValue("termTheme", "Professional Development");
      break;
    case "3":
      form.setValue("termTheme", "Public Development");
      break;
  }
}