import { redirect } from "next/navigation";
import { AuthShell } from "@/components/account/AuthShell";
import { LoginForm } from "@/components/account/AuthForms";
import { getCurrentCustomer, safeNext } from "@/lib/hosting/session";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Client Log In",
  description: "Log in to your Incognito Digital Solutions client area to manage hosting, domains and invoices.",
  path: "/account/login",
  noindex: true,
});

export default async function LoginPage({ searchParams }: PageProps<"/account/login">) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (await getCurrentCustomer()) redirect(next);
  return (
    <AuthShell title="Log in" intro="Welcome back. Log in to manage your hosting and invoices.">
      <LoginForm next={next} notice={sp.loggedOut ? "You have been logged out." : undefined} />
    </AuthShell>
  );
}
