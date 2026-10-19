"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONSENT_KEY } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const CONSENT_EVENT = "ids-consent-change";
const OPEN_EVENT = "ids-consent-open";

export type Consent = "granted" | "denied" | null;

export function readConsent(): Consent {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function saveConsent(value: "granted" | "denied") {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage unavailable: the choice applies to this page view only */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/**
 * Cookie consent for analytics (POPIA-conscious). Only shown when GA4 is
 * configured; without an analytics ID the site sets no analytics cookies.
 */
export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    // Reading localStorage must happen after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (readConsent() === null) setOpen(true);
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  if (!GA_ID || !open) return null;

  const choose = (value: "granted" | "denied") => {
    saveConsent(value);
    setOpen(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-2xl rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card-hover)] sm:inset-x-6 sm:bottom-6"
    >
      <p className="text-sm leading-relaxed text-text-muted">
        We would like to use analytics cookies to understand how visitors use this website so we can improve it. These
        are only set if you accept. Read our{" "}
        <Link href="/privacy-policy" className="font-semibold text-brand-teal-dark underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="h-10 rounded-full bg-ink-900 px-5 text-sm font-semibold text-white hover:bg-ink-700"
        >
          Accept analytics
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="h-10 rounded-full border border-line px-5 text-sm font-semibold text-ink-900 hover:bg-surface-muted"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

export function ConsentSettingsButton() {
  if (!GA_ID) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className="hover:text-ink-900"
    >
      Cookie settings
    </button>
  );
}
