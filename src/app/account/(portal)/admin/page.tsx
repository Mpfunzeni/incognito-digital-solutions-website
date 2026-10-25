import { getPlan } from "@/content/hosting";
import { buttonClasses } from "@/components/ui/Button";
import { cents, EmptyState, formatDate, PageTitle, Panel, StatusBadge } from "@/components/account/Bits";
import { FormMessage } from "@/components/account/FormParts";
import {
  adminCancelInvoiceAction,
  adminMarkPaidAction,
  adminRunRenewalsAction,
  adminUpdateServiceAction,
} from "@/app/account/actions";
import { payfastConfig } from "@/lib/hosting/payfast";
import { provisioningMode } from "@/lib/hosting/provisioning";
import { requireAdmin } from "@/lib/hosting/session";
import { adminOverview, invoiceNumber } from "@/lib/hosting/store";

const doneMessages: Record<string, string> = {
  paid: "Invoice marked as paid.",
  cancelled: "Invoice cancelled.",
  service: "Service updated.",
};

const smallInput = "h-9 rounded-lg border border-[#cbd5e1] bg-white px-2.5 text-sm text-ink-900";

export default async function AdminPage({ searchParams }: PageProps<"/account/admin">) {
  await requireAdmin();
  const sp = await searchParams;
  const { customers, services, invoices } = await adminOverview();
  const unpaid = invoices.filter((i) => i.status === "unpaid");
  const done = typeof sp.done === "string" ? (sp.done === "renewals" ? `${sp.count ?? 0} renewal invoice(s) created.` : doneMessages[sp.done]) : undefined;
  const payfast = payfastConfig();

  return (
    <>
      <PageTitle
        title="Admin"
        intro={`Payments: ${payfast ? `PayFast (${payfast.mode})` : "PayFast not set up"} · Account set-up: ${provisioningMode() === "whm" ? "automatic (WHM)" : "manual"}`}
      />
      {done && <div className="mb-6"><FormMessage ok message={done} /></div>}

      <Panel
        title={`Unpaid invoices (${unpaid.length})`}
        action={
          <form action={adminRunRenewalsAction}>
            <button type="submit" className={buttonClasses("dark", "sm")}>
              Create due renewal invoices
            </button>
          </form>
        }
      >
        {unpaid.length === 0 ? (
          <EmptyState>No unpaid invoices.</EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {unpaid.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                <div className="min-w-0">
                  <p className="font-semibold text-ink-900">
                    {invoiceNumber(i.number)} · {cents(i.total_cents)}
                  </p>
                  <p className="text-sm text-text-muted">
                    {i.full_name} ({i.email}) · {i.lines[0]?.description} · due {formatDate(i.due_date)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <form action={adminMarkPaidAction} className="flex gap-2">
                    <input type="hidden" name="invoiceId" value={i.id} />
                    <label className="sr-only" htmlFor={`ref-${i.id}`}>
                      Payment reference
                    </label>
                    <input id={`ref-${i.id}`} name="reference" placeholder="EFT reference" className={`${smallInput} w-36`} />
                    <button type="submit" className={buttonClasses("primary", "sm", "h-9")}>
                      Mark paid
                    </button>
                  </form>
                  <form action={adminCancelInvoiceAction}>
                    <input type="hidden" name="invoiceId" value={i.id} />
                    <button type="submit" className={buttonClasses("ghost", "sm", "h-9 border border-line")}>
                      Cancel
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title={`Hosting services (${services.length})`} className="mt-6">
        {services.length === 0 ? (
          <EmptyState>No services yet.</EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {services.map((s) => (
              <li key={s.id} className="py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-900">
                      {s.domain} <StatusBadge status={s.status} />
                    </p>
                    <p className="text-sm text-text-muted">
                      {s.full_name} ({s.email}) · {getPlan(s.plan_id)?.name ?? s.plan_id}, {s.billing_cycle} · domain {s.domain_action} · renews{" "}
                      {formatDate(s.next_due_date)}
                    </p>
                    {s.server_note && <p className="mt-1 text-sm text-[#9f1239]">Set-up error: {s.server_note}</p>}
                  </div>
                  <form key={`${s.status}-${s.username}`} action={adminUpdateServiceAction} className="flex flex-wrap gap-2">
                    <input type="hidden" name="serviceId" value={s.id} />
                    <label className="sr-only" htmlFor={`user-${s.id}`}>
                      cPanel username
                    </label>
                    <input id={`user-${s.id}`} name="username" defaultValue={s.username} placeholder="cPanel username" className={`${smallInput} w-36`} />
                    <label className="sr-only" htmlFor={`status-${s.id}`}>
                      Status
                    </label>
                    <select id={`status-${s.id}`} name="status" defaultValue={s.status} className={smallInput}>
                      <option value="pending">Awaiting payment</option>
                      <option value="provisioning">Setting up</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button type="submit" className={buttonClasses("dark", "sm", "h-9")}>
                      Save
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title={`Customers (${customers.length})`} className="mt-6">
        {customers.length === 0 ? (
          <EmptyState>No customers yet.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="text-text-muted">
                <tr>
                  <th scope="col" className="py-2 pr-4 font-semibold">Name</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Email</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Phone</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Business</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Services</th>
                  <th scope="col" className="py-2 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 pr-4 font-medium text-ink-900">{c.full_name}</td>
                    <td className="py-2.5 pr-4">
                      <a href={`mailto:${c.email}`} className="text-brand-teal-dark underline">
                        {c.email}
                      </a>
                    </td>
                    <td className="py-2.5 pr-4">{c.phone || "None"}</td>
                    <td className="py-2.5 pr-4">{c.company || "None"}</td>
                    <td className="py-2.5 pr-4">{c.service_count}</td>
                    <td className="py-2.5">{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
