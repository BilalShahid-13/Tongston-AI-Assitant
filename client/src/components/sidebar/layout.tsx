import { useSidebarStore } from "@/store/sidebarStore";
import { Outlet, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useTransition } from "react";
import { Loader } from "../Loader";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./appSidebar";
import SidebarContent from "./sidebarContent";
export function Layout() {
  const { isOpen, toggleSidebar,sidebarRef } = useSidebarStore();
  const location = useLocation(); // 🧠 important
  const [isPending, startTransition] = useTransition(); // 🌀 React 18 transition hook
  const [currentPath, setCurrentPath] = useState(location.pathname);
  useEffect(() => {
    startTransition(() => {
      setCurrentPath(location.pathname);
    });
  }, [location.pathname]);
  return (
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
        // onClick={toggleSidebar}
        variant="outline"
        className="absolute top-0 left-0 ml-4 mt-6 hidden max-sm:flex"
        size="lg"
      />
      <AnimatePresence mode="wait">
        <SidebarContent className="w-full">
          {isPending ? <Loader /> : <motion.div
            key={currentPath}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>}
        </SidebarContent>
      </AnimatePresence>

    </SidebarProvider>
  );
}
