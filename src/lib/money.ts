/**
 * Formats rand amounts the same way on the server and in every browser,
 * e.g. "R 1 500" or "R 249.00". Intl's en-ZA output differs between Node
 * ("R 1 500") and Chromium ("R 1,500"), which breaks React hydration.
 */
export function formatZar(amount: number, fractionDigits = 0) {
  const [whole, cents] = Math.abs(amount).toFixed(fractionDigits).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${amount < 0 ? "-" : ""}R ${grouped}${cents ? `.${cents}` : ""}`;
}
