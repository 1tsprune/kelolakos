import type { PoolClient } from "pg";
import { migrateSettings } from "./settings";
import { withTransaction } from "./pg";
import {
  activityToRow,
  expenseToRow,
  inventoryToRow,
  paymentToRow,
  propertyToRow,
  roomToRow,
  rowToActivity,
  rowToExpense,
  rowToInventory,
  rowToPayment,
  rowToProperty,
  rowToRoom,
  rowToTenant,
  rowToTicket,
  rowToUtility,
  rowToWaitlist,
  rowToWhatsAppLog,
  settingsFromRows,
  tenantToRow,
  ticketToRow,
  utilityToRow,
  waitlistToRow,
  whatsappLogToRow,
} from "./postgres-mappers";
import type { Database, Settings } from "./types";

async function upsertMany(
  client: PoolClient,
  sql: string,
  rows: unknown[][],
): Promise<void> {
  for (const params of rows) {
    await client.query(sql, params);
  }
}

async function pruneIds(client: PoolClient, table: string, ids: string[]): Promise<void> {
  if (ids.length === 0) {
    await client.query(`DELETE FROM ${table}`);
    return;
  }
  await client.query(`DELETE FROM ${table} WHERE NOT (id = ANY($1::text[]))`, [ids]);
}

export async function readDbFromPostgres(): Promise<Database> {
  const { getPool } = await import("./pg");
  const pool = getPool();

  const [
    propertiesRes,
    roomsRes,
    tenantsRes,
    paymentsRes,
    utilitiesRes,
    ticketsRes,
    expensesRes,
    inventoryRes,
    waitlistRes,
    activitiesRes,
    whatsappRes,
    settingsRes,
  ] = await Promise.all([
    pool.query("SELECT * FROM properties ORDER BY created_at"),
    pool.query("SELECT * FROM rooms ORDER BY created_at"),
    pool.query("SELECT * FROM tenants ORDER BY created_at"),
    pool.query("SELECT * FROM payments ORDER BY created_at"),
    pool.query("SELECT * FROM utility_bills ORDER BY created_at"),
    pool.query("SELECT * FROM maintenance_tickets ORDER BY created_at"),
    pool.query("SELECT * FROM expenses ORDER BY date DESC"),
    pool.query("SELECT * FROM inventory_items ORDER BY created_at"),
    pool.query("SELECT * FROM waitlist_entries ORDER BY created_at"),
    pool.query("SELECT * FROM activities ORDER BY created_at DESC LIMIT 100"),
    pool.query("SELECT * FROM whatsapp_logs ORDER BY created_at DESC LIMIT 200"),
    pool.query("SELECT user_id, settings FROM user_settings"),
  ]);

  const settingsRows = settingsRes.rows.map((r) => ({
    user_id: r.user_id as string,
    settings: r.settings as Settings,
  }));

  return {
    properties: propertiesRes.rows.map(rowToProperty),
    rooms: roomsRes.rows.map(rowToRoom),
    tenants: tenantsRes.rows.map(rowToTenant),
    payments: paymentsRes.rows.map(rowToPayment),
    utilityBills: utilitiesRes.rows.map(rowToUtility),
    maintenanceTickets: ticketsRes.rows.map(rowToTicket),
    expenses: expensesRes.rows.map(rowToExpense),
    inventoryItems: inventoryRes.rows.map(rowToInventory),
    waitlistEntries: waitlistRes.rows.map(rowToWaitlist),
    activities: activitiesRes.rows.map(rowToActivity),
    whatsappLogs: whatsappRes.rows.map(rowToWhatsAppLog),
    settings: migrateSettings(settingsFromRows(settingsRows)),
  };
}

export async function writeDbToPostgres(db: Database): Promise<void> {
  await withTransaction(async (client) => {
    await upsertMany(
      client,
      `INSERT INTO properties (id, user_id, name, address, city, owner_name, owner_phone, notes, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO UPDATE SET
         user_id=$2, name=$3, address=$4, city=$5, owner_name=$6, owner_phone=$7, notes=$8, updated_at=$10`,
      db.properties.map(propertyToRow),
    );

    await upsertMany(
      client,
      `INSERT INTO rooms (id, property_id, number, floor, monthly_rent, status, electricity_type, facilities, photo_url, notes, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12)
       ON CONFLICT (id) DO UPDATE SET
         property_id=$2, number=$3, floor=$4, monthly_rent=$5, status=$6, electricity_type=$7,
         facilities=$8::jsonb, photo_url=$9, notes=$10, updated_at=$12`,
      db.rooms.map(roomToRow),
    );

    await upsertMany(
      client,
      `INSERT INTO tenants (id, room_id, name, phone, portal_token, check_in, is_active, data, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10)
       ON CONFLICT (id) DO UPDATE SET
         room_id=$2, name=$3, phone=$4, portal_token=$5, check_in=$6, is_active=$7, data=$8::jsonb, updated_at=$10`,
      db.tenants.map(tenantToRow),
    );

    await upsertMany(
      client,
      `INSERT INTO payments (id, tenant_id, room_id, period_month, period_year, amount, status, due_date, data, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11)
       ON CONFLICT (id) DO UPDATE SET
         tenant_id=$2, room_id=$3, period_month=$4, period_year=$5, amount=$6, status=$7,
         due_date=$8, data=$9::jsonb, updated_at=$11`,
      db.payments.map(paymentToRow),
    );

    await upsertMany(
      client,
      `INSERT INTO utility_bills (id, room_id, tenant_id, type, period_month, period_year, meter_start, meter_end, rate_per_unit, amount, status, paid_at, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (id) DO UPDATE SET
         room_id=$2, tenant_id=$3, type=$4, period_month=$5, period_year=$6, meter_start=$7, meter_end=$8,
         rate_per_unit=$9, amount=$10, status=$11, paid_at=$12, updated_at=$14`,
      db.utilityBills.map(utilityToRow),
    );

    await upsertMany(
      client,
      `INSERT INTO maintenance_tickets (id, property_id, room_id, title, description, priority, status, reported_by, assigned_to, cost, resolved_at, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (id) DO UPDATE SET
         property_id=$2, room_id=$3, title=$4, description=$5, priority=$6, status=$7,
         reported_by=$8, assigned_to=$9, cost=$10, resolved_at=$11, updated_at=$13`,
      db.maintenanceTickets.map(ticketToRow),
    );

    await upsertMany(
      client,
      `INSERT INTO expenses (id, property_id, category, description, amount, date, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (id) DO UPDATE SET property_id=$2, category=$3, description=$4, amount=$5, date=$6`,
      db.expenses.map(expenseToRow),
    );

    await upsertMany(
      client,
      `INSERT INTO inventory_items (id, room_id, name, condition, quantity, value, notes, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO UPDATE SET
         room_id=$2, name=$3, condition=$4, quantity=$5, value=$6, notes=$7, updated_at=$9`,
      db.inventoryItems.map(inventoryToRow),
    );

    await upsertMany(
      client,
      `INSERT INTO waitlist_entries (id, property_id, name, phone, budget, preferred_room, move_in_date, status, notes, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (id) DO UPDATE SET
         property_id=$2, name=$3, phone=$4, budget=$5, preferred_room=$6, move_in_date=$7, status=$8, notes=$9, updated_at=$11`,
      db.waitlistEntries.map(waitlistToRow),
    );

    await upsertMany(
      client,
      `INSERT INTO activities (id, type, message, entity_type, entity_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO UPDATE SET type=$2, message=$3, entity_type=$4, entity_id=$5`,
      db.activities.map(activityToRow),
    );

    await upsertMany(
      client,
      `INSERT INTO whatsapp_logs (id, phone, message, status, tenant_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO UPDATE SET phone=$2, message=$3, status=$4, tenant_id=$5`,
      db.whatsappLogs.map(whatsappLogToRow),
    );

    for (const [userId, settings] of Object.entries(db.settings)) {
      await client.query(
        `INSERT INTO user_settings (user_id, settings, updated_at)
         VALUES ($1, $2::jsonb, now())
         ON CONFLICT (user_id) DO UPDATE SET settings = $2::jsonb, updated_at = now()`,
        [userId, JSON.stringify(settings)],
      );
    }

    await pruneIds(client, "whatsapp_logs", db.whatsappLogs.map((l) => l.id));
    await pruneIds(client, "activities", db.activities.map((a) => a.id));
    await pruneIds(client, "waitlist_entries", db.waitlistEntries.map((w) => w.id));
    await pruneIds(client, "inventory_items", db.inventoryItems.map((i) => i.id));
    await pruneIds(client, "expenses", db.expenses.map((e) => e.id));
    await pruneIds(client, "maintenance_tickets", db.maintenanceTickets.map((t) => t.id));
    await pruneIds(client, "utility_bills", db.utilityBills.map((u) => u.id));
    await pruneIds(client, "payments", db.payments.map((p) => p.id));
    await pruneIds(client, "tenants", db.tenants.map((t) => t.id));
    await pruneIds(client, "rooms", db.rooms.map((r) => r.id));
    await pruneIds(client, "properties", db.properties.map((p) => p.id));
  });
}