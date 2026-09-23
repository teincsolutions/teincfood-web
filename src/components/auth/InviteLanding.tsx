"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Building2, Check, Copy, Smartphone } from "lucide-react";
import { toast } from "@/components/ui/Toaster";
import { trackEvent } from "@/utils/observability";
import { storeLinks } from "@/config/site";
import { cn } from "@/lib/utils";

const CODE_RE = /^[0-9]{6}$/;

function detectPlatform(): "ios" | "android" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  return "desktop";
}

export function InviteLanding() {
  const t = useTranslations("invite");
  const searchParams = useSearchParams();
  const linkedCode = (searchParams.get("code") ?? "").trim();

  const [manualCode, setManualCode] = useState("");
  const [copied, setCopied] = useState(false);
  const platform = useMemo(() => detectPlatform(), []);

  const code = CODE_RE.test(linkedCode) ? linkedCode : manualCode.trim();
  const hasCode = CODE_RE.test(code);

  useEffect(() => {
    trackEvent("invite.viewed", {
      platform,
      has_code: CODE_RE.test(linkedCode),
    });
  }, [platform, linkedCode]);

  // Re-trigger the universal link — opens TF Business when installed
  // (email/SMS apps and in-app browsers often don't resolve applinks).
  const universalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite?code=${code}`
      : `/invite?code=${code}`;

  const storeUrl =
    platform === "ios"
      ? storeLinks.business.appStore
      : platform === "android"
        ? storeLinks.business.playStore
        : "";

  async function copyCode() {
    if (!hasCode) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    trackEvent("invite.code_copied", { platform });
    toast.success(t("copied"));
    window.setTimeout(() => setCopied(false), 2000);
  }

  function onManualSubmit(e: FormEvent) {
    e.preventDefault();
    if (!CODE_RE.test(manualCode.trim())) {
      toast.error(t("invalidCode"));
    }
  }

  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-orange/10 text-orange">
        <Building2 className="size-7" aria-hidden />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-navy sm:text-3xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-md text-navy/70">{t("intro")}</p>

      {hasCode ? (
        <button
          type="button"
          onClick={copyCode}
          aria-label={t("copyCode")}
          className="mt-8 flex items-center gap-3 rounded-2xl border-2 border-dashed border-navy/20 bg-surface px-8 py-4 transition-colors hover:border-orange/50"
        >
          <span className="font-mono text-3xl font-bold tracking-[0.3em] text-navy">
            {code}
          </span>
          {copied ? (
            <Check className="size-5 text-green-600" aria-hidden />
          ) : (
            <Copy className="size-5 text-navy/40" aria-hidden />
          )}
        </button>
      ) : (
        <form onSubmit={onManualSubmit} className="mt-8 flex w-full max-w-sm gap-2">
          <input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder={t("codePlaceholder")}
            inputMode="numeric"
            aria-label={t("codeLabel")}
            className="min-w-0 flex-1 rounded-xl border border-navy/15 bg-surface px-4 py-3 text-center font-mono text-xl tracking-[0.3em] text-navy outline-none focus:border-orange"
          />
          <button
            type="submit"
            className="min-h-[48px] rounded-xl bg-navy px-5 font-semibold text-white"
          >
            {t("useCode")}
          </button>
        </form>
      )}

      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
        <a
          href={hasCode ? universalUrl : undefined}
          aria-disabled={!hasCode}
          onClick={(e) => {
            if (!hasCode) e.preventDefault();
            else trackEvent("invite.open_app_clicked", { platform });
          }}
          className={cn(
            "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-orange px-6 font-semibold text-white transition-colors hover:bg-orange-700",
            !hasCode && "pointer-events-none opacity-40",
          )}
        >
          <Smartphone className="size-5" aria-hidden />
          {t("openApp")}
        </a>
        {storeUrl ? (
          <a
            href={storeUrl}
            onClick={() => trackEvent("invite.store_clicked", { platform })}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-navy/15 px-6 font-semibold text-navy transition-colors hover:border-navy/30"
          >
            {t("getApp")}
          </a>
        ) : null}
      </div>

      <ol className="mt-10 flex w-full max-w-md flex-col gap-3 text-left">
        {[t("step1"), t("step2"), t("step3")].map((step, i) => (
          <li key={i} className="flex gap-3 text-sm text-navy/70">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-navy/10 text-xs font-bold text-navy">
              {i + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
