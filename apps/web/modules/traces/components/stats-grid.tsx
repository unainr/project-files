import { Card, CardContent } from "@/components/ui/card";
import type { useTraceStats } from "@/hooks/use-traces";
import { formatDuration } from "@/lib/format";

type Stats = NonNullable<ReturnType<typeof useTraceStats>["data"]>;

export function StatsGrid({ stats }: { stats: Stats }) {
  const items = [
    { label: "Total traces", value: stats.total.toLocaleString() },
    { label: "Successful", value: stats.successful.toLocaleString() },
    { label: "Failed", value: stats.failed.toLocaleString() },
    { label: "Avg latency", value: formatDuration(stats.avgDuration) },
    { label: "Tokens (in / out)", value: `${stats.inputTokens.toLocaleString()} / ${stats.outputTokens.toLocaleString()}` },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-xl font-semibold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}