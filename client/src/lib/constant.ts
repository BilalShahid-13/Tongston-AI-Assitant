import AiAssitstant from "@/components/welcome/aiAssistantHeader";
import ProjectTask from "@/pages/aiAssistant/Project/projectTask";
import ProjectTaskFacilitation from "@/pages/aiAssistant/Project/projectTaskFacilitation";
import ReportGenerator from "@/pages/aiAssistant/reportGenerator";
import StudentConductCharacterAssessment from "@/pages/aiAssistant/StudentConduct/studentConductCharacterAssessment";
import StudentConductCharacterPlan from "@/pages/aiAssistant/StudentConduct/studentConductCharacterPlan";
import Assessments from "@/pages/aiAssistant/Subject/assessments";
import LessonPlans from "@/pages/aiAssistant/Subject/lessonPlans";
import type { IWalkthroughSteps } from "@/types";
import {
  BookOpenText,
  Bot,
  ChartBar,
  CircleCheckBig,
  CircleHelp,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Folder,
  Hammer,
  LayoutDashboard,
  MessageCircle,
  Presentation,
  Projector,
  ScrollText,
  Settings,
  UserCheck,
  UserCog,
  Users
} from "lucide-react";

// export const backendApi = 'https://tongston-ai-assitant-rt92.vercel.app';
export const backendApi = 'http://localhost:5000';
export const feedbackGeneratorCount = 3;

export const navbarItems = [
  {
    name: "Dashboard",
    // component:App,
  },
  {
    name: "My Courses",
    // component:Dashboard
  },
  {
    name: "Knowledge Bank",
    // component:Dashboard
  },
  {
    name: "Reports",
    // component:Dashboard
  },
];

export const sidebarItems = [
  {
    name: "Dashboard",
    id: "dashboard",
    icon: LayoutDashboard,
    route: "/"
    // route: "/ai-assistant"
  },
  {
    name: "AI Assistant",
    id: "ai-assistant",
    icon: Bot,
    route: "/ai-assistant"
    // route: "/ai-assistant"
  },
  {
    name: "Help & FAQs",
    id: "help-faqs",
    icon: CircleHelp,
    route: "/help-faqs",
  },
  {
    name: "Feedback",
    id: "feedback",
    icon: MessageCircle,
    route: "/feedback",
  },
  {
    name: "My Files",
    id: "my-files",
    icon: Folder,
    route: "/myFiles",
  },
  {
    name: "Analytics",
    id: "analytics",
    icon: ChartBar,
    route: "/analytics",
  },
  {
    name: "Settings",
    id: "settings",
    icon: Settings,
    route: "/settings",
  },
];

export const sidebarQuickAccess = [
  {
    name: "Recent Lessons",
    icon: FileText,
    color: "blue",
    route: "/recentLessons",
  },
  {
    name: "Assessments",
    icon: ClipboardCheck,
    color: "green",
    route: "/recentAssessment",
  },
  {
    name: "Student Conduct",
    icon: Users,
    color: "yellow",
    route: "/recentStudentConduct",
  },
];

export const sidebarTabsContentData = [
  {
    value: "AI Assistant",
    component: AiAssitstant,
    // compoenent:
  },
  {
    value: "Help & FAQs",
    component: "",
  },
] as const;

export const aiAssistantTabs = [
  // { name: "Overview", id: "overview", component: Overview, icon: LayoutDashboard },
  { name: "Subject Lesson Plan", id: "subject-lesson-plan", component: LessonPlans, icon: BookOpenText },
  { name: "Subject Assessments", id: "subject-assessments", component: Assessments, icon: ClipboardList },
  { name: "Student Conduct and Character Lesson Plan", id: "student-conduct-and-character-lesson-plan", component: StudentConductCharacterPlan, icon: ScrollText },
  { name: "Student Conduct and Character Assessments", id: "student-conduct-and-character-assessments", component: StudentConductCharacterAssessment, icon: UserCog },
  { name: "Project tasks", component: ProjectTask, id: "project-tasks", icon: Hammer },
  { name: "Project Tasks Lesson Facilitation Plan", id: "project-tasks-lesson-facilitation-plan", component: ProjectTaskFacilitation, icon: Hammer },
  { name: "Lesson Plan Marking & Report Generator", id: "lesson-plan-marking", component: ReportGenerator, icon: FileText },

  // { name: "Marking", component: Marking, icon: PencilRuler },
  // { name: "Help", component: Help, icon: LifeBuoy },
] as const;

export const aiAssistantOverviewFeatures = [
  {
    heading: "Lesson Planning",
    description:
      "Create subject-specific lesson plans aligned with Tongston's entrepreneurial education scheme.",
    icon: Presentation,
    tabValue: aiAssistantTabs[1].name,
    CTA: "Start Planning a Lesson",
    color: {
      highlighted: "bg-blue-500/40",
      default: "text-blue-700",
    },
  },
  {
    heading: "Assessments",
    description:
      "Design continuous and end-of-term assessments with marking guides and model answers.",
    icon: ClipboardCheck,
    tabValue: aiAssistantTabs[2].name,
    CTA: "Create Assessment",
    color: {
      highlighted: "bg-green-500/40",
      default: "text-green-700",
    },
  },
  {
    heading: "Project Tasks",
    description:
      "Create entrepreneurial project-based learning tasks that build real-world skills.",
    icon: Projector,
    CTA: "Launch New Project Tasks",
    tabValue: aiAssistantTabs[5].name,
    color: {
      highlighted: "bg-yellow-500/40",
      default: "text-yellow-700",
    },
  },
  {
    heading: "Student Conduct and Character Lesson Plan",
    description:
      "Generate student conduct & character assessments linkedin to Tongston's KPIs.",
    icon: UserCheck,
    CTA: "Plan Conduct Lesson",
    tabValue: aiAssistantTabs[3].name,
    color: {
      highlighted: "bg-purple-500/40",
      default: "text-purple-700",
    },
  },
  {
    heading: "Marking & Reports",
    description:
      "Mark lesson plans and generate comprehensive performance reports",
    icon: CircleCheckBig,
    CTA: "Start Marking",
    tabValue: aiAssistantTabs[6].name,
    color: {
      highlighted: "bg-red-500/40",
      default: "text-red-700",
    },
  }
] as const;

export const aiAssistantRecentActivities = [
  {
    name: "lesson plan generated",
    icon: Presentation,
    color: {
      highlighted: "bg-yellow-500/40",
      default: "text-yellow-700",
    },
  },
  {
    name: "assessments created",
    icon: ClipboardCheck,
    color: {
      highlighted: "bg-teal-500/40",
      default: "text-teal-700",
    },
  },
  {
    name: "projects in progress",
    icon: Projector,
    color: {
      highlighted: "bg-orange-500/40",
      default: "text-orange-700",
    },
  },
] as const;

const apisList = [
  "search/lessonPlan",
  "search/assessmentPlan",
  "insertFeedback",
  // fresh
  "subject/lessonPlan",
  "subject/assessmentPlan",
  "student/ConductCharacter",
  "student/ConductCharacterAssessment",
  "projectTask",
  "project/Facilitation",
  "getReport"
] as const


export const welcomeScreenList = [
  "Create subject-specific lesson plans and teaching notes aligned with Tongston’s entrepreneurial education scheme of work, and other schemes.",
  "Design subject-based continuous and end-of-term assessments, complete with marking guides and model answers.",
  "Create entrepreneurial project-based learning tasks that build real-world skills across cross-disciplinary subjects.",
  "Create entrepreneurial project-based weekly lesson facilitation plans and notes that enables teachers’ facilitate students building real-world skills across cross-disciplinary subjects through projects.",
  "Create student conduct & character lesson plans and teaching notes aligned with Tongston’s entrepreneurial education model.",
  "Generate student conduct & character continuous & end-of-term assessments linked to Tongston’s student conduct and character KPIs.",
  "Mark lesson plans and generate reports.",
  "Access a Question Bank with SUBJECT CONTINUOUS ASSESSMENT / END OF TERM ASSESSMENTS; STUDENT CONDUCT & CHARACTER KPIS CONTINUOUS ASSESSMENT / END OF TERM ASSESSMENTS & PROJECTS (TASKS).",
  "Access Folders of LESSON PLAN MARKING REPORTS",
  "Access Folders of STUDENT CONDUCT & CHARACTER KPIS LESSON PLAN & NOTES",
  "Access Folders of PROJECTS (TASKS) WEEKLY LESSON FACILITATION PLAN & NOTES",
  "Access Folders of SUBJECT LESSON PLAN & NOTES",
  "Compile student performance reports for parent and school insights.",
  "Access Folder of student performance reports."
]

export const faqCategories = [
  {
    label: "Navigating the AI Generator",
    id: "navigating-the-ai-generator"
  },
  { label: "Understanding the Outputs", id: "understanding-the-outputs" },
  { label: "Troubleshooting", id: "troubleshooting" },
  { label: "Using the LMS", id: "using-the-lms" },
  { label: "For Teachers New to AI Tools", id: "for-teachers-new-to-ai-tools" },
  { label: "Common Questions from Beginners", id: "common-questions-from-beginners" },
  { label: "Generator Walkthrough FAQs", id: "generator-walkthrough-faqs" }
]

export const faqList = [
  {
    "category": "Navigating the AI Generator",
    "faqs": [
      {
        "prompt": "How do I start generating a lesson plan?",
        "response": "Go to the Lesson Plan Generator page, fill in the dropdowns (class, subject, topic, etc.), then click “Generate.” The AI will build a full SMART lesson plan for you."
      },
      {
        "prompt": "What is a Suggestions for Refinement box?",
        "response": "It’s a plain-text box beside each form field. Use it to give extra instructions to the AI — like “make this interactive” or “add visual activity.”"
      },
      {
        "prompt": "Why is my Generate button not working?",
        "response": "Ensure all required fields are filled — especially class, subject, and topic. Then click “Generate.” If it still fails, refresh the page and try again."
      },
      {
        "prompt": "Where do I find my previous outputs?",
        "response": "At the moment, previous outputs are not stored permanently. Make sure to download your PDF after generation. A dashboard for saved outputs is coming soon."
      }
    ]
  },
  {
    "category": "Understanding the Outputs",
    "faqs": [
      {
        "prompt": "What is included in a lesson plan?",
        "response": "Each AI-generated lesson plan includes objectives, materials, introduction, teaching activities, student activities, assessment, and conclusion."
      },
      {
        "prompt": "What is a project task?",
        "response": "A project task is a real-world learning activity that blends multiple subjects. It helps students apply their skills entrepreneurially."
      },
      {
        "prompt": "Can I edit the generated PDF?",
        "response": "No. PDFs are locked to protect the content. You can use the Suggestions for Refinement box to adjust the output and re-generate."
      },
      {
        "prompt": "Why is the output too short?",
        "response": "If the result is too brief, try selecting a higher Bloom’s Taxonomy level like “Analyze” or “Create,” or enter a more detailed topic."
      }
    ]
  },
  {
    "category": "Troubleshooting",
    "faqs": [
      {
        "prompt": "The chatbot doesn’t understand my prompt",
        "response": "Try simplifying your prompt or check if dropdowns are properly selected. You can also use the quick FAQ buttons for faster answers."
      },
      {
        "prompt": "I’m getting a blank or empty output",
        "response": "Please ensure all fields are filled. If the issue persists, refresh and try again. If unresolved, email t-world@tongston.com."
      },
      {
        "prompt": "How do I contact support?",
        "response": "You can email t-world@tongston.com or click “Contact Support” in the chatbot. We’ll get back to you within 24–48 hours."
      },
      {
        "prompt": "How do I give feedback on an output?",
        "response": "After you generate content, scroll down and click thumbs up/down or a rating from 1–5 stars. Your feedback helps us improve the AI."
      }
    ]
  },
  {
    "category": "Using the LMS",
    "faqs": [
      {
        "prompt": "How do I update my profile?",
        "response": "Log in to your TEENS LMS dashboard, click “My Profile,” and update your subjects, classes, and certifications."
      },
      {
        "prompt": "What is the AI Assistant tab?",
        "response": "It’s where you generate lesson plans, assessments, character development templates, and more — all using Tongston’s AI."
      },
      {
        "prompt": "Where can I learn how to teach better?",
        "response": "Go to “My Courses” in your LMS. You’ll find CPD-accredited training courses to help you improve your teaching methods."
      }
    ]
  },
  {
    "category": "For Teachers New to AI Tools",
    "faqs": [
      {
        "prompt": "What is the AI Assistant used for?",
        "response": "The AI Assistant helps you create lesson plans, assessments, project tasks, and character-building templates — all aligned with curriculum and entrepreneurship principles. It saves time and improves your teaching impact."
      },
      {
        "prompt": "I’ve never used AI before. Where do I start?",
        "response": "Start by selecting a generator from the AI Assistant tab (e.g., Lesson Plan). Fill in the form with your class and subject info, then click Generate. The AI will create your content for you."
      },
      {
        "prompt": "What do I need to prepare before using the AI?",
        "response": "You need to know your subject, class/year, topic, and how long your lesson will be. You can also type your school’s curriculum and any other details."
      },
      {
        "prompt": "Is this AI difficult to use?",
        "response": "Not at all! You just fill a simple form and click Generate. The AI handles the rest. You can also adjust results using Suggestions for Refinement."
      }
    ]
  },
  {
    "category": "Common Questions from Beginners",
    "faqs": [
      {
        "prompt": "Is the AI replacing me as a teacher?",
        "response": "No — the AI is here to support you. You are the expert. The AI helps you prepare faster and with better quality, but you remain in control."
      },
      {
        "prompt": "How do I know if the AI content is correct?",
        "response": "Every output is based on Tongston’s curriculum and benchmarked content. You should always review and adjust based on your classroom needs."
      },
      {
        "prompt": "Can I use AI content in my classroom?",
        "response": "Yes — all outputs are designed for immediate use in real lessons. Download them as PDFs and use them during class."
      },
      {
        "prompt": "What if I don’t understand the output?",
        "response": "You can rephrase your input, use the refinement box, or click Help again. You can also email support for clarification."
      }
    ]
  },
  {
    "category": "Generator Walkthrough FAQs",
    "faqs": [
      {
        "prompt": "How do I generate a subject lesson plan?",
        "response": [
          "Go to the “Subject Lesson Plan & Notes Generator” tab.",
          "Select your Class/Year level.",
          "Choose your Subject Discipline and Subject.",
          "Type your Topic (e.g., Photosynthesis).",
          "Choose Lesson Duration",
          "Choose Class Size.",
          "Choose your Bloom’s Taxonomy level if you want to control difficulty.",
          "Click Generate.",
          "Your lesson will appear. Download as PDF or save it."
        ]
      },
      {
        "prompt": "How do I create a subject assessment?",
        "response": [
          "Go to “Subject Continuous Assessment / End of Term Generator.”",
          "Fill the same fields as lesson plans: Class, Subject, Topic, Curriculum.",
          "Choose Number of Questions.",
          "Click Generate to get your assessment, including correct answers and short justifications."
        ]
      },
      {
        "prompt": "How do I generate student conduct lesson plans?",
        "response": [
          "Go to “Student Conduct & Character KPIs Lesson Plan Generator.”",
          "Select the appropriate Class and Topic/KPI.",
          "Choose Lesson Duration.",
          "Click Generate.",
          "AI creates activities, reflections, and behavioral strategies."
        ]
      },
      {
        "prompt": "How do I generate a project task?",
        "response": [
          "Go to the “Project (Tasks) Generator.”",
          "Select the Class and Subject.",
          "Type the core topic or objective (e.g., Waste Management).",
          "AI will design a real-world, interdisciplinary project.",
          "Click Generate."
        ]
      }
    ]

  }
]

export const homePageWalkthroughSteps: IWalkthroughSteps[] = [
  // {
  //   content: "Create subject-specific lesson plans and teaching notes aligned with Tongston’s entrepreneurial education scheme of work, and other schemes.",
  //   selector: `#welcome-accordion`,
  // },
  {
    content:
      "Need guidance? Click here to explore Help & FAQs. This section answers common questions like how to generate lesson plans, assessments, and access reports.",
    selector: "#help-faqs",
  },
  {
    content: "Share your thoughts and help us improve the AI Assistant and platform experience.",
    selector: "#feedback"
  },
  {
    content: `Welcome to the AI Teaching Assistant! This tool helps you quickly create lesson plans, student assessments, project tasks, and conduct reports using AI. Whether you're planning a subject lesson, marking work, or tracking student behavior, everything you need is available in one place. Simply choose a section from the sidebar to begin.`,
    selector: `#subject-lesson-plan`
  },
  {
    content: `To create a subject lesson plan, go to the “Lesson Plan & Notes” section. Select the class, subject, topic, and curriculum type from the dropdowns. You’ll also be asked to choose the lesson duration and class size. Once you fill in the fields, click the generate button and your full lesson plan will be created. You can then download or save it for classroom use.`,
    selector: `#subject-assessments`
  },
  {
    content: `To generate subject assessments, open the “Assessments” section. After selecting your class, subject, and topic, choose how many questions you want in the test. Click generate, and the AI will create a quiz with answers. You can edit or approve the questions, then save them to your question bank for future use.`,
    selector: `#student-conduct-and-character-lesson-plan`
  },
  // {
  //   content: `🧑‍🎓In the “Character Lesson Plan” section, you can create lesson plans that help build student behavior and character. Choose the class level and topic, such as leadership or honesty, and set the lesson duration. After clicking generate, the AI will create structured activities and strategies. You can review and save the plan as needed.`,
  //   selector: `#student-conduct-and-character-lesson-plan`
  // },
  // {
  //   content: `To assess student behavior, go to the “Character Assessments” section. Select the class and behavioral topic (KPI), then let the AI generate appropriate questions. You can make edits if necessary, and then save the questions into your custom question bank for use during evaluations.`,
  //   selector: `#student-conduct-and-character-lesson-plan`
  // },
  {
    content: `If you want to assign project-based learning, visit the “Project Tasks” section. Select the class and subject, then enter a real-world topic like environmental safety or innovation. Click generate and the AI will produce a hands-on project task. Save the task and assign it to groups or individual students based on your schedule.
`,
    selector: `#project-tasks`
  },
//   {
//     content: `To plan weekly lessons for projects, head to the “Project Weekly Plan” section. After selecting how many weeks your project will run, fill in basic details like class and topic. The AI will automatically generate weekly breakdowns, reflection prompts, and cross-disciplinary teaching cues. You can review and adjust the content, then save the facilitation plan for teaching use.
// `,
//     selector: `#${aiAssistantTabs[6].id}`
//   },
  // {
  //   content: `To evaluate your own lesson plan, open the “Marking & Report” section. Upload your completed lesson plan and select the marking criteria. Click generate, and the AI will rate your lesson across 10 teaching standards, giving you a score and detailed feedback. Save the report and use it to improve future lesson delivery.`,
  //   selector: `#${aiAssistantTabs[6].id}`
  // }
]

export const helpWalkthroughSteps: IWalkthroughSteps[] = [
  {
    content: "To begin generating content, simply navigate to the Lesson Plan Generator page. Select options from the dropdowns like class, subject, and topic. After that, click “Generate” and the AI will produce a complete SMART lesson plan. Each form field also includes a “Suggestions for Refinement” box where you can guide the AI to make outputs more interactive or visually engaging. If the “Generate” button isn’t responding, ensure all required fields are filled. If issues continue, try refreshing the page. Note that currently, outputs aren’t saved, so download your PDF immediately. A saved dashboard feature is coming soon.",
    selector: `#${faqCategories[0].id}`,
  },
  {
    content: "Every AI-generated lesson plan is designed to be classroom-ready. It includes structured elements like objectives, materials, introductions, student and teaching activities, assessments, and conclusions. You’ll also find project tasks — interdisciplinary, real-world learning activities that support entrepreneurial thinking. While PDFs can't be edited directly, you can use the refinement boxes to adjust instructions and re-generate better versions. If an output seems too short, consider selecting a higher Bloom’s Taxonomy level such as “Analyze” or “Create,” or provide a more detailed topic.",
    selector: `#${faqCategories[1].id}`
  },
  {
    content: "If the AI doesn’t understand your input, try simplifying your language or double-check that all dropdown selections are complete. Blank or empty outputs usually indicate that some required fields are missing. Refresh the page and try again. If problems continue, you can email support at t-world@tongston.com. For any feedback, simply use the thumbs up/down buttons or star ratings available after generation — this helps improve future outputs.",
    selector: `#${faqCategories[2].id}`
  },
  {
    content: "To manage your profile on the LMS, log into your dashboard and click on “My Profile” to update details such as subjects and certifications. The “AI Assistant” tab is your go-to tool for generating lesson plans, assessments, and more. If you’re looking to enhance your teaching skills, check the “My Courses” section — it includes CPD-accredited trainings that can help you level up professionally and improve classroom effectiveness.",
    selector: `#${faqCategories[3].id}`
  },
  {
    content: "The AI Assistant is built to support, not replace, teachers. It helps you quickly generate high-quality lesson plans, assessments, project ideas, and character-building templates aligned with curriculum goals. If you're new to AI, simply select a generator (like Lesson Plan), fill in your class and subject info, and click Generate. Be prepared with your topic, lesson duration, and any special curriculum instructions. The interface is beginner-friendly — just fill out the form and let the AI handle the rest.",
    selector: `#${faqCategories[4].id}`
  },
  {
    content: "Many new users wonder whether AI is replacing teachers — it’s not. The AI serves as your assistant, allowing you to prepare better and faster. All content is based on Tongston’s curriculum and should still be reviewed for personal classroom use. The PDFs generated are fully ready to use in class, and if you ever don’t understand an output, you can rephrase your inputs or contact support for help. Remember, you're in control of what gets used in your classroom.",
    selector: `#${faqCategories[4].id}`
  },
  {
    content: "To generate a Subject Lesson Plan, visit the “Subject Lesson Plan & Notes Generator,” choose class, subject, topic, duration, and Bloom’s level, then click Generate. For Subject Assessments, use the “Continuous Assessment / End of Term Generator,” select similar fields, pick the number of questions, and generate the output. To create Student Conduct and Character Lesson Plans, go to the respective generator, select class and KPI topic, then click Generate for a structured behavior-focused lesson. For Project Tasks, open the Project Generator, choose class and subject, define the topic, and generate an interdisciplinary project ready for use.",
    selector: `#${faqCategories[4].id}`
  },
]

export const latestPlanList = [
  "projectTaskFacilitationPlan",
  "projectTaskPlan",
  "reportGenerator",
]

export const latestLesson = "subjectLessonPlan"

export const latestAssessmentPlan = [
  "subjectAssessmentPlan",
  "studentConductCharacterAssessmentPlan",
]

export const latestStudentConductPlan = [
  "studentConductCharacterPlan",
  "studentConductCharacterAssessmentPlan"
]



export type ApiType = typeof apisList[number]