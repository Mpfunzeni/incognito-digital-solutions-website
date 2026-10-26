import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowLeft, CreditCard, Download, Landmark } from "lucide-react";
import { eftDetails } from "@/content/hosting";
import { site } from "@/content/site";
import { buttonClasses } from "@/components/ui/Button";
import { cents, formatDate, Panel, StatusBadge } from "@/components/account/Bits";
import { FormMessage } from "@/components/account/FormParts";
import { buildCheckout, payfastConfig } from "@/lib/hosting/payfast";
import { requireCustomer } from "@/lib/hosting/session";
import { getInvoice, invoiceNumber } from "@/lib/hosting/store";

/** The URL of this deployment, so PayFast returns to (and notifies) the right site. */
async function requestOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || (host?.startsWith("localhost") ? "http" : "https");
  return host ? `${proto}://${host}` : site.url;
}

export default async function InvoicePage({ params, searchParams }: PageProps<"/account/invoices/[id]">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const customer = await requireCustomer(`/account/invoices/${id}`);
  const invoice = await getInvoice(customer.id, id);
  if (!invoice) notFound();

  const number = invoiceNumber(invoice.number);
  const payfast = payfastConfig();
  const checkout =
    invoice.status === "unpaid" && payfast
      ? buildCheckout(payfast, {
          invoiceId: invoice.id,
          invoiceNumber: number,
          amountCents: invoice.total_cents,
          itemName: invoice.lines[0]?.description ?? `${site.name} invoice`,
          customer: { fullName: customer.full_name, email: customer.email },
          siteUrl: await requestOrigin(),
        })
      : null;
  const eftAvailable = Boolean(eftDetails.accountNumber);

  return (
    <>
      <Link href="/account/invoices" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-700 hover:text-ink-900">
        <ArrowLeft className="size-4" aria-hidden="true" /> All invoices
      </Link>

      <div className="mb-6 space-y-3">
        {sp.ordered && <FormMessage ok message="Thank you, your order has been placed. Pay this invoice to start your hosting set-up." />}
        {sp.payment === "return" && invoice.status === "unpaid" && (
          <FormMessage ok message="Thank you. We are confirming your payment with PayFast; this page updates within a minute or two." />
        )}
        {sp.payment === "return" && invoice.status === "paid" && <FormMessage ok message="Payment received. Thank you!" />}
        {sp.payment === "cancelled" && <FormMessage message="The payment was cancelled. You can try again below." />}
      </div>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
          <div>
            <h1 className="text-3xl font-bold text-ink-900">{number}</h1>
            <p className="mt-1 text-sm text-text-muted">
              Issued {formatDate(invoice.created_at)} · Due {formatDate(invoice.due_date)}
              {invoice.paid_at && <> · Paid {formatDate(invoice.paid_at)}</>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={invoice.status} />
            <a href={`/account/invoices/${invoice.id}/pdf`} className={buttonClasses("secondary", "sm")} data-track="hosting_invoice_pdf">
              <Download className="size-4" aria-hidden="true" /> Download PDF
            </a>
          </div>
        </div>

        <div className="grid gap-6 border-b border-line py-6 text-[0.95rem] sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-text-muted">From</p>
            <p className="mt-1 font-semibold text-ink-900">{site.name}</p>
            <p className="text-ink-700">{site.contact.email}</p>
            <p className="text-ink-700">{site.contact.phoneDisplay}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-text-muted">Billed to</p>
            <p className="mt-1 font-semibold text-ink-900">{customer.company || customer.full_name}</p>
            {customer.company && <p className="text-ink-700">{customer.full_name}</p>}
            {[customer.address_line1, customer.address_line2, [customer.city, customer.postal_code].filter(Boolean).join(" "), customer.province]
              .filter(Boolean)
              .map((line) => (
                <p key={line} className="text-ink-700">
                  {line}
                </p>
              ))}
            {customer.vat_number && <p className="text-ink-700">VAT {customer.vat_number}</p>}
          </div>
        </div>

        <table className="w-full text-[0.95rem]">
          <caption className="sr-only">Invoice items</caption>
          <thead>
            <tr className="text-left text-sm text-text-muted">
              <th scope="col" className="py-3 font-semibold">Description</th>
              <th scope="col" className="py-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line border-y border-line">
            {invoice.lines.map((l, idx) => (
              <tr key={idx}>
                <td className="py-3 pr-4 text-ink-800">{l.description}</td>
                <td className="py-3 text-right text-ink-900">{cents(l.amount * 100)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="pt-4 text-left font-bold text-ink-900">Total</th>
              <td className="pt-4 text-right font-display text-2xl font-bold text-ink-900">{cents(invoice.total_cents)}</td>
            </tr>
          </tfoot>
        </table>
        {invoice.payment_method && (
          <p className="mt-4 text-sm text-text-muted">
            Paid by {invoice.payment_method === "payfast" ? "PayFast" : "EFT"}
            {invoice.payment_reference && <> (reference {invoice.payment_reference})</>}
          </p>
        )}
      </Panel>

      {invoice.status === "unpaid" && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {checkout && (
            <Panel title="Pay online">
              <p className="text-[0.95rem] text-text-muted">
                Pay securely by card, Instant EFT or other options through PayFast.
                {payfast?.mode === "sandbox" && " (Test mode: no real money is charged.)"}
              </p>
              <form action={checkout.action} method="post" className="mt-5">
                {checkout.fields.map(([k, v]) => (
                  <input key={k} type="hidden" name={k} value={v} />
                ))}
                <button type="submit" className={buttonClasses("primary", "lg", "w-full")} data-track="hosting_pay_payfast">
                  <CreditCard className="size-5" aria-hidden="true" /> Pay {cents(invoice.total_cents)} now
                </button>
              </form>
            </Panel>
          )}
          <Panel title="Pay by EFT">
            {eftAvailable ? (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[0.95rem]">
                <dt className="text-text-muted">Bank</dt>
                <dd className="font-medium text-ink-900">{eftDetails.bank}</dd>
                <dt className="text-text-muted">Account name</dt>
                <dd className="font-medium text-ink-900">{eftDetails.accountName}</dd>
                <dt className="text-text-muted">Account number</dt>
                <dd className="font-mono font-medium text-ink-900">{eftDetails.accountNumber}</dd>
                <dt className="text-text-muted">Branch code</dt>
                <dd className="font-mono font-medium text-ink-900">{eftDetails.branchCode}</dd>
                <dt className="text-text-muted">Reference</dt>
                <dd className="font-mono font-bold text-ink-900">{number}</dd>
              </dl>
            ) : (
              <p className="flex gap-3 text-[0.95rem] text-text-muted">
                <Landmark className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <span>
                  For our banking details, email{" "}
                  <a href={`mailto:${site.contact.email}?subject=${encodeURIComponent(`Banking details for ${number}`)}`} className="font-semibold text-brand-teal-dark underline">
                    {site.contact.email}
                  </a>{" "}
                  or call {site.contact.phoneDisplay}.
                </span>
              </p>
            )}
            <p className="mt-4 text-sm text-text-muted">EFT payments are confirmed by hand, usually within one business day.</p>
          </Panel>
        </div>
      )}
    </>
  );
}
