"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateApiKey } from "@/hooks/use-api-keys";
import { ApiKeyReveal } from "./api-key-reveal";

export function CreateApiKeyForm({ projectId }: { projectId: string }) {
  const create = useCreateApiKey(projectId);
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState<string>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await create.mutateAsync(name.trim());
    setApiKey(result.apiKey);
    setName("");
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Key name (e.g. production)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          required
        />
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? "Creating…" : "Create key"}
        </Button>
      </form>
      {create.isError && <p className="text-sm text-destructive">Could not create key.</p>}
      {apiKey && <ApiKeyReveal apiKey={apiKey} onDismiss={() => setApiKey(undefined)} />}
    </div>
  );
}