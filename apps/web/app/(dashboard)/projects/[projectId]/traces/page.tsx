import { TracesPanel } from "@/modules/traces/components/trace-panel";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
type Props = { params: Promise<{ projectId: string }> };

export default async function TracesPage({ params }: Props) {
  	const { userId } = await auth();
	if (!userId) redirect("/sign-in");
  const { projectId } = await params;
  return <TracesPanel projectId={projectId} />;
}