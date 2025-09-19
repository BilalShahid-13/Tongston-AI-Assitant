import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export type TimeFilter = "Day" | "Week" | "Month" | "Quarter" | "Year"

const FILTER_OPTIONS: TimeFilter[] = ["Day", "Week", "Month", "Quarter", "Year"]

interface CardFilterDropdownProps {
  selected: TimeFilter
  onSelect: (value: TimeFilter) => void
}

export function CardFilterDropdown({ selected, onSelect }: CardFilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          {selected}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {FILTER_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => onSelect(opt)}
            className="cursor-pointer"
          >
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
