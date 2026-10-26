import "server-only";
import { SCHEMA_SQL } from "./schema";

/**
 * Database access for the hosting system.
 *
 * Production uses PostgreSQL through DATABASE_URL (for example Neon from the
 * Vercel Marketplace, or Supabase). Without DATABASE_URL, development and
 * tests use PGlite, an in-process Postgres, so everything runs locally with no
 * set-up. Production without DATABASE_URL reports "not configured" and the
 * account pages show a friendly "coming soon" message instead of failing.
 *
 * All queries go through `query(text, params)` with $1-style placeholders, so
 * the same SQL runs on both.
 */

type Row = Record<string, unknown>;
type Runner = { query<T extends Row>(text: string, params?: unknown[]): Promise<T[]> };

let runner: Promise<Runner> | null = null;

/** Vercel's Neon and Postgres integrations set DATABASE_URL, POSTGRES_URL or both. */
function databaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

export function isDatabaseConfigured() {
  return Boolean(databaseUrl()) || process.env.NODE_ENV !== "production";
}

async function connect(): Promise<Runner> {
  const url = databaseUrl();
  if (url) {
    const { default: postgres } = await import("postgres");
    const sql = postgres(url, { max: 5, idle_timeout: 20, prepare: false, onnotice: () => {} });
    const r: Runner = {
      async query<T extends Row>(text: string, params: unknown[] = []) {
        return (await sql.unsafe(text, params as never[])) as unknown as T[];
      },
    };
    await sql.unsafe(SCHEMA_SQL);
    return r;
  }
  if (process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is not set");
  const { PGlite } = await import("@electric-sql/pglite");
  // HOSTING_DEV_DB_DIR keeps data between dev-server restarts; otherwise in memory.
  const db = new PGlite(process.env.HOSTING_DEV_DB_DIR || undefined);
  await db.exec(SCHEMA_SQL);
  return {
    async query<T extends Row>(text: string, params: unknown[] = []) {
      return (await db.query<T>(text, params)).rows;
    },
  };
}

export async function query<T extends Row = Row>(text: string, params: unknown[] = []): Promise<T[]> {
  if (!runner) {
    runner = connect();
    runner.catch(() => {
      runner = null;
    });
  }
  return (await runner).query<T>(text, params);
}

export async function queryOne<T extends Row = Row>(text: string, params: unknown[] = []): Promise<T | null> {
  return (await query<T>(text, params))[0] ?? null;
}
