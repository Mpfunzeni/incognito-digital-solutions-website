"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, Phone, UserRound, X } from "lucide-react";
import { mainNav, site, whatsappUrl } from "@/content/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { publishedServices } from "@/content/services";
import { Icon, accentClasses } from "@/components/ui/Icon";
import { buttonClasses } from "@/components/ui/Button";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const mobileId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus whenever the route changes (adjusting state during render).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setServicesOpen(false);
  }

  // Close the services menu on outside click or Escape.
  useEffect(() => {
    if (!servicesOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        servicesButtonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  // Mobile menu: lock scroll, close on Escape, keep focus inside the panel.
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = mobilePanelRef.current;
    panel?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        mobileButtonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusable = [mobileButtonRef.current, ...panel.querySelectorAll<HTMLElement>("a,button")].filter(
        Boolean,
      ) as HTMLElement[];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-[box-shadow,border-color] duration-300 supports-[backdrop-filter]:bg-white/85 ${
        scrolled || mobileOpen ? "border-line shadow-[0_6px_24px_-12px_rgb(15_31_46/0.25)]" : "border-transparent"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-md bg-ink-900 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-6 px-4 sm:px-6 lg:h-[5.5rem] lg:px-8">
        {/* Logo: always top-left, links to the homepage. */}
        <Link href="/" className="flex shrink-0 items-center rounded-md" aria-label="Incognito Digital Solutions home">
          <Image
            src={site.logo.src}
            alt={site.logo.alt}
            width={site.logo.width}
            height={site.logo.height}
            priority
            sizes="(min-width: 1024px) 72px, 56px"
            className="h-14 w-auto lg:h-[4.5rem]"
          />
        </Link>

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {mainNav.map((item) =>
              item.href === "/services" ? (
                <li key={item.href} ref={servicesRef} className="relative">
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      aria-current={isActive(pathname, item.href) ? "page" : undefined}
                      className={navLinkClass(isActive(pathname, item.href))}
                    >
                      {item.label}
                    </Link>
                    <button
                      ref={servicesButtonRef}
                      type="button"
                      aria-expanded={servicesOpen}
                      aria-controls={menuId}
                      aria-label="Show services menu"
                      onClick={() => setServicesOpen((o) => !o)}
                      className="-ml-2 grid size-8 place-items-center rounded-full text-ink-700 hover:bg-ink-900/5"
                    >
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <div
                    id={menuId}
                    hidden={!servicesOpen}
                    className="absolute left-1/2 top-full w-[44rem] -translate-x-1/2 pt-3"
                  >
                    <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-white p-3 shadow-[var(--shadow-card-hover)]">
                      {publishedServices.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          onClick={() => setServicesOpen(false)}
                          className="group flex gap-3 rounded-xl p-3 hover:bg-surface-muted"
                        >
                          <span
                            className={`grid size-10 shrink-0 place-items-center rounded-lg ${accentClasses[s.accent].bg} ${accentClasses[s.accent].text}`}
                          >
                            <Icon name={s.icon} className="size-5" />
                          </span>
                          <span>
                            <span className="block font-semibold text-ink-900">{s.title}</span>
                            <span className="mt-0.5 line-clamp-2 block text-sm text-text-muted">{s.summary}</span>
                          </span>
                        </Link>
                      ))}
                      <Link
                        href="/services"
                        onClick={() => setServicesOpen(false)}
                        className="col-span-2 mt-1 flex items-center justify-between rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-white hover:bg-ink-700"
                      >
                        View all services
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={navLinkClass(isActive(pathname, item.href))}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <Link
            href="/account"
            aria-label="Client login"
            title="Client login"
            className="grid size-11 place-items-center rounded-full text-ink-800 hover:bg-ink-900/5"
          >
            <UserRound className="size-5" aria-hidden="true" />
          </Link>
          <Link
            href="/get-a-quote"
            data-track="cta_get_quote_header"
            className={buttonClasses("primary", "sm", "sm:h-11 sm:px-5 sm:text-[0.95rem]")}
          >
            Get a Quote
          </Link>
          <button
            ref={mobileButtonRef}
            type="button"
            className="grid size-11 place-items-center rounded-full text-ink-900 hover:bg-ink-900/5 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls={mobileId}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id={mobileId}
        ref={mobilePanelRef}
        hidden={!mobileOpen}
        className="absolute inset-x-0 top-full h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-line bg-white lg:hidden"
      >
        <nav aria-label="Mobile" className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6">
          <ul className="space-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-semibold ${
                    isActive(pathname, item.href) ? "bg-brand-teal/15 text-ink-900" : "text-ink-800 hover:bg-surface-muted"
                  }`}
                >
                  {item.label}
                </Link>
                {item.href === "/services" && (
                  <ul className="mb-2 ml-4 border-l border-line pl-3">
                    {publishedServices.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}`}
                          onClick={() => setMobileOpen(false)}
                          aria-current={pathname === `/services/${s.slug}` ? "page" : undefined}
                          className="block rounded-lg px-3 py-2.5 text-[0.95rem] text-text-muted hover:bg-surface-muted hover:text-ink-900 aria-[current=page]:font-semibold aria-[current=page]:text-ink-900"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-3">
            <Link
              href="/get-a-quote"
              onClick={() => setMobileOpen(false)}
              data-track="cta_get_quote_mobile_menu"
              className={buttonClasses("primary", "lg", "w-full")}
            >
              Get a Quote
            </Link>
            <Link href="/account" onClick={() => setMobileOpen(false)} className={buttonClasses("dark", "lg", "w-full")}>
              <UserRound className="size-4" aria-hidden="true" /> Client login
            </Link>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("secondary", "lg", "w-full bg-[#25D366] text-ink-900 hover:bg-[#3ee07c]")}
            >
              <WhatsAppIcon className="size-4" /> WhatsApp {site.contact.whatsappDisplay}
            </a>
            <a href={`tel:${site.contact.phoneE164}`} className={buttonClasses("secondary", "lg", "w-full")}>
              <Phone className="size-4" aria-hidden="true" /> Call {site.contact.phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function navLinkClass(active: boolean) {
  return `relative whitespace-nowrap rounded-full px-2.5 py-2 text-[0.92rem] font-medium transition-colors xl:px-3.5 xl:text-[0.95rem] ${
    active ? "text-ink-900 after:absolute after:inset-x-2.5 xl:after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand-teal" : "text-ink-700 hover:text-ink-900 hover:bg-ink-900/5"
  }`;
}
