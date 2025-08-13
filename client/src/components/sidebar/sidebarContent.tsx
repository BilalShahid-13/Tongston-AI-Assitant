// import type { SidebarContentProps } from "@/types";

import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";


const SidebarContent = ({ children, className, style }: { children?: React.ReactNode, className?: string, style?: React.CSSProperties }) => {
  return (
    <>
      <ScrollArea className={cn("h-[100vh]", className)} style={style}>{children}</ScrollArea>
      {/* <div className={className} style={style}>{children}</div> */}
    </>
  );
};

export default SidebarContent;
