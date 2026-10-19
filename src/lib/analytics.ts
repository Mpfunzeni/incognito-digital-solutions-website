/**
 * Minimal analytics helper. Events are only sent when GA4 is configured
 * (NEXT_PUBLIC_GA_MEASUREMENT_ID) and the visitor has accepted analytics
 * cookies; otherwise calls are no-ops.
 */

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: string, params: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export const CONSENT_KEY = "ids-analytics-consent";
