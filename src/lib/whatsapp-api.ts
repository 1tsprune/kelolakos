import { getSessionUserId } from "./auth";
import { getUserSettings, resolveAppUrl } from "./settings";
import { readDb, writeDb, newId, now, enrichPayments } from "./store";
import {
  buildPaymentPageUrl,
  buildPaymentReminderMessage,
  buildTenantPortalUrl,
} from "./whatsapp";

export async function sendWhatsAppMessage(
  phone: string,
  message: string,
  tenantId?: string,
  userId?: string,
): Promise<{ ok: boolean; simulated: boolean }> {
  const db = await readDb();
  const ownerId = userId ?? (await getSessionUserId());
  const settings = getUserSettings(db, ownerId);
  const apiKey = settings.whatsappApiKey?.trim();
  const provider = settings.whatsappProvider;
  const log = {
    id: newId(),
    phone,
    message,
    tenantId: tenantId ?? null,
    createdAt: now(),
    status: "simulated" as const,
  };

  if (!apiKey || provider === "manual") {
    db.whatsappLogs.unshift({ ...log, status: "simulated" });
    db.whatsappLogs = db.whatsappLogs.slice(0, 200);
    await writeDb(db);
    return { ok: true, simulated: true };
  }

  try {
    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: { Authorization: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ target: phone, message, countryCode: "62" }),
    });
    const ok = res.ok;
    db.whatsappLogs.unshift({ ...log, status: ok ? "sent" : "failed" });
    db.whatsappLogs = db.whatsappLogs.slice(0, 200);
    await writeDb(db);
    return { ok, simulated: false };
  } catch {
    db.whatsappLogs.unshift({ ...log, status: "failed" });
    await writeDb(db);
    return { ok: false, simulated: false };
  }
}

export async function sendBulkReminders(): Promise<{
  sent: number;
  simulated: boolean;
}> {
  const db = await readDb();
  const userId = await getSessionUserId();
  const settings = getUserSettings(db, userId);
  const appUrl = resolveAppUrl(settings);
  const pids = new Set(db.properties.filter((p) => p.userId === userId).map((p) => p.id));
  const roomIds = new Set(db.rooms.filter((r) => pids.has(r.propertyId)).map((r) => r.id));
  const nowDate = new Date();
  const month = nowDate.getMonth() + 1;
  const year = nowDate.getFullYear();

  const unpaid = await enrichPayments(
    db,
    db.payments.filter(
      (p) =>
        roomIds.has(p.roomId) &&
        p.periodMonth === month &&
        p.periodYear === year &&
        p.status !== "lunas",
    ),
  );

  let sent = 0;
  let simulated = !settings.whatsappApiKey?.trim() || settings.whatsappProvider === "manual";

  for (const payment of unpaid) {
    const portalUrl = buildTenantPortalUrl(appUrl, payment.tenant.portalToken);
    const paymentUrl = buildPaymentPageUrl(appUrl, payment.id);
    const message = buildPaymentReminderMessage({
      tenantName: payment.tenant.name,
      propertyName: payment.room.property.name,
      roomNumber: payment.room.number,
      amount: payment.amount + payment.lateFee,
      periodMonth: payment.periodMonth,
      periodYear: payment.periodYear,
      dueDate: payment.dueDate,
      ownerName: payment.room.property.ownerName,
      portalUrl,
      paymentUrl,
      variant: "reminder",
    });
    const result = await sendWhatsAppMessage(
      payment.tenant.phone,
      message,
      payment.tenantId,
      userId,
    );
    if (result.ok) sent++;
    simulated = result.simulated;
  }

  return { sent, simulated };
}