"use client";


import { useTraceStats, useTraces } from "@/hooks/use-traces";
import { StatsGrid } from "./stats-grid";
import { TracesTable } from "./traces-table";
import { EmptyState } from "@/modules/dashboard/components/empty-state";

export function OverviewPanel({ projectId }: { projectId: string }) {
  const stats = useTraceStats(projectId);
  const traces = useTraces(projectId);

  if (stats.isError || traces.isError) return <EmptyState title="Could not load project data" />;

  return (
    <div className="space-y-6">
      {stats.data ? <StatsGrid stats={stats.data} /> : <p className="text-sm text-muted-foreground">Loading stats…</p>}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent traces</h2>
        {traces.data ? (
          <TracesTable projectId={projectId} traces={traces.data.slice(0, 10)} />
        ) : (
          <p className="text-sm text-muted-foreground">Loading traces…</p>
        )}
      </section>
    </div>
  );
}