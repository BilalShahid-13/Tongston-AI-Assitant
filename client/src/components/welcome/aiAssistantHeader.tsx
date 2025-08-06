import BreadCrumb from "@/components/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { welcomeScreenList } from "@/lib/constant";
import OverviewTabs from "@/pages/aiAssistant/overviewTabs";
const AiAssitstantHeader = () => {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="bg-yellow-400 flex flex-col gap-2 max-sm:gap-4 text-zinc-800 p-6
        justify-start items-start max-sm:max-w-full"
      >
        <BreadCrumb section="AI Assistant" />
        <h2
          className="text-3xl font-inter font-semibold
         max-sm:text-center
          max-sm:text-lg max-sm:w-full text-wrap"
          style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
        >
          Welcome to T-World K-12 EntreEdu AI!
        </h2>

        <p className="font-normal">
          Your AI teaching assistant for lesson plans, assessments, student
          conduct KPIs, project tasks, reports, and more powered by Bloom's
          Taxonomy, Multiple Intelligences, Tongston's 6 subject disciplines,
          and exam-aligned question banks.
        </p>
        <div className="flex flex-col gap-2 w-full">
          <h3 className="font-semibold">Let's start creating!</h3>
          <h4 className="font-medium">View Key Features Overview</h4>
          <h6>What can I do?</h6>
          <Accordion type="single" collapsible id="welcome-accordion">
            <AccordionItem value="item-1">
              <AccordionTrigger className="cursor-pointer">As your AI entrepreneurial education assistant, I can help you:
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6">
                  {welcomeScreenList.map((item, index) => (
                    <li className="font-normal" key={index}>
                      {item}
                    </li>
                  ))}
                </ul>
              </AccordionContent>

            </AccordionItem>
          </Accordion>
        </div>
        {/* <a
          className="hover:underline cursor-pointer italic font-inter"
          onClick={handleQuickStartGuideClick}
        >
          New Here? Read the quick start guide
        </a> */}
      </div>
      <OverviewTabs />
    </div>
  );
};

export default AiAssitstantHeader;
