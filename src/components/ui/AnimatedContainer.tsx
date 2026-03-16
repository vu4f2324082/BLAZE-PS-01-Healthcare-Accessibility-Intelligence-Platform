"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedContainer({ children, className, delay = 0 }: AnimatedContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.43, 0.13, 0.23, 0.96] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
