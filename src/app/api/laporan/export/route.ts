import { NextRequest, NextResponse } from "next/server";
import { getReportData } from "@/lib/queries";
import { formatMonthYear } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const now = new Date();
  const month = Number(searchParams.get("bulan")) || now.getMonth() + 1;
  const year = Number(searchParams.get("tahun")) || now.getFullYear();

  const report = await getReportData(month, year);

  const headers = [
    "Penyewa",
    "Properti",
    "Kamar",
    "Periode",
    "Jumlah",
    "Status",
    "Tanggal Bayar",
  ];

  const rows = report.payments.map((p) => [
    p.tenant.name,
    p.room.property.name,
    p.room.number,
    formatMonthYear(p.periodMonth, p.periodYear),
    String(p.amount),
    p.status,
    p.paidAt ? new Date(p.paidAt).toISOString().split("T")[0] : "",
  ]);

  const summary = [
    [],
    ["RINGKASAN"],
    ["Periode", formatMonthYear(month, year)],
    ["Target Pendapatan", String(report.totalExpected)],
    ["Terkumpul", String(report.totalCollected)],
    ["Belum Lunas", String(report.totalPending)],
  ];

  const escape = (row: string[]) =>
    row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",");

  const csv = [headers, ...rows, ...summary].map(escape).join("\n");

  const bom = "\uFEFF";
  const filename = `laporan-koskit-${year}-${String(month).padStart(2, "0")}.csv`;

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}