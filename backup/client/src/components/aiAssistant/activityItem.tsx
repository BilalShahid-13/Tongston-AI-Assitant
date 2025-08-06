import { Badge } from "@/components/ui/badge";
import type { activityItemProps } from "@/types";
const ActivityItem = ({ icon: Icon, title, color }: activityItemProps) => {
  return (
    <>
      <Badge
        variant="secondary"
        className={`${color.highlighted} py-[6px] px-4 flex flex-row justify-start items-center gap-3 max-sm:w-full`}
      >
        <div>
          <Icon
            className={`${color.default} w-5 h-5`} // Increase width and height classes here
          />
        </div>
        <p className="capitalize font-inter text-sm font-normal">
          {" "}
          {title} : 05
        </p>
      </Badge>
    </>
  );
};

export default ActivityItem;
