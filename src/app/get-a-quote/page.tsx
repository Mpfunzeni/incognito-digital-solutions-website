import { Clock, Mail, MessageSquareText, Phone } from "lucide-react";
import { site, whatsappUrl } from "@/content/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Get a Quote",
  description:
    "Request a quotation for website design, SEO, e-commerce, hosting, branding or maintenance from Incognito Digital Solutions. Tell us about your project.",
  path: "/get-a-quote",
});

const next = [
  { icon: MessageSquareText, title: "We review your request", description: "We read your project details and note any questions." },
  { icon: Phone, title: "We get in touch", description: "We contact you using your preferred method to discuss your needs." },
  { icon: Clock, title: "You receive a quotation", description: "A clear quotation listing once-off and recurring costs." },
];

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Get a quote"
        title="Tell us about your project"
        intro="Share a few details and we will prepare a tailored quotation. There is no obligation."
        crumbs={[{ name: "Get a Quote", path: "/get-a-quote" }]}
      />
      <section aria-label="Quote request" className="bg-surface-muted py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] sm:p-10">
            <QuoteForm source="quote" />
          </div>
          <aside className="space-y-6">
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-6">
              <h2 className="font-sans text-lg font-bold tracking-normal text-ink-900">What happens next</h2>
              <ol className="mt-5 space-y-5">
                {next.map((n, i) => (
                  <li key={n.title} className="flex gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink-900 text-brand-teal">
                      <n.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-semibold text-ink-900">
                        <span className="sr-only">Step {i + 1}: </span>
                        {n.title}
                      </span>
                      <span className="mt-0.5 block text-[0.95rem] text-text-muted">{n.description}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="on-dark rounded-[var(--radius-card)] bg-ink-900 p-6 text-slate-300">
              <h2 className="font-sans text-lg font-bold tracking-normal text-white">Prefer to talk?</h2>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href={`tel:${site.contact.phoneE164}`} className="flex items-center gap-3 hover:text-white">
                    <Phone className="size-4 text-brand-teal" aria-hidden="true" /> {site.contact.phoneDisplay} (calls)
                  </a>
                </li>
                <li>
                  <a href={whatsappUrl("Hi, I'd like a quote for ")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white">
                    <WhatsAppIcon className="size-4 text-[#25D366]" /> WhatsApp {site.contact.whatsappDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.contact.email}`} className="flex items-center gap-3 break-all hover:text-white">
                    <Mail className="size-4 shrink-0 text-brand-teal" aria-hidden="true" /> {site.contact.email}
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
