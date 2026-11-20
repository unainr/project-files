"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { ModelUsage } from "@/lib/trace-analytics";
import { ChartCard, ChartEmpty } from "./chart-card";

const config = {
  count: { label: "Traces", color: "var(--chart-1)" },
} satisfies ChartConfig;

// "meta-llama/llama-4-scout-17b" -> "llama-4-scout-17b", then truncated
const shortName = (model: string) => {
  const name = model.split("/").pop() ?? model;
  return name.length > 18 ? `${name.slice(0, 17)}…` : name;
};

export function ModelUsageChart({ data }: { data: ModelUsage[] }) {
  return (
    <ChartCard title="Models" description="Most used models">
      {data.length === 0 ? (
        <ChartEmpty message="No model data yet" />
      ) : (
        <ChartContainer config={config} className="h-[220px] w-full">
          <BarChart data={data} layout="vertical" margin={{ right: 12 }}>
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="model" type="category" tickLine={false} axisLine={false} width={124} tickFormatter={(v) => shortName(String(v))} />
            <XAxis type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      )}
    </ChartCard>
  );
}