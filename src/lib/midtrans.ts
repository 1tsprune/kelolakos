import crypto from "crypto";
import { getSettingsForPayment, getUserIdForPayment, getUserSettings, midtransConfigured, resolveAppUrl } from "./settings";
import { readDb, writeDb, logActivity, now, enrichPayments } from "./store";

export function generateOrderId(paymentId: string): string {
  return `KOS-${paymentId.slice(-8)}-${Date.now().toString(36)}`;
}

function midtransBase(isProduction: boolean) {
  return isProduction ? "https://app.midtrans.com" : "https://app.sandbox.midtrans.com";
}

export async function createSnapToken(paymentId: string): Promise<{
  token: string | null;
  clientKey: string;
  isProduction: boolean;
  isSimulated: boolean;
  orderId: string;
}> {
  const db = await readDb();
  const settings = getSettingsForPayment(db, paymentId);
  const serverKey = settings.midtransServerKey?.trim();
  const clientKey = settings.midtransClientKey?.trim() ?? "";
  const isProduction = settings.midtransIsProduction;
  const enriched = await enrichPayments(db, db.payments.filter((p) => p.id === paymentId));
  const payment = enriched[0];
  if (!payment) throw new Error("Pembayaran tidak ditemukan");

  const orderId = payment.midtransOrderId ?? generateOrderId(paymentId);
  const i = db.payments.findIndex((p) => p.id === paymentId);
  if (!payment.midtransOrderId) {
    db.payments[i] = { ...db.payments[i], midtransOrderId: orderId, updatedAt: now() };
    await writeDb(db);
  }

  if (!serverKey || !clientKey) {
    return { token: null, clientKey, isProduction, isSimulated: true, orderId };
  }

  const grossAmount = payment.amount + payment.lateFee;
  const periodLabel = new Date(payment.periodYear, payment.periodMonth - 1).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const body = {
    transaction_details: {
      order_id: orderId,
      gross_amount: grossAmount,
    },
    item_details: [
      {
        id: payment.roomId,
        price: grossAmount,
        quantity: 1,
        name: `Sewa ${payment.room.property.name} Kamar ${payment.room.number} - ${periodLabel}`,
      },
    ],
    customer_details: {
      first_name: payment.tenant.name,
      phone: payment.tenant.phone,
      email: settings.ownerEmail || "tenant@koskit.id",
    },
    enabled_payments: ["other_qris", "gopay", "shopeepay", "bank_transfer"],
  };

  const res = await fetch(`${midtransBase(isProduction)}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Midtrans error: ${err}`);
  }

  const data = (await res.json()) as { token: string };
  return { token: data.token, clientKey, isProduction, isSimulated: false, orderId };
}

export async function createPaymentLink(paymentId: string): Promise<{
  orderId: string;
  paymentUrl: string;
  isSimulated: boolean;
}> {
  const db = await readDb();
  const payment = db.payments.find((p) => p.id === paymentId);
  if (!payment) throw new Error("Pembayaran tidak ditemukan");

  const orderId = payment.midtransOrderId ?? generateOrderId(paymentId);
  const i = db.payments.findIndex((p) => p.id === paymentId);
  if (!payment.midtransOrderId) {
    db.payments[i] = { ...db.payments[i], midtransOrderId: orderId, updatedAt: now() };
    await writeDb(db);
  }

  const settings = getSettingsForPayment(db, paymentId);
  const baseUrl = resolveAppUrl(settings);
  const paymentUrl = `${baseUrl}/bayar/${paymentId}`;
  const hasMidtrans = midtransConfigured(settings);
  return { orderId, paymentUrl, isSimulated: !hasMidtrans };
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
  await logActivity(db, "payment", `Pembayaran online lunas: ${tenant?.name ?? "penyewa"}`, "payment", paymentId);
  await writeDb(db);
}

export function verifyMidtransSignature(
  body: {
    order_id: string;
    status_code: string;
    gross_amount: string;
    signature_key?: string;
  },
  serverKey: string,
): boolean {
  if (!body.signature_key) return false;
  const payload = `${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`;
  const hash = crypto.createHash("sha512").update(payload).digest("hex");
  return hash === body.signature_key;
}

export async function handleMidtransWebhook(body: {
  order_id: string;
  transaction_status: string;
  fraud_status?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
}): Promise<void> {
  const db = await readDb();
  const payment = db.payments.find((p) => p.midtransOrderId === body.order_id);
  if (!payment) return;

  const userId = getUserIdForPayment(db, payment.id);
  if (!userId) return;

  const settings = getUserSettings(db, userId);
  const serverKey = settings.midtransServerKey?.trim();

  if (serverKey && body.status_code && body.gross_amount) {
    const valid = verifyMidtransSignature(
      {
        order_id: body.order_id,
        status_code: body.status_code,
        gross_amount: body.gross_amount,
        signature_key: body.signature_key,
      },
      serverKey,
    );
    if (!valid) throw new Error("Invalid Midtrans signature");
  }
  const status = body.transaction_status;
  const fraud = body.fraud_status;
  const paid =
    status === "settlement" ||
    (status === "capture" && (!fraud || fraud === "accept"));

  if (!paid) return;

  if (!payment || payment.status === "lunas") return;

  if (["capture", "settlement"].includes(status)) {
    const i = db.payments.findIndex((p) => p.id === payment.id);
    const timestamp = now();
    db.payments[i] = { ...db.payments[i], status: "lunas", paidAt: timestamp, updatedAt: timestamp };
    const tenant = db.tenants.find((t) => t.id === payment.tenantId);
    await logActivity(db, "payment", `Midtrans lunas: ${tenant?.name ?? "penyewa"}`, "payment", payment.id);
    await writeDb(db);
  }
}