export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  createdAt: string;
};

export type Property = {
  id: string;
  userId: string;
  name: string;
  address: string;
  city: string;
  ownerName: string;
  ownerPhone: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Room = {
  id: string;
  propertyId: string;
  number: string;
  floor: number;
  monthlyRent: number;
  status: "kosong" | "terisi" | "maintenance";
  electricityType: "termasuk" | "meteran";
  facilities: string[];
  photoUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Tenant = {
  id: string;
  roomId: string;
  name: string;
  phone: string;
  ktp: string | null;
  ktpPhotoUrl: string | null;
  portalToken: string;
  checkIn: string;
  checkOut: string | null;
  contractEndDate: string | null;
  emergencyContact: string | null;
  depositAmount: number;
  depositStatus: "ditahan" | "dikembalikan" | "dipotong";
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WaitlistEntry = {
  id: string;
  propertyId: string;
  name: string;
  phone: string;
  budget: number | null;
  preferredRoom: string | null;
  moveInDate: string | null;
  status: "menunggu" | "dihubungi" | "dikonversi" | "batal";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Payment = {
  id: string;
  tenantId: string;
  roomId: string;
  periodMonth: number;
  periodYear: number;
  amount: number;
  lateFee: number;
  dueDate: string;
  paidAt: string | null;
  status: "belum" | "lunas" | "terlambat";
  proofPhotoUrl: string | null;
  midtransOrderId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UtilityBill = {
  id: string;
  roomId: string;
  tenantId: string | null;
  type: "listrik" | "air";
  periodMonth: number;
  periodYear: number;
  meterStart: number;
  meterEnd: number;
  ratePerUnit: number;
  amount: number;
  status: "belum" | "lunas";
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MaintenanceTicket = {
  id: string;
  propertyId: string;
  roomId: string | null;
  title: string;
  description: string;
  priority: "rendah" | "sedang" | "tinggi";
  status: "open" | "progress" | "done";
  reportedBy: string;
  assignedTo: string | null;
  cost: number | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
};

export type Expense = {
  id: string;
  propertyId: string;
  category: "listrik" | "air" | "gaji" | "perbaikan" | "kebersihan" | "lainnya";
  description: string;
  amount: number;
  date: string;
  createdAt: string;
};

export type Activity = {
  id: string;
  type: "payment" | "tenant" | "maintenance" | "utility" | "expense" | "property" | "system";
  message: string;
  entityType: string;
  entityId: string;
  createdAt: string;
};

export type WhatsAppLog = {
  id: string;
  phone: string;
  message: string;
  status: "sent" | "failed" | "simulated";
  tenantId: string | null;
  createdAt: string;
};

export type Settings = {
  reminderDaysBefore: number;
  lateFeePercent: number;
  dueDayOfMonth: number;
  monthlyRevenueTarget: number;
  ownerEmail: string;
  ownerPhone: string;
  businessName: string;
  appUrl: string;
  whatsappTemplate: string;
  whatsappApiKey: string;
  whatsappProvider: "fonnte" | "waba" | "manual";
  midtransServerKey: string;
  midtransClientKey: string;
  midtransIsProduction: boolean;
  defaultDeposit: number;
  electricityRate: number;
  waterRate: number;
  autoReminderEnabled: boolean;
  portalWelcomeMessage: string;
  onboardingCompleted: boolean;
  subscriptionPlan: "trial" | "starter" | "pro" | "business";
  subscriptionStatus: "active" | "expired" | "cancelled";
  trialEndsAt: string;
};

export type InventoryItem = {
  id: string;
  roomId: string;
  name: string;
  condition: "baik" | "rusak_ringan" | "rusak_berat" | "hilang";
  quantity: number;
  value: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Database = {
  properties: Property[];
  rooms: Room[];
  tenants: Tenant[];
  payments: Payment[];
  utilityBills: UtilityBill[];
  maintenanceTickets: MaintenanceTicket[];
  expenses: Expense[];
  activities: Activity[];
  whatsappLogs: WhatsAppLog[];
  inventoryItems: InventoryItem[];
  waitlistEntries: WaitlistEntry[];
  settings: Record<string, Settings>;
};