"use client";

import { useFormStatus } from "react-dom";
import type { ComponentProps, ReactNode } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";

export function inputClass(error?: string) {
  return `block h-12 w-full rounded-xl border bg-white px-4 text-base text-ink-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-ink-900 focus:outline-none focus:ring-3 focus:ring-brand-teal/40 ${
    error ? "border-[#e11d48]" : "border-[#cbd5e1] hover:border-ink-500"
  }`;
}

type FieldProps = Omit<ComponentProps<"input">, "id"> & {
  name: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
};

export function Field({ name, label, error, hint, required, className = "", ...input }: FieldProps) {
  const id = `f-${name}`;
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[0.95rem] font-semibold text-ink-900">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-[#be123c]">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={inputClass(error)}
        {...input}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-text-muted">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-[#be123c]">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {error}
    </p>
  );
}

export function SubmitButton({ children, className = "w-full", variant = "primary" }: { children: ReactNode; className?: string; variant?: "primary" | "dark" }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClasses(variant, "lg", className)}>
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function FormMessage({ ok, message }: { ok?: boolean; message?: string }) {
  if (!message) return null;
  return (
    <div
      role={ok ? "status" : "alert"}
      className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-[0.95rem] ${
        ok ? "border border-brand-teal/40 bg-brand-teal/10 text-ink-900" : "border border-[#fecdd3] bg-[#fff1f2] text-[#9f1239]"
      }`}
    >
      {ok ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-teal-dark" aria-hidden="true" /> : <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />}
      <p>{message}</p>
    </div>
  );
}
