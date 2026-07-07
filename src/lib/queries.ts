import { getSessionUserId } from "./auth";
import { getUserSettings, setUserSettings, getSettingsForPayment as resolvePaymentSettings } from "./settings";
import { resolveSubscriptionExpiry } from "./subscription";
import { enrichPayments, readDb, writeDb } from "./store";
import type { Database } from "./types";
import type { PropertyWithRooms } from "./store";

async function userPropertyIds(db: Database) {
  const userId = await getSessionUserId();
  return new Set(db.properties.filter((p) => p.userId === userId).map((p) => p.id));
}

async function userRoomIds(db: Database) {
  const pids = await userPropertyIds(db);
  return new Set(db.rooms.filter((r) => pids.has(r.propertyId)).map((r) => r.id));
}

export async function getDashboardStats() {
  const db = await readDb();
  const roomIds = await userRoomIds(db);
  const pids = await userPropertyIds(db);
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const rooms = db.rooms.filter((r) => roomIds.has(r.id));
  const tenants = db.tenants.filter((t) => roomIds.has(t.roomId));
  const roomCount = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === "terisi").length;
  const activeTenants = tenants.filter((t) => t.isActive).length;
  const emptyRooms = rooms.filter((r) => r.status === "kosong").length;
  const maintenanceRooms = rooms.filter((r) => r.status === "maintenance").length;

  const paymentsThisMonth = await enrichPayments(
    db,
    db.payments.filter((p) => roomIds.has(p.roomId) && p.periodMonth === month && p.periodYear === year),
  );

  const overduePayments = await enrichPayments(
    db,
    db.payments.filter(
      (p) => roomIds.has(p.roomId) && (p.status === "belum" || p.status === "terlambat") && new Date(p.dueDate) < now,
    ),
  );

  const collected = paymentsThisMonth.filter((p) => p.status === "lunas").reduce((s, p) => s + p.amount, 0);
  const pending = paymentsThisMonth.filter((p) => p.status !== "lunas").reduce((s, p) => s + p.amount + p.lateFee, 0);
  const occupancyRate = roomCount > 0 ? Math.round((occupiedRooms / roomCount) * 100) : 0;

  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(year, month - 6 + i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const total = db.payments
      .filter((p) => roomIds.has(p.roomId) && p.periodMonth === m && p.periodYear === y && p.status === "lunas")
      .reduce((s, p) => s + p.amount, 0);
    return { month: m, year: y, label: d.toLocaleDateString("id-ID", { month: "short" }), total };
  });

  const totalDeposits = tenants.filter((t) => t.isActive && t.depositStatus === "ditahan").reduce((s, t) => s + t.depositAmount, 0);
  const openTickets = db.maintenanceTickets.filter((t) => pids.has(t.propertyId) && t.status !== "done").length;
  const utilityPending = db.utilityBills.filter((b) => roomIds.has(b.roomId) && b.status === "belum").length;
  const userId = await getSessionUserId();
  const userSettings = getUserSettings(db, userId);
  const revenueTarget = userSettings.monthlyRevenueTarget ?? 10000000;
  const waitlistCount = db.waitlistEntries.filter((w) => pids.has(w.propertyId) && (w.status === "menunggu" || w.status === "dihubungi")).length;

  const expiringContracts = tenants
    .filter((t) => t.isActive && t.contractEndDate)
    .map((t) => {
      const end = new Date(t.contractEndDate!);
      const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const room = db.rooms.find((r) => r.id === t.roomId);
      const property = room ? db.properties.find((p) => p.id === room.propertyId) : null;
      return {
        id: t.id,
        name: t.name,
        daysLeft,
        roomLabel: property ? `${property.name} · Kamar ${room?.number}` : "—",
      };
    })
    .filter((t) => t.daysLeft > 0 && t.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return {
    propertyCount: pids.size,
    roomCount,
    occupiedRooms,
    emptyRooms,
    maintenanceRooms,
    activeTenants,
    occupancyRate,
    collected,
    pending,
    paymentsThisMonth,
    overduePayments: overduePayments.slice(0, 8),
    monthlyRevenue,
    totalDeposits,
    openTickets,
    utilityPending,
    revenueTarget,
    waitlistCount,
    expiringContracts,
    recentActivities: db.activities.slice(0, 8),
    onboardingCompleted: userSettings.onboardingCompleted ?? false,
    month,
    year,
  };
}

export async function getProperties(): Promise<PropertyWithRooms[]> {
  const db = await readDb();
  const pids = await userPropertyIds(db);
  return db.properties
    .filter((p) => pids.has(p.id))
    .map((property) => ({
      ...property,
      _count: { rooms: db.rooms.filter((r) => r.propertyId === property.id).length },
      rooms: db.rooms
        .filter((r) => r.propertyId === property.id)
        .map((room) => ({ ...room, tenants: db.tenants.filter((t) => t.roomId === room.id && t.isActive) }))
        .sort((a, b) => a.number.localeCompare(b.number)),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getProperty(id: string) {
  const properties = await getProperties();
  return properties.find((p) => p.id === id) ?? null;
}

export async function getRooms() {
  const db = await readDb();
  const roomIds = await userRoomIds(db);
  return db.rooms
    .filter((r) => roomIds.has(r.id))
    .map((room) => {
      const property = db.properties.find((p) => p.id === room.propertyId);
      if (!property) return null;
      return { ...room, property, tenants: db.tenants.filter((t) => t.roomId === room.id && t.isActive) };
    })
    .filter((r) => r !== null)
    .sort((a, b) => a!.property.name.localeCompare(b!.property.name) || a!.number.localeCompare(b!.number));
}

export async function getTenant(id: string) {
  const tenants = await getTenants();
  return tenants.find((t) => t.id === id) ?? null;
}

export async function getTenantPayments(tenantId: string) {
  const db = await readDb();
  const roomIds = await userRoomIds(db);
  return enrichPayments(
    db,
    db.payments
      .filter((p) => p.tenantId === tenantId && roomIds.has(p.roomId))
      .sort((a, b) => b.periodYear - a.periodYear || b.periodMonth - a.periodMonth),
  );
}

export async function getRoom(id: string) {
  const rooms = await getRooms();
  return rooms.find((r) => r.id === id) ?? null;
}

export async function getTenants() {
  const db = await readDb();
  const rooms = await getRooms();
  const roomMap = new Map(rooms.map((r) => [r.id, r]));
  return db.tenants
    .filter((t) => roomMap.has(t.roomId))
    .map((tenant) => {
      const room = roomMap.get(tenant.roomId);
      if (!room) return null;
      return { ...tenant, room };
    })
    .filter((t) => t !== null)
    .sort((a, b) => new Date(b!.createdAt).getTime() - new Date(a!.createdAt).getTime());
}

export async function getPayments(month?: number, year?: number) {
  const db = await readDb();
  const roomIds = await userRoomIds(db);
  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();
  const enriched = await enrichPayments(db, db.payments.filter((p) => roomIds.has(p.roomId) && p.periodMonth === m && p.periodYear === y));
  return enriched.sort((a, b) => {
    const order = { belum: 0, terlambat: 1, lunas: 2 };
    return (order[a.status] ?? 0) - (order[b.status] ?? 0) || new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export async function getReportData(month: number, year: number) {
  const payments = await getPayments(month, year);
  const properties = await getProperties();
  const db = await readDb();
  const expenses = db.expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });
  const totalExpected = payments.reduce((s, p) => s + p.amount, 0);
  const totalCollected = payments.filter((p) => p.status === "lunas").reduce((s, p) => s + p.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  return { payments, properties, expenses, totalExpected, totalCollected, totalPending: totalExpected - totalCollected, totalExpenses, netIncome: totalCollected - totalExpenses, month, year };
}

export async function getUtilityBills() {
  const db = await readDb();
  return db.utilityBills
    .map((bill) => {
      const room = db.rooms.find((r) => r.id === bill.roomId);
      const property = room ? db.properties.find((p) => p.id === room.propertyId) : null;
      const tenant = bill.tenantId ? db.tenants.find((t) => t.id === bill.tenantId) : null;
      if (!room || !property) return null;
      return { ...bill, room, property, tenant };
    })
    .filter((b) => b !== null)
    .sort((a, b) => b!.periodYear - a!.periodYear || b!.periodMonth - a!.periodMonth);
}

export async function getMaintenanceTickets() {
  const db = await readDb();
  return db.maintenanceTickets
    .map((ticket) => {
      const property = db.properties.find((p) => p.id === ticket.propertyId);
      const room = ticket.roomId ? db.rooms.find((r) => r.id === ticket.roomId) : null;
      if (!property) return null;
      return { ...ticket, property, room };
    })
    .filter((t) => t !== null)
    .sort((a, b) => {
      const pOrder = { tinggi: 0, sedang: 1, rendah: 2 };
      const sOrder = { open: 0, progress: 1, done: 2 };
      return (sOrder[a!.status] ?? 0) - (sOrder[b!.status] ?? 0) || (pOrder[a!.priority] ?? 0) - (pOrder[b!.priority] ?? 0);
    });
}

export async function getExpenses() {
  const db = await readDb();
  return db.expenses
    .map((expense) => {
      const property = db.properties.find((p) => p.id === expense.propertyId);
      if (!property) return null;
      return { ...expense, property };
    })
    .filter((e) => e !== null)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime());
}

export async function getCalendarEvents(month: number, year: number) {
  const db = await readDb();
  const payments = await enrichPayments(db, db.payments.filter((p) => p.periodMonth === month && p.periodYear === year));
  const utilities = db.utilityBills.filter((b) => b.periodMonth === month && b.periodYear === year);
  return {
    payments,
    utilities,
    daysInMonth: new Date(year, month, 0).getDate(),
    month,
    year,
  };
}

export async function getNotifications() {
  const db = await readDb();
  const now = new Date();
  const notifications: { id: string; type: string; title: string; message: string; href: string; createdAt: string; priority: "high" | "medium" | "low" }[] = [];

  for (const p of db.payments.filter((p) => p.status !== "lunas")) {
    const tenant = db.tenants.find((t) => t.id === p.tenantId);
    const overdue = new Date(p.dueDate) < now;
    notifications.push({
      id: `pay-${p.id}`,
      type: "payment",
      title: overdue ? "Tagihan terlambat" : "Tagihan belum lunas",
      message: `${tenant?.name ?? "Penyewa"} — Rp ${p.amount.toLocaleString("id-ID")}`,
      href: "/pembayaran",
      createdAt: p.dueDate,
      priority: overdue ? "high" : "medium",
    });
  }

  for (const t of db.maintenanceTickets.filter((t) => t.status === "open")) {
    notifications.push({
      id: `mnt-${t.id}`,
      type: "maintenance",
      title: "Tiket perbaikan terbuka",
      message: t.title,
      href: "/maintenance",
      createdAt: t.createdAt,
      priority: t.priority === "tinggi" ? "high" : "medium",
    });
  }

  for (const b of db.utilityBills.filter((b) => b.status === "belum")) {
    notifications.push({
      id: `util-${b.id}`,
      type: "utility",
      title: `Tagihan ${b.type} belum lunas`,
      message: `Rp ${b.amount.toLocaleString("id-ID")}`,
      href: "/utilitas",
      createdAt: b.createdAt,
      priority: "low",
    });
  }

  const emptyCount = db.rooms.filter((r) => r.status === "kosong").length;
  if (emptyCount > 0) {
    notifications.push({
      id: "empty-rooms",
      type: "system",
      title: `${emptyCount} kamar kosong`,
      message: "Promosikan kamar untuk meningkatkan hunian",
      href: "/kamar",
      createdAt: now.toISOString(),
      priority: "low",
    });
  }

  return notifications.sort((a, b) => {
    const p = { high: 0, medium: 1, low: 2 };
    return p[a.priority] - p[b.priority];
  });
}

export async function getSettings() {
  const db = await readDb();
  const userId = await getSessionUserId();
  let settings = getUserSettings(db, userId);
  const resolved = resolveSubscriptionExpiry(settings);
  if (resolved.changed) {
    setUserSettings(db, userId, resolved.settings);
    await writeDb(db);
    settings = resolved.settings;
  }
  return settings;
}

export async function getSettingsForPayment(paymentId: string) {
  const db = await readDb();
  return resolvePaymentSettings(db, paymentId);
}

export async function getSettingsForUser(userId: string) {
  const db = await readDb();
  return getUserSettings(db, userId);
}

export async function getActivities() {
  const db = await readDb();
  return db.activities;
}

export async function getTenantByPortalToken(token: string) {
  const db = await readDb();
  const tenant = db.tenants.find((t) => t.portalToken === token);
  if (!tenant) return null;
  const room = db.rooms.find((r) => r.id === tenant.roomId);
  const property = room ? db.properties.find((p) => p.id === room.propertyId) : null;
  if (!room || !property) return null;

  const payments = await enrichPayments(
    db,
    db.payments.filter((p) => p.tenantId === tenant.id).sort(
      (a, b) => b.periodYear - a.periodYear || b.periodMonth - a.periodMonth,
    ),
  );
  const utilities = db.utilityBills.filter((b) => b.tenantId === tenant.id);

  return { tenant, room, property, payments, utilities };
}

export async function getPaymentForBayar(paymentId: string) {
  const db = await readDb();
  const enriched = await enrichPayments(db, db.payments.filter((p) => p.id === paymentId));
  return enriched[0] ?? null;
}

export async function getWhatsAppLogs() {
  const db = await readDb();
  return db.whatsappLogs.slice(0, 50);
}

export async function getInventoryItems() {
  const db = await readDb();
  const roomIds = await userRoomIds(db);
  return db.inventoryItems
    .filter((item) => roomIds.has(item.roomId))
    .map((item) => {
      const room = db.rooms.find((r) => r.id === item.roomId);
      const property = room ? db.properties.find((p) => p.id === room.propertyId) : null;
      if (!room || !property) return null;
      return { ...item, room, property };
    })
    .filter((i) => i !== null)
    .sort((a, b) => a!.property.name.localeCompare(b!.property.name));
}

export async function getAnalytics() {
  const db = await readDb();
  const stats = await getDashboardStats();
  const pids = await userPropertyIds(db);
  const roomIds = await userRoomIds(db);
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const propertyPerformance = db.properties.filter((p) => pids.has(p.id)).map((prop) => {
    const rooms = db.rooms.filter((r) => r.propertyId === prop.id);
    const occupied = rooms.filter((r) => r.status === "terisi").length;
    const revenue = rooms.filter((r) => r.status === "terisi").reduce((s, r) => s + r.monthlyRent, 0);
    const collected = db.payments
      .filter((p) => {
        const room = db.rooms.find((r) => r.id === p.roomId);
        return room?.propertyId === prop.id && p.periodMonth === month && p.periodYear === year && p.status === "lunas";
      })
      .reduce((s, p) => s + p.amount, 0);
    const expenses = db.expenses
      .filter((e) => {
        const d = new Date(e.date);
        return e.propertyId === prop.id && d.getMonth() + 1 === month && d.getFullYear() === year;
      })
      .reduce((s, e) => s + e.amount, 0);
    return {
      property: prop,
      rooms: rooms.length,
      occupied,
      occupancy: rooms.length > 0 ? Math.round((occupied / rooms.length) * 100) : 0,
      potentialRevenue: revenue,
      collected,
      expenses,
      netIncome: collected - expenses,
    };
  });

  const userRooms = db.rooms.filter((r) => roomIds.has(r.id));
  const avgRent = userRooms.length > 0
    ? Math.round(userRooms.reduce((s, r) => s + r.monthlyRent, 0) / userRooms.length)
    : 0;

  const churnRate = db.tenants.filter((t) => roomIds.has(t.roomId) && t.checkOut && new Date(t.checkOut).getMonth() + 1 === month).length;

  return { ...stats, propertyPerformance, avgRent, churnRate, inventoryCount: db.inventoryItems.filter((i) => roomIds.has(i.roomId)).length };
}

export async function getWaitlistEntries() {
  const db = await readDb();
  return db.waitlistEntries
    .map((entry) => {
      const property = db.properties.find((p) => p.id === entry.propertyId);
      if (!property) return null;
      return { ...entry, property };
    })
    .filter((e) => e !== null)
    .sort((a, b) => {
      const order = { menunggu: 0, dihubungi: 1, dikonversi: 2, batal: 3 };
      return (order[a!.status] ?? 0) - (order[b!.status] ?? 0) || new Date(b!.createdAt).getTime() - new Date(a!.createdAt).getTime();
    });
}

export async function getOnboardingStatus() {
  const db = await readDb();
  const userId = await getSessionUserId();
  const pids = await userPropertyIds(db);
  const roomIds = await userRoomIds(db);
  const userSettings = getUserSettings(db, userId);
  const hasProperty = db.properties.some((p) => pids.has(p.id));
  const hasRoom = db.rooms.some((r) => pids.has(r.propertyId));
  const hasTenant = db.tenants.some((t) => roomIds.has(t.roomId) && t.isActive);
  const hasPayment = db.payments.some((p) => roomIds.has(p.roomId));
  const hasSettings = !!userSettings.appUrl?.trim() || xenditOrWhatsappConfigured(userSettings);
  const steps = [
    { id: "property", label: "Tambah properti", done: hasProperty, href: "/properti" },
    { id: "room", label: "Tambah kamar", done: hasRoom, href: "/kamar" },
    { id: "tenant", label: "Masukkan penyewa", done: hasTenant, href: "/penyewa" },
    { id: "payment", label: "Generate tagihan", done: hasPayment, href: "/pembayaran" },
    { id: "settings", label: "Setup pengaturan & integrasi", done: hasSettings, href: "/pengaturan" },
  ];
  const completed = steps.filter((s) => s.done).length;
  return {
    steps,
    completed,
    total: steps.length,
    percent: Math.round((completed / steps.length) * 100),
    isComplete: userSettings.onboardingCompleted || completed === steps.length,
  };
}

function xenditOrWhatsappConfigured(settings: import("./types").Settings): boolean {
  return (
    !!settings.xenditSecretKey?.trim() ||
    !!settings.whatsappApiKey?.trim()
  );
}

export async function globalSearch(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return { tenants: [], rooms: [], properties: [] };
  const db = await readDb();
  const pids = await userPropertyIds(db);
  const roomIds = await userRoomIds(db);
  return {
    tenants: db.tenants.filter((t) => roomIds.has(t.roomId) && (t.name.toLowerCase().includes(q) || t.phone.includes(q))).slice(0, 8),
    rooms: db.rooms.filter((r) => roomIds.has(r.id) && r.number.toLowerCase().includes(q)).slice(0, 8),
    properties: db.properties.filter((p) => pids.has(p.id) && (p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q))).slice(0, 8),
  };
}