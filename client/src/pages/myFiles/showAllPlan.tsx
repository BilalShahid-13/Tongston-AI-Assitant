import BreadCrumb from "@/components/breadcrumb";
import { Loader } from "@/components/Loader";
import { MyFilesCard } from "@/components/myFilesCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { backendApi } from "@/lib/constant";
import { useSidebarStore } from "@/store/sidebarStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, BookOpen, ClipboardCheck, FileText, FolderOpen, Settings, Terminal, User, Users } from "lucide-react";
import { useMemo, useState } from "react";

const filterButtons = [
  {
    label: "Subject Lesson Plan",
    icon: BookOpen,
    color: "from-[#ffb900] to-[#fe9a00]",
    hoverColor: "hover:from-[#fe9a00] hover:to-[#ffb900]",
  },
  {
    label: "Subject Assessments",
    icon: ClipboardCheck,
    color: "from-[#ffb900] to-[#fe9a00]",
    hoverColor: "hover:from-[#fe9a00] hover:to-[#ffb900]",
  },
  {
    label: "Student Conduct & Character Assessments",
    icon: Users,
    color: "from-[#ffb900] to-[#fe9a00]",
    hoverColor: "hover:from-[#fe9a00] hover:to-[#ffb900]",
  },
  {
    label: "Project (Tasks)",
    icon: FolderOpen,
    color: "from-[#ffb900] to-[#fe9a00]",
    hoverColor: "hover:from-[#fe9a00] hover:to-[#ffb900]",
  },
  {
    label: "Project (Tasks) Lesson Facilitation Plan",
    icon: Settings,
    color: "from-[#ffb900] to-[#fe9a00]",
    hoverColor: "hover:from-[#fe9a00] hover:to-[#ffb900]",
  },
  {
    label: "Student Conduct & Character Lesson Plan",
    icon: User,
    color: "from-[#ffb900] to-[#fe9a00]",
    hoverColor: "hover:from-[#fe9a00] hover:to-[#ffb900]",
  },
  {
    label: "Lesson Plan Marking & Reports",
    icon: FileText,
    color: "from-[#ffb900] to-[#fe9a00]",
    hoverColor: "hover:from-[#fe9a00] hover:to-[#ffb900]",
  },
]

async function fetchPlanFiles() {
  const { data } = await axios.get(`${backendApi}/api/getPlanFiles`);
  return data;
}
export default function ShowAllPlan() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['planFiles'],
    queryFn: fetchPlanFiles,
  });

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc") // Default to newest first
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [animatingCard, setAnimatingCard] = useState<number | null>(null)
  const { isOpen } = useSidebarStore();
  const filteredLessonPlans = useMemo(() => {
    if (!data?.data) return []
    return data.data.filter((plan: any) => {
      const planTags = Array.isArray(plan.metaData) ? plan.metaData : [plan.metaData]
      return !selectedFilter || planTags.includes(selectedFilter)
    })
  }, [data, selectedFilter])


  const sortedLessonPlans = useMemo(() => {
    const sorted = [...filteredLessonPlans].sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [filteredLessonPlans, sortOrder]);


  const handleFilterClick = (filterLabel: string) => {
    setSelectedFilter(filterLabel === selectedFilter ? null : filterLabel)
    // Trigger card animation
    setAnimatingCard(Date.now())
    setTimeout(() => setAnimatingCard(null), 600)
  }

  if (isLoading) return <Loader />;
  if (error instanceof Error) return (
    <Alert variant="destructive">
      <Terminal />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Somethings went wrong please try again
      </AlertDescription>
    </Alert>
  );
  return (
    <>
      <BreadCrumb section="My Files" className="text-white font-medium" />
      <div className="flex flex-col gap-6 p-4 max-xs:max-w-full">
        {/* Header */}
        {/* Sort Controls */}
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                {sortOrder === "desc" ? (
                  <ArrowDownWideNarrow className="h-4 w-4" />
                ) : (
                  <ArrowUpWideNarrow className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                <ArrowUpWideNarrow className="h-4 w-4 mr-2" />
                Oldest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Filter Buttons */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100">Filter by Category</h3>
          <div className={`grid grid-cols-3 max-sm:grid-cols-1
        max-lg:grid-cols-2 max-xl:grid-cols-3 gap-3
          ${!isOpen ? "max-md:grid-cols-2 max-lg:grid-cols-2" : ""}`}>
            {filterButtons.map((filter) => {
              const Icon = filter.icon
              const isSelected = selectedFilter === filter.label

              return (
                <Button
                  key={filter.label}
                  onClick={() => handleFilterClick(filter.label)}
                  className={`
                  relative overflow-hidden group h-auto p-4 rounded-xl border-0 shadow-md
                  transition-all duration-300 transform hover:scale-105 hover:shadow-xl
                  ${isSelected
                      ? `bg-gradient-to-r ${filter.color} text-white shadow-lg scale-105 ring-2 ring-[#ffb900]/30`
                      : "bg-[var(--k12-secondary)]/50 hover:bg-gradient-to-r hover:from-[var(--k12-secondary)]/10 hover:to-[var(--k12-secondary)]/10 text-gray-700 dark:text-neutral-100 border border-gray-200 dark:border-zinc-500 hover:border-[var(--k12-secondary)]/30"
                    }
                `}
                  variant="ghost"
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}

                  {!isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ffb900]/5 to-[#fe9a00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  )}

                  <div className="flex flex-col items-center gap-2 relative z-10">
                    <Icon
                      className={`h-5 w-5 transition-all duration-300 ${isSelected ? "scale-110 drop-shadow-sm" : "group-hover:scale-110 group-hover:text-[#fe9a00]"
                        }`}
                    />
                    <span
                      className={`text-xs font-medium text-center leading-tight transition-colors duration-300 ${!isSelected ? "group-hover:text-[#fe9a00]" : ""
                        }`}
                    >
                      {filter.label}
                    </span>
                  </div>

                  <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-30 bg-gradient-to-r from-[#ffb900] to-[#fe9a00] transition-opacity duration-150" />
                </Button>
              )
            })}
          </div>

          {selectedFilter && (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-[#ffb900]/10 to-[#fe9a00]/10 border border-[#ffb900]/30 rounded-lg backdrop-blur-sm">
              <div className="h-2 w-2 bg-gradient-to-r from-[#ffb900] to-[#fe9a00] rounded-full animate-pulse shadow-sm" />
              <span className="text-sm text-[#fe9a00] font-medium">
                Showing results for: <strong className="text-[#ffb900]">{selectedFilter}</strong>
              </span>
              <Button
                onClick={() => setSelectedFilter(null)}
                variant="ghost"
                size="sm"
                className="ml-auto h-6 w-6 p-0 text-[#fe9a00] hover:text-[#fe9a00] hover:bg-[#ffb900]/10 rounded-full transition-all duration-200"
              >
                ×
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredLessonPlans.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <FileText className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-600">
                {selectedFilter ? "No plans found for this category" : "No plans available"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1">
              {sortedLessonPlans.map((plan: any, idx: number) => (
                // {filteredLessonPlans.map((plan: any, idx: number) => (
                <div
                  key={idx}
                  className={`
                  transition-all duration-500 transform
                  ${animatingCard ? "animate-pulse scale-[0.98]" : "hover:scale-[1.01]"}
                `}
                  style={{
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  <MyFilesCard data={plan} onView={() => { }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
