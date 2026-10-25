"use client";

import Link from "next/link";
import { useActionState } from "react";
import { logInAction, requestResetAction, resetPasswordAction, signUpAction } from "@/app/account/actions";
import { Field, FieldError, FormMessage, SubmitButton } from "./FormParts";

const linkClass = "font-semibold text-brand-teal-dark underline underline-offset-2 hover:text-ink-900";

export function SignUpForm({ next }: { next: string }) {
  const [state, action] = useActionState(signUpAction, undefined);
  const v = state?.values ?? {};
  const e = state?.errors ?? {};
  return (
    <form action={action} noValidate className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <FormMessage message={state?.message} ok={state?.ok} />
      <Field name="fullName" label="Full name" autoComplete="name" required defaultValue={v.fullName} error={e.fullName} />
      <Field name="email" label="Email address" type="email" autoComplete="email" required defaultValue={v.email} error={e.email} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="phone" label="Phone number" type="tel" autoComplete="tel" defaultValue={v.phone} error={e.phone} />
        <Field name="company" label="Business name" autoComplete="organization" defaultValue={v.company} error={e.company} />
      </div>
      <Field
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        required
        error={e.password}
        hint="At least 10 characters, with a letter and a number."
      />
      <div>
        <label className="flex items-start gap-3 text-[0.95rem] text-ink-700">
          <input
            type="checkbox"
            name="acceptTerms"
            className="mt-1 size-5 shrink-0 accent-[#0a7c78]"
            aria-invalid={e.acceptTerms ? true : undefined}
            aria-describedby={e.acceptTerms ? "f-acceptTerms-error" : undefined}
          />
          <span>
            I agree to the{" "}
            <Link href="/terms-and-conditions" className={linkClass}>
              terms and conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className={linkClass}>
              privacy policy
            </Link>
            .
          </span>
        </label>
        <FieldError id="f-acceptTerms-error" error={e.acceptTerms} />
      </div>
      <SubmitButton>Create account</SubmitButton>
      <p className="text-center text-[0.95rem] text-text-muted">
        Already have an account?{" "}
        <Link href={`/account/login?next=${encodeURIComponent(next)}`} className={linkClass}>
          Log in
        </Link>
      </p>
    </form>
  );
}

export function LoginForm({ next, notice }: { next: string; notice?: string }) {
  const [state, action] = useActionState(logInAction, undefined);
  const e = state?.errors ?? {};
  return (
    <form action={action} noValidate className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <FormMessage message={state?.message ?? notice} ok={!state?.message && Boolean(notice)} />
      <Field name="email" label="Email address" type="email" autoComplete="email" required defaultValue={state?.values?.email} error={e.email} />
      <Field name="password" label="Password" type="password" autoComplete="current-password" required error={e.password} />
      <div className="text-right text-sm">
        <Link href="/account/forgot-password" className={linkClass}>
          Forgot your password?
        </Link>
      </div>
      <SubmitButton>Log in</SubmitButton>
      <p className="text-center text-[0.95rem] text-text-muted">
        New here?{" "}
        <Link href={`/account/sign-up?next=${encodeURIComponent(next)}`} className={linkClass}>
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useActionState(requestResetAction, undefined);
  if (state?.ok) return <FormMessage ok message={state.message} />;
  return (
    <form action={action} noValidate className="space-y-5">
      <FormMessage message={state?.message} />
      <Field name="email" label="Email address" type="email" autoComplete="email" required defaultValue={state?.values?.email} error={state?.errors?.email} />
      <SubmitButton>Send reset link</SubmitButton>
      <p className="text-center text-[0.95rem]">
        <Link href="/account/login" className={linkClass}>
          Back to log in
        </Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetPasswordAction, undefined);
  const e = state?.errors ?? {};
  return (
    <form action={action} noValidate className="space-y-5">
      <input type="hidden" name="token" value={token} />
      <FormMessage message={state?.message ?? e.token} />
      <Field
        name="newPassword"
        label="New password"
        type="password"
        autoComplete="new-password"
        required
        error={e.newPassword}
        hint="At least 10 characters, with a letter and a number."
      />
      <Field name="confirmPassword" label="Confirm new password" type="password" autoComplete="new-password" required error={e.confirmPassword} />
      <SubmitButton>Save new password</SubmitButton>
    </form>
  );
}
