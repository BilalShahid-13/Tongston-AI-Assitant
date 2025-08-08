import { latestLesson } from "@/lib/constant";
import RecentPlan from "./recentPlans";

export default function RecentLessonPlan() {
  return (
    <>
      <RecentPlan planNames={latestLesson} />
    </>
  )
}
