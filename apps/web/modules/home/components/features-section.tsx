import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CircleAlert, Layers, Radio, Coins, ListTree } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

type CardProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  children?: ReactNode;
  className?: string;
};

function FeatureCard({ icon: Icon, title, text, children, className }: CardProps) {
  return (
    <div
      className={cn(
        "group flex h-full min-w-0 flex-col rounded-2xl border bg-card p-5 shadow-sm transition-colors hover:border-violet-500/40",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400"
      >
        <Icon className="size-4" />
      </span>
      <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
      {children && <div className="mt-5 flex-1">{children}</div>}
    </div>
  );
}

const WATERFALL = [
  { name: "agent.run", left: 0, width: 100, error: false },
  { name: "retrieve.documents", left: 4, width: 24, error: false },
  { name: "llm.generate", left: 30, width: 52, error: false },
  { name: "tool.search_web", left: 84, width: 14, error: true },
] as const;

function WaterfallVisual() {
  return (
    <div aria-hidden="true" className="space-y-2 rounded-xl border bg-muted/30 p-3">
      {WATERFALL.map((row) => (
        <div key={row.name} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 sm:grid-cols-[8rem_1fr]">
          <span className="truncate font-mono text-[11px] text-muted-foreground">
            {row.name}
          </span>
          <div className="relative h-4 rounded bg-muted/60">
            <span
              className={cn(
                "absolute inset-y-0.5 rounded-sm",
                row.error ? "bg-rose-500/80" : "bg-emerald-500/80"
              )}
              style={{ left: `${row.left}%`, width: `${row.width}%` }}
            />
          </div>
        </div>
      ))}
      <p className="pt-1 text-[10px] uppercase tracking-wide text-muted-foreground/70">
        Illustrative layout
      </p>
    </div>
  );
}

function ErrorVisual() {
  return (
    <div
      aria-hidden="true"
      className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs"
    >
      <CircleAlert className="mt-0.5 size-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
      <div className="min-w-0">
        <p className="truncate font-mono font-medium text-rose-700 dark:text-rose-300">
          tool.search_web
        </p>
        <p className="mt-0.5 text-muted-foreground">
          The error is stored on the span that failed.
        </p>
      </div>
    </div>
  );
}

function TokensVisual() {
  return (
    <div aria-hidden="true" className="space-y-2 text-xs">
      <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2">
        <span className="text-muted-foreground">Provider reports usage</span>
        <span className="shrink-0 font-medium">count shown</span>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2">
        <span className="text-muted-foreground">Not reported</span>
        <span className="shrink-0 font-mono text-sm">—</span>
      </div>
    </div>
  );
}

const FIELDS = [
  "status",
  "duration",
  "model",
  "type",
  "input",
  "output",
  "tokens",
  "error",
  "metadata",
] as const;

function FieldsVisual() {
  return (
    <ul aria-label="Captured fields" className="flex flex-wrap gap-1.5">
      {FIELDS.map((f) => (
        <li
          key={f}
          className="rounded-md border bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
        >
          {f}
        </li>
      ))}
    </ul>
  );
}

function LiveVisual() {
  return (
    <div
      aria-hidden="true"
      className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      Refreshes every 5s
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="scroll-mt-24 border-t py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="features-title"
            eyebrow="Features"
            title="Everything your AI app did, in one place"
            description="Follow a request from the first step to the last, and see exactly where it slowed down or failed."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Reveal className="min-w-0 md:col-span-2">
            <FeatureCard
              icon={Layers}
              title="Every step of a request"
              text="Each trace breaks down into spans, laid out on a timeline so slow steps stand out."
            >
              <WaterfallVisual />
            </FeatureCard>
          </Reveal>

          <Reveal delay={0.05} className="min-w-0">
            <FeatureCard
              icon={CircleAlert}
              title="Errors with context"
              text="Jump from a failed trace straight to the span that caused it."
            >
              <ErrorVisual />
            </FeatureCard>
          </Reveal>

          <Reveal delay={0.05} className="min-w-0">
            <FeatureCard
              icon={Coins}
              title="Honest token usage"
              text="Usage is shown when your provider reports it. When it doesn't, you see a dash, never a made-up zero."
            >
              <TokensVisual />
            </FeatureCard>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            <FeatureCard
              icon={ListTree}
              title="The details that matter"
              text="Status, duration, model, input, output and more for every span."
            >
              <FieldsVisual />
            </FeatureCard>
          </Reveal>

          <Reveal delay={0.15} className="min-w-0">
            <FeatureCard
              icon={Radio}
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