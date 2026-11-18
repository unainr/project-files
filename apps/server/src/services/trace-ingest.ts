import type { TracePayload } from "@tracelayer/sdk";
import type { Db } from "../db";
import { spans, traces } from "../db/schema";
import { newId } from "../lib/id";

export async function ingestTrace(db: Db, projectId: string, p: TracePayload) {
  const traceId = newId.trace(); // we generate ids in code, so both inserts can go in one batch

  // neon-http batch runs as a single transaction: both rows are written or neither
  await db.batch([
    db.insert(traces).values({
      id: traceId,
      projectId,
      name: p.name,
      status: p.status,
      startedAt: new Date(p.startedAt),
      duration: p.duration,
    }),
    db.insert(spans).values({
      traceId,
      name: p.name,
      status: p.status,
      model: p.model,
      input: p.input,
      output: p.output,
      inputTokens: p.usage?.inputTokens,
      outputTokens: p.usage?.outputTokens,
      duration: p.duration,
      error: p.error,
      metadata: p.metadata,
    }),
  ]);

  return { id: traceId };
}