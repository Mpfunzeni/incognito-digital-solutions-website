import { publishedServices } from "@/content/services";
import { Hexagon } from "@/components/ui/Hexagon";

const hexColors = ["#1eddd6", "#fe6740", "#ff3873", "#ab78ff"];

/**
 * A continuously scrolling band of service names. Purely decorative (the
 * services are listed properly just below), so it is hidden from assistive tech.
 */
export function ServiceMarquee() {
  const items = publishedServices.map((s) => s.title);
  const row = (copy: number) =>
    items.map((t, i) => (
      <li key={`${copy}-${t}`} className="flex shrink-0 items-center gap-6 pr-6">
        <span className="font-display text-xl font-bold tracking-tight text-white/85 sm:text-2xl">{t}</span>
        <Hexagon className="w-4 shrink-0" color={hexColors[i % hexColors.length]} />
      </li>
    ));
  return (
    <div aria-hidden="true" className="relative overflow-hidden border-y border-white/10 bg-ink-950 py-5">
      <div className="marquee-mask">
        <ul className="marquee-track flex w-max">
          {[0, 1, 2, 3].map(row)}
        </ul>
      </div>
    </div>
  );
}
