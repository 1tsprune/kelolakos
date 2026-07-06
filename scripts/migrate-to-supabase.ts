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

  let users: User[] = [];
  try {
    users = JSON.parse(await readFile(usersPath, "utf-8")) as User[];
  } catch {
    const hash = await bcrypt.hash("password123", 10);
    users = [{
      id: "user_budi",
      name: "Pak Budi",
      email: "budi@kosmelati.id",
      passwordHash: hash,
      phone: "081234567890",
      createdAt: new Date().toISOString(),
    }];
  }

  const { getPool } = await import("../src/lib/pg");
  const { writeDbToPostgres } = await import("../src/lib/postgres-store");
  const pool = getPool();

  console.log("Menyimpan users...");
  for (const user of users) {
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, phone, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET name=$2, email=$3, password_hash=$4, phone=$5`,
      [user.id, user.name, user.email, user.passwordHash, user.phone, user.createdAt],
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