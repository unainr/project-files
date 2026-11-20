"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowDown, ArrowUp, ChevronRight, ChevronsUpDown } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { useTraces } from "@/hooks/use-traces";
import { formatDuration, formatTokens } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/modules/dashboard/components/empty-state";
import { StatusBadge } from "@/modules/dashboard/components/status-badge";

type TraceRow = NonNullable<ReturnType<typeof useTraces>["data"]>[number];
type Props = { projectId: string; traces: TraceRow[] };

type SortKey = "time" | "duration" | "tokens";
type Sort = { key: SortKey; dir: "asc" | "desc" };

// Duration colors. Adjust to what "slow" means for your app.
const MEDIUM_MS = 1000;
const SLOW_MS = 3000;

const sortValue: Record<SortKey, (t: TraceRow) => number> = {
  time: (t) => new Date(t.startedAt).getTime(),
  duration: (t) => t.duration,
  tokens: (t) => (t.inputTokens ?? 0) + (t.outputTokens ?? 0),
};

const headClass = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

/** "meta-llama/llama-4-scout-17b" -> "llama-4-scout-17b" */
const shortModel = (model: string) => model.split("/").pop() ?? model;

function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function timeAgo(iso: string, now: number) {
  const seconds = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Ids that appeared after the first render, so new traces can slide in. */
function useFreshIds(ids: string[]) {
  const seen = useRef<Set<string>>(new Set());
  const signature = ids.join(",");

  const fresh = new Set<string>();
  if (seen.current.size > 0) {
    for (const id of ids) if (!seen.current.has(id)) fresh.add(id);
  }

  useEffect(() => {
    seen.current = new Set(signature ? signature.split(",") : []);
  }, [signature]);

  return fresh;
}

function SortHead({
  label,
  sortKey,
  sort,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  sort: Sort;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = sort.key === sortKey;
  const Icon = !active ? ChevronsUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;

  return (
    <TableHead
      className={cn(headClass, className)}
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-foreground",
          active && "text-foreground",
        )}
      >
        {label}
        <Icon className={cn("h-3 w-3", !active && "opacity-40")} />
      </button>
    </TableHead>
  );
}

function DurationCell({ ms, max }: { ms: number; max: number }) {
  const tone = ms >= SLOW_MS ? "bg-rose-500" : ms >= MEDIUM_MS ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="flex min-w-24 flex-col gap-1">
      <span className="text-sm font-medium tabular-nums">{formatDuration(ms)}</span>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", tone)} style={{ width: `${Math.max(4, (ms / max) * 100)}%` }} />
      </div>
    </div>
  );
}

export function TracesTable({ projectId, traces }: Props) {
  const router = useRouter();
  const now = useNow();
  const [sort, setSort] = useState<Sort>({ key: "time", dir: "desc" });
  const freshIds = useFreshIds(traces.map((t) => t.id));

  const rows = useMemo(() => {
    const factor = sort.dir === "asc" ? 1 : -1;
    const value = sortValue[sort.key];
    return [...traces].sort((a, b) => (value(a) - value(b)) * factor);
  }, [traces, sort]);

  const maxDuration = useMemo(() => Math.max(1, ...traces.map((t) => t.duration)), [traces]);

  function toggleSort(key: SortKey) {
    setSort((current) =>
      current.key === key ? { key, dir: current.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" },
    );
  }

  if (traces.length === 0) {
    return (
      <EmptyState title="No traces yet" description="Instrument a call with the SDK. See the Integration tab." />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className={headClass}>Status</TableHead>
            <TableHead className={headClass}>Name</TableHead>
            <TableHead className={cn(headClass, "hidden md:table-cell")}>Model</TableHead>
            <SortHead label="Tokens" sortKey="tokens" sort={sort} onSort={toggleSort} className="hidden sm:table-cell" />
            <SortHead label="Duration" sortKey="duration" sort={sort} onSort={toggleSort} />
            <SortHead label="Time" sortKey="time" sort={sort} onSort={toggleSort} />
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((trace, i) => {
            const href = `/projects/${projectId}/traces/${trace.id}`;
            const failed = trace.status === "error";
            const fresh = freshIds.has(trace.id);

            return (
              <motion.tr
                key={trace.id}
                initial={fresh ? { opacity: 0, y: -8 } : { opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.2, delay: fresh ? 0 : Math.min(i, 10) * 0.03 }}
                onClick={() => router.push(href)}
                className={cn(
                  "group cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/40",
                  failed && "bg-rose-500/4 hover:bg-rose-500/8",
                )}
              >
                <TableCell className="relative pl-4">
                  {failed && <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-rose-500" />}
                  <StatusBadge status={trace.status} />
                </TableCell>

                <TableCell className="max-w-55">
                  <Link
                    href={href}
                    onClick={(e) => e.stopPropagation()}
                    className="block truncate font-medium transition-colors hover:text-primary hover:underline underline-offset-2"
                    title={trace.name}
                  >
                    {trace.name}
                  </Link>
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  {trace.model ? (
                    <span
                      title={trace.model}
                      className="inline-block max-w-45 truncate rounded-md bg-muted px-1.5 py-0.5 align-middle font-mono text-xs text-muted-foreground"
                    >
                      {shortModel(trace.model)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell className="hidden text-sm tabular-nums sm:table-cell">
                  <span className="text-muted-foreground">{formatTokens(trace.inputTokens)}</span>
                  <span className="mx-1 text-muted-foreground/40">/</span>
                  <span className="text-muted-foreground">{formatTokens(trace.outputTokens)}</span>
                </TableCell>

                <TableCell>
                  <DurationCell ms={trace.duration} max={maxDuration} />
                </TableCell>

                <TableCell className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                  <time dateTime={trace.startedAt} title={new Date(trace.startedAt).toLocaleString()}>
                    {timeAgo(trace.startedAt, now)}
                  </time>
                </TableCell>

                <TableCell className="w-8 pr-3 text-right">
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}