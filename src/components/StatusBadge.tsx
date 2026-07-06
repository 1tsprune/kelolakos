import { paymentStatusLabel, roomStatusLabel, statusColor } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  type?: "room" | "payment";
};

export function StatusBadge({ status, type = "room" }: StatusBadgeProps) {
  const label =
    type === "payment" ? paymentStatusLabel(status) : roomStatusLabel(status);

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(status)}`}
    >
      {label}
    </span>
  );
}