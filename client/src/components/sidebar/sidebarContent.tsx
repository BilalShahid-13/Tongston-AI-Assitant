// import type { SidebarContentProps } from "@/types";

const SidebarContent = ({ children, className, style }: { children?: React.ReactNode, className?: string, style?: React.CSSProperties }) => {
  return <div className={className} style={style}>{children}</div>;
};

export default SidebarContent;
