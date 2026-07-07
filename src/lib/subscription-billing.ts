import { getSessionUserId } from "./auth";
import { getUserSettings, setUserSettings } from "./settings";
import {
  PLAN_PRICES,
  subscriptionPeriodEndFromNow,
  type PaidPlan,
} from "./subscription";
import { logActivity, now, readDb, writeDb } from "./store";
import type { Settings } from "./types";
import {
  createXenditInvoice,
  verifyXenditCallback,
  type XenditInvoiceWebhook,
} from "./xendit";

export function billingConfigured(): boolean {
  return !!process.env.BILLING_XENDIT_SECRET_KEY?.trim();
}

function getBillingSecretKey(): string {
  return process.env.BILLING_XENDIT_SECRET_KEY?.trim() ?? "";
}

function getBillingWebhookToken(): string {
  return process.env.BILLING_XENDIT_WEBHOOK_TOKEN?.trim() ?? "";
}

export function generateSubscriptionOrderId(userId: string, plan: PaidPlan): string {
  return `SUB-${plan.toUpperCase()}-${userId.slice(-6)}-${Date.now().toString(36)}`;
}

export async function createSubscriptionCheckout(plan: PaidPlan): Promise<{
  invoiceUrl: string | null;
  isSimulated: boolean;
  orderId: string;
  amount: number;
}> {
  if (!["pro", "business"].includes(plan)) {
    throw new Error("Paket tidak valid");
  }

  const userId = await getSessionUserId();
  const db = await readDb();
  const settings = getUserSettings(db, userId);
  const amount = PLAN_PRICES[plan];
  const orderId = generateSubscriptionOrderId(userId, plan);

  setUserSettings(db, userId, {
    subscriptionOrderId: orderId,
    pendingSubscriptionPlan: plan,
  });
  await writeDb(db);

  const secretKey = getBillingSecretKey();
  if (!secretKey) {
    return { invoiceUrl: null, isSimulated: true, orderId, amount };
  }

  const { readUsers } = await import("./users-store");
  const u = (await readUsers()).find((user) => user.id === userId);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const invoice = await createXenditInvoice({
    secretKey,
    externalId: orderId,
    amount,
    description: `KosKit ${plan.charAt(0).toUpperCase() + plan.slice(1)} — 1 bulan`,
    customer: {
      name: u?.name ?? settings.businessName,
      email: settings.ownerEmail || u?.email || "owner@koskit.id",
      phone: settings.ownerPhone || u?.phone,
    },
    successRedirectUrl: `${baseUrl.replace(/\/$/, "")}/pengaturan?upgraded=1`,
    failureRedirectUrl: `${baseUrl.replace(/\/$/, "")}/pengaturan`,
  });

  return { invoiceUrl: invoice.invoice_url, isSimulated: false, orderId, amount };
}

export async function activateSubscription(
  userId: string,
  plan: PaidPlan,
  orderId: string,
): Promise<void> {
  const db = await readDb();
  setUserSettings(db, userId, {
    subscriptionPlan: plan,
    subscriptionStatus: "active",
    subscriptionEndsAt: subscriptionPeriodEndFromNow(30),
    subscriptionOrderId: orderId,
    pendingSubscriptionPlan: null,
  });
  await logActivity(
    db,
    "system",
    `Langganan ${plan} aktif (order ${orderId})`,
    "subscription",
    userId,
  );
  await writeDb(db);
}

export async function simulateSubscriptionPayment(plan: PaidPlan): Promise<void> {
  const userId = await getSessionUserId();
  const db = await readDb();
  const settings = getUserSettings(db, userId);
  const orderId = settings.subscriptionOrderId ?? generateSubscriptionOrderId(userId, plan);
  await activateSubscription(userId, plan, orderId);
}

export async function handleSubscriptionWebhook(
  body: XenditInvoiceWebhook,
  callbackToken: string | null,
): Promise<boolean> {
  if (!body.external_id.startsWith("SUB-")) return false;
  if (body.status !== "PAID" && body.status !== "SETTLED") return true;

  if (!verifyXenditCallback(callbackToken, getBillingWebhookToken())) {
    throw new Error("Invalid Xendit callback token");
  }

  const parts = body.external_id.split("-");
  const planToken = parts[1]?.toLowerCase();
  if (!planToken || !["pro", "business"].includes(planToken)) return true;

  const db = await readDb();
  const userEntry = Object.entries(db.settings).find(
    ([, s]) => s.subscriptionOrderId === body.external_id,
  );
  if (!userEntry) return true;

  const [userId, settings] = userEntry;
  if (settings.subscriptionPlan === planToken && settings.subscriptionStatus === "active") {
    return true;
  }

  await activateSubscription(userId, planToken as PaidPlan, body.external_id);
  return true;
}

export function getPendingPlan(settings: Settings): PaidPlan | null {
  return settings.pendingSubscriptionPlan ?? null;
}