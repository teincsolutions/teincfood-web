import Image from "next/image";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function Logo({
  variant = "navy",
  href = "/",
  className,
  imgClassName,
}: {
  variant?: "navy" | "white" | "orange" | "footer";
  href?: string;
  className?: string;
  imgClassName?: string;
}) {
  // Desktop shows the full-color landscape logo (icon + wordmark).
  // Mobile shows the compact icon-only mark.
  const assetVersion = `?v=${siteConfig.logoVersion}`;
  const horizontalSrc =
    variant === "white"
      ? `/logo/logo-horizontal-white.svg${assetVersion}`
      : variant === "footer"
        ? `/logo/logo-horizontal-footer.svg${assetVersion}`
        : `/logo/logo-horizontal.svg${assetVersion}`;
  const markSrc =
    variant === "white"
      ? `/logo/logo-white.svg${assetVersion}`
      : variant === "footer"
        ? `/logo/logo-orange.svg${assetVersion}`
        : `/logo/logo-orange.svg${assetVersion}`;

  return (
    <Link href={href} className={cn("inline-flex items-center", className)}>
      <Image
        src={horizontalSrc}
        alt="TeincFood"
        width={816}
        height={187}
        priority
        className={cn(
          "hidden h-9 w-auto sm:block",
          variant === "footer" && "sm:h-8",
          imgClassName,
        )}
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