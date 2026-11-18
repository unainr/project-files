"use client";

import { useState } from "react";

import { useTraces, type TraceFilters } from "@/hooks/use-traces";
import { TraceFilterBar } from "./trace-filter-bar";
import { TracesTable } from "./traces-table";
import { EmptyState } from "@/modules/dashboard/components/empty-state";

export function TracesPanel({ projectId }: { projectId: string }) {
  const [filters, setFilters] = useState<TraceFilters>({});
  const { data: traces, isLoading, isError } = useTraces(projectId, filters);

  return (
    <div className="space-y-4">
      <TraceFilterBar value={filters} onChange={setFilters} />
      {isLoading && <p className="text-sm text-muted-foreground">Loading traces…</p>}
      {isError && <EmptyState title="Could not load traces" />}
      {traces && <TracesTable projectId={projectId} traces={traces} />}
    </div>
  );
}