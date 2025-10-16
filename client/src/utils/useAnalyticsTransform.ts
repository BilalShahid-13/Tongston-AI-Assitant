// utils/useAnalyticsTransform.ts
import { useMemo } from "react";
import { transformAnalyticsData } from "./analyticsTransform";

export function useAnalyticsTransform(lessonPlan: any[], assessmentPlan: any[], studentConductLessonPlan: any[], studentConductAssessmentPlan: any[], projectFacilitationPlan: any[], projectTaskPlan: any[]) {
  return useMemo(() => transformAnalyticsData(lessonPlan, assessmentPlan, studentConductLessonPlan, studentConductAssessmentPlan, projectFacilitationPlan, projectTaskPlan), [lessonPlan, assessmentPlan, studentConductLessonPlan, studentConductAssessmentPlan, projectFacilitationPlan, projectTaskPlan]);
}
