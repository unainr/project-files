"use client";

import Link from "next/link";
import { ArrowRight, Bug, Gauge, Lock, Terminal } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/modules/dashboard/components/copy-button";

import { HeroStack } from "./hero-stack";
import { HeroGrid } from "./hero-gird";

const INSTALL_COMMAND = "npm install @tracelayer/sdk";

const FEATURES = [
  {
    icon: Terminal,
    title: "Every call, step by step",
    text: "Status, duration, model, input and output for each span.",
  },
  {
    icon: Gauge,
    title: "Latency and tokens",
    text: "Spot slow requests and see token usage as it is reported.",
  },
  {
    icon: Bug,
    title: "Errors with context",
    text: "Jump from a failed trace to the span that caused it.",
  },
] as const;

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: "easeOut" as const, delay },
  });

  return (
    <section className="relative isolate -mt-20 overflow-hidden">
      {/* Background: cursor-lit grid + violet glows (decorative, clipped by the section) */}
      <HeroGrid />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 size-80 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute right-0 top-40 size-72 rounded-full bg-indigo-500/15 blur-3xl" />
        {/* Soft fade into the page background, so the section never ends in a hard line */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10 lg:px-8 lg:pt-36">
        {/* Copy */}
        <div className="min-w-0 space-y-7">
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300">
              <span className="relative flex size-1.5" aria-hidden="true">
                <span className="absolute inline-flex size-full rounded-full bg-violet-500 opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex size-1.5 rounded-full bg-violet-500" />
              </span>
              AI observability for developers
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.05)}
            className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          >
            See what your AI app{" "}
            <span className="bg-linear-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
              is really doing
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.1)}
            className="max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
          >
            TraceLayer captures every LLM call your app makes, with status,
            duration, model, input and output, token usage and errors, so you
            can debug faster and ship with confidence.
          </motion.p>

          <motion.div
            {...fadeUp(0.15)}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg" className="gap-2">
              <Link href="/projects">
                Start tracing
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </motion.div>

          {/* Install snippet */}
          <motion.div {...fadeUp(0.2)} className="max-w-md space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Install the SDK</p>
            <div className="flex items-center justify-between gap-2 rounded-lg border bg-card/70 py-1.5 pl-3 pr-1.5 backdrop-blur">
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm">
                <span className="select-none text-muted-foreground">$ </span>
                {INSTALL_COMMAND}
              </code>
              <CopyButton value={INSTALL_COMMAND} label="Copy" />
            </div>
          </motion.div>

          {/* Feature points */}
          <motion.ul
            {...fadeUp(0.25)}
            className="grid gap-4 border-t pt-6 sm:grid-cols-3"
          >
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="flex size-6 shrink-0 items-center justify-center rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400"
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <h2 className="text-sm font-medium">{title}</h2>
                </div>
                <p className="text-xs text-muted-foreground">{text}</p>
              </li>
            ))}
          </motion.ul>

          <motion.p
            {...fadeUp(0.3)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Lock className="size-3.5" aria-hidden="true" />
            You decide whether prompts and outputs are captured.
          </motion.p>
        </div>

        {/* Interactive stack */}
        <motion.div {...fadeUp(0.2)} className="min-w-0">
          <HeroStack />
        </motion.div>
      </div>
    </section>
  );
}