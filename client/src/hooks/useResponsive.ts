import { useState, useEffect } from "react";

// Define the breakpoints for different screen sizes.
const BREAKPOINTS = {
  xs: 480, // Small mobile (extra small)
  sm: 768, // Small tablet
  md: 1024, // Medium tablet
  lg: 1280, // Large tablet/Small desktop
  xl: 1440, // Extra large screens
  xxl: 1920,
};

type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

interface UseResponsiveReturn {
  screenSize: ScreenSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const useResponsive = (): UseResponsiveReturn => {
  const [screenSize, setScreenSize] = useState<ScreenSize>("xs");

  const handleResize = () => {
    const width = window.innerWidth;

    if (width < BREAKPOINTS.sm) {
      setScreenSize("xs");
    } else if (width >= BREAKPOINTS.sm && width < BREAKPOINTS.md) {
      setScreenSize("sm");
    } else if (width >= BREAKPOINTS.md && width < BREAKPOINTS.lg) {
      setScreenSize("md");
    } else if (width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl) {
      setScreenSize("lg");
    } else if (width >= BREAKPOINTS.xl && width < BREAKPOINTS.xxl) {
      setScreenSize("xl");
    } else {
      setScreenSize("xxl");
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = screenSize === "xs" || screenSize === "sm";
  const isTablet = screenSize === "md" || screenSize === "lg";
  const isDesktop = screenSize === "xl" || screenSize === "xxl";

  return { screenSize, isMobile, isTablet, isDesktop };
};

export default useResponsive;
