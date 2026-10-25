import type { CSSProperties } from "react";

/** Staggers a `.reveal` element: higher numbers finish revealing slightly later in the scroll. */
export function revealDelay(step = 0): CSSProperties {
  return { "--reveal-delay": step } as CSSProperties;
}
