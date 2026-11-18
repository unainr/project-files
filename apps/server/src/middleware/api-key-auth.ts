import { and, eq, isNull } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
import { projectApiKeys } from "../db/schema";
import { hashApiKey, isApiKeyFormat } from "../lib/key";
import { AppEnv } from "../lib/types";



export const apiKeyAuth = createMiddleware<AppEnv>(async (c, next) => {
  const header = c.req.header("Authorization");
  const key = header?.startsWith("Bearer ") ? header.slice(7).trim() : undefined;
  if (!key || !isApiKeyFormat(key)) return c.json({ error: "unauthorized" }, 401);

  const [row] = await c
    .get("db")
    .select({ projectId: projectApiKeys.projectId })
    .from(projectApiKeys)
    .where(and(eq(projectApiKeys.keyHash, await hashApiKey(key)), isNull(projectApiKeys.revokedAt)))
    .limit(1);
  if (!row) return c.json({ error: "unauthorized" }, 401);

  c.set("projectId", row.projectId); // from the key, never from the payload
  await next();
});