"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateProject } from "@/hooks/use-projects";
import { ApiKeyReveal } from "@/modules/api-keys/components/api-key-reveal";

export function CreateProjectForm() {
  const create = useCreateProject();
  const [name, setName] = useState("");
  const [created, setCreated] = useState<{ projectId: string; apiKey: string }>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await create.mutateAsync(name.trim());
    setCreated({ projectId: result.project.id, apiKey: result.apiKey });
    setName("");
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="New project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          required
        />
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? "Creating…" : "Create project"}
        </Button>
      </form>
      {create.isError && <p className="text-sm text-destructive">Could not create project.</p>}
      {created && (
        <ApiKeyReveal
          apiKey={created.apiKey}
          projectHref={`/projects/${created.projectId}/integration`}
          onDismiss={() => setCreated(undefined)}
        />
      )}
    </div>
  );
}