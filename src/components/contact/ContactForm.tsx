"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { FormField, FormStatus, Input, Textarea } from "@/components/forms";
import { Button } from "@/components/ui/Button";
import { chatConfig } from "@/config/site";
import { trackEvent } from "@/utils/observability";

type Status = "idle" | "loading" | "success" | "error";
type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const TURNSTILE_SITE_KEY = chatConfig.turnstileSiteKey;

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [captchaNotice, setCaptchaNotice] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const captchaTokenRef = useRef<string | null>(null);

  // Same manual Turnstile loading pattern as the support FAB — the widget is
  // only rendered when a public site key is configured.
  useEffect(() => {
    if (typeof window === "undefined" || !TURNSTILE_SITE_KEY) return;
    if (!document.querySelector('script[src*="turnstile"]')) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const interval = window.setInterval(() => {
      const turnstile = (window as unknown as {
        turnstile?: {
          render: (
            _element: HTMLElement,
            _options: Record<string, unknown>,
          ) => string | undefined;
          reset: (_widgetId?: string | null) => void;
        };
      }).turnstile;

      if (!turnstile || !turnstileRef.current || turnstileRef.current.dataset.rendered) return;

      turnstileRef.current.dataset.rendered = "1";
      try {
        const widgetId = turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            captchaTokenRef.current = token;
            setCaptchaSolved(true);
            setCaptchaNotice(null);
          },
          "expired-callback": () => {
            captchaTokenRef.current = null;
            setCaptchaSolved(false);
          },
          "error-callback": () => {
            captchaTokenRef.current = null;
            setCaptchaSolved(false);
            setCaptchaNotice(t("captchaFailed"));
          },
          theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
        });
        turnstileWidgetIdRef.current = widgetId ?? null;
      } catch {
        // Let the visitor submit again once the script has loaded.
        if (turnstileRef.current) delete turnstileRef.current.dataset.rendered;
      }
    }, 500);

    return () => window.clearInterval(interval);
  }, [t]);

  const resetCaptcha = () => {
    captchaTokenRef.current = null;
    setCaptchaSolved(false);
    const turnstile = (window as unknown as {
      turnstile?: { reset: (_widgetId?: string | null) => void };
    }).turnstile;
    if (turnstile && turnstileWidgetIdRef.current) {
      try {
        turnstile.reset(turnstileWidgetIdRef.current);
      } catch {
        /* widget expired — it will re-render itself */
      }
    }
  };

  const update =
    (field: FieldName) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: e.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      if (status === "success" || status === "error") setStatus("idle");
    };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!form.name.trim()) next.name = t("errors.name");
    if (!form.email.trim()) next.email = t("errors.email");
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = t("errors.emailInvalid");
    }
    if (!form.message.trim()) next.message = t("errors.message");
    return next;
  };

  const focusFirstInvalid = (next: FieldErrors) => {
    const target = next.name
      ? nameRef.current
      : next.email
        ? emailRef.current
        : next.message
          ? messageRef.current
          : null;
    // Wait for the error descriptions to render before moving focus so
    // assistive tech announces them with the field.
    if (target) requestAnimationFrame(() => target.focus());
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      focusFirstInvalid(next);
      return;
    }

    if (TURNSTILE_SITE_KEY && !captchaTokenRef.current) {
      setCaptchaNotice(t("captchaRequired"));
      return;
    }

    setStatus("loading");
    setCaptchaNotice(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captcha_token: captchaTokenRef.current }),
      });
      if (!res.ok) throw new Error("failed");
      trackEvent("contact.submitted");
      setForm({ name: "", email: "", message: "" });
      setStatus("success");
      resetCaptcha();
    } catch {
      trackEvent("contact.failed");
      setStatus("error");
      // Turnstile tokens are single-use — get a fresh one for the retry.
      resetCaptcha();
    }
  };

  const pending = status === "loading";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
      aria-busy={pending}
    >
      <FormField
        id="contact-name"
        label={t("name")}
        error={errors.name}
        required
      >
        <Input
          ref={nameRef}
          type="text"
          name="name"
          value={form.name}
          onChange={update("name")}
          autoComplete="name"
          disabled={pending}
        />
      </FormField>
      <FormField
        id="contact-email"
        label={t("email")}
        error={errors.email}
        required
      >
        <Input
          ref={emailRef}
          type="email"
          name="email"
          value={form.email}
          onChange={update("email")}
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          inputMode="email"
          disabled={pending}
        />
      </FormField>
      <FormField
        id="contact-message"
        label={t("message")}
        error={errors.message}
        required
      >
        <Textarea
          ref={messageRef}
          name="message"
          value={form.message}
          onChange={update("message")}
          rows={5}
          autoComplete="off"
          disabled={pending}
        />
      </FormField>

      {TURNSTILE_SITE_KEY ? (
        <div className="space-y-1">
          <div ref={turnstileRef} aria-label={t("captchaLabel")} />
          {!captchaSolved && captchaNotice ? (
            <p className="text-sm text-red-700" role="alert">
              {captchaNotice}
            </p>
          ) : null}
        </div>
      ) : null}

      {status !== "idle" && (
        <FormStatus
          status={status}
          title={
            status === "loading"
              ? t("sending")
              : status === "success"
                ? t("successTitle")
                : t("errorTitle")
          }
        >
          {status === "success"
            ? t("success")
            : status === "error"
              ? t("error")
              : undefined}
        </FormStatus>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="w-full sm:w-auto"
      >
        <Send className="size-5" aria-hidden="true" />
        {pending ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}
