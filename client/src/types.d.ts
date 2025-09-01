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