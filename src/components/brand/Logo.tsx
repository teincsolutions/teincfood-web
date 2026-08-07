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
  const src =
    variant === "white"
      ? "/logo/logo-white.svg"
      : variant === "orange"
        ? "/logo/logo-orange.svg"
        : "/logo/logo-navy.svg";

  return (
    <Link href={href} className={cn("inline-flex items-center", className)}>
      <Image
        src={src}
        alt="TeincFood"
        width={180}
        height={52}
        priority
        className={cn("h-10 w-auto sm:h-11", imgClassName)}
        style={{ width: "auto", height: "100%" }}
      />
    </Link>
  );
}