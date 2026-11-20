import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function CtaSection() {
  return (
    <section aria-labelledby="cta-title" className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
      <Reveal className="mx-auto max-w-5xl">
        <div className="relative isolate overflow-hidden rounded-3xl border bg-card px-6 py-14 text-center shadow-sm sm:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-20 left-1/4 size-72 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="absolute -bottom-24 right-1/4 size-72 rounded-full bg-indigo-500/15 blur-3xl" />
          </div>

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
            <Button asChild size="lg" className="gap-2">
              <Link href="/projects">
                Start tracing
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}