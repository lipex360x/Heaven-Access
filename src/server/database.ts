import "server-only";
import { attachDatabasePool } from "@vercel/functions";
import { Pool, type PoolClient } from "pg";

const globalDatabase = globalThis as typeof globalThis & { databasePool?: Pool };

export function getDatabase(): Pool {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  if (!globalDatabase.databasePool) {
    globalDatabase.databasePool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 5000,
      statement_timeout: 5000,
    });
    // Do not log database errors containing connection details or query values.
    globalDatabase.databasePool.on("error", () => console.error("Database connection failed"));
    if (process.env.VERCEL === "1") attachDatabasePool(globalDatabase.databasePool);
  }
  return globalDatabase.databasePool;
}

export async function transaction<T>(action: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getDatabase().connect();
  try {
    await client.query("BEGIN");
    const value = await action(client);
    await client.query("COMMIT");
    return value;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
