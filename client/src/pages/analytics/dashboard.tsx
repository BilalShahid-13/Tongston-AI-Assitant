import AnalyticsCard from "@/components/analyticsCard";
import { BarChartCustom } from "@/components/charts/BarChartCustom";
import { BarChartStacked } from "@/components/charts/BarChartStack";
import { DashboardCustomSelect } from "@/components/dashboardCustomSelect";
import { Grid, Row } from "@/components/GenralComponents";
import GlobalFiltersBar, { SelectWithIcon } from "@/components/GlobalFiltersBar";
import { Error, Loader } from "@/components/Loader";
import { subjectLists, termList, yearClasses } from "@/constants/lessonPlanConstant";
import { backendApi } from "@/lib/constant";
import { useConductCharacterAssessmentsStore } from "@/store/analytics/conductCharacterAssessments";
import { useConductCharacterLessonStore } from "@/store/analytics/conductCharacterLesson";
import { useGlobalFiltersStore } from "@/store/analytics/globalFilters";
import { useProjectFacilitationStore } from "@/store/analytics/projectFacilitation";
import { useProjectTaskStore } from "@/store/analytics/projectTask";
import { useSubjectAssessmentStore } from "@/store/analytics/subjectAssessment";
import { useSubjectLessonStore } from "@/store/analytics/subjectLesson";
import type { AnalyticsCardItem, IPlan, Variant } from "@/types";
import { filterbyPlan } from "@/utils/analyticsTransform";
import { useAnalyticsTransform } from "@/utils/useAnalyticsTransform";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BookOpen, ClipboardCheck, User, Users } from "lucide-react";
import { useState } from "react";
import { StatsCard } from "./StatsCard";



export default function Dashboard() {
  const { setSubjectAssessmentPlan, setFilterSubjectAssessmentBySubject,
    subjectAssessmentPlan, filterGlobalSubjectAssessmentPlan,
    setFilterSubjectAssessmentByClass, setFilterSubjectAssessmentByTerm,
    filterSubjectAssessmentBySubject, filterSubjectAssessmentPlan,
    filterSubjectAssessmentByClass, filterSubjectAssessmentByTerm, resetFilters: resetAssessmentFilter,
  } = useSubjectAssessmentStore();

  const { setSubjectLessonPlan, filterSubjectLessonPlan,
    setFilterSubjectLessonByClass, setFilterSubjectLessonBySubject,
    setFilterSubjectLessonByTerm, subjectLessonPlan,
    filterSubjectLessonByClass, filterSubjectLessonBySubject,
    filterGlobalSubjectLessonPlan,
    filterSubjectLessonByTerm, resetFilters: resetLessonFilters
  } = useSubjectLessonStore();


  const {
    conductCharacterLessonPlan,
    filterGlobalConductCharacterPlan,
    filterConductCharacterLessonPlan,
    filterConductCharacterLessonBySubject,
    filterConductCharacterLessonByClass,
    filterConductCharacterLessonByTerm,
    setFilterConductCharacterLessonBySubject,
    setFilterConductCharacterLessonByClass,
    setFilterConductCharacterLessonByTerm,
    setConductCharacterLessonPlan,
    resetFilters: resetConductCharacterFilters,
  } = useConductCharacterLessonStore();

  const {
    conductCharacterAssessmentsPlan,
    filterConductCharacterAssessmentsGlobalPlan,
    filterConductCharacterAssessmentsPlan,
    filterConductCharacterAssessmentsBySubject,
    filterConductCharacterAssessmentsByClass,
    filterConductCharacterAssessmentsByTerm,
    setConductCharacterAssessmentsPlan,
    setFilterConductCharacterAssessmentsBySubject,
    setFilterConductCharacterAssessmentsByClass,
    setFilterConductCharacterAssessmentsByTerm,
    resetFilters: resetConductCharacterAssessmentFilters,
  } = useConductCharacterAssessmentsStore();


  const {
    projectTaskPlan,
    filterProjectTaskPlan,
    filterGlobalProjectTaskPlan,
    filterProjectTaskBySubject,
    filterProjectTaskByClass,
    filterProjectTaskByTerm,
    setProjectTaskPlan,
    setFilterProjectTaskBySubject,
    setFilterProjectTaskByClass
    , setFilterProjectTaskByTerm,
    resetFilters: resetProjectTaskFilters,
  } = useProjectTaskStore()

  const {
    projectFacilitationPlan,
    filterProjectFacilitationPlan,
    filterGlobalProjectFacilitationPlan,
    filterProjectFacilitationBySubject,
    filterProjectFacilitationByClass,
    filterProjectFacilitationByTerm,
    setProjectFacilitationPlan,
    setFilterProjectFacilitationBySubject,
    setFilterProjectFacilitationByClass,
    setFilterProjectFacilitationByTerm,
    resetFilters: resetProjectFacilitationFilters,
  } = useProjectFacilitationStore();

  const { isGlobalFilter } = useGlobalFiltersStore()

  const {
    chartData,
    lessonPlansBySubject,
    lessonPlansByDiscipline,
    // assessmentsBySubject,
    // trendOverTime,
  } = useAnalyticsTransform(filterGlobalSubjectLessonPlan, filterGlobalSubjectAssessmentPlan)

  function getTotalTeachers() {
    // Combine all plans into one array
    const allPlans = [
      ...subjectLessonPlan,
      ...subjectAssessmentPlan,
      ...conductCharacterLessonPlan,
      ...conductCharacterAssessmentsPlan,
      ...projectTaskPlan,
      ...projectFacilitationPlan,
    ];
    // Get unique teacher usernames
    return new Set(allPlans.map((item) => item.userId?.username)).size;
  }

  const analyticsCardList: AnalyticsCardItem[] = [
    {
      statsTitle: "Total Subject Assessments",
      statsValue: filterbyPlan(isGlobalFilter, filterSubjectAssessmentPlan, filterGlobalSubjectAssessmentPlan),
      statsDescription: "Number of subject-based assessments created",
      Icon: ClipboardCheck,
      variant: "blue" as Variant,
      statsCardDialogTitle: "Filter Subject Assessments",
      statsCardDialogLabel: "View Details",
      onReset: resetAssessmentFilter,
      statsCardDialogChildren: [
        {
          label: "Subject",
          // value: "",
          value: filterSubjectAssessmentBySubject,
          onSelect: setFilterSubjectAssessmentBySubject,
          options: subjectLists.map((item) => item.subject),
          placeholder: "Select subject",
          icon: BookOpen,
        },
        {
          label: "Class",
          value: filterSubjectAssessmentByClass,
          onSelect: setFilterSubjectAssessmentByClass,
          options: yearClasses,
          placeholder: "Select class/year",
          icon: BookOpen,
        },
        {
          label: "Term",
          value: filterSubjectAssessmentByTerm,
          onSelect: setFilterSubjectAssessmentByTerm,
          options: termList,
          placeholder: "Select term",
          icon: ClipboardCheck,
        },
      ]
    },
    {
      statsTitle: "Total Subject Lesson Plans",
      statsValue: filterbyPlan(isGlobalFilter, filterSubjectLessonPlan, filterGlobalSubjectLessonPlan),
      statsDescription: "Lesson plans prepared for different subjects",
      Icon: BookOpen,
      variant: "emerald" as Variant,
      statsCardDialogTitle: "Filter Subject Lesson Plans",
      statsCardDialogLabel: "View Details",
      onReset: resetLessonFilters,
      statsCardDialogChildren: [
        {
          label: "Subject",
          value: filterSubjectLessonBySubject,
          onSelect: setFilterSubjectLessonBySubject,
          options: subjectLists.map((item) => item.subject),
          placeholder: "Select subject",
          icon: BookOpen,
        },
        {
          label: "Class",
          value: filterSubjectLessonByClass,
          onSelect: setFilterSubjectLessonByClass,
          options: yearClasses,
          placeholder: "Select class/year",
          icon: BookOpen,
        },
        {
          label: "Term",
          value: filterSubjectLessonByTerm,
          onSelect: setFilterSubjectLessonByTerm,
          options: termList,
          placeholder: "Select term",
          icon: ClipboardCheck,
        },
      ]
    },
    {
      statsTitle: "Conduct & Character Lesson Plans",
      statsValue: filterbyPlan(isGlobalFilter, filterConductCharacterLessonPlan, filterGlobalConductCharacterPlan),
      // statsValue: filterConductCharacterLessonPlan.length.toString(),
      statsDescription: "Plans designed to guide student conduct and character development",
      Icon: User,
      variant: "rose" as Variant,
      statsCardDialogTitle: "Filter Student Conduct & Character Lesson Plans",
      statsCardDialogLabel: "View Details",
      onReset: resetConductCharacterFilters,
      statsCardDialogChildren: [
        {
          label: "Subject",
          value: filterConductCharacterLessonBySubject,
          onSelect: setFilterConductCharacterLessonBySubject,
          options: subjectLists.map((item) => item.subject),
          placeholder: "Select subject",
          icon: BookOpen,
        },
        {
          label: "Class",
          value: filterConductCharacterLessonByClass,
          onSelect: setFilterConductCharacterLessonByClass,
          options: yearClasses,
          placeholder: "Select class/year",
          icon: BookOpen,
        },
        {
          label: "Term",
          value: filterConductCharacterLessonByTerm,
          onSelect: setFilterConductCharacterLessonByTerm,
          options: termList,
          placeholder: "Select term",
          icon: ClipboardCheck,
        },
      ]

    },
    {
      statsTitle: "Conduct & Character Assessments",
      statsValue: filterbyPlan(isGlobalFilter, filterConductCharacterAssessmentsPlan, filterConductCharacterAssessmentsGlobalPlan),
      // statsValue: filterConductCharacterAssessmentsPlan.length.toString(),
      statsDescription: "Plans designed to guide student conduct and character development",
      Icon: ClipboardCheck,
      variant: "slate" as Variant,
      statsCardDialogTitle: "Assessments evaluating student conduct and character",
      statsCardDialogLabel: "View Details",
      onReset: resetConductCharacterAssessmentFilters,
      statsCardDialogChildren: [
        {
          label: "Subject",
          value: filterConductCharacterAssessmentsBySubject,
          onSelect: setFilterConductCharacterAssessmentsBySubject,
          options: subjectLists.map((item) => item.subject),
          placeholder: "Select subject",
          icon: BookOpen,
        },
        {
          label: "Class",
          value: filterConductCharacterAssessmentsByClass,
          onSelect: setFilterConductCharacterAssessmentsByClass,
          options: yearClasses,
          placeholder: "Select class/year",
          icon: BookOpen,
        },
        {
          label: "Term",
          value: filterConductCharacterAssessmentsByTerm,
          onSelect: setFilterConductCharacterAssessmentsByTerm,
          options: termList,
          placeholder: "Select term",
          icon: ClipboardCheck,
        },
      ]

    },
    {
      statsTitle: "Project (Tasks)",
      statsValue: filterbyPlan(isGlobalFilter, filterProjectTaskPlan, filterGlobalProjectTaskPlan),
      // statsValue: filterProjectTaskPlan.length.toString(),
      statsDescription: "Task-oriented project plans created by teachers",
      Icon: ClipboardCheck,
      variant: "violet" as Variant,
      statsCardDialogTitle: "Filter Project Task Plans",
      statsCardDialogLabel: "View Details",
      onReset: resetProjectTaskFilters,
      statsCardDialogChildren: [
        {
          label: "Subject",
          value: filterProjectTaskBySubject,
          onSelect: setFilterProjectTaskBySubject,
          options: subjectLists.map((item) => item.subject),
          placeholder: "Select subject",
          icon: BookOpen,
        },
        {
          label: "Class",
          value: filterProjectTaskByClass,
          onSelect: setFilterProjectTaskByClass,
          options: yearClasses,
          placeholder: "Select class/year",
          icon: BookOpen,
        },
        {
          label: "Term",
          value: filterProjectTaskByTerm,
          onSelect: setFilterProjectTaskByTerm,
          options: termList,
          placeholder: "Select term",
          icon: ClipboardCheck,
        },
      ]

    },
    {
      statsTitle: "Project Facilitation Plans",
      statsValue: filterbyPlan(isGlobalFilter, filterProjectFacilitationPlan, filterGlobalProjectFacilitationPlan),
      // statsValue: filterProjectFacilitationPlan.length.toString(),
      statsDescription: "Plans focused on facilitating and managing project tasks",
      Icon: ClipboardCheck,
      variant: "amber" as Variant,
      statsCardDialogTitle: "Project Task Facilitation Plans",
      statsCardDialogLabel: "View Details",
      onReset: resetProjectFacilitationFilters,
      statsCardDialogChildren: [
        {
          label: "Subject",
          value: filterProjectFacilitationBySubject,
          onSelect: setFilterProjectFacilitationBySubject,
          options: subjectLists.map((item) => item.subject),
          placeholder: "Select subject",
          icon: BookOpen,
        },
        {
          label: "Class",
          value: filterProjectFacilitationByClass,
          onSelect: setFilterProjectFacilitationByClass,
          options: yearClasses,
          placeholder: "Select class/year",
          icon: BookOpen,
        },
        {
          label: "Term",
          value: filterProjectFacilitationByTerm,
          onSelect: setFilterProjectFacilitationByTerm,
          options: termList,
          placeholder: "Select term",
          icon: ClipboardCheck,
        },
      ]

    },
  ]

  async function fetchAnalyticsData(): Promise<IPlan[]> {
    const { data } = await axios.get(`${backendApi}/api/getPlanFiles`);

    // Buckets for each plan type
    const subjectAssessmentPlans: IPlan[] = [];
    const subjectLessonPlans: IPlan[] = [];
    const studentConductCharacterPlans: IPlan[] = [];
    const studentConductCharacterAssessmentPlans: IPlan[] = [];
    const projectTaskPlans: IPlan[] = [];
    const projectTaskFacilitationPlans: IPlan[] = [];

    // Group into buckets
    data.data.forEach((plan: IPlan) => {
      switch (plan.plan) {
        case "subjectAssessmentPlan":
          subjectAssessmentPlans.push(plan);
          break;
        case "subjectLessonPlan":
          subjectLessonPlans.push(plan);
          break;
        case "studentConductCharacterPlan":
          studentConductCharacterPlans.push(plan);
          break;
        case "studentConductCharacterAssessmentPlan":
          studentConductCharacterAssessmentPlans.push(plan);
          break;
        case "projectTaskPlan":
          projectTaskPlans.push(plan);
          break;
        case "projectTaskFacilitationPlan":
          projectTaskFacilitationPlans.push(plan);
          break;
      }
    });

    // Update zustand store here
    setSubjectAssessmentPlan(subjectAssessmentPlans);
    setSubjectLessonPlan(subjectLessonPlans);
    setConductCharacterLessonPlan(studentConductCharacterPlans);
    setConductCharacterAssessmentsPlan(studentConductCharacterAssessmentPlans);
    setProjectTaskPlan(projectTaskPlans);
    setProjectFacilitationPlan(projectTaskFacilitationPlans);
    return data.data;

  }

  const { isLoading, isError } = useQuery<IPlan[], Error>({
    queryKey: ["analyticsData"],
    queryFn: fetchAnalyticsData,
  });
  const [selectedChart, setSelectedChart] = useState("discipline");

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <Error />
  }

  const lessonPlanChartList = [
    {
      type: "bar", // custom flag if you want
      title: "Lesson Plans by Discipline",
      description: "Lesson plan counts grouped by six fixed disciplines.",
      data: lessonPlansByDiscipline,
      xKey: "name",
      key: "discipline",
      yKey: "count",
      yaxisDomain: ["auto", "auto"] as const,
      chartColor: "#fac815",
    },
    {
      type: "stacked", // custom flag if you want
      title: "Lesson Plans by School Level",
      description: "Monthly breakdown of lesson plans across Nursery, Primary, Secondary, and University.",
      data: chartData,
      key: "schoolLevel",

      xKey: "month",
      stackKeys: ["Nursery", "Primary", "Secondary", "University"],
      colors: ["#F5C242", "#E04A2F", "#111111", "#707070"],
    },
    {
      type: "bar",
      title: "Lesson Plans by Subject",
      description: "Top 10 subjects by lesson plan count (+ more)",
      data: lessonPlansBySubject,
      key: "subject",
      xKey: "name",
      yKey: "count",
      yaxisDomain: [0, 10] as const,
      chartColor: "#fac815",
    },
  ];

  // const subjectAssessmentChartList = [
  //   {
  //     type: "bar", // custom flag if you want
  //     title: "Lesson Plans by Discipline",
  //     description: "Lesson plan counts grouped by six fixed disciplines.",
  //     data: lessonPlansByDiscipline,
  //     xKey: "name",
  //     key: "discipline",
  //     yKey: "count",
  //     yaxisDomain: ["auto", "auto"] as const,
  //     chartColor: "#fac815",
  //   },
  //   {
  //     type: "stacked", // custom flag if you want
  //     title: "Lesson Plans by School Level",
  //     description: "Monthly breakdown of lesson plans across Nursery, Primary, Secondary, and University.",
  //     data: chartData,
  //     key: "schoolLevel",

  //     xKey: "month",
  //     stackKeys: ["Nursery", "Primary", "Secondary", "University"],
  //     colors: ["#F5C242", "#E04A2F", "#111111", "#707070"],
  //   },
  //   {
  //     type: "bar",
  //     title: "Lesson Plans by Subject",
  //     description: "Top 10 subjects by lesson plan count (+ more)",
  //     data: lessonPlansBySubject,
  //     key: "subject",
  //     xKey: "name",
  //     yKey: "count",
  //     yaxisDomain: [0, 10] as const,
  //     chartColor: "#fac815",
  //   },
  // ];

  const lessonPlanChart = lessonPlanChartList.find((c) => c.key === selectedChart);

  return (
    <>
      <GlobalFiltersBar />
      <Grid columns={2}>
        <StatsCard
          title="Total Teachers"
          value={getTotalTeachers().toString()}
          description="Unique teachers contributing lesson plans and assessments"
          icon={Users}
          variant="amber"
        />

        {analyticsCardList.map((item, index) =>
          <AnalyticsCard
            key={index}
            onReset={item.onReset}
            statsTitle={item.statsTitle}
            statsValue={item.statsValue}
            statsDescription={item.statsDescription}
            Icon={item.Icon}
            variant={item.variant}
            statsCardDialogTitle={item.statsCardDialogTitle}
            statsCardDialogLabel={item.statsCardDialogLabel}
            statsCardDialogChildren={
              <>
                {item.statsCardDialogChildren.map((child, idx) =>
                  <SelectWithIcon
                    key={idx}
                    label={child.label}
                    value={child.value}
                    onSelect={child.onSelect}
                    options={child.options}
                    placeholder={child.placeholder}
                    icon={child.icon}
                  />)}
              </>
            }
          />)}

      </Grid >

      <Row className="flex justify-center items-center">
        {/* Render Selected Chart */}
        <div className="relative flex flex-col">
          <div className="flex justify-end">
            <DashboardCustomSelect
              value={selectedChart}
              onValueChange={setSelectedChart}
              items={lessonPlanChartList.map((c) => ({ label: c.key, value: c.key }))}
            />
          </div>
          {lessonPlanChart && (
            <div className="w-6xl">
              {lessonPlanChart.type === "bar" && (
                <BarChartCustom
                  title={lessonPlanChart.title}
                  description={lessonPlanChart.description}
                  data={lessonPlanChart.data}
                  xKey={lessonPlanChart.xKey}
                  yKey={lessonPlanChart.yKey}
                  yaxisDomain={
                    lessonPlanChart.yaxisDomain ? ([...lessonPlanChart.yaxisDomain] as [any, any]) : undefined
                  }
                  chartColor={lessonPlanChart.chartColor}
                />
              )}
              {lessonPlanChart.type === "stacked" && (
                <BarChartStacked
                  title={lessonPlanChart.title}
                  description={lessonPlanChart.description}
                  data={lessonPlanChart.data}
                  xKey={lessonPlanChart.xKey}
                  stackKeys={lessonPlanChart.stackKeys ?? []}
                  colors={lessonPlanChart.colors}
                />
              )}
            </div>
          )}
        </div>




        {/* assessment */}
        {/* <BarChartCustom
          title="Assessments by Subject"
          description="Top 10 subjects by assessment count (+ more)"
          data={assessmentsBySubject}
          xKey="name"
          yKey="count"
          yaxisDomain={[0, 10]}
          chartColor="#fac815"
        /> */}
        {/* <LineChartCustom
          title="Lesson Plans Trend"
          // description="Monthly trend of lesson plans across school levels."
          data={trendOverTime}
          xKey="week"
          lines={[
            { key: "lessonPlans", color: "#F5C242" },
            { key: "assessments", color: "#E04A2F" },
          ]}
        /> */}
      </Row>


    </>
  )
}
