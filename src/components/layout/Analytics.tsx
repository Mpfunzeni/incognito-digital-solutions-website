"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { CONSENT_EVENT, readConsent } from "./ConsentBanner";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Loads Google Analytics 4 only when an ID is configured and the visitor has
 * accepted analytics cookies. Also tracks CTA clicks (elements with
 * data-track) and phone / email / WhatsApp link clicks.
 */
export function Analytics() {
  const [enabled, setEnabled] = useState(false);
  const pathname = usePathname();
  const initialPath = useRef<string | null>(null);

  useEffect(() => {
    if (!GA_ID) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(readConsent() === "granted");
    const onChange = (e: Event) => setEnabled((e as CustomEvent).detail === "granted");
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  // The gtag config call records the first page view; later client-side
  // navigations are recorded here.
  useEffect(() => {
    if (!enabled) return;
    if (initialPath.current === null) {
      initialPath.current = pathname;
      return;
    }
    trackEvent("page_view", { page_path: pathname, page_location: window.location.href, page_title: document.title });
  }, [enabled, pathname]);

  useEffect(() => {
    if (!enabled) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("a,button");
      if (!el) return;
      const track = el.dataset.track;
      if (track) trackEvent("cta_click", { cta_id: track, page_path: window.location.pathname });
      const href = el.getAttribute("href") || "";
      if (href.startsWith("tel:")) trackEvent("phone_click", { page_path: window.location.pathname });
      else if (href.startsWith("mailto:")) trackEvent("email_click", { page_path: window.location.pathname });
      else if (href.includes("wa.me/")) trackEvent("whatsapp_click", { page_path: window.location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [enabled]);

  if (!GA_ID || !enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
