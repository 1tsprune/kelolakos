import type { Settings } from "./types";

function midtransBase(isProduction: boolean) {
  return isProduction ? "https://app.midtrans.com" : "https://app.sandbox.midtrans.com";
}

export async function testMidtransConnection(settings: Settings): Promise<{
  ok: boolean;
  message: string;
  mode: "sandbox" | "production" | "demo";
}> {
  const serverKey = settings.midtransServerKey?.trim();
  const clientKey = settings.midtransClientKey?.trim();

  if (!serverKey || !clientKey) {
    return {
      ok: false,
      message: "Server Key & Client Key belum diisi. Kosongkan = mode demo (simulasi bayar).",
      mode: "demo",
    };
  }

  const isProduction = settings.midtransIsProduction;
  const orderId = `TEST-${Date.now().toString(36)}`;

  try {
    const res = await fetch(`${midtransBase(isProduction)}/snap/v1/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
      },
      body: JSON.stringify({
        transaction_details: { order_id: orderId, gross_amount: 10000 },
        credit_card: { secure: true },
      }),
    });

    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        message: "API key tidak valid. Cek Server Key & Client Key di dashboard Midtrans.",
        mode: isProduction ? "production" : "sandbox",
      };
    }

    if (!res.ok) {
      const err = await res.text();
      return {
        ok: false,
        message: `Midtrans menolak: ${err.slice(0, 120)}`,
        mode: isProduction ? "production" : "sandbox",
      };
    }

    const data = (await res.json()) as { token?: string };
    if (!data.token) {
      return { ok: false, message: "Respons Midtrans tidak berisi token.", mode: isProduction ? "production" : "sandbox" };
    }

    return {
      ok: true,
      message: `Terhubung (${isProduction ? "Production" : "Sandbox"}). Snap token berhasil dibuat.`,
      mode: isProduction ? "production" : "sandbox",
    };
  } catch {
    return {
      ok: false,
      message: "Gagal menghubungi Midtrans. Cek koneksi internet.",
      mode: isProduction ? "production" : "sandbox",
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
          message: "Tes koneksi KelolaKos berhasil ✓ Reminder tagihan kos siap dipakai.",
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