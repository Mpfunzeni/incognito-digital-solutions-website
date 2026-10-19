import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Us",
  description: `Contact ${site.name} by phone on ${site.contact.phoneDisplay}, by email at ${site.contact.email}, or send us a message about your project.`,
  path: "/contact",
});

export default function ContactPage() {
  const methods = [
    {
      icon: Phone,
      label: "Call us",
      value: site.contact.phoneDisplay,
      href: `tel:${site.contact.phoneE164}`,
    },
    {
      icon: Mail,
      label: "Email us",
      value: site.contact.email,
      href: `mailto:${site.contact.email}`,
    },
    ...(site.contact.whatsapp
      ? [
          {
            icon: MessageCircle,
            label: "WhatsApp us",
            value: "Chat on WhatsApp",
            href: `https://wa.me/${site.contact.whatsapp}`,
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your business"
        intro="Call, email or send us a message. Tell us what you need and we will help you find the right digital solution."
        crumbs={[{ name: "Contact", path: "/contact" }]}
      />
      <section aria-label="Contact options" className="bg-surface-muted py-16 sm:py-20">
        <Container>
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {methods.map((m) => (
              <li key={m.label}>
                <a
                  href={m.href}
                  {...(m.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full items-center gap-4 rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink-900 text-brand-teal">
                    <m.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-text-muted">{m.label}</span>
                    <span className="block break-words font-semibold text-ink-900 group-hover:underline">{m.value}</span>
                  </span>
                </a>
              </li>
            ))}
            <li className="flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-white p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink-900 text-brand-teal">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-medium text-text-muted">Service area</span>
                <span className="block font-semibold text-ink-900">Businesses across South Africa</span>
              </span>
            </li>
          </ul>

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1.4fr]">
            <div>
              <h2 className="text-3xl font-bold text-ink-900">Send us a message</h2>
              <p className="mt-4 text-lg leading-relaxed text-text-muted">
                Use the form to ask a question or describe your project. We will respond using your preferred contact
                method.
              </p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] sm:p-10">
              <QuoteForm source="contact" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
