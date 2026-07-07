import { promises as fs } from "fs";
import path from "path";
import type { User } from "./types";
import { isPostgresEnabled, getPool } from "./pg";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

export function normalizeUser(raw: Partial<User> & Pick<User, "id" | "name" | "email" | "createdAt">): User {
  const legacyVerified = raw.emailVerified ?? (raw as { email_verified?: boolean }).email_verified;
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    passwordHash: raw.passwordHash ?? "",
    phone: raw.phone ?? "",
    createdAt: raw.createdAt,
    emailVerified: legacyVerified ?? true,
    emailVerifiedAt: raw.emailVerifiedAt ?? (legacyVerified !== false ? raw.createdAt : null),
    googleId: raw.googleId ?? null,
    authProvider: raw.authProvider ?? "email",
  };
}

function rowToUser(r: Record<string, unknown>): User {
  return normalizeUser({
    id: r.id as string,
    name: r.name as string,
    email: r.email as string,
    passwordHash: (r.password_hash as string) ?? "",
    phone: (r.phone as string) ?? "",
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    emailVerified: r.email_verified as boolean | undefined,
    emailVerifiedAt: r.email_verified_at
      ? r.email_verified_at instanceof Date
        ? r.email_verified_at.toISOString()
        : String(r.email_verified_at)
      : null,
    googleId: (r.google_id as string) ?? null,
    authProvider: (r.auth_provider as User["authProvider"]) ?? "email",
  });
}

async function readUsersFromFile(): Promise<User[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    return (JSON.parse(raw) as Partial<User>[]).map((u) =>
      normalizeUser(u as Partial<User> & Pick<User, "id" | "name" | "email" | "createdAt">),
    );
  } catch {
    return [];
  }
}

async function writeUsersToFile(users: User[]): Promise<void> {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function readUsersFromPostgres(): Promise<User[]> {
  const pool = getPool();
  const res = await pool.query("SELECT * FROM users ORDER BY created_at");
  return res.rows.map(rowToUser);
}

async function upsertUserPostgres(user: User): Promise<void> {
  const pool = getPool();
  await pool.query(
    `INSERT INTO users (id, name, email, password_hash, phone, created_at, email_verified, email_verified_at, google_id, auth_provider)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT (id) DO UPDATE SET
       name = $2, email = $3, password_hash = $4, phone = $5,
       email_verified = $7, email_verified_at = $8, google_id = $9, auth_provider = $10`,
    [
      user.id,
      user.name,
      user.email,
      user.passwordHash,
      user.phone,
      user.createdAt,
      user.emailVerified,
      user.emailVerifiedAt,
      user.googleId,
      user.authProvider,
    ],
  );
}

export async function readUsers(): Promise<User[]> {
  if (isPostgresEnabled()) return readUsersFromPostgres();
  return readUsersFromFile();
}

export async function writeUsers(users: User[]): Promise<void> {
  if (isPostgresEnabled()) {
    for (const user of users) {
      await upsertUserPostgres(user);
    }
    return;
  }
  await writeUsersToFile(users);
}

export async function insertUser(user: User): Promise<void> {
  if (isPostgresEnabled()) {
    await upsertUserPostgres(user);
    return;
  }
  const users = await readUsersFromFile();
  users.push(user);
  await writeUsersToFile(users);
}

export async function updateUser(user: User): Promise<void> {
  if (isPostgresEnabled()) {
    await upsertUserPostgres(user);
    return;
  }
  const users = await readUsersFromFile();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx < 0) return;
  users[idx] = user;
  await writeUsersToFile(users);
}

export async function updateUserPasswordHash(email: string, passwordHash: string): Promise<boolean> {
  if (isPostgresEnabled()) {
    const res = await getPool().query(
      "UPDATE users SET password_hash = $1 WHERE lower(email) = lower($2)",
      [passwordHash, email.trim()],
    );
    return (res.rowCount ?? 0) > 0;
  }
  const users = await readUsersFromFile();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (idx < 0) return false;
  users[idx].passwordHash = passwordHash;
  await writeUsersToFile(users);
  return true;
}

export async function markEmailVerified(email: string): Promise<boolean> {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (idx < 0) return false;
  const timestamp = new Date().toISOString();
  users[idx] = {
    ...users[idx],
    emailVerified: true,
    emailVerifiedAt: timestamp,
  };
  await updateUser(users[idx]);
  return true;
}

export async function findUserByGoogleId(googleId: string): Promise<User | null> {
  const users = await readUsers();
  return users.find((u) => u.googleId === googleId) ?? null;
}

export async function countUsers(): Promise<number> {
  if (isPostgresEnabled()) {
    const res = await getPool().query("SELECT COUNT(*)::int AS c FROM users");
    return res.rows[0].c as number;
  }
  return (await readUsersFromFile()).length;
}