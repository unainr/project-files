export const qk = {
  projects: ["projects"] as const,
  project: (id: string) => ["projects", id] as const,
  apiKeys: (projectId: string) => ["api-keys", projectId] as const,
  traces: (projectId: string, filters: object) => ["traces", projectId, filters] as const,
  trace: (id: string) => ["trace", id] as const,
  stats: (projectId: string) => ["trace-stats", projectId] as const,
};