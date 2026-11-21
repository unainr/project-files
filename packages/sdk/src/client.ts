import { Span } from "./trace";
import { Transport } from "./transport";
import type { TraceLayerOptions, TracePayload, TraceStatus } from "./types";

const DEFAULT_BASE_URL = "https://server.unainraza7.workers.dev/api"; // TODO: your deployed API URL
const DEFAULT_TIMEOUT_MS = 3000;
// Server accepts 100k chars; staying under it means we never get rejected for size.
const MAX_TEXT_LENGTH = 50_000;

interface RecordInput {
  name: string;
  status: TraceStatus;
  span: Span;
  startedAt: Date;
  startMark: number;
  error?: unknown;
}

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export class TraceLayer {
  private readonly transport: Transport;
  private readonly enabled: boolean;
  private readonly captureContent: boolean;
  private readonly redact?: (text: string) => string;
  private readonly onError?: (error: unknown) => void;

  constructor(options: TraceLayerOptions) {
    this.captureContent = options.captureContent ?? true;
    this.redact = options.redact;
    this.onError = options.onError;

    const hasKey = Boolean(options.apiKey);
    if (!hasKey && options.enabled !== false) {
      console.warn("[tracelayer] No apiKey provided. Telemetry is disabled.");
    }
    this.enabled = (options.enabled ?? true) && hasKey;

    this.transport = new Transport({
      apiKey: options.apiKey,
      baseUrl: (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, ""),
      timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      onError: this.report,
    });
  }

  /**
   * Runs `fn`, measures it, and reports the result.
   * Returns fn's result unchanged; rethrows fn's error unchanged.
   */
  async trace<T>(name: string, fn: (span: Span) => Promise<T> | T): Promise<T> {
    const span = new Span();
    const startedAt = new Date();
    const startMark = performance.now();

    try {
      const result = await fn(span);
      this.record({ name, status: "success", span, startedAt, startMark });
      return result;
    } catch (error) {
      this.record({ name, status: "error", span, startedAt, startMark, error });
      throw error; // the app's own error is never swallowed or altered
    }
  }

  /** Await before returning on serverless (Vercel, Workers) so sends aren't killed. */
  flush(): Promise<void> {
    return this.transport.flush();
  }

  private record(input: RecordInput): void {
    if (!this.enabled) return;
    try {
      this.transport.send(this.buildPayload(input));
    } catch (error) {
      this.report(error); // telemetry must never break the app
    }
  }

  private buildPayload(input: RecordInput): TracePayload {
    const { name, status, span, startedAt, startMark, error } = input;
    const data = span.snapshot();
    const content = (text?: string) =>
      text !== undefined && this.captureContent ? this.sanitize(text) : undefined;

    return {
      name,
      status,
      startedAt: startedAt.toISOString(),
      duration: Math.round(performance.now() - startMark),
      model: data.model,
      input: content(data.input),
      output: content(data.output),
      usage: data.usage,
      error: status === "error" ? this.sanitize(errorMessage(error)) : undefined,
      metadata: Object.keys(data.metadata).length > 0 ? data.metadata : undefined,
    };
  }

  private sanitize(text: string): string {
    const redacted = this.redact ? this.redact(text) : text;
    return redacted.length > MAX_TEXT_LENGTH ? redacted.slice(0, MAX_TEXT_LENGTH) : redacted;
  }

  private report = (error: unknown): void => {
    try {
      this.onError?.(error);
    } catch {
      /* a broken onError must not break the app either */
    }
  };
}