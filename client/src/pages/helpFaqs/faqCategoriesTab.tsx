import BreadCrumb from "@/components/breadcrumb"
import FaqAccordion from "@/components/faqAccordion"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAutoOpenTour } from "@/hooks/useAutoOpenTour"
import { faqCategories } from "@/lib/constant"
import { cn } from "@/lib/utils"
import { useSidebarStore } from "@/store/sidebarStore"
import { AnimatePresence, motion } from "framer-motion"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
export default function FaqCategoriesTab() {
  useAutoOpenTour();
  const { isOpen } = useSidebarStore()
  return (
    <>
      <BreadCrumb section="Help & FAQs" className="text-white"/>
      <Tabs
        defaultValue={faqCategories[0].label}
        className="flex flex-row
        max-lg:flex-col max-md:flex-col
        w-full h-screen items-start gap-8"
      >
        {/* Sidebar */}
        <div
          className="flex flex-col justify-start max-lg:h-auto
         items-center gap-5 mt-5 ml-5 h-full
         max-sm:w-full max-sm:justify-center max-sm:ml-0"
        >
          <TabsList
            className={`flex flex-col justify-start
             items-start w-full p-4 gap-3
            ${isOpen ? `
            max-lg:grid max-lg:grid-cols-3
             max-md:grid max-md:grid-cols-4
            ` : `max-lg:grid max-lg:grid-cols-2
             max-md:grid max-md:grid-cols-3
             max-sm:grid-cols-1`}
                      bg-transparent border-0 rounded-xl shadow-sm
           max-sm:w-full max-sm:flex-row h-auto
          max-sm:gap-2 max-sm:rounded-none`}
          >
            {faqCategories.map((category, index) => (
              <TabsTrigger
                key={index}
                id={category.id}
                value={category.label}
                className={cn(
                  "cursor-pointer w-full justify-start text-left font-medium text-gray-700 px-4 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-[var(--k12-secondary)]/50 dark:text-neutral-300",
                  "data-[state=active]:bg-[var(--k12-secondary)] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-sm",
                )}
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Vertical Separator */}
        <Separator
          orientation="vertical"
          className="h-screen w-[2px] bg-yellow-400
          max-sm:hidden max-md:hidden max-lg:hidden"
        />

        {/* Content Area */}
        <div className="p-4 w-full">
          <AnimatePresence mode="wait">
            {faqCategories.map((item, index) =>
              <TabsContent key={index} value={item.label}
                className="w-full h-full relative"
              >
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="flex flex-col gap-9 w-full h-full" // Removed 'relative'
                >
                  <FaqAccordion
                    category={item.label}
                    className="border-0 rounded-md shadow-sm w-full bg-muted/25 py-2 space-y-7"
                  />
                </motion.div>
              </TabsContent>
            )}
          </AnimatePresence>
        </div>
      </Tabs >
    </>
  )
}
