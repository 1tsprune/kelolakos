import { site } from "./site";
import { formatMonthYear, formatRupiah, normalizePhone } from "./utils";

type ReminderParams = {
  tenantName: string;
  propertyName: string;
  roomNumber: string;
  amount: number;
  periodMonth: number;
  periodYear: number;
  dueDate: Date | string;
  ownerName: string;
  portalUrl: string;
  paymentUrl?: string;
  variant?: "reminder" | "due";
};

type PortalWelcomeParams = {
  tenantName: string;
  propertyName: string;
  roomNumber: string;
  ownerName: string;
  portalUrl: string;
};

export function buildTenantPortalUrl(appUrl: string, portalToken: string): string {
  return `${appUrl.replace(/\/$/, "")}/portal/${portalToken}`;
}

export function buildPaymentPageUrl(appUrl: string, paymentId: string): string {
  return `${appUrl.replace(/\/$/, "")}/bayar/${paymentId}`;
}

function formatDueDate(dueDate: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dueDate));
}

export function buildPortalWelcomeMessage(params: PortalWelcomeParams): string {
  return [
    `Halo ${params.tenantName},`,
    "",
    `Selamat datang di *${params.propertyName}* Kamar ${params.roomNumber}.`,
    "",
    "Portal penyewa kamu — simpan link ini untuk cek tagihan & bayar QRIS:",
    params.portalUrl,
    "",
    "Lewat portal kamu bisa lihat tagihan, riwayat bayar, dan lapor masalah kamar.",
    "",
    `— ${params.ownerName}`,
    `_Pesan otomatis via ${site.name}_`,
  ].join("\n");
}

export function buildPaymentReminderMessage(params: ReminderParams): string {
  const due = formatDueDate(params.dueDate);
  const isDue = params.variant === "due";
  const intro = isDue
    ? `Tagihan sewa *${params.propertyName}* Kamar ${params.roomNumber} jatuh tempo *hari ini*.`
    : `Reminder pembayaran sewa *${params.propertyName}* Kamar ${params.roomNumber}.`;

  const lines = [
    `Halo ${params.tenantName},`,
    "",
    intro,
    `Periode: *${formatMonthYear(params.periodMonth, params.periodYear)}*`,
    `Jumlah: *${formatRupiah(params.amount)}*`,
    `Jatuh tempo: *${due}*`,
    "",
    "Cek & bayar lewat portal penyewa:",
    params.portalUrl,
  ];

  if (params.paymentUrl) {
    lines.push("", "Atau bayar langsung:", params.paymentUrl);
  }

  lines.push(
    "",
    isDue ? "Mohon segera melakukan pembayaran. Terima kasih." : "Mohon siapkan pembayaran sebelum jatuh tempo. Terima kasih.",
    "",
    `— ${params.ownerName}`,
    `_Pesan otomatis via ${site.name}_`,
  );

  return lines.join("\n");
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizePhone(phone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}