import { FilterAnalyticsDropdown } from "@/components/FilterAnalyticsDropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FILTER_BUTTONS } from "@/lib/constant";
import { useAnalyticsStore } from "@/store/analyticsStore";

export default function AnalyticsFilter() {
  const { activeFilters, setActiveFilters, getTotalByPlanType, clearFilters } = useAnalyticsStore()

  const toggleFilter = (key: string) => {
    const newFilters = activeFilters.includes(key)
      ? activeFilters.filter((f) => f !== key) // remove
      : [...activeFilters, key]                // add

    setActiveFilters(newFilters)
  }


  return (
    <>
      <div
        className="
          grid grid-cols-3
          max-md:grid-cols-4
          gap-2 w-full max-sm:justify-center
          max-sm:flex max-sm:flex-col
        "
      >
        {FILTER_BUTTONS.slice(0, 13).map((filter, idx) => (
          <Button
            key={filter.key}
            onClick={() => toggleFilter(filter.key)}
            variant={activeFilters.includes(filter.key) ? "default" : "outline"}
            className={`
              flex items-center gap-2
              ${activeFilters.includes(filter.key) ? `bg-gradient-to-r ${filter.color} text-white` : ""}
              ${FILTER_BUTTONS.length % 2 !== 0 && idx === FILTER_BUTTONS.length - 1 ? "col-span-2" : ""}
            `}
          >
            <filter.icon className="h-4 w-4" />
            <span className="max-sm:text-xs">{filter.label}</span>
            {activeFilters.includes(filter.key) && (
              <Badge variant="secondary" className="ml-1">
                {getTotalByPlanType(filter.key)}
              </Badge>
            )}
          </Button>
        ))}

        {FILTER_BUTTONS.slice(13).map((filter, index) => (
          <FilterAnalyticsDropdown
            key={index}
            Icon={filter.icon}
            label={filter.label}
            list={filter.list ?? []}
            activeOptions={activeFilters}
            onToggle={toggleFilter}
            color={filter.color}
          />
        ))}

      </div>
      <Button onClick={clearFilters}
      className="hover:bg-[var(--k12-secondary)] transition-all duration-150 ease-in cursor-pointer">Reset Filters</Button>
    </>
  )
}
