import { Hexagon } from "@/components/ui/Hexagon";

/**
 * Decorative hero illustration: a stylised website, growth chart and service
 * tiles built in HTML/CSS (no image download, no layout shift). It contains no
 * real performance figures.
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl select-none" aria-hidden="true">
      <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(30_221_214/0.35),transparent)] blur-2xl" />
      <Hexagon className="float absolute -right-2 -top-8 w-24 drop-shadow-[0_0_24px_rgb(30_221_214/0.6)]" color="#1eddd6" />
      <Hexagon className="float absolute right-20 top-6 w-14 drop-shadow-[0_0_20px_rgb(254_103_64/0.6)] [animation-delay:-2s]" color="#fe6740" />
      <Hexagon className="float absolute -left-6 bottom-24 w-12 drop-shadow-[0_0_20px_rgb(255_56_115/0.6)] [animation-delay:-4s]" color="#ff3873" />
      <Hexagon className="float absolute -bottom-6 left-24 w-16 drop-shadow-[0_0_20px_rgb(171_120_255/0.6)] [animation-delay:-5.5s]" color="#ab78ff" />

      {/* Browser window */}
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-ink-800/80 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7),0_0_60px_-20px_rgb(30_221_214/0.5)] backdrop-blur lg:[transform:perspective(1200px)_rotateY(-8deg)_rotateX(4deg)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-brand-pink" />
          <span className="size-2.5 rounded-full bg-brand-orange" />
          <span className="size-2.5 rounded-full bg-brand-teal" />
          <span className="ml-3 h-6 flex-1 rounded-full bg-white/10" />
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            <div className="h-3 w-24 rounded-full bg-brand-teal/70" />
            <div className="h-5 w-full rounded-full bg-white/80" />
            <div className="h-5 w-4/5 rounded-full bg-white/80" />
            <div className="h-2.5 w-full rounded-full bg-white/20" />
            <div className="h-2.5 w-11/12 rounded-full bg-white/20" />
            <div className="flex gap-2 pt-2">
              <div className="h-8 w-24 rounded-full bg-brand-teal" />
              <div className="h-8 w-20 rounded-full border border-white/30" />
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="h-2.5 w-16 rounded-full bg-white/40" />
            <div className="mt-4 flex h-24 items-end gap-2">
              {[35, 50, 45, 65, 80, 95].map((h, i) => (
                <div
                  key={i}
                  className="grow-up flex-1 rounded-t-md bg-gradient-to-t from-brand-teal/40 to-brand-teal"
                  style={{ height: `${h}%`, animationDelay: `${400 + i * 120}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 px-5 pb-5">
          {["bg-brand-orange", "bg-brand-pink", "bg-brand-purple"].map((c) => (
            <div key={c} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className={`h-6 w-6 rounded-md ${c}`} />
              <div className="mt-3 h-2 w-3/4 rounded-full bg-white/40" />
              <div className="mt-2 h-2 w-1/2 rounded-full bg-white/20" />
            </div>
          ))}
        </div>
      </div>

      {/* Floating cards */}
      <div className="bob absolute -bottom-8 -right-3 hidden w-48 rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-card-hover)] sm:block">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">New enquiry</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-brand-teal/20">
            <span className="pulse-dot size-3 rounded-full bg-brand-teal-dark" />
          </span>
          <div className="flex-1 space-y-1.5">
            <div className="h-2 rounded-full bg-ink-900/70" />
            <div className="h-2 w-2/3 rounded-full bg-ink-900/25" />
          </div>
        </div>
      </div>
      <div className="bob absolute -left-5 top-1/3 hidden rounded-2xl border border-line bg-white px-4 py-3 shadow-[var(--shadow-card-hover)] [animation-delay:-2.5s] sm:block">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Mobile ready</p>
        <div className="mt-2 flex gap-1.5">
          <span className="h-7 w-4 rounded-[4px] border-2 border-ink-800" />
          <span className="h-7 w-6 rounded-[4px] border-2 border-ink-800" />
          <span className="h-7 w-9 rounded-[4px] border-2 border-ink-800" />
        </div>
      </div>
    </div>
  );
}
