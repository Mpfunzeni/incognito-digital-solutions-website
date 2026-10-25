import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PortalNav } from "@/components/account/PortalNav";
import { isAdmin, requireCustomer } from "@/lib/hosting/session";

export const metadata: Metadata = {
  title: "Client Area",
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }: LayoutProps<"/account">) {
  const customer = await requireCustomer();
  return (
    <div className="bg-surface-muted py-10 sm:py-14">
      <Container className="grid gap-8 lg:grid-cols-[15rem_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 hidden px-4 text-sm text-text-muted lg:block">
            Signed in as
            <span className="block truncate font-semibold text-ink-900">{customer.full_name}</span>
          </p>
          <PortalNav admin={isAdmin(customer)} />
        </aside>
        <div className="min-w-0">{children}</div>
      </Container>
    </div>
  );
}
