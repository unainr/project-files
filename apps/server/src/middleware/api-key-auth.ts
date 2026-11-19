import { and, eq, isNull } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
import { getDb, type Db } from "../db";
import { projectApiKeys } from "../db/schema";
import { hashApiKey, isApiKeyFormat } from "../lib/key"; // your file is key.ts

export type IngestEnv = {
  Bindings: CloudflareBindings;
  Variables: { db: Db; projectId: string };
};

export const apiKeyAuth = createMiddleware<IngestEnv>(async (c, next) => {
  const header = c.req.header("Authorization");
  const key = header?.startsWith("Bearer ") ? header.slice(7).trim() : undefined;
  if (!key || !isApiKeyFormat(key)) return c.json({ error: "unauthorized" }, 401);

  const db = getDb(c.env.DATABASE_URL); // same call your other routes use

  const [row] = await db
    .select({ projectId: projectApiKeys.projectId })
    .from(projectApiKeys)
    .where(and(eq(projectApiKeys.keyHash, await hashApiKey(key)), isNull(projectApiKeys.revokedAt)))
    .limit(1);
  if (!row) return c.json({ error: "unauthorized" }, 401);

  c.set("db", db); // ingest.ts reads this with c.get("db")
  c.set("projectId", row.projectId);
  await next();
});