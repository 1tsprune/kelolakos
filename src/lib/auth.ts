import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import type { User } from "./types";
import { initUserSettings, newId, now } from "./store";
import {
  countUsers,
  findUserByGoogleId,
  insertUser,
  markEmailVerified,
  readUsers,
  updateUser,
  updateUserPasswordHash,
} from "./users-store";
import type { GoogleProfile } from "./google-auth";

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

export async function ensureDefaultUser(): Promise<void> {
  if ((await countUsers()) > 0) return;
  const hash = await bcrypt.hash("password123", 10);
  const timestamp = now();
  const user: User = {
    id: "user_budi",
    name: "Pak Budi",
    email: "budi@kosmelati.id",
    passwordHash: hash,
    phone: "081234567890",
    createdAt: timestamp,
    emailVerified: true,
    emailVerifiedAt: timestamp,
    googleId: null,
    authProvider: "email",
  };
  await insertUser(user);
  await initUserSettings(user.id, {
    name: user.name,
    email: user.email,
    phone: user.phone,
  });
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
  await insertUser({
    id: userId,
    name: data.name.trim(),
    email,
    passwordHash: hash,
    phone: data.phone.trim(),
    createdAt: now(),
    emailVerified: false,
    emailVerifiedAt: null,
    googleId: null,
    authProvider: "email",
  });
  await initUserSettings(userId, { ...data, email });
  return { ok: true };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ ok: boolean; user?: User; error?: string; needsVerification?: boolean }> {
  await ensureDefaultUser();
  const users = await readUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) return { ok: false, error: "Email atau password salah" };

  if (user.authProvider === "google" && !user.passwordHash) {
    return { ok: false, error: "Akun ini didaftarkan via Google. Gunakan tombol Masuk dengan Google." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { ok: false, error: "Email atau password salah" };

  if (!user.emailVerified) {
    return {
      ok: false,
      needsVerification: true,
      error: "Email belum diverifikasi. Cek inbox kamu atau kirim ulang link verifikasi.",
    };
  }

  return { ok: true, user };
}

export async function loginOrRegisterGoogle(
  profile: GoogleProfile,
): Promise<{ ok: boolean; user?: User; error?: string }> {
  await ensureDefaultUser();
  if (!profile.email_verified) {
    return { ok: false, error: "Email Google kamu belum terverifikasi." };
  }

  const email = profile.email.toLowerCase();
  let user = await findUserByGoogleId(profile.sub);

  if (!user) {
    const users = await readUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email);
    if (existing) {
      if (existing.authProvider === "email" && existing.passwordHash) {
        return {
          ok: false,
          error: "Email sudah terdaftar dengan password. Masuk dengan email & password.",
        };
      }
      user = {
        ...existing,
        googleId: profile.sub,
        authProvider: "google",
        emailVerified: true,
        emailVerifiedAt: existing.emailVerifiedAt ?? now(),
        name: existing.name || profile.name,
      };
      await updateUser(user);
    } else {
      const userId = newId();
      const timestamp = now();
      user = {
        id: userId,
        name: profile.name,
        email,
        passwordHash: "",
        phone: "",
        createdAt: timestamp,
        emailVerified: true,
        emailVerifiedAt: timestamp,
        googleId: profile.sub,
        authProvider: "google",
      };
      await insertUser(user);
      await initUserSettings(userId, {
        name: profile.name,
        email,
        phone: "",
      });
    }
  }

  return { ok: true, user };
}

export async function verifyUserEmail(email: string): Promise<boolean> {
  return markEmailVerified(email);
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
  const hash = await bcrypt.hash(newPassword, 10);
  const ok = await updateUserPasswordHash(email, hash);
  if (!ok) return { ok: false, error: "User tidak ditemukan" };
  return { ok: true };
}