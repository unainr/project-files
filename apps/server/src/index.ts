import { Hono } from "hono";
import { cors } from "hono/cors";
import { clerkMiddleware } from "@clerk/hono";
import chat from "./routes/chat";
import project from "./routes/project";
import apiKeys from "./routes/api-keys";
import traces from "./routes/traces";
import ingest from "./routes/ingest";




const app = new Hono<{ Bindings: CloudflareBindings }>()
	.basePath("/api")
	.use("*", async (c, next) => {
		return cors({
			origin: c.env.WEB_URL,
			credentials: true,
		})(c, next);
	})
	.use("*", async (c, next) => {
		return clerkMiddleware({
			publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
			secretKey: c.env.CLERK_SECRET_KEY,
		})(c, next);
	})
  .route("/", ingest) // SDK ingestion: API-key auth, no Clerk
	.route("/chat", chat)
  .route("/projects", project)
  .route("/api-keys", apiKeys)
  .route("/traces", traces);


export default app;
export type AppType = typeof app;
