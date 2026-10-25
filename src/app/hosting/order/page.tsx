import Link from "next/link";
import { getPlan, hostingPlans, formatRand, type BillingCycle } from "@/content/hosting";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { OrderForm } from "@/components/hosting/OrderForm";
import { isDatabaseConfigured } from "@/lib/hosting/db";
import { getCurrentCustomer } from "@/lib/hosting/session";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Order Web Hosting",
  description: "Order web hosting from Incognito Digital Solutions: choose a plan, add your domain and pay online.",
  path: "/hosting/order",
  noindex: true,
});

export default async function OrderPage({ searchParams }: PageProps<"/hosting/order">) {
  const sp = await searchParams;
  const plan = getPlan(typeof sp.plan === "string" ? sp.plan : undefined) ?? hostingPlans.find((p) => p.highlighted) ?? hostingPlans[0];
  const cycle: BillingCycle = sp.cycle === "monthly" ? "monthly" : "annually";
  const customer = await getCurrentCustomer();
  const here = `/hosting/order?plan=${plan.id}&cycle=${cycle}`;

  return (
    <>
      <PageHero
        eyebrow="Order hosting"
        title={customer ? "Complete your order" : `${plan.name} hosting`}
        crumbs={[
          { name: "Hosting", path: "/hosting" },
          { name: "Order", path: "/hosting/order" },
        ]}
      />
      <section className="bg-surface-muted py-12 sm:py-16">
        <Container>
          {!isDatabaseConfigured() ? (
            <div className="mx-auto max-w-2xl rounded-[var(--radius-card)] border border-line bg-white p-8 text-center shadow-[var(--shadow-card)]">
              <h2 className="text-2xl font-bold text-ink-900">Online ordering opens soon</h2>
              <p className="mt-3 text-text-muted">
                To order {plan.name} hosting today, call {site.contact.phoneDisplay} or email {site.contact.email} and we will set it up for you.
              </p>
              <Link href={`/get-a-quote?service=${encodeURIComponent("Web Hosting and Domain Registration")}`} className={buttonClasses("primary", "lg", "mt-6")}>
                Request hosting
              </Link>
            </div>
          ) : customer ? (
            <OrderForm initialPlan={plan.id} initialCycle={cycle} />
          ) : (
            <div className="mx-auto max-w-2xl rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-card)]">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-teal-dark">Step 1 of 3</p>
              <h2 className="mt-2 text-2xl font-bold text-ink-900">Create your client account</h2>
              <p className="mt-3 text-text-muted">
                You have chosen <strong className="text-ink-900">{plan.name}</strong> at{" "}
                <strong className="text-ink-900">
                  {cycle === "annually" ? `${formatRand(plan.annually)} a year` : `${formatRand(plan.monthly)} a month`}
                </strong>
                . Your account is where you manage your hosting, pay invoices and open cPanel.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/account/sign-up?next=${encodeURIComponent(here)}`} className={buttonClasses("primary", "lg")}>
                  Create account
                </Link>
                <Link href={`/account/login?next=${encodeURIComponent(here)}`} className={buttonClasses("dark", "lg")}>
                  I have an account
                </Link>
              </div>
              <p className="mt-6 text-sm text-text-muted">
                <Link href="/hosting#plans" className="font-semibold text-brand-teal-dark underline">
                  Change plan
                </Link>
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
