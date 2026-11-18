import { OverviewPanel } from "@/modules/traces/components/over-view-panel";


type Props = { params: Promise<{ projectId: string }> };

export default async function ProjectOverviewPage({ params }: Props) {
  const { projectId } = await params;
  return <OverviewPanel projectId={projectId} />;
}