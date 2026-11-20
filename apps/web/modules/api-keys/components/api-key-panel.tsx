"use client";

import { useApiKeys } from "@/hooks/use-api-keys";
import { PageHeader } from "@/modules/dashboard/components/page-header";
import { CreateApiKeyForm } from "./create-key-form";
import { ApiKeysTable } from "./api-key-table";
import { EmptyState } from "@/modules/dashboard/components/empty-state";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function ApiKeysPanel({ projectId }: { projectId: string }) {
  const { data: keys, isLoading, isError } = useApiKeys(projectId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Keys"
        description="Manage your project API keys. To rotate: create a new key, deploy it, then revoke the old one."
      />
      <Separator />
      <CreateApiKeyForm projectId={projectId} />
      {isLoading && <Skeleton className="h-24 rounded-xl" />}
      {isError && <EmptyState title="Could not load API keys" />}
      {keys && <ApiKeysTable projectId={projectId} keys={keys} />}
    </div>
  );
}
