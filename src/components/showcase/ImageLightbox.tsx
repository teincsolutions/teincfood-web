"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function ImageLightbox({
  src,
  alt,
  open,
  onClose,
}: {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("showcase");
  const [failedSrc, setFailedSrc] = useState<string>();

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-navy/90 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out data-[state=open]:fade-in" />
        <Dialog.Content className="fixed inset-0 z-[101] flex items-center justify-center p-4 outline-none sm:p-8">
          <Dialog.Title className="absolute bottom-4 left-1/2 z-10 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-center text-xs font-medium text-white backdrop-blur sm:bottom-6 sm:text-sm">
            {alt}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            {t("controls.viewFullscreen", { label: alt })}
          </Dialog.Description>
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label={t("controls.close")}
              className="absolute right-4 top-4 z-20 inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:top-6"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </Dialog.Close>
          <div className="flex max-h-[88vh] max-w-[94vw] items-center justify-center pb-10">
            {failedSrc === src ? (
              <p className="rounded-2xl bg-white px-6 py-8 text-sm font-medium text-navy shadow-2xl">
                {t("controls.placeholder")}
              </p>
            ) : (
              // Full-resolution image without a second Next.js optimization request.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt}
                className="max-h-[82vh] max-w-[94vw] rounded-lg object-contain shadow-2xl"
                onError={() => setFailedSrc(src)}
              />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
