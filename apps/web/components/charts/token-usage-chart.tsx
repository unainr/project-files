"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { TimePoint } from "@/lib/trace-analytics";
import { ChartCard, ChartEmpty } from "./chart-card";

const config = {
  inputTokens: { label: "Input tokens", color: "var(--chart-3)" },
  outputTokens: { label: "Output tokens", color: "var(--chart-4)" },
} satisfies ChartConfig;

const compact = new Intl.NumberFormat("en", { notation: "compact" });

type Props = { data: TimePoint[]; hasData: boolean };

export function TokenUsageChart({ data, hasData }: Props) {
  return (
    <ChartCard title="Token usage" description="Input and output tokens reported by your provider">
      {!hasData ? (
        <ChartEmpty message="No token usage reported yet. Call span.setUsage() in your app." />
      ) : (
        <ChartContainer config={config} className="h-[220px] w-full">
          <AreaChart data={data}>
            <defs>
              {(["inputTokens", "outputTokens"] as const).map((key) => (
                <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
            <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => compact.format(Number(v))} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area dataKey="inputTokens" type="monotone" stackId="a" stroke="var(--color-inputTokens)" fill="url(#fill-inputTokens)" strokeWidth={2} />
            <Area dataKey="outputTokens" type="monotone" stackId="a" stroke="var(--color-outputTokens)" fill="url(#fill-outputTokens)" strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
      )}
    </ChartCard>
  );
}