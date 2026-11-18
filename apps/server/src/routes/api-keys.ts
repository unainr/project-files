import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { requireUser } from "../middleware/auth";
import { getOwnedProject } from "../lib/ownership";
import z from "zod";
import { getDb } from "../db";
import { projectApiKeys, projects } from "../db/schema";
import { desc, eq, isNull,and } from "drizzle-orm";
import { generateApiKey } from "../lib/key";

const app = new Hono<{ Bindings: CloudflareBindings }>()
 .use(requireUser)
  .get("/", zValidator("query", z.object({ projectId: z.string().min(1) })), async (c) => {
            const db = await getDb(c.env.DATABASE_URL);
    
    const { projectId } = c.req.valid("query");
    if (!(await getOwnedProject(db,c.get("userId"), projectId))) return c.json({ error: "not found" }, 404);

    // explicit columns: keyHash never leaves the server
    const rows = await db
      .select({
        id: projectApiKeys.id,
        name: projectApiKeys.name,
        keyPrefix: projectApiKeys.keyPrefix,
        createdAt: projectApiKeys.createdAt,
        revokedAt: projectApiKeys.revokedAt,
      })
      .from(projectApiKeys)
      .where(eq(projectApiKeys.projectId, projectId))
      .orderBy(desc(projectApiKeys.createdAt));
    return c.json(rows);
  })
  .post(
    "/",
    zValidator("json", z.object({ projectId: z.string().min(1), name: z.string().trim().min(1).max(60) })),
    async (c) => {
        const db = await getDb(c.env.DATABASE_URL);
      const { projectId, name } = c.req.valid("json");
      if (!(await getOwnedProject(db,c.get("userId"), projectId))) return c.json({ error: "not found" }, 404);

      const { key, keyHash, keyPrefix } = await generateApiKey();
      const [row] = await db
        .insert(projectApiKeys)
        .values({ projectId, name, keyHash, keyPrefix })
        .returning({ id: projectApiKeys.id, name: projectApiKeys.name, keyPrefix: projectApiKeys.keyPrefix });
      return c.json({ ...row, apiKey: key }, 201); // shown once
    },
  )
  // "Regenerate" = create a new key, then revoke the old one.
  .delete("/:id", zValidator("param", z.object({ id: z.string().min(1) })), async (c) => {
    const db = await getDb(c.env.DATABASE_URL);
    const { id } = c.req.valid("param");
    const [owned] = await db
      .select({ id: projectApiKeys.id })
      .from(projectApiKeys)
      .innerJoin(projects, eq(projects.id, projectApiKeys.projectId))
      .where(and(eq(projectApiKeys.id, id), eq(projects.userId, c.get("userId")), isNull(projectApiKeys.revokedAt)))
      .limit(1);
    if (!owned) return c.json({ error: "not found" }, 404);

    await db.update(projectApiKeys).set({ revokedAt: new Date() }).where(eq(projectApiKeys.id, id));
    return c.json({ success: true });
  });
export default app;
