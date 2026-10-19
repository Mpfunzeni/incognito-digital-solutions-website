import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline-light" | "dark";
type Size = "md" | "lg" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,color,box-shadow,transform] duration-200 focus-visible:outline-offset-4 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-teal text-ink-900 shadow-[0_8px_24px_-10px_rgb(30_221_214/0.7)] hover:bg-[#45e6e0] hover:shadow-[0_10px_30px_-10px_rgb(30_221_214/0.9)]",
  secondary: "bg-ink-800 text-white hover:bg-ink-700",
  dark: "bg-ink-900 text-white hover:bg-ink-700",
  ghost: "text-ink-800 hover:bg-ink-900/5",
  "outline-light": "border border-white/25 text-white hover:border-white/60 hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  track?: string;
};

export function ButtonLink({ variant, size, className, children, track, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} data-track={track} {...props}>
      {children}
    </Link>
  );
}
