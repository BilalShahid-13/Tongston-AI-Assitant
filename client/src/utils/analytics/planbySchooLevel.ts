import type { IPlan, PlanType } from "@/types"
import { format } from "date-fns"

export function planBySchoolLevel(subjectLessonPlan: IPlan[], plan: PlanType): any {
  const schoolLevelBuckets = {
    Nursery: ["Nursery"],
    Primary: ["Primary"],
    Secondary: ["Secondary"],
  }

  // Reduce subjectLessonPlan into month + schoolLevel counts
  const lessonPlansBySchoolLevel = subjectLessonPlan
    .filter(item => item.plan === plan)
    .reduce((acc: Record<string, any>, item: any) => {
      const month = format(new Date(item.createdAt), "MMM") // e.g. "Sep"
      const rawLevel = (item.fields?.schoolLevel || "").toLowerCase()

      // ensure month bucket exists
      if (!acc[month]) {
        acc[month] = {
          month,
          Nursery: 0,
          Primary: 0,
          Secondary: 0,
          University: 0,
          Unknown: 0,
        }
      }

      if (schoolLevelBuckets.Nursery.some(k => rawLevel.includes(k.toLowerCase()))) {
        acc[month].Nursery += 1
      } else if (schoolLevelBuckets.Primary.some(k => rawLevel.includes(k.toLowerCase()))) {
        acc[month].Primary += 1
      } else if (schoolLevelBuckets.Secondary.some(k => rawLevel.includes(k.toLowerCase()))) {
        acc[month].Secondary += 1
      } else if (rawLevel.includes("university")) {
        acc[month].University += 1
      } else {
        acc[month].Unknown += 1
      }

      return acc
    }, {})

  // Convert object → array for chart
  const chartData = Object.values(lessonPlansBySchoolLevel)
  return chartData;
}