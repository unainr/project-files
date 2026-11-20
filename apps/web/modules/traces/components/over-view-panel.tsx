"use client";

import { useMemo } from "react";
import { MotionConfig, motion, type Variants } from "motion/react";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useTraceStats, useTraces } from "@/hooks/use-traces";
import {
  buildModelUsage,
  buildTimeSeries,
  hasTokenUsage,
  latencyPercentiles,
} from "@/lib/trace-analytics";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/modules/dashboard/components/empty-state";
import { PageHeader } from "@/modules/dashboard/components/page-header";

import { StatsGrid } from "./stats-grid";
import { TracesTable } from "./traces-table";
import { ChartCardSkeleton } from "@/components/charts/chart-card";
import { TraceVolumeChart } from "@/components/charts/trace-volume-chart";
import { StatusChart } from "@/components/charts/status-chart";
import { LatencyChart } from "@/components/charts/latency-chart";
import { ModelUsageChart } from "@/components/charts/model-usage-chart";
import { TokenUsageChart } from "@/components/charts/token-usage-chart";

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

function LiveIndicator({ fetching }: { fetching: boolean }) {
  return (
    <span className="inline-flex w-fit max-w-full shrink-0 items-center gap-2 whitespace-nowrap rounded-full border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 motion-reduce:animate-none",
            fetching && "animate-ping"
          )}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      Live · refreshes every 5s
    </span>
  );
}

function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="min-w-0 lg:col-span-2"><ChartCardSkeleton /></div>
      <div className="min-w-0"><ChartCardSkeleton /></div>
      <div className="min-w-0 lg:col-span-2"><ChartCardSkeleton /></div>
      <div className="min-w-0"><ChartCardSkeleton /></div>
      <div className="min-w-0 lg:col-span-3"><ChartCardSkeleton /></div>
    </div>
  );
}

export function OverviewPanel({ projectId }: { projectId: string }) {
  const stats = useTraceStats(projectId);
  const traces = useTraces(projectId);
  const rows = traces.data;

  // Hooks must run before the early return below
  const series = useMemo(() => (rows ? buildTimeSeries(rows) : []), [rows]);
  const percentiles = useMemo(() => (rows ? latencyPercentiles(rows) : null), [rows]);
  const models = useMemo(() => (rows ? buildModelUsage(rows) : []), [rows]);
  const tokensAvailable = useMemo(() => (rows ? hasTokenUsage(rows) : false), [rows]);

  if (stats.isError || traces.isError) return <EmptyState title="Could not load project data" />;

  // Accurate project totals from the stats endpoint; fall back to the loaded rows
  const successful = stats.data?.successful ?? rows?.filter((t) => t.status === "success").length ?? 0;
  const failed = stats.data?.failed ?? rows?.filter((t) => t.status === "error").length ?? 0;

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="min-w-0 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1">
            <PageHeader title="Overview" description="Real-time summary of your AI traces and performance metrics." />
          </div>
          <LiveIndicator fetching={traces.isFetching} />
        </div>
        <Separator />

        {stats.data ? (
          <StatsGrid stats={stats.data} />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                className={cn("h-28 rounded-xl", i === 4 && "col-span-2 md:col-span-1")}
              />
            ))}
          </div>
        )}

        {/* Charts */}
        <section className="min-w-0 space-y-3">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <h2 className="text-base font-semibold">Analytics</h2>
            <span className="text-xs text-muted-foreground">Charts use your latest 100 traces</span>
          </div>

          {!rows ? (
            <ChartsSkeleton />
          ) : rows.length === 0 ? (
            <EmptyState title="No traces yet" description="Send your first trace with the SDK. See the Integration tab." />
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-4 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={item} className="min-w-0 lg:col-span-2">
                <TraceVolumeChart data={series} />
              </motion.div>
              <motion.div variants={item} className="min-w-0">
                <StatusChart successful={successful} failed={failed} />
              </motion.div>
              <motion.div variants={item} className="min-w-0 lg:col-span-2">
                <LatencyChart data={series} percentiles={percentiles} />
              </motion.div>
              <motion.div variants={item} className="min-w-0">
                <ModelUsageChart data={models} />
              </motion.div>
              <motion.div variants={item} className="min-w-0 lg:col-span-3">
                <TokenUsageChart data={series} hasData={tokensAvailable} />
              </motion.div>
            </motion.div>
          )}
        </section>

        {/* Recent traces */}
        <section className="min-w-0 space-y-3">
          <h2 className="text-base font-semibold">Recent traces</h2>
          {rows ? (
            <div className="min-w-0 max-w-full overflow-x-auto">
              <TracesTable projectId={projectId} traces={rows.slice(0, 10)} />
            </div>
          ) : (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          )}
        </section>
      </motion.div>
    </MotionConfig>
  );
}