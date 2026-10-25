"use client";

import { createContext, useContext, useId } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FormFieldContextValue = {
  id: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export function useFormField() {
  return useContext(FormFieldContext);
}

type FormFieldProps = {
  id?: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

export function FormField({
  id: providedId,
  label,
  hint,
  error,
  required = false,
  className,
  children,
}: FormFieldProps) {
  const generatedId = useId();
  const id = providedId ?? `field-${generatedId}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <FormFieldContext.Provider
      value={{ id, describedBy, invalid: Boolean(error), required }}
    >
      <div className={cn("block", className)}>
        <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-navy">
          {label}
          {required && (
            <span className="ml-1 text-red-600" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {children}
        {hint && (
          <p id={hintId} className="mt-1.5 text-sm text-navy/70">
            {hint}
          </p>
        )}
        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-sm font-semibold text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </FormFieldContext.Provider>
  );
}
