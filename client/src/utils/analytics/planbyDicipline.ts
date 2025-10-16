import type { IPlan, PlanType } from "@/types"

export function planByDiscipline(subjectLessonPlan: IPlan[], plan: PlanType): { name: string; count: number; }[] {
  const RAW_DISCIPLINE_LIST = [
    "BUSINESS & ENTREPRENEURSHIP",
    "MATHEMATICS",
    "SCIENCE & TECHNOLOGY",
    "ENGLISH",
    "CITIZENSHIP",
    "ART",
    "Business & Entrepreneurship"
  ]

  // Deduplicate by lowercased value
  const DISCIPLINE_LIST = Array.from(
    new Map(
      RAW_DISCIPLINE_LIST.map(d => [d.toLowerCase(), d])
    ).values()
  )

  const disciplineCounts: Record<string, number | null> = Object.fromEntries(
    DISCIPLINE_LIST.map(d => [d, 0])
  )

  // Process lesson plans
  subjectLessonPlan
    .filter(item => item.plan === plan)
    .forEach(item => {
      const disciplineRaw = item.fields?.[13]?.trim() || ""
      const matchedDiscipline = DISCIPLINE_LIST.find(d =>
        disciplineRaw.toLowerCase() === d.toLowerCase()
      )
      if (matchedDiscipline) {
        disciplineCounts[matchedDiscipline] = (disciplineCounts[matchedDiscipline] || 0) + 1
      } else {
        // If no match, optionally set a fallback to null or increment a default
        disciplineCounts["Business & Entrepreneurship"] =
          (disciplineCounts["Business & Entrepreneurship"] ?? 0) + 1
      }
    })

  // Final output
  return DISCIPLINE_LIST.map(discipline => ({
    name: discipline,
    count: disciplineCounts[discipline] ?? 0
  }))
}