"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const update = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    if (!form.name.trim() || !form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || !form.message.trim()) {
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center font-semibold text-green-700">
        {t("success")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label={t("name")}>
        <input
          type="text"
          value={form.name}
          onChange={update("name")}
          required
          className="w-full rounded-xl border border-navy/15 bg-surface px-4 py-3 text-navy outline-none transition-colors focus:border-orange focus:outline focus:outline-2 focus:outline-orange/30"
        />
      </Field>
      <Field label={t("email")}>
        <input
          type="email"
          value={form.email}
          onChange={update("email")}
          required
          className="w-full rounded-xl border border-navy/15 bg-surface px-4 py-3 text-navy outline-none transition-colors focus:border-orange focus:outline focus:outline-2 focus:outline-orange/30"
        />
      </Field>
      <Field label={t("message")}>
        <textarea
          value={form.message}
          onChange={update("message")}
          required
          rows={5}
          className="w-full resize-y rounded-xl border border-navy/15 bg-surface px-4 py-3 text-navy outline-none transition-colors focus:border-orange focus:outline focus:outline-2 focus:outline-orange/30"
        />
      </Field>

      {status === "error" && (
        <p className="text-sm font-semibold text-red-600">{t("invalid")}</p>
      )}

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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={cn("mb-1.5 block text-sm font-bold text-navy")}>
        {label}
      </span>
      {children}
    </label>
  );
}