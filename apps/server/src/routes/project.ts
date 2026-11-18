import { Hono } from "hono";
import z from "zod";
import { getDb } from "../db";
import { projectApiKeys, projects } from "../db/schema";
import { desc, eq } from "drizzle-orm";
import { requireUser } from "../middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { generateApiKey } from "../lib/key";
import { getOwnedProject } from "../lib/ownership";

const createSchema = z.object({ name: z.string().trim().min(1).max(80) });
const idParam = z.object({ id: z.string().min(1) });

const app = new Hono<{ Bindings: CloudflareBindings }>()
	.use(requireUser)
	.get("/", async (c) => {
		const db = await getDb(c.env.DATABASE_URL);

		const rows = await db
			.select()
			.from(projects)
			.where(eq(projects.userId, c.get("userId")))
			.orderBy(desc(projects.createdAt));
		return c.json(rows);
	})
	.post("/", zValidator("json", createSchema), async (c) => {
		const db = await getDb(c.env.DATABASE_URL);

		const [project] = await db
			.insert(projects)
			.values({ userId: c.get("userId"), name: c.req.valid("json").name })
			.returning();
		if (!project) return c.json({ error: "failed to create project" }, 500);

		const { key, keyHash, keyPrefix } = await generateApiKey();
		await db
			.insert(projectApiKeys)
			.values({ projectId: project.id, name: "Default", keyHash, keyPrefix });

		return c.json({ project, apiKey: key }, 201); // the only time the raw key is returned
	})
	.get("/:id", zValidator("param", idParam), async (c) => {
		const db = await getDb(c.env.DATABASE_URL);

		const project = await getOwnedProject(
			db,
			c.get("userId"),
			c.req.valid("param").id,
		);
		if (!project) return c.json({ error: "not found" }, 404);
		return c.json(project);
	})
	.delete("/:id", zValidator("param", idParam), async (c) => {
		const db = await getDb(c.env.DATABASE_URL);
		const project = await getOwnedProject(
			db,
			c.get("userId"),
			c.req.valid("param").id,
		);
		if (!project) return c.json({ error: "not found" }, 404);
		await db.delete(projects).where(eq(projects.id, project.id)); // cascades
		return c.json({ success: true });
	});

export default app;
