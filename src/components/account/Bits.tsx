import type { ReactNode } from "react";
import { formatRand } from "@/content/hosting";

const tones = {
  green: "bg-[#dcfce7] text-[#166534]",
  amber: "bg-[#fef3c7] text-[#92400e]",
  red: "bg-[#ffe4e6] text-[#9f1239]",
  grey: "bg-slate-100 text-slate-700",
  blue: "bg-brand-teal/15 text-ink-900",
};

const statusMap: Record<string, { label: string; tone: keyof typeof tones }> = {
  pending: { label: "Awaiting payment", tone: "amber" },
  provisioning: { label: "Setting up", tone: "blue" },
  active: { label: "Active", tone: "green" },
  suspended: { label: "Suspended", tone: "red" },
  cancelled: { label: "Cancelled", tone: "grey" },
  unpaid: { label: "Unpaid", tone: "amber" },
  paid: { label: "Paid", tone: "green" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status] ?? { label: status, tone: "grey" as const };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[s.tone]}`}>{s.label}</span>;
}

export function Panel({ title, action, children, className = "" }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] sm:p-7 ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="text-xl font-bold text-ink-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageTitle({ title, intro }: { title: string; intro?: ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">{title}</h1>
      {intro && <p className="mt-2 text-text-muted">{intro}</p>}
    </div>
  );
}

export function cents(n: number) {
  return formatRand(n / 100, 2);
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "Not set";
  const d = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Johannesburg" }).format(d);
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-dashed border-line bg-surface-muted px-6 py-10 text-center text-text-muted">{children}</div>;
}
