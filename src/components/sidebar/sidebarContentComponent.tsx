import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import type { ISidebarLinkProps } from "@/types";

const SidebarLinkComponent = ({
  value,
  route,
  className,
}: ISidebarLinkProps) => {
  return (
    <Button className={className}>
      <Link to={route as string}>{value}</Link>
    </Button>
  );
};

export default SidebarLinkComponent;
