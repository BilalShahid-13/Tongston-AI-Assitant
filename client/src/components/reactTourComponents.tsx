import type React from "react"

import type { IWalkthroughSteps } from "@/types"
import { TourProvider, useTour } from "@reactour/tour";
import { CircleX, ChevronLeft, ChevronRight, Check, Sparkles } from "lucide-react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"

export function ReactTourBadge() {
  const { currentStep, steps } = useTour()

  return (
    <div className="absolute -left-3 -top-3 z-10">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.828_0.189_84.429)] to-[oklch(0.769_0.188_70.08)] rounded-full blur-md opacity-60 animate-pulse" />

        {/* Badge */}
        <Badge
          variant="outline"
          className="relative bg-gradient-to-r from-[oklch(0.828_0.189_84.429)] to-[oklch(0.769_0.188_70.08)]
            text-zinc-800 border-0 shadow-lg font-bold text-sm px-3 py-1 rounded-full"
        >
          {currentStep + 1}/{steps?.length}
        </Badge>
      </div>
    </div>
  )
}

export function ReactTourCloseBtn() {
  const { setIsOpen } = useTour()

  function closeTour() {
    setIsOpen(false)
  }

  return (
    <div className="absolute -top-3 -right-3 z-10">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.828_0.189_84.429)] to-[oklch(0.769_0.188_70.08)] rounded-full blur-md opacity-40" />

        {/* Close button */}
        <Button
          variant="default"
          size="icon"
          onClick={closeTour}
          className="relative size-9 bg-gradient-to-r from-[oklch(0.828_0.189_84.429)] to-[oklch(0.769_0.188_70.08)]
            hover:from-[oklch(0.828_0.189_84.429)]/90 hover:to-[oklch(0.769_0.188_70.08)]/90
            rounded-full shadow-lg border-0 text-zinc-800 hover:text-zinc-900 transition-all duration-200
            hover:scale-110"
        >
          <CircleX className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export function ReactTourContent({ content }: { content: string }) {
  return (
    <div className="flex flex-col gap-4 w-full mt-8 p-4">
      {/* Header with icon */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-[oklch(0.828_0.189_84.429)]/20 to-[oklch(0.769_0.188_70.08)]/20 rounded-lg">
          <Sparkles className="w-5 h-5 text-zinc-700" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-zinc-800 text-lg">Tour Guide</h4>
          <p className="text-xs text-zinc-600">Let's explore this feature</p>
        </div>
      </div>

      {/* Content */}
      <div
        className="bg-gradient-to-r from-[oklch(0.828_0.189_84.429)]/5 to-[oklch(0.769_0.188_70.08)]/5
        rounded-lg p-4 border border-[oklch(0.828_0.189_84.429)]/20"
      >
        <p className="font-medium text-zinc-800 leading-relaxed">{content}</p>
      </div>
    </div>
  )
}

export const ReactTourNav = () => {
  const { currentStep, setCurrentStep, steps, setIsOpen } = useTour()

  const handleFinish = () => {
    localStorage.setItem("tourCompleted", "true")
    setIsOpen(false)
  }

  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      {/* Progress indicators */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentStep
                ? "bg-gradient-to-r from-[oklch(0.828_0.189_84.429)] to-[oklch(0.769_0.188_70.08)] scale-125 shadow-lg"
                : index < currentStep
                  ? "bg-gradient-to-r from-[oklch(0.828_0.189_84.429)]/60 to-[oklch(0.769_0.188_70.08)]/60"
                  : "bg-zinc-300 hover:bg-zinc-400"
                }`}
            />
          ))}
        </div>
        <span className="text-sm text-zinc-600 ml-2">
          {currentStep + 1} of {steps.length}
        </span>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-3">
        {/* Previous button */}
        <Button
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={isFirstStep}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 px-4 py-2 border-[oklch(0.828_0.189_84.429)]/30
            hover:bg-[oklch(0.828_0.189_84.429)]/10 disabled:opacity-50 disabled:cursor-not-allowed
            text-zinc-700 hover:text-zinc-800 transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {/* Next/Finish button */}
        {!isLastStep ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r
              from-[oklch(0.828_0.189_84.429)] to-[oklch(0.769_0.188_70.08)]
              hover:from-[oklch(0.828_0.189_84.429)]/90 hover:to-[oklch(0.769_0.188_70.08)]/90
              text-zinc-800 font-semibold shadow-lg hover:shadow-xl
              transition-all duration-200 hover:scale-105"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r
              from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
              text-white font-semibold shadow-lg hover:shadow-xl
              transition-all duration-200 hover:scale-105"
          >
            <Check className="w-4 h-4" />
            Complete Tour
          </Button>
        )}
      </div>

      {/* Skip tour option */}
      <button
        onClick={() => setIsOpen(false)}
        className="text-xs text-zinc-500 hover:text-zinc-700 underline transition-colors"
      >
        Skip tour
      </button>
    </div>
  )
}

export const ReactTourProvider = ({
  walkthroughSteps,
  children,
}: {
  walkthroughSteps: IWalkthroughSteps[]
  children: React.ReactNode
}) => {
  const { theme } = useTheme()

  return (
    <TourProvider
      steps={walkthroughSteps}
      maskClassName="backdrop-blur-sm"
      components={{
        Close: ReactTourCloseBtn,
        Badge: ReactTourBadge,
        Navigation: ReactTourNav,
        Content: ReactTourContent,
      }}
      styles={{
        popover: (base) => ({
          ...base,
          padding: 0,
          margin:40,
          borderRadius: 20,
          // backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
          maxWidth: 400,
        }),
        maskWrapper: (base) => ({
          ...base,
          color: theme === "light" ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.8)",
        }),
      }}
      className="tour-provider"
    >
      {/* <style jsx global>{`
        .tour-provider [data-tour-elem="popover"] {
          background: ${theme === "light"
          ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)"
          : "linear-gradient(135deg, rgba(39, 39, 42, 0.95) 0%, rgba(39, 39, 42, 0.9) 100%)"
        };
          backdrop-filter: blur(20px);
          border: 1px solid ${theme === "light" ? "rgba(228, 189, 84, 0.2)" : "rgba(228, 189, 84, 0.3)"};
          box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04),
            0 0 0 1px rgba(228, 189, 84, 0.1);
          border-radius: 20px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .tour-provider [data-tour-elem="popover"]::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            oklch(0.828 0.189 84.429),
            oklch(0.769 0.188 70.08)
          );
        }

        .my-tour-mask {
          backdrop-filter: blur(4px);
        }
      `}</style> */}
      {children}
    </TourProvider>
  )
}
