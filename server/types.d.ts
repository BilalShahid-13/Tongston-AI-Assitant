export interface KnowledgeBaseEntry {
  Discipline: string;
  DisciplineDescription: string;
  Subject: string;
  SubjectDescription: string;
  NationalCurriculumSubjectMapping: string;
  NationalCurriculumSubjectMapping_1: string;
  NationalCurriculumSubjectMapping_2: string;
  NationalCurriculumSubjectMapping_3: string;
  NationalCurriculumSubjectMapping_4: string;
  YearClass: string;
  TypeOfExternalKnowledgeBase: string;
  Topic: string;
  Source: string;
  Link: string;
  OtherExternalResources: string;
}

export interface IScrapePdfs {
  content: string;
  $vector: number[];
  createdAt: Date;
}

export interface LessonPlanRequest {
  location: string;
  state?: string;
  city?: string;
  setting?: 'Rural' | 'Urban' | 'Peri-Urban';
  schoolBranding?: {
    mission?: string;
    vision?: string;
    coreValues?: string;
    curriculumType: string;
  };
  yearClass: string;
  schoolLevel: string;
  schoolSubLevel: string;
  studentsAverageAge: string;
  socioEconomicContext: string;
  week: number;
  term: 1 | 2 | 3;
  termTheme: 'Personal Development' | 'Professional Development' | 'Public Development';
  subject: string;
  discipline: string;
  topic: string;
  subTopic?: string;
  aim?: string;
  preRequisiteCompetence?: string;
  difficultyLevel?: 'Basic' | 'Intermediate' | 'Advanced' | 'Mix of Basic and Intermediate' | 'All 3 Levels';
  learningObjectives?: string[];
  technologyAvailable: boolean;
  classSize: '10-25' | '25-50' | '50-100';
  timeAvailable: '20 minutes' | '35 minutes' | '40 minutes' | '45 minutes' | '50 minutes' | '60 minutes' | '80 minutes';
  teachingAids: string[];
  senDifferentiation?: {
    type: string;
    count: number;
    severity: 'Mild' | 'Moderate' | 'Severe' | 'Profound';
    support: 'Yes' | 'No' | 'Occasionally' | 'Not Sure';
    communication: string;
    mobility: string;
    sensory: string;
    social: string;
    cognitive: string;
    medical: 'Yes' | 'No' | 'Not Sure';
    iep: 'Yes' | 'No' | 'Not Sure';
    differentiationOptions: string[];
  }[];
  assessments?: {
    type: 'Diagnostic' | 'Formative' | 'Summative';
    questionCount: number;
    questionTypes: string[];
    maxOptions?: number;
    maxWords?: number;
    modelAnswer?: boolean;
    explanation?: boolean;
    weighting?: number;
    linkedObjective?: boolean;
    standard?: string;
    submissionFormat?: string[];
  }[];
  teacherActivities?: boolean;
  maxTeacherActivities?: number;
  studentActivities?: boolean;
  maxStudentActivities?: number;
  lectureNotes?: boolean;
}


export interface KnowledgeBaseDocument {
  discipline: string;
  subject: string;
  class: string;
  description: string;
  resources: {
    type: string;
    title: string;
    source: string;
    link: string;
  }[];
  vector: number[];
  metadata: {
    curriculum_mapping: string[];
    year_class: string;
    term?: number;
    week?: number;
    topic?: string;
    objectives?: string[];
  };
}

// new types

interface IHistory {
  userId: mongoose.Types.ObjectId | string,
  fields: string[],
  answer: string,
  plan: string
}