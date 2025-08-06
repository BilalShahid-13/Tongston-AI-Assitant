import { motion, useScroll, useSpring } from "framer-motion"
import type React from "react";

export default function ScrollAnimate({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    container: scrollRef,
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  return (
    <>
      {scrollRef && <motion.div style={{ scaleX }}
        className="relative h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 origin-left rounded-md" />}
    </>
  )
}
