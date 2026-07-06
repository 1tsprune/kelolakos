import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { promises as fs } from "fs";
import path from "path";
import type { User } from "./types";
import { initUserSettings, newId, now } from "./store";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");
function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET wajib di-set di production");
  }
  return new TextEncoder().encode(
    secret ?? "koskit-dev-secret-change-in-production-32chars!",
  );
}
const COOKIE = "koskit_session";

type SessionPayload = { userId: string; email: string; name: string };

async function readUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function ensureDefaultUser(): Promise<void> {
  const users = await readUsers();
  if (users.length > 0) return;
  const hash = await bcrypt.hash("password123", 10);
  await writeUsers([
    {
      id: "user_budi",
      name: "Pak Budi",
      email: "budi@kosmelati.id",
      passwordHash: hash,
      phone: "081234567890",
      createdAt: now(),
    },
  ]);
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
}): Promise<{ ok: boolean; error?: string }> {
  await ensureDefaultUser();
  const users = await readUsers();
  const email = data.email?.trim().toLowerCase();
  if (!email || !data.name?.trim() || !data.phone?.trim()) {
    return { ok: false, error: "Semua field wajib diisi" };
  }
  if (users.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, error: "Email sudah terdaftar" };
  }
  const hash = await bcrypt.hash(data.password, 10);
  const userId = newId();
  users.push({
    id: userId,
    name: data.name,
    email,
    passwordHash: hash,
    phone: data.phone,
    createdAt: now(),
  });
  await writeUsers(users);
  await initUserSettings(userId, data);
  return { ok: true };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ ok: boolean; user?: User; error?: string }> {
  await ensureDefaultUser();
  const users = await readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return { ok: false, error: "Email atau password salah" };
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { ok: false, error: "Email atau password salah" };
  return { ok: true, user };
}

export async function createSession(user: User): Promise<void> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
  } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getAuthSecret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  const users = await readUsers();
  return users.find((u) => u.id === session.userId) ?? null;
}

export async function getSessionUserId(): Promise<string> {
  const session = await getSession();
  if (!session?.userId) throw new Error("Unauthorized");
  return session.userId;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  await ensureDefaultUser();
  const users = await readUsers();
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) ?? null;
}

export async function updateUserPassword(
  email: string,
  newPassword: string,
): Promise<{ ok: boolean; error?: string }> {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (idx < 0) return { ok: false, error: "User tidak ditemukan" };
  users[idx].passwordHash = await bcrypt.hash(newPassword, 10);
  await writeUsers(users);
  return { ok: true };
}