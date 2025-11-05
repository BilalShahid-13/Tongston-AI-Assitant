import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { allCountryNames, subjectLists, termList, yearClassMappings } from '@/constants/lessonPlanConstant';
import { useConductCharacterAssessmentsStore } from '@/store/analytics/conductCharacterAssessments';
import { useConductCharacterLessonStore } from '@/store/analytics/conductCharacterLesson';
import { useGlobalFiltersStore } from '@/store/analytics/globalFilters';
import { useProjectFacilitationStore } from '@/store/analytics/projectFacilitation';
import { useProjectTaskStore } from '@/store/analytics/projectTask';
import { useSubjectLessonStore } from '@/store/analytics/subjectLesson';
import { useSubjectAssessmentStore } from '@/store/analyticsStore';
import type { TimeRange } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  CalendarDays,
  Filter,
  Globe,
  GraduationCap,
  Lightbulb,
  User,
  X
} from 'lucide-react';
import React, { useMemo, useState } from 'react';


// Time range options with proper display mapping
const timeRangeOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" }
];

// Helper function to get display label for time range
const getTimeRangeLabel = (value: string): string => {
  const option = timeRangeOptions.find(opt => opt.value === value);
  return option ? option.label : value;
};

// Extract unique disciplines
const disciplines = [...new Set(subjectLists.map(item => item.discipline))].sort();

// Simple Select Component with Icon and Label
interface SelectOption {
  value: string;
  label: string;
}

interface SelectWithIconProps {
  label: string;
  value: string;
  onSelect: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder: string;
  icon?: React.ElementType;
  displayValue?: (value: string) => string;
}

export const SelectWithIcon: React.FC<SelectWithIconProps> = ({
  label,
  value,
  onSelect,
  options,
  placeholder,
  icon: Icon,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <Label className="text-sm font-medium">{label}</Label>
      </div>
      <Select value={value} onValueChange={onSelect}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => {
            const optionValue = typeof option === 'object' ? option.value : option;
            const optionLabel = typeof option === 'object' ? option.label : option;
            return (
              <SelectItem key={index} value={optionValue}
                className='capitalize max-w-sm'>
                {optionLabel}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

// Main Filter Component
type FilterKeys = "timeRange" | "country" | "discipline" | "subject" | "schoolLevel" | "term" | "topic";

interface FiltersState {
  timeRange: TimeRange;
  country: string;
  discipline: string;
  subject: string;
  schoolLevel: string;
  term: string;
  topic: string;
}

export default function GlobalFiltersBar() {
  const [filters, setFilters] = useState<FiltersState>({
    timeRange: "",
    country: "",
    discipline: "",
    subject: "",
    schoolLevel: "",
    term: "",
    topic: "",
  });

  const { setCountry, setDiscipline, setTerm, setTopic,
    resetFilters } = useGlobalFiltersStore();


  const subjectLessonPlan = useSubjectLessonStore(state => state.subjectLessonPlan);
  const subjectAssessmentPlan = useSubjectAssessmentStore(state => state.subjectAssessmentPlan);
  const conductCharacterLessonPlan = useConductCharacterLessonStore(state => state.conductCharacterLessonPlan);
  const conductCharacterAssessmentsPlan = useConductCharacterAssessmentsStore(state => state.conductCharacterAssessmentsPlan);
  const projectTaskPlan = useProjectTaskStore(state => state.projectTaskPlan);
  const projectFacilitationPlan = useProjectFacilitationStore(state => state.projectFacilitationPlan);

  const topicOptions = useMemo(() => {
    const plans = [
      subjectLessonPlan,
      subjectAssessmentPlan,
      conductCharacterLessonPlan,
      conductCharacterAssessmentsPlan,
      projectTaskPlan,
      projectFacilitationPlan
    ];

    const topics = plans
      .flat()
      .map(p => p?.fields?.topic)
      .filter(Boolean);

    return [...new Set(topics)] as string[];
  }, [
    subjectLessonPlan,
    subjectAssessmentPlan,
    conductCharacterLessonPlan,
    conductCharacterAssessmentsPlan,
    projectTaskPlan,
    projectFacilitationPlan
  ]);


  const updateFilter = (key: FilterKeys, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));

    const actions = useGlobalFiltersStore.getState();

    switch (key) {
      case "country": actions.setCountry(value); break;
      case "discipline": actions.setDiscipline(value); break;
      case "subject": actions.setSubject(value); break;
      case "schoolLevel": actions.setSchoolLevel(value); break;
      case "timeRange": actions.setTimeRange(value as TimeRange); break;
      case "term": actions.setTerm(value); break;
      case "topic": actions.setTopic(value); break;
    }
  };

  const clearAllFilters = () => {
    setFilters({
      timeRange: "",
      country: "",
      discipline: "",
      subject: "",
      schoolLevel: "",
      term: "",
      topic: "",
    });

    resetFilters()
  };

  const getSubjectsForDiscipline = (): string[] => {
    if (!filters.discipline) return subjectLists.map(item => item.subject);
    return subjectLists
      .filter(item => item.discipline === filters.discipline)
      .map(item => item.subject);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-background p-2">
      <div className="mx-auto">
        {/* {country} */}
        <Card className='h-auto'>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Filter className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Global Data Filters</CardTitle>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">
                    {activeFiltersCount} active
                  </Badge>
                )}
              </div>

              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
              {/* Time Range Filter */}
              <SelectWithIcon
                label="Time Range"
                value={filters.timeRange}
                onSelect={(value) => updateFilter('timeRange', value)}  // ✅ Just this
                options={timeRangeOptions}
                placeholder="Select time range"
                icon={Calendar}
              />

              {/* Country Filter */}
              <SelectWithIcon
                label="Country"
                value={filters.country}
                onSelect={(value) => {
                  setCountry(value);
                  updateFilter('country', value)
                }}
                options={allCountryNames}
                placeholder="Select country"
                icon={Globe}
              />

              {/* Discipline Filter */}
              <SelectWithIcon
                label="Discipline"
                value={filters.discipline}
                onSelect={(value) => {
                  updateFilter('discipline', value);
                  setDiscipline(value);
                }}
                options={disciplines}
                placeholder="Select discipline"
                icon={BookOpen}
              />

              {/* Subject Filter */}
              <SelectWithIcon
                label="Subject"
                value={filters.subject}
                onSelect={(value) => updateFilter('subject', value)}
                options={getSubjectsForDiscipline()}
                placeholder="Select subject"
                icon={BookOpen}
              />

              {/* School Level Filter */}
              <SelectWithIcon
                label="School Level"
                value={filters.schoolLevel}
                onSelect={(value) => {
                  updateFilter('schoolLevel', value)
                  // setSchoolLevel(value)
                }}
                options={yearClassMappings.map(item => item.normalized)}
                placeholder="Select school level"
                icon={GraduationCap}
              />
              {/* Term Filter */}
              <SelectWithIcon
                label="Term"
                value={filters.term}
                onSelect={(value) => {
                  updateFilter('term', value)
                  setTerm(value)
                }}
                options={termList.map(item => item)}
                placeholder="Select term"
                icon={CalendarDays}
              />
              {/* topic Filter */}
              <SelectWithIcon
                label="Topic"
                value={filters.topic}
                onSelect={(value) => {
                  updateFilter('topic', value)
                  setTopic(value)
                }}
                options={topicOptions}
                placeholder="Select student"
                icon={Lightbulb}
              />
              <SelectWithIcon
                label="Student"
                value={filters.topic}
                onSelect={() => {
                  // updateFilter('topic', value)
                  // setTopic(value)
                }}
                options={["Student Option Coming Soon"]}
                placeholder="Select student"
                icon={User}
              />
            </div>

            {/* Active Filters Display */}
            {/** 👇 AnimatePresence handles enter/exit animations */}
            <AnimatePresence>
              {activeFiltersCount > 0 && (
                <motion.div
                  key="active-filters-card"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <Card>
                    <CardContent className="pt-2">
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Active Filters:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(filters).map(([key, value]) => {
                            if (!value) return null;
                            const labels: Record<FilterKeys, string> = {
                              timeRange: "Time Range",
                              country: "Country",
                              discipline: "Discipline",
                              subject: "Subject",
                              schoolLevel: "School Level",
                              term: "Term",
                              topic: "Topic",
                            };

                            return (
                              <Badge
                                key={key}
                                variant="secondary"
                                className="flex items-center gap-2 px-3 py-1"
                              >
                                <span className="font-medium">{labels[key as FilterKeys]}:</span>
                                <span className="truncate max-w-32">
                                  {key === "timeRange" ? getTimeRangeLabel(value) : value}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-secondary"
                                  onClick={() => updateFilter(key as FilterKeys, "")}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}