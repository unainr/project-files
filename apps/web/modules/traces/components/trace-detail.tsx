"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { AlertTriangle, ArrowLeft, Calendar, Cpu, Gauge, Hash, Timer, type LucideIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useTrace } from "@/hooks/use-traces";
import { formatDuration, formatTokens } from "@/lib/format";
import { CopyButton } from "@/modules/dashboard/components/copy-button";
import { EmptyState } from "@/modules/dashboard/components/empty-state";
import { StatusBadge } from "@/modules/dashboard/components/status-badge";
import { TraceContentBlock } from "./trace-content";

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

function timeAgo(iso: string) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

type StatProps = {
  label: string;
  icon: LucideIcon;
  hint?: string;
  children: React.ReactNode;
};

function Stat({ label, icon: Icon, hint, children }: StatProps) {
  return (
    <div className="space-y-1.5 rounded-xl border bg-card p-3.5 transition-shadow hover:shadow-sm">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className="truncate text-lg font-semibold tabular-nums">{children}</p>
      {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-28" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
    </div>
  );
}

type Props = { projectId: string; traceId: string };

export function TraceDetail({ projectId, traceId }: Props) {
  const { data, isLoading, isError } = useTrace(traceId);

  if (isLoading) return <DetailSkeleton />;
  if (isError || !data || data.trace.projectId !== projectId) return <EmptyState title="Trace not found" />;

  const { trace, spans } = data;
  const span = spans[0];

  const startedAt = new Date(trace.startedAt);
  const endedAt = new Date(startedAt.getTime() + trace.duration);

  // Derived from reported usage. Approximate, because duration includes network latency.
  const tokensPerSecond =
    span?.outputTokens != null && trace.duration > 0 ? span.outputTokens / (trace.duration / 1000) : null;

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="space-y-3">
        <Link
          href={`/projects/${projectId}/traces`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to traces
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="truncate text-2xl font-bold tracking-tight">{trace.name}</h1>
              <StatusBadge status={trace.status} />
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={trace.startedAt}>{startedAt.toLocaleString()}</time>
                <span className="text-muted-foreground/60">· {timeAgo(trace.startedAt)}</span>
              </span>
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{trace.id}</code>
            </div>
          </div>
          <CopyButton value={trace.id} label="Copy trace ID" />
        </div>
      </motion.div>

      {/* Error banner */}
      {span?.error && (
        <motion.div
          variants={item}
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">This call failed</p>
            <p className="wrap-break-word font-mono text-sm">{span.error}</p>
          </div>
          <CopyButton value={span.error} />
        </motion.div>
      )}

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Duration" icon={Timer} hint={`Ended ${endedAt.toLocaleTimeString()}`}>
          {formatDuration(trace.duration)}
        </Stat>
        <Stat label="Model" icon={Cpu} hint={span?.type ? `Type: ${span.type}` : undefined}>
          <span title={span?.model ?? undefined}>{span?.model ?? "—"}</span>
        </Stat>
        <Stat label="Input tokens" icon={Hash} hint={span?.inputTokens == null ? "Not reported" : undefined}>
          {formatTokens(span?.inputTokens)}
        </Stat>
        <Stat label="Output tokens" icon={Hash} hint={span?.outputTokens == null ? "Not reported" : undefined}>
          {formatTokens(span?.outputTokens)}
        </Stat>
        <Stat label="Speed" icon={Gauge} hint={tokensPerSecond != null ? "Approximate, includes latency" : "Needs output tokens"}>
          {tokensPerSecond != null ? `${tokensPerSecond.toFixed(1)} tok/s` : "—"}
        </Stat>
      </motion.div>

      {/* Input / Output side by side */}
      <motion.div variants={item} className="grid gap-4 lg:grid-cols-2">
        <TraceContentBlock
          title="Input"
          content={span?.input}
          emptyHint="Input isn't captured when captureContent is off or span.setInput() wasn't called."
        />
        <TraceContentBlock
          title="Output"
          content={span?.output}
          emptyText={trace.status === "error" ? "No output (the call failed)" : "Not captured"}
          emptyHint={
            trace.status === "error"
              ? undefined
              : "Output isn't captured when captureContent is off or span.setOutput() wasn't called."
          }
        />
      </motion.div>

      {/* Metadata */}
      {span?.metadata && Object.keys(span.metadata).length > 0 && (
        <motion.div variants={item}>
          <TraceContentBlock title="Metadata" content={JSON.stringify(span.metadata, null, 2)} />
        </motion.div>
      )}
    </motion.div>
  );
}