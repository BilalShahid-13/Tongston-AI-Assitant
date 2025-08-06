import type { IWalkthroughSteps } from "@/types";
import { TourProvider, useTour } from "@reactour/tour";
import { CircleX } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function ReactTourBadge() {
  const { currentStep } = useTour();

  return (
    <Badge variant="outline"
      className="mt-1 bg-linear-to-r absolute -left-2 -top-2
       from-yellow-300 to-yellow-500 w-fit rounded-full
       shadow-md">
      {currentStep}
    </Badge>
  );
}

export function ReactTourCloseBtn() {
  const { setIsOpen } = useTour();

  function closeTour() {
    setIsOpen(false);
    localStorage.setItem("tourCompleted", "true");
  }
  return (
    <>
      {/* <ReactTourBadge /> */}
      <Button variant={"default"} size={"icon"}
        onClick={closeTour}
        className="size-8 absolute -top-2 -right-2
         hover:bg-yellow-400 cursor-pointer">
        <CircleX />
      </Button>
    </>
  )
}


export function ReactTourContent({ content }: { content: string }) {
  return (
    <>
      <div className="flex flex-col gap-3 w-full">
        <ReactTourBadge />
        <p className="font-semibold text-zinc-800">{content}</p>
      </div>
    </>
  )
}

export const ReactTourNav = () => {
  const { currentStep, setCurrentStep, steps, setIsOpen } = useTour();

  const handleFinish = () => {
    localStorage.setItem("tourCompleted", "true");
    setIsOpen(false);
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <div className="flex gap-1">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`w-2.5 h-2.5 rounded-full ${index === currentStep ? "bg-yellow-400" : "bg-zinc-300"
              }`}
          />
        ))}
      </div>
      <div className="flex gap-2">
        {!isLastStep && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
            className="px-3 py-1 rounded bg-zinc-200 text-zinc-700 hover:bg-zinc-300 disabled:opacity-50"
          >
            ← Prev
          </button>
        )}
        {!isLastStep ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="px-3 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
};

export const ReactTourProvider = ({
  walkthroughSteps,
  children,
}: {
  walkthroughSteps: IWalkthroughSteps[];
  children: React.ReactNode;
}) => {
  const { setIsOpen } = useTour()
  return (
    <TourProvider
      steps={walkthroughSteps}
      maskClassName="my-tour-mask"
      components={{
        Close: ReactTourCloseBtn,
        Badge: ReactTourBadge,
        Navigation: ReactTourNav,
      }}
      onClickMask={() => setIsOpen(false)}
      styles={{
        dot: (
          base: React.CSSProperties,
          state?: { [key: string]: any }
        ): React.CSSProperties => ({
          ...base,
          backgroundColor: state?.current ? "#facc15" : "#e5e7eb",
          width: "10px",
          height: "10px",
          borderRadius: "9999px",
          margin: "0 4px",
        }),
      }}
      className="bg-white text-md text-zinc-700 gap-2 justify-start items-center text-sm italic font-sans"
    >
      {children}
    </TourProvider>
  );
};
