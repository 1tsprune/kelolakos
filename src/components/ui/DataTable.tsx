export function DataTable({
  columns,
  children,
  empty,
}: {
  columns: { label: string; className?: string }[];
  children: React.ReactNode;
  empty?: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--paper)]">
            {columns.map((col) => (
              <th
                key={col.label}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-wider text-[var(--muted)] ${col.className ?? ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {children}
        </tbody>
      </table>
      {empty}
    </div>
  );
}

export function DataRow({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  const className = "transition-colors hover:bg-[var(--paper)]/60";
  if (href) {
    return (
      <tr className={`${className} cursor-pointer`}>
        {children}
      </tr>
    );
  }
  return <tr className={className}>{children}</tr>;
}

export function DataCell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-5 py-4 ${className}`}>{children}</td>;
}