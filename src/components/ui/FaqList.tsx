import { Plus } from "lucide-react";
import type { FAQ } from "@/content/services";

/** Accessible accordion built on native <details>/<summary>: keyboard and screen-reader friendly with no JavaScript. */
export function FaqList({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-white">
      {faqs.map((f) => (
        <details key={f.question} className="group px-5 sm:px-7 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-semibold text-ink-900 sm:text-lg">
            <h3 className="font-sans text-[inherit] tracking-normal">{f.question}</h3>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-muted text-ink-700 transition-transform duration-200 group-open:rotate-45">
              <Plus className="size-4" aria-hidden="true" />
            </span>
          </summary>
          <p className="-mt-1 pb-6 pr-10 leading-relaxed text-text-muted">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
