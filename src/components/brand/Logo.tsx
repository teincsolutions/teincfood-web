import Image from "next/image";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function Logo({
  variant = "navy",
  href = "/",
  className,
  imgClassName,
  priority = false,
}: {
  variant?: "navy" | "white" | "orange" | "footer";
  href?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  // Desktop shows the full-color landscape logo (icon + wordmark).
  // Mobile shows the compact icon-only mark.
  const assetVersion = `?v=${siteConfig.logoVersion}`;
  const horizontalSrc =
    variant === "white"
      ? `/logo/logo-horizontal-white.svg${assetVersion}`
      : variant === "footer"
        ? `/logo/logo-horizontal-footer.png${assetVersion}`
        : `/logo/logo-horizontal.svg${assetVersion}`;
  const markSrc =
    variant === "white"
      ? `/logo/logo-white.svg${assetVersion}`
      : `/logo/logo-orange.svg${assetVersion}`;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-800",
        className,
      )}
    >
      {/* Horizontal logo: desktop and up only. */}
      <span className="hidden sm:block">
        <Image
          src={horizontalSrc}
          alt="Teinc Food"
          width={variant === "footer" ? 1148 : 816}
          height={variant === "footer" ? 269 : 187}
          priority={priority || variant === "footer"}
          className={cn(
            "h-9 w-auto dark:hidden",
            variant === "footer" && "h-auto w-56 sm:w-72",
            imgClassName,
          )}
          style={{ width: "auto" }}
        />
        <Image
          src="/logo/logo-dark.png"
          alt="Teinc Food"
          width={1176}
          height={304}
          priority={priority || variant === "footer"}
          className={cn(
            "hidden h-9 w-auto dark:block",
            variant === "footer" && "h-auto w-56 sm:w-72",
            imgClassName,
          )}
          style={{ width: "auto" }}
        />
      </span>

      {/* Compact mark: phones only. */}
      <span className="block sm:hidden">
        <Image
          src={markSrc}
          alt="Teinc Food"
          width={40}
          height={40}
          priority={priority}
          className={cn("block size-8 dark:hidden", imgClassName)}
        />
        <Image
          src="/logo/logo-mark-dark.svg"
          alt="Teinc Food"
          width={40}
          height={40}
          priority={priority}
          className={cn("hidden size-8 dark:block", imgClassName)}
        />
      </span>
    </Link>
  );
}
