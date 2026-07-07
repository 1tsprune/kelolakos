import type { Database } from "./types";

type RateBucket = { count: number; resetAt: number };

const rateLimits = new Map<string, RateBucket>();

export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number,
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = rateLimits.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  if (bucket.count >= maxAttempts) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password minimal 8 karakter";
  if (!/[a-zA-Z]/.test(password)) return "Password harus mengandung huruf";
  if (!/[0-9]/.test(password)) return "Password harus mengandung angka";
  return null;
}

export function userPropertyIds(db: Database, userId: string): Set<string> {
  return new Set(db.properties.filter((p) => p.userId === userId).map((p) => p.id));
}

export function userRoomIds(db: Database, userId: string): Set<string> {
  const pids = userPropertyIds(db, userId);
  return new Set(db.rooms.filter((r) => pids.has(r.propertyId)).map((r) => r.id));
}

export function assertPropertyAccess(db: Database, userId: string, propertyId: string): void {
  const prop = db.properties.find((p) => p.id === propertyId && p.userId === userId);
  if (!prop) throw new Error("Akses properti ditolak");
}

export function assertRoomAccess(db: Database, userId: string, roomId: string): void {
  const room = db.rooms.find((r) => r.id === roomId);
  if (!room) throw new Error("Kamar tidak ditemukan");
  assertPropertyAccess(db, userId, room.propertyId);
}

export function assertTenantAccess(db: Database, userId: string, tenantId: string): void {
  const tenant = db.tenants.find((t) => t.id === tenantId);
  if (!tenant) throw new Error("Penyewa tidak ditemukan");
  assertRoomAccess(db, userId, tenant.roomId);
}

export function assertPaymentAccess(db: Database, userId: string, paymentId: string): void {
  const payment = db.payments.find((p) => p.id === paymentId);
  if (!payment) throw new Error("Pembayaran tidak ditemukan");
  assertRoomAccess(db, userId, payment.roomId);
}

export function assertUtilityAccess(db: Database, userId: string, billId: string): void {
  const bill = db.utilityBills.find((b) => b.id === billId);
  if (!bill) throw new Error("Tagihan utilitas tidak ditemukan");
  assertRoomAccess(db, userId, bill.roomId);
}

export function assertTicketAccess(db: Database, userId: string, ticketId: string): void {
  const ticket = db.maintenanceTickets.find((t) => t.id === ticketId);
  if (!ticket) throw new Error("Tiket tidak ditemukan");
  assertPropertyAccess(db, userId, ticket.propertyId);
}

export const securityHeaders: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-DNS-Prefetch-Control": "on",
};

const CSRF_EXEMPT_PREFIXES = ["/api/xendit/webhook", "/api/cron"];

export function isCsrfExemptPath(pathname: string): boolean {
  return CSRF_EXEMPT_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function verifyRequestOrigin(request: {
  headers: { get(name: string): string | null };
  nextUrl: { host: string };
}): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") ?? request.nextUrl.host;
  const secFetchSite = request.headers.get("sec-fetch-site");

  if (secFetchSite === "same-origin" || secFetchSite === "same-site") {
    return true;
  }

  if (!origin) {
    return process.env.NODE_ENV !== "production";
  }

  try {
    const originHost = new URL(origin).host;
    if (originHost === host) return true;

    const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.APP_URL;
    if (appUrl) {
      const allowedHost = new URL(appUrl).host;
      if (originHost === allowedHost) return true;
    }
  } catch {
    return false;
  }

  return false;
}