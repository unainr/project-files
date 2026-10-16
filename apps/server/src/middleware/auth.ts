// apps/api/src/middleware/auth.ts
import { getAuth } from "@clerk/hono"
import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"

export const requireUser = createMiddleware<{
  Variables: { userId: string }
}>(async (c, next) => {
  const auth = getAuth(c)
  if (!auth?.userId) throw new HTTPException(401, { message: "Please sign in to continue" })
  c.set("userId", auth.userId)
  await next()
})

export const requireAuth = createMiddleware<{
  Variables: { userId: string; orgId?: string }
}>(async (c, next) => {
  const auth = getAuth(c)
  if (!auth?.userId) throw new HTTPException(401, { message: "Unauthorized" })
  if (!auth.orgId) throw new HTTPException(401, { message: "No organization selected" })
  c.set("userId", auth.userId)
  c.set("orgId", auth.orgId)
  await next()
})