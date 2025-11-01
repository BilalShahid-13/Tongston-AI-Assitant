import type { IPlan, PlanType } from "@/types";

export function planByTerm(
  subjectLessonPlan: IPlan[],
  plan: PlanType
): { name: string; count: number }[] {
  const termList = [
    "Personal Development",
    "Professional Development",
    "Public Development",
  ];

  // 🧩 If no lesson plans provided → return empty array
  if (!subjectLessonPlan || subjectLessonPlan.length === 0) {
    return [{ name: "Personal Development", count: 0 }, { name: "Professional Development", count: 0 },
    { name: "Public Development", count: 0 }];
  }

  const termCounts: Record<string, number> = {};

  subjectLessonPlan
    .filter((item) => item.plan === plan)
    .forEach((item: any) => {
      const termNumber = parseInt(item.fields?.term);
      const termName = termList[termNumber - 1] || "Unknown";

      termCounts[termName] = (termCounts[termName] || 0) + 1;
    });

  // 🧩 If no matches found after filtering → also return empty array
  if (Object.keys(termCounts).length === 0) {
    return [{ name: "Personal Development", count: 0 }, { name: "Professional Development", count: 0 },
    { name: "Public Development", count: 0 }];
  }

  const sortedTerms = Object.entries(termCounts).sort((a, b) => b[1] - a[1]);

  return sortedTerms.map(([term, count]) => ({
    name: term,
    count,
  }));
}
