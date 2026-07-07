import type {
  Activity,
  Database,
  Expense,
  InventoryItem,
  MaintenanceTicket,
  Payment,
  Property,
  Room,
  Settings,
  Tenant,
  UtilityBill,
  WaitlistEntry,
  WhatsAppLog,
} from "./types";

type PropertyRow = {
  id: string;
  user_id: string;
  name: string;
  address: string;
  city: string;
  owner_name: string;
  owner_phone: string;
  notes: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

type RoomRow = {
  id: string;
  property_id: string;
  number: string;
  floor: number;
  monthly_rent: string | number;
  status: string;
  electricity_type: string;
  facilities: string[] | null;
  photo_url: string | null;
  notes: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

type TenantRow = {
  id: string;
  room_id: string;
  name: string;
  phone: string;
  portal_token: string;
  check_in: Date | string;
  is_active: boolean;
  data: Record<string, unknown> | null;
  created_at: Date | string;
  updated_at: Date | string;
};

type PaymentRow = {
  id: string;
  tenant_id: string;
  room_id: string;
  period_month: number;
  period_year: number;
  amount: string | number;
  status: string;
  due_date: Date | string;
  data: Record<string, unknown> | null;
  created_at: Date | string;
  updated_at: Date | string;
};

function iso(d: Date | string): string {
  return d instanceof Date ? d.toISOString() : String(d);
}

function dateOnly(d: Date | string): string {
  const s = iso(d);
  return s.slice(0, 10);
}

function num(v: string | number): number {
  return typeof v === "number" ? v : Number(v);
}

export function rowToProperty(r: PropertyRow): Property {
  return {
    id: r.id,
    userId: r.user_id,
    name: r.name,
    address: r.address,
    city: r.city,
    ownerName: r.owner_name,
    ownerPhone: r.owner_phone,
    notes: r.notes,
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  };
}

export function propertyToRow(p: Property) {
  return [
    p.id, p.userId, p.name, p.address, p.city, p.ownerName, p.ownerPhone, p.notes,
    p.createdAt, p.updatedAt,
  ];
}

export function rowToRoom(r: RoomRow): Room {
  return {
    id: r.id,
    propertyId: r.property_id,
    number: r.number,
    floor: r.floor,
    monthlyRent: num(r.monthly_rent),
    status: r.status as Room["status"],
    electricityType: r.electricity_type as Room["electricityType"],
    facilities: (r.facilities as string[]) ?? [],
    photoUrl: r.photo_url,
    notes: r.notes,
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  };
}

export function roomToRow(r: Room) {
  return [
    r.id, r.propertyId, r.number, r.floor, r.monthlyRent, r.status, r.electricityType,
    JSON.stringify(r.facilities), r.photoUrl, r.notes, r.createdAt, r.updatedAt,
  ];
}

export function rowToTenant(r: TenantRow): Tenant {
  const d = r.data ?? {};
  return {
    id: r.id,
    roomId: r.room_id,
    name: r.name,
    phone: r.phone,
    portalToken: r.portal_token,
    checkIn: dateOnly(r.check_in),
    checkOut: (d.checkOut as string) ?? null,
    contractEndDate: (d.contractEndDate as string) ?? null,
    ktp: (d.ktp as string) ?? null,
    ktpPhotoUrl: (d.ktpPhotoUrl as string) ?? null,
    emergencyContact: (d.emergencyContact as string) ?? null,
    depositAmount: Number(d.depositAmount ?? 500000),
    depositStatus: (d.depositStatus as Tenant["depositStatus"]) ?? "ditahan",
    notes: (d.notes as string) ?? null,
    isActive: r.is_active,
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  };
}

export function tenantToRow(t: Tenant) {
  const data = {
    ktp: t.ktp,
    ktpPhotoUrl: t.ktpPhotoUrl,
    checkOut: t.checkOut,
    contractEndDate: t.contractEndDate,
    emergencyContact: t.emergencyContact,
    depositAmount: t.depositAmount,
    depositStatus: t.depositStatus,
    notes: t.notes,
  };
  return [
    t.id, t.roomId, t.name, t.phone, t.portalToken, dateOnly(t.checkIn), t.isActive,
    JSON.stringify(data), t.createdAt, t.updatedAt,
  ];
}

export function rowToPayment(r: PaymentRow): Payment {
  const d = r.data ?? {};
  return {
    id: r.id,
    tenantId: r.tenant_id,
    roomId: r.room_id,
    periodMonth: r.period_month,
    periodYear: r.period_year,
    amount: num(r.amount),
    status: r.status as Payment["status"],
    dueDate: dateOnly(r.due_date),
    lateFee: Number(d.lateFee ?? 0),
    paidAt: (d.paidAt as string) ?? null,
    proofPhotoUrl: (d.proofPhotoUrl as string) ?? null,
    paymentOrderId: (d.paymentOrderId as string) ?? (d.midtransOrderId as string) ?? null,
    notes: (d.notes as string) ?? null,
    waBillSentAt: (d.waBillSentAt as string) ?? null,
    waReminderSentAt: (d.waReminderSentAt as string) ?? null,
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at ?? r.created_at),
  };
}

export function paymentToRow(p: Payment) {
  const data = {
    lateFee: p.lateFee,
    paidAt: p.paidAt,
    proofPhotoUrl: p.proofPhotoUrl,
    paymentOrderId: p.paymentOrderId,
    notes: p.notes,
    waBillSentAt: p.waBillSentAt,
    waReminderSentAt: p.waReminderSentAt,
  };
  return [
    p.id, p.tenantId, p.roomId, p.periodMonth, p.periodYear, p.amount, p.status,
    dateOnly(p.dueDate), JSON.stringify(data), p.createdAt, p.updatedAt,
  ];
}

export function rowToUtility(r: Record<string, unknown>): UtilityBill {
  return {
    id: r.id as string,
    roomId: r.room_id as string,
    tenantId: (r.tenant_id as string) ?? null,
    type: r.type as UtilityBill["type"],
    periodMonth: r.period_month as number,
    periodYear: r.period_year as number,
    meterStart: num(r.meter_start as string | number),
    meterEnd: num(r.meter_end as string | number),
    ratePerUnit: num(r.rate_per_unit as string | number),
    amount: num(r.amount as string | number),
    status: r.status as UtilityBill["status"],
    paidAt: r.paid_at ? iso(r.paid_at as Date | string) : null,
    createdAt: iso(r.created_at as Date | string),
    updatedAt: iso(r.updated_at as Date | string),
  };
}

export function utilityToRow(u: UtilityBill) {
  return [
    u.id, u.roomId, u.tenantId, u.type, u.periodMonth, u.periodYear,
    u.meterStart, u.meterEnd, u.ratePerUnit, u.amount, u.status, u.paidAt,
    u.createdAt, u.updatedAt,
  ];
}

export function rowToTicket(r: Record<string, unknown>): MaintenanceTicket {
  return {
    id: r.id as string,
    propertyId: r.property_id as string,
    roomId: (r.room_id as string) ?? null,
    title: r.title as string,
    description: r.description as string,
    priority: r.priority as MaintenanceTicket["priority"],
    status: r.status as MaintenanceTicket["status"],
    reportedBy: r.reported_by as string,
    assignedTo: (r.assigned_to as string) ?? null,
    cost: r.cost != null ? num(r.cost as string | number) : null,
    resolvedAt: r.resolved_at ? iso(r.resolved_at as Date | string) : null,
    createdAt: iso(r.created_at as Date | string),
    updatedAt: iso(r.updated_at as Date | string),
  };
}

export function ticketToRow(t: MaintenanceTicket) {
  return [
    t.id, t.propertyId, t.roomId, t.title, t.description, t.priority, t.status,
    t.reportedBy, t.assignedTo, t.cost, t.resolvedAt, t.createdAt, t.updatedAt,
  ];
}

export function rowToExpense(r: Record<string, unknown>): Expense {
  return {
    id: r.id as string,
    propertyId: r.property_id as string,
    category: r.category as Expense["category"],
    description: r.description as string,
    amount: num(r.amount as string | number),
    date: dateOnly(r.date as Date | string),
    createdAt: iso(r.created_at as Date | string),
  };
}

export function expenseToRow(e: Expense) {
  return [e.id, e.propertyId, e.category, e.description, e.amount, e.date, e.createdAt];
}

export function rowToInventory(r: Record<string, unknown>): InventoryItem {
  return {
    id: r.id as string,
    roomId: r.room_id as string,
    name: r.name as string,
    condition: r.condition as InventoryItem["condition"],
    quantity: r.quantity as number,
    value: num(r.value as string | number),
    notes: (r.notes as string) ?? null,
    createdAt: iso(r.created_at as Date | string),
    updatedAt: iso(r.updated_at as Date | string),
  };
}

export function inventoryToRow(i: InventoryItem) {
  return [i.id, i.roomId, i.name, i.condition, i.quantity, i.value, i.notes, i.createdAt, i.updatedAt];
}

export function rowToWaitlist(r: Record<string, unknown>): WaitlistEntry {
  return {
    id: r.id as string,
    propertyId: r.property_id as string,
    name: r.name as string,
    phone: r.phone as string,
    budget: r.budget != null ? num(r.budget as string | number) : null,
    preferredRoom: (r.preferred_room as string) ?? null,
    moveInDate: r.move_in_date ? dateOnly(r.move_in_date as Date | string) : null,
    status: r.status as WaitlistEntry["status"],
    notes: (r.notes as string) ?? null,
    createdAt: iso(r.created_at as Date | string),
    updatedAt: iso(r.updated_at as Date | string),
  };
}

export function waitlistToRow(w: WaitlistEntry) {
  return [
    w.id, w.propertyId, w.name, w.phone, w.budget, w.preferredRoom, w.moveInDate,
    w.status, w.notes, w.createdAt, w.updatedAt,
  ];
}

export function rowToActivity(r: Record<string, unknown>): Activity {
  return {
    id: r.id as string,
    type: r.type as Activity["type"],
    message: r.message as string,
    entityType: r.entity_type as string,
    entityId: r.entity_id as string,
    createdAt: iso(r.created_at as Date | string),
  };
}

export function activityToRow(a: Activity) {
  return [a.id, a.type, a.message, a.entityType, a.entityId, a.createdAt];
}

export function rowToWhatsAppLog(r: Record<string, unknown>): WhatsAppLog {
  return {
    id: r.id as string,
    phone: r.phone as string,
    message: r.message as string,
    status: r.status as WhatsAppLog["status"],
    tenantId: (r.tenant_id as string) ?? null,
    createdAt: iso(r.created_at as Date | string),
  };
}

export function whatsappLogToRow(l: WhatsAppLog) {
  return [l.id, l.phone, l.message, l.status, l.tenantId, l.createdAt];
}

export function settingsFromRows(rows: { user_id: string; settings: Settings }[]): Record<string, Settings> {
  const out: Record<string, Settings> = {};
  for (const r of rows) {
    out[r.user_id] = r.settings;
  }
  return out;
}

export type { Database };