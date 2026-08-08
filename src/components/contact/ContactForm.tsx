"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

const inputClass =
  "w-full rounded-xl border border-navy/15 bg-surface px-4 py-3 text-navy outline-none transition-colors focus:border-orange focus:outline focus:outline-2 focus:outline-orange/30";
const inputErrorClass = "border-red-500 focus:border-red-500 focus:outline-red-500/30";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});

  const update = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!form.name.trim()) next.name = t("errors.name");
    if (!form.email.trim()) next.email = t("errors.email");
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = t("errors.emailInvalid");
    if (!form.message.trim()) next.message = t("errors.message");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      toast.success(t("success"));
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error(t("error"));
    } finally {
      setStatus("idle");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label={t("name")} error={errors.name}>
        <input
          type="text"
          value={form.name}
          onChange={update("name")}
          aria-invalid={!!errors.name}
          className={cn(inputClass, errors.name && inputErrorClass)}
        />
      </Field>
      <Field label={t("email")} error={errors.email}>
        <input
          type="email"
          value={form.email}
          onChange={update("email")}
          aria-invalid={!!errors.email}
          className={cn(inputClass, errors.email && inputErrorClass)}
        />
      </Field>
      <Field label={t("message")} error={errors.message}>
        <textarea
          value={form.message}
          onChange={update("message")}
          rows={5}
          aria-invalid={!!errors.message}
          className={cn(inputClass, "resize-y", errors.message && inputErrorClass)}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading"}
        className="w-full sm:w-auto"
      >
        <Send className="size-5" aria-hidden="true" />
        {t("submit")}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-navy">
        {label}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-sm font-semibold text-red-600" role="alert">{error}</span>}
    </label>
  );
}