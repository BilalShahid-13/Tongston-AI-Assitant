import { Loader } from "@/components/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { backendApi } from "@/lib/constant";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Terminal } from "lucide-react";
import BreadCrumb from "./breadcrumb";
import MyFilesCard from "./myFilesCard";

async function fetchPlanFile(planName: string) {
  const { data } = await axios.post(`${backendApi}/api/getLatestProjectTaskPlan`, { planName });
  return data;
}

type RecentPlanProps = {
  planNames: string | string[];
};

export default function RecentPlan({ planNames }: RecentPlanProps) {
  // Decide how to fetch: single or multiple
  const { data, isLoading, error } = useQuery({
    queryKey: ['recentPlanFiles', planNames],
    queryFn: () => {
      if (Array.isArray(planNames)) {
        // Multiple plans: fetch all
        return Promise.all(planNames.map(name => fetchPlanFile(name)));
      } else {
        // Single plan: fetch one
        return fetchPlanFile(planNames);
      }
    }
  });

  if (isLoading) return <Loader />;

  if (error instanceof Error) return (
    <Alert variant="destructive">
      <Terminal />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Something went wrong, please try again
      </AlertDescription>
    </Alert>
  );

  // Helper to check if plan data has content
  function hasValidData(plan: any) {
    if (!plan) return false;
    if (Array.isArray(plan.data)) return plan.data.length > 0;
    if (plan.data && typeof plan.data === 'object') return Object.keys(plan.data).length > 0;
    return false;
  }

  // Rendering logic:
  if (Array.isArray(data)) {
    // Multiple plans returned as array
    const filteredPlans = data.filter(hasValidData);
    if (filteredPlans.length === 0) {
      return (
        <Alert variant="default">
          <AlertTitle>No recent lesson plans found</AlertTitle>
          <AlertDescription>
            There are currently no lesson plans available.
          </AlertDescription>
        </Alert>
      );
    }
    return (
      <>
        <div className="max-h-[90vh] overflow-y-scroll hide-scrollbar">
          <div className="w-full h-12 bg-linear-65 px-4 rounded-b-md
          from-yellow-400 to-yellow-500 flex justify-start items-center">
            <BreadCrumb section="Recent Lessons" className="text-zinc-600 z-20" />
          </div>
          <div className="flex flex-col gap-3 mt-3">
            {filteredPlans.map(({ data }: any, index: number) => (
              <MyFilesCard key={index} text={data?.metaData} des={data?.answer} />
            ))}
          </div>
        </div>
      </>
    );
  } else {
    // Single plan object
    if (!hasValidData(data)) {
      return <p>No recent lesson plan available.</p>;
    }
    return (
      <>
        <div className="max-h-[90vh] overflow-y-scroll hide-scrollbar">
          <div className="w-full h-12 bg-linear-65 px-4 rounded-b-md
          from-yellow-400 to-yellow-500 flex justify-start items-center">
            <BreadCrumb section="Recent Lessons" className="text-zinc-600 z-20" />
          </div>
          <div className="flex flex-col gap-3 mt-3">
            <MyFilesCard text={data?.data?.metaData} des={data?.data?.answer} />
          </div>
        </div>
      </>
    );
  }
}
