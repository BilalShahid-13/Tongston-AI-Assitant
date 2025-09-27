import type React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import type { JSX } from "react";
import { ChartContainer } from "./ui/chart";
import { ResponsiveContainer } from "recharts";

interface IChartsCard {
  title: string;
  description: string;
  // content:React.ReactNode
  content: JSX.Element
}

export default function ChartsCard({ title, description, content }: IChartsCard) {
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ count: { label: "Count", color: "#ffb900" } }}
            className="h-[250px] sm:h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              {content}
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  )
}
