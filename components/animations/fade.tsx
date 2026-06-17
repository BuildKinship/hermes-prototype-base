"use client";
// needed for framer-motion animate on mount

import { motion, type Variants, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.22, 1, 0.36, 1] as unknown as Transition["ease"];

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: EASE_OUT } as Transition,
  },
};

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/** Entrance animation — 0.28s cubic-bezier, 8px Y offset */
export function FadeUp({ children, className, delay = 0 }: FadeUpProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: fadeUpVariants.hidden,
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.28, ease: EASE_OUT, delay } as Transition,
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

/** Cascading entrance for card grids and student lists */
export function Stagger({ children, className, staggerDelay = 0.06 }: StaggerProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: staggerDelay } as Transition },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: EASE_OUT } as Transition,
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(className)}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={childVariants}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={childVariants}>{children}</motion.div>}
    </motion.div>
  );
}
