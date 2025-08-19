import { z } from "zod";
export const studentConductCharacterPlanSchema = z.object({
  location: z.string().nonempty("Location is required"),
  state: z.string().optional(),
  cities: z.string().optional(),
  lga: z.string().optional(),
  setting: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  coreValues: z.string().optional(),
  curriculum: z.string().nonempty("Curriculum is required"),
  // school level
  yearClass: z.string().nonempty("Year/Class is required"),
  schoolLevel: z.string().nonempty("School level is required"),
  subSchoolLevel: z.string().optional(),
  studentAge: z.string().optional(),
  classesSocioEconomic: z.string().optional(),
  term: z.string().nonempty("Term is required"),
  termTheme: z.string().optional(),
  week: z.string().nonempty("Week is required"),
  KPI: z.string().nonempty("KPI is required"),
  preRequisite: z.string().optional(),
  bloomLevel: z.string().nonempty("Bloom’s level is required"),
  studentConductLessonObjectives: z.string().nonempty("Lesson objectives is required"),
  studentConductTeacher: z.string().optional(),
  studentConductStudent: z.string().optional(),
  technologyAccess: z.string().nonempty("Technology access is required"),
  classSize: z.string().nonempty("Class size is required"),
  timeAvailable: z.string().nonempty("Time available is required"),
  teachingAids: z
    .array(z.string())
    .min(1, "Select at least one teaching aid"),
  otherTeachingAids: z.string().optional(),

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
  // assesment
  studentConduct: z.string().optional(),
  noQuestions: z.string().optional(),
  questionTypes: z.array(z.string()).optional(),
  maxOptions: z.string().optional(),
  correctModel: z.string().optional(),
  explanationCorrectModel: z.string().optional(),
  assessmentWeight: z.string().optional(),
  assessmentLearning: z.string().optional(),
  submissionFormat: z.string().optional(),
  studentConductLectureNotes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.location === "Nigeria" && (!data.cities || data.cities.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["cities"],
      message: "City is required when location is Nigeria",
    });
  }
  if (
    data.location === "Nigeria" &&
    (!data.state || data.state.trim() === "")
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["state"],
      message: "State is required when location is Nigeria",
    });
  }
})

export type IStudentConductCharacterPlan = z.infer<
  typeof studentConductCharacterPlanSchema
>;