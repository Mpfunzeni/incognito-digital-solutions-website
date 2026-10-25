"use client";

import { useActionState } from "react";
import { changePasswordAction, updateProfileAction } from "@/app/account/actions";
import { provinces } from "@/lib/hosting/types";
import { Field, FieldError, FormMessage, inputClass, SubmitButton } from "./FormParts";

export type ProfileValues = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  vatNumber: string;
  marketingOptIn: boolean;
};

export function ProfileForm({ initial }: { initial: ProfileValues }) {
  const [state, action] = useActionState(updateProfileAction, undefined);
  const v = { ...initial, ...(state?.values ?? {}) };
  const e = state?.errors ?? {};
  return (
    <form action={action} noValidate className="space-y-5">
      <FormMessage ok={state?.ok} message={state?.message} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="fullName" label="Full name" autoComplete="name" required defaultValue={v.fullName} error={e.fullName} />
        <Field name="email" label="Email address" type="email" defaultValue={v.email} readOnly disabled hint="Contact us to change your login email." />
        <Field name="phone" label="Phone number" type="tel" autoComplete="tel" defaultValue={v.phone} error={e.phone} />
        <Field name="company" label="Business name" autoComplete="organization" defaultValue={v.company} error={e.company} />
      </div>
      <fieldset className="space-y-5 border-t border-line pt-5">
        <legend className="pt-5 text-lg font-bold text-ink-900">Billing address</legend>
        <Field name="addressLine1" label="Street address" autoComplete="address-line1" defaultValue={v.addressLine1} error={e.addressLine1} />
        <Field name="addressLine2" label="Suburb, unit or building (optional)" autoComplete="address-line2" defaultValue={v.addressLine2} error={e.addressLine2} />
        <div className="grid gap-5 sm:grid-cols-3">
          <Field name="city" label="City or town" autoComplete="address-level2" defaultValue={v.city} error={e.city} />
          <div>
            <label htmlFor="f-province" className="mb-1.5 block text-[0.95rem] font-semibold text-ink-900">
              Province
            </label>
            <select
              id="f-province"
              name="province"
              defaultValue={v.province}
              autoComplete="address-level1"
              aria-invalid={e.province ? true : undefined}
              aria-describedby={e.province ? "f-province-error" : undefined}
              className={inputClass(e.province)}
            >
              <option value="">Choose…</option>
              {provinces.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <FieldError id="f-province-error" error={e.province} />
          </div>
          <Field name="postalCode" label="Postal code" inputMode="numeric" autoComplete="postal-code" defaultValue={v.postalCode} error={e.postalCode} />
        </div>
        <Field name="vatNumber" label="VAT number (if registered)" inputMode="numeric" defaultValue={v.vatNumber} error={e.vatNumber} hint="Shown on your invoices." />
      </fieldset>
      <label className="flex items-start gap-3 text-[0.95rem] text-ink-700">
        <input type="checkbox" name="marketingOptIn" defaultChecked={initial.marketingOptIn} className="mt-1 size-5 shrink-0 accent-[#0a7c78]" />
        Send me occasional tips and offers by email. You can unsubscribe at any time.
      </label>
      <SubmitButton className="w-full sm:w-auto">Save profile</SubmitButton>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState(changePasswordAction, undefined);
  const e = state?.errors ?? {};
  return (
    <form action={action} noValidate className="space-y-5">
      <FormMessage ok={state?.ok} message={state?.message} />
      <Field name="currentPassword" label="Current password" type="password" autoComplete="current-password" required error={e.currentPassword} />
      <div className="grid gap-5 sm:grid-cols-2">
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
      </div>
      <SubmitButton variant="dark" className="w-full sm:w-auto">
        Change password
      </SubmitButton>
    </form>
  );
}
