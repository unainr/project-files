import { TracesPanel } from "@/modules/traces/components/trace-panel";


type Props = { params: Promise<{ projectId: string }> };

export default async function TracesPage({ params }: Props) {
  const { projectId } = await params;
  return <TracesPanel projectId={projectId} />;
}