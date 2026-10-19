import Link from "next/link";
import { site } from "@/content/site";
import { LegalPage } from "@/components/sections/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects personal information, in line with the Protection of Personal Information Act (POPIA).`,
  path: "/privacy-policy",
});

export default function PrivacyPage() {
  const { email, phoneDisplay } = site.contact;
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy-policy"
      updated="19 October 2026"
      intro={`${site.name} respects your privacy. This policy explains what personal information we collect through this website, why we collect it and how we protect it.`}
    >
      <h2>1. Who we are</h2>
      <p>
        {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a South African digital solutions company. We are the
        responsible party for personal information collected through this website, as defined in the Protection of
        Personal Information Act, 2013 (POPIA).
      </p>

      <h2>2. Information we collect</h2>
      <ul>
        <li>
          <strong>Information you give us</strong>: when you complete our quote or contact form we collect your name,
          business name (optional), email address, phone number (optional), the service you are interested in, an
          optional budget range, your preferred contact method and your project description.
        </li>
        <li>
          <strong>Information collected automatically</strong>: our hosting provider records basic technical
          information such as IP address, browser type and pages requested, for security and to keep the website
          running. If you accept analytics cookies, Google Analytics collects information about how you use the
          website.
        </li>
      </ul>

      <h2>3. How we use your information</h2>
      <ul>
        <li>To respond to your enquiry and prepare quotations</li>
        <li>To provide and support services you have engaged us for</li>
        <li>To protect the website against spam, abuse and security threats</li>
        <li>To understand and improve how the website is used, where you have consented to analytics</li>
      </ul>
      <p>We do not sell your personal information. We do not send marketing messages without your consent.</p>

      <h2>4. Legal basis</h2>
      <p>
        We process your information because you have asked us to respond to an enquiry, to take steps towards or
        perform a contract with you, to comply with legal obligations, for our legitimate interest in securing the
        website, or with your consent (for analytics cookies).
      </p>

      <h2>5. Cookies and analytics</h2>
      <p>
        This website only sets analytics cookies if you accept them in the cookie banner. You can change your choice at
        any time using the &ldquo;Cookie settings&rdquo; link in the footer, or by clearing your browser&rsquo;s site
        data. Essential functionality does not rely on cookies.
      </p>

      <h2>6. Sharing your information</h2>
      <p>
        We share personal information only with service providers that help us operate this website and our business,
        such as our hosting, email delivery and analytics providers. These providers are required to protect your
        information and may only use it to provide their services to us. Some providers may store information outside
        South Africa; where this happens we take reasonable steps to ensure an adequate level of protection, as POPIA
        requires.
      </p>

      <h2>7. How long we keep information</h2>
      <p>
        We keep enquiry information for as long as needed to respond to you and manage any resulting business
        relationship, and for as long as required by law. We then delete or de-identify it.
      </p>

      <h2>8. Security</h2>
      <p>
        We use reasonable technical and organisational measures to protect personal information, including encrypted
        connections (HTTPS), access controls and spam protection. No online system is completely secure, so please
        contact us if you believe your information has been compromised.
      </p>

      <h2>9. Your rights</h2>
      <p>Under POPIA you may, among other things:</p>
      <ul>
        <li>Ask whether we hold personal information about you and request access to it</li>
        <li>Ask us to correct or delete inaccurate, outdated or unnecessary information</li>
        <li>Object to the processing of your information in certain circumstances</li>
        <li>Withdraw consent you have given, such as for analytics cookies</li>
        <li>
          Lodge a complaint with the Information Regulator of South Africa (
          <a href="https://inforegulator.org.za/" target="_blank" rel="noopener noreferrer">
            inforegulator.org.za
          </a>
          )
        </li>
      </ul>

      <h2>10. Contact us</h2>
      <p>
        For privacy questions or requests, email <a href={`mailto:${email}`}>{email}</a> or call {phoneDisplay}. You
        can also use our <Link href="/contact">contact page</Link>.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>We may update this policy from time to time. The &ldquo;last updated&rdquo; date above shows the latest version.</p>
    </LegalPage>
  );
}
