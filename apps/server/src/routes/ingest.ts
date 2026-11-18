import { Hono } from "hono";
import { apiKeyAuth } from "../middleware/api-key-auth";
import { bodyLimit } from "hono/body-limit";
import { zValidator } from "@hono/zod-validator";
import { tracePayloadSchema } from "../schemas/trace";
import { ingestTrace } from "../services/trace-ingest";

const app = new Hono<{ Bindings: CloudflareBindings }>()
.post(
  "/v1/traces",
  apiKeyAuth,
  bodyLimit({ maxSize: 512 * 1024, onError: (c) => c.json({ error: "payload too large" }, 413) }),
  zValidator("json", tracePayloadSchema),
  async (c) => {
    const { id } = await ingestTrace(c.get("db"), c.get("projectId"), c.req.valid("json"));
    return c.json({ id }, 201);
  },
);
export default app;
