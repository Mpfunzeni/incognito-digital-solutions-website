import { redirect } from "next/navigation";
import { AuthShell } from "@/components/account/AuthShell";
import { SignUpForm } from "@/components/account/AuthForms";
import { getCurrentCustomer, safeNext } from "@/lib/hosting/session";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Create a Client Account",
  description: "Create your Incognito Digital Solutions client account to order hosting and manage your services online.",
  path: "/account/sign-up",
  noindex: true,
});

export default async function SignUpPage({ searchParams }: PageProps<"/account/sign-up">) {
  const next = safeNext((await searchParams).next);
  if (await getCurrentCustomer()) redirect(next);
  return (
    <AuthShell title="Create your account" intro="It takes a minute. You can add billing details later.">
      <SignUpForm next={next} />
    </AuthShell>
  );
}
