import type { CSSProperties, HTMLAttributes, JSX, ReactNode } from "react";

export interface TabStore {
  tabValue: string;
  addTabValue: (value: string) => void;
}

export interface aiAssistantTabStore {
  tabValue: string;
  addTabValue: (value: string) => void;
}

export interface SidebarContentProps {
  children: ReactNode;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}

export interface SidebarStore extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
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
  currentPage: string;
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