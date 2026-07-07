import type { Settings } from "./types";
import { isXenditProductionKey, xenditAuthHeader } from "./xendit";

const XENDIT_API = "https://api.xendit.co";

export async function testXenditConnection(settings: Settings): Promise<{
  ok: boolean;
  message: string;
  mode: "test" | "production" | "demo";
}> {
  const secretKey = settings.xenditSecretKey?.trim();

  if (!secretKey) {
    return {
      ok: false,
      message: "Secret API Key belum diisi. Kosongkan = mode demo (simulasi bayar).",
      mode: "demo",
    };
  }

  const orderId = `TEST-${Date.now().toString(36)}`;
  const isProduction = isXenditProductionKey(secretKey);

  try {
    const res = await fetch(`${XENDIT_API}/v2/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: xenditAuthHeader(secretKey),
      },
      body: JSON.stringify({
        external_id: orderId,
        amount: 10000,
        description: "Tes koneksi KosKit",
        invoice_duration: 300,
        currency: "IDR",
      }),
    });

    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        message: "API key tidak valid. Cek Secret Key di dashboard.xendit.co.",
        mode: isProduction ? "production" : "test",
      };
    }

    if (!res.ok) {
      const err = await res.text();
      return {
        ok: false,
        message: `Xendit menolak: ${err.slice(0, 120)}`,
        mode: isProduction ? "production" : "test",
      };
    }

    const data = (await res.json()) as { invoice_url?: string };
    if (!data.invoice_url) {
      return {
        ok: false,
        message: "Respons Xendit tidak berisi invoice URL.",
        mode: isProduction ? "production" : "test",
      };
    }

    return {
      ok: true,
      message: `Terhubung (${isProduction ? "Production" : "Test"}). Invoice berhasil dibuat.`,
      mode: isProduction ? "production" : "test",
    };
  } catch {
    return {
      ok: false,
      message: "Gagal menghubungi Xendit. Cek koneksi internet.",
      mode: isProduction ? "production" : "test",
    };
  }
}

export async function testWhatsAppConnection(
  settings: Settings,
  testPhone?: string,
): Promise<{ ok: boolean; message: string; simulated: boolean }> {
  const provider = settings.whatsappProvider;
  const apiKey = settings.whatsappApiKey?.trim();

  if (provider === "manual") {
    return {
      ok: true,
      message: "Mode manual aktif — pesan dibuka lewat wa.me, tanpa biaya API.",
      simulated: true,
    };
  }

  if (!apiKey) {
    return {
      ok: false,
      message: "API Key belum diisi. Kosong = mode simulasi (pesan tidak benar-benar terkirim).",
      simulated: true,
    };
  }

  try {
    const deviceRes = await fetch("https://api.fonnte.com/device", {
      headers: { Authorization: apiKey },
    });

    if (!deviceRes.ok) {
      return {
        ok: false,
        message: "API Key Fonnte tidak valid. Daftar & ambil token di fonnte.com.",
        simulated: false,
      };
    }

    const device = (await deviceRes.json()) as { device?: string; status?: string; name?: string };

    if (testPhone?.trim()) {
      const sendRes = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: { Authorization: apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          target: testPhone.trim(),
          message: "Tes koneksi KosKit berhasil ✓ Reminder tagihan kos siap dipakai.",
          countryCode: "62",
        }),
      });
      if (!sendRes.ok) {
        return {
          ok: false,
          message: `Device terhubung (${device.name ?? device.device ?? "WA"}), tapi gagal kirim tes ke ${testPhone}.`,
          simulated: false,
        };
      }
      return {
        ok: true,
        message: `Fonnte aktif. Pesan tes terkirim ke ${testPhone}.`,
        simulated: false,
      };
    }

    return {
      ok: true,
      message: `Fonnte terhubung — ${device.name ?? device.device ?? "WhatsApp"} (${device.status ?? "online"}).`,
      simulated: false,
    };
  } catch {
    return {
      ok: false,
      message: "Gagal menghubungi Fonnte. Cek API key & status device di dashboard Fonnte.",
      simulated: false,
    };
  }
}