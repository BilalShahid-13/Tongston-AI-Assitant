import type { TabContentProps } from "@/types";
import { TabsContent } from "../ui/tabs";

const TabContentComponent = ({
  value,
  Component,
  className,
}: TabContentProps) => {
  return (
    <TabsContent value={value} className={className}>
      <Component />
    </TabsContent>
  );
};

export default TabContentComponent;
