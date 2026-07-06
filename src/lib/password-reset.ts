import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const RESET_FILE = path.join(process.cwd(), "data", "password-resets.json");

type ResetEntry = {
  email: string;
  token: string;
  expiresAt: string;
};

type ResetStore = { entries: ResetEntry[] };

async function readStore(): Promise<ResetStore> {
  try {
    const raw = await fs.readFile(RESET_FILE, "utf-8");
    return JSON.parse(raw) as ResetStore;
  } catch {
    return { entries: [] };
  }
}

async function writeStore(store: ResetStore): Promise<void> {
  await fs.mkdir(path.dirname(RESET_FILE), { recursive: true });
  await fs.writeFile(RESET_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export function createResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function saveResetToken(email: string, token: string): Promise<void> {
  const store = await readStore();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  store.entries = store.entries.filter((e) => e.email !== email.toLowerCase());
  store.entries.push({ email: email.toLowerCase(), token, expiresAt });
  await writeStore(store);
}

export async function consumeResetToken(
  token: string,
): Promise<{ ok: boolean; email?: string; error?: string }> {
  const store = await readStore();
  const entry = store.entries.find((e) => e.token === token);
  if (!entry) return { ok: false, error: "Token tidak valid atau sudah dipakai" };
  if (new Date(entry.expiresAt) < new Date()) {
    store.entries = store.entries.filter((e) => e.token !== token);
    await writeStore(store);
    return { ok: false, error: "Token sudah kedaluwarsa" };
  }
  store.entries = store.entries.filter((e) => e.token !== token);
  await writeStore(store);
  return { ok: true, email: entry.email };
}