import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarItemList } from "./sidebarItemList";
import SidebarQuickAccess from "./sidebarQuickItems";
import { useSidebarStore } from "@/store/sidebarStore";

export function AppSidebar() {
  const { isOpen } = useSidebarStore();
  return (
    <Sidebar variant="sidebar"
      className={`relative transition-all duration-500 ease-in-out h-full`}>
      <SidebarContent>
        <SidebarGroup className="mt-3 px-0">
          <SidebarItemList />
        </SidebarGroup>
        {/* 2nd group */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase font-inter">
            quick access
          </SidebarGroupLabel>
          <SidebarQuickAccess />
        </SidebarGroup>
      </SidebarContent>
      {!isOpen ?
        <SidebarTrigger className="cursor-pointer sticky bottom-0 right-0" />
       : null}
    </Sidebar>
  );
}
