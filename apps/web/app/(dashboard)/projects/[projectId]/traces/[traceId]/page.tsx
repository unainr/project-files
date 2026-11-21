import { TraceDetail } from "@/modules/traces/components/trace-detail";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
type Props = { params: Promise<{ projectId: string; traceId: string }> };

export default async function TraceDetailPage({ params }: Props) {
  	const { userId } = await auth();
	if (!userId) redirect("/sign-in");
  const { projectId, traceId } = await params;
  return <TraceDetail projectId={projectId} traceId={traceId} />;
}