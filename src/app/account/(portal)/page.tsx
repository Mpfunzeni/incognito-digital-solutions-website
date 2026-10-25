import Link from "next/link";
import { ArrowRight, FileText, Server } from "lucide-react";
import { getPlan } from "@/content/hosting";
import { buttonClasses } from "@/components/ui/Button";
import { cents, EmptyState, formatDate, PageTitle, Panel, StatusBadge } from "@/components/account/Bits";
import { FormMessage } from "@/components/account/FormParts";
import { requireCustomer } from "@/lib/hosting/session";
import { invoiceNumber, listInvoices, listServices } from "@/lib/hosting/store";

export default async function AccountOverviewPage({ searchParams }: PageProps<"/account">) {
  const sp = await searchParams;
  const customer = await requireCustomer();
  const [services, invoices] = await Promise.all([listServices(customer.id), listInvoices(customer.id)]);
  const unpaid = invoices.filter((i) => i.status === "unpaid");
  const unpaidTotal = unpaid.reduce((sum, i) => sum + i.total_cents, 0);
  const active = services.filter((s) => s.status === "active");
  const profileIncomplete = !customer.phone || !customer.address_line1;

  return (
    <>
      <PageTitle title={`Hello, ${customer.full_name.split(" ")[0]}`} intro="Here is a summary of your hosting and billing." />
      {sp.passwordReset && <div className="mb-6"><FormMessage ok message="Your password has been changed." /></div>}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Active services" value={String(active.length)} />
        <Stat label="Amount due" value={cents(unpaidTotal)} tone={unpaidTotal > 0 ? "warn" : undefined} />
        <Stat
          label="Next renewal"
          value={formatDate(
            active.map((s) => s.next_due_date).filter(Boolean).sort((a, b) => new Date(a!).getTime() - new Date(b!).getTime())[0] ?? null,
          )}
        />
      </div>

      {unpaid.length > 0 && (
        <Panel className="mt-6 border-[#fde68a] bg-[#fffbeb]">
          <p className="font-semibold text-ink-900">
            You have {unpaid.length} unpaid invoice{unpaid.length > 1 ? "s" : ""}.
          </p>
          <ul className="mt-3 space-y-2">
            {unpaid.map((i) => (
              <li key={i.id}>
                <Link href={`/account/invoices/${i.id}`} className="inline-flex items-center gap-2 font-semibold text-brand-teal-dark underline underline-offset-2">
                  Pay {invoiceNumber(i.number)} ({cents(i.total_cents)}) <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel
        className="mt-6"
        title="Your hosting"
        action={
          <Link href="/hosting" className={buttonClasses("dark", "sm")}>
            Order hosting
          </Link>
        }
      >
        {services.length === 0 ? (
          <EmptyState>
            <Server className="mx-auto mb-3 size-8 text-slate-400" aria-hidden="true" />
            You do not have any hosting yet.{" "}
            <Link href="/hosting" className="font-semibold text-brand-teal-dark underline">
              Compare hosting plans
            </Link>
          </EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {services.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold text-ink-900">{s.domain}</p>
                  <p className="text-sm text-text-muted">
                    {getPlan(s.plan_id)?.name ?? s.plan_id} plan, renews {formatDate(s.next_due_date)}
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/account/invoices" className="group rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]">
          <FileText className="size-6 text-brand-teal-dark" aria-hidden="true" />
          <p className="mt-3 font-semibold text-ink-900">Invoices and payments</p>
          <p className="text-sm text-text-muted">{invoices.length} invoice{invoices.length === 1 ? "" : "s"} on your account</p>
        </Link>
        <Link href="/account/profile" className="group rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]">
          <p className="font-semibold text-ink-900">Profile and billing details</p>
          <p className="mt-1 text-sm text-text-muted">
            {profileIncomplete ? "Add your phone number and billing address so we can invoice you correctly." : "Your details are complete."}
          </p>
        </Link>
      </div>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "warn" }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-card)]">
      <p className="text-sm text-text-muted">{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${tone === "warn" ? "text-[#b45309]" : "text-ink-900"}`}>{value}</p>
    </div>
  );
}
