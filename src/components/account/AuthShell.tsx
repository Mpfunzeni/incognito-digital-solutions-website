import type { ReactNode } from "react";
import Link from "next/link";
import { Server, ShieldCheck, Zap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Aurora } from "@/components/ui/Aurora";

/** Two-column layout for log in, sign up and password pages. */
export function AuthShell({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-surface-muted py-12 sm:py-16">
      <Container className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="on-dark grain relative isolate hidden overflow-hidden rounded-[var(--radius-card)] bg-ink-900 p-10 text-slate-300 lg:block">
          <Aurora />
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-teal">Client area</p>
          <p className="mt-4 font-display text-3xl font-bold leading-tight text-white">
            Your hosting, domains and invoices in one place.
          </p>
          <ul className="mt-8 space-y-5">
            {[
              { icon: Server, text: "See every hosting service and its renewal date" },
              { icon: Zap, text: "Pay invoices online by card or Instant EFT" },
              { icon: ShieldCheck, text: "Open cPanel in one click, no extra password" },
            ].map(({ icon: I, text }) => (
              <li key={text} className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/10 text-brand-teal">
                  <I className="size-5" aria-hidden="true" />
                </span>
                <span className="pt-2">{text}</span>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm">
            Looking for hosting?{" "}
            <Link href="/hosting" className="font-semibold text-brand-teal underline underline-offset-2">
              Compare plans
            </Link>
          </p>
        </div>
        <div className="mx-auto w-full max-w-xl rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] sm:p-10">
          <h1 className="text-3xl font-bold text-ink-900">{title}</h1>
          <div className="mt-2 text-text-muted">{intro}</div>
          <div className="mt-8">{children}</div>
        </div>
      </Container>
    </section>
  );
}
