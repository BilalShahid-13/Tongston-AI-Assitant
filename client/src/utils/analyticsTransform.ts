import type { IPlan, TimeRange } from "@/types"
import { format, startOfQuarter, startOfWeek } from "date-fns"
import { planBySubject } from "./analytics/planbySubject"
import { planByDiscipline } from "./analytics/planbyDicipline"
import { planBySchoolLevel, planBySchoolLevelByColumnChart } from "./analytics/planbySchooLevel"
import { planByTerm } from "./analytics/planbyTerm"

export function transformAnalyticsData(subjectLessonPlan: IPlan[], subjectAssessmentPlan: IPlan[], studentConductLessonPlan: IPlan[], studentConductAssessmentPlan: IPlan[], projectFacilitationPlan: IPlan[], projectTaskPlan: IPlan[]) {
  // ---- Lesson Plans by Subject ----

  // ---- Lesson Plans by Discipline (fixed 6 buckets) ----
  // const RAW_DISCIPLINE_LIST = [
  //   "BUSINESS & ENTREPRENEURSHIP",
  //   "MATHEMATICS",
  //   "SCIENCE & TECHNOLOGY",
  //   "ENGLISH",
  //   "CITIZENSHIP",
  //   "ART",
  //   "Business & Entrepreneurship"
  // ]

  // // Deduplicate by lowercased value
  // const DISCIPLINE_LIST = Array.from(
  //   new Map(
  //     RAW_DISCIPLINE_LIST.map(d => [d.toLowerCase(), d])
  //   ).values()
  // )

  // const disciplineCounts: Record<string, number | null> = Object.fromEntries(
  //   DISCIPLINE_LIST.map(d => [d, 0])
  // )

  // // Process lesson plans
  // subjectLessonPlan
  //   .filter(item => item.plan === "subjectLessonPlan")
  //   .forEach(item => {
  //     const disciplineRaw = item.fields?.[13]?.trim() || ""
  //     const matchedDiscipline = DISCIPLINE_LIST.find(d =>
  //       disciplineRaw.toLowerCase() === d.toLowerCase()
  //     )
  //     if (matchedDiscipline) {
  //       disciplineCounts[matchedDiscipline] = (disciplineCounts[matchedDiscipline] || 0) + 1
  //     } else {
  //       // If no match, optionally set a fallback to null or increment a default
  //       disciplineCounts["Business & Entrepreneurship"] =
  //         (disciplineCounts["Business & Entrepreneurship"] ?? 0) + 1
  //     }
  //   })

  // // Final output
  // const lessonPlansByDiscipline = DISCIPLINE_LIST.map(discipline => ({
  //   name: discipline,
  //   count: disciplineCounts[discipline] ?? 0
  // }))

  // console.log("lessonPlansByDiscipline", lessonPlansByDiscipline)

  // ---- Lesson Plans by School Level ----
  // ---- Lesson Plans by School Level ----
  // const schoolLevelBuckets = {
  //   Nursery: ["Nursery"],
  //   Primary: ["Primary"],
  //   Secondary: ["Secondary"],
  // }

  // Reduce subjectLessonPlan into month + schoolLevel counts
  // const lessonPlansBySchoolLevel = subjectLessonPlan
  //   .filter(item => item.plan === "subjectLessonPlan")
  //   .reduce((acc: Record<string, any>, item: any) => {
  //     const month = format(new Date(item.createdAt), "MMM") // e.g. "Sep"
  //     const rawLevel = (item.fields?.schoolLevel || "").toLowerCase()

  //     // ensure month bucket exists
  //     if (!acc[month]) {
  //       acc[month] = {
  //         month,
  //         Nursery: 0,
  //         Primary: 0,
  //         Secondary: 0,
  //         University: 0,
  //         Unknown: 0,
  //       }
  //     }

  //     if (schoolLevelBuckets.Nursery.some(k => rawLevel.includes(k.toLowerCase()))) {
  //       acc[month].Nursery += 1
  //     } else if (schoolLevelBuckets.Primary.some(k => rawLevel.includes(k.toLowerCase()))) {
  //       acc[month].Primary += 1
  //     } else if (schoolLevelBuckets.Secondary.some(k => rawLevel.includes(k.toLowerCase()))) {
  //       acc[month].Secondary += 1
  //     } else if (rawLevel.includes("university")) {
  //       acc[month].University += 1
  //     } else {
  //       acc[month].Unknown += 1
  //     }

  //     return acc
  //   }, {})

  // Convert object → array for chart
  // const chartData = Object.values(lessonPlansBySchoolLevel)


  // const lessonPlansBySchoolLevel = [
  //   { name: "Nursery", count: schoolLevels.Nursery },
  //   { name: "Primary", count: schoolLevels.Primary },
  //   { name: "Secondary", count: schoolLevels.Secondary },
  //   { name: "Unknown", count: schoolLevels.Unknown },
  // ]
  // const lessonPlansBySchoolLevel = [
  //   {
  //     bucket: "Lesson Plans",
  //     Nursery: schoolLevels.Nursery,
  //     Primary: schoolLevels.Primary,
  //     Secondary: schoolLevels.Secondary,
  //     University: schoolLevels.University,
  //     Unknown: schoolLevels.Unknown,
  //   },
  // ]



  // ---- Assessments by Subject ----
  // subjectAssessmentPlan assessmentsBySubject
  const subjectCounts: Record<string, number> = {}
  subjectLessonPlan
    .filter(item => item.plan === "subjectLessonPlan")
    .forEach((item: any) => {
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

  // ---- Trend Over Time (last 12 weeks) ----
  const weeklyCounts: Record<
    string,
    { lessonPlans: number; assessments: number }
  > = {}

  subjectAssessmentPlan.forEach(item => {
    const date = new Date(item.createdAt)
    // week key like 2025-W37
    const week = `${date.getUTCFullYear()}-W${Math.ceil(
      (date.getUTCDate() - date.getUTCDay() + 1) / 7
    )}`

    if (!weeklyCounts[week]) weeklyCounts[week] = { lessonPlans: 0, assessments: 0 }
    if (item.plan === "subjectLessonPlan") weeklyCounts[week].lessonPlans++
    if (item.plan === "subjectAssessmentPlan") weeklyCounts[week].assessments++
  })

  const trendOverTime = Object.entries(weeklyCounts).map(([week, counts]) => ({
    week,
    ...counts,
  }))

  return {
    lessonPlansBySubject: planBySubject(subjectLessonPlan, "subjectLessonPlan"),
    lessonPlansByDiscipline: planByDiscipline(subjectLessonPlan, "subjectLessonPlan"),
    lessonPlansBySchoolLevel: planBySchoolLevelByColumnChart(subjectLessonPlan, "subjectLessonPlan"),
    // assessment plan
    assessmentPlansBySchoolLevel: planBySchoolLevelByColumnChart(subjectAssessmentPlan, "subjectAssessmentPlan"),
    assessmentsBySubject: planBySubject(subjectAssessmentPlan, "subjectAssessmentPlan"),
    assessmentbyDiscipline: planByDiscipline(subjectAssessmentPlan, "subjectAssessmentPlan"),
    // student conduct lessaon plan
    studentConductLessonPlanByTerm: planByTerm(studentConductLessonPlan, "studentConductCharacterPlan"),
    studentConductLessonPlanByDiscipline: planByDiscipline(studentConductLessonPlan, "studentConductCharacterPlan"),
    studentConductLessonPlanBySchoolLevel: planBySchoolLevelByColumnChart(studentConductLessonPlan, "studentConductCharacterPlan"),
    // student conduct assessment plan
    studentConductAssessmentPlanByTerm: planByTerm(studentConductAssessmentPlan, "studentConductCharacterPlan"),
    studentConductAssessmentPlanByDiscipline: planByDiscipline(studentConductAssessmentPlan, "studentConductCharacterPlan"),
    studentConductAssessmentPlanBySchoolLevel: planBySchoolLevelByColumnChart(studentConductAssessmentPlan, "studentConductCharacterPlan"),
    // project facilitation plan
    projectFacilitationPlanByTerm: planByTerm(projectFacilitationPlan, "projectTaskFacilitationPlan"),
    projectFacilitationPlanByDiscipline: planByDiscipline(projectFacilitationPlan, "projectTaskFacilitationPlan"),
    projectFacilitationPlanBySchoolLevel: planBySchoolLevelByColumnChart(projectFacilitationPlan, "projectTaskFacilitationPlan"),
    // project task plan
    projectTaskPlanByTerm: planByTerm(projectTaskPlan, "projectTaskPlan"),
    projectTaskPlanByDiscipline: planByDiscipline(projectTaskPlan, "projectTaskPlan"),
    projectTaskPlanBySchoolLevel: planBySchoolLevelByColumnChart(projectTaskPlan, "projectTaskPlan"),
    trendOverTime,

  }
}

export function filterbyPlan(isGlobalFilter: boolean, filterPlan: IPlan[], filterGlobalPlan: IPlan[]) {
  return (
    isGlobalFilter ?
      filterGlobalPlan.length.toString()
      : filterPlan.length.toString()
  )
}


export function getSchoolLevelColor(level: string) {
  switch (level) {
    case "Nursery":
      return "#FFB347"; // orange
    case "Primary":
      return "#4A90E2"; // blue
    case "Secondary":
      return "#50C878"; // green
    case "Unknown":
      return "#A9A9A9"; // gray
    default:
      return "#F5C242"; // fallback yellow
  }
}


export function filterPlans(
  plans: any[],
  filters: {
    country?: string;
    discipline?: string;
    subject?: string;
    schoolLevel?: string;
    timeRange?: TimeRange;
    termTheme?: string;
  }
) {
  // default timeRange = yearly
  const {
    country,
    discipline,
    subject,
    schoolLevel,
    timeRange = "yearly",
    termTheme
  } = filters;

  return plans.filter((plan: any) => {
    const createdAt = plan.fields?.createdAt ? new Date(plan.fields.createdAt) : null;

    // check time
    let matchesTime = true;
    if (createdAt && timeRange) {
      switch (timeRange) {
        case "daily":
          matchesTime = format(createdAt, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
          break;
        case "weekly":
          matchesTime =
            format(startOfWeek(createdAt, { weekStartsOn: 1 }), "yyyy-'W'II") ===
            format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-'W'II");
          break;
        case "monthly":
          matchesTime = format(createdAt, "yyyy-MM") === format(new Date(), "yyyy-MM");
          break;
        case "quarterly":
          matchesTime =
            format(startOfQuarter(createdAt), "yyyy-'Q'q") ===
            format(startOfQuarter(new Date()), "yyyy-'Q'q");
          break;
        case "yearly":
          matchesTime = format(createdAt, "yyyy") === format(new Date(), "yyyy");
          break;
      }
    }

    return (
      (!country || plan.fields?.location === country) &&
      (!discipline ||
        plan.fields?.subjectDiscipline?.toLowerCase() === discipline.toLowerCase()) &&
      (!subject || plan.fields?.subject === subject) &&
      (!schoolLevel || plan.fields?.yearClass === schoolLevel) &&
      matchesTime && (!termTheme || plan.fields?.termTheme === filters?.termTheme || !filters?.termTheme)
    );
  });
}
