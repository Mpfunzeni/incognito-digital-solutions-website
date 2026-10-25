import { revealDelay } from "@/lib/motion";

type Step = { title: string; description: string };

const colors = ["bg-brand-teal", "bg-brand-orange", "bg-brand-pink", "bg-brand-purple", "bg-brand-teal"];

export function ProcessSteps({ steps, tone = "dark" }: { steps: readonly Step[]; tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <ol
      className={`grid gap-5 sm:grid-cols-2 ${steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5"}`}
    >
      {steps.map((step, i) => (
        <li
          key={step.title}
          style={revealDelay(i)}
          className={`glow-card lift reveal relative rounded-[var(--radius-card)] p-6 ${
            dark
              ? "border border-white/10 bg-white/[0.04] backdrop-blur-sm"
              : "border border-line bg-white shadow-[var(--shadow-card)]"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`grid size-10 place-items-center rounded-xl font-display text-lg font-bold text-ink-900 ${colors[i % colors.length]}`}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            {i < steps.length - 1 && (
              <span
                className={`hidden h-px flex-1 bg-gradient-to-r lg:block ${dark ? "from-white/40 to-white/0" : "from-line to-transparent"}`}
                aria-hidden="true"
              />
            )}
          </div>
          <h3 className={`mt-5 text-lg font-bold ${dark ? "text-white" : "text-ink-900"}`}>
            <span className="sr-only">Step {i + 1}: </span>
            {step.title}
          </h3>
          <p className={`mt-2 leading-relaxed ${dark ? "text-slate-300" : "text-text-muted"}`}>{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
