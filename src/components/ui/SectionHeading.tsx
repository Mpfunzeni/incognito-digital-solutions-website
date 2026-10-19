import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  id?: string;
};

export function SectionHeading({ eyebrow, title, description, align = "left", tone = "light", as: Tag = "h2", id }: Props) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl`}>
      {eyebrow && (
        <p
          className={`mb-3 text-sm font-semibold uppercase tracking-[0.16em] ${
            tone === "dark" ? "text-brand-teal" : "text-brand-teal-dark"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={`text-3xl font-bold leading-tight sm:text-4xl ${tone === "dark" ? "text-white" : "text-ink-900"}`}
      >
        {title}
      </Tag>
      {description && (
        <p className={`mt-4 text-lg leading-relaxed ${tone === "dark" ? "text-slate-300" : "text-text-muted"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
