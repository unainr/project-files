'use client'
import Link from "next/link";
import { ArrowRight, Check, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/modules/home/components/reveal";


type Plan = {
  name: string;
  description: string;
  price: string; // placeholder values, replace with your real prices
  period: string | null;
  features: readonly string[];
  highlight: boolean;
  available: boolean; // set to true once the plan can be bought or started
  href: string; // used only when available is true
  cta: string; // label shown once available
};

const PLANS: readonly Plan[] = [
  {
    name: "Free",
    description: "For trying TraceLayer on a side project.",
    price: "$0",
    period: null,
    features: [
      "One project to start with",
      "Traces, spans and the live dashboard",
      "Status, duration, model and error details",
      "Token usage when your provider reports it",
    ],
    highlight: false,
    available: false,
    href: "/projects",
    cta: "Start tracing",
  },
  {
    name: "Pro",
    description: "For apps running in production.",
    price: "$19",
    period: "/month",
    features: [
      "Everything in Free",
      "More projects and higher trace limits",
      "Longer trace history",
      "Multiple API keys per project",
    ],
    highlight: true,
    available: false,
    href: "/projects",
    cta: "Get Pro",
  },
  {
    name: "Team",
    description: "For teams that debug together.",
    price: "$49",
    period: "/month",
    features: [
      "Everything in Pro",
      "Shared access for your team",
      "Priority support",
      "Early access to new features",
    ],
    highlight: false,
    available: false,
    href: "/projects",
    cta: "Get Team",
  },
];

function PlanButton({ plan }: { plan: Plan }) {
  if (plan.available) {
    return (
      <Button
        asChild
        size="lg"
        variant={plan.highlight ? "default" : "outline"}
        className="w-full gap-2"
      >
        <Link href={plan.href}>
          {plan.cta}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="lg"
      variant={plan.highlight ? "default" : "outline"}
      aria-disabled="true"
      aria-label={`${plan.name} plan, coming soon`}
      onClick={(e) => e.preventDefault()}
      className="w-full cursor-not-allowed gap-2 opacity-70 hover:opacity-70"
    >
      <Clock className="size-4" aria-hidden="true" />
      Coming soon
    </Button>
  );
}

export function PricingPlans() {
  return (
    <section aria-label="Plans" className="pb-20 sm:pb-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <ul className="grid items-stretch gap-5 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <li key={plan.name} className="min-w-0">
              <Reveal delay={i * 0.06} className="h-full">
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm",
                    plan.highlight &&
                      "border-violet-500/50 shadow-lg shadow-violet-500/10 md:-translate-y-2"
                  )}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-6 rounded-full border border-violet-500/40 bg-background px-3 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-300">
                      Most popular
                    </span>
                  )}

                  <h3 className="text-lg font-semibold tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.description}
                  </p>

                  <p className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tabular-nums tracking-tight">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </p>

                  <div className="mt-6">
                    <PlanButton plan={plan} />
                  </div>

                  <ul className="mt-6 flex-1 space-y-3 border-t pt-6 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400"
                        >
                          <Check className="size-3" />
                        </span>
                        <span className="min-w-0 text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Paid plans are not open yet. The details above may change before
            launch.
          </p>
        </Reveal>
      </div>
    </section>
  );
}