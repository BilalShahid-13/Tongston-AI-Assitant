import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allCountryNames, subjectLists, yearClassMappings } from "@/constants/lessonPlanConstant";
import { useAnalyticsStore } from "@/store/analyticsStore";
import { BookOpen, Calendar, ClipboardCheck, MapPin, User } from "lucide-react";
import React from "react";

interface FilterSelectProps<T = string> {
  value: T;
  onChange: (val: T) => void;
  placeholder: string;
  icon: React.ReactNode;
  options: T[];
  className?: string;
}

export const FilterSelect = <T extends string>({
  value,
  onChange,
  placeholder,
  icon,
  options,
  className,
}: FilterSelectProps<T>) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-40 flex items-center gap-2 ${className || ""}`}>
        {icon}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};


export const GlobalFiltersBar: React.FC = () => {
  const { filters, setFilters, clearFilters } = useAnalyticsStore()

  // Get subjects filtered by discipline
  const filteredSubjects = filters.discipline
    ? subjectLists
      .filter((item) => item.discipline === filters.discipline)
      .map((item) => item.subject)
    : [...new Set(subjectLists.map((item) => item.subject))]

  const handleSubjectChange = (val: string) => {
    const relatedDiscipline = subjectLists.find((item) => item.subject === val)?.discipline
    setFilters({ subject: val, discipline: relatedDiscipline || "" })
  }

  return (
    <div className="flex flex-wrap gap-3 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-md items-center">
      <FilterSelect
        value={filters.dateRange}
        onChange={(val) => setFilters({ dateRange: val })}
        placeholder="Date Range"
        icon={<Calendar className="w-4 h-4 text-gray-500" />}
        options={["Day", "Week", "Month", "Quarter", "Year"]}
      />

      <FilterSelect
        value={filters.country}
        onChange={(val) => setFilters({ country: val })}
        placeholder="Country"
        icon={<MapPin className="w-4 h-4 text-gray-500" />}
        options={allCountryNames}
      />

      <FilterSelect
        value={filters.discipline}
        onChange={(val) => setFilters({ discipline: val })}
        placeholder="Discipline"
        icon={<BookOpen className="w-4 h-4 text-gray-500" />}
        options={[...new Set(subjectLists.map((item) => item.discipline))]}
      />

      <FilterSelect
        value={filters.subject}
        onChange={handleSubjectChange}
        placeholder="Subject"
        icon={<ClipboardCheck className="w-4 h-4 text-gray-500" />}
        options={filteredSubjects}
      />

      <FilterSelect
        value={filters.schoolLevel}
        onChange={(val) => setFilters({ schoolLevel: val })}
        placeholder="School Level"
        icon={<User className="w-4 h-4 text-gray-500" />}
        options={[...new Set(yearClassMappings.map((item) => item.normalized))]}
      />

      <Button variant="outline" onClick={() => clearFilters()}>
        Reset Filters
      </Button>
    </div>
  )
}
