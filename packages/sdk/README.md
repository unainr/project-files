# @tracelayer/sdk

Lightweight TypeScript SDK for [TraceLayer](https://tracelayerio.vercel.app), an observability dashboard for AI calls.

Your AI requests still go straight to your provider. TraceLayer only receives telemetry: duration, status, model, tokens, and (optionally) input/output.

## Install

```bash
npm install @tracelayer/sdk
```

## Quick start

Create a project in the dashboard, copy its API key, and keep it **server-side** only:

```env
TRACELAYER_API_KEY=tl_live_xxxxxxxx
```

```ts
import { TraceLayer } from "@tracelayer/sdk";

const tracer = new TraceLayer({ apiKey: process.env.TRACELAYER_API_KEY! });

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

// serverless (Vercel, Workers): wait for delivery before responding
await tracer.flush();
```

Duration and success/failure are captured automatically. Model, input, output, and token usage are set explicitly through the span.

## Options

| Option | Default | Description |
|---|---|---|
| `apiKey` | required | Project API key |
| `baseUrl` | TraceLayer API | Override for self-hosting or local development |
| `timeoutMs` | `3000` | Per-request timeout |
| `enabled` | `true` | Set `false` to send nothing (tests, local) |
| `captureContent` | `true` | `false` = never send input/output |
| `redact` | none | `(text) => text` applied before anything is sent |
| `onError` | none | Called when telemetry fails |

## Reliability

- Telemetry never throws into your app.
- Your function's result is returned unchanged, and its errors are rethrown unchanged.
- Sends are non-blocking with a timeout.

## Privacy

Prompts and outputs may contain sensitive data. Use `captureContent: false` or `redact` to control what leaves your app. Your AI provider keys are never sent to TraceLayer.

## License

MIT