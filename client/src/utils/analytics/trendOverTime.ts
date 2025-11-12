import type { IPlan } from "@/types";
import { getWeek, parseISO } from "date-fns";

// export function useTrendOverTime(plans: IPlan[][]) {
//   return useMemo(() => {
//     const flat = plans.flat();

//     const map = flat.reduce<Record<string, { count: number; plans: string[] }>>(
//       (acc, plan) => {
//         const date = parseISO(plan.createdAt);
//         const weekNumber = getWeek(date); // 1-52

//         const key = `Week ${weekNumber}`;

//         if (!acc[key]) {
//           acc[key] = { count: 0, plans: [] };
//         }

//         acc[key].count += 1;
//         acc[key].plans.push(plan.plan); // e.g. "subjectLessonPlan"

//         return acc;
//       },
//       {}
//     );

//     return Object.keys(map)
//       .sort(
//         (a, b) =>
//           Number(a.replace("Week ", "")) - Number(b.replace("Week ", ""))
//       )
//       .map((week) => ({
//         week,
//         ...map[week],
//       }));
//   }, [plans]);
// }

// trendOverTime.ts

export function trendOverTime(plans: IPlan[]) {
  const map = plans.reduce<Record<string, { count: number; plans: string[] }>>(
    (acc, plan) => {
      const date = parseISO(plan.createdAt);
      const weekNumber = getWeek(date); // 1-52

      const key = `Week ${weekNumber}`;

      if (!acc[key]) {
        acc[key] = { count: 0, plans: [] };
      }

      acc[key].count += 1;
      acc[key].plans.push(plan.plan); // e.g. "subjectLessonPlan"

      return acc;
    },
    {}
  );

  return Object.keys(map)
    .sort(
      (a, b) =>
        Number(a.replace("Week ", "")) -
        Number(b.replace("Week ", ""))
    )
    .map((week) => ({
      week,
      ...map[week],
    }));
}
