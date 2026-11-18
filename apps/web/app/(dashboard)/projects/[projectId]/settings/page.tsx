import { PageHeader } from "@/modules/dashboard/components/page-header";


type Props = { params: Promise<{ projectId: string }> };

export default async function SettingsPage({ params }: Props) {
  const { projectId } = await params;

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Basic project settings." />
      <div className="rounded-lg border p-4 text-sm">
        <p className="text-muted-foreground">Project ID</p>
        <code>{projectId}</code>
      </div>
    </div>
  );
}