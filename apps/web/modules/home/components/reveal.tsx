"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type Props = { children: ReactNode; delay?: number; className?: string };

/** Fades and slides content in once when it scrolls into view. */
export function Reveal({ children, delay = 0, className }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}