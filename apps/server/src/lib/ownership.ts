import { and, eq } from "drizzle-orm";
import type { Db } from "../db";
import { projects } from "../db/schema";

export async function getOwnedProject(db: Db, userId: string, projectId: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .limit(1);
  return project;
}