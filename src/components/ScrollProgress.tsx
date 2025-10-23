import { motion, useScroll, useSpring, Easing } from "framer-motion";
import React from "react";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-2 bg-primary origin-[0%]" 
      style={{ scaleX }}
      transition={{
        duration: 0.4,
        ease: [0.42, 0, 0.58, 1] as Easing,
      }}
    />
  );
};

export default React.memo(ScrollProgress);
