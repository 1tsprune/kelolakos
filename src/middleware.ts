import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromCookie } from "@/lib/auth-session";
import { isCsrfExemptPath, securityHeaders, verifyRequestOrigin } from "@/lib/security";

const PUBLIC_PREFIXES = [
  "/masuk",
  "/daftar",
  "/verifikasi-email",
  "/lupa-password",
  "/reset-password",
  "/kebijakan-privasi",
  "/syarat-ketentuan",
  "/aplikasi-manajemen-kos",
  "/portal",
  "/bayar",
  "/api/auth",
  "/api/xendit/webhook",
  "/api/cron",
  "/uploads",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

function withSecurityHeaders(response: NextResponse, isProduction: boolean): NextResponse {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  if (isProduction) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProduction = process.env.NODE_ENV === "production";

  if (
    request.method !== "GET" &&
    request.method !== "HEAD" &&
    pathname.startsWith("/api/") &&
    !isCsrfExemptPath(pathname) &&
    !verifyRequestOrigin(request)
  ) {
    return withSecurityHeaders(
      NextResponse.json({ error: "Permintaan ditolak" }, { status: 403 }),
      isProduction,
    );
  }

  if (pathname === "/") {
    const res = withSecurityHeaders(NextResponse.next(), isProduction);
    res.headers.set("x-pathname", pathname);
    return res;
  }
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    const res = withSecurityHeaders(NextResponse.next(), isProduction);
    res.headers.set("x-pathname", pathname);
    return res;
  }

  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) {
    const login = new URL("/masuk", request.url);
    login.searchParams.set("redirect", pathname);
    const redirectRes = withSecurityHeaders(NextResponse.redirect(login), isProduction);
    redirectRes.headers.set("x-pathname", pathname);
    return redirectRes;
  }

  const response = withSecurityHeaders(NextResponse.next(), isProduction);
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};