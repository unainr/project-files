"use client";

import { useApiKeys } from "@/hooks/use-api-keys";
import { PageHeader } from "@/modules/dashboard/components/page-header";
import { CreateApiKeyForm } from "./create-key-form";
import { ApiKeysTable } from "./api-key-table";
import { EmptyState } from "@/modules/dashboard/components/empty-state";


export function ApiKeysPanel({ projectId }: { projectId: string }) {
  const { data: keys, isLoading, isError } = useApiKeys(projectId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="API keys"
        description="To rotate a key: create a new one, deploy it, then revoke the old one."
      />
      <CreateApiKeyForm projectId={projectId} />
      {isLoading && <p className="text-sm text-muted-foreground">Loading keys…</p>}
      {isError && <EmptyState title="Could not load API keys" />}
      {keys && <ApiKeysTable projectId={projectId} keys={keys} />}
    </div>
  );
}