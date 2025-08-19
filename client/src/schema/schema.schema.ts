import { z } from "zod";

export const lessonPlanForm = z
  .object({
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
    topic: z.string().nonempty("Topic is required"),
    subTopic: z.string().optional(),
    subject: z.string().nonempty("Subject is required"),
    subjectDiscipline: z.string().nonempty("Subject is required"),
    preRequisite: z.string().optional(),
    aim: z.string().optional(),
    bloomLevel: z.string().nonempty("Bloom’s level is required"),
    classSize: z.string().nonempty("Class size is required"),
    timeAvailable: z.string().nonempty("Time available is required"),
    technologyAccess: z.string().nonempty("Technology access is required"),
    lessonNotes: z.string().optional(),
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
    maxAnswers: z.string().optional(),
    modelAnswer: z.string().optional(),
    correctModel: z.string().optional(),
    explanationCorrectModel: z.string().optional(),
    assessmentWeight: z.string().optional(),
    assessmentLearning: z.string().optional(),
    nationalTest: z.string().optional(),
    // activities and notes
    teacher: z.string().optional(),

    teachingAids: z
      .array(z.string())
      .min(1, "Select at least one teaching aid"),
    otherTeachingAids: z.string().optional(),
    assessmentType: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.location === "Nigeria" &&
      (!data.cities || data.cities.trim() === "")
    ) {
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
  });


export const assesmentPlanForm = z.object({
  typeofAssessments: z.string().nonempty("Type of assesments is required"),
  continuousAssessmentWeek: z.array(z.string()),
  state: z.string().optional(),
  cities: z.string().optional(),
  curriculum: z.string().nonempty("Curriculum is required"),
  term: z.string().nonempty("Term is required"),
  termTheme: z.string().nonempty("Term Theme is required"),
  location: z.string().nonempty("Location is required"),
  mission: z.string().optional(),
  vision: z.string().optional(),
  coreValues: z.string().optional(),
  yearClass: z.string().nonempty("Year/Class is required"),
  schoolLevel: z.string().nonempty("School level is required"),
  subSchoolLevel: z.string().optional(),
  technologyAccess: z.string().nonempty("Technology access is required"),
  studentAge: z.string().optional(),
  classesSocioEconomic: z.string().optional(),
  subject: z.string().nonempty("Subject is required"),
  subjectDiscipline: z.string().nonempty("Subject is required"),
  topic: z.string().nonempty("Topic is required"),
  subTopic: z.string().optional(),
  bloomLevel: z.string().nonempty("Bloom’s level is required"),
  timeAvailable: z.string().nonempty("Time available is required"),
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
  // teachingAids: z
  //   .array(z.string())
  //   .min(1, "Select at least one teaching aid"),

  //assessment
  cbtTest: z.string().optional(),
  nationalTest: z.string().optional(),
  assessmentLearning: z.string().optional(),
  noQuestions: z.string().nonempty('Number of questions is required'),
  questionTypes: z.array(z.string()).nonempty("Select at least one question type").min(1, "Select at least one question type"),
  maxOptions: z.string().optional(),
  maxAnswers: z.string().optional(),
  modelAnswer: z.string().optional(),
  correctModel: z.string().optional(),
  explanationCorrectModel: z.string().optional(),
  assessmentWeight: z.string().optional(),
  // activities and notes
  teacher: z.string().optional(),
  // submisison
  submissionFormat: z.array(z.string()).optional(),


  assessmentType: z.string().optional(),
}).superRefine((data, ctx) => {

  const weeks = data.continuousAssessmentWeek;
  const type = data.typeofAssessments;

  if (type === "Continuous Assessment") {
    if (weeks.length < 1) {
      ctx.addIssue({
        path: ["continuousAssessmentWeek"],
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        inclusive: true,
        origin: "array",
        message: "Select at least 1 week for Continuous Assessment",
      });
    }
  }

  if (type === "Mid Term Assessment" && weeks.length > 5) {
    ctx.addIssue({
      path: ["continuousAssessmentWeek"],
      code: z.ZodIssueCode.too_big,
      maximum: 5,
      inclusive: true,
      origin: "array",
      message: "Select at most 5 weeks for Mid Term Assessment",
    });
  }

  if (type === "End of Term Assessment" && weeks.length > 10) {
    ctx.addIssue({
      path: ["continuousAssessmentWeek"],
      code: z.ZodIssueCode.too_big,
      maximum: 10,
      inclusive: true,
      origin: "array",
      message: "Select at most 10 weeks for End of Term Assessment",
    });
  }

  if (
    data.location === "Nigeria" &&
    (!data.cities || data.cities.trim() === "")
  ) {
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
  // if (allCountryNames.find(country => country === data.location)) {
  //   ctx.addIssue({
  //     path: ["cities"],
  //     code: z.ZodIssueCode.custom,
  //     message: "City is required"
  //   })
  // }
  // if (allCities.find(state => state.state === data.state)) {
  //   ctx.addIssue({
  //     path: ["state"],
  //     code: z.ZodIssueCode.custom,
  //     message: "State is required"
  //   })
  // }
  // if (data.assessmentLearning === "Yes") {
  //   ctx.addIssue({
  //     path: ["nationalTest"],
  //     code: z.ZodIssueCode.custom,
  //     message: "National test is required"
  //   })
  // }
})



export type assesmentPlanFormSchema = z.infer<typeof assesmentPlanForm>;
export type lessonPlanFormSchema = z.infer<typeof lessonPlanForm>;
