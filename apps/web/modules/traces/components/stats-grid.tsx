"use client";

import { useEffect } from "react";
import { Activity, CheckCircle2, Timer, XCircle, Zap, type LucideIcon } from "lucide-react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";

import { Card, CardContent } from "@/components/ui/card";
import type { useTraceStats } from "@/hooks/use-traces";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

type Stats = NonNullable<ReturnType<typeof useTraceStats>["data"]>;

const TONES = {
  violet: { text: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10", glow: "bg-violet-500/25", bar: "bg-violet-500" },
  emerald: { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", glow: "bg-emerald-500/25", bar: "bg-emerald-500" },
  rose: { text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10", glow: "bg-rose-500/25", bar: "bg-rose-500" },
  amber: { text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", glow: "bg-amber-500/25", bar: "bg-amber-500" },
  sky: { text: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10", glow: "bg-sky-500/25", bar: "bg-sky-500" },
} as const;

type Tone = keyof typeof TONES;

// Module-level so the formatters stay stable between renders
const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const formatInt = (n: number) => Math.round(n).toLocaleString();
const formatMs = (n: number) => formatDuration(Math.round(n));
const formatCompact = (n: number) => compact.format(Math.round(n));
const percent = (value: number) => `${Number(value.toFixed(1))}%`;

/** Counts up to the value, and animates from the current number when data refreshes. */
function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(reduceMotion ? value : 0);
  const text = useTransform(motionValue, format);

  useEffect(() => {
    if (reduceMotion) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration: 0.8, ease: "easeOut" });
    return () => controls.stop();
  }, [value, reduceMotion, motionValue]);

  return <motion.span>{text}</motion.span>;
}

function ProgressBar({ value, tone, label }: { value: number; tone: Tone; label: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
    >
      <motion.div
        className={cn("h-full rounded-full", TONES[tone].bar)}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

function SplitBar({ inputShare }: { inputShare: number }) {
  return (
    <div
      role="img"
      aria-label={`${Math.round(inputShare)}% input tokens, ${Math.round(100 - inputShare)}% output tokens`}
      className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted"
    >
      <motion.div
        className="h-full bg-sky-500"
        initial={{ width: 0 }}
        animate={{ width: `${inputShare}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <div className="h-full flex-1 bg-violet-500/70" />
    </div>
  );
}

type StatCardProps = {
  label: string;
  icon: LucideIcon;
  tone: Tone;
  index: number;
  footer: React.ReactNode;
  highlight?: boolean;
  className?: string;
  children: React.ReactNode;
};

function StatCard({ label, icon: Icon, tone, index, footer, highlight, className, children }: StatCardProps) {
  const t = TONES[tone];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "group relative h-full overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
          highlight && "border-rose-500/30",
        )}
      >
        {/* Soft glow that appears on hover */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
            t.glow,
          )}
        />
        <CardContent className="relative flex h-full flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110",
                t.bg,
              )}
            >
              <Icon className={cn("h-4 w-4", t.text)} />
            </div>
          </div>

          <p className="text-2xl font-bold tabular-nums tracking-tight">{children}</p>

          <div className="mt-auto text-xs text-muted-foreground">{footer}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatsGrid({ stats }: { stats: Stats }) {
  const hasTraces = stats.total > 0;
  const successRate = hasTraces ? (stats.successful / stats.total) * 100 : 0;
  const errorRate = hasTraces ? (stats.failed / stats.total) * 100 : 0;

  const totalTokens = stats.inputTokens + stats.outputTokens;
  const inputShare = totalTokens ? (stats.inputTokens / totalTokens) * 100 : 0;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <StatCard index={0} label="Total traces" icon={Activity} tone="violet" footer="All traces in this project">
        <AnimatedNumber value={stats.total} format={formatInt} />
      </StatCard>

      <StatCard
        index={1}
        label="Successful"
        icon={CheckCircle2}
        tone="emerald"
        footer={
          hasTraces ? (
            <div className="space-y-1.5">
              <ProgressBar value={successRate} tone="emerald" label="Success rate" />
              <span>{percent(successRate)} success rate</span>
            </div>
          ) : (
            "No traces yet"
          )
        }
      >
        <AnimatedNumber value={stats.successful} format={formatInt} />
      </StatCard>

      <StatCard
        index={2}
        label="Failed"
        icon={XCircle}
        tone="rose"
        highlight={stats.failed > 0}
        footer={
          stats.failed > 0 ? (
            <div className="space-y-1.5">
              <ProgressBar value={errorRate} tone="rose" label="Error rate" />
              <span>{percent(errorRate)} error rate</span>
            </div>
          ) : hasTraces ? (
            "No failures"
          ) : (
            "No traces yet"
          )
        }
      >
        <AnimatedNumber value={stats.failed} format={formatInt} />
      </StatCard>

      <StatCard
        index={3}
        label="Avg latency"
        icon={Timer}
        tone="amber"
        footer={hasTraces ? "Mean response time per trace" : "No traces yet"}
      >
        {hasTraces ? <AnimatedNumber value={stats.avgDuration} format={formatMs} /> : "—"}
      </StatCard>

      <StatCard
        index={4}
        label="Tokens"
        icon={Zap}
        tone="sky"
        className="col-span-2 lg:col-span-1"
        footer={
          totalTokens > 0 ? (
            <div className="space-y-1.5">
              <SplitBar inputShare={inputShare} />
              <div className="flex justify-between gap-2">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  in {formatCompact(stats.inputTokens)}
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500/70" />
                  out {formatCompact(stats.outputTokens)}
                </span>
              </div>
            </div>
          ) : (
            "No usage reported yet"
          )
        }
      >
        {totalTokens > 0 ? <AnimatedNumber value={totalTokens} format={formatCompact} /> : "—"}
      </StatCard>
    </div>
  );
}