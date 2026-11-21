import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CircleAlert, Coins, Layers, ListTree, Radio } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/* ----------------------------- Card shell ----------------------------- */

const TONES = {
  violet: {
    icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    glow: "bg-violet-500/20",
    hover: "hover:border-violet-500/40",
  },
  rose: {
    icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    glow: "bg-rose-500/20",
    hover: "hover:border-rose-500/40",
  },
  sky: {
    icon: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    glow: "bg-sky-500/20",
    hover: "hover:border-sky-500/40",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    glow: "bg-amber-500/20",
    hover: "hover:border-amber-500/40",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    glow: "bg-emerald-500/20",
    hover: "hover:border-emerald-500/40",
  },
} as const;

type CardProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  tone?: keyof typeof TONES;
  children?: ReactNode;
  className?: string;
};

function FeatureCard({ icon: Icon, title, text, tone = "violet", children, className }: CardProps) {
  const t = TONES[tone];

  return (
    <Card
      // gap-0 / py-0 neutralize the default Card spacing, so this works with old and new shadcn Card
      className={cn(
        "group relative h-full min-w-0 gap-0 overflow-hidden py-0 transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
        t.hover,
        className,
      )}
    >
      {/* Soft glow that appears on hover */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100",
          t.glow,
        )}
      />

      <CardHeader className="relative gap-1.5 p-5 pb-0">
        <span
          aria-hidden="true"
          className={cn(
            "mb-2 flex size-9 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110",
            t.icon,
          )}
        >
          <Icon className="size-4" />
        </span>
        <h3 className="text-base font-semibold leading-none tracking-tight">{title}</h3>
        <CardDescription className="leading-relaxed">{text}</CardDescription>
      </CardHeader>

      {children && <CardContent className="relative flex-1 px-5 pb-5 pt-5">{children}</CardContent>}
    </Card>
  );
}

/* ------------------------------- Visuals ------------------------------- */

const TRACES = [
  { name: "chat-completion", model: "gpt-4o-mini", ms: 820, error: false },
  { name: "summarize", model: "llama-3.3-70b", ms: 2140, error: false },
  { name: "classify", model: "gpt-4o-mini", ms: 310, error: false },
  { name: "chat-completion", model: "not-a-real-model", ms: 190, error: true },
] as const;

const MEDIUM_MS = 1000;
const SLOW_MS = 3000;

const formatMs = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms}ms`);

function TracesVisual() {
  const max = Math.max(...TRACES.map((t) => t.ms));

  return (
    <div aria-hidden="true" className="overflow-hidden rounded-xl border bg-muted/30">
      <ul className="divide-y">
        {TRACES.map((row, i) => {
          const bar = row.ms >= SLOW_MS ? "bg-rose-500" : row.ms >= MEDIUM_MS ? "bg-amber-500" : "bg-emerald-500";

          return (
            <li
              key={i}
              className={cn("relative flex items-center gap-3 px-3 py-2.5", row.error && "bg-rose-500/6")}
            >
              {row.error && <span className="absolute inset-y-0 left-0 w-0.5 bg-rose-500" />}

              <Badge
                variant={row.error ? "destructive" : "secondary"}
                className="h-5 shrink-0 px-1.5 text-[10px] font-medium"
              >
                {row.error ? "error" : "success"}
              </Badge>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{row.name}</p>
                <p className="truncate font-mono text-[10px] text-muted-foreground">{row.model}</p>
              </div>

              <div className="w-20 shrink-0 space-y-1 text-right sm:w-32">
                <p className="text-xs font-medium tabular-nums">{formatMs(row.ms)}</p>
                <div className="h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", bar)}
                    style={{ width: `${Math.max(6, (row.ms / max) * 100)}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="border-t bg-muted/40 px-3 py-1.5 text-[10px] uppercase tracking-wide text-muted-foreground/70">
        Illustrative example
      </p>
    </div>
  );
}

function ErrorVisual() {
  return (
    <div aria-hidden="true" className="space-y-2.5">
      <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/6 p-3">
        <CircleAlert className="mt-0.5 size-4 shrink-0 text-rose-600 dark:text-rose-400" />
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">This call failed</p>
          <p className="wrap-break-word font-mono text-[11px] leading-relaxed text-muted-foreground">
            The model `not-a-real-model` does not exist or you do not have access to it.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
          error
        </Badge>
        <span className="text-[11px] tabular-nums text-muted-foreground">190ms</span>
      </div>
    </div>
  );
}

function TokensVisual() {
  return (
    <div aria-hidden="true" className="space-y-2 text-xs">
      <div className="space-y-2 rounded-lg border bg-muted/30 px-3 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Provider reports usage</span>
          <span className="shrink-0 font-medium tabular-nums">1,204 in · 389 out</span>
        </div>
        <div className="flex h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-sky-500" style={{ width: "75%" }} />
          <div className="h-full flex-1 bg-violet-500/70" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed bg-muted/30 px-3 py-2.5">
        <span className="text-muted-foreground">Not reported</span>
        <span className="shrink-0 font-mono text-sm">—</span>
      </div>
    </div>
  );
}

const FIELDS = ["status", "duration", "model", "type", "input", "output", "tokens", "error", "metadata"] as const;

function FieldsVisual() {
  return (
    <ul aria-label="Captured fields" className="flex flex-wrap gap-1.5">
      {FIELDS.map((field) => (
        <li key={field}>
          <Badge variant="secondary" className="font-mono text-[11px] font-normal text-muted-foreground">
            {field}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

function LiveVisual() {
  return (
    <div aria-hidden="true" className="space-y-2.5">
      <Badge variant="outline" className="gap-2 px-3 py-1 text-xs font-normal text-muted-foreground">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        Refreshes every 5s
      </Badge>
      <ul className="space-y-1.5 text-xs">
        <li className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/6 px-3 py-1.5">
          <span className="font-medium">chat-completion</span>
          <span className="text-muted-foreground">just now</span>
        </li>
        <li className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-1.5 opacity-70">
          <span className="font-medium">summarize</span>
          <span className="text-muted-foreground">12s ago</span>
        </li>
      </ul>
    </div>
  );
}

/* ------------------------------- Section ------------------------------- */

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative scroll-mt-24 overflow-hidden border-t py-20 sm:py-24"
    >
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-3xl -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="features-title"
            eyebrow="Features"
            title="Everything your AI app did, in one place"
            description="See every AI call your app makes, how long it took, and exactly why it failed."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Reveal className="min-w-0 md:col-span-2 lg:col-span-4">
            <FeatureCard
              icon={Layers}
              tone="violet"
              title="See which calls are slow"
              text="Every trace records how long it took, so slow calls and failures stand out at a glance."
            >
              <TracesVisual />
            </FeatureCard>
          </Reveal>

          <Reveal delay={0.05} className="min-w-0 lg:col-span-2">
            <FeatureCard
              icon={CircleAlert}
              tone="rose"
              title="Errors with context"
              text="Open a failed trace and the error is the first thing you see."
            >
              <ErrorVisual />
            </FeatureCard>
          </Reveal>

          <Reveal delay={0.05} className="min-w-0 lg:col-span-2">
            <FeatureCard
              icon={Coins}
              tone="sky"
              title="Honest token usage"
              text="Usage is shown when your provider reports it. When it doesn't, you see a dash, never a made-up zero."
            >
              <TokensVisual />
            </FeatureCard>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0 lg:col-span-2">
            <FeatureCard
              icon={ListTree}
              tone="amber"
              title="The details that matter"
              text="Status, duration, model, input, output and more for every call."
            >
              <FieldsVisual />
            </FeatureCard>
          </Reveal>

          <Reveal delay={0.15} className="min-w-0 lg:col-span-2">
            <FeatureCard
              icon={Radio}
              tone="emerald"
              title="Live dashboard"
              text="New traces show up on their own, with no manual reload."
            >
              <LiveVisual />
            </FeatureCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}