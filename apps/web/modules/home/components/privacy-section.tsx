import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRightLeft, Ban, Check, Hash, KeyRound, Lock, Server, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/* ----------------------------- Card shell ----------------------------- */

type CardProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  children?: ReactNode;
  className?: string;
};

function PrivacyCard({ icon: Icon, title, text, children, className }: CardProps) {
  return (
    <Card
      className={cn(
        "group relative h-full min-w-0 gap-0 overflow-hidden py-0 transition duration-200 hover:-translate-y-0.5 hover:border-violet-500/40 hover:shadow-md",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-violet-500/20 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
      />

      <CardHeader className="relative gap-1.5 p-5 pb-0">
        <span
          aria-hidden="true"
          className="mb-2 flex size-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 transition-transform duration-200 group-hover:scale-110 dark:text-violet-400"
        >
          <Icon className="size-4" />
        </span>
        <h3 className="text-base font-semibold leading-none tracking-tight">{title}</h3>
        <CardDescription className="leading-relaxed">{text}</CardDescription>
      </CardHeader>

      {children && <CardContent className="relative flex-1 p-5 pt-5">{children}</CardContent>}
    </Card>
  );
}

/* ------------------------------- Visuals ------------------------------- */

type Tone = "kw" | "str" | "type" | "comment";
type Tok = readonly [text: string, tone?: Tone];

const TONE: Record<Tone, string> = {
  kw: "text-violet-600 dark:text-violet-400",
  str: "text-emerald-600 dark:text-emerald-400",
  type: "text-amber-600 dark:text-amber-400",
  comment: "italic text-muted-foreground/70",
};

const CAPTURE_LINES: { tokens: Tok[]; highlight?: boolean }[] = [
  { tokens: [["const", "kw"], [" tracer = "], ["new", "kw"], [" "], ["TraceLayer", "type"], ["({"]] },
  { tokens: [["  apiKey: process.env.TRACELAYER_API_KEY!,"]] },
  {
    highlight: true,
    tokens: [["  captureContent: "], ["false", "kw"], [","], ["  // never send input or output", "comment"]],
  },
  { tokens: [["  // or keep it, and scrub the text first:", "comment"]] },
  { tokens: [['  // redact: (text) => text.replace(/\\d{12,}/g, "••••"),', "comment"]] },
  { tokens: [["});"]] },
];

function CaptureVisual() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-xl border bg-muted/30">
      <div className="flex items-center gap-1.5 border-b bg-muted/40 px-3 py-2">
        <span className="size-2.5 rounded-full bg-red-400/70" />
        <span className="size-2.5 rounded-full bg-yellow-400/70" />
        <span className="size-2.5 rounded-full bg-green-400/70" />
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">tracelayer.ts</span>
      </div>
      <pre className="overflow-x-auto py-3 font-mono text-[12px] leading-relaxed sm:text-[13px]">
        <code className="grid">
          {CAPTURE_LINES.map((line, i) => (
            <span
              key={i}
              className={cn(
                "min-w-max whitespace-pre border-l-2 px-4",
                line.highlight ? "border-violet-500 bg-violet-500/8" : "border-transparent",
              )}
            >
              {line.tokens.map(([text, tone], j) => (
                <span key={j} className={tone ? TONE[tone] : undefined}>
                  {text}
                </span>
              ))}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function KeyVisual() {
  return (
    <div aria-hidden="true" className="space-y-2 text-xs">
      <div className="space-y-1.5 rounded-lg border bg-muted/30 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">When you create it</span>
          <Badge variant="secondary" className="px-1.5 text-[10px] font-medium">
            Shown once
          </Badge>
        </div>
        <code className="block truncate font-mono">tl_live_a1b2••••••••••••</code>
      </div>
      <div className="space-y-1.5 rounded-lg border border-dashed bg-muted/30 p-3">
        <span className="text-muted-foreground">Everywhere else</span>
        <code className="block font-mono">tl_live_a1b2…</code>
      </div>
    </div>
  );
}

function ServerVisual() {
  return (
    <div aria-hidden="true" className="space-y-2 text-xs">
      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/6 px-3 py-2">
        <Check className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <code className="min-w-0 truncate font-mono">TRACELAYER_API_KEY</code>
        <span className="ml-auto shrink-0 text-muted-foreground">server</span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/6 px-3 py-2">
        <X className="size-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
        <code className="min-w-0 truncate font-mono line-through decoration-rose-500/60">
          NEXT_PUBLIC_TRACELAYER_API_KEY
        </code>
        <span className="ml-auto shrink-0 text-muted-foreground">browser</span>
      </div>
    </div>
  );
}

const ALSO = [
  { icon: Hash, text: "Keys are stored as hashes, never in plain text" },
  { icon: Ban, text: "Revoked keys stop working right away" },
  { icon: ArrowRightLeft, text: "Your provider keys never reach TraceLayer" },
] as const;

/* ------------------------------- Section ------------------------------- */

export function PrivacySection() {
  return (
    <section aria-labelledby="privacy-title" className="relative overflow-hidden border-t py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-3xl -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="privacy-title"
            eyebrow="Privacy"
            title="Built for data you care about"
            description="Prompts and outputs can be sensitive, so you stay in control of what leaves your app."
          />
        </Reveal>

        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <li className="min-w-0 md:col-span-2 lg:row-span-2">
            <Reveal className="h-full">
              <PrivacyCard
                icon={Lock}
                title="You choose what is captured"
                text="Prompts and outputs are only sent when your code adds them to a span. Turn capture off entirely, or scrub the text before it leaves your app."
              >
                <CaptureVisual />
                <ul className="mt-3 flex flex-wrap gap-2">
                  <li>
                    <Badge variant="secondary" className="font-normal">
                      <code className="font-mono">captureContent: false</code> sends no input or output
                    </Badge>
                  </li>
                  <li>
                    <Badge variant="secondary" className="font-normal">
                      <code className="font-mono">redact</code> cleans text first
                    </Badge>
                  </li>
                </ul>
              </PrivacyCard>
            </Reveal>
          </li>

          <li className="min-w-0">
            <Reveal delay={0.06} className="h-full">
              <PrivacyCard
                icon={KeyRound}
                title="Keys are shown once"
                text="The full API key appears only when you create it. Everywhere else you see just its prefix."
              >
                <KeyVisual />
              </PrivacyCard>
            </Reveal>
          </li>

          <li className="min-w-0">
            <Reveal delay={0.12} className="h-full">
              <PrivacyCard
                icon={Server}
                title="Keep keys on the server"
                text="Store your key in a server-side environment variable, never in browser code."
              >
                <ServerVisual />
              </PrivacyCard>
            </Reveal>
          </li>
        </ul>

        <Reveal delay={0.18} className="mt-4">
          <ul className="grid gap-3 rounded-2xl border bg-muted/20 p-4 sm:grid-cols-3">
            {ALSO.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Icon className="mt-0.5 size-4 shrink-0 text-violet-600 dark:text-violet-400" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}