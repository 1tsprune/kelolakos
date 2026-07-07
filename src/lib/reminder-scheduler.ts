import type { Database, Payment } from "./types";
import { getUserSettings, resolveAppUrl } from "./settings";
import { readDb, writeDb, newId, now } from "./store";
import { sendWhatsAppMessage } from "./whatsapp-api";
import {
  buildPaymentPageUrl,
  buildPaymentReminderMessage,
  buildPortalWelcomeMessage,
  buildTenantPortalUrl,
} from "./whatsapp";

export type ReminderRunResult = {
  users: number;
  generated: number;
  reminders: number;
  bills: number;
  skippedManual: number;
};

function daysUntilDue(dueDate: string): number {
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

function canAutoSend(settings: ReturnType<typeof getUserSettings>): boolean {
  return (
    settings.autoReminderEnabled &&
    settings.whatsappProvider !== "manual" &&
    !!settings.whatsappApiKey?.trim()
  );
}

function ensureMonthlyPayments(db: Database, userId: string): number {
  const settings = getUserSettings(db, userId);
  const pids = new Set(db.properties.filter((p) => p.userId === userId).map((p) => p.id));
  const roomIds = new Set(db.rooms.filter((r) => pids.has(r.propertyId)).map((r) => r.id));
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const timestamp = now();
  let created = 0;

  for (const tenant of db.tenants.filter((t) => t.isActive && roomIds.has(t.roomId))) {
    if (db.payments.some((p) => p.tenantId === tenant.id && p.periodMonth === month && p.periodYear === year)) {
      continue;
    }
    const room = db.rooms.find((r) => r.id === tenant.roomId);
    if (!room) continue;
    db.payments.push({
      id: newId(),
      tenantId: tenant.id,
      roomId: tenant.roomId,
      periodMonth: month,
      periodYear: year,
      amount: room.monthlyRent,
      lateFee: 0,
      dueDate: new Date(year, month - 1, settings.dueDayOfMonth).toISOString(),
      paidAt: null,
      status: "belum",
      proofPhotoUrl: null,
      paymentOrderId: null,
      notes: null,
      waBillSentAt: null,
      waReminderSentAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    created++;
  }

  return created;
}

function applyLateFeesForUser(db: Database, userId: string): void {
  const settings = getUserSettings(db, userId);
  const pids = new Set(db.properties.filter((p) => p.userId === userId).map((p) => p.id));
  const roomIds = new Set(db.rooms.filter((r) => pids.has(r.propertyId)).map((r) => r.id));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const p of db.payments.filter((pay) => roomIds.has(pay.roomId))) {
    if (p.status === "lunas") continue;
    if (new Date(p.dueDate) >= today) continue;
    const fee = Math.round(p.amount * (settings.lateFeePercent / 100));
    const i = db.payments.findIndex((x) => x.id === p.id);
    if (i === -1) continue;
    db.payments[i] = { ...p, lateFee: fee, status: "terlambat", updatedAt: now() };
  }
}

async function sendPaymentWhatsApp(
  db: Database,
  userId: string,
  payment: Payment,
  variant: "reminder" | "due",
): Promise<boolean> {
  const settings = getUserSettings(db, userId);
  const tenant = db.tenants.find((t) => t.id === payment.tenantId);
  const room = db.rooms.find((r) => r.id === payment.roomId);
  const property = room ? db.properties.find((p) => p.id === room.propertyId) : null;
  if (!tenant || !room || !property) return false;

  const appUrl = resolveAppUrl(settings);
  const portalUrl = buildTenantPortalUrl(appUrl, tenant.portalToken);
  const paymentUrl = buildPaymentPageUrl(appUrl, payment.id);
  const message = buildPaymentReminderMessage({
    tenantName: tenant.name,
    propertyName: property.name,
    roomNumber: room.number,
    amount: payment.amount + payment.lateFee,
    periodMonth: payment.periodMonth,
    periodYear: payment.periodYear,
    dueDate: payment.dueDate,
    ownerName: property.ownerName,
    portalUrl,
    paymentUrl,
    variant,
  });

  const result = await sendWhatsAppMessage(tenant.phone, message, tenant.id, userId);
  return result.ok;
}

export async function processUserAutoReminders(
  db: Database,
  userId: string,
): Promise<{ generated: number; reminders: number; bills: number; skippedManual: boolean }> {
  const settings = getUserSettings(db, userId);
  if (!settings.autoReminderEnabled) {
    return { generated: 0, reminders: 0, bills: 0, skippedManual: false };
  }

  const generated = ensureMonthlyPayments(db, userId);
  applyLateFeesForUser(db, userId);

  if (!canAutoSend(settings)) {
    return { generated, reminders: 0, bills: 0, skippedManual: true };
  }

  const pids = new Set(db.properties.filter((p) => p.userId === userId).map((p) => p.id));
  const roomIds = new Set(db.rooms.filter((r) => pids.has(r.propertyId)).map((r) => r.id));
  let reminders = 0;
  let bills = 0;

  const unpaid = db.payments.filter(
    (p) => roomIds.has(p.roomId) && p.status !== "lunas",
  );

  for (const payment of unpaid) {
    const days = daysUntilDue(payment.dueDate);
    const pi = db.payments.findIndex((p) => p.id === payment.id);
    if (pi === -1) continue;

    if (days === settings.reminderDaysBefore && !payment.waReminderSentAt) {
      const ok = await sendPaymentWhatsApp(db, userId, payment, "reminder");
      if (ok) {
        db.payments[pi] = { ...db.payments[pi], waReminderSentAt: now(), updatedAt: now() };
        reminders++;
      }
      continue;
    }

    if (days <= 0 && !payment.waBillSentAt) {
      const ok = await sendPaymentWhatsApp(db, userId, payment, "due");
      if (ok) {
        db.payments[pi] = { ...db.payments[pi], waBillSentAt: now(), updatedAt: now() };
        bills++;
      }
    }
  }

  return { generated, reminders, bills, skippedManual: false };
}

export async function runAutoReminders(): Promise<ReminderRunResult> {
  const db = await readDb();
  const userIds = [...new Set(db.properties.map((p) => p.userId))];
  let generated = 0;
  let reminders = 0;
  let bills = 0;
  let skippedManual = 0;

  for (const userId of userIds) {
    const result = await processUserAutoReminders(db, userId);
    generated += result.generated;
    reminders += result.reminders;
    bills += result.bills;
    if (result.skippedManual) skippedManual++;
  }

  await writeDb(db);
  return { users: userIds.length, generated, reminders, bills, skippedManual };
}

export async function sendPortalWelcome(
  userId: string,
  tenantId: string,
): Promise<{ ok: boolean; simulated: boolean }> {
  const db = await readDb();
  const settings = getUserSettings(db, userId);
  if (!settings.autoReminderEnabled) {
    return { ok: false, simulated: false };
  }

  const tenant = db.tenants.find((t) => t.id === tenantId);
  if (!tenant) return { ok: false, simulated: false };
  const room = db.rooms.find((r) => r.id === tenant.roomId);
  const property = room ? db.properties.find((p) => p.id === room.propertyId) : null;
  if (!room || !property) return { ok: false, simulated: false };

  const appUrl = resolveAppUrl(settings);
  const message = buildPortalWelcomeMessage({
    tenantName: tenant.name,
    propertyName: property.name,
    roomNumber: room.number,
    ownerName: property.ownerName,
    portalUrl: buildTenantPortalUrl(appUrl, tenant.portalToken),
  });

  return sendWhatsAppMessage(tenant.phone, message, tenant.id, userId);
}