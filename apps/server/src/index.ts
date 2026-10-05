import { Hono } from "hono";
import { cors } from "hono/cors";
import { clerkMiddleware } from "@clerk/hono";
import chat from "./routes/chat";




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

	.route("/chat", chat)



export default app;
export type AppType = typeof app;
