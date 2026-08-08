"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

export { toast };

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        className: "font-medium",
        style: {
          borderRadius: "12px",
        },
      }}
    />
  );
}