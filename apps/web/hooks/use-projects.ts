"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { qk } from "@/lib/query-keys";
import { client } from "@/lib/hono";

export function useProjects() {

  return useQuery({
    queryKey: qk.projects,
    queryFn: async () => {
      const res = await client.api.projects.$get();
      if (!res.ok) throw new Error("Failed to load projects");
      return res.json();
    },
  });
}

export function useCreateProject() {

  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await client.api.projects.$post({ json: { name } });
      if (!res.ok) throw new Error("Failed to create project");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.projects }),
  });
}