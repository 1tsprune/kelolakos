"use server";

import { revalidatePath } from "next/cache";
import { getSessionUserId } from "./auth";
import {
  assertPaymentAccess,
  assertPropertyAccess,
  assertRoomAccess,
  assertTenantAccess,
  assertTicketAccess,
  assertUtilityAccess,
} from "./security";
import { getUserSettings, setUserSettings } from "./settings";
import { assertCanAddProperty, assertCanAddRoom } from "./subscription";
import { logActivity, newId, now, readDb, writeDb } from "./store";
import { createPaymentLink } from "./xendit";
import { sendBulkReminders } from "./whatsapp-api";
import type {
  Expense,
  MaintenanceTicket,
  Payment,
  Property,
  Room,
  Tenant,
  UtilityBill,
} from "./types";

function revalidateAll() {
  const paths = [
    "/",
    "/dashboard",
    "/properti",
    "/kamar",
    "/penyewa",
    "/pembayaran",
    "/laporan",
    "/utilitas",
    "/maintenance",
    "/pengeluaran",
    "/kalender",
    "/notifikasi",
    "/pengaturan",
    "/daftar-tunggu",
    "/mulai",
    "/kamar",
    "/penyewa",
  ];
  paths.forEach((p) => revalidatePath(p));
}

export async function createProperty(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const ownerName = String(formData.get("ownerName") ?? "").trim();
  const ownerPhone = String(formData.get("ownerPhone") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;
  if (!name || !address || !city || !ownerName || !ownerPhone) throw new Error("Semua field wajib diisi");

  const db = await readDb();
  const timestamp = now();
  const userId = await getSessionUserId();
  const userSettings = getUserSettings(db, userId);
  assertCanAddProperty(db, userId, userSettings);
  const property: Property = { id: newId(), userId, name, address, city, ownerName, ownerPhone, notes, createdAt: timestamp, updatedAt: timestamp };
  db.properties.push(property);
  await logActivity(db, "property", `Properti baru ditambahkan: ${name}`, "property", property.id);
  await writeDb(db);
  revalidateAll();
}

export async function createRoom(formData: FormData) {
  const propertyId = String(formData.get("propertyId") ?? "");
  const number = String(formData.get("number") ?? "").trim();
  const floor = Number(formData.get("floor") ?? 1);
  const monthlyRent = Number(formData.get("monthlyRent") ?? 0);
  const electricityType = String(formData.get("electricityType") ?? "termasuk") as Room["electricityType"];
  const facilities = String(formData.get("facilities") ?? "").split(",").map((f) => f.trim()).filter(Boolean);
  const notes = String(formData.get("notes") ?? "").trim() || null;
  if (!propertyId || !number || !monthlyRent) throw new Error("Data kamar tidak lengkap");

  const db = await readDb();
  const userId = await getSessionUserId();
  assertPropertyAccess(db, userId, propertyId);
  const userSettings = getUserSettings(db, userId);
  assertCanAddRoom(db, userId, userSettings);
  const timestamp = now();
  const photoUrl = String(formData.get("photoUrl") ?? "").trim() || null;
  const room: Room = { id: newId(), propertyId, number, floor, monthlyRent, electricityType, facilities, photoUrl, notes, status: "kosong", createdAt: timestamp, updatedAt: timestamp };
  db.rooms.push(room);
  const prop = db.properties.find((p) => p.id === propertyId);
  await logActivity(db, "property", `Kamar ${number} ditambahkan di ${prop?.name ?? "properti"}`, "room", room.id);
  await writeDb(db);
  revalidateAll();
}

export async function createTenant(formData: FormData) {
  const roomId = String(formData.get("roomId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const ktp = String(formData.get("ktp") ?? "").trim() || null;
  const checkIn = String(formData.get("checkIn") ?? "");
  const emergencyContact = String(formData.get("emergencyContact") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  if (!roomId || !name || !phone || !checkIn) throw new Error("Data penyewa tidak lengkap");

  const db = await readDb();
  const userId = await getSessionUserId();
  assertRoomAccess(db, userId, roomId);
  const userSettings = getUserSettings(db, userId);
  const depositAmount = Number(formData.get("depositAmount") ?? userSettings.defaultDeposit);
  const room = db.rooms.find((r) => r.id === roomId);
  if (!room) throw new Error("Kamar tidak ditemukan");
  if (db.tenants.some((t) => t.roomId === roomId && t.isActive)) throw new Error("Kamar masih terisi");

  const timestamp = now();
  const checkInDate = new Date(checkIn);
  const ktpPhotoUrl = String(formData.get("ktpPhotoUrl") ?? "").trim() || null;
  const tenantId = newId();
  const contractEndRaw = String(formData.get("contractEndDate") ?? "").trim();
  const contractEndDate = contractEndRaw ? new Date(contractEndRaw).toISOString() : null;
  const tenant: Tenant = { id: tenantId, roomId, name, phone, ktp, ktpPhotoUrl, portalToken: `portal_${tenantId}_${Date.now().toString(36)}`, checkIn: checkInDate.toISOString(), checkOut: null, contractEndDate, emergencyContact, depositAmount, depositStatus: "ditahan", notes, isActive: true, createdAt: timestamp, updatedAt: timestamp };
  const dueDay = userSettings.dueDayOfMonth;
  const payment: Payment = {
    id: newId(), tenantId: tenant.id, roomId, periodMonth: checkInDate.getMonth() + 1, periodYear: checkInDate.getFullYear(),
    amount: room.monthlyRent, lateFee: 0,
    dueDate: new Date(checkInDate.getFullYear(), checkInDate.getMonth(), dueDay).toISOString(),
    paidAt: null, status: "belum", proofPhotoUrl: null, paymentOrderId: null, notes: null,
    waBillSentAt: null, waReminderSentAt: null, createdAt: timestamp, updatedAt: timestamp,
  };

  db.tenants.push(tenant);
  db.payments.push(payment);
  const ri = db.rooms.findIndex((r) => r.id === roomId);
  db.rooms[ri] = { ...db.rooms[ri], status: "terisi", updatedAt: timestamp };
  await logActivity(db, "tenant", `Penyewa baru: ${name} masuk kamar ${room.number}`, "tenant", tenant.id);
  await writeDb(db);

  const { sendPortalWelcome } = await import("./reminder-scheduler");
  await sendPortalWelcome(userId, tenant.id);

  revalidateAll();
}

export async function checkoutTenant(tenantId: string) {
  const db = await readDb();
  const userId = await getSessionUserId();
  assertTenantAccess(db, userId, tenantId);
  const ti = db.tenants.findIndex((t) => t.id === tenantId);
  if (ti === -1) throw new Error("Penyewa tidak ditemukan");
  const tenant = db.tenants[ti];
  const timestamp = now();
  db.tenants[ti] = { ...tenant, isActive: false, checkOut: timestamp, updatedAt: timestamp };
  const ri = db.rooms.findIndex((r) => r.id === tenant.roomId);
  if (ri !== -1) db.rooms[ri] = { ...db.rooms[ri], status: "kosong", updatedAt: timestamp };
  await logActivity(db, "tenant", `${tenant.name} check-out`, "tenant", tenantId);
  await writeDb(db);
  revalidateAll();
}

export async function markPaymentPaid(paymentId: string) {
  const db = await readDb();
  const userId = await getSessionUserId();
  assertPaymentAccess(db, userId, paymentId);
  const i = db.payments.findIndex((p) => p.id === paymentId);
  if (i === -1) throw new Error("Pembayaran tidak ditemukan");
  const payment = db.payments[i];
  const timestamp = now();
  db.payments[i] = { ...payment, status: "lunas", paidAt: timestamp, updatedAt: timestamp };
  const tenant = db.tenants.find((t) => t.id === payment.tenantId);
  await logActivity(db, "payment", `Pembayaran lunas: ${tenant?.name ?? "penyewa"}`, "payment", paymentId);
  await writeDb(db);
  revalidateAll();
}

export async function generateMonthlyPayments(month: number, year: number) {
  const db = await readDb();
  const userId = await getSessionUserId();
  const userSettings = getUserSettings(db, userId);
  const pids = new Set(db.properties.filter((p) => p.userId === userId).map((p) => p.id));
  const roomIds = new Set(db.rooms.filter((r) => pids.has(r.propertyId)).map((r) => r.id));
  const timestamp = now();
  let created = 0;
  for (const tenant of db.tenants.filter((t) => t.isActive && roomIds.has(t.roomId))) {
    if (db.payments.some((p) => p.tenantId === tenant.id && p.periodMonth === month && p.periodYear === year)) continue;
    const room = db.rooms.find((r) => r.id === tenant.roomId);
    if (!room) continue;
    db.payments.push({
      id: newId(), tenantId: tenant.id, roomId: tenant.roomId, periodMonth: month, periodYear: year,
      amount: room.monthlyRent, lateFee: 0,
      dueDate: new Date(year, month - 1, userSettings.dueDayOfMonth).toISOString(),
      paidAt: null, status: "belum", proofPhotoUrl: null, paymentOrderId: null, notes: null,
      waBillSentAt: null, waReminderSentAt: null, createdAt: timestamp, updatedAt: timestamp,
    });
    created++;
  }
  if (created > 0) await logActivity(db, "payment", `Generate ${created} tagihan untuk ${month}/${year}`, "system", "generate");
  await writeDb(db);
  revalidateAll();
  return created;
}

export async function createUtilityBill(formData: FormData) {
  const roomId = String(formData.get("roomId") ?? "");
  const type = String(formData.get("type") ?? "listrik") as UtilityBill["type"];
  const periodMonth = Number(formData.get("periodMonth"));
  const periodYear = Number(formData.get("periodYear"));
  const meterStart = Number(formData.get("meterStart"));
  const meterEnd = Number(formData.get("meterEnd"));
  const ratePerUnit = Number(formData.get("ratePerUnit"));
  const usage = meterEnd - meterStart;
  const amount = usage * ratePerUnit;
  if (!roomId || usage < 0) throw new Error("Data utilitas tidak valid");

  const db = await readDb();
  const userId = await getSessionUserId();
  assertRoomAccess(db, userId, roomId);
  const room = db.rooms.find((r) => r.id === roomId);
  const tenant = db.tenants.find((t) => t.roomId === roomId && t.isActive);
  const timestamp = now();
  const bill: UtilityBill = { id: newId(), roomId, tenantId: tenant?.id ?? null, type, periodMonth, periodYear, meterStart, meterEnd, ratePerUnit, amount, status: "belum", paidAt: null, createdAt: timestamp, updatedAt: timestamp };
  db.utilityBills.push(bill);
  await logActivity(db, "utility", `Tagihan ${type} kamar ${room?.number}: Rp ${amount.toLocaleString("id-ID")}`, "utility", bill.id);
  await writeDb(db);
  revalidateAll();
}

export async function markUtilityPaid(billId: string) {
  const db = await readDb();
  const userId = await getSessionUserId();
  assertUtilityAccess(db, userId, billId);
  const i = db.utilityBills.findIndex((b) => b.id === billId);
  if (i === -1) throw new Error("Tagihan tidak ditemukan");
  const timestamp = now();
  db.utilityBills[i] = { ...db.utilityBills[i], status: "lunas", paidAt: timestamp, updatedAt: timestamp };
  await writeDb(db);
  revalidateAll();
}

export async function createMaintenanceTicket(formData: FormData) {
  const propertyId = String(formData.get("propertyId") ?? "");
  const roomId = String(formData.get("roomId") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priority = String(formData.get("priority") ?? "sedang") as MaintenanceTicket["priority"];
  const reportedBy = String(formData.get("reportedBy") ?? "Pemilik").trim();
  if (!propertyId || !title) throw new Error("Data tiket tidak lengkap");

  const db = await readDb();
  const userId = await getSessionUserId();
  assertPropertyAccess(db, userId, propertyId);
  if (roomId) assertRoomAccess(db, userId, roomId);
  const timestamp = now();
  const ticket: MaintenanceTicket = { id: newId(), propertyId, roomId, title, description, priority, status: "open", reportedBy, assignedTo: null, cost: null, createdAt: timestamp, updatedAt: timestamp, resolvedAt: null };
  db.maintenanceTickets.push(ticket);
  if (roomId) {
    const ri = db.rooms.findIndex((r) => r.id === roomId);
    if (ri !== -1) db.rooms[ri] = { ...db.rooms[ri], status: "maintenance", updatedAt: timestamp };
  }
  await logActivity(db, "maintenance", `Tiket baru: ${title}`, "maintenance", ticket.id);
  await writeDb(db);
  revalidateAll();
}

export async function updateMaintenanceStatus(ticketId: string, status: MaintenanceTicket["status"]) {
  const db = await readDb();
  const userId = await getSessionUserId();
  assertTicketAccess(db, userId, ticketId);
  const i = db.maintenanceTickets.findIndex((t) => t.id === ticketId);
  if (i === -1) throw new Error("Tiket tidak ditemukan");
  const timestamp = now();
  const ticket = db.maintenanceTickets[i];
  db.maintenanceTickets[i] = { ...ticket, status, updatedAt: timestamp, resolvedAt: status === "done" ? timestamp : ticket.resolvedAt };
  if (status === "done" && ticket.roomId) {
    const ri = db.rooms.findIndex((r) => r.id === ticket.roomId);
    const hasTenant = db.tenants.some((t) => t.roomId === ticket.roomId && t.isActive);
    if (ri !== -1) db.rooms[ri] = { ...db.rooms[ri], status: hasTenant ? "terisi" : "kosong", updatedAt: timestamp };
  }
  await logActivity(db, "maintenance", `Tiket "${ticket.title}" → ${status}`, "maintenance", ticketId);
  await writeDb(db);
  revalidateAll();
}

export async function createExpense(formData: FormData) {
  const propertyId = String(formData.get("propertyId") ?? "");
  const category = String(formData.get("category") ?? "lainnya") as Expense["category"];
  const description = String(formData.get("description") ?? "").trim();
  const amount = Number(formData.get("amount") ?? 0);
  const date = String(formData.get("date") ?? now().split("T")[0]);
  if (!propertyId || !description || !amount) throw new Error("Data pengeluaran tidak lengkap");

  const db = await readDb();
  const userId = await getSessionUserId();
  assertPropertyAccess(db, userId, propertyId);
  const timestamp = now();
  const expense: Expense = { id: newId(), propertyId, category, description, amount, date: new Date(date).toISOString(), createdAt: timestamp };
  db.expenses.push(expense);
  await logActivity(db, "expense", `Pengeluaran: ${description} (Rp ${amount.toLocaleString("id-ID")})`, "expense", expense.id);
  await writeDb(db);
  revalidateAll();
}

export async function updateSettings(formData: FormData) {
  const db = await readDb();
  const userId = await getSessionUserId();
  const current = getUserSettings(db, userId);
  setUserSettings(db, userId, {
    reminderDaysBefore: Number(formData.get("reminderDaysBefore") ?? 3),
    lateFeePercent: Number(formData.get("lateFeePercent") ?? 5),
    dueDayOfMonth: Number(formData.get("dueDayOfMonth") ?? 5),
    ownerEmail: String(formData.get("ownerEmail") ?? "").trim(),
    ownerPhone: String(formData.get("ownerPhone") ?? "").trim(),
    businessName: String(formData.get("businessName") ?? "KosKit").trim(),
    appUrl: String(formData.get("appUrl") ?? "").trim(),
    whatsappTemplate: String(formData.get("whatsappTemplate") ?? "default"),
    whatsappApiKey: String(formData.get("whatsappApiKey") ?? "").trim(),
    whatsappProvider: (String(formData.get("whatsappProvider") ?? "fonnte")) as "fonnte" | "waba" | "manual",
    xenditSecretKey: String(formData.get("xenditSecretKey") ?? "").trim(),
    xenditWebhookToken: String(formData.get("xenditWebhookToken") ?? "").trim(),
    monthlyRevenueTarget: Number(formData.get("monthlyRevenueTarget") ?? current.monthlyRevenueTarget ?? 10000000),
    defaultDeposit: Number(formData.get("defaultDeposit") ?? current.defaultDeposit ?? 500000),
    electricityRate: Number(formData.get("electricityRate") ?? current.electricityRate ?? 1500),
    waterRate: Number(formData.get("waterRate") ?? current.waterRate ?? 5000),
    autoReminderEnabled: formData.get("autoReminderEnabled") === "on",
    portalWelcomeMessage: String(formData.get("portalWelcomeMessage") ?? current.portalWelcomeMessage).trim(),
    onboardingCompleted: current.onboardingCompleted,
  });
  await logActivity(db, "system", "Pengaturan diperbarui", "settings", userId);
  await writeDb(db);
  revalidateAll();
}

export async function generatePaymentLinkAction(paymentId: string) {
  const link = await createPaymentLink(paymentId);
  revalidateAll();
  return link;
}

export async function attachPaymentProof(paymentId: string, photoUrl: string) {
  const db = await readDb();
  const userId = await getSessionUserId();
  assertPaymentAccess(db, userId, paymentId);
  const i = db.payments.findIndex((p) => p.id === paymentId);
  if (i === -1) throw new Error("Pembayaran tidak ditemukan");
  db.payments[i] = { ...db.payments[i], proofPhotoUrl: photoUrl, updatedAt: now() };
  await writeDb(db);
  revalidateAll();
}

export async function bulkWhatsAppReminders() {
  const result = await sendBulkReminders();
  revalidateAll();
  return result;
}

export async function createInventoryItem(formData: FormData) {
  const roomId = String(formData.get("roomId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const condition = String(formData.get("condition") ?? "baik") as import("./types").InventoryItem["condition"];
  const quantity = Number(formData.get("quantity") ?? 1);
  const value = Number(formData.get("value") ?? 0);
  const notes = String(formData.get("notes") ?? "").trim() || null;
  if (!roomId || !name) throw new Error("Data inventaris tidak lengkap");

  const db = await readDb();
  const timestamp = now();
  db.inventoryItems.push({
    id: newId(), roomId, name, condition, quantity, value, notes,
    createdAt: timestamp, updatedAt: timestamp,
  });
  const room = db.rooms.find((r) => r.id === roomId);
  await logActivity(db, "property", `Inventaris ditambah: ${name} di kamar ${room?.number}`, "inventory", roomId);
  await writeDb(db);
  revalidateAll();
}

export async function applyLateFees() {
  const db = await readDb();
  const userId = await getSessionUserId();
  const userSettings = getUserSettings(db, userId);
  const pids = new Set(db.properties.filter((p) => p.userId === userId).map((p) => p.id));
  const roomIds = new Set(db.rooms.filter((r) => pids.has(r.propertyId)).map((r) => r.id));
  const nowDate = new Date();
  let updated = 0;
  for (const p of db.payments.filter((pay) => roomIds.has(pay.roomId))) {
    if (p.status === "lunas") continue;
    if (new Date(p.dueDate) >= nowDate) continue;
    const fee = Math.round(p.amount * (userSettings.lateFeePercent / 100));
    if (p.lateFee === fee && p.status === "terlambat") continue;
    const i = db.payments.findIndex((x) => x.id === p.id);
    db.payments[i] = { ...p, lateFee: fee, status: "terlambat", updatedAt: now() };
    updated++;
  }
  if (updated > 0) await logActivity(db, "payment", `Denda otomatis diterapkan ke ${updated} tagihan`, "system", "late-fees");
  await writeDb(db);
  revalidateAll();
  return updated;
}

export async function createWaitlistEntry(formData: FormData) {
  const propertyId = String(formData.get("propertyId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const budget = Number(formData.get("budget") ?? 0) || null;
  const preferredRoom = String(formData.get("preferredRoom") ?? "").trim() || null;
  const moveInDate = String(formData.get("moveInDate") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  if (!propertyId || !name || !phone) throw new Error("Nama, telepon, dan properti wajib diisi");

  const db = await readDb();
  const timestamp = now();
  const entry = {
    id: newId(),
    propertyId,
    name,
    phone,
    budget,
    preferredRoom,
    moveInDate: moveInDate ? new Date(moveInDate).toISOString() : null,
    status: "menunggu" as const,
    notes,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  db.waitlistEntries.push(entry);
  const prop = db.properties.find((p) => p.id === propertyId);
  await logActivity(db, "tenant", `Calon penyewa masuk daftar tunggu: ${name} (${prop?.name})`, "waitlist", entry.id);
  await writeDb(db);
  revalidateAll();
}

export async function updateWaitlistStatus(entryId: string, status: import("./types").WaitlistEntry["status"]) {
  const db = await readDb();
  const i = db.waitlistEntries.findIndex((e) => e.id === entryId);
  if (i === -1) throw new Error("Entri tidak ditemukan");
  const entry = db.waitlistEntries[i];
  db.waitlistEntries[i] = { ...entry, status, updatedAt: now() };
  await logActivity(db, "tenant", `Daftar tunggu ${entry.name} → ${status}`, "waitlist", entryId);
  await writeDb(db);
  revalidateAll();
}

export async function completeOnboarding() {
  const db = await readDb();
  const userId = await getSessionUserId();
  setUserSettings(db, userId, { onboardingCompleted: true });
  await logActivity(db, "system", "Onboarding selesai", "system", "onboarding");
  await writeDb(db);
  revalidateAll();
}

export async function updateProperty(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const db = await readDb();
  const userId = await getSessionUserId();
  const i = db.properties.findIndex((p) => p.id === id && p.userId === userId);
  if (i === -1) throw new Error("Properti tidak ditemukan");
  const timestamp = now();
  db.properties[i] = {
    ...db.properties[i],
    name: String(formData.get("name") ?? "").trim() || db.properties[i].name,
    address: String(formData.get("address") ?? "").trim() || db.properties[i].address,
    city: String(formData.get("city") ?? "").trim() || db.properties[i].city,
    ownerName: String(formData.get("ownerName") ?? "").trim() || db.properties[i].ownerName,
    ownerPhone: String(formData.get("ownerPhone") ?? "").trim() || db.properties[i].ownerPhone,
    notes: String(formData.get("notes") ?? "").trim() || null,
    updatedAt: timestamp,
  };
  await logActivity(db, "property", `Properti diperbarui: ${db.properties[i].name}`, "property", id);
  await writeDb(db);
  revalidateAll();
}

export async function updateRoom(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const db = await readDb();
  const userId = await getSessionUserId();
  const room = db.rooms.find((r) => r.id === id);
  if (!room) throw new Error("Kamar tidak ditemukan");
  const prop = db.properties.find((p) => p.id === room.propertyId && p.userId === userId);
  if (!prop) throw new Error("Akses ditolak");
  const i = db.rooms.findIndex((r) => r.id === id);
  const timestamp = now();
  db.rooms[i] = {
    ...room,
    number: String(formData.get("number") ?? "").trim() || room.number,
    floor: Number(formData.get("floor") ?? room.floor),
    monthlyRent: Number(formData.get("monthlyRent") ?? room.monthlyRent),
    electricityType: (String(formData.get("electricityType") ?? room.electricityType)) as Room["electricityType"],
    facilities: String(formData.get("facilities") ?? "").split(",").map((f) => f.trim()).filter(Boolean),
    notes: String(formData.get("notes") ?? "").trim() || null,
    photoUrl: String(formData.get("photoUrl") ?? "").trim() || room.photoUrl,
    updatedAt: timestamp,
  };
  await logActivity(db, "property", `Kamar ${db.rooms[i].number} diperbarui`, "room", id);
  await writeDb(db);
  revalidateAll();
}

export async function updateRoomStatus(roomId: string, status: Room["status"]) {
  const db = await readDb();
  const userId = await getSessionUserId();
  const room = db.rooms.find((r) => r.id === roomId);
  if (!room) throw new Error("Kamar tidak ditemukan");
  const prop = db.properties.find((p) => p.id === room.propertyId && p.userId === userId);
  if (!prop) throw new Error("Akses ditolak");
  if (status === "kosong" && db.tenants.some((t) => t.roomId === roomId && t.isActive)) {
    throw new Error("Kamar masih ada penyewa aktif");
  }
  const i = db.rooms.findIndex((r) => r.id === roomId);
  db.rooms[i] = { ...room, status, updatedAt: now() };
  await logActivity(db, "property", `Status kamar ${room.number} → ${status}`, "room", roomId);
  await writeDb(db);
  revalidateAll();
}

export async function updateTenant(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const db = await readDb();
  const userId = await getSessionUserId();
  const tenant = db.tenants.find((t) => t.id === id);
  if (!tenant) throw new Error("Penyewa tidak ditemukan");
  const room = db.rooms.find((r) => r.id === tenant.roomId);
  const prop = room ? db.properties.find((p) => p.id === room.propertyId && p.userId === userId) : null;
  if (!prop) throw new Error("Akses ditolak");
  const i = db.tenants.findIndex((t) => t.id === id);
  const contractEndRaw = String(formData.get("contractEndDate") ?? "").trim();
  db.tenants[i] = {
    ...tenant,
    name: String(formData.get("name") ?? "").trim() || tenant.name,
    phone: String(formData.get("phone") ?? "").trim() || tenant.phone,
    ktp: String(formData.get("ktp") ?? "").trim() || tenant.ktp,
    emergencyContact: String(formData.get("emergencyContact") ?? "").trim() || null,
    depositAmount: Number(formData.get("depositAmount") ?? tenant.depositAmount),
    contractEndDate: contractEndRaw ? new Date(contractEndRaw).toISOString() : tenant.contractEndDate,
    notes: String(formData.get("notes") ?? "").trim() || null,
    updatedAt: now(),
  };
  await logActivity(db, "tenant", `Data penyewa diperbarui: ${db.tenants[i].name}`, "tenant", id);
  await writeDb(db);
  revalidateAll();
}

export async function submitPortalMaintenance(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!token || !title) throw new Error("Data tidak lengkap");
  const db = await readDb();
  const tenant = db.tenants.find((t) => t.portalToken === token && t.isActive);
  if (!tenant) throw new Error("Penyewa tidak ditemukan");
  const room = db.rooms.find((r) => r.id === tenant.roomId);
  if (!room) throw new Error("Kamar tidak ditemukan");
  const timestamp = now();
  const ticket: MaintenanceTicket = {
    id: newId(), propertyId: room.propertyId, roomId: room.id,
    title, description, priority: "sedang", status: "open",
    reportedBy: tenant.name, assignedTo: null, cost: null,
    createdAt: timestamp, updatedAt: timestamp, resolvedAt: null,
  };
  db.maintenanceTickets.push(ticket);
  await logActivity(db, "maintenance", `Laporan dari portal: ${title} (${tenant.name})`, "maintenance", ticket.id);
  await writeDb(db);
  revalidateAll();
}

export async function sendCustomBroadcast(formData: FormData) {
  const message = String(formData.get("message") ?? "").trim();
  if (!message) throw new Error("Pesan tidak boleh kosong");
  const db = await readDb();
  const active = db.tenants.filter((t) => t.isActive);
  const { sendWhatsAppMessage } = await import("./whatsapp-api");
  let sent = 0;
  for (const tenant of active) {
    const result = await sendWhatsAppMessage(tenant.phone, message, tenant.id);
    if (result.ok) sent++;
  }
  const fresh = await readDb();
  await logActivity(fresh, "system", `Broadcast terkirim ke ${sent} penyewa`, "system", "broadcast");
  await writeDb(fresh);
  revalidateAll();
  return sent;
}