import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/modules/dashboard/components/copy-button";
import { Reveal } from "./reveal";

const INSTALL = "npm install @tracelayer/sdk";

const POINTS = ["No agents to run", "Keys stay on your server", "Your AI requests stay direct"] as const;

export function CtaSection() {
  return (
    <section aria-labelledby="cta-title" className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8 p-5">
      <Reveal className="mx-auto max-w-5xl">
        <div className="relative isolate overflow-hidden rounded-3xl border bg-card px-6 py-14 text-center shadow-sm sm:px-12 sm:py-16">
          {/* Background: dotted grid that fades out, plus two soft glows */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-size-[22px_22px] text-foreground/[0.07] mask-[radial-gradient(ellipse_at_center,black,transparent_72%)]" />
            <div className="absolute -top-20 left-1/4 size-72 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="absolute -bottom-24 right-1/4 size-72 rounded-full bg-indigo-500/15 blur-3xl" />
          </div>

          <Badge variant="outline" className="mb-5 bg-background/60 px-3 py-1 font-normal text-muted-foreground backdrop-blur">
            Three steps to your first trace
          </Badge>

          <h2
            id="cta-title"
            className="mx-auto max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            See what your AI app is{" "}
            <span className="bg-linear-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
              really doing
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
            Create a project, add the SDK, and watch your first trace arrive.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="group gap-2 shadow-md shadow-violet-500/20">
              <Link href="/projects">
                Start tracing
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-background/60 backdrop-blur">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>

          <div className="mx-auto mt-6 flex w-fit max-w-full items-center gap-2 rounded-lg border bg-muted/40 py-1 pl-3 pr-1 font-mono text-xs">
            <span aria-hidden="true" className="select-none text-muted-foreground/60">
              $
            </span>
            <span className="truncate">{INSTALL}</span>
            <CopyButton value={INSTALL} label="Copy" />
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-1.5">
                <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}