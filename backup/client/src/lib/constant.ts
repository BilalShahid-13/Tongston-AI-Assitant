import Assessments from "@/components/aiAssistant/tabs/assessments";
import Help from "@/components/aiAssistant/tabs/help";
import LessonPlans from "@/components/aiAssistant/tabs/lessonPlans";
import Marking from "@/components/aiAssistant/tabs/marking";
import Overview from "@/components/aiAssistant/tabs/overview";
import Projects from "@/components/aiAssistant/tabs/projects";
import StudentConduct from "@/components/aiAssistant/tabs/studentConduct";
import AiAssitstant from "@/content/aiAssistant";
import {
  Bot,
  ChartBar,
  CircleHelp,
  ClipboardCheck,
  FileText,
  Folder,
  Presentation,
  Projector,
  Settings,
  Users,
} from "lucide-react";

export const backendApi = 'tongston-ai-assitant-rt92.vercel.app';
// export const backendApi = 'http://localhost:3000'

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
    name: "AI Assistant",
    icon: Bot,
  },
  {
    name: "Help & FAQs",
    icon: CircleHelp,
  },
  {
    name: "My Files",
    icon: Folder,
  },
  {
    name: "Analytics",
    icon: ChartBar,
  },
  {
    name: "Settings",
    icon: Settings,
  },
];

export const sidebarQuickAccess = [
  {
    name: "Recent Lessons",
    icon: FileText,
    color: "blue",
  },
  {
    name: "Assessments",
    icon: ClipboardCheck,
    color: "green",
  },
  {
    name: "Student Conduct",
    icon: Users,
    color: "#d08700",
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
    // compoenent:
  },
] as const;

export const aiAssistantTabs = [
  { name: "Overview", component: Overview },
  { name: "Lesson Plans", component: LessonPlans },
  { name: "Assessments", component: Assessments },
  { name: "StudentConduct", component: StudentConduct },
  { name: "Projects", component: Projects },
  { name: "Marking", component: Marking },
  { name: "Help", component: Help },
] as const;

export const aiAssistantOverviewFeatures = [
  {
    heading: "Lesson Planning",
    description:
      "Create subject-specific lesson plans aligned with Tongston's entrepreneurial education scheme.",
    icon: Presentation,
    tabValue: "Lesson Plans",
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
    tabValue: "Builf New Assessment",
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
    CTA: "Launch New Project",
    tabValue: "Projects",
    color: {
      highlighted: "bg-yellow-500/40",
      default: "text-yellow-700",
    },
  },
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
] as const

export type ApiType = typeof apisList[number]