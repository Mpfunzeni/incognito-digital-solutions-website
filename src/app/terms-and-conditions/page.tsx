import Link from "next/link";
import { site } from "@/content/site";
import { LegalPage } from "@/components/sections/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms and Conditions",
  description: `The terms and conditions that apply to using the ${site.name} website and requesting quotations.`,
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      path="/terms-and-conditions"
      updated="19 October 2026"
      intro={`These terms apply to your use of the ${site.name} website. Services we provide are governed by the quotation and agreement issued for each project.`}
    >
      <h2>1. About these terms</h2>
      <p>
        By using this website you agree to these terms. If you do not agree, please do not use the website. These terms
        are governed by the laws of the Republic of South Africa.
      </p>

      <h2>2. Information on this website</h2>
      <p>
        We aim to keep the information on this website accurate and up to date, but it is provided for general
        information only. Service descriptions and package inclusions are indicative. The specific scope, deliverables,
        timelines and fees for any project are set out in a written quotation or agreement.
      </p>

      <h2>3. Quotations</h2>
      <p>
        Submitting a quote request does not create a contract. Quotations are valid for the period stated on them and
        are based on the information you provide. Changes to scope may change the price and timeline. Work begins once
        a quotation has been accepted and any agreed deposit has been received.
      </p>

      <h2>4. Third-party services and fees</h2>
      <p>
        Some services rely on third parties, such as domain registries, hosting providers, e-commerce platforms and
        payment gateways. Their fees, terms and service levels apply in addition to ours, and we are not responsible for
        their availability or changes to their pricing.
      </p>

      <h2>5. Search engine results</h2>
      <p>
        Search engines decide how websites rank. We do not guarantee any particular ranking, traffic level or business
        result from SEO or other marketing services.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        The content, design and branding of this website, including the {site.name} logo, belong to {site.name} or its
        licensors. You may not copy or reuse them without permission. Ownership of work created for clients is set out
        in each project agreement.
      </p>

      <h2>7. Acceptable use</h2>
      <p>
        You must not misuse this website, including by attempting unauthorised access, introducing malicious code,
        submitting false information or sending spam through our forms.
      </p>

      <h2>8. Links to other websites</h2>
      <p>Links to third-party websites are provided for convenience. We are not responsible for their content.</p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the extent permitted by law, {site.name} is not liable for any loss arising from your use of this website or
        reliance on its general information. Nothing in these terms limits rights you have under the Consumer
        Protection Act, 2008, where it applies.
      </p>

      <h2>10. Privacy</h2>
      <p>
        Our <Link href="/privacy-policy">Privacy Policy</Link> explains how we handle personal information.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms can be sent to{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>
    </LegalPage>
  );
}
