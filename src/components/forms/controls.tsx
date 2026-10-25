"use client";

import { forwardRef } from "react";
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { useFormField } from "./FormField";

const controlClass =
  "w-full rounded-xl border border-navy/15 bg-surface px-4 py-3 text-base text-navy outline-none transition-colors placeholder:text-navy/70 hover:border-navy/30 focus:border-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-60";
const controlErrorClass =
  "border-red-500 hover:border-red-500 focus:border-red-500 focus-visible:outline-red-600";

type FieldControlProps = {
  id?: string;
  required?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
};

function useControlProps({
  id,
  required,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: FieldControlProps) {
  const field = useFormField();
  const invalid = ariaInvalid ?? field?.invalid;

  return {
    id: id ?? field?.id,
    required: required ?? field?.required,
    "aria-describedby":
      cn(ariaDescribedBy, field?.describedBy) || undefined,
    "aria-invalid": invalid || undefined,
    invalid: invalid === true || invalid === "true",
  };
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  const { invalid, ...fieldProps } = useControlProps(props);

  return (
    <input
      ref={ref}
      {...props}
      {...fieldProps}
      className={cn(
        controlClass,
        "min-h-12",
        invalid && controlErrorClass,
        className,
      )}
    />
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  const { invalid, ...fieldProps } = useControlProps(props);

  return (
    <textarea
      ref={ref}
      {...props}
      {...fieldProps}
      className={cn(
        controlClass,
        "min-h-32 resize-y",
        invalid && controlErrorClass,
        className,
      )}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, ...props }, ref) {
  const { invalid, ...fieldProps } = useControlProps(props);

  return (
    <select
      ref={ref}
      {...props}
      {...fieldProps}
      className={cn(
        controlClass,
        "min-h-12",
        invalid && controlErrorClass,
        className,
      )}
    />
  );
});
