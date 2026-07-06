import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "whatsapp" | "dark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-sm",
  secondary: "bg-white text-[var(--ink)] border border-[var(--border)] hover:bg-[var(--paper)]",
  ghost: "text-[var(--muted)] hover:bg-[var(--paper-dark)] hover:text-[var(--ink)]",
  danger: "bg-[var(--danger)] text-white hover:opacity-90",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1da851]",
  dark: "bg-[var(--ink)] text-white hover:bg-[var(--ink-soft)]",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg",
  md: "px-4 py-2.5 text-sm gap-2 rounded-xl",
  lg: "px-7 py-3.5 text-base gap-2 rounded-xl",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  ),
);
Button.displayName = "Button";