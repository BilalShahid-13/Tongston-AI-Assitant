// components/TimeFilterDropdown.tsx
import * as React from "react";
import type { TimeFilter } from "./CardFilterDropdown";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface TimeFilterDropdownProps {
  value: TimeFilter;
  onChange: (value: TimeFilter) => void;
}

const timeOptions: TimeFilter[] = ["Day", "Week", "Month", "Quarter", "Year"];

export const TimeFilterDropdown: React.FC<TimeFilterDropdownProps> = ({ value, onChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          {value} <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        {timeOptions.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onChange(option)}
            className={option === value ? "font-semibold" : ""}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
