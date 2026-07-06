import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "koskit-dev-secret-change-in-production-32chars!",
);
const COOKIE = "koskit_session";

export type SessionPayload = { userId: string; email: string; name: string };

export async function getSessionFromCookie(
  cookieHeader: string | null,
): Promise<SessionPayload | null> {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE}=([^;]+)`));
  if (!match) return null;
  try {
    const { payload } = await jwtVerify(match[1], SECRET);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}