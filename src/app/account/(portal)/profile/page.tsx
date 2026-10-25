import { PageTitle, Panel } from "@/components/account/Bits";
import { PasswordForm, ProfileForm } from "@/components/account/ProfileForms";
import { requireCustomer } from "@/lib/hosting/session";

export default async function ProfilePage() {
  const c = await requireCustomer("/account/profile");
  return (
    <>
      <PageTitle title="Profile" intro="Your contact and billing details appear on your invoices." />
      <Panel title="Your details">
        <ProfileForm
          initial={{
            fullName: c.full_name,
            email: c.email,
            phone: c.phone,
            company: c.company,
            addressLine1: c.address_line1,
            addressLine2: c.address_line2,
            city: c.city,
            province: c.province,
            postalCode: c.postal_code,
            vatNumber: c.vat_number,
            marketingOptIn: c.marketing_opt_in,
          }}
        />
      </Panel>
      <Panel title="Change password" className="mt-6">
        <PasswordForm />
      </Panel>
    </>
  );
}
