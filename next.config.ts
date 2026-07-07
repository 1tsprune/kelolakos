import type { NextConfig } from "next";

const allowedDevOrigins = (process.env.ALLOWED_DEV_ORIGINS ?? "192.168.8.165")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg"],
  // Izinkan akses dev dari HP/tablet di jaringan lokal (bukan cuma localhost)
  allowedDevOrigins,
};

export default nextConfig;
