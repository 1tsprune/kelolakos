import { NextRequest, NextResponse } from "next/server";
import { getReportData, getSettings } from "@/lib/queries";
import { generateReportPdf } from "@/lib/pdf-report";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const now = new Date();
  const month = Number(searchParams.get("bulan")) || now.getMonth() + 1;
  const year = Number(searchParams.get("tahun")) || now.getFullYear();

  const [report, settings] = await Promise.all([getReportData(month, year), getSettings()]);
  const pdf = generateReportPdf(report, {
    businessName: settings.businessName,
    ownerEmail: settings.ownerEmail,
    ownerPhone: settings.ownerPhone,
  });
  const filename = `laporan-${year}-${String(month).padStart(2, "0")}.pdf`;

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}