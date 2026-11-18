import Link from "next/link";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { useTraces } from "@/hooks/use-traces";
import { formatDuration, formatTokens } from "@/lib/format";
import { EmptyState } from "@/modules/dashboard/components/empty-state";
import { StatusBadge } from "@/modules/dashboard/components/status-badge";

type TraceRow = NonNullable<ReturnType<typeof useTraces>["data"]>[number];
type Props = { projectId: string; traces: TraceRow[] };

export function TracesTable({ projectId, traces }: Props) {
  if (traces.length === 0) {
    return <EmptyState title="No traces yet" description="Instrument a call with the SDK. See the Integration tab." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>Tokens (in / out)</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {traces.map((trace) => (
          <TableRow key={trace.id}>
            <TableCell>
              <StatusBadge status={trace.status} />
            </TableCell>
            <TableCell>
              <Link className="font-medium hover:underline" href={`/projects/${projectId}/traces/${trace.id}`}>
                {trace.name}
              </Link>
            </TableCell>
            <TableCell>{trace.model ?? "—"}</TableCell>
            <TableCell>
              {formatTokens(trace.inputTokens)} / {formatTokens(trace.outputTokens)}
            </TableCell>
            <TableCell>{formatDuration(trace.duration)}</TableCell>
            <TableCell>{new Date(trace.startedAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}