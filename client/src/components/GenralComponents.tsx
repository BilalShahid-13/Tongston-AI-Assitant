import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Loader2, Wand } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

interface IHeadingProps {
  children: React.ReactNode
}

interface IContainerProps {
  children: React.ReactNode,
  className?: string
  gaps?: "sm" | "md" | "lg" | "xl",
  // columns:1,2,3,4
}

type SubmitButtonProps = | {
  text?: string,
  variant?: "secondary",
  loading?: boolean,
  statusMessage?: string | null
} | {
  variant: "primary";
  text?: string;
  loading: boolean;
  statusMessage: string | null;
}

function componentVariants(className?: string) {
  return (
    cva(className,
      {
        variants: {
          gaps: {
            sm: "gap-2",
            md: "gap-4",
            lg: "gap-6",
            xl: "gap-8"
          }
        }
      }
    )
  )

}

export const Heading = ({ children }: IHeadingProps) => {
  return (
    <h6 className="font-medium text-base font-mon">{children}</h6>
  )
}

export const Container = ({ children, gaps }: IContainerProps) => {
  const variants = componentVariants("flex flex-col gap-4 w-full")
  return (
    <div className={cn(variants({ gaps }))}>
      {children}
    </div>
  )
}

export const ContainerPlan = ({
  children,
  showPanel = false
}: {
  children: React.ReactNode;
  showPanel: boolean;
}) => {
  return (
    <div
      className={`relative grid ${showPanel ? "grid-cols-2 max-sm:grid-cols-1" : "grid-cols-1"}
        gap-4 max-sm:grid-cols-1 transition-all
        max-h-[95vh] overflow-hidden max-sm:*overflow-y-scroll max-sm:max-h-full duration-300 ease-in-out`}
    >
      {children}
    </div>
  );
};
export const Grid = ({ children, columns = 2 }: { children: React.ReactNode, columns?: 2 | 3 | 4 }) => {
  return (
    <div className={`grid grid-cols-${columns} gap-x-4 gap-y-6
      max-md:grid-cols-1 max-lg:grid-cols-1 max-sm:grid-cols-1
     transition-all duration-150`}>{children}</div>)
}

export const Row = ({ children, className, gaps }: IContainerProps) => {
  const variants = componentVariants("grid grid-flow-row w-full max-sm:grid-cols-1 max-sm:grid max-lg:grid max-lg:grid-cols-1")
  return (
    <div className={cn(variants({ gaps }), className)}>{children}</div>
  )
}

export const SubmitButton = ({ text = "Lesson Plan", variant = "secondary", loading, statusMessage }: SubmitButtonProps) => {
  if (variant === "primary") {
    return (
      <Button type="submit" variant={"primary"}
        className="bg-gradient-to-r from-yellow-300 to-yellow-500
         hover:from-yellow-500 hover:to-yellow-300 transition-all duration-500">
        {
          loading ? <>
            <Loader2 className="animate-spin" />
            {statusMessage || "Generating"}
          </> :
            <>
              <Wand />
              Generate {text}
            </>
        }
      </Button >
    )
  } else {
    return (
      <Button type="submit" variant={"primary"} >
        {text}
      </Button>)
  }
}