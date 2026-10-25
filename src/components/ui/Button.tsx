import { Link } from "@/i18n/routing";
import type {
  ButtonHTMLAttributes,
  ComponentProps,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "inverse"
  | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-orange-800 text-white hover:bg-orange-700 focus-visible:outline-orange-800",
  secondary:
    "bg-navy text-white hover:bg-navy-deep focus-visible:outline-navy",
  outline:
    "border border-navy/20 bg-white text-navy hover:border-navy/40 hover:bg-navy/[0.03] focus-visible:outline-navy",
  ghost: "text-navy hover:bg-navy/5 focus-visible:outline-navy",
  inverse:
    "bg-[#ffffff] text-[#1e1e2e] hover:bg-[#f2f2f2] focus-visible:outline-white",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-4 py-2.5 text-sm sm:px-5 sm:py-3 sm:text-base",
  lg: "px-5 py-3 text-base sm:px-6 sm:py-3.5",
};

const base =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60 sm:min-h-[48px]";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps & { href: string } & Omit<
    ComponentProps<typeof Link>,
    "href" | "className"
  >) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { type?: "button" | "submit" }) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
