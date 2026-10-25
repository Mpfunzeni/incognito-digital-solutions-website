import Link from "next/link";
import { AuthShell } from "@/components/account/AuthShell";
import { ResetPasswordForm } from "@/components/account/AuthForms";
import { FormMessage } from "@/components/account/FormParts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Choose a New Password",
  description: "Choose a new password for your Incognito Digital Solutions client account.",
  path: "/account/reset-password",
  noindex: true,
});

export default async function ResetPasswordPage({ searchParams }: PageProps<"/account/reset-password">) {
  const { token } = await searchParams;
  return (
    <AuthShell title="Choose a new password" intro="Your new password signs you out of all other devices.">
      {typeof token === "string" && token.length >= 20 ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="space-y-4">
          <FormMessage message="This reset link is incomplete. Please use the full link from your email, or request a new one." />
          <Link href="/account/forgot-password" className="font-semibold text-brand-teal-dark underline">
            Request a new link
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
