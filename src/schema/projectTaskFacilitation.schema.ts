import { z } from "zod";

export const projectTaskFacilitationFormSchema = z.object({
  location: z.string().nonempty("Location is required"),
  state: z.string().optional(),
  cities: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  coreValues: z.string().optional(),
  // school level
  yearClass: z.string().nonempty("Year/Class is required"),
  schoolLevel: z.string().nonempty("School level is required"),
  subSchoolLevel: z.string().optional(),
  studentAge: z.string().optional(),
  classesSocioEconomic: z.string().optional(),
  term: z.string().nonempty("Term is required"),
  termTheme: z.string().optional(),
  task: z.string().nonempty("Task is required"),
  subTask: z.string().optional(),
  technologyAccess: z.string().nonempty("Technology access is required"),
  classSize: z.string().nonempty("Class size is required"),
  timeAvailable: z.string().nonempty("Time available is required"),
  teachingAids: z
    .array(z.string())
    .min(1, "Select at least one teaching aid"),
  // sen
  sen: z.array(z.string()).optional(),
  noStudents: z.array(z.string()).optional(),
  security: z.array(z.string()).optional(),
  support: z.string().optional(),
  communicationMethod: z.string().optional(),
  mobility: z.string().optional(),
  sensoryConsideration: z.string().optional(),
  socialInteraction: z.string().optional(),
  cognitiveProcessingTime: z.string().optional(),
  medicalEmergencyProtocol: z.string().optional(),
  iepPlan: z.string().optional(),
  senOptions: z.array(z.string()).optional(),
  weeklyNotes: z.string().optional(),

});

export type IProjectTaskFacilitationFormSchema = z.infer<typeof projectTaskFacilitationFormSchema>;