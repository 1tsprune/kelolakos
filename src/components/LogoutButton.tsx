"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/masuk");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="rounded-xl p-2.5 text-[var(--muted)] transition-colors hover:bg-red-50 hover:text-[var(--danger)]"
      title="Keluar"
    >
      <LogOut className="h-5 w-5" />
    </button>
  );
}