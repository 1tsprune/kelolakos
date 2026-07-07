/**
 * Migrasi data JSON → Supabase PostgreSQL
 *
 * Prasyarat:
 * 1. Jalankan supabase/schema.sql di SQL Editor Supabase
 * 2. Set DATABASE_URL di .env (Connection string → URI, mode Transaction)
 *
 * Jalankan: npm run db:migrate
 */
import { readFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import type { Database, User } from "../src/lib/types";
import { migrateSettings } from "../src/lib/settings";

async function main() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL belum di-set di .env");
    process.exit(1);
  }

  const dataDir = path.join(process.cwd(), "data");
  const koskitPath = path.join(dataDir, "koskit.json");
  const usersPath = path.join(dataDir, "users.json");

  const raw = JSON.parse(await readFile(koskitPath, "utf-8")) as Partial<Database>;
  const db: Database = {
    properties: raw.properties ?? [],
    rooms: raw.rooms ?? [],
    tenants: raw.tenants ?? [],
    payments: raw.payments ?? [],
    utilityBills: raw.utilityBills ?? [],
    maintenanceTickets: raw.maintenanceTickets ?? [],
    expenses: raw.expenses ?? [],
    activities: raw.activities ?? [],
    whatsappLogs: raw.whatsappLogs ?? [],
    inventoryItems: raw.inventoryItems ?? [],
    waitlistEntries: raw.waitlistEntries ?? [],
    settings: migrateSettings(raw.settings),
  };

  const { normalizeUser } = await import("../src/lib/users-store");
  let users: User[] = [];
  try {
    const raw = JSON.parse(await readFile(usersPath, "utf-8")) as Partial<User>[];
    users = raw.map((u) =>
      normalizeUser(u as Partial<User> & Pick<User, "id" | "name" | "email" | "createdAt">),
    );
  } catch {
    const hash = await bcrypt.hash("password123", 10);
    const createdAt = new Date().toISOString();
    users = [{
      id: "user_budi",
      name: "Pak Budi",
      email: "budi@kosmelati.id",
      passwordHash: hash,
      phone: "081234567890",
      createdAt,
      emailVerified: true,
      emailVerifiedAt: createdAt,
      googleId: null,
      authProvider: "email",
    }];
  }

  const { getPool } = await import("../src/lib/pg");
  const { writeDbToPostgres } = await import("../src/lib/postgres-store");
  const pool = getPool();

  console.log("Menyimpan users...");
  for (const user of users) {
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, phone, created_at, email_verified, email_verified_at, google_id, auth_provider)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO UPDATE SET
         name=$2, email=$3, password_hash=$4, phone=$5,
         email_verified=$7, email_verified_at=$8, google_id=$9, auth_provider=$10`,
      [
        user.id,
        user.name,
        user.email,
        user.passwordHash,
        user.phone,
        user.createdAt,
        user.emailVerified,
        user.emailVerifiedAt,
        user.googleId,
        user.authProvider,
      ],
    );
  }

  console.log("Menyimpan data kos...");
  await writeDbToPostgres(db);

  console.log("Selesai!");
  console.log(`  - ${users.length} users`);
  console.log(`  - ${db.properties.length} properti`);
  console.log(`  - ${db.rooms.length} kamar`);
  console.log(`  - ${db.tenants.length} penyewa`);
  console.log(`  - ${db.payments.length} pembayaran`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});