"use client";

import { useState } from "react";
import { useTraces, type TraceFilters } from "@/hooks/use-traces";
import { TraceFilterBar } from "./trace-filter-bar";
import { TracesTable } from "./traces-table";
import { EmptyState } from "@/modules/dashboard/components/empty-state";
import { PageHeader } from "@/modules/dashboard/components/page-header";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function TracesPanel({ projectId }: { projectId: string }) {
  const [filters, setFilters] = useState<TraceFilters>({});
  const { data: traces, isLoading, isError } = useTraces(projectId, filters);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Traces"
        description="All captured AI trace events for this project. Auto-refreshes every 5 seconds."
      />
      <Separator />
      <TraceFilterBar value={filters} onChange={setFilters} />
      {isLoading && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      )}
      {isError && <EmptyState title="Could not load traces" />}
      {traces && <TracesTable projectId={projectId} traces={traces} />}
    </div>
  );
}
