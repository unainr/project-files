import { CodeBlock } from "@/modules/dashboard/components/code-block";


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

export function IntegrationGuide() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Your AI requests still go straight to your provider. TraceLayer only receives telemetry. Prompts and outputs may
        contain sensitive data. Use <code>captureContent: false</code> or <code>redact</code> to control what is sent.
      </p>
      <CodeBlock title="1. Install" code={INSTALL} />
      <CodeBlock title="2. Environment variables" code={ENV} />
      <CodeBlock title="3. Instrument a call" code={USAGE} />
    </div>
  );
}