import { site } from "./site";
import { formatMonthYear, formatRupiah, normalizePhone } from "./utils";

type ReminderParams = {
  tenantName: string;
  tenantPhone: string;
  propertyName: string;
  roomNumber: string;
  amount: number;
  periodMonth: number;
  periodYear: number;
  dueDate: Date | string;
  ownerName: string;
};

export function buildPaymentReminderMessage(params: ReminderParams): string {
  const due = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(params.dueDate));

  return [
    `Halo ${params.tenantName},`,
    "",
    `Reminder pembayaran sewa *${params.propertyName}* Kamar ${params.roomNumber}.`,
    `Periode: *${formatMonthYear(params.periodMonth, params.periodYear)}*`,
    `Jumlah: *${formatRupiah(params.amount)}*`,
    `Jatuh tempo: *${due}*`,
    "",
    "Mohon segera melakukan pembayaran. Terima kasih.",
    "",
    `— ${params.ownerName}`,
    `_Pesan otomatis via ${site.name}_`,
  ].join("\n");
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizePhone(phone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}