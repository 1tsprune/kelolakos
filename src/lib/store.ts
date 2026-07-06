import { promises as fs } from "fs";
import path from "path";
import { createDefaultSettings, migrateSettings, trialEndDateFromNow } from "./settings";
import type { Database, Payment, Property, Room, Tenant } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "koskit.json");

const emptyDb: Database = {
  properties: [],
  rooms: [],
  tenants: [],
  payments: [],
  utilityBills: [],
  maintenanceTickets: [],
  expenses: [],
  activities: [],
  whatsappLogs: [],
  inventoryItems: [],
  waitlistEntries: [],
  settings: { user_budi: createDefaultSettings() },
};

function cuid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
}

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(emptyDb, null, 2), "utf-8");
  }
}

function migrateDb(raw: Partial<Database>): Database {
  return {
    properties: (raw.properties ?? []).map((p) => ({
      ...p,
      userId: p.userId ?? "user_budi",
    })),
    rooms: (raw.rooms ?? []).map((r) => ({
      ...r,
      facilities: r.facilities ?? [],
      photoUrl: r.photoUrl ?? null,
    })),
    tenants: (raw.tenants ?? []).map((t) => ({
      ...t,
      depositAmount: t.depositAmount ?? 500000,
      depositStatus: t.depositStatus ?? "ditahan",
      ktpPhotoUrl: t.ktpPhotoUrl ?? null,
      contractEndDate: t.contractEndDate ?? null,
      portalToken: t.portalToken ?? `${t.id}_portal_${Date.now().toString(36)}`,
    })),
    payments: (raw.payments ?? []).map((p) => ({
      ...p,
      lateFee: p.lateFee ?? 0,
      proofPhotoUrl: p.proofPhotoUrl ?? null,
      midtransOrderId: p.midtransOrderId ?? null,
    })),
    utilityBills: raw.utilityBills ?? [],
    maintenanceTickets: raw.maintenanceTickets ?? [],
    expenses: raw.expenses ?? [],
    activities: raw.activities ?? [],
    whatsappLogs: raw.whatsappLogs ?? [],
    inventoryItems: raw.inventoryItems ?? [],
    waitlistEntries: raw.waitlistEntries ?? [],
    settings: migrateSettings(raw.settings),
  };
}

export async function initUserSettings(
  userId: string,
  data: { name: string; email: string; phone: string },
): Promise<void> {
  const db = await readDb();
  if (db.settings[userId]) return;
  db.settings[userId] = createDefaultSettings({
    businessName: data.name,
    ownerEmail: data.email,
    ownerPhone: data.phone,
    trialEndsAt: trialEndDateFromNow(14),
    subscriptionPlan: "trial",
    subscriptionStatus: "active",
  });
  await writeDb(db);
}

export async function readDb(): Promise<Database> {
  await ensureDataFile();
  const raw = JSON.parse(await fs.readFile(DATA_FILE, "utf-8")) as Partial<Database>;
  return migrateDb(raw);
}

export async function writeDb(db: Database): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export function newId(): string {
  return cuid();
}

export function now(): string {
  return new Date().toISOString();
}

export async function logActivity(
  db: Database,
  type: Database["activities"][0]["type"],
  message: string,
  entityType: string,
  entityId: string,
): Promise<void> {
  db.activities.unshift({
    id: newId(),
    type,
    message,
    entityType,
    entityId,
    createdAt: now(),
  });
  db.activities = db.activities.slice(0, 100);
}

export type RoomWithRelations = Room & {
  property: Property;
  tenants: Tenant[];
};

export type TenantWithRelations = Tenant & {
  room: RoomWithRelations;
};

export type PaymentWithRelations = Payment & {
  tenant: Tenant;
  room: Room & { property: Property };
};

export type PropertyWithRooms = Property & {
  rooms: (Room & { tenants: Tenant[] })[];
  _count: { rooms: number };
};

export async function enrichPayments(
  db: Database,
  payments: Payment[],
): Promise<PaymentWithRelations[]> {
  return payments
    .map((payment) => {
      const tenant = db.tenants.find((t) => t.id === payment.tenantId);
      const room = db.rooms.find((r) => r.id === payment.roomId);
      const property = room
        ? db.properties.find((p) => p.id === room.propertyId)
        : null;
      if (!tenant || !room || !property) return null;
      return { ...payment, tenant, room: { ...room, property } };
    })
    .filter((p): p is PaymentWithRelations => p !== null);
}