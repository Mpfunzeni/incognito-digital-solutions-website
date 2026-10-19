import Link from "next/link";
import { Check, Info, Minus } from "lucide-react";
import { formatPrice, type Package } from "@/content/pricing";
import { buttonClasses } from "@/components/ui/Button";

export function PricingCard({ pkg }: { pkg: Package }) {
  const dark = pkg.highlighted;
  return (
    <article
      className={`relative flex h-full flex-col rounded-[var(--radius-card)] p-7 ${
        dark
          ? "on-dark bg-ink-900 text-slate-300 shadow-[0_30px_60px_-30px_rgb(15_31_46/0.6)] ring-1 ring-brand-teal/40"
          : "border border-line bg-white shadow-[var(--shadow-card)]"
      }`}
    >
      {dark && (
        <p className="absolute -top-3 left-7 rounded-full bg-brand-teal px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-900">
          Most requested
        </p>
      )}
      <h3 className={`text-xl font-bold ${dark ? "text-white" : "text-ink-900"}`}>{pkg.name}</h3>
      <p className={`mt-2 text-[0.95rem] ${dark ? "text-slate-300" : "text-text-muted"}`}>{pkg.description}</p>
      <p className={`mt-6 font-display text-3xl font-bold ${dark ? "text-white" : "text-ink-900"}`}>
        {pkg.price ? (
          <>
            {formatPrice(pkg.price)}
            {pkg.price.suffix && <span className="ml-1 text-base font-medium opacity-70">{pkg.price.suffix}</span>}
          </>
        ) : (
          "Request a Quote"
        )}
      </p>
      {!pkg.price && (
        <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-text-muted"}`}>Tailored to your scope</p>
      )}
      <ul className="mt-6 space-y-3 text-[0.95rem]">
        {pkg.features.map((f) => (
          <li key={f} className="flex gap-2.5">
            <Check className={`mt-0.5 size-4.5 shrink-0 ${dark ? "text-brand-teal" : "text-brand-teal-dark"}`} aria-hidden="true" />
            <span className={dark ? "text-slate-200" : "text-ink-700"}>{f}</span>
          </li>
        ))}
        {pkg.notIncluded?.map((f) => (
          <li key={f} className="flex gap-2.5">
            <Minus className="mt-0.5 size-4.5 shrink-0 opacity-50" aria-hidden="true" />
            <span className={dark ? "text-slate-400" : "text-text-muted"}>{f}</span>
          </li>
        ))}
      </ul>
      {pkg.recurring && (
        <p className={`mt-5 flex gap-2 text-sm ${dark ? "text-slate-400" : "text-text-muted"}`}>
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {pkg.recurring}
        </p>
      )}
      <div className="mt-auto pt-7">
        <Link
          href={`/get-a-quote?package=${pkg.id}`}
          data-track={`cta_quote_package_${pkg.id}`}
          className={buttonClasses(dark ? "primary" : "dark", "md", "w-full")}
        >
          Request a Quote<span className="sr-only"> for {pkg.name}</span>
        </Link>
      </div>
    </article>
  );
}
