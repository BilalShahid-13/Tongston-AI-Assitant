import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { useSidebarStore } from "@/store/sidebarStore";
import { SidebarItemList } from "./sidebarItemList";
import SidebarQuickAccess from "./sidebarQuickItems";

export function AppSidebar() {
  const { isOpen } = useSidebarStore();
  const { setOpen } = useSidebar()

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className={`relative transition-all duration-500 ease-in-out h-full`}
    >
      {/* <Navbar /> */}
      <SidebarContent
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <SidebarGroup>
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
