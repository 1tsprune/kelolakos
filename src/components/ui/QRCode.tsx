import { generateQRPattern } from "@/lib/utils";

export function QRCode({ seed, size = 160 }: { seed: string; size?: number }) {
  const cells = generateQRPattern(seed, 21);
  const cellSize = size / 21;

  return (
    <div
      className="rounded-xl bg-white p-3 ring-1 ring-[var(--border)]"
      style={{ width: size + 24, height: size + 24 }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="white" />
        {cells.map((filled, i) => {
          if (!filled) return null;
          const x = (i % 21) * cellSize;
          const y = Math.floor(i / 21) * cellSize;
          return <rect key={i} x={x} y={y} width={cellSize} height={cellSize} fill="#0c1222" rx={1} />;
        })}
        {/* Finder patterns */}
        {[0, 14].map((offset) =>
          [0, 14].map((offsetY) => (
            <g key={`${offset}-${offsetY}`}>
              <rect x={offset * cellSize} y={offsetY * cellSize} width={7 * cellSize} height={7 * cellSize} fill="#0c1222" rx={2} />
              <rect x={(offset + 1) * cellSize} y={(offsetY + 1) * cellSize} width={5 * cellSize} height={5 * cellSize} fill="white" rx={1} />
              <rect x={(offset + 2) * cellSize} y={(offsetY + 2) * cellSize} width={3 * cellSize} height={3 * cellSize} fill="#0c1222" />
            </g>
          )),
        )}
      </svg>
    </div>
  );
}