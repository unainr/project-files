"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { TimePoint } from "@/lib/trace-analytics";
import { ChartCard } from "./chart-card";

const config = {
  success: { label: "Successful", color: "var(--chart-2)" },
  error: { label: "Failed", color: "var(--destructive)" },
} satisfies ChartConfig;

export function TraceVolumeChart({ data }: { data: TimePoint[] }) {
  return (
    <ChartCard title="Trace volume" description="Successful vs failed traces over time">
      <ChartContainer config={config} className="h-[260px] w-full">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={32} />
          <ChartTooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="success" stackId="a" fill="var(--color-success)" radius={[0, 0, 4, 4]} />
          <Bar dataKey="error" stackId="a" fill="var(--color-error)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}