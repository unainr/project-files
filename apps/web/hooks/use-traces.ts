"use client";

import { useQuery } from "@tanstack/react-query";

import { qk } from "@/lib/query-keys";
import { client } from "@/lib/hono";

export interface TraceFilters {
  status?: "success" | "error";
  q?: string;
}

export function useTraces(projectId: string, filters: TraceFilters = {}) {

  return useQuery({
    queryKey: qk.traces(projectId, filters),
    queryFn: async () => {
      const res = await client.api.traces.$get({ query: { projectId, ...filters } });
      if (!res.ok) throw new Error("Failed to load traces");
      return res.json();
    },
    refetchInterval: 5000, // new traces appear without a manual refresh
  });
}

export function useTrace(traceId: string) {

  return useQuery({
    queryKey: qk.trace(traceId),
    queryFn: async () => {
      const res = await client.api.traces[":id"].$get({ param: { id: traceId } });
      if (!res.ok) throw new Error("Trace not found");
      return res.json();
    },
  });
}

export function useTraceStats(projectId: string) {

  return useQuery({
    queryKey: qk.stats(projectId),
    queryFn: async () => {
      const res = await client.api.traces.stats.$get({ query: { projectId } });
      if (!res.ok) throw new Error("Failed to load stats");
      return res.json();
    },
    refetchInterval: 10_000,
  });
}