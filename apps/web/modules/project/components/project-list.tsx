"use client";

import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "./project-card";
import { EmptyState } from "@/modules/dashboard/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsList() {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading)
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  if (isError)
    return (
      <EmptyState
        title="Could not load projects"
        description="Please refresh and try again."
      />
    );
  if (!projects?.length)
    return (
      <EmptyState
        title="No projects yet"
        description="Create your first project above to get started."
      />
    );

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          name={project.name}
          createdAt={project.createdAt}
        />
      ))}
    </div>
  );
}
