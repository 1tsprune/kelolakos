import type { Database, Settings } from "./types";
import { isEarlyAdopterExpired } from "./settings";

export type PaidPlan = "pro" | "business";

export type PlanLimits = {
  maxProperties: number | null;
  maxRooms: number | null;
};

export const EARLY_ADOPTER_SLOTS = 50;
export const EARLY_ADOPTER_TRIAL_DAYS = 30;

export const PLAN_LIMITS: Record<Settings["subscriptionPlan"], PlanLimits> = {
  free: { maxProperties: 1, maxRooms: 3 },
  early_adopter: { maxProperties: 5, maxRooms: 50 },
  pro: { maxProperties: 5, maxRooms: 50 },
  business: { maxProperties: null, maxRooms: null },
};

export const PLAN_PRICES: Record<PaidPlan, number> = {
  pro: 199000,
  business: 399000,
};

export const LOCKED_ALLOWED_PREFIXES = [
  "/pengaturan",
  "/api/auth",
  "/api/subscription",
];

export function isAllowedWhenLocked(pathname: string): boolean {
  return LOCKED_ALLOWED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function assignInitialPlan(existingUserCount: number): {
  plan: Settings["subscriptionPlan"];
  trialDays: number | null;
} {
  if (existingUserCount < EARLY_ADOPTER_SLOTS) {
    return { plan: "early_adopter", trialDays: EARLY_ADOPTER_TRIAL_DAYS };
  }
  return { plan: "free", trialDays: null };
}

export function isSubscriptionLocked(settings: Settings): boolean {
  if (settings.subscriptionPlan === "free" || settings.subscriptionPlan === "early_adopter") {
    return false;
  }
  if (settings.subscriptionStatus !== "active") return true;
  if (settings.subscriptionEndsAt && new Date(settings.subscriptionEndsAt) < new Date()) {
    return true;
  }
  return false;
}

export function getPlanLimits(plan: Settings["subscriptionPlan"]): PlanLimits {
  return PLAN_LIMITS[plan];
}

function countUserProperties(db: Database, userId: string): number {
  return db.properties.filter((p) => p.userId === userId).length;
}

function countUserRooms(db: Database, userId: string): number {
  const propertyIds = new Set(
    db.properties.filter((p) => p.userId === userId).map((p) => p.id),
  );
  return db.rooms.filter((r) => propertyIds.has(r.propertyId)).length;
}

export function assertCanAddProperty(
  db: Database,
  userId: string,
  settings: Settings,
): void {
  const limits = getPlanLimits(settings.subscriptionPlan);
  if (limits.maxProperties === null) return;
  const count = countUserProperties(db, userId);
  if (count >= limits.maxProperties) {
    throw new Error(
      `Batas paket: maksimal ${limits.maxProperties} properti. Upgrade paket di Pengaturan.`,
    );
  }
}

export function assertCanAddRoom(
  db: Database,
  userId: string,
  settings: Settings,
): void {
  const limits = getPlanLimits(settings.subscriptionPlan);
  if (limits.maxRooms === null) return;
  const count = countUserRooms(db, userId);
  if (count >= limits.maxRooms) {
    throw new Error(
      `Batas paket: maksimal ${limits.maxRooms} kamar. Upgrade paket di Pengaturan.`,
    );
  }
}

export function subscriptionPeriodEndFromNow(days = 30): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function resolveSubscriptionExpiry(settings: Settings): {
  settings: Settings;
  changed: boolean;
} {
  if (settings.subscriptionPlan === "early_adopter" && isEarlyAdopterExpired(settings)) {
    return {
      settings: {
        ...settings,
        subscriptionPlan: "free",
        subscriptionStatus: "active",
      },
      changed: true,
    };
  }
  return { settings, changed: false };
}