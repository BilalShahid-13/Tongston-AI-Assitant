import { sidebarTabsContentData } from "@/lib/constant";
import { useSidebarStore } from "@/store/sidebarStore";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Tabs } from "../ui/tabs";
import { AppSidebar } from "./appSidebar";
import SidebarContent from "./sidebarContent";
import TabContentComponent from "./tabContentComponent";
export function Layout() {
  const { isOpen, toggleSidebar } = useSidebarStore();
  return (
    <Tabs defaultValue="AI Assistant">
      <SidebarProvider
        onOpenChange={toggleSidebar}
        style={{
          "--sidebar-width": isOpen ? "0rem" : "15rem",
          "--sidebar-width-mobile": isOpen ? "0rem" : "10rem",
          "--sidebar-transition": "transform 0.3s ease-in-out",
        } as React.CSSProperties & Record<string, string>}
      >
        <AppSidebar />
        <SidebarTrigger
          variant="outline"
          className="fixed top-0 mt-[15px] ml-4"
          size="lg"
        />

        <SidebarContent
          className="relative"
        >
          {sidebarTabsContentData.map((item, index) => (
            <TabContentComponent
              key={index}
              value={item.value}
              Component={item.component}
            />
          ))}
        </SidebarContent>
      </SidebarProvider>
    </Tabs>
  );
}
