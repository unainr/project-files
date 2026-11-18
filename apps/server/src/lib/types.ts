import { Db } from "../db";


export type Bindings = {
  DATABASE_URL: string;
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  WEB_URL?: string;
};

export type AppEnv = {
  Bindings: Bindings;
  Variables: { db: Db; userId: string; projectId: string };
};