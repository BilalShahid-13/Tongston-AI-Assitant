// utils/useAnalyticsTransform.ts
import { useMemo } from "react";
import { transformAnalyticsData } from "./analyticsTransform";

export function useAnalyticsTransform(lessonPlan: any[], assessmentPlan: any[]) {
  return useMemo(() => transformAnalyticsData(lessonPlan, assessmentPlan), [lessonPlan, assessmentPlan]);
}
