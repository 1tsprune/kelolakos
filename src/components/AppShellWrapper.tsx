import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "./AppShell";
import { TrialBanner } from "./TrialBanner";
import { getCurrentUser } from "@/lib/auth";
import { getNotifications, getSettings } from "@/lib/queries";
import { isAllowedWhenLocked, isSubscriptionLocked } from "@/lib/subscription";

export async function AppShellWrapper({ children }: { children: React.ReactNode }) {
  const [notifications, user, settings, headersList] = await Promise.all([
    getNotifications(),
    getCurrentUser(),
    getSettings(),
    headers(),
  ]);
  const pathname = headersList.get("x-pathname") ?? "";

  if (isSubscriptionLocked(settings) && pathname && !isAllowedWhenLocked(pathname)) {
    redirect("/pengaturan?locked=1");
  }

  const highCount = notifications.filter((n) => n.priority === "high").length;
  return (
    <AppShell notificationCount={highCount || notifications.length} userName={user?.name ?? "Pemilik"}>
      <TrialBanner settings={settings} />
      {children}
    </AppShell>
  );
}