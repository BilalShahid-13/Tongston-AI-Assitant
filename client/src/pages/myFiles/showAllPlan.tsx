import BreadCrumb from "@/components/breadcrumb";
import { Loader } from "@/components/Loader";
import { MyFilesCard } from "@/components/myFilesCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { backendApi } from "@/lib/constant";
import type { IHistory, LessonPlanData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Terminal } from "lucide-react";
async function fetchPlanFiles() {
  const { data } = await axios.get(`${backendApi}/api/getPlanFiles`);
  return data;
}
export default function ShowAllPlan() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['planFiles'],
    queryFn: fetchPlanFiles,
  });

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
    <div className="">
      <div className="w-full h-12 bg-linear-65 px-4 rounded-b-md
       from-yellow-400 to-yellow-500 flex justify-start items-center">
        <BreadCrumb section="My Files" className="text-zinc-600 z-20" />
      </div>
      <div className="flex flex-col gap-3 mt-3">
        {/* <div className="flex flex-row justify-start items-center gap-3 mx-3">
          <ClipboardList className="w-8 h-8 text-gray-500" />
          <h3 className="text-4xl font-bold bg-zinc-700
         bg-clip-text text-transparent text-left">
            My Learning Plans
          </h3>
        </div> */}
        <div className="flex flex-col gap-y-2 mx-2">
          {data?.data?.map((plan: IHistory, index: number) => {
            const transformed: LessonPlanData = {
              answer: plan.answer ?? "",
              metaData: Array.isArray(plan.metaData)
                ? plan.metaData // already string[]
                : plan.metaData
                  ? [plan.metaData] // wrap single string
                  : [], // fallback empty array
              createdAt: plan.createdAt?.toString(),
            };

            return <MyFilesCard data={transformed} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
}
