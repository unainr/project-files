import { PricingPlans } from "./pricing-plans";
import { PricingFaq } from "./pricing-faq";


export function PricingView() {
  return (
    <>
      <section
        aria-labelledby="pricing-title"
        className="relative isolate -mt-20 overflow-hidden"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 size-80 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="absolute right-1/4 top-24 size-72 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />
        </div>

        <div className="mx-auto w-full max-w-3xl px-4 pb-14 pt-32 text-center sm:px-6 sm:pb-16 sm:pt-36 lg:px-8">
          <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300">
            Pricing
          </span>
          <h1
            id="pricing-title"
            className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            Simple plans for{" "}
            <span className="bg-linear-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
              every stage
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground sm:text-lg">
            Start small and grow into it. Paid plans are coming soon.
          </p>
        </div>
      </section>

      <PricingPlans />
      <PricingFaq />
 
    </>
  );
}