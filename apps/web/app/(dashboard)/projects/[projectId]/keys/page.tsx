import { ApiKeysPanel } from "@/modules/api-keys/components/api-key-panel";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
type Props = { params: Promise<{ projectId: string }> };

export default async function ApiKeysPage({ params }: Props) {
  	const { userId } = await auth();
	if (!userId) redirect("/sign-in");
  const { projectId } = await params;
  return <ApiKeysPanel projectId={projectId} />;
}