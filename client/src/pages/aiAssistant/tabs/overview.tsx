import OverviewFeatureCard from "@/components/overviewFeatureCard";
import {
  aiAssistantOverviewFeatures,
  aiAssistantRecentActivities,
} from "@/lib/constant";
import { useSidebarStore } from "@/store/sidebarStore";
import ActivityItem from "../activityItem";

const Overview = () => {
  const { isOpen } = useSidebarStore();
  return (
    <>
      <div className="flex flex-col gap-5">
        <div
          className={`flex flex-row gap-3 justify-start items-center
          max-sm:grid-cols-1 max-sm:w-full max-md:grid-cols-3
          
          ${isOpen
              ? "max-lg:grid max-lg:grid-cols-3 max-sm:grid-cols-1"
              : "max-lg:grid max-lg:grid-cols-1 max-sm:grid-cols-1"
            }`}
        >
          {aiAssistantRecentActivities.map((activity, index) => (
            <ActivityItem
              key={index}
              title={activity.name}
              icon={activity.icon}
              color={activity.color}
            />
          ))}
        </div>
        <div
          className={`grid grid-cols-3 gap-3 overflow-hidden mx-3
            max-md:grid-cols-2
          ${isOpen ? "max-lg:grid-cols-3" : "max-lg:grid-cols-1"}`}
        >
          {aiAssistantOverviewFeatures.map((feature, index) => (
            <OverviewFeatureCard
              key={index}
              index={index}
              heading={feature.heading}
              description={feature.description}
              icon={feature.icon}
              color={feature.color}
              CTA={feature.CTA}
              tabValue={feature.tabValue}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Overview;
