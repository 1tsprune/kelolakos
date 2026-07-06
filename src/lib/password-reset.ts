import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { isPostgresEnabled, getPool } from "./pg";

const RESET_FILE = path.join(process.cwd(), "data", "password-resets.json");

type ResetEntry = {
  email: string;
  token: string;
  expiresAt: string;
};

type ResetStore = { entries: ResetEntry[] };

async function readStoreFile(): Promise<ResetStore> {
  try {
    const raw = await fs.readFile(RESET_FILE, "utf-8");
    return JSON.parse(raw) as ResetStore;
  } catch {
    return { entries: [] };
  }
}

async function writeStoreFile(store: ResetStore): Promise<void> {
  await fs.mkdir(path.dirname(RESET_FILE), { recursive: true });
  await fs.writeFile(RESET_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export function createResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function saveResetToken(email: string, token: string): Promise<void> {
  const normalized = email.toLowerCase();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  if (isPostgresEnabled()) {
    const pool = getPool();
    await pool.query("DELETE FROM password_reset_tokens WHERE lower(email) = lower($1)", [normalized]);
    await pool.query(
      "INSERT INTO password_reset_tokens (email, token, expires_at) VALUES ($1, $2, $3)",
      [normalized, token, expiresAt],
    );
    return;
  }

  const store = await readStoreFile();
  store.entries = store.entries.filter((e) => e.email !== normalized);
  store.entries.push({ email: normalized, token, expiresAt });
  await writeStoreFile(store);
}

export async function consumeResetToken(
  token: string,
): Promise<{ ok: boolean; email?: string; error?: string }> {
  if (isPostgresEnabled()) {
    const pool = getPool();
    const res = await pool.query(
      "SELECT email, expires_at FROM password_reset_tokens WHERE token = $1",
      [token],
    );
    const row = res.rows[0];
    if (!row) return { ok: false, error: "Token tidak valid atau sudah dipakai" };
    if (new Date(row.expires_at) < new Date()) {
      await pool.query("DELETE FROM password_reset_tokens WHERE token = $1", [token]);
      return { ok: false, error: "Token sudah kedaluwarsa" };
    }
    await pool.query("DELETE FROM password_reset_tokens WHERE token = $1", [token]);
    return { ok: true, email: row.email as string };
  }

  const store = await readStoreFile();
  const entry = store.entries.find((e) => e.token === token);
  if (!entry) return { ok: false, error: "Token tidak valid atau sudah dipakai" };
  if (new Date(entry.expiresAt) < new Date()) {
    store.entries = store.entries.filter((e) => e.token !== token);
    await writeStoreFile(store);
    return { ok: false, error: "Token sudah kedaluwarsa" };
  }
  store.entries = store.entries.filter((e) => e.token !== token);
  await writeStoreFile(store);
  return { ok: true, email: entry.email };
}