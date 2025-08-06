import { Loader } from "@/components/Loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAutoOpenTour } from "@/hooks/useAutoOpenTour";
import { aiAssistantTabs } from "@/lib/constant";
import { useAiAssistantTabStore } from "@/store/aiAssistantTabStore";
import { useSidebarStore } from "@/store/sidebarStore";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense } from "react";

const OverviewTabs = () => {
  const { tabValue, addTabValue } = useAiAssistantTabStore();
  const { isOpen } = useSidebarStore();
  useAutoOpenTour();
  return (
    <>
      <Tabs
        value={tabValue}
        onValueChange={addTabValue}
        // onLoad={() => setIsOpen(true)}
        defaultValue={"Lesson Plans"}
        className="max-sm:justify-start max-sm:items-center
       flex flex-col relative"
      >
        <TabsList
          className={`grid ${isOpen ? "grid-cols-4" : "grid-cols-3"}
          gap-5 w-full mx-auto h-auto bg-neutral-50
          max-md:grid-cols-2`}
        >

          {aiAssistantTabs.map((tab, index) => {
            const tabsPerRow = isOpen ? 4 : 3;
            const totalTabs = aiAssistantTabs.length;

            const firstIndexOfLastRow = Math.floor((totalTabs - 1) / tabsPerRow) * tabsPerRow;
            const itemsInLastRow = totalTabs - firstIndexOfLastRow;

            const isInLastRow = index >= firstIndexOfLastRow;
            const isLastTab = index === totalTabs - 1;

            // Default col span
            let colSpanClass = "";

            // If it's the only item in the last row, span full width
            if (isInLastRow && itemsInLastRow === 1 && isLastTab) {
              colSpanClass = "col-span-full";
            }

            return (
              <TabsTrigger
                key={index}
                id={tab.id}
                value={tab.name}
                className={`relative flex items-center gap-2 px-4 py-2.5
        text-sm font-medium transition-all duration-300 rounded-xl
        bg-neutral-100 hover:bg-neutral-200/70
        flex-none cursor-pointer overflow-hidden w-full ${colSpanClass}`}
              >
                {tabValue === tab.name && (
                  <motion.div
                    layoutId="gradientTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-300 to-yellow-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  <span className="truncate">{tab.name}</span>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>


        <div className="w-full mt-4">
          <AnimatePresence mode="wait">
            {aiAssistantTabs.map((tab, index) =>
              tabValue === tab.name ? (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative z-0"
                >
                  <TabsContent value={tab.name}
                  >
                    <Suspense
                      fallback={<Loader />}>
                      {tab.component && <tab.component />}
                    </Suspense>
                  </TabsContent>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>
      </Tabs>
    </>
  );
};

export default OverviewTabs;
