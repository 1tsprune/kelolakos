import { AppShell } from "./AppShell";
import { TrialBanner } from "./TrialBanner";
import { getCurrentUser } from "@/lib/auth";
import { getNotifications, getSettings } from "@/lib/queries";

export async function AppShellWrapper({ children }: { children: React.ReactNode }) {
  const [notifications, user, settings] = await Promise.all([
    getNotifications(),
    getCurrentUser(),
    getSettings(),
  ]);
  const highCount = notifications.filter((n) => n.priority === "high").length;
  return (
    <AppShell notificationCount={highCount || notifications.length} userName={user?.name ?? "Pemilik"}>
      <TrialBanner settings={settings} />
      {children}
    </AppShell>
  );
}