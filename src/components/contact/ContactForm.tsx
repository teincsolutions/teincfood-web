"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { FormField, FormStatus, Input, Textarea } from "@/components/forms";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/utils/observability";

type Status = "idle" | "loading" | "success" | "error";
type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

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

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      trackEvent("contact.submitted");
      setForm({ name: "", email: "", message: "" });
      setStatus("success");
    } catch {
      trackEvent("contact.failed");
      setStatus("error");
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
