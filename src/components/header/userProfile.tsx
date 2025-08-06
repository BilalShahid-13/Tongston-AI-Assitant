import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useResponsive from "@/hooks/useResponsive";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
const UserProfile = () => {
  const { isTablet } = useResponsive();
  return (
    <div className="flex flex-row justify-end items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="Avatar Image"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Sara Johnson</DropdownMenuItem>
          <DropdownMenuItem>SaraJohnson@yopmail.com</DropdownMenuItem>
          <DropdownMenuSeparator />
          <Button
            variant="destructive"
            className="w-full cursor-pointer"
            onClick={() => console.log("Logging out...")}
          >
            <LogOut style={{ marginRight: "8px" }} />
            Logout
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
      {isTablet && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>Sara Johnson</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sara Johnson</DropdownMenuItem>
            <DropdownMenuItem>SaraJohnson@yopmail.com</DropdownMenuItem>
            <Button variant={"destructive"} className="w-full cursor-pointer">
              <LogOut />
              Logout
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default UserProfile;
