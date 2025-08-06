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

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar"
      className={`mt-[0vh] relative transition-all duration-500 ease-in-out h-full`}>
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
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>

      <SidebarFooter />
    </Sidebar>
  );
}
