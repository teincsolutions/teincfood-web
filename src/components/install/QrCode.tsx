"use client";

import { QRCodeSVG } from "qrcode.react";

export function QrCode({ value, size = 120 }: { value: string; size?: number }) {
  return (
    <div
      className="rounded-xl bg-white p-2 shadow-inner"
      role="img"
      aria-label="QR code"
    >
      <QRCodeSVG value={value} size={size} level="M" bgColor="#ffffff" fgColor="#071126" />
    </div>
  );
}