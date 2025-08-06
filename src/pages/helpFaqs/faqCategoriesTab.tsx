import BreadCrumb from "@/components/breadcrumb"
import FaqAccordion from "@/components/faqAccordion"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAutoOpenTour } from "@/hooks/useAutoOpenTour"
import { faqCategories, faqList } from "@/lib/constant"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import React from "react"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
export default function FaqCategoriesTab() {
  useAutoOpenTour();
  return (
    <>
      <div className="w-full h-12 bg-linear-65 px-4 rounded-b-md sticky top-0
       from-yellow-400 to-yellow-500 flex justify-start items-center">
        <BreadCrumb section="Help & Faqs" className="text-zinc-600 z-20" />
      </div>
      <Tabs
        // onValueChange={setTabTriggerValue}
        defaultValue={faqCategories[0].label}
        className="flex flex-row w-full h-screen items-start gap-8"
      >
        {/* Sidebar */}
        <div className="flex flex-col justify-start items-center gap-5 mt-5 ml-5 h-full">
          <h4 className="text-lg font-semibold">Table of Contents</h4>
          <TabsList
            className="flex flex-col justify-start items-start w-full p-4
          bg-transparent border-0 rounded-xl shadow-sm
           max-sm:w-full max-sm:flex-row h-auto
          max-sm:gap-2 max-sm:rounded-none"
          >
            {faqCategories.map((category, index) => (
              <TabsTrigger
                key={index}
                id={category.id}
                value={category.label}
                className={cn(
                  " cursor-pointer w-full justify-start text-left font-medium text-muted-foreground px-3 py-2 rounded-md transition-all",
                  "data-[state=active]:text-yellow-500 data-[state=active]:font-semibold"
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
          className="h-screen w-[2px] bg-yellow-400"
        />

        {/* Content Area */}
        <div className="p-4 w-full">
      <h2 className="text-3xl text-center font-semibold m-6 text-zinc-800">Questions Look Here</h2>
          <AnimatePresence mode="wait">
            {faqList.map(({ category, faqs }, index) =>
              // tabTriggerValue === category ? (
              <TabsContent key={index} value={category} className="w-full h-full relative">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="flex flex-col gap-5 w-full h-full" // Removed 'relative'
                >
                  {faqs.map(({ prompt, response }, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <FaqAccordion
                        prompt={prompt}
                        response={response}
                        className="border-0 rounded-md shadow-sm w-full bg-muted/25 py-2"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            )}
          </AnimatePresence>
        </div>
      </Tabs>
    </>
  )
}
