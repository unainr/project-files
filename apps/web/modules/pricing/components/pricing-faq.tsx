import { Reveal } from "@/modules/home/components/reveal";
import { SectionHeading } from "@/modules/home/components/section-heading";
import { ChevronDown } from "lucide-react";


const FAQ = [
  {
    q: "When can I subscribe?",
    a: "Paid plans are coming soon. The buttons on this page will turn on as each plan opens.",
  },
  {
    q: "Will the prices change?",
    a: "They may change before launch. The final prices will be shown here when each plan opens.",
  },
  {
    q: "Is there a free way to try it?",
    a: "The Free plan is meant for that. It is listed as coming soon along with the others.",
  },
  {
    q: "Do I pay for traces that don't report tokens?",
    a: "Token counts are shown only when your provider reports them. TraceLayer never invents usage numbers.",
  },
] as const;

export function PricingFaq() {
  return (
    <section
      aria-labelledby="pricing-faq-title"
      className="border-t bg-muted/20 py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="pricing-faq-title"
            eyebrow="Pricing FAQ"
            title="Before you ask"
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