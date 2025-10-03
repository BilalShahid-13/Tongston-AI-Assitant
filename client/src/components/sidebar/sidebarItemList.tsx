import { useIsMobile } from '@/hooks/use-mobile';
import { sidebarItems } from '@/lib/constant';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar';

export const SidebarItemList = () => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile()
  const { setOpenMobile, open } = useSidebar()
  const navigate = useNavigate();
  console.log(open)
  return (
    <SidebarMenu>
      {sidebarItems.map((item) => {
        const isActive = pathname === item.route;
        return (
          <SidebarMenuItem key={item.route}>
            <SidebarMenuButton
              onClick={() => {
                isMobile && setOpenMobile(false)
                navigate({ to: item.route })
              }}
              className={`relative tabStyle ${isActive
                ? 'text-zinc-800 font-semibold'
                : `text-slate-700 dark:text-slate-300 hover:bg-yellow-300
                 dark:hover:bg-yellow-400 dark:hover:text-zinc-700`
                } transition-all duration-300 z-10 flex items-center justify-start gap-2 px-3 py-2 rounded-lg`}
            >
              {item.icon && (
                <item.icon
                  className={"w-24 h-24"} // larger when collapsed
                />
              )}
              <span>{item.name}</span>
            </SidebarMenuButton>

            {isActive && (
              <motion.div
                layoutId="sidebar-highlight"
                className={`absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 z-0`}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};
