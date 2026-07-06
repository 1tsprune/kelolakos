export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatMonthYear(month: number, year: number): string {
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return digits;
}

export function roomStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    kosong: "Kosong",
    terisi: "Terisi",
    maintenance: "Maintenance",
  };
  return labels[status] ?? status;
}

export function paymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    belum: "Belum Bayar",
    lunas: "Lunas",
    terlambat: "Terlambat",
  };
  return labels[status] ?? status;
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    kosong: "bg-[var(--paper-dark)] text-[var(--muted)]",
    terisi: "bg-[var(--teal-soft)] text-[var(--teal)]",
    maintenance: "bg-amber-50 text-[var(--warning)]",
    belum: "bg-red-50 text-[var(--danger)]",
    lunas: "bg-emerald-50 text-[var(--success)]",
    terlambat: "bg-[var(--accent-soft)] text-[var(--accent)]",
    menunggu: "bg-[var(--accent-soft)] text-[var(--accent)]",
    dihubungi: "bg-blue-50 text-blue-700",
    dikonversi: "bg-emerald-50 text-[var(--success)]",
    batal: "bg-[var(--paper-dark)] text-[var(--muted)]",
    open: "bg-red-50 text-[var(--danger)]",
    progress: "bg-blue-50 text-blue-700",
    done: "bg-emerald-50 text-[var(--success)]",
    rendah: "bg-[var(--paper-dark)] text-[var(--muted)]",
    sedang: "bg-amber-50 text-[var(--warning)]",
    tinggi: "bg-red-50 text-[var(--danger)]",
  };
  return colors[status] ?? "bg-[var(--paper-dark)] text-[var(--muted)]";
}

/** Deterministic pseudo-QR from seed string */
export function generateQRPattern(seed: string, grid = 21): boolean[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return Array.from({ length: grid * grid }, (_, i) => {
    const v = (hash * (i + 1) * 2654435761) >>> 0;
    return (v % 3) !== 0;
  });
}

export function daysUntil(date: Date | string): number {
  const target = new Date(date);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}