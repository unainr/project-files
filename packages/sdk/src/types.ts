export type TraceStatus = "success" | "error";

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

/** The exact JSON body sent to POST /v1/traces. */
export interface TracePayload {
  name: string;
  status: TraceStatus;
  startedAt: string; // ISO 8601
  duration: number; // ms
  model?: string;
  input?: string;
  output?: string;
  usage?: TokenUsage;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface TraceLayerOptions {
  /** Project API key (tl_live_...). Keep it server-side. */
  apiKey: string;
  /** Override for self-hosting / local dev. */
  baseUrl?: string;
  /** Per-request timeout. Default 3000ms. */
  timeoutMs?: number;
  /** Master switch. Set false in tests/local to send nothing. */
  enabled?: boolean;
  /** false = never send input/output (privacy mode). Default true. */
  captureContent?: boolean;
  /** Runs on input/output/error text before it leaves the app. */
  redact?: (text: string) => string;
  /** Called when telemetry fails. Telemetry never throws into your app. */
  onError?: (error: unknown) => void;
}