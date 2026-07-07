import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

type BrandLogoProps = {
  variant?: "mark" | "full";
  size?: "xs" | "sm" | "md" | "lg";
  href?: string | null;
  className?: string;
  inverted?: boolean;
};

const sizes = {
  xs: { mark: 28, full: { w: 100, h: 26 } },
  sm: { mark: 32, full: { w: 120, h: 30 } },
  md: { mark: 36, full: { w: 140, h: 36 } },
  lg: { mark: 44, full: { w: 168, h: 42 } },
} as const;

export function BrandLogo({
  variant = "mark",
  size = "md",
  href = "/",
  className = "",
  inverted = false,
}: BrandLogoProps) {
  const s = sizes[size];
  const src = variant === "full" ? "/brand/logo.svg" : "/brand/icon.svg";
  const alt = site.name;
  const dims =
    variant === "full"
      ? { width: s.full.w, height: s.full.h }
      : { width: s.mark, height: s.mark };

  const img = (
    <Image
      src={src}
      alt={alt}
      width={dims.width}
      height={dims.height}
      className={`${inverted ? "brightness-0 invert" : ""} ${className}`.trim()}
      priority
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center" aria-label={site.name}>
        {img}
      </Link>
    );
  }

  return <span className={`inline-flex shrink-0 items-center ${className}`}>{img}</span>;
}