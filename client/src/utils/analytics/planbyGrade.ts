import { yearClasses } from "@/constants/lessonPlanConstant";
import type { IPlan, PlanType } from "@/types";

export default function planbyGrade(subjectLessonPlan: IPlan[], plan: PlanType): { name: string; count: number; }[] {
  // console.log(yearClasses);
  const yearClass = yearClasses.slice(0,-3);

  // Deduplicate by lowercased value
  const DISCIPLINE_LIST = Array.from(
    new Map(
      yearClass.map(d => [d.toLowerCase(), d])
    ).values()
  )

  const disciplineCounts: Record<string, number | null> = Object.fromEntries(
    DISCIPLINE_LIST.map(d => [d, 0])
  )

  const fallback = "Other (Outside School Range)";
  disciplineCounts[fallback] = 0;
  // Process lesson plans
  subjectLessonPlan
    .filter(item => item.plan === plan)
    .forEach(item => {
      const disciplineRaw = item.fields?.yearClass?.trim() || ""
      const matchedDiscipline = DISCIPLINE_LIST.find(d =>
        disciplineRaw.toLowerCase() === d.toLowerCase()
      )
      if (matchedDiscipline) {
        disciplineCounts[matchedDiscipline] = (disciplineCounts[matchedDiscipline] || 0) + 1
      } else {
        // If no match, optionally set a fallback to null or increment a default
        disciplineCounts[fallback] = (disciplineCounts[fallback] ?? 0) + 1;
      }
    })

  // Final output
  return DISCIPLINE_LIST.map((discipline,index) => ({
    name: `Grade ${index+1}`,
    // name: discipline,
    count: disciplineCounts[discipline] ?? 0
  }))
}
