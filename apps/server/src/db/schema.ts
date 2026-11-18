import { pgTable, pgEnum, text, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { newId } from "../lib/id";

export const traceStatus = pgEnum("trace_status", ["success", "error"]);

const createdAt = () => timestamp("created_at", { withTimezone: true }).defaultNow().notNull();

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey().$defaultFn(newId.project),
    userId: text("user_id").notNull(), // Clerk user id
    name: text("name").notNull(),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("projects_user_idx").on(t.userId)],
);

export const projectApiKeys = pgTable(
  "project_api_keys",
  {
    id: text("id").primaryKey().$defaultFn(newId.apiKey),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    keyHash: text("key_hash").notNull().unique(),
    keyPrefix: text("key_prefix").notNull(),
    createdAt: createdAt(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (t) => [index("api_keys_project_idx").on(t.projectId)],
);

export const traces = pgTable(
  "traces",
  {
    id: text("id").primaryKey().$defaultFn(newId.trace),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    status: traceStatus("status").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    duration: integer("duration").notNull(), // ms
    createdAt: createdAt(),
  },
  (t) => [index("traces_project_started_idx").on(t.projectId, t.startedAt)],
);

export const spans = pgTable(
  "spans",
  {
    id: text("id").primaryKey().$defaultFn(newId.span),
    traceId: text("trace_id")
      .notNull()
      .references(() => traces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: text("type").notNull().default("llm"),
    status: traceStatus("status").notNull(),
    model: text("model"),
    input: text("input"),
    output: text("output"),
    inputTokens: integer("input_tokens"), // null = unknown (not 0)
    outputTokens: integer("output_tokens"),
    duration: integer("duration").notNull(),
    error: text("error"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: createdAt(),
  },
  (t) => [index("spans_trace_idx").on(t.traceId)],
);