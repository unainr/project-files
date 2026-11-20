import { ChevronDown } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const FAQ = [
  {
    q: "What is TraceLayer?",
    a: "An observability dashboard for AI apps. You add the SDK to your app, and the dashboard shows the traces it sends: status, duration, model, input and output, token usage and errors.",
  },
  {
    q: "Does TraceLayer store my prompts and outputs?",
    a: "Only if you turn content capture on in the SDK. When it is off, those fields stay empty and the dashboard tells you why.",
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
    q: "How fresh is the dashboard?",
    a: "It refreshes on its own every 5 seconds, so new traces appear without a reload.",
  },
] as const;

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="scroll-mt-24 border-t bg-muted/20 py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="faq-title"
            eyebrow="FAQ"
            title="Questions, answered"
          />
        </Reveal>

        <Reveal delay={0.05} className="mt-10">
          <div className="divide-y overflow-hidden rounded-2xl border bg-card shadow-sm">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0">{q}</span>
                  <ChevronDown
                    className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </summary>
                <p className="px-5 pb-4 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}