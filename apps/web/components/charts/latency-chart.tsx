"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatDuration } from "@/lib/format";
import type { TimePoint } from "@/lib/trace-analytics";
import { ChartCard } from "./chart-card";

const config = {
  avgLatency: { label: "Avg latency", color: "var(--chart-1)" },
} satisfies ChartConfig;

type Props = { data: TimePoint[]; percentiles: { p50: number; p95: number } | null };

export function LatencyChart({ data, percentiles }: Props) {
  return (
    <ChartCard
      title="Latency"
      description="Average response time per interval"
      action={
        percentiles && (
          <div className="flex gap-1.5">
            <Badge variant="secondary">p50 {formatDuration(percentiles.p50)}</Badge>
            <Badge variant="secondary">p95 {formatDuration(percentiles.p95)}</Badge>
          </div>
        )
      }
    >
      <ChartContainer config={config} className="h-[220px] w-full">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="fillLatency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-avgLatency)" stopOpacity={0.45} />
              <stop offset="95%" stopColor="var(--color-avgLatency)" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
          <YAxis tickLine={false} axisLine={false} width={52} tickFormatter={(v) => formatDuration(Number(v))} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value) => (
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="text-muted-foreground">Avg latency</span>
                    <span className="font-mono font-medium">{formatDuration(Number(value))}</span>
                  </div>
                )}
              />
            }
          />
          <Area
            dataKey="avgLatency"
            type="monotone"
            stroke="var(--color-avgLatency)"
            fill="url(#fillLatency)"
            strokeWidth={2}
            connectNulls
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}