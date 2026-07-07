import { NextRequest, NextResponse } from "next/server";
import {
  exchangeGoogleCode,
  isGoogleAuthConfigured,
  verifyGoogleOAuthState,
} from "@/lib/google-auth";
import { createSession, loginOrRegisterGoogle } from "@/lib/auth";
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  if (!isGoogleAuthConfigured()) {
    return NextResponse.redirect(new URL("/masuk?error=google_config", origin));
  }

  const { searchParams } = request.nextUrl;
  const error = searchParams.get("error");
  if (error) {
    return NextResponse.redirect(new URL("/masuk?error=google_denied", origin));
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  if (!code || !(await verifyGoogleOAuthState(state))) {
    return NextResponse.redirect(new URL("/masuk?error=google_state", origin));
  }

  try {
    const profile = await exchangeGoogleCode(code);
    const result = await loginOrRegisterGoogle(profile);
    if (!result.ok || !result.user) {
      const msg = encodeURIComponent(result.error ?? "Login Google gagal");
      return NextResponse.redirect(new URL(`/masuk?error=${msg}`, origin));
    }
    await createSession(result.user);
    return NextResponse.redirect(new URL("/dashboard", origin));
  } catch {
    return NextResponse.redirect(new URL("/masuk?error=google_failed", origin));
  }
}