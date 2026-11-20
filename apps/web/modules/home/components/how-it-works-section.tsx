import { CopyButton } from "@/modules/dashboard/components/copy-button";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

// Placeholder example. Replace the method names with your real SDK API.
const SNIPPET = `import { TraceLayer } from "@tracelayer/sdk";

const tracer = new TraceLayer({
  apiKey: process.env.TRACELAYER_API_KEY,
  captureContent: true,
});

await tracer.trace("chat.completion", async (span) => {
  span.setInput(prompt);
  const answer = await callYourModel(prompt);
  span.setOutput(answer);
  return answer;
});`;

const STEPS = [
  {
    title: "Create a project",
    text: "You get an API key for it. The full key is shown only once, so store it in a server-side environment variable.",
  },
  {
    title: "Add the SDK to your app",
    text: "Install @tracelayer/sdk and wrap the AI calls you want to see.",
  },
  {
    title: "Watch traces arrive",
    text: "Open the dashboard to see status, duration, model, tokens and errors as they come in.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="scroll-mt-24 border-t bg-muted/20 py-20 sm:py-24"
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

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="min-w-0">
            <ol className="space-y-6">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/10 font-mono text-sm font-medium tabular-nums text-violet-700 dark:text-violet-300"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            <div className="overflow-hidden rounded-xl border bg-card shadow-lg shadow-black/5">
              <div className="flex items-center justify-between gap-3 border-b bg-muted/40 py-1.5 pl-4 pr-1.5">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                </div>
                <CopyButton value={SNIPPET} label="Copy" />
              </div>
              <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
                <code className="font-mono">{SNIPPET}</code>
              </pre>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}