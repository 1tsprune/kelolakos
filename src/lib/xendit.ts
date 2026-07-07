import {
  getSettingsForPayment,
  getUserIdForPayment,
  getUserSettings,
  resolveAppUrl,
  xenditConfigured,
} from "./settings";
import { readDb, writeDb, logActivity, now, enrichPayments } from "./store";

const XENDIT_API = "https://api.xendit.co";

export function generateOrderId(paymentId: string): string {
  return `KOS-${paymentId.slice(-8)}-${Date.now().toString(36)}`;
}

export function xenditAuthHeader(secretKey: string): string {
  return `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
}

export function isXenditProductionKey(secretKey: string): boolean {
  return secretKey.startsWith("xnd_production_");
}

type XenditInvoiceResponse = {
  id: string;
  external_id: string;
  invoice_url: string;
  status: string;
};

export async function createTenantInvoice(paymentId: string): Promise<{
  invoiceUrl: string | null;
  isSimulated: boolean;
  orderId: string;
}> {
  const db = await readDb();
  const settings = getSettingsForPayment(db, paymentId);
  const secretKey = settings.xenditSecretKey?.trim();
  const enriched = await enrichPayments(db, db.payments.filter((p) => p.id === paymentId));
  const payment = enriched[0];
  if (!payment) throw new Error("Pembayaran tidak ditemukan");

  const orderId = payment.paymentOrderId ?? generateOrderId(paymentId);
  const i = db.payments.findIndex((p) => p.id === paymentId);
  if (!payment.paymentOrderId) {
    db.payments[i] = { ...db.payments[i], paymentOrderId: orderId, updatedAt: now() };
    await writeDb(db);
  }

  if (!secretKey) {
    return { invoiceUrl: null, isSimulated: true, orderId };
  }

  const grossAmount = payment.amount + payment.lateFee;
  const periodLabel = new Date(payment.periodYear, payment.periodMonth - 1).toLocaleDateString(
    "id-ID",
    { month: "long", year: "numeric" },
  );
  const baseUrl = resolveAppUrl(settings);
  const description = `Sewa ${payment.room.property.name} Kamar ${payment.room.number} — ${periodLabel}`;

  const body = {
    external_id: orderId,
    amount: grossAmount,
    description,
    invoice_duration: 86400,
    currency: "IDR",
    customer: {
      given_names: payment.tenant.name,
      email: settings.ownerEmail || "tenant@koskit.id",
      mobile_number: payment.tenant.phone?.startsWith("+")
        ? payment.tenant.phone
        : payment.tenant.phone
          ? `+62${payment.tenant.phone.replace(/^0/, "")}`
          : undefined,
    },
    success_redirect_url: `${baseUrl}/bayar/${paymentId}?done=1`,
    failure_redirect_url: `${baseUrl}/bayar/${paymentId}`,
    payment_methods: ["QRIS", "EWALLET", "BANK_TRANSFER"],
  };

  const res = await fetch(`${XENDIT_API}/v2/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: xenditAuthHeader(secretKey),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Xendit error: ${err}`);
  }

  const data = (await res.json()) as XenditInvoiceResponse;
  return { invoiceUrl: data.invoice_url, isSimulated: false, orderId };
}

export async function createPaymentLink(paymentId: string): Promise<{
  orderId: string;
  paymentUrl: string;
  isSimulated: boolean;
}> {
  const db = await readDb();
  const payment = db.payments.find((p) => p.id === paymentId);
  if (!payment) throw new Error("Pembayaran tidak ditemukan");

  const orderId = payment.paymentOrderId ?? generateOrderId(paymentId);
  const i = db.payments.findIndex((p) => p.id === paymentId);
  if (!payment.paymentOrderId) {
    db.payments[i] = { ...db.payments[i], paymentOrderId: orderId, updatedAt: now() };
    await writeDb(db);
  }

  const settings = getSettingsForPayment(db, paymentId);
  const baseUrl = resolveAppUrl(settings);
  const paymentUrl = `${baseUrl}/bayar/${paymentId}`;
  return { orderId, paymentUrl, isSimulated: !xenditConfigured(settings) };
}

export async function simulatePaymentSuccess(paymentId: string): Promise<void> {
  const db = await readDb();
  const i = db.payments.findIndex((p) => p.id === paymentId);
  if (i === -1) throw new Error("Pembayaran tidak ditemukan");
  const timestamp = now();
  db.payments[i] = {
    ...db.payments[i],
    status: "lunas",
    paidAt: timestamp,
    updatedAt: timestamp,
  };
  const tenant = db.tenants.find((t) => t.id === db.payments[i].tenantId);
  await logActivity(
    db,
    "payment",
    `Pembayaran online lunas: ${tenant?.name ?? "penyewa"}`,
    "payment",
    paymentId,
  );
  await writeDb(db);
}

export function verifyXenditCallback(
  callbackToken: string | null,
  expectedToken: string | undefined,
): boolean {
  if (!expectedToken?.trim()) {
    return process.env.NODE_ENV !== "production";
  }
  return callbackToken === expectedToken.trim();
}

export type XenditInvoiceWebhook = {
  id?: string;
  external_id: string;
  status: string;
  amount?: number;
};

export async function handleXenditPaymentWebhook(
  body: XenditInvoiceWebhook,
  callbackToken: string | null,
): Promise<void> {
  if (body.status !== "PAID" && body.status !== "SETTLED") return;

  const db = await readDb();
  const payment = db.payments.find((p) => p.paymentOrderId === body.external_id);
  if (!payment || payment.status === "lunas") return;

  const userId = getUserIdForPayment(db, payment.id);
  if (!userId) return;

  const settings = getUserSettings(db, userId);
  if (!verifyXenditCallback(callbackToken, settings.xenditWebhookToken)) {
    throw new Error("Invalid Xendit callback token");
  }

  const i = db.payments.findIndex((p) => p.id === payment.id);
  const timestamp = now();
  db.payments[i] = { ...db.payments[i], status: "lunas", paidAt: timestamp, updatedAt: timestamp };
  const tenant = db.tenants.find((t) => t.id === payment.tenantId);
  await logActivity(
    db,
    "payment",
    `Xendit lunas: ${tenant?.name ?? "penyewa"}`,
    "payment",
    payment.id,
  );
  await writeDb(db);
}

export async function createXenditInvoice(params: {
  secretKey: string;
  externalId: string;
  amount: number;
  description: string;
  customer: { name: string; email: string; phone?: string };
  successRedirectUrl: string;
  failureRedirectUrl: string;
}): Promise<XenditInvoiceResponse> {
  const res = await fetch(`${XENDIT_API}/v2/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: xenditAuthHeader(params.secretKey),
    },
    body: JSON.stringify({
      external_id: params.externalId,
      amount: params.amount,
      description: params.description,
      invoice_duration: 86400,
      currency: "IDR",
      customer: {
        given_names: params.customer.name,
        email: params.customer.email,
        mobile_number: params.customer.phone,
      },
      success_redirect_url: params.successRedirectUrl,
      failure_redirect_url: params.failureRedirectUrl,
      payment_methods: ["QRIS", "EWALLET", "BANK_TRANSFER"],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Xendit error: ${err}`);
  }

  return (await res.json()) as XenditInvoiceResponse;
}