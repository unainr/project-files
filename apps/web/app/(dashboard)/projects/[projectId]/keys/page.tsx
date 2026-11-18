import { ApiKeysPanel } from "@/modules/api-keys/components/api-key-panel";


type Props = { params: Promise<{ projectId: string }> };

export default async function ApiKeysPage({ params }: Props) {
  const { projectId } = await params;
  return <ApiKeysPanel projectId={projectId} />;
}