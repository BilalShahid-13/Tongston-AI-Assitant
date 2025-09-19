import type { AnalyticsItem } from "@/types"

export function transformAnalyticsData(data: AnalyticsItem[]) {
  // ---- Lesson Plans by Subject ----
  const subjectCounts: Record<string, number> = {}
  data
    .filter(item => item.plan === "subjectLessonPlan")
    .forEach(item => {
      const subject =
        item.userId?.subject ||
        item.fields[12] || // fallback index for subject
        "Unknown"
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1
    })

  const sortedSubjects = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])

  const top10 = sortedSubjects.slice(0, 10)
  const moreCount = sortedSubjects.slice(10).reduce((sum, [, c]) => sum + c, 0)
  if (moreCount > 0) top10.push(["More", moreCount])

  const lessonPlansBySubject = top10.map(([subject, count]) => ({
    subject,
    count,
  }))

  // ---- Lesson Plans by Discipline (fixed 6 buckets) ----
  const DISCIPLINE_BUCKETS = [
    "Business & Entrepreneurship",
    "Mathematics",
    "Science & Technology",
    "English",
    "Citizenship",
    "Art",
  ]

  const disciplineCounts: Record<string, number> = Object.fromEntries(
    DISCIPLINE_BUCKETS.map(d => [d, 0])
  )

  data
    .filter(item => item.plan === "subjectLessonPlan")
    .forEach(item => {
      const disciplineRaw = item.fields[13]?.trim() || ""
      const matchedDiscipline = DISCIPLINE_BUCKETS.find(d =>
        disciplineRaw.toLowerCase().includes(d.toLowerCase())
      )
      if (matchedDiscipline) {
        disciplineCounts[matchedDiscipline]++
      } else {
        // if no match → put into "Business & Entrepreneurship" OR decide a default bucket
        disciplineCounts["Business & Entrepreneurship"]++
      }
    })

  const lessonPlansByDiscipline = Object.entries(disciplineCounts).map(
    ([discipline, count]) => ({ discipline, count })
  )

  // ---- Lesson Plans by School Level ----
  // ---- Lesson Plans by School Level ----
  const schoolLevelBuckets = {
    Nursery: ["Nursery"],
    Primary: ["Primary"],
    Secondary: ["Secondary"],
  }

  let schoolLevels = {
    Nursery: 0,
    Primary: 0,
    Secondary: 0,
    Unknown: 0,
  }

  data
    .filter(item => item.plan === "subjectLessonPlan")
    .forEach(item => {
      const rawLevel = (item.fields[4] || "").toLowerCase()

      if (schoolLevelBuckets.Nursery.some(k => rawLevel.includes(k.toLowerCase()))) {
        schoolLevels.Nursery++
      } else if (schoolLevelBuckets.Primary.some(k => rawLevel.includes(k.toLowerCase()))) {
        schoolLevels.Primary++
      } else if (schoolLevelBuckets.Secondary.some(k => rawLevel.includes(k.toLowerCase()))) {
        schoolLevels.Secondary++
      } else {
        schoolLevels.Unknown++
      }
    })

  const lessonPlansBySchoolLevel = [
    {
      level: "School Levels",
      Nursery: schoolLevels.Nursery,
      Primary: schoolLevels.Primary,
      Secondary: schoolLevels.Secondary,
      Unknown: schoolLevels.Unknown,
    },
  ]


  // ---- Assessments by Subject ----
  const assessmentCounts: Record<string, number> = {}
  data
    .filter(item => item.plan === "subjectAssessmentPlan")
    .forEach(item => {
      const subject =
        item.userId?.subject ||
        item.fields[12] ||
        "Unknown"
      assessmentCounts[subject] = (assessmentCounts[subject] || 0) + 1
    })

  const assessmentsBySubject = Object.entries(assessmentCounts).map(
    ([subject, count]) => ({ subject, count })
  )

  // ---- Trend Over Time (last 12 weeks) ----
  const weeklyCounts: Record<
    string,
    { lessonPlans: number; assessments: number }
  > = {}

  data.forEach(item => {
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
    lessonPlansBySubject,
    lessonPlansByDiscipline,
    lessonPlansBySchoolLevel,
    assessmentsBySubject,
    trendOverTime,
  }
}
