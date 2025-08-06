import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aiAssistantTabs } from "@/lib/constant";
import { useAiAssistantTabStore } from "@/store/aiAssistantTabStore";
import TabContentComponent from "../sidebar/tabContentComponent";

const OverviewTabs = () => {
  const { tabValue, addTabValue } = useAiAssistantTabStore();

  return (
    <>
      <Tabs
        value={tabValue}
        onValueChange={addTabValue}
        defaultValue={"Lesson Plans"}
        className="max-sm:justify-start max-sm:items-center"
      >
        <TabsList
          className={`
            w-full gap-5 rounded-none h-12 max-sm:h-14 max-sm:rounded-lg
            flex flex-row items-center justify-start
             max-sm:overflow-x-auto max-sm:max-w-sm
            max-sm:flex-nowrap max-sm:gap-2 bg-neutral-50
            scroll-smooth no-scrollbar
          `}
        >
          {aiAssistantTabs.map((tab, index) => (
            <TabsTrigger
              key={index}
              value={tab.name}
              className={`
                flex-none border-b-2 rounded-none max-2xl:flex-1
                ${tabValue === tab.name ? "border-b-primary" : ""}
                transition-all ease-in duration-200
                data-[state=active]:bg-transparent py-4 px-7
                max-sm:text-sm max-sm:py-2 max-sm:px-3 cursor-pointer
              `}
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {aiAssistantTabs.map((tab, index) => (
          <TabContentComponent
            key={index}
            value={tab.name}
            className="mx-2 mt-2"
            Component={tab.component}
          />
        ))}
      </Tabs>
    </>
  );
};

export default OverviewTabs;
