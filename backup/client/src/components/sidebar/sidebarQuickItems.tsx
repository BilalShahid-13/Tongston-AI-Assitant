import { sidebarQuickAccess } from "@/lib/constant";
import { useTabStore } from "@/store/tabStore";
import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { TabsList, TabsTrigger } from "../ui/tabs";
const SidebarQuickAccess = () => {
  const { tabValue } = useTabStore();

  return (
    <>
      <SidebarMenu>
        {sidebarQuickAccess.map((item, index) => (
          <SidebarMenuItem key={index}>
            <TabsList className="w-full h-12 flex justify-start items-center">
              <TabsTrigger
                key={index}
                value={item.name}
                className={`tabStyle ${tabValue === item.name ? "bg-yellow-300 data-[state=active]:bg-yellow-300" : "bg-neutral-50"}
                  transition-colors duration-300 `} // Highlight active tab
              >
                {item.icon && <item.icon color={item.color} />}
                <h6>{item.name}</h6>
              </TabsTrigger>
            </TabsList>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
};

export default SidebarQuickAccess;
