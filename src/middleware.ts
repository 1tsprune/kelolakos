import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromCookie } from "@/lib/auth-session";
import { securityHeaders } from "@/lib/security";

const PUBLIC_PREFIXES = [
  "/masuk",
  "/daftar",
  "/lupa-password",
  "/reset-password",
  "/kebijakan-privasi",
  "/syarat-ketentuan",
  "/portal",
  "/bayar",
  "/api/auth",
  "/api/midtrans/webhook",
  "/uploads",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

function withSecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") return withSecurityHeaders(NextResponse.next());
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return withSecurityHeaders(NextResponse.next());
  }

  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) {
    const login = new URL("/masuk", request.url);
    login.searchParams.set("redirect", pathname);
    return withSecurityHeaders(NextResponse.redirect(login));
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};