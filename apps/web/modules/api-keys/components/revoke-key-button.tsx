"use client";

import { Button } from "@/components/ui/button";
import { useRevokeApiKey } from "@/hooks/use-api-keys";

type Props = { projectId: string; keyId: string };

export function RevokeKeyButton({ projectId, keyId }: Props) {
  const revoke = useRevokeApiKey(projectId);

  function handleClick() {
    if (confirm("Revoke this key? Apps using it will stop sending traces.")) revoke.mutate(keyId);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={revoke.isPending}>
      {revoke.isPending ? "Revoking…" : "Revoke"}
    </Button>
  );
}