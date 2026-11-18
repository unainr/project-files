"use client";

import { useProjects } from "@/hooks/use-projects";

export function ProjectHeader({ projectId }: { projectId: string }) {
  const { data: projects } = useProjects();
  const project = projects?.find((p) => p.id === projectId);

  return <h1 className="text-2xl font-semibold">{project?.name ?? "Project"}</h1>;
}