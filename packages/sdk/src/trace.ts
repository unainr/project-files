import type { TokenUsage } from "./types";

export interface SpanData {
  model?: string;
  input?: string;
  output?: string;
  usage?: TokenUsage;
  metadata: Record<string, unknown>;
}

function toText(value: unknown): string {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value); // circular structures etc.
  }
}

export class Span {
  private data: SpanData = { metadata: {} };

  setModel(model: string): this {
    this.data.model = model;
    return this;
  }

  setInput(input: unknown): this {
    this.data.input = toText(input);
    return this;
  }

  setOutput(output: unknown): this {
    this.data.output = toText(output);
    return this;
  }

  setUsage(usage: TokenUsage): this {
    this.data.usage = usage;
    return this;
  }

  setMetadata(metadata: Record<string, unknown>): this {
    Object.assign(this.data.metadata, metadata);
    return this;
  }

  /** Used internally by the client. */
  snapshot(): SpanData {
    return { ...this.data, metadata: { ...this.data.metadata } };
  }
}