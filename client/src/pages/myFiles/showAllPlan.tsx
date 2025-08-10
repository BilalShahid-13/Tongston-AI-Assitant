import BreadCrumb from "@/components/breadcrumb";
import { Loader } from "@/components/Loader";
import { MyFilesCard } from "@/components/myFilesCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { backendApi } from "@/lib/constant";
import type { IHistory, LessonPlanData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Terminal } from "lucide-react";
import { useMemo, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react"
import { Button } from "@/components/ui/button";
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

  const sortedLessonPlans = useMemo(() => {
    if (!data || !data.data) return [];
    const sorted = [...data.data].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [data, sortOrder]);


  console.log('my files', data)

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
  console.log(data.data)
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full h-12 bg-linear-65 px-4 rounded-b-md
       from-yellow-400 to-yellow-500 flex justify-start items-center">
        <BreadCrumb section="My Files" className="text-zinc-600 z-20" />
      </div>
      <div className="flex justify-end mb-6 mr-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
              {sortOrder === "desc" ? (
                <ArrowDownWideNarrow className="h-4 w-4" />
              ) : (
                <ArrowUpWideNarrow className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
      <div className="flex flex-col gap-3 mt-3">
        <div className="flex flex-col gap-y-2 mx-2">
          {sortedLessonPlans.map((plan: IHistory, index: number) => {
            const transformed: LessonPlanData = {
              answer: plan.answer ?? "",
              metaData: Array.isArray(plan.metaData)
                ? plan.metaData
                : plan.metaData
                  ? [plan.metaData]
                  : [],
              createdAt: plan.createdAt?.toString(),
            };

            return <MyFilesCard data={transformed} key={index} />;
          })}
        </div>

      </div>
    </div>
  );
}
