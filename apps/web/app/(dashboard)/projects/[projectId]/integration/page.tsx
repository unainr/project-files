import { IntegrationGuide } from "@/modules/integration/components/guide";
import { PageHeader } from "@/modules/dashboard/components/page-header";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
export default async function IntegrationPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");
  return (
    <div className="space-y-6">
      <PageHeader
        title="Integration"
        description="Follow these steps to instrument your AI calls with the TraceLayer SDK."
      />
      <Separator />
      <IntegrationGuide />
    </div>
  );
}
