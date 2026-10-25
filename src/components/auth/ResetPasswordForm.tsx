"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { FormField, FormStatus, Input } from "@/components/forms";
import { Button, ButtonLink } from "@/components/ui/Button";
import { trackEvent } from "@/utils/observability";

type Status = "idle" | "loading" | "success" | "error" | "noToken";
type FieldErrors = { password?: string; confirm?: string };
type BackendError = {
  error?: { code?: unknown; message?: string };
};

export function ResetPasswordForm() {
  const t = useTranslations("resetPassword");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<Status>(token ? "idle" : "noToken");
  const [statusMessage, setStatusMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const clearErrorStatus = () => {
    if (status === "error") {
      setStatus("idle");
      setStatusMessage("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    const next: FieldErrors = {};
    if (password.length < 8) next.password = t("tooShort");
    if (confirm !== password) next.confirm = t("mismatch");
    setErrors(next);
    const target = next.password
      ? passwordRef.current
      : next.confirm
        ? confirmRef.current
        : null;
    // Focus after the error descriptions have rendered.
    if (target) requestAnimationFrame(() => target.focus());
    if (Object.keys(next).length > 0) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset_password",
          payload: { token, password },
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as BackendError;
        const fallback =
          res.status >= 400 && res.status < 500
            ? t("invalidRequest")
            : t("error");
        const message = data.error?.message || fallback;
        trackEvent("password.reset.failed", { status: res.status });
        setStatusMessage(message);
        setStatus("error");
        return;
      }

      trackEvent("password.reset.completed");
      setStatus("success");
    } catch {
      trackEvent("password.reset.failed", { status: 0 });
      setStatusMessage(t("error"));
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="space-y-5">
        <FormStatus status="success" title={t("success")} />
        <ButtonLink href="/download" size="lg" className="w-full sm:w-auto">
          {t("downloadApp")}
        </ButtonLink>
      </div>
    );
  }

  if (status === "noToken") {
    return (
      <div className="space-y-5">
        <FormStatus status="error" title={t("invalidRequest")} />
        <ButtonLink
          href="/contact"
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
        >
          {t("contactSupport")}
        </ButtonLink>
      </div>
    );
  }

  const pending = status === "loading";
  const passwordType = showPassword ? "text" : "password";
  const confirmType = showConfirm ? "text" : "password";
  const passwordToggleLabel = showPassword
    ? t("hidePassword")
    : t("showPassword");
  const confirmToggleLabel = showConfirm
    ? t("hidePassword")
    : t("showPassword");
  const PasswordIcon = showPassword ? EyeOff : Eye;
  const ConfirmIcon = showConfirm ? EyeOff : Eye;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
      aria-busy={pending}
    >
      <FormField
        id="reset-password"
        label={t("newPassword")}
        hint={t("passwordHint")}
        error={errors.password}
        required
      >
        <div className="relative">
          <Input
            ref={passwordRef}
            type={passwordType}
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((current) => ({ ...current, password: undefined }));
              clearErrorStatus();
            }}
            autoComplete="new-password"
            minLength={8}
            disabled={pending}
            className="pr-14"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={passwordToggleLabel}
            aria-pressed={showPassword}
            aria-controls="reset-password"
            disabled={pending}
            className="absolute right-0 top-0 size-12 rounded-xl p-0 sm:px-0 sm:py-0"
          >
            <PasswordIcon className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </FormField>
      <FormField
        id="reset-password-confirm"
        label={t("confirmPassword")}
        error={errors.confirm}
        required
      >
        <div className="relative">
          <Input
            ref={confirmRef}
            type={confirmType}
            name="confirmPassword"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setErrors((current) => ({ ...current, confirm: undefined }));
              clearErrorStatus();
            }}
            autoComplete="new-password"
            minLength={8}
            disabled={pending}
            className="pr-14"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowConfirm((visible) => !visible)}
            aria-label={confirmToggleLabel}
            aria-pressed={showConfirm}
            aria-controls="reset-password-confirm"
            disabled={pending}
            className="absolute right-0 top-0 size-12 rounded-xl p-0 sm:px-0 sm:py-0"
          >
            <ConfirmIcon className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </FormField>

      {pending && <FormStatus status="loading" title={t("submit")} />}
      {status === "error" && (
        <>
          <FormStatus status="error" title={statusMessage} />
          <ButtonLink href="/contact" variant="outline">
            {t("contactSupport")}
          </ButtonLink>
        </>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="w-full sm:w-auto"
      >
        <KeyRound className="size-5" aria-hidden="true" />
        {t("submit")}
      </Button>
    </form>
  );
}
