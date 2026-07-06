import { NextResponse } from "next/server";
import { sendBulkReminders } from "@/lib/whatsapp-api";

export async function POST() {
  const result = await sendBulkReminders();
  return NextResponse.json(result);
}