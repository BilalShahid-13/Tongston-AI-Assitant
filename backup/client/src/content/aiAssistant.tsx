import OverviewTabs from "@/components/aiAssistant/overviewTabs";
import BreadCrumb from "@/components/breadcrumb";

function handleQuickStartGuideClick() {}
const AiAssitstant = () => {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="bg-yellow-400 flex flex-col gap-2 max-sm:gap-4 text-zinc-800 p-6
        justify-start items-start max-sm:max-w-full"
      >
        <BreadCrumb section={"Components"} currentPage="AI Assistant" />
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
        <p>Let's start creating!</p>
        <a
          className="hover:underline cursor-pointer italic font-inter"
          onClick={handleQuickStartGuideClick}
        >
          New Here? Read the quick start guide
        </a>
      </div>
      <OverviewTabs />
    </div>
  );
};

export default AiAssitstant;
