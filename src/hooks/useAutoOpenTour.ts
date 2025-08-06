import { useEffect } from "react";
import { useTour } from "@reactour/tour"; // adjust based on your import

export function useAutoOpenTour() {
  const { setIsOpen } = useTour();

  useEffect(() => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (tourCompleted !== "true") {
      const raf = requestAnimationFrame(() => {
        setTimeout(() => {
          setIsOpen(true);
        }, 100);
      });

      return () => cancelAnimationFrame(raf);
    }
  }, []);
}
