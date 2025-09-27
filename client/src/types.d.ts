import type { CSSProperties, HTMLAttributes, JSX, ReactNode } from "react";

export interface TabStore {
  tabValue: string;
  addTabValue: (value: string) => void;
}

export interface aiAssistantTabStore {
  tabValue: string;
  addTabValue: (value: string) => void;
}

export interface ISidebarLinkProps {
  className?: string | undefined;
  route: string | ReactNode;
  value: string;
}

export interface SidebarStore extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  sidebarRef: RefObject<HTMLButtonElement> | null;
  isMobile: boolean;
  setSidebarRef: (ref: HTMLButtonElement) => void;
  toggleSidebar: () => void;
}

export interface CurriculumEntry {
  Subject?: string;
  "Year/Class"?: string;
  Topic?: string;
}

export interface TabContentProps {
  value: string;
  Component: JSX;
  className?: string | undefined;
}
export interface breadcrumbProps {
  section: string;
  currentPage?: string;
  className?: string;
}

export interface featureCardProps {
  heading: string;
  description: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  color: {
    highlighted: string;
    default: string;
  };
  index?: number | undefined;
  tabValue: string;
  CTA: string;
}

export interface activityItemProps {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  title: string;
  color: {
    highlighted: string;
    default: string;
  };
}

export interface LgasByState {
  [key: string]: string[];
  Lagos: string[];
  Abuja: string[];
  Kano: string[];
  Kaduna: string[];
}

export interface IWalkthroughSteps {
  content: string;
  // content: (props: { setCurrentStep: (step: number) => void }) => ReactNode;
  selector: string
}

export interface IHistory {
  userId?: string;
  fields?: string[];
  answer?: string;
  plan: string;
  createdAt?: Date;
  updatedAt?: Date;
  metaData?: string | string[]
}

export interface LessonPlanData {
  id?: string | undefined;
  answer: string;
  metaData: string[];
  createdAt?: string;
  isFavorite?: boolean;
}

// admin
export type FAQ = {
  id?: string
  heading: string
  description: string
  category: string
}


export type IResizableScrollable = {
  leftChildren: ReactNode;
  RightChildren: ReactNode;
  isOpen: boolean;
}

// analytics

// lib/types-and-constants.ts
import {
  BookOpen, Notebook, ClipboardCheck, ShieldCheck, Hammer, ListChecks, FileSpreadsheet,
  GraduationCap, Tags, CalendarDays, Tag, Layers, Blocks, BookA, Users, Workflow
} from 'lucide-react';

export type Level = 'Nursery' | 'Primary' | 'Secondary' | 'University';
export type TopTab = 'Lesson Plan' | 'Lesson Notes' | 'Assessments';


interface User {
  _id: string
  username: string
  subject: string
  role: string
}

export interface AnalyticsItem {
  _id: string
  userId: User
  fields: string[]
  answer: string
  plan: string
  metaData: string
  createdAt: string
  updatedAt: string
  __v: number
}


export interface IPlan {
  _id: string
  userId: {
    _id: string
    username: string
    subject: string
    role: string
  }
  fields: string[]
  answer: string
  plan:
  | "subjectAssessmentPlan"
  | "subjectLessonPlan"
  | "studentConductCharacterPlan"
  | "studentConductCharacterAssessmentPlan"
  | "projectTaskPlan"
  | "projectTaskFacilitationPlan"
  metaData: string
  createdAt: string
  updatedAt: string
  __v: number
}

export type Variant = "blue" | "violet" | "emerald" | "amber" | "rose" | "slate";


export interface AnalyticsCardChild {
  label: string
  value: string
  onSelect: (value: any) => void
  options: string[]
  placeholder: string
  icon: LucideIcon
}

export interface AnalyticsCardItem {
  statsTitle: string
  statsValue: string
  statsDescription: string
  Icon: LucideIcon
  variant: Variant
  statsCardDialogTitle: string
  statsCardDialogLabel: string
  onReset: () => void
  statsCardDialogChildren: AnalyticsCardChild[]
}


export type TimeRange = "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "";
