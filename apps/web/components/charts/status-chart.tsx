"use client";

import { Pie, PieChart } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ChartCard } from "./chart-card";

const config = {
  success: { label: "Successful", color: "var(--chart-2)" },
  error: { label: "Failed", color: "var(--destructive)" },
} satisfies ChartConfig;

type Props = { successful: number; failed: number };

function LegendItem({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
      <span className="font-medium tabular-nums text-foreground">{value.toLocaleString()}</span>
    </span>
  );
}

export function StatusChart({ successful, failed }: Props) {
  const total = successful + failed;
  const rate = total ? Math.round((successful / total) * 100) : 0;

  // Grey ring when there is no data yet
  const data = total
    ? [
        { status: "success", value: successful, fill: "var(--color-success)" },
        { status: "error", value: failed, fill: "var(--color-error)" },
      ]
    : [{ status: "none", value: 1, fill: "var(--muted)" }];

  return (
    <ChartCard title="Success rate" description="All traces in this project">
      <div className="relative">
        <ChartContainer config={config} className="mx-auto h-55 w-full">
          <PieChart>
            {total > 0 && <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="status" />} />}
            <Pie
              data={data}
              dataKey="value"
              nameKey="status"
              innerRadius={62}
              outerRadius={88}
              strokeWidth={3}
              paddingAngle={total ? 2 : 0}
            />
          </PieChart>
        </ChartContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tabular-nums">{total ? `${rate}%` : "—"}</span>
          <span className="text-xs text-muted-foreground">{total.toLocaleString()} traces</span>
        </div>
      </div>

      <div className="mt-2 flex justify-center gap-4">
        <LegendItem color="var(--chart-2)" label="Successful" value={successful} />
        <LegendItem color="var(--destructive)" label="Failed" value={failed} />
      </div>
    </ChartCard>
  );
}