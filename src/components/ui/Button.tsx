import { Link } from "@/i18n/routing";
import type {
  ButtonHTMLAttributes,
  ComponentProps,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-orange text-white hover:bg-orange-700 focus-visible:outline-orange",
  secondary:
    "bg-navy text-white hover:bg-navy-deep focus-visible:outline-navy",
  outline:
    "border-2 border-navy/15 text-navy hover:border-navy/30 focus-visible:outline-navy",
  ghost: "text-navy hover:bg-navy/5 focus-visible:outline-navy",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2.5 text-sm",
  md: "px-5 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base",
  lg: "px-5 py-3 text-sm sm:px-8 sm:py-4 sm:text-lg",
};

const base =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60";

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
