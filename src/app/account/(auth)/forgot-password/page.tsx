import { AuthShell } from "@/components/account/AuthShell";
import { ForgotPasswordForm } from "@/components/account/AuthForms";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Reset Your Password",
  description: "Request a link to reset your Incognito Digital Solutions client account password.",
  path: "/account/forgot-password",
  noindex: true,
});

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Forgot your password?" intro="Enter your email address and we will send you a link to choose a new one.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
