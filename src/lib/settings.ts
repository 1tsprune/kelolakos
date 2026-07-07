import type { Database, Settings } from "./types";

export function trialEndDateFromNow(days = 30): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const LEGACY_PLAN_MAP: Record<string, Settings["subscriptionPlan"]> = {
  trial: "early_adopter",
  starter: "free",
};

export function normalizeSubscriptionPlan(
  plan: string | undefined,
): Settings["subscriptionPlan"] {
  if (!plan) return "free";
  return LEGACY_PLAN_MAP[plan] ?? (plan as Settings["subscriptionPlan"]);
}

export const defaultSettingsValues: Settings = {
  reminderDaysBefore: 3,
  lateFeePercent: 5,
  dueDayOfMonth: 5,
  monthlyRevenueTarget: 10000000,
  ownerEmail: "pemilik@koskit.id",
  businessName: "KosKit",
  ownerPhone: "",
  appUrl: "",
  whatsappTemplate: "default",
  whatsappApiKey: "",
  whatsappProvider: "fonnte",
  xenditSecretKey: "",
  xenditWebhookToken: "",
  defaultDeposit: 500000,
  electricityRate: 1500,
  waterRate: 5000,
  autoReminderEnabled: true,
  portalWelcomeMessage:
    "Selamat datang di portal penyewa. Bayar tagihan dan laporkan masalah di sini.",
  onboardingCompleted: false,
  subscriptionPlan: "free",
  subscriptionStatus: "active",
  trialEndsAt: "",
  subscriptionEndsAt: null,
  subscriptionOrderId: null,
  pendingSubscriptionPlan: null,
};

export function getTrialDaysLeft(trialEndsAt: string): number {
  if (!trialEndsAt) return 0;
  const diff = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function isEarlyAdopterExpired(settings: Settings): boolean {
  if (settings.subscriptionPlan !== "early_adopter") return false;
  if (!settings.trialEndsAt) return false;
  return new Date(settings.trialEndsAt) < new Date();
}

/** @deprecated use isEarlyAdopterExpired */
export function isTrialExpired(settings: Settings): boolean {
  return isEarlyAdopterExpired(settings);
}

export function getSubscriptionLabel(settings: Settings): string {
  const labels: Record<Settings["subscriptionPlan"], string> = {
    free: "Gratis",
    early_adopter: "Early Adopter",
    pro: "Pro",
    business: "Business",
  };
  return labels[settings.subscriptionPlan];
}

function migrateLegacySettings(overrides: Partial<Settings> & Record<string, unknown>): Partial<Settings> {
  const result = { ...overrides };
  if (!result.xenditSecretKey && typeof overrides.midtransServerKey === "string") {
    result.xenditSecretKey = "";
  }
  delete (result as Record<string, unknown>).midtransServerKey;
  delete (result as Record<string, unknown>).midtransClientKey;
  delete (result as Record<string, unknown>).midtransIsProduction;
  return result;
}

export function createDefaultSettings(overrides: Partial<Settings> = {}): Settings {
  const merged = { ...defaultSettingsValues, ...migrateLegacySettings(overrides as Partial<Settings> & Record<string, unknown>) };
  if (overrides.subscriptionPlan) {
    merged.subscriptionPlan = normalizeSubscriptionPlan(overrides.subscriptionPlan);
  } else if (!merged.subscriptionPlan) {
    merged.subscriptionPlan = "free";
  }
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
      const partial = value as Partial<Settings> & { subscriptionPlan?: string };
      if (partial.subscriptionPlan) {
        partial.subscriptionPlan = normalizeSubscriptionPlan(partial.subscriptionPlan);
      }
      result[userId] = createDefaultSettings(partial);
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

export function xenditConfigured(settings: Settings): boolean {
  return !!settings.xenditSecretKey?.trim();
}

export function xenditModeLabel(settings: Settings): string {
  const key = settings.xenditSecretKey?.trim() ?? "";
  if (!key) return "Mode demo";
  return key.startsWith("xnd_production_") ? "Production" : "Test";
}

export function whatsappConfigured(settings: Settings): boolean {
  return settings.whatsappProvider === "manual" || !!settings.whatsappApiKey?.trim();
}