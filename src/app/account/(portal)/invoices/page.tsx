import Link from "next/link";
import { cents, EmptyState, formatDate, PageTitle, StatusBadge } from "@/components/account/Bits";
import { requireCustomer } from "@/lib/hosting/session";
import { invoiceNumber, listInvoices } from "@/lib/hosting/store";

export default async function InvoicesPage() {
  const customer = await requireCustomer("/account/invoices");
  const invoices = await listInvoices(customer.id);
  return (
    <>
      <PageTitle title="Invoices" intro="Every invoice on your account. Unpaid invoices can be paid online." />
      {invoices.length === 0 ? (
        <EmptyState>You do not have any invoices yet.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[40rem] text-left text-[0.95rem]">
            <thead className="border-b border-line bg-surface-muted text-sm text-text-muted">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Invoice</th>
                <th scope="col" className="px-5 py-3 font-semibold">Date</th>
                <th scope="col" className="px-5 py-3 font-semibold">Description</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Total</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3 font-semibold"><span className="sr-only">PDF</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {invoices.map((i) => (
                <tr key={i.id}>
                  <td className="px-5 py-3.5">
                    <Link href={`/account/invoices/${i.id}`} className="font-semibold text-brand-teal-dark underline underline-offset-2">
                      {invoiceNumber(i.number)}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-ink-700">{formatDate(i.created_at)}</td>
                  <td className="px-5 py-3.5 text-ink-700">{i.lines[0]?.description}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-ink-900">{cents(i.total_cents)}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={i.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <a href={`/account/invoices/${i.id}/pdf`} className="text-sm font-semibold text-brand-teal-dark underline underline-offset-2">
                      PDF<span className="sr-only"> of {invoiceNumber(i.number)}</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
