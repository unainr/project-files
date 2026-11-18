import { zValidator } from "@hono/zod-validator";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { projects, spans, traces } from "../db/schema";
import { getOwnedProject } from "../lib/ownership";
import { requireUser,  } from "../middleware/auth";
import { getDb } from "../db";

const listQuery = z.object({
  projectId: z.string().min(1),
  status: z.enum(["success", "error"]).optional(),
  q: z.string().trim().max(100).optional(),
});

const app = new Hono<{ Bindings: CloudflareBindings }>()
  .use(requireUser)
  .get("/", zValidator("query", listQuery), async (c) => {
    const db = await getDb(c.env.DATABASE_URL);

    const { projectId, status, q } = c.req.valid("query");
    if (!(await getOwnedProject(db,c.get("userId"), projectId))) return c.json({ error: "not found" }, 404);

    const rows = await db
      .select({
        trace: traces,
        model: spans.model,
        inputTokens: spans.inputTokens,
        outputTokens: spans.outputTokens,
      })
      .from(traces)
      .leftJoin(spans, eq(spans.traceId, traces.id))
      .where(
        and(
          eq(traces.projectId, projectId),
          status ? eq(traces.status, status) : undefined,
          q ? ilike(traces.name, `%${q}%`) : undefined,
        ),
      )
      .orderBy(desc(traces.startedAt))
      .limit(100);

    return c.json(rows.map(({ trace, ...span }) => ({ ...trace, ...span })));
  })
  // must be declared before "/:id"
  .get("/stats", zValidator("query", z.object({ projectId: z.string().min(1) })), async (c) => {
    const db = await getDb(c.env.DATABASE_URL);

    const { projectId } = c.req.valid("query");
    if (!(await getOwnedProject(db,c.get("userId"), projectId))) return c.json({ error: "not found" }, 404);

    const [counts] = await db
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
        failed: sql<number>`count(*) filter (where ${traces.status} = 'error')`.mapWith(Number),
        avgDuration: sql<number>`coalesce(avg(${traces.duration}), 0)`.mapWith(Number),
      })
      .from(traces)
      .where(eq(traces.projectId, projectId));

    const [tokens] = await db
      .select({
        input: sql<number>`coalesce(sum(${spans.inputTokens}), 0)`.mapWith(Number),
        output: sql<number>`coalesce(sum(${spans.outputTokens}), 0)`.mapWith(Number),
      })
      .from(spans)
      .innerJoin(traces, eq(traces.id, spans.traceId))
      .where(eq(traces.projectId, projectId));

    const total = counts?.total ?? 0;
    const failed = counts?.failed ?? 0;
    return c.json({
      total,
      failed,
      successful: total - failed,
      avgDuration: Math.round(counts?.avgDuration ?? 0),
      inputTokens: tokens?.input ?? 0,
      outputTokens: tokens?.output ?? 0,
    });
  })
  .get("/:id", zValidator("param", z.object({ id: z.string().min(1) })), async (c) => {
    const db = await getDb(c.env.DATABASE_URL);
    const { id } = c.req.valid("param");
    const [row] = await db
      .select({ trace: traces })
      .from(traces)
      .innerJoin(projects, eq(projects.id, traces.projectId))
      .where(and(eq(traces.id, id), eq(projects.userId, c.get("userId"))))
      .limit(1);
    if (!row) return c.json({ error: "not found" }, 404);

    const traceSpans = await db.select().from(spans).where(eq(spans.traceId, id)).orderBy(asc(spans.createdAt));
    return c.json({ trace: row.trace, spans: traceSpans });
  });

export default app;
