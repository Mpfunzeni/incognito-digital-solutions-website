"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import {
  budgetForAmount,
  budgetOptions,
  contactMethods,
  quoteSchema,
  serviceOptions,
  toFieldErrors,
  type FieldErrors,
} from "@/lib/quote-schema";
import { packages } from "@/content/pricing";
import { publishedServices } from "@/content/services";
import { describeSelection, resolveSelection, selectionTotals } from "@/content/service-pricing";
import { site } from "@/content/site";
import { trackEvent } from "@/lib/analytics";

type Values = {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  contactMethod: string;
  consent: boolean;
  website: string;
};

const initial: Values = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  service: "",
  budget: "",
  message: "",
  contactMethod: "Email",
  consent: false,
  website: "",
};

type Status = { state: "idle" } | { state: "submitting" } | { state: "success" } | { state: "error"; message: string };

export function QuoteForm({ source = "quote" }: { source?: "quote" | "contact" }) {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [startedAt] = useState(() => Date.now());
  const [packageNote, setPackageNote] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  // Pre-select the service from ?service= or ?package= (links from cards).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service");
    const pkg = packages.find((p) => p.id === params.get("package"));
    let preset: string | undefined;
    if (service && (serviceOptions as readonly string[]).includes(service)) preset = service;
    let budget: string | undefined;
    const selection = resolveSelection(params.get("tier"), params.get("addons"));
    if (selection) {
      preset = publishedServices.find((s) => s.slug === selection.pricing.slug)?.title;
      const onceOff = selectionTotals(selection)["once-off"];
      if (onceOff > 0) budget = budgetForAmount(onceOff);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPackageNote(describeSelection(selection));
    } else if (pkg) {
      preset = publishedServices.find((s) => s.slug === pkg.serviceSlug)?.title;
      setPackageNote(pkg.name);
    }
    if (preset || budget)
      setValues((v) => ({ ...v, ...(preset && { service: preset }), ...(budget && { budget }) }));
  }, []);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key as keyof FieldErrors]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.state === "submitting") return;

    const payload = { ...values, selection: packageNote ?? "", startedAt };
    const parsed = quoteSchema.safeParse(payload);
    if (!parsed.success) {
      const fe = toFieldErrors(parsed.error);
      setErrors(fe);
      setStatus({ state: "error", message: "Please correct the highlighted fields." });
      const first = Object.keys(fe)[0];
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: boolean; error?: string; fieldErrors?: FieldErrors }
        | null;
      if (res.ok && data?.ok) {
        setStatus({ state: "success" });
        setValues(initial);
        trackEvent("generate_lead", { form: source, service: values.service });
        requestAnimationFrame(() => statusRef.current?.focus());
        return;
      }
      if (data?.fieldErrors) setErrors(data.fieldErrors);
      setStatus({
        state: "error",
        message:
          data?.error ||
          `Something went wrong. Please email ${site.contact.email} or call ${site.contact.phoneDisplay}.`,
      });
      trackEvent("form_submit_error", { form: source, status: res.status });
    } catch {
      setStatus({
        state: "error",
        message: `We could not reach the server. Please check your connection, or email ${site.contact.email}.`,
      });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status.state === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-[var(--radius-card)] border border-brand-teal/40 bg-brand-teal/10 p-8 text-center focus:outline-none"
      >
        <CheckCircle2 className="mx-auto size-12 text-brand-teal-dark" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-bold text-ink-900">Thank you, your request has been sent</h2>
        <p className="mx-auto mt-3 max-w-md text-text-muted">
          We have received your details and will get back to you using your preferred contact method. If your request
          is urgent, call us on{" "}
          <a href={`tel:${site.contact.phoneE164}`} className="font-semibold text-ink-900 underline">
            {site.contact.phoneDisplay}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus({ state: "idle" })}
          className="mt-6 h-11 rounded-full border border-line bg-white px-5 font-semibold text-ink-900 hover:bg-surface-muted"
        >
          Send another request
        </button>
      </div>
    );
  }

  const submitting = status.state === "submitting";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby={fid("required-note")} className="space-y-6">
      <p id={fid("required-note")} className="text-sm text-text-muted">
        Fields marked <span aria-hidden="true" className="text-[#be123c]">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      {packageNote && (
        <p className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-ink-700">
          Selected package: <strong>{packageNote}</strong>.{" "}
          <button
            type="button"
            onClick={() => setPackageNote(null)}
            className="font-semibold text-brand-teal-dark underline underline-offset-2"
          >
            Remove
          </button>
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={fid("fullName")} label="Full name" required error={errors.fullName}>
          <input
            id={fid("fullName")}
            name="fullName"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            {...aria(fid("fullName"), errors.fullName, true)}
            className={inputClass(errors.fullName)}
          />
        </Field>
        <Field id={fid("businessName")} label="Business name" error={errors.businessName}>
          <input
            id={fid("businessName")}
            name="businessName"
            type="text"
            autoComplete="organization"
            value={values.businessName}
            onChange={(e) => set("businessName", e.target.value)}
            {...aria(fid("businessName"), errors.businessName)}
            className={inputClass(errors.businessName)}
          />
        </Field>
        <Field id={fid("email")} label="Email address" required error={errors.email}>
          <input
            id={fid("email")}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            {...aria(fid("email"), errors.email, true)}
            className={inputClass(errors.email)}
          />
        </Field>
        <Field
          id={fid("phone")}
          label="Phone number"
          hint={values.contactMethod === "Email" ? "Optional" : "Required for phone or WhatsApp contact"}
          error={errors.phone}
        >
          <input
            id={fid("phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            {...aria(fid("phone"), errors.phone, values.contactMethod !== "Email", true)}
            className={inputClass(errors.phone)}
          />
        </Field>
        <Field id={fid("service")} label="Service required" required error={errors.service}>
          <select
            id={fid("service")}
            name="service"
            value={values.service}
            onChange={(e) => set("service", e.target.value)}
            {...aria(fid("service"), errors.service, true)}
            className={inputClass(errors.service)}
          >
            <option value="">Choose a service</option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field id={fid("budget")} label="Budget range" hint="Optional" error={errors.budget}>
          <select
            id={fid("budget")}
            name="budget"
            value={values.budget}
            onChange={(e) => set("budget", e.target.value)}
            {...aria(fid("budget"), errors.budget, false, true)}
            className={inputClass(errors.budget)}
          >
            <option value="">Prefer not to say</option>
            {budgetOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id={fid("message")} label="Project description" required error={errors.message} hint="Tell us about your business, goals and any deadlines.">
        <textarea
          id={fid("message")}
          name="message"
          rows={6}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          {...aria(fid("message"), errors.message, true, true)}
          className={`${inputClass(errors.message)} h-auto py-3`}
        />
      </Field>

      <fieldset>
        <legend className="text-[0.95rem] font-semibold text-ink-900">
          Preferred contact method <span aria-hidden="true" className="text-[#be123c]">*</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {contactMethods.map((m) => (
            <label
              key={m}
              className="flex cursor-pointer items-center gap-2.5 rounded-full border border-line bg-white px-4 py-2.5 text-[0.95rem] font-medium text-ink-800 has-[:checked]:border-ink-900 has-[:checked]:bg-ink-900 has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-teal-dark"
            >
              <input
                type="radio"
                name="contactMethod"
                value={m}
                checked={values.contactMethod === m}
                onChange={() => set("contactMethod", m)}
                className="sr-only"
              />
              {m}
            </label>
          ))}
        </div>
        {errors.contactMethod && <ErrorText id={fid("contactMethod-error")}>{errors.contactMethod}</ErrorText>}
      </fieldset>

      {/* Honeypot: hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={fid("website")}>Leave this field empty</label>
        <input
          id={fid("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <div>
        <label className="flex cursor-pointer gap-3 text-[0.95rem] leading-relaxed text-ink-700">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? fid("consent-error") : undefined}
            aria-required="true"
            className="mt-1 size-5 shrink-0 accent-[#0a7c78]"
          />
          <span>
            I agree that {site.name} may use the information I provide to respond to my enquiry, as described in the{" "}
            <Link href="/privacy-policy" className="font-semibold text-brand-teal-dark underline underline-offset-2">
              Privacy Policy
            </Link>
            . <span aria-hidden="true" className="text-[#be123c]">*</span>
          </span>
        </label>
        {errors.consent && <ErrorText id={fid("consent-error")}>{errors.consent}</ErrorText>}
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="assertive" className="focus:outline-none">
        {status.state === "error" && (
          <p role="alert" className="flex gap-3 rounded-xl border border-[#fecdd3] bg-[#fff1f2] p-4 text-[0.95rem] text-[#9f1239]">
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            {status.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        data-track={`form_submit_${source}`}
        className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-8 text-base font-semibold text-white transition-colors hover:bg-ink-700 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {submitting ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Sending…
          </>
        ) : (
          <>
            <Send className="size-4.5" aria-hidden="true" /> Send request
          </>
        )}
      </button>
    </form>
  );
}

function aria(id: string, error: string | undefined, required = false, hasHint = false) {
  const describedBy = [hasHint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    "aria-required": required || undefined,
  } as const;
}

function inputClass(error?: string) {
  return `block h-12 w-full rounded-xl border bg-white px-4 text-base text-ink-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-ink-900 focus:outline-none focus:ring-3 focus:ring-brand-teal/40 ${
    error ? "border-[#e11d48]" : "border-[#cbd5e1] hover:border-ink-500"
  }`;
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[0.95rem] font-semibold text-ink-900">
        {label} {required && <span aria-hidden="true" className="text-[#be123c]">*</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-sm text-text-muted">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#be123c]">
      <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}
