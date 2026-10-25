"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Plays the `.reveal` entrance as elements scroll into view. Anything already
 * on screen is left exactly as rendered, and nothing is hidden when JavaScript
 * is unavailable or the visitor prefers reduced motion.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pending = [...document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")].filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add("is-visible");
        return false;
      }
      return true;
    });
    document.documentElement.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible", "is-animated");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    pending.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
