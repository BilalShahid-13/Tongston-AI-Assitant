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
          Unknown: 0,
        }
      }

      if (schoolLevelBuckets.Nursery.some(k => rawLevel.includes(k.toLowerCase()))) {
        acc[month].Nursery += 1
      } else if (schoolLevelBuckets.Primary.some(k => rawLevel.includes(k.toLowerCase()))) {
        acc[month].Primary += 1
      } else if (schoolLevelBuckets.Secondary.some(k => rawLevel.includes(k.toLowerCase()))) {
        acc[month].Secondary += 1
      }
      else {
        acc[month].Unknown += 1
      }

      return acc
    }, {})

  // Convert object → array for chart
  const chartData = Object.values(lessonPlansBySchoolLevel)
  return chartData;
}



// export function planBySchoolLevelByColumnChart(subjectLessonPlan: IPlan[],
//   plan: PlanType
// ): { name: string, count: number }[] {
//   const subjectCounts: Record<string, number> = {}
//   subjectLessonPlan
//     ?.filter(item => item.plan === plan)
//     ?.forEach((item: any) => {
//       const subject =
//         item.fields?.schoolLevel
//         "Unknown"
//       subjectCounts[subject] = (subjectCounts[subject] || 0) + 1
//     })

//   const sortedSubjects = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])

//   const top10 = sortedSubjects.slice(0, 10)
//   const moreCount = sortedSubjects.slice(10).reduce((sum, [, c]) => sum + c, 0)
//   if (moreCount > 0) top10.push(["More", moreCount])

//   return top10.map(([subject, count]) => ({
//     name: subject,
//     count: count,
//   }))
// }
export function planBySchoolLevelByColumnChart(
  subjectLessonPlan: IPlan[],
  plan: PlanType
): { name: string; count: number }[] {
  const schoolLevels = ["Nursery School", "Primary School", "Secondary School", "Tertiary School"];

  const subjectCounts: Record<string, number> = {};

  // Count only for matching plan
  subjectLessonPlan
    ?.filter(item => item.plan === plan)
    ?.forEach(item => {
      const subject = item.fields?.schoolLevel || "Unknown";
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
    });

  // Ensure all levels exist (even if 0)
  schoolLevels.forEach(level => {
    if (!(level in subjectCounts)) subjectCounts[level] = 0;
  });

  // Create the array in the defined order
  return schoolLevels.map(level => ({
    name: level,
    count: subjectCounts[level],
  }));
}
