import { NextResponse } from "next/server";
import { buildGoogleAuthUrl, isGoogleAuthConfigured, setGoogleOAuthState } from "@/lib/google-auth";

export async function GET() {
  if (!isGoogleAuthConfigured()) {
    return NextResponse.json(
      { error: "Google login belum dikonfigurasi (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET)" },
      { status: 503 },
    );
  }
  const state = await setGoogleOAuthState();
  return NextResponse.redirect(buildGoogleAuthUrl(state));
}