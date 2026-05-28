import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var stallLogPool: Pool | undefined;
}

export function getPool() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.stallLogPool) {
    globalThis.stallLogPool = new Pool({
      connectionString: databaseUrl,
      connectionTimeoutMillis: 8000,
      idleTimeoutMillis: 30000,
      max: 5
    });
  }

  return globalThis.stallLogPool;
}
