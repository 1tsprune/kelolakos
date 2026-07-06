"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({
  children,
  notificationCount = 0,
  userName = "Pemilik",
}: {
  children: React.ReactNode;
  notificationCount?: number;
  userName?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--paper)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} className="print:hidden" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="print:hidden">
        <TopBar
          notificationCount={notificationCount}
          userName={userName}
          onMenuClick={() => setSidebarOpen(true)}
        />
        </div>
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}