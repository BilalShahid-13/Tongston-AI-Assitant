import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAiAssistantTabStore } from "@/store/aiAssistantTabStore";
import type { featureCardProps } from "@/types";
import { BorderBeam } from "./magicui/border-beam";
import { InteractiveHoverButton } from "./magicui/interactive-hover-button";
import { useSidebarStore } from "@/store/sidebarStore";

const OverviewFeatureCard = ({
  heading,
  description,
  icon: Icon,
  color,
  tabValue,
  CTA: cta,
  index,
}: featureCardProps) => {
  const { addTabValue } = useAiAssistantTabStore();
  function handleTabValue() {
    addTabValue(tabValue);
  }
  const { isOpen } = useSidebarStore();
  return (
    <>
      <div className={`relative rounded-sm ${isOpen ? "w-full" : "max-w-[380px]"}
         `}>
        <BorderBeam
          duration={6}
          delay={3 * (index ?? 0)}
          size={400}
          borderWidth={2}
          className="from-transparent via-yellow-500 to-transparent"
        />
        <Card className={`rounded-sm  ${isOpen ? "w-full" : "max-w-[380px]"}`}>
          <CardHeader>
            <CardTitle className="flex flex-row justify-start items-center gap-5">
              <Icon
                className={`${color.highlighted} ${color.default} w-9 h-9 p-2 rounded-md`}
              />
              <h4>{heading}</h4>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-inter text-sm text-gray-600">{description}</p>
          </CardContent>
          <CardFooter>
            <InteractiveHoverButton
              onClick={handleTabValue}
            >{cta}</InteractiveHoverButton>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default OverviewFeatureCard;
