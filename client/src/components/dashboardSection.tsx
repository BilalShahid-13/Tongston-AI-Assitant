import BreadCrumb from "@/components/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAutoOpenTour } from "@/hooks/useAutoOpenTour"
import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  ClipboardCheck,
  FileText,
  FolderOpen,
  GraduationCap,
  Lightbulb,
  Target,
  Users,
} from "lucide-react"
export default function DashboardSection() {
  const bgColor = `bg-gradient-to-br from-[var(--k12-primary)] to-[var(--k12-secondary)]`
  const features = [
    {
      category: "Lesson Planning & Teaching",
      icon: <BookOpen className="h-6 w-6" />,
      color: "border-2",
      id: "subject-lesson-plan",
      bgColor: bgColor,
      items: [
        {
          title: "Subject-Specific Lesson Plans",
          description: "Create comprehensive lesson plans aligned with Tongston's entrepreneurial education scheme",
          icon: <FileText className="h-5 w-5 text-zinc-800" />,
        },
        {
          title: "Teaching Notes & Resources",
          description: "Generate detailed teaching notes and educational resources for effective instruction",
          icon: <BookOpen className="h-5 w-5 text-zinc-800" />,
        },
        {
          title: "Weekly Facilitation Plans",
          description: "Create project-based weekly lesson facilitation plans for cross-disciplinary learning",
          icon: <Calendar className="h-5 w-5 text-zinc-800" />,
        },
      ],
    },
    {
      category: "Assessment & Evaluation",
      id: "subject-assessments",
      icon: <ClipboardCheck className="h-6 w-6" />,
      color: "border-2",
      bgColor: bgColor,
      items: [
        {
          title: "Continuous Assessment Design",
          description: "Design subject-based continuous assessments with comprehensive marking guides",
          icon: <Target className="h-5 w-5 text-zinc-800" />,
        },
        {
          title: "End-of-Term Assessments",
          description: "Create comprehensive end-of-term evaluations with model answers and rubrics",
          icon: <ClipboardCheck className="h-5 w-5 text-zinc-800" />,
        },
        {
          title: "Performance Reports",
          description: "Compile detailed student performance reports for parents and school insights",
          icon: <BarChart3 className="h-5 w-5 text-zinc-800" />,
        },
      ],
    },
    {
      category: "Project-Based Learning",
      id: "project-tasks",
      icon: <Lightbulb className="h-6 w-6" />,
      color: "border-2",
      bgColor: bgColor,
      items: [
        {
          title: "Real-World Skills Projects",
          description: "Design entrepreneurial project-based learning tasks across disciplines",
          icon: <Brain className="h-5 w-5 text-zinc-800" />,
        },
        {
          title: "Cross-Disciplinary Tasks",
          description: "Create integrated learning experiences that span multiple subject areas",
          icon: <Lightbulb className="h-5 w-5 text-zinc-800" />,
        },
        {
          title: "Skill-Building Activities",
          description: "Develop practical activities that build entrepreneurial and life skills",
          icon: <Award className="h-5 w-5 text-zinc-800" />,
        },
      ],
    },
    {
      category: "Character & Conduct",
      id: "student-conduct-and-character-lesson-plan",
      icon: <Users className="h-6 w-6" />,
      color: "border-2",
      bgColor: bgColor,
      items: [
        {
          title: "Character Development Plans",
          description: "Create student conduct & character lesson plans aligned with Tongston's model",
          icon: <Users className="h-5 w-5 text-zinc-800" />,
        },
        {
          title: "Character KPI Assessments",
          description: "Generate conduct & character assessments linked to specific KPIs",
          icon: <Target className="h-5 w-5 text-zinc-800" />,
        },
        {
          title: "Behavioral Tracking",
          description: "Monitor and assess student character development over time",
          icon: <BarChart3 className="h-5 w-5 text-zinc-800" />,
        },
      ],
    },
  ]

  const resources = [
    {
      title: "Lesson Plan Reports",
      description: "Access folders of lesson plan marking reports and feedback",
      icon: <FileText className="h-5 w-5 text-zinc-800" />,
    },
    {
      title: "Teaching Resources",
      description: "Organized folders of lesson plans, notes, and facilitation guides",
      icon: <BookOpen className="h-5 w-5 text-zinc-800" />,
    },
    {
      title: "Performance Analytics",
      description: "Student performance reports and educational insights dashboard",
      icon: <BarChart3 className="h-5 w-5 text-zinc-800" />,
    },
    {
      title: "Project Tasks",
      description: "Weekly lesson facilitation plans and project-based learning resources",
      icon: <FolderOpen className="h-5 w-5 text-zinc-800" />,
    },
  ]
  useAutoOpenTour();
  return (
    <>
        <BreadCrumb section="AI Assistant" />
      <div className="flex flex-col gap-6">
        <div className="
        bg-gradient-to-r from-[var(--k12-secondary)] from-10% to-[var(--k12-secondary)] to-90% flex flex-col gap-4 text-zinc-800 p-8 rounded-lg shadow-lg max-sm:gap-4 max-sm:p-6">

          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/90 dark:bg-white/10 backdrop-blur-sm p-3 rounded-full shadow-md">
              <GraduationCap className="h-8 w-8 text-zinc-800" />
            </div>
            <div>
              <h2
                className="text-4xl font-inter font-bold max-sm:text-2xl text-wrap text-zinc-800"
                style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
              >
                Welcome to T-World K-12 EntreEdu AI!
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="bg-white/90 dark:bg-white/10 text-zinc-800 border-zinc-200 dark:border-white/30">
                  K-12 Education
                </Badge>
                <Badge variant="secondary" className="bg-white/90 text-zinc-800 dark:bg-white/10 border-zinc-200 dark:border-white/30">
                  Entrepreneurial Education
                </Badge>
                <Badge variant="secondary" className="bg-white/90 text-zinc-800 dark:bg-white/10 border-zinc-200 dark:border-white/30">
                  AI-Powered
                </Badge>
              </div>
            </div>
          </div>

          <p id="welcome-accordion"
          className="font-normal text-lg leading-relaxed
          max-lg:text-left max-md:text-left text-zinc-800">
            Your AI teaching assistant for lesson plans, assessments, student conduct KPIs, project tasks, reports, and
            more powered by Bloom's Taxonomy, Multiple Intelligences, Tongston's 6 subject disciplines, and exam-aligned
            question banks.
          </p>

          <div className="flex flex-col gap-4 w-full">
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-8 flex flex-col justify-center items-center">
          <div className="text-center w-full max-w-4xl">
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-neutral-300 mb-2">
              Comprehensive Educational Tools
              </h3>
            <p className="text-zinc-600 dark:text-neutral-400 max-lg:text-left max-md:text-left max-lg:mx-2">
              Your AI teaching assistant for lesson plans, assessments, student conduct KPIs, project tasks, reports, and more powered by Tongston's Entrepreneurial Education Curriculum & 33 Principles, Bloom's Taxonomy, Multiple Intelligences, Tongston's 6 Disciplines - Citizenship, Arts, English, Mathematics, Science & Technology and Business & Entrepreneurship & 30 subjects and standardised assessment & lesson plan-aligned question banks for all K-12 levels.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {features.map((category, categoryIndex) => (
              <Card
                id={category?.id}
                key={categoryIndex}
                className={`${category.color} ${category.bgColor}
                   hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/90 dark:bg-white/60 dark:text-zinc-800 backdrop-blur-sm rounded-lg shadow-sm">{category.icon}</div>
                    <CardTitle className="text-lg text-zinc-800">{category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-start gap-3 p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
                      >
                        <div className="mt-0.5">{item.icon}</div>
                        <div>
                          <h4 className="font-semibold text-zinc-800 mb-1 text-sm">{item.title}</h4>
                          <p className="text-xs text-zinc-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resources Section */}
          <div className="bg-gradient-to-r from-[var(--k12-secondary)]/10 to-[var(--k12-secondary)]/10 rounded-xl shadow-lg p-6 border border-[oklch(0.828_0.189_84.429)]/20">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold dark:text-white/80 text-zinc-800 mb-2">“VIP” Resource Library & Tools</h3>
              <p className="text-zinc-600 dark:text-white/80">
             Access comprehensive entrepreneurial educational resources and tools to manage learners’ experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            id="lesson-plan-marking">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-lg bg-gradient-to-br
                   from-[var(--k12-tertiary)]/50 to-[var(--k12-tertiary)]/50
                   hover:from-[var(--k12-tertiary)]/60 hover:to-[var(--k12-tertiary)]/30
                   transition-all duration-300 hover:scale-105"
                >
                  <div className="flex justify-center mb-3">
                    <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">{resource.icon}</div>
                  </div>
                  <h4 className="font-semibold text-zinc-800 dark:text-neutral-100 mb-2 text-sm">{resource.title}</h4>
                  <p className="text-xs text-zinc-600 dark:text-neutral-200">{resource.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
