import { TraceDetail } from "@/modules/traces/components/trace-detail";

type Props = { params: Promise<{ projectId: string; traceId: string }> };

export default async function TraceDetailPage({ params }: Props) {
  const { projectId, traceId } = await params;
  return <TraceDetail projectId={projectId} traceId={traceId} />;
}