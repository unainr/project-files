import { PageHeader } from "@/modules/dashboard/components/page-header";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = { params: Promise<{ projectId: string }> };

export default async function SettingsPage({ params }: Props) {
  const { projectId } = await params;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your project configuration and details."
      />
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Project Information</CardTitle>
          <CardDescription className="text-xs">
            Basic details about this project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Project ID
            </p>
            <code className="block rounded-lg border bg-muted/50 px-3 py-2 text-sm font-mono">
              {projectId}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
