import { promises as fs } from "fs";
import path from "path";
import type { User } from "./types";
import { isPostgresEnabled, getPool } from "./pg";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

function rowToUser(r: Record<string, unknown>): User {
  return {
    id: r.id as string,
    name: r.name as string,
    email: r.email as string,
    passwordHash: r.password_hash as string,
    phone: r.phone as string,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

async function readUsersFromFile(): Promise<User[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(raw) as User[];
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
    `INSERT INTO users (id, name, email, password_hash, phone, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (id) DO UPDATE SET
       name = $2, email = $3, password_hash = $4, phone = $5`,
    [user.id, user.name, user.email, user.passwordHash, user.phone, user.createdAt],
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

export async function countUsers(): Promise<number> {
  if (isPostgresEnabled()) {
    const res = await getPool().query("SELECT COUNT(*)::int AS c FROM users");
    return res.rows[0].c as number;
  }
  return (await readUsersFromFile()).length;
}