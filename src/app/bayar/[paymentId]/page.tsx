import { notFound, redirect } from "next/navigation";
import { getPaymentForBayar, getSettingsForPayment } from "@/lib/queries";
import { midtransConfigured } from "@/lib/settings";
import { simulatePaymentSuccess } from "@/lib/midtrans";
import { formatMonthYear, formatRupiah } from "@/lib/utils";
import { QRCode } from "@/components/ui/QRCode";
import { MidtransSnap } from "@/components/MidtransSnap";

export default async function BayarPage({
  params,
  searchParams,
}: {
  params: Promise<{ paymentId: string }>;
  searchParams: Promise<{ success?: string; done?: string }>;
}) {
  const { paymentId } = await params;
  const { success } = await searchParams;
  const payment = await getPaymentForBayar(paymentId);
  if (!payment) notFound();

  const settings = await getSettingsForPayment(paymentId);
  const hasMidtrans = midtransConfigured(settings);

  if (success === "1" && payment.status !== "lunas") {
    await simulatePaymentSuccess(paymentId);
    redirect(`/bayar/${paymentId}?done=1`);
  }

  const total = payment.amount + payment.lateFee;
  const isDone = payment.status === "lunas";
  const qrSeed = payment.midtransOrderId ?? payment.id;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--paper)] p-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-xl">
        <div className="bg-[var(--ink)] px-8 py-5 text-white">
          <p className="text-xs font-medium text-white/50">Pembayaran Sewa</p>
          <p className="font-bold">{payment.room.property.name}</p>
          {!hasMidtrans && (
            <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-200">
              Mode Demo
            </span>
          )}
          {hasMidtrans && (
            <span className="mt-2 inline-block rounded-full bg-[var(--success)]/20 px-2 py-0.5 text-[10px] font-bold text-[var(--success)]">
              Midtrans {settings.midtransIsProduction ? "Production" : "Sandbox"}
            </span>
          )}
        </div>

        <div className="p-8">
          {isDone ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)]/10 text-3xl text-[var(--success)]">✓</div>
              <h1 className="font-display text-2xl font-bold text-[var(--success)]">Pembayaran Berhasil</h1>
              <p className="mt-2 text-[var(--muted)]">{formatRupiah(total)} telah diterima</p>
              <p className="mt-4 text-sm text-[var(--muted)]">Terima kasih, {payment.tenant.name}!</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--muted)]">Kamar {payment.room.number} · {payment.tenant.name}</p>
              <p className="mt-1 font-semibold text-[var(--ink)]">{formatMonthYear(payment.periodMonth, payment.periodYear)}</p>

              <div className="mt-5 rounded-xl bg-[var(--paper)] p-4 text-sm">
                <div className="flex justify-between"><span className="text-[var(--muted)]">Sewa</span><span>{formatRupiah(payment.amount)}</span></div>
                {payment.lateFee > 0 && (
                  <div className="flex justify-between text-[var(--danger)]"><span>Denda</span><span>{formatRupiah(payment.lateFee)}</span></div>
                )}
                <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-2 text-lg font-extrabold">
                  <span>Total</span><span className="text-[var(--accent)]">{formatRupiah(total)}</span>
                </div>
              </div>

              {!hasMidtrans && (
                <div className="mt-6 flex flex-col items-center rounded-xl border-2 border-dashed border-[var(--border)] p-6">
                  <QRCode seed={qrSeed} size={168} />
                  <p className="mt-4 text-center text-sm font-semibold text-[var(--ink)]">Preview QR (demo)</p>
                  <p className="text-xs text-[var(--muted)]">Aktifkan Midtrans Snap untuk QRIS asli</p>
                </div>
              )}

              {hasMidtrans && (
                <div className="mt-6 rounded-xl bg-[var(--teal-soft)] p-4 text-sm text-[var(--teal)]">
                  <p className="font-bold">Pembayaran via Midtrans Snap</p>
                  <p className="mt-1 text-xs opacity-80">QRIS · GoPay · ShopeePay · Transfer Bank</p>
                </div>
              )}

              <MidtransSnap paymentId={paymentId} isSimulated={!hasMidtrans} amount={total} />

              <p className="mt-4 text-center font-mono text-[10px] text-[var(--muted)]">
                {payment.midtransOrderId ?? `ORDER-${payment.id.slice(0, 8)}`}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}