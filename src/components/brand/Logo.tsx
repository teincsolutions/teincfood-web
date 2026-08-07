import Image from "next/image";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function Logo({
  variant = "navy",
  href = "/",
  className,
  imgClassName,
}: {
  variant?: "navy" | "white" | "orange";
  href?: string;
  className?: string;
  imgClassName?: string;
}) {
  // Desktop shows the full-color landscape logo (icon + wordmark).
  // Mobile shows the compact icon-only mark.
  const horizontalSrc =
    variant === "white"
      ? "/logo/logo-horizontal-white.svg"
      : "/logo/logo-horizontal.svg";
  const markSrc =
    variant === "white"
      ? "/logo/logo-white.svg"
      : "/logo/logo-orange.svg";

  return (
    <Link href={href} className={cn("inline-flex items-center", className)}>
      <Image
        src={horizontalSrc}
        alt="TeincFood"
        width={816}
        height={187}
        priority
        className={cn("hidden h-9 w-auto sm:block", imgClassName)}
        style={{ width: "auto" }}
      />
      <Image
        src={markSrc}
        alt="TeincFood"
        width={40}
        height={40}
        priority
        className={cn("block size-8 sm:hidden", imgClassName)}
      />
    </Link>
  );
}