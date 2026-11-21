import type { ReactNode } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/modules/dashboard/components/copy-button";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/* ------------------------------ Content ------------------------------ */

const INSTALL = "npm install @tracelayer/sdk";

const ENV = `# server-side only. Never expose this key in the browser
TRACELAYER_API_KEY=tl_live_xxxxxxxxxxxx`;

// Illustrative. callYourModel stands for your own AI provider call.
const SNIPPET = `import { TraceLayer } from "@tracelayer/sdk";

const tracer = new TraceLayer({
  apiKey: process.env.TRACELAYER_API_KEY!,
});

const answer = await tracer.trace("chat.completion", async (span) => {
  span.setModel("gpt-4o-mini").setInput(prompt);

  const { text, usage } = await callYourModel(prompt); // your own AI call

  span.setOutput(text).setUsage(usage);
  return text;
});`;

type Kind = "ts" | "env" | "shell";

const TABS = [
  { value: "install", label: "Install", file: "Terminal", kind: "shell", code: INSTALL },
  { value: "env", label: "Environment", file: ".env.local", kind: "env", code: ENV },
  { value: "instrument", label: "Instrument", file: "ai.ts", kind: "ts", code: SNIPPET },
] as const satisfies readonly { value: string; label: string; file: string; kind: Kind; code: string }[];

const STEPS = [
  {
    title: "Create a project",
    text: "You get an API key for it. The full key is shown only once, so store it in a server-side environment variable.",
    visual: "key",
  },
  {
    title: "Add the SDK to your app",
    text: "Install @tracelayer/sdk and wrap the AI calls you want to see.",
    visual: "install",
  },
  {
    title: "Watch traces arrive",
    text: "Open the dashboard to see status, duration, model, tokens and errors as they come in.",
    visual: "live",
  },
] as const;

/* --------------------------- Syntax coloring --------------------------- */
// Tiny dependency-free highlighter, so this section can stay a server component.

const TS_TOKEN =
  /("(?:[^"\\]|\\.)*")|(\/\/.*$)|\b(import|from|const|await|async|return|new)\b|(\.[A-Za-z]+)(?=\()|\b([A-Z][A-Za-z]+)\b/g;

const TS_CLASS = {
  str: "text-emerald-600 dark:text-emerald-400",
  comment: "italic text-muted-foreground/70",
  keyword: "text-violet-600 dark:text-violet-400",
  method: "text-sky-600 dark:text-sky-400",
  type: "text-amber-600 dark:text-amber-400",
} as const;

function highlightTs(line: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;

  for (const m of line.matchAll(TS_TOKEN)) {
    const index = m.index ?? 0;
    if (index > last) nodes.push(line.slice(last, index));

    const className = m[1]
      ? TS_CLASS.str
      : m[2]
        ? TS_CLASS.comment
        : m[3]
          ? TS_CLASS.keyword
          : m[4]
            ? TS_CLASS.method
            : TS_CLASS.type;

    nodes.push(
      <span key={index} className={className}>
        {m[0]}
      </span>,
    );
    last = index + m[0].length;
  }

  if (last < line.length) nodes.push(line.slice(last));
  return nodes;
}

function highlightEnv(line: string): ReactNode {
  if (line.startsWith("#")) return <span className={TS_CLASS.comment}>{line}</span>;
  const eq = line.indexOf("=");
  if (eq === -1) return line;
  return (
    <>
      <span className={TS_CLASS.method}>{line.slice(0, eq)}</span>
      <span className="text-muted-foreground">=</span>
      <span className={TS_CLASS.str}>{line.slice(eq + 1)}</span>
    </>
  );
}

function highlightShell(line: string): ReactNode {
  const [cmd, ...rest] = line.split(" ");
  return (
    <>
      <span className="mr-2 select-none text-muted-foreground/60">$</span>
      <span className={TS_CLASS.keyword}>{cmd}</span> {rest.join(" ")}
    </>
  );
}

function highlight(line: string, kind: Kind): ReactNode {
  if (kind === "ts") return highlightTs(line);
  if (kind === "env") return highlightEnv(line);
  return highlightShell(line);
}

/* ------------------------------ Code window ------------------------------ */

function CodeLines({ code, kind }: { code: string; kind: Kind }) {
  const lines = code.split("\n");
  const showNumbers = kind !== "shell" && lines.length > 1;

  return (
    <pre className="overflow-x-auto py-3 text-[13px] leading-relaxed">
      <code className="grid font-mono">
        {lines.map((line, i) => {
          // Draw the eye to the lines where the developer describes the call
          const key = kind === "ts" && /\bspan\.set/.test(line);

          return (
            <span
              key={i}
              className={cn(
                "flex min-w-max border-l-2 px-4",
                key ? "border-violet-500 bg-violet-500/8" : "border-transparent",
              )}
            >
              {showNumbers && (
                <span
                  aria-hidden="true"
                  className="mr-4 w-4 shrink-0 select-none text-right tabular-nums text-muted-foreground/40"
                >
                  {i + 1}
                </span>
              )}
              <span className="whitespace-pre">{line === "" ? "\u00a0" : highlight(line, kind)}</span>
            </span>
          );
        })}
      </code>
    </pre>
  );
}

function CodeWindow() {
  return (
    <div className="relative">
      {/* Decorative glow behind the window */}
      <div
        aria-hidden="true"
        className="absolute -inset-4 -z-10 rounded-[2rem] bg-linear-to-br from-violet-500/15 via-transparent to-sky-500/10 blur-2xl"
      />

      <Tabs defaultValue="instrument" className="w-full gap-0">
        <Card className="gap-0 overflow-hidden py-0 shadow-lg shadow-black/5">
          <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-3 py-2">
            <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-red-400/70" />
              <span className="size-2.5 rounded-full bg-yellow-400/70" />
              <span className="size-2.5 rounded-full bg-green-400/70" />
            </div>
            <TabsList className="h-8">
              {TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="h-6 px-2.5 text-xs">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="m-0">
              <div className="flex items-center justify-between border-b px-4 py-1 pr-1.5 text-xs text-muted-foreground">
                <span className="font-mono">{tab.file}</span>
                <CopyButton value={tab.code} label="Copy" />
              </div>
              <CodeLines code={tab.code} kind={tab.kind} />
            </TabsContent>
          ))}

          <div className="flex items-center gap-2 border-t bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            Your AI requests still go straight to your provider. TraceLayer only receives telemetry.
          </div>
        </Card>
      </Tabs>
    </div>
  );
}

/* ------------------------------- Steps ------------------------------- */

function StepVisual({ type }: { type: (typeof STEPS)[number]["visual"] }) {
  if (type === "key") {
    return (
      <div aria-hidden="true" className="mt-3 flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
        <KeyRound className="size-3.5 shrink-0 text-violet-500" />
        <code className="min-w-0 flex-1 truncate font-mono text-xs">tl_live_a1b2••••••••••••</code>
        <Badge variant="secondary" className="shrink-0 px-1.5 text-[10px] font-medium">
          Shown once
        </Badge>
      </div>
    );
  }

  if (type === "install") {
    return (
      <div
        aria-hidden="true"
        className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border bg-card px-3 py-2 font-mono text-xs"
      >
        <span className="select-none text-muted-foreground/60">$</span>
        <span className="truncate">{INSTALL}</span>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="mt-3 flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2 text-xs">
      <span className="relative flex size-2 shrink-0">
        <span className="absolute inline-flex size-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium">
        success
      </Badge>
      <span className="min-w-0 flex-1 truncate font-medium">chat.completion</span>
      <span className="shrink-0 tabular-nums text-muted-foreground">820ms</span>
    </div>
  );
}

/* ------------------------------- Section ------------------------------- */

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="relative scroll-mt-24 overflow-hidden border-t bg-muted/20 py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="how-title"
            eyebrow="How it works"
            title="From install to first trace in three steps"
            description="No agents to run and no infrastructure to manage."
          />
        </Reveal>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="min-w-0">
            <ol>
              {STEPS.map((step, i) => (
                <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-4 top-9 bottom-0 w-px -translate-x-1/2 bg-linear-to-b from-violet-500/40 to-border"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-violet-500/40 bg-background font-mono text-sm font-medium tabular-nums text-violet-700 shadow-sm dark:text-violet-300"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h3 className="text-base font-semibold tracking-tight">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                    <StepVisual type={step.visual} />
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0 lg:sticky lg:top-24">
            <CodeWindow />
          </Reveal>
        </div>
      </div>
    </section>
  );
}