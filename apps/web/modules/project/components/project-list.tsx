"use client";


import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "./project-card";
import { EmptyState } from "@/modules/dashboard/components/empty-state";

export function ProjectsList() {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading projects…</p>;
  if (isError) return <EmptyState title="Could not load projects" description="Please refresh and try again." />;
  if (!projects?.length) return <EmptyState title="No projects yet" description="Create one above to get your first API key." />;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} id={project.id} name={project.name} createdAt={project.createdAt} />
      ))}
    </div>
  );
}