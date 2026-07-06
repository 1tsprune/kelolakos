"use client";

import { useEffect, useRef, useState } from "react";

export function StatCounter({
  value,
  suffix = "",
  prefix = "",
  label,
  desc,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  desc: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const duration = 1400;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [started, value]);

  const display =
    prefix +
    (value >= 1000 ? count.toLocaleString("id-ID") : String(count)) +
    suffix;

  return (
    <div ref={ref} className="text-center md:text-left">
      <p className="font-display text-4xl font-bold tabular-nums text-[var(--ink)]">{display}</p>
      <p className="mt-1 text-sm font-bold text-[var(--ink)]">{label}</p>
      <p className="text-xs text-[var(--muted)]">{desc}</p>
    </div>
  );
}