import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAiAssistantTabStore } from "@/store/aiAssistantTabStore";
import type { featureCardProps } from "@/types";
import { MoveRight } from "lucide-react";
import { Button } from "./ui/button";

const OverviewFeatureCard = ({
  heading,
  description,
  icon: Icon,
  color,
  tabValue,
  CTA: cta,
}: featureCardProps) => {
  const { addTabValue } = useAiAssistantTabStore();
  function handleTabValue() {
    addTabValue(tabValue);
  }
  return (
    <>
      <Card className="rounded-sm">
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
          <Button
            onClick={handleTabValue}
            size={"sm"}
            variant={"link"}
            className="text-red-500 flex justify-center items-center cursor-pointer font-inter"
          >
            {cta}
            <MoveRight />
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default OverviewFeatureCard;
