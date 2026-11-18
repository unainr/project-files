import type { TracePayload } from "./types";

interface TransportOptions {
  apiKey: string;
  baseUrl: string;
  timeoutMs: number;
  onError: (error: unknown) => void;
}

export class Transport {
  private pending = new Set<Promise<void>>();

  constructor(private readonly options: TransportOptions) {}

  /** Fire-and-forget. Never throws, never blocks the caller. */
  send(payload: TracePayload): void {
    const task = this.post(payload).finally(() => this.pending.delete(task));
    this.pending.add(task);
  }

  /** Wait for in-flight sends (needed on serverless before returning). */
  async flush(): Promise<void> {
    await Promise.allSettled([...this.pending]);
  }

  private async post(payload: TracePayload): Promise<void> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.options.timeoutMs);
    try {
      const res = await fetch(`${this.options.baseUrl}/v1/traces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.options.apiKey}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`TraceLayer ingestion failed with status ${res.status}`);
      }
    } catch (error) {
      this.options.onError(error);
    } finally {
      clearTimeout(timer);
    }
  }
}