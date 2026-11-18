"use client";

import Link from "next/link";

import { useTrace } from "@/hooks/use-traces";
import { formatDuration, formatTokens } from "@/lib/format";
import { StatusBadge } from "@/modules/dashboard/components/status-badge";
import { EmptyState } from "@/modules/dashboard/components/empty-state";
import { TraceContentBlock } from "./trace-content";


function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{children}</p>
    </div>
  );
}

type Props = { projectId: string; traceId: string };

export function TraceDetail({ projectId, traceId }: Props) {
  const { data, isLoading, isError } = useTrace(traceId);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading trace…</p>;
  // URL project must match the trace's real project
  if (isError || !data || data.trace.projectId !== projectId) return <EmptyState title="Trace not found" />;

  const { trace, spans } = data;
  const span = spans[0];

  return (
    <div className="space-y-4">
      <Link href={`/projects/${projectId}/traces`} className="text-sm text-muted-foreground hover:underline">
        ← Back to traces
      </Link>

      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">{trace.name}</h2>
        <StatusBadge status={trace.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Field label="Duration">{formatDuration(trace.duration)}</Field>
        <Field label="Model">{span?.model ?? "—"}</Field>
        <Field label="Input tokens">{formatTokens(span?.inputTokens)}</Field>
        <Field label="Output tokens">{formatTokens(span?.outputTokens)}</Field>
        <Field label="Started">{new Date(trace.startedAt).toLocaleString()}</Field>
      </div>

      {span?.error && <TraceContentBlock title="Error" content={span.error} />}
      <TraceContentBlock title="Input" content={span?.input} />
      <TraceContentBlock title="Output" content={span?.output} />
      {span?.metadata && <TraceContentBlock title="Metadata" content={JSON.stringify(span.metadata, null, 2)} />}
    </div>
  );
}