import type { Database, Settings } from "./types";

export function trialEndDateFromNow(days = 14): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const defaultSettingsValues: Settings = {
  reminderDaysBefore: 3,
  lateFeePercent: 5,
  dueDayOfMonth: 5,
  monthlyRevenueTarget: 10000000,
  ownerEmail: "pemilik@koskit.id",
  businessName: "KelolaKos",
  ownerPhone: "",
  appUrl: "",
  whatsappTemplate: "default",
  whatsappApiKey: "",
  whatsappProvider: "fonnte",
  midtransServerKey: "",
  midtransClientKey: "",
  midtransIsProduction: false,
  defaultDeposit: 500000,
  electricityRate: 1500,
  waterRate: 5000,
  autoReminderEnabled: true,
  portalWelcomeMessage:
    "Selamat datang di portal penyewa. Bayar tagihan dan laporkan masalah di sini.",
  onboardingCompleted: false,
  subscriptionPlan: "trial",
  subscriptionStatus: "active",
  trialEndsAt: trialEndDateFromNow(14),
};

export function getTrialDaysLeft(trialEndsAt: string): number {
  if (!trialEndsAt) return 0;
  const diff = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function isTrialExpired(settings: Settings): boolean {
  if (settings.subscriptionPlan !== "trial") return false;
  if (!settings.trialEndsAt) return false;
  return new Date(settings.trialEndsAt) < new Date();
}

export function getSubscriptionLabel(settings: Settings): string {
  const labels: Record<Settings["subscriptionPlan"], string> = {
    trial: "Pro Trial",
    starter: "Starter",
    pro: "Pro",
    business: "Business",
  };
  return labels[settings.subscriptionPlan];
}

export function createDefaultSettings(overrides: Partial<Settings> = {}): Settings {
  const merged = { ...defaultSettingsValues, ...overrides };
  if (!merged.trialEndsAt) merged.trialEndsAt = trialEndDateFromNow(14);
  if (!merged.subscriptionPlan) merged.subscriptionPlan = "trial";
  if (!merged.subscriptionStatus) merged.subscriptionStatus = "active";
  return merged;
}

function isFlatSettings(obj: Record<string, unknown>): boolean {
  return "businessName" in obj || "dueDayOfMonth" in obj || "whatsappProvider" in obj;
}

export function migrateSettings(raw: unknown): Record<string, Settings> {
  if (!raw || typeof raw !== "object") {
    return { user_budi: createDefaultSettings() };
  }

  const obj = raw as Record<string, unknown>;

  if (isFlatSettings(obj)) {
    return { user_budi: createDefaultSettings(obj as Partial<Settings>) };
  }

  const result: Record<string, Settings> = {};
  for (const [userId, value] of Object.entries(obj)) {
    if (value && typeof value === "object") {
      result[userId] = createDefaultSettings(value as Partial<Settings>);
    }
  }

  return Object.keys(result).length > 0 ? result : { user_budi: createDefaultSettings() };
}

export function getUserSettings(db: Database, userId: string): Settings {
  return createDefaultSettings(db.settings[userId]);
}

export function setUserSettings(
  db: Database,
  userId: string,
  patch: Partial<Settings>,
): void {
  db.settings[userId] = { ...getUserSettings(db, userId), ...patch };
}

export function getUserIdForPayment(db: Database, paymentId: string): string | null {
  const payment = db.payments.find((p) => p.id === paymentId);
  if (!payment) return null;
  const room = db.rooms.find((r) => r.id === payment.roomId);
  if (!room) return null;
  const property = db.properties.find((p) => p.id === room.propertyId);
  return property?.userId ?? null;
}

export function getSettingsForPayment(db: Database, paymentId: string): Settings {
  const userId = getUserIdForPayment(db, paymentId);
  return userId ? getUserSettings(db, userId) : createDefaultSettings();
}

export function resolveAppUrl(settings: Settings, fallback?: string): string {
  const trimmed = settings.appUrl?.trim();
  if (trimmed) return trimmed.replace(/\/$/, "");
  if (fallback) return fallback.replace(/\/$/, "");
  return "http://localhost:3000";
}

export function midtransConfigured(settings: Settings): boolean {
  return !!settings.midtransServerKey?.trim() && !!settings.midtransClientKey?.trim();
}

export function whatsappConfigured(settings: Settings): boolean {
  return settings.whatsappProvider === "manual" || !!settings.whatsappApiKey?.trim();
}