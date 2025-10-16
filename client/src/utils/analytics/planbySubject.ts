import type { IPlan, PlanType } from "@/types"


export function planBySubject(subjectLessonPlan: IPlan[],
  plan: PlanType
): { name: string, count: number }[] {
  const subjectCounts: Record<string, number> = {}
  subjectLessonPlan
    ?.filter(item => item.plan === plan)
    ?.forEach((item: any) => {
      const subject =
        item.fields?.subject ||
        item.fields[12] || // fallback index for subject
        "Unknown"
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1
    })

  const sortedSubjects = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])

  const top10 = sortedSubjects.slice(0, 10)
  const moreCount = sortedSubjects.slice(10).reduce((sum, [, c]) => sum + c, 0)
  if (moreCount > 0) top10.push(["More", moreCount])

  return top10.map(([subject, count]) => ({
    name: subject,
    count: count,
  }))
}