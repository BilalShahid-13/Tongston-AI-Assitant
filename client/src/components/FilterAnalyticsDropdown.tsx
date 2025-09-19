import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAnalyticsStore } from "@/store/analyticsStore"
import { ChevronDown, type LucideProps } from "lucide-react"
import { useEffect, useState } from "react"

interface FilterAnalyticsDropdownProps {
  label: string
  list: string[]
  activeOptions: string[]
  onToggle: (key: string) => void
  color: string
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >
}

export function FilterAnalyticsDropdown({
  label,
  list,
  activeOptions,
  onToggle,
  color,
  Icon,
}: FilterAnalyticsDropdownProps) {
  const { analyticsData } = useAnalyticsStore()
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (item: string) => {
    setSelected(item)
    onToggle(item)
  }

  // ✅ Reset selected when global filters are cleared
  useEffect(() => {
    if (activeOptions.length === 0) {
      setSelected(null)
    }
  }, [activeOptions])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={selected ? "default" : "outline"}
          className={`flex items-center gap-2 w-full
            ${selected ? `bg-gradient-to-r ${color} text-white` : ""}`}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {selected || label}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-full">
        {list.map((item, index) => {
          const count = analyticsData.filter((d) =>
            d.fields?.includes(item)
          ).length

          return (
            <DropdownMenuItem
              key={index}
              onClick={() => handleSelect(item)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span>{item}</span>
              <Badge variant="secondary" className="ml-1">
                {count}
              </Badge>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
