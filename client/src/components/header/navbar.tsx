import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react"; // Import hamburger menu icon
import { navbarItems } from "../../lib/constant";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserProfile from "./userProfile";

const Navbar = () => {
  // const { isTablet, isMobile, isDesktop } = useResponsive();
  const isMobile = useIsMobile();
  console.log("breakpoints", isMobile);

  return (
    <nav className="w-full top-0 flex flex-row shadow-sm p-3 z-50 bg-white">
      <div
        className={`flex flex-row w-full mx-3 justify-start items-center
        ${isMobile ? "gap-0" : "gap-0"}`}
      >
        <div className="flex flex-row justify-center items-center gap-5">
          <h2 className="text-yellow-400 font-semibold text-xl max-sm:text-sm text-center w-full ml-12">
            T-World K-12 EntreEdu AI
          </h2>

          {/* Hamburger Button for Mobile/Tablets */}
          <div>
            {isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="p-2">
                    <Menu size={24} />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="flex flex-col bg-white shadow-md p-4 w-48"
                >
                  {navbarItems.map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      className="py-2 text-zinc-800 font-medium"
                    >
                      {item.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Desktop Navbar Items */}
        <div>
          {!isMobile && (
            <div className="flex flex-row justify-center items-center gap-12 w-full">
              {navbarItems.map((items, index) => (
                <ul
                  key={index}
                  className="flex flex-row justify-between items-center text-zinc-800 font-medium"
                >
                  <li>{items.name}</li>
                </ul>
              ))}
            </div>
          )}
        </div>
      </div>

      <UserProfile />
    </nav>
  );
};

export default Navbar;
