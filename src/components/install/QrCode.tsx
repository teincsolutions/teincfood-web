"use client";

import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

export function QrCode({
  value,
  size = 120,
  label = "QR code",
  className,
}: {
  value: string;
  size?: number;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-xl bg-[#ffffff] p-2 shadow-inner", className)}
      role="img"
      aria-label={label}
    >
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        bgColor="#ffffff"
        fgColor="#071126"
      />
    </div>
  );
}