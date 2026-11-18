import { z } from "zod";
import type { TracePayload } from "@tracelayer/sdk";

export const tracePayloadSchema = z.object({
  name: z.string().min(1).max(200),
  status: z.enum(["success", "error"]),
  startedAt: z.string().datetime(),
  duration: z.number().int().nonnegative(),
  model: z.string().max(200).optional(),
  input: z.string().max(100_000).optional(),
  output: z.string().max(100_000).optional(),
  usage: z
    .object({
      inputTokens: z.number().int().nonnegative(),
      outputTokens: z.number().int().nonnegative(),
    })
    .optional(),
  error: z.string().max(10_000).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
}) satisfies z.ZodType<TracePayload>; // compile error if SDK and server drift apart