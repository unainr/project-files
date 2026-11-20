import { CodeBlock } from "@/modules/dashboard/components/code-block";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, Package, KeyRound, Zap } from "lucide-react";

const INSTALL = "npm install @tracelayer/sdk";

const ENV = `TRACELAYER_API_KEY=tl_live_xxxxxxxx   # server-side only
OPENAI_API_KEY=sk-xxxxxxxx          # your own provider key, never sent to TraceLayer`;

const USAGE = `import { TraceLayer } from "@tracelayer/sdk";

const tracer = new TraceLayer({
  apiKey: process.env.TRACELAYER_API_KEY!,
  // baseUrl: "http://localhost:8787", // local development
});

const response = await tracer.trace("customer-chat", async (span) => {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Hello!" }],
  });

  span
    .setModel(res.model)
    .setInput("Hello!")
    .setOutput(res.choices[0]?.message.content)
    .setUsage({
      inputTokens: res.usage?.prompt_tokens ?? 0,
      outputTokens: res.usage?.completion_tokens ?? 0,
    });

  return res;
});

// serverless (Vercel, Workers): flush before returning your response
await tracer.flush();`;

const STEPS = [
  {
    icon: Package,
    label: "Install",
    description: "Add the SDK to your project",
    code: INSTALL,
    codeTitle: "1. Install",
  },
  {
    icon: KeyRound,
    label: "Configure",
    description: "Set your API key as an environment variable",
    code: ENV,
    codeTitle: "2. Environment variables",
  },
  {
    icon: Zap,
    label: "Instrument",
    description: "Wrap your AI call with a trace span",
    code: USAGE,
    codeTitle: "3. Instrument a call",
  },
];

export function IntegrationGuide() {
  return (
    <div className="space-y-6 ">
      {/* Security notice */}
      <Alert className="border-blue-500/30 bg-blue-500/5">
        <ShieldCheck className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-sm text-muted-foreground">
          Your AI requests go straight to your provider — TraceLayer only receives
          telemetry. Use{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
            captureContent: false
          </code>{" "}
          or{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
            redact
          </code>{" "}
          to control what is sent.
        </AlertDescription>
      </Alert>

      {/* Steps */}
      <div className="space-y-5">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="relative flex gap-4">
              {/* Step connector line */}
              {index < STEPS.length - 1 && (
                <div className="absolute left-4 top-10 bottom-0 w-px bg-border translate-x-[-0.5px]" />
              )}

              {/* Step number + icon */}
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>

              {/* Step content */}
              <div className="flex-1 space-y-2 pb-2">
                <div>
                  <p className="text-sm font-semibold leading-none">{step.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                <CodeBlock title={step.codeTitle} code={step.code} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
