"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { domainTlds, findTld, formatRand, hostingPlans, priceOrder, type BillingCycle, type DomainAction } from "@/content/hosting";
import { placeOrderAction } from "@/app/account/actions";
import { normaliseDomain } from "@/lib/hosting/validation";
import { FieldError, FormMessage, inputClass, SubmitButton } from "@/components/account/FormParts";

const domainOptions: { value: DomainAction; label: string; hint: string }[] = [
  { value: "register", label: "Register a new domain", hint: "We register it in your name." },
  { value: "transfer", label: "Transfer my domain", hint: "Move a domain you own to us." },
  { value: "existing", label: "I already own this domain", hint: "Keep it where it is and point it to us." },
];

export function OrderForm({ initialPlan, initialCycle }: { initialPlan: string; initialCycle: BillingCycle }) {
  const [state, action] = useActionState(placeOrderAction, undefined);
  const [planId, setPlanId] = useState(state?.values?.planId || initialPlan);
  const [cycle, setCycle] = useState<BillingCycle>((state?.values?.cycle as BillingCycle) || initialCycle);
  const [domainAction, setDomainAction] = useState<DomainAction>((state?.values?.domainAction as DomainAction) || "register");
  const [domain, setDomain] = useState(state?.values?.domain || "");
  const e = state?.errors ?? {};

  const clean = normaliseDomain(domain);
  const tldOk = domainAction === "existing" || Boolean(findTld(clean));
  let summary: ReturnType<typeof priceOrder> | null = null;
  try {
    summary = priceOrder({ planId, cycle, domainAction, domain: tldOk && clean ? clean : `example${domainTlds[0].tld}` });
  } catch {
    summary = null;
  }
  const domainPending = domainAction !== "existing" && (!clean || !tldOk);

  return (
    <form action={action} noValidate className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-8">
        <FormMessage message={state?.message} />

        <fieldset>
          <legend className="text-lg font-bold text-ink-900">1. Choose your plan</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {hostingPlans.map((p) => (
              <label
                key={p.id}
                className={`flex cursor-pointer flex-col rounded-xl border-2 bg-white p-4 transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-brand-teal/50 ${
                  planId === p.id ? "border-brand-teal-dark" : "border-line hover:border-ink-500"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2.5">
                    <input type="radio" name="planId" value={p.id} checked={planId === p.id} onChange={() => setPlanId(p.id)} className="size-4.5 accent-[#0a7c78]" />
                    <span className="font-bold text-ink-900">{p.name}</span>
                  </span>
                  <span className="font-semibold text-ink-900">
                    {formatRand(cycle === "annually" ? p.annually : p.monthly)}
                    <span className="text-sm font-normal text-text-muted">{cycle === "annually" ? "/yr" : "/mo"}</span>
                  </span>
                </span>
                <span className="mt-1.5 pl-7 text-sm text-text-muted">
                  {p.specs.storage} · {p.specs.websites} · {p.specs.email}
                </span>
              </label>
            ))}
          </div>
          <FieldError id="f-planId-error" error={e.planId} />
        </fieldset>

        <fieldset>
          <legend className="text-lg font-bold text-ink-900">2. Billing period</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(["monthly", "annually"] as const).map((c) => (
              <label
                key={c}
                className={`flex cursor-pointer items-center gap-2.5 rounded-xl border-2 bg-white p-4 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-brand-teal/50 ${
                  cycle === c ? "border-brand-teal-dark" : "border-line hover:border-ink-500"
                }`}
              >
                <input type="radio" name="cycle" value={c} checked={cycle === c} onChange={() => setCycle(c)} className="size-4.5 accent-[#0a7c78]" />
                <span>
                  <span className="block font-bold text-ink-900">{c === "monthly" ? "Monthly" : "Yearly"}</span>
                  <span className="text-sm text-text-muted">{c === "monthly" ? "Pay month to month" : "2 months free"}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-bold text-ink-900">3. Your domain</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {domainOptions.map((o) => (
              <label
                key={o.value}
                className={`flex cursor-pointer gap-2.5 rounded-xl border-2 bg-white p-4 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-brand-teal/50 ${
                  domainAction === o.value ? "border-brand-teal-dark" : "border-line hover:border-ink-500"
                }`}
              >
                <input
                  type="radio"
                  name="domainAction"
                  value={o.value}
                  checked={domainAction === o.value}
                  onChange={() => setDomainAction(o.value)}
                  className="mt-1 size-4.5 shrink-0 accent-[#0a7c78]"
                />
                <span>
                  <span className="block font-semibold text-ink-900">{o.label}</span>
                  <span className="text-sm text-text-muted">{o.hint}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="mt-4">
            <label htmlFor="f-domain" className="mb-1.5 block text-[0.95rem] font-semibold text-ink-900">
              Domain name
            </label>
            <input
              id="f-domain"
              name="domain"
              value={domain}
              onChange={(ev) => setDomain(ev.target.value)}
              placeholder="yourbusiness.co.za"
              autoCapitalize="none"
              spellCheck={false}
              aria-invalid={e.domain ? true : undefined}
              aria-describedby={`f-domain-hint${e.domain ? " f-domain-error" : ""}`}
              className={inputClass(e.domain)}
            />
            <p id="f-domain-hint" className="mt-1.5 text-sm text-text-muted">
              {domainAction === "existing"
                ? "Any domain extension. You will point its nameservers to us after set-up."
                : `We can ${domainAction === "register" ? "register" : "transfer"} ${domainTlds.map((t) => t.tld).join(", ")}. We confirm availability before registering.`}
            </p>
            <FieldError id="f-domain-error" error={e.domain} />
          </div>
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="on-dark rounded-[var(--radius-card)] bg-ink-900 p-6 text-slate-300 shadow-[0_30px_60px_-30px_rgb(15_31_46/0.6)]">
          <h2 className="text-lg font-bold text-white">Order summary</h2>
          {summary && (
            <>
              <ul className="mt-4 space-y-3 text-[0.95rem]">
                {summary.lines
                  .filter((_, i) => !domainPending || i === 0)
                  .map((l) => (
                    <li key={l.description} className="flex justify-between gap-4">
                      <span>{l.description}</span>
                      <span className={`shrink-0 font-semibold ${l.amount < 0 ? "text-brand-teal" : "text-white"}`}>{formatRand(l.amount)}</span>
                    </li>
                  ))}
              </ul>
              <p className="mt-5 flex items-baseline justify-between border-t border-white/15 pt-4">
                <span className="font-semibold text-white">Due today <span className="text-xs font-normal text-slate-400">excl. VAT</span></span>
                <span className="font-display text-3xl font-bold text-white" aria-live="polite">
                  {formatRand(domainPending ? summary.lines[0].amount : summary.total)}
                </span>
              </p>
              {domainPending && <p className="mt-2 text-sm text-slate-400">Enter your domain to include it in the total.</p>}
            </>
          )}
          <div className="mt-6">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="acceptTerms"
                className="mt-0.5 size-5 shrink-0 accent-[#1eddd6]"
                aria-invalid={e.acceptTerms ? true : undefined}
                aria-describedby={e.acceptTerms ? "f-acceptTerms-error" : undefined}
              />
              <span>
                I agree to the{" "}
                <Link href="/terms-and-conditions" className="font-semibold text-brand-teal underline">
                  terms and conditions
                </Link>
                , and understand hosting renews automatically until cancelled.
              </span>
            </label>
            <div className="text-[#fda4af] [&_p]:text-[#fda4af]">
              <FieldError id="f-acceptTerms-error" error={e.acceptTerms} />
            </div>
          </div>
          <SubmitButton className="mt-6 w-full">Place order</SubmitButton>
          <p className="mt-3 text-center text-xs text-slate-400">You pay on the next page by card, Instant EFT or bank EFT.</p>
        </div>
      </aside>
    </form>
  );
}
