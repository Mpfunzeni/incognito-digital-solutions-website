"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight, Check, Clock, Plus } from "lucide-react";
import {
  billingLabel,
  formatRand,
  getServicePricing,
  selectionTotals,
  type Billing,
} from "@/content/service-pricing";
import { buttonClasses } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

const totalLabel: Record<Billing, string> = { "once-off": "Once-off", monthly: "Monthly", yearly: "Yearly" };

/** Interactive tier and add-on selector. The chosen package is carried into the quote form. */
export function PackagePicker({ slug, serviceTitle }: { slug: string; serviceTitle: string }) {
  const pricing = getServicePricing(slug);
  const uid = useId();
  const [tierId, setTierId] = useState(
    () => pricing?.tiers.find((t) => t.highlighted)?.id ?? pricing?.tiers[0]?.id ?? "",
  );
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  if (!pricing) return null;

  const tier = pricing.tiers.find((t) => t.id === tierId) ?? pricing.tiers[0];
  const addOns = pricing.addOns.filter((a) => addOnIds.includes(a.id));
  const totals = selectionTotals({ tier, addOns });
  const quoteHref = `/get-a-quote?${new URLSearchParams({
    service: serviceTitle,
    tier: tier.id,
    ...(addOns.length ? { addons: addOns.map((a) => a.id).join(",") } : {}),
  })}`;

  const toggleAddOn = (id: string) =>
    setAddOnIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  return (
    <div>
      <fieldset>
        <legend className="sr-only">Choose a package</legend>
        <div className="grid gap-5 md:grid-cols-3">
          {pricing.tiers.map((t) => {
            const selected = t.id === tier.id;
            return (
              <label
                key={t.id}
                className={`relative flex h-full cursor-pointer flex-col rounded-[var(--radius-card)] border-2 bg-white p-6 shadow-[var(--shadow-card)] transition-[border-color,box-shadow,transform] has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-teal-dark ${
                  selected
                    ? "border-brand-teal-dark shadow-[var(--shadow-card-hover)] md:-translate-y-1"
                    : "border-line hover:border-brand-teal/60"
                }`}
              >
                <input
                  type="radio"
                  name={`${uid}-tier`}
                  value={t.id}
                  checked={selected}
                  onChange={() => {
                    setTierId(t.id);
                    trackEvent("select_package", { service: slug, tier: t.id });
                  }}
                  className="sr-only"
                />
                {t.highlighted && (
                  <span className="absolute -top-3 left-6 rounded-full bg-brand-teal px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-900">
                    Most popular
                  </span>
                )}
                <span className="flex items-start justify-between gap-3">
                  <span className="text-xl font-bold text-ink-900">{t.name}</span>
                  <span
                    aria-hidden="true"
                    className={`grid size-6 shrink-0 place-items-center rounded-full border-2 ${
                      selected ? "border-brand-teal-dark bg-brand-teal-dark text-white" : "border-line"
                    }`}
                  >
                    {selected && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                </span>
                <span className="mt-2 block text-[0.95rem] text-text-muted">{t.tagline}</span>
                <span className="mt-5 block">
                  <span className="block text-sm font-semibold uppercase tracking-wider text-text-muted">From</span>
                  <span className="font-display text-3xl font-bold text-ink-900">{formatRand(t.from)}</span>
                  <span className="ml-1 text-base font-medium text-text-muted">{billingLabel[t.billing]}</span>
                </span>
                {t.timeline && (
                  <span className="mt-2 flex items-center gap-1.5 text-sm text-text-muted">
                    <Clock className="size-4" aria-hidden="true" /> Typical timeline: {t.timeline}
                  </span>
                )}
                <ul className="mt-5 space-y-2.5 text-[0.95rem]">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-ink-700">
                      <Check className="mt-0.5 size-4.5 shrink-0 text-brand-teal-dark" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {pricing.addOns.length > 0 ? (
          <fieldset className="rounded-[var(--radius-card)] border border-line bg-white p-6">
            <legend className="float-left mb-4 w-full font-sans text-base font-bold text-ink-900">
              Optional add-ons
            </legend>
            <ul className="clear-both space-y-3">
              {pricing.addOns.map((a) => {
                const checked = addOnIds.includes(a.id);
                return (
                  <li key={a.id}>
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-teal-dark ${
                        checked ? "border-brand-teal-dark bg-brand-teal/10" : "border-line hover:border-brand-teal/60"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddOn(a.id)}
                        className="size-4.5 shrink-0 accent-[#0a7c78]"
                      />
                      <span className="flex-1 text-ink-700">{a.name}</span>
                      <span className="whitespace-nowrap font-semibold text-ink-900">
                        <Plus className="inline size-3.5" aria-hidden="true" />
                        <span className="sr-only">adds from </span>
                        {formatRand(a.from)}
                        <span className="font-normal text-text-muted">{a.billing === "once-off" ? "" : billingLabel[a.billing]}</span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ) : (
          <div />
        )}

        <div className="on-dark flex flex-col rounded-[var(--radius-card)] bg-ink-900 p-6 text-slate-300 shadow-[0_30px_60px_-30px_rgb(15_31_46/0.6)] ring-1 ring-brand-teal/40">
          <h3 className="font-sans text-base font-bold text-white">Your estimate</h3>
          <div aria-live="polite">
            <p className="mt-3 text-sm">
              {tier.name}
              {addOns.length > 0 && ` + ${addOns.length} add-on${addOns.length > 1 ? "s" : ""}`}
            </p>
            <dl className="mt-4 space-y-2">
              {(Object.keys(totals) as Billing[])
                .filter((b) => totals[b] > 0)
                .map((b) => (
                  <div key={b} className="flex items-baseline justify-between gap-4">
                    <dt>{totalLabel[b]} from</dt>
                    <dd className="font-display text-2xl font-bold text-white">{formatRand(totals[b])}</dd>
                  </div>
                ))}
            </dl>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            Starting prices in South African Rand, excluding VAT. Your final quotation is confirmed after we discuss
            your exact requirements.
          </p>
          <div className="mt-auto pt-6">
            <Link
              href={quoteHref}
              data-track={`cta_quote_tier_${tier.id}`}
              className={buttonClasses("primary", "lg", "w-full")}
            >
              Request this package <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
