import type { SidebarContentProps } from "@/types";

const SidebarContent = ({ children, className,style }: SidebarContentProps) => {
  return <div className={className} style={style}>{children}</div>;
};

export default SidebarContent;
