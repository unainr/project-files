import { KeyRound, Lock, Server } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const ITEMS = [
  {
    icon: Lock,
    title: "You choose what is captured",
    text: "Prompts and outputs are only recorded when you turn content capture on in the SDK.",
  },
  {
    icon: KeyRound,
    title: "Keys are shown once",
    text: "The full API key appears only when you create it. Everywhere else you see just its prefix.",
  },
  {
    icon: Server,
    title: "Keep keys on the server",
    text: "Store your key in a server-side environment variable, never in browser code.",
  },
] as const;

export function PrivacySection() {
  return (
    <section
      aria-labelledby="privacy-title"
      className="border-t py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="privacy-title"
            eyebrow="Privacy"
            title="Built for data you care about"
            description="Prompts and outputs can be sensitive, so you stay in control of what leaves your app."
          />
        </Reveal>

        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {ITEMS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="min-w-0">
              <Reveal delay={i * 0.06} className="h-full">
                <div className="h-full rounded-2xl border bg-card p-5 shadow-sm">
                  <span
                    aria-hidden="true"
                    className="flex size-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400"
                  >
                    <Icon className="size-4" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}