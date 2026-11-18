"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

import { qk } from "@/lib/query-keys";

export function useApiKeys(projectId: string) {

  return useQuery({
    queryKey: qk.apiKeys(projectId),
    queryFn: async () => {
      const res = await client.api["api-keys"].$get({ query: { projectId } });
      if (!res.ok) throw new Error("Failed to load API keys");
      return res.json();
    },
  });
}

export function useCreateApiKey(projectId: string) {

  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await client.api["api-keys"].$post({ json: { projectId, name } });
      if (!res.ok) throw new Error("Failed to create key");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.apiKeys(projectId) }),
  });
}

export function useRevokeApiKey(projectId: string) {

  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await client.api["api-keys"][":id"].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to revoke key");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.apiKeys(projectId) }),
  });
}