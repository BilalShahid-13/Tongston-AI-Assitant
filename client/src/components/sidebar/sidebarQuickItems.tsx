import { sidebarQuickAccess } from "@/lib/constant";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { motion } from 'framer-motion';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

const gradientMap: Record<string, string> = {
  blue: "bg-gradient-to-r from-blue-400 to-blue-500",
  green: "bg-gradient-to-r from-green-400 to-green-500",
  yellow: "bg-gradient-to-r from-yellow-400 to-yellow-500"
};
const SidebarQuickAccess = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <SidebarMenu>
        {sidebarQuickAccess.map((item, index) => {
          const isActive = pathname === item.route;
          return (
            <SidebarMenuItem key={index} className="relative overflow-hidden">
              <SidebarMenuButton
                onClick={() => navigate({ to: item.route })}
                className={`relative tabStyle ${isActive
                  ? 'text-zinc-800 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-yellow-300 dark:hover:bg-yellow-400 dark:hover:text-zinc-700'
                  } transition-all duration-300 z-10 flex items-center justify-start gap-2 py-2 rounded-lg`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.name}</span>
              </SidebarMenuButton>

              {isActive && (
                <motion.div
                  layoutId="sidebar-highlight"
                  className={`absolute inset-0 rounded-lg ${gradientMap[item.color]} z-0`}
                  transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                />
              )}
            </SidebarMenuItem>
          );
        }
        )}
      </SidebarMenu>
    </>
  );
};

export default SidebarQuickAccess;
