import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarStore } from "@/store/sidebarStore";
import { PanelRight } from "lucide-react";
import { Button } from "../ui/button";
import UserProfile from "./userProfile";

const Navbar = () => {
  // const { isTablet, isMobile, isDesktop } = useResponsive();
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebarStore()

  return (
    <nav className="w-full flex flex-row shadow-sm p-3 z-50">
      <div
        className={`flex flex-row w-full mx-3
          justify-start items-center
  ${isMobile ? "gap-0" : "gap-0"} gap-4`}
      >
        {!isMobile && <Button variant={"secondary"} size="icon"
          onClick={toggleSidebar}>
          <PanelRight />
        </Button>}
        <div className="max-sm:ml-12 flex flex-row items-center gap-2 justify-center">
          <img className="w-8 h-8" src="/favicon.ico" />
          <h2 className="text-[var(--k12-secondary)]
           font-semibold text-xl max-sm:text-sm">
            T-World K-12 EntreEdu AI
          </h2>
        </div>
      </div>
      <UserProfile />
    </nav>
  );
};

export default Navbar;
