"use server";

import { logActivity, readDb, writeDb } from "./store";
import type { Database } from "./types";

export async function addActivity(
  type: Database["activities"][0]["type"],
  message: string,
  entityType: string,
  entityId: string,
) {
  const db = await readDb();
  await logActivity(db, type, message, entityType, entityId);
  await writeDb(db);
}