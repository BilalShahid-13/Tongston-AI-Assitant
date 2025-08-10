import { Loader } from "@/components/Loader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAutoOpenTour } from "@/hooks/useAutoOpenTour"
import { aiAssistantTabs } from "@/lib/constant"
import { useAiAssistantTabStore } from "@/store/aiAssistantTabStore"
import { useSidebarStore } from "@/store/sidebarStore"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { Suspense, useRef } from "react"

const OverviewTabs = () => {
  const { tabValue, addTabValue } = useAiAssistantTabStore()
  const { isOpen } = useSidebarStore()
  const tabRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  useAutoOpenTour();

  // Helper function to get tab descriptions
  const getTabDescription = (tabName: string) => {
    const descriptions = {
      Overview: "Dashboard & quick access",
      "Subject Lesson Plan": "Create curriculum lessons",
      "Subject Assessments": "Design evaluations & tests",
      "Student Conduct and Character Lesson Plan": "Character development plans",
      "Student Conduct and Character Assessments": "Conduct & character KPIs",
      "Project tasks": "Real-world learning projects",
      "Project Tasks Lesson Facilitation Plan": "Project facilitation guides",
      "Lesson Plan Marking & Report Generator": "Generate marking reports",
    }
    return descriptions[tabName as keyof typeof descriptions] || "Educational tool"
  }

  // Helper function to get detailed descriptions for content headers
  const getDetailedDescription = (tabName: string) => {
    const descriptions = {
      Overview: "Get a comprehensive view of all your AI assistant tools and recent activities",
      "Subject Lesson Plan": "Create detailed lesson plans aligned with Tongston's entrepreneurial education scheme",
      "Subject Assessments": "Design comprehensive assessments with marking guides and model answers",
      "Student Conduct and Character Lesson Plan":
        "Develop character-building lesson plans using Tongston's educational model",
      "Student Conduct and Character Assessments": "Create assessments for tracking student conduct and character KPIs",
      "Project tasks": "Design entrepreneurial project-based learning tasks across disciplines",
      "Project Tasks Lesson Facilitation Plan":
        "Create weekly facilitation plans for project-based learning experiences",
      "Lesson Plan Marking & Report Generator": "Generate comprehensive marking reports and performance analytics",
    }
    return descriptions[tabName as keyof typeof descriptions] || "Educational content creation tool"
  }

  return (
    <div className="w-full">
      <Tabs value={tabValue} onValueChange={addTabValue} defaultValue={"Overview"} className="w-full">
        {/* Enhanced Header */}
        <div className="mb-6 ml-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-[oklch(0.828_0.189_84.429)] to-[oklch(0.769_0.188_70.08)] rounded-lg">
              <Sparkles className="h-5 w-5 text-zinc-800" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-800">AI Assistant Tools</h3>
              <p className="text-sm text-zinc-600">Choose a tool to get started with your educational content</p>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs List */}
        <TabsList
          className={`grid ${isOpen ? "grid-cols-4" : "grid-cols-3"}
            gap-3 w-full mx-auto h-auto bg-gradient-to-r from-[oklch(0.828_0.189_84.429)]/10 to-[oklch(0.769_0.188_70.08)]/10
            p-2 rounded-2xl border border-[oklch(0.828_0.189_84.429)]/20 backdrop-blur-sm
            max-lg:grid-cols-2 max-sm:grid-cols-1`}
        >
          {aiAssistantTabs.map((tab, index) => {
            const tabsPerRow = isOpen ? 4 : 3
            const totalTabs = aiAssistantTabs.length
            const firstIndexOfLastRow = Math.floor((totalTabs - 1) / tabsPerRow) * tabsPerRow
            const itemsInLastRow = totalTabs - firstIndexOfLastRow
            const isInLastRow = index >= firstIndexOfLastRow
            const isLastTab = index === totalTabs - 1

            // Default col span
            let colSpanClass = ""
            // If it's the only item in the last row, span appropriate width
            if (isInLastRow && itemsInLastRow === 1 && isLastTab) {
              colSpanClass = "col-span-full max-lg:col-span-2 max-sm:col-span-1"
            } else if (isInLastRow && itemsInLastRow === 2 && (index === totalTabs - 2 || index === totalTabs - 1)) {
              colSpanClass = "max-lg:col-span-1"
            }

            const isActive = tabValue === tab.name

            return (
              <TabsTrigger
                key={index}
                id={tab.id}
                name={tab.name}
                value={tab.name}
                className={`relative flex items-center gap-3 px-4 py-4 text-sm font-medium
                  transition-all duration-300 rounded-xl cursor-pointer overflow-hidden w-full
                  border-2 border-transparent hover:border-[oklch(0.828_0.189_84.429)]/30
                  ${colSpanClass}
                  ${isActive
                    ? "bg-gradient-to-r from-[oklch(0.828_0.189_84.429)] to-[oklch(0.769_0.188_70.08)] text-zinc-800 shadow-lg"
                    : "bg-white/80 hover:bg-white text-zinc-700 hover:text-zinc-800 shadow-sm hover:shadow-md"
                  }`}
              >
                {/* Active tab glow effect */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[oklch(0.828_0.189_84.429)] to-[oklch(0.769_0.188_70.08)] opacity-20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Tab content */}
                <div className="relative z-10 flex items-start gap-3 w-full">
                  <div
                    className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isActive
                      ? "bg-white/20 backdrop-blur-sm"
                      : "bg-gradient-to-r from-[oklch(0.828_0.189_84.429)]/10 to-[oklch(0.769_0.188_70.08)]/10"
                      }`}
                  >
                    <tab.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <span className="font-semibold block truncate text-xs leading-tight">{tab.name}</span>
                    <span className="text-xs opacity-75 block truncate mt-1">{getTabDescription(tab.name)}</span>
                  </div>
                </div>

                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[oklch(0.828_0.189_84.429)]/5 to-[oklch(0.769_0.188_70.08)]/5 opacity-0 hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Enhanced Content Area */}
        <div className="w-full mt-8">
          <AnimatePresence mode="wait">
            {aiAssistantTabs.map((tab, index) =>
              tabValue === tab.name ? (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative"
                >
                  <TabsContent
                    key={index}
                    ref={(el) => { tabRefs.current[tab.name] = el }}
                    value={tab.name}
                    className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    {/* Content wrapper with enhanced styling */}
                    <div className="bg-white rounded-2xl shadow-lg border border-[oklch(0.828_0.189_84.429)]/10 overflow-hidden">
                      {/* Content header */}
                      <div className="bg-gradient-to-r from-[oklch(0.828_0.189_84.429)]/5 to-[oklch(0.769_0.188_70.08)]/5 px-6 py-4 border-b border-[oklch(0.828_0.189_84.429)]/10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-[oklch(0.828_0.189_84.429)] to-[oklch(0.769_0.188_70.08)] rounded-lg">
                            <tab.icon className="w-5 h-5 text-zinc-800" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-zinc-800 text-lg">{tab.name}</h4>
                            <p className="text-sm text-zinc-600 mt-1">{getDetailedDescription(tab.name)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Content body */}
                      <div className="p-6">
                        <Suspense
                          fallback={
                            <div className="flex items-center justify-center py-12">
                              <div className="text-center">
                                <div className="mb-4">
                                  <div className="p-3 bg-gradient-to-r from-[oklch(0.828_0.189_84.429)]/10 to-[oklch(0.769_0.188_70.08)]/10 rounded-full w-fit mx-auto">
                                    <tab.icon className="w-6 h-6 text-zinc-600" />
                                  </div>
                                </div>
                                <Loader />
                                <p className="text-sm text-zinc-600 mt-4">Loading {tab.name.toLowerCase()}...</p>
                              </div>
                            </div>
                          }
                        >
                          {tab.component && <tab.component />}
                        </Suspense>
                      </div>
                    </div>
                  </TabsContent>
                </motion.div>
              ) : null,
            )}
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  )
}

export default OverviewTabs
