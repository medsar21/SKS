"use client";
import { motion, useReducedMotion } from "motion/react";
export function Reveal({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={false}
      whileInView={
        reduced ? { opacity: 1, y: 0 } : { opacity: [0, 1], y: [28, 0] }
      }
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
