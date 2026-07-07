import Link from "next/link";
import { generateMonthlyPayments, markPaymentPaid } from "@/lib/actions";
import { getPayments, getSettings } from "@/lib/queries";
import { resolveAppUrl } from "@/lib/settings";
import {
  buildPaymentPageUrl,
  buildPaymentReminderMessage,
  buildTenantPortalUrl,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";
import { formatDate, formatMonthYear, formatRupiah } from "@/lib/utils";
import { Card, PageTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataCell, DataRow, DataTable } from "@/components/ui/DataTable";
import { MonthPicker } from "@/components/ui/MonthPicker";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BulkWhatsAppButton } from "@/components/BulkWhatsAppButton";
import { PaymentLinkButton } from "@/components/PaymentLinkButton";
import { Wallet } from "lucide-react";

export default async function PembayaranPage({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; tahun?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = Number(params.bulan) || now.getMonth() + 1;
  const year = Number(params.tahun) || now.getFullYear();
  const [payments, settings] = await Promise.all([getPayments(month, year), getSettings()]);
  const appUrl = resolveAppUrl(settings);
  const total = payments.reduce((s, p) => s + p.amount, 0);
  const collected = payments.filter((p) => p.status === "lunas").reduce((s, p) => s + p.amount, 0);

  async function generateAction() {
    "use server";
    await generateMonthlyPayments(month, year);
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="Pembayaran Sewa"
        description={formatMonthYear(month, year)}
        action={
          <div className="flex flex-wrap gap-2">
            <BulkWhatsAppButton />
            <form action={generateAction}>
              <Button type="submit" variant="secondary">Generate Tagihan</Button>
            </form>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="app-stat border-l-4 border-l-[var(--ink)] p-5">
          <p className="text-sm text-[var(--muted)]">Total Tagihan</p>
          <p className="text-2xl font-extrabold text-[var(--ink)]">{formatRupiah(total)}</p>
        </div>
        <div className="app-stat border-l-4 border-l-[var(--success)] p-5">
          <p className="text-sm text-[var(--muted)]">Terkumpul</p>
          <p className="text-2xl font-extrabold text-[var(--success)]">{formatRupiah(collected)}</p>
        </div>
        <div className="app-stat border-l-4 border-l-[var(--danger)] p-5">
          <p className="text-sm text-[var(--muted)]">Belum Lunas</p>
          <p className="text-2xl font-extrabold text-[var(--danger)]">{formatRupiah(total - collected)}</p>
        </div>
      </div>

      <MonthPicker month={month} year={year} />

      <Card>
        {payments.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="Belum ada tagihan"
            description={`Generate tagihan untuk ${formatMonthYear(month, year)} atau pilih periode lain.`}
            action={
              <form action={generateAction}>
                <Button type="submit">Generate Sekarang</Button>
              </form>
            }
          />
        ) : (
          <DataTable
            columns={[
              { label: "Penyewa" },
              { label: "Properti" },
              { label: "Jumlah" },
              { label: "Jatuh Tempo" },
              { label: "Status" },
              { label: "Aksi" },
            ]}
          >
            {payments.map((payment) => {
              const waUrl = buildWhatsAppUrl(payment.tenant.phone, buildPaymentReminderMessage({
                tenantName: payment.tenant.name,
                propertyName: payment.room.property.name,
                roomNumber: payment.room.number,
                amount: payment.amount + payment.lateFee,
                periodMonth: payment.periodMonth,
                periodYear: payment.periodYear,
                dueDate: payment.dueDate,
                ownerName: payment.room.property.ownerName,
                portalUrl: buildTenantPortalUrl(appUrl, payment.tenant.portalToken),
                paymentUrl: buildPaymentPageUrl(appUrl, payment.id),
                variant: "reminder",
              }));
              return (
                <DataRow key={payment.id}>
                  <DataCell className="font-semibold text-[var(--ink)]">
                    <Link href={`/penyewa/${payment.tenant.id}`} className="hover:text-[var(--accent)]">
                      {payment.tenant.name}
                    </Link>
                  </DataCell>
                  <DataCell className="text-[var(--muted)]">{payment.room.property.name} · {payment.room.number}</DataCell>
                  <DataCell className="font-bold">{formatRupiah(payment.amount + payment.lateFee)}</DataCell>
                  <DataCell>{formatDate(payment.dueDate)}</DataCell>
                  <DataCell><StatusBadge status={payment.status} type="payment" /></DataCell>
                  <DataCell>
                    {payment.status !== "lunas" && (
                      <div className="flex flex-wrap gap-1.5">
                        <form action={markPaymentPaid.bind(null, payment.id)}>
                          <Button type="submit" size="sm">Lunas</Button>
                        </form>
                        <WhatsAppButton href={waUrl} />
                        <PaymentLinkButton paymentId={payment.id} />
                      </div>
                    )}
                  </DataCell>
                </DataRow>
              );
            })}
          </DataTable>
        )}
      </Card>
    </div>
  );
}