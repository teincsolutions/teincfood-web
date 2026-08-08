"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "noToken";
type BackendError = {
  error?: { code?: unknown; message?: string };
};

const inputClass =
  "w-full rounded-xl border border-navy/15 bg-surface px-4 py-3 text-navy outline-none transition-colors focus:border-orange focus:outline focus:outline-2 focus:outline-orange/30";
const inputErrorClass = "border-red-500 focus:border-red-500 focus:outline-red-500/30";

export function ResetPasswordForm() {
  const t = useTranslations("resetPassword");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<Status>(token ? "idle" : "noToken");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const next: { password?: string; confirm?: string } = {};
    if (password.length < 8) next.password = t("tooShort");
    if (confirm !== password) next.confirm = t("mismatch");
    setErrors(next);
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
        const message = data.error?.message;
        toast.error(message || t("invalidRequest"));
        setStatus("idle");
        return;
      }

      toast.success(t("success"));
      setStatus("success");
    } catch {
      toast.error(t("error"));
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <p className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center font-semibold text-green-700">
        {t("success")}
      </p>
    );
  }

  if (status === "noToken") {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center font-semibold text-red-700">
        {t("invalidRequest")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label={t("newPassword")} hint={t("passwordHint")} error={errors.password}>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          className={cn(inputClass, errors.password && inputErrorClass)}
        />
      </Field>
      <Field label={t("confirmPassword")} error={errors.confirm}>
        <input
          type="password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setErrors((prev) => ({ ...prev, confirm: undefined }));
          }}
          autoComplete="new-password"
          aria-invalid={!!errors.confirm}
          className={cn(inputClass, errors.confirm && inputErrorClass)}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading"}
        className="w-full sm:w-auto"
      >
        <KeyRound className="size-5" aria-hidden="true" />
        {t("submit")}
      </Button>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-navy">{label}</span>
      {children}
      {error && (
        <span className="mt-1 block text-sm font-semibold text-red-600" role="alert">
          {error}
        </span>
      )}
      {!error && hint && <span className="mt-1 block text-sm text-navy/50">{hint}</span>}
    </label>
  );
}