import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getPlan } from "@/content/hosting";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState, formatDate, PageTitle, Panel, StatusBadge } from "@/components/account/Bits";
import { FormMessage } from "@/components/account/FormParts";
import { openCpanelAction } from "@/app/account/actions";
import { provisioningMode } from "@/lib/hosting/provisioning";
import { requireCustomer } from "@/lib/hosting/session";
import { listServices } from "@/lib/hosting/store";

const domainActionLabel = { register: "New registration", transfer: "Transfer in", existing: "Your existing domain" };

export default async function ServicesPage({ searchParams }: PageProps<"/account/services">) {
  const sp = await searchParams;
  const customer = await requireCustomer("/account/services");
  const services = await listServices(customer.id);
  const nameservers = (process.env.HOSTING_NAMESERVERS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const canSso = provisioningMode() === "whm";

  return (
    <>
      <PageTitle title="Hosting services" intro="Your hosting plans, domains and control panel access." />
      {sp.cpanel === "unavailable" && (
        <div className="mb-6">
          <FormMessage message="cPanel could not be opened right now. Please try again in a few minutes, or contact us." />
        </div>
      )}
      {services.length === 0 ? (
        <EmptyState>
          No hosting services yet.{" "}
          <Link href="/hosting" className="font-semibold text-brand-teal-dark underline">
            Choose a plan
          </Link>
        </EmptyState>
      ) : (
        <div className="space-y-6">
          {services.map((s) => {
            const plan = getPlan(s.plan_id);
            return (
              <Panel key={s.id} title={s.domain} action={<StatusBadge status={s.status} />}>
                <dl className="grid gap-x-8 gap-y-4 text-[0.95rem] sm:grid-cols-2 lg:grid-cols-3">
                  <Item label="Plan" value={`${plan?.name ?? s.plan_id} (${s.billing_cycle === "annually" ? "billed yearly" : "billed monthly"})`} />
                  <Item label="Domain" value={domainActionLabel[s.domain_action] ?? s.domain_action} />
                  <Item label="Next renewal" value={formatDate(s.next_due_date)} />
                  {plan && <Item label="Storage" value={plan.specs.storage} />}
                  {plan && <Item label="Email" value={plan.specs.email} />}
                  {s.username && <Item label="cPanel username" value={s.username} />}
                </dl>
                {s.status === "pending" && (
                  <p className="mt-5 text-sm text-text-muted">
                    We set up this service as soon as its invoice is paid.{" "}
                    <Link href="/account/invoices" className="font-semibold text-brand-teal-dark underline">
                      View invoices
                    </Link>
                  </p>
                )}
                {s.status === "provisioning" && (
                  <p className="mt-5 text-sm text-text-muted">Payment received. We are setting up your hosting and will email you when it is ready.</p>
                )}
                {s.status === "active" && (
                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
                    {canSso && s.username && (
                      <form action={openCpanelAction}>
                        <input type="hidden" name="serviceId" value={s.id} />
                        <button type="submit" className={buttonClasses("primary", "sm")}>
                          Open cPanel <ExternalLink className="size-4" aria-hidden="true" />
                        </button>
                      </form>
                    )}
                    {nameservers.length > 0 && s.domain_action === "existing" && (
                      <p className="text-sm text-text-muted">
                        Point your domain to: <span className="font-mono text-ink-900">{nameservers.join(", ")}</span>
                      </p>
                    )}
                  </div>
                )}
              </Panel>
            );
          })}
        </div>
      )}
    </>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-text-muted">{label}</dt>
      <dd className="font-medium text-ink-900">{value}</dd>
    </div>
  );
}
