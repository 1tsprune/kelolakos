import { Pool, type PoolClient } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __kelolakosPool: Pool | undefined;
}

export function isPostgresEnabled(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;
  return /^postgres(ql)?:\/\//i.test(url);
}

export function getPool(): Pool {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL belum dikonfigurasi");
  }

  if (!global.__kelolakosPool) {
    const isSupabase = url.includes("supabase");
    global.__kelolakosPool = new Pool({
      connectionString: url,
      ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
      max: 10,
    });
  }

  return global.__kelolakosPool;
}

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}