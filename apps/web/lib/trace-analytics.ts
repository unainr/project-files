import type { useTraces } from "@/hooks/use-traces";

export type TraceRow = NonNullable<ReturnType<typeof useTraces>["data"]>[number];

export type TimePoint = {
  label: string;
  success: number;
  error: number;
  avgLatency: number | null; // null = no traces in this interval
  inputTokens: number;
  outputTokens: number;
};

export type ModelUsage = { model: string; count: number };

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const BUCKET_SIZES = [MINUTE, 5 * MINUTE, 15 * MINUTE, HOUR, 6 * HOUR, DAY, 7 * DAY];
const TARGET_BUCKETS = 24;

/** Smallest interval that keeps the chart at roughly 24 points or fewer. */
const pickBucketSize = (range: number) =>
  BUCKET_SIZES.find((size) => range / size <= TARGET_BUCKETS) ?? 7 * DAY;

function formatBucket(start: number, size: number, range: number) {
  const date = new Date(start);
  if (size >= DAY) return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  if (range > DAY) {
    return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function buildTimeSeries(traces: TraceRow[]): TimePoint[] {
  if (traces.length === 0) return [];

  const times = traces.map((t) => new Date(t.startedAt).getTime());
  const min = Math.min(...times);
  const max = Math.max(...times);
  const range = max - min;
  const size = pickBucketSize(range);
  const first = Math.floor(min / size) * size;
  const last = Math.floor(max / size) * size;

  type Bucket = { success: number; error: number; durations: number[]; inputTokens: number; outputTokens: number };
  const buckets = new Map<number, Bucket>();
  // Pre-fill every interval so quiet periods show as gaps instead of being skipped
  for (let start = first; start <= last; start += size) {
    buckets.set(start, { success: 0, error: 0, durations: [], inputTokens: 0, outputTokens: 0 });
  }

  for (const trace of traces) {
    const bucket = buckets.get(Math.floor(new Date(trace.startedAt).getTime() / size) * size);
    if (!bucket) continue;
    bucket[trace.status] += 1;
    bucket.durations.push(trace.duration);
    bucket.inputTokens += trace.inputTokens ?? 0;
    bucket.outputTokens += trace.outputTokens ?? 0;
  }

  return [...buckets.entries()].map(([start, b]) => ({
    label: formatBucket(start, size, range),
    success: b.success,
    error: b.error,
    avgLatency: b.durations.length ? Math.round(b.durations.reduce((sum, d) => sum + d, 0) / b.durations.length) : null,
    inputTokens: b.inputTokens,
    outputTokens: b.outputTokens,
  }));
}

export function latencyPercentiles(traces: TraceRow[]) {
  if (traces.length === 0) return null;
  const sorted = traces.map((t) => t.duration).sort((a, b) => a - b);
  const at = (p: number) => sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)] ?? 0;
  return { p50: at(0.5), p95: at(0.95) };
}

export function buildModelUsage(traces: TraceRow[], limit = 5): ModelUsage[] {
  const counts = new Map<string, number>();
  for (const trace of traces) {
    const model = trace.model ?? "unknown";
    counts.set(model, (counts.get(model) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([model, count]) => ({ model, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Token charts only make sense if at least one trace reported usage. */
export const hasTokenUsage = (traces: TraceRow[]) =>
  traces.some((t) => t.inputTokens != null || t.outputTokens != null);