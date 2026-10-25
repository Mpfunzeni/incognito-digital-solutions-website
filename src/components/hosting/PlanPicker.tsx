"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Gift } from "lucide-react";
import { annualSaving, formatRand, hostingPlans, type BillingCycle } from "@/content/hosting";
import { buttonClasses } from "@/components/ui/Button";

/** Hosting plan cards with a monthly / yearly billing switch. */
export function PlanPicker() {
  const [cycle, setCycle] = useState<BillingCycle>("annually");
  return (
    <div>
      <div className="flex justify-center">
        <div role="radiogroup" aria-label="Billing period" className="inline-flex rounded-full border border-line bg-white p-1 shadow-[var(--shadow-card)]">
          {(["monthly", "annually"] as const).map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={cycle === c}
              onClick={() => setCycle(c)}
              className={`rounded-full px-5 py-2.5 text-[0.95rem] font-semibold transition-colors ${
                cycle === c ? "bg-ink-900 text-white" : "text-ink-700 hover:text-ink-900"
              }`}
            >
              {c === "monthly" ? "Monthly" : "Yearly"}
              {c === "annually" && (
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${cycle === c ? "bg-brand-teal text-ink-900" : "bg-brand-teal/15 text-ink-900"}`}>
                  2 months free
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {hostingPlans.map((plan) => {
          const dark = plan.highlighted;
          const perMonth = cycle === "annually" ? plan.annually / 12 : plan.monthly;
          return (
            <article
              key={plan.id}
              className={`glow-card relative flex flex-col rounded-[var(--radius-card)] p-7 ${
                dark
                  ? "on-dark bg-ink-900 text-slate-300 shadow-[0_30px_60px_-30px_rgb(15_31_46/0.6)] ring-1 ring-brand-teal/40"
                  : "border border-line bg-white shadow-[var(--shadow-card)]"
              }`}
            >
              {dark && (
                <p className="absolute -top-3 left-7 rounded-full bg-brand-teal px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-900">
                  Most popular
                </p>
              )}
              <h3 className={`text-xl font-bold ${dark ? "text-white" : "text-ink-900"}`}>{plan.name}</h3>
              <p className={`mt-2 min-h-12 text-[0.95rem] ${dark ? "text-slate-300" : "text-text-muted"}`}>{plan.tagline}</p>
              <p className={`mt-6 font-display text-4xl font-bold ${dark ? "text-white" : "text-ink-900"}`}>
                {formatRand(perMonth, perMonth % 1 ? 2 : 0)}
                <span className="ml-1 text-base font-medium opacity-70">/month</span>
              </p>
              <p className={`mt-1 h-10 text-sm ${dark ? "text-slate-400" : "text-text-muted"}`}>
                {cycle === "annually"
                  ? `${formatRand(plan.annually)} billed yearly, save ${formatRand(annualSaving(plan))}`
                  : "Billed monthly, cancel any time"}
              </p>
              {cycle === "annually" && plan.freeDomainOnAnnual && (
                <p className={`mt-3 flex items-center gap-2 text-sm font-semibold ${dark ? "text-brand-teal" : "text-brand-teal-dark"}`}>
                  <Gift className="size-4" aria-hidden="true" /> Free domain for the first year
                </p>
              )}
              <ul className="mt-6 space-y-2.5 text-[0.95rem]">
                {[...Object.values(plan.specs), ...plan.features].map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check className={`mt-0.5 size-4.5 shrink-0 ${dark ? "text-brand-teal" : "text-brand-teal-dark"}`} aria-hidden="true" />
                    <span className={dark ? "text-slate-200" : "text-ink-700"}>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Link
                  href={`/hosting/order?plan=${plan.id}&cycle=${cycle}`}
                  data-track={`cta_hosting_order_${plan.id}`}
                  className={buttonClasses(dark ? "primary" : "dark", "md", "w-full")}
                >
                  Choose {plan.name}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
