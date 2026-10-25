import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Hexagon } from "@/components/ui/Hexagon";

type Props = {
  title?: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  id?: string;
};

export function CtaBanner({
  title = "Ready to Build Your Digital Future?",
  description = "Let's create a digital solution that works for your business.",
  primary = { label: "Get a Quote", href: "/get-a-quote" },
  secondary = { label: "Contact Us", href: "/contact" },
  id = "final-cta",
}: Props) {
  return (
    <section aria-labelledby={id} className="py-20 sm:py-24">
      <Container>
        <div className="on-dark grain reveal relative isolate overflow-hidden rounded-[2rem] bg-ink-900 px-6 py-16 text-center shadow-[0_40px_80px_-40px_rgb(11_22_34/0.8)] sm:px-12 sm:py-20">
          <div className="halo opacity-70" aria-hidden="true" />
          <div
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_85%_10%,rgb(30_221_214/0.28),transparent_60%),radial-gradient(50%_70%_at_10%_100%,rgb(171_120_255/0.25),transparent_60%)]"
            aria-hidden="true"
          />
          <Hexagon className="float absolute -right-6 top-8 -z-10 w-28 opacity-80" color="#1eddd6" />
          <Hexagon className="float absolute right-24 top-28 -z-10 hidden w-14 opacity-80 [animation-delay:-3s] sm:block" color="#fe6740" />
          <Hexagon className="float absolute -left-4 bottom-10 -z-10 w-16 opacity-70 [animation-delay:-5s]" color="#ff3873" />
          <h2 id={id} className="mx-auto max-w-2xl text-3xl font-bold text-white sm:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">{description}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={primary.href} size="lg" track="cta_get_quote_banner">
              {primary.label} <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={secondary.href} size="lg" variant="outline-light" track="cta_contact_banner">
              {secondary.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
