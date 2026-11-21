import type { ReactNode } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground">{children}</code>;
}

const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: "What is TraceLayer?",
    a: "An observability dashboard for AI apps. You add the SDK to your app, and the dashboard shows the traces it sends: status, duration, model, input and output, token usage and errors.",
  },
  {
    q: "Does TraceLayer store my prompts and outputs?",
    a: (
      <>
        Only what your app sends. Prompts and outputs are recorded when your code passes them to a span, and you can
        turn that off with <Code>captureContent: false</Code> or scrub the text first with <Code>redact</Code>. When a
        field isn&apos;t captured, the dashboard tells you why.
      </>
    ),
  },
  {
    q: "Does TraceLayer see my AI provider keys?",
    a: "No. Your AI requests go straight from your app to your provider with your own keys. TraceLayer only receives the telemetry you send.",
  },
  {
    q: "What if my provider doesn't report tokens?",
    a: "You will see a dash instead of a number. TraceLayer never shows zero for usage it didn't receive.",
  },
  {
    q: "Where should I keep my API key?",
    a: "In a server-side environment variable. The full key is shown once when you create it, so copy it then.",
  },
  {
    q: "Can TraceLayer slow down or break my app?",
    a: (
      <>
        It&apos;s built not to. Telemetry is sent in the background with a short timeout, a failed delivery never
        changes your result, and your own errors are rethrown exactly as they were. On serverless platforms, call{" "}
        <Code>await tracer.flush()</Code> before returning your response so nothing is cut off.
      </>
    ),
  },
  {
    q: "How fresh is the dashboard?",
    a: "It refreshes on its own every 5 seconds, so new traces appear without a reload.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative scroll-mt-24 overflow-hidden border-t bg-muted/20 py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-56 w-160 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl"
      />

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions, answered" />
        </Reveal>

        <Reveal delay={0.05} className="mt-10">
          <Card className="gap-0 overflow-hidden py-0 shadow-sm">
            <Accordion type="single" collapsible defaultValue="faq-0" className="w-full">
              {FAQ.map(({ q, a }, i) => (
                <AccordionItem key={q} value={`faq-${i}`} className="px-5 last:border-b-0">
                  <AccordionTrigger className="py-4 text-left text-sm font-medium hover:no-underline">
                    <span className="flex items-baseline gap-3">
                      <span aria-hidden="true" className="font-mono text-xs tabular-nums text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-8 text-sm leading-relaxed text-muted-foreground">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}