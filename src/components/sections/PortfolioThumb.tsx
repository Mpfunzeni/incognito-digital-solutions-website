import type { PortfolioItem } from "@/content/portfolio";

/** Generated thumbnail for portfolio entries (no stock or client imagery). */
export function PortfolioThumb({ item }: { item: PortfolioItem }) {
  const { from, to, accent, layout } = item.theme;
  const id = `g-${item.slug}`;
  return (
    <svg viewBox="0 0 640 400" className="h-full w-full" role="img" aria-label={`${item.title} illustration`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill={`url(#${id})`} />
      <circle cx="560" cy="40" r="180" fill={accent} opacity="0.18" />
      <g transform="translate(60 50)">
        <rect width="520" height="320" rx="16" fill="#ffffff" opacity="0.07" stroke="#ffffff" strokeOpacity="0.2" />
        <circle cx="22" cy="20" r="5" fill="#ff3873" />
        <circle cx="40" cy="20" r="5" fill="#fe6740" />
        <circle cx="58" cy="20" r="5" fill="#1eddd6" />
        {layout === "site" && (
          <g>
            <rect x="30" y="60" width="240" height="18" rx="9" fill="#fff" opacity="0.85" />
            <rect x="30" y="88" width="190" height="18" rx="9" fill="#fff" opacity="0.85" />
            <rect x="30" y="122" width="220" height="9" rx="4.5" fill="#fff" opacity="0.3" />
            <rect x="30" y="140" width="200" height="9" rx="4.5" fill="#fff" opacity="0.3" />
            <rect x="30" y="168" width="110" height="32" rx="16" fill={accent} />
            <rect x="310" y="60" width="180" height="140" rx="14" fill={accent} opacity="0.35" />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={30 + i * 158} y="225" width="142" height="70" rx="12" fill="#fff" opacity="0.1" />
            ))}
          </g>
        )}
        {layout === "store" && (
          <g>
            {[0, 1, 2, 3].map((i) => (
              <g key={i} transform={`translate(${30 + i * 118} 60)`}>
                <rect width="104" height="120" rx="12" fill="#fff" opacity="0.12" />
                <rect x="16" y="16" width="72" height="62" rx="10" fill={accent} opacity={0.4 + i * 0.12} />
                <rect x="16" y="88" width="60" height="8" rx="4" fill="#fff" opacity="0.6" />
                <rect x="16" y="102" width="36" height="8" rx="4" fill={accent} />
              </g>
            ))}
            <rect x="30" y="205" width="460" height="1" fill="#fff" opacity="0.2" />
            <rect x="30" y="230" width="200" height="12" rx="6" fill="#fff" opacity="0.5" />
            <rect x="350" y="222" width="140" height="40" rx="20" fill={accent} />
          </g>
        )}
        {layout === "brand" && (
          <g>
            <polygon points="140,70 190,70 215,113 190,156 140,156 115,113" fill={accent} />
            <polygon points="215,140 245,140 260,166 245,192 215,192 200,166" fill="#fff" opacity="0.7" />
            <rect x="90" y="215" width="190" height="16" rx="8" fill="#fff" opacity="0.85" />
            <rect x="120" y="242" width="130" height="8" rx="4" fill="#fff" opacity="0.4" />
            {[accent, "#ffffff", "#0b1622", "#f4f7fa"].map((c, i) => (
              <rect key={i} x={330 + (i % 2) * 80} y={70 + Math.floor(i / 2) * 80} width="66" height="66" rx="12" fill={c} opacity={c === "#ffffff" ? 0.8 : 1} />
            ))}
            <rect x="330" y="240" width="146" height="10" rx="5" fill="#fff" opacity="0.4" />
          </g>
        )}
        {layout === "chart" && (
          <g>
            <rect x="30" y="56" width="300" height="34" rx="17" fill="#fff" opacity="0.9" />
            <circle cx="52" cy="73" r="8" fill="none" stroke="#0b1622" strokeWidth="3" />
            {[60, 90, 120, 160, 200, 230].map((h, i) => (
              <rect key={i} x={40 + i * 70} y={290 - h} width="44" height={h} rx="8" fill={accent} opacity={0.45 + i * 0.1} />
            ))}
            <polyline points="62,220 132,195 202,170 272,140 342,105 412,80" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </g>
    </svg>
  );
}
