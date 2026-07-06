import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { getReportData } from "./queries";
import { site } from "./site";
import { formatMonthYear } from "./utils";

/** Format aman untuk jsPDF — hindari karakter unicode dari Intl currency */
function formatRupiahPdf(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const value = Math.abs(Math.round(amount))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}Rp ${value}`;
}

type ReportData = Awaited<ReturnType<typeof getReportData>>;

type ReportMeta = {
  businessName: string;
  ownerEmail?: string;
  ownerPhone?: string;
};

type DocWithTable = jsPDF & { lastAutoTable: { finalY: number } };

const COLORS = {
  accent: [26, 107, 92] as [number, number, number],
  ink: [12, 18, 34] as [number, number, number],
  muted: [92, 100, 120] as [number, number, number],
  success: [26, 127, 75] as [number, number, number],
  danger: [197, 48, 48] as [number, number, number],
  paper: [246, 243, 236] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  border: [217, 210, 196] as [number, number, number],
};

const MARGIN = 14;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;

function paymentStatusLabel(status: string): string {
  if (status === "lunas") return "Lunas";
  if (status === "terlambat") return "Terlambat";
  return "Belum bayar";
}

function drawPageFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const y = 287;
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y - 4, PAGE_W - MARGIN, y - 4);

  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  doc.text(
    `Dibuat otomatis oleh ${site.name} · ${site.url.replace(/^https?:\/\//, "")}`,
    MARGIN,
    y,
  );
  doc.text(`Halaman ${pageNum} / ${totalPages}`, PAGE_W - MARGIN, y, { align: "right" });
}

function drawHeader(doc: jsPDF, meta: ReportMeta, period: string) {
  doc.setFillColor(...COLORS.ink);
  doc.rect(0, 0, PAGE_W, 28, "F");
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 28, PAGE_W, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.white);
  doc.text(site.name.toUpperCase(), MARGIN, 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(200, 205, 215);
  const printed = new Date().toLocaleDateString("id-ID", { dateStyle: "long" });
  doc.text(`Dicetak ${printed}`, PAGE_W - MARGIN, 11, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.ink);
  doc.text(meta.businessName || "Laporan Kos", MARGIN, 44);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.muted);
  doc.text(`Laporan Keuangan — ${period}`, MARGIN, 52);

  if (meta.ownerEmail || meta.ownerPhone) {
    doc.setFontSize(9);
    const contact = [meta.ownerEmail, meta.ownerPhone].filter(Boolean).join(" · ");
    doc.text(contact, MARGIN, 58);
  }
}

function drawKpiCards(
  doc: jsPDF,
  report: ReportData,
  startY: number,
): number {
  const collectionRate =
    report.totalExpected > 0
      ? Math.round((report.totalCollected / report.totalExpected) * 100)
      : 0;

  const cards = [
    { label: "Target Sewa", value: formatRupiahPdf(report.totalExpected), color: COLORS.ink },
    { label: "Terkumpul", value: formatRupiahPdf(report.totalCollected), color: COLORS.success },
    { label: "Belum Lunas", value: formatRupiahPdf(report.totalPending), color: COLORS.danger },
    { label: "Laba Bersih", value: formatRupiahPdf(report.netIncome), color: report.netIncome >= 0 ? COLORS.success : COLORS.danger },
  ];

  const gap = 4;
  const cardW = (CONTENT_W - gap * 3) / 4;
  const cardH = 26;
  let x = MARGIN;

  for (const card of cards) {
    doc.setFillColor(...COLORS.paper);
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, startY, cardW, cardH, 2, 2, "FD");

    doc.setFillColor(...card.color);
    doc.rect(x, startY, cardW, 2.5, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text(card.label, x + 4, startY + 9);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...card.color);
    doc.text(card.value, x + 4, startY + 18, { maxWidth: cardW - 8 });
    x += cardW + gap;
  }

  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(MARGIN, startY + cardH + 6, 52, 8, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.white);
  doc.text(`Koleksi ${collectionRate}%`, MARGIN + 4, startY + cardH + 11.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text(
    `Pengeluaran operasional: ${formatRupiahPdf(report.totalExpenses)}`,
    MARGIN + 58,
    startY + cardH + 11.5,
  );

  return startY + cardH + 18;
}

function sectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.ink);
  doc.text(title, MARGIN, y);
  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, y + 2, MARGIN + 28, y + 2);
  return y + 10;
}

function tableStyles(headColor: [number, number, number]) {
  return {
    theme: "plain" as const,
    headStyles: {
      fillColor: headColor,
      textColor: COLORS.white,
      fontStyle: "bold" as const,
      fontSize: 9,
      cellPadding: { top: 4, right: 4, bottom: 4, left: 4 },
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.ink,
      cellPadding: { top: 3.5, right: 4, bottom: 3.5, left: 4 },
    },
    alternateRowStyles: { fillColor: [252, 250, 246] as [number, number, number] },
    margin: { left: MARGIN, right: MARGIN },
    styles: { lineColor: COLORS.border, lineWidth: 0.2 },
  };
}

export function generateReportPdf(report: ReportData, meta: ReportMeta): Uint8Array {
  const doc = new jsPDF();
  const period = formatMonthYear(report.month, report.year);
  const totalPagesExp = { value: 1 };

  drawHeader(doc, meta, period);
  let cursorY = drawKpiCards(doc, report, 68);

  if (report.properties.length > 0) {
    cursorY = sectionTitle(doc, "Ringkasan per Properti", cursorY);

    const propertyRows = report.properties.map((property) => {
      const occupied = property.rooms.filter((r) => r.status === "terisi").length;
      const total = property.rooms.length;
      const occupancy = total > 0 ? Math.round((occupied / total) * 100) : 0;
      const revenue = property.rooms
        .filter((r) => r.status === "terisi")
        .reduce((s, r) => s + r.monthlyRent, 0);
      return [property.name, `${occupied}/${total}`, `${occupancy}%`, formatRupiahPdf(revenue)];
    });

    autoTable(doc, {
      startY: cursorY,
      head: [["Properti", "Terisi", "Hunian", "Potensi Sewa"]],
      body: propertyRows,
      ...tableStyles(COLORS.ink),
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "right", fontStyle: "bold", textColor: COLORS.success },
      },
    });
    cursorY = (doc as DocWithTable).lastAutoTable.finalY + 10;
  }

  cursorY = sectionTitle(doc, "Rincian Pembayaran Sewa", cursorY);

  const paymentsBody = report.payments.map((p) => [
    p.tenant.name,
    `${p.room.property.name} / ${p.room.number}`,
    formatRupiahPdf(p.amount),
    paymentStatusLabel(p.status),
  ]);

  autoTable(doc, {
    startY: cursorY,
    head: [["Penyewa", "Properti / Kamar", "Jumlah", "Status"]],
    body: paymentsBody.length ? paymentsBody : [["—", "Tidak ada data", "—", "—"]],
    foot: [
      [
        { content: "Total Terkumpul", colSpan: 2, styles: { fontStyle: "bold", fillColor: COLORS.paper } },
        { content: formatRupiahPdf(report.totalCollected), styles: { fontStyle: "bold", halign: "right", textColor: COLORS.success } },
        "",
      ],
      [
        { content: "Total Belum Lunas", colSpan: 2, styles: { fontStyle: "bold", fillColor: COLORS.paper } },
        { content: formatRupiahPdf(report.totalPending), styles: { fontStyle: "bold", halign: "right", textColor: COLORS.danger } },
        "",
      ],
    ],
    ...tableStyles(COLORS.success),
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "center" },
    },
    didParseCell(data) {
      if (data.section === "body" && data.column.index === 3) {
        const val = String(data.cell.raw);
        if (val === "Lunas") data.cell.styles.textColor = COLORS.success;
        else if (val === "Terlambat" || val === "Belum bayar") data.cell.styles.textColor = COLORS.danger;
        data.cell.styles.fontStyle = "bold";
      }
    },
    didDrawPage: (data) => {
      totalPagesExp.value = data.doc.getNumberOfPages();
    },
  });

  cursorY = (doc as DocWithTable).lastAutoTable.finalY + 10;

  if (report.expenses.length > 0) {
    if (cursorY > 240) {
      doc.addPage();
      cursorY = 20;
    }
    cursorY = sectionTitle(doc, "Pengeluaran Operasional", cursorY);

    autoTable(doc, {
      startY: cursorY,
      head: [["Deskripsi", "Kategori", "Jumlah"]],
      body: report.expenses.map((e) => [e.description, e.category, formatRupiahPdf(e.amount)]),
      foot: [[
        { content: "Total Pengeluaran", colSpan: 2, styles: { fontStyle: "bold", fillColor: COLORS.paper } },
        { content: formatRupiahPdf(report.totalExpenses), styles: { fontStyle: "bold", halign: "right", textColor: COLORS.danger } },
      ]],
      ...tableStyles(COLORS.danger),
      columnStyles: {
        2: { halign: "right", fontStyle: "bold", textColor: COLORS.danger },
      },
      didDrawPage: (data) => {
        totalPagesExp.value = data.doc.getNumberOfPages();
      },
    });

    cursorY = (doc as DocWithTable).lastAutoTable.finalY + 10;
  }

  if (cursorY > 255) {
    doc.addPage();
    cursorY = 20;
  }

  const netColor = report.netIncome >= 0 ? COLORS.success : COLORS.danger;
  const boxH = 26;
  doc.setFillColor(...COLORS.paper);
  doc.setDrawColor(...netColor);
  doc.setLineWidth(0.6);
  doc.roundedRect(MARGIN, cursorY, CONTENT_W, boxH, 3, 3, "FD");
  doc.setFillColor(...netColor);
  doc.rect(MARGIN, cursorY, 4, boxH, "F");

  const labelY = cursorY + 10;
  const detailY = cursorY + 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.ink);
  doc.text("Laba Bersih Bulan Ini", MARGIN + 10, labelY);

  doc.setFontSize(13);
  doc.setTextColor(...netColor);
  doc.text(formatRupiahPdf(report.netIncome), PAGE_W - MARGIN - 6, labelY, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text(
    `${formatRupiahPdf(report.totalCollected)} masuk  -  ${formatRupiahPdf(report.totalExpenses)} keluar`,
    MARGIN + 10,
    detailY,
  );

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageFooter(doc, i, totalPages);
  }

  return new Uint8Array(doc.output("arraybuffer"));
}