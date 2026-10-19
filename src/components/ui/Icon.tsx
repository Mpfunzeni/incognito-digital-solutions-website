import {
  Gauge,
  Layers,
  LifeBuoy,
  Monitor,
  Palette,
  Search,
  Server,
  ShoppingCart,
  Smartphone,
  Target,
  Wallet,
  Wrench,
  type LucideProps,
} from "lucide-react";

const icons = {
  monitor: Monitor,
  search: Search,
  server: Server,
  cart: ShoppingCart,
  palette: Palette,
  wrench: Wrench,
  wallet: Wallet,
  target: Target,
  smartphone: Smartphone,
  gauge: Gauge,
  layers: Layers,
  lifebuoy: LifeBuoy,
};

export type IconName = keyof typeof icons;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = icons[name];
  return <Cmp aria-hidden="true" {...props} />;
}

export const accentClasses = {
  teal: { bg: "bg-brand-teal/15", text: "text-[#0a7c78]", ring: "ring-brand-teal/30", solid: "bg-brand-teal" },
  orange: { bg: "bg-brand-orange/15", text: "text-[#c2410c]", ring: "ring-brand-orange/30", solid: "bg-brand-orange" },
  pink: { bg: "bg-brand-pink/15", text: "text-[#be123c]", ring: "ring-brand-pink/30", solid: "bg-brand-pink" },
  purple: { bg: "bg-brand-purple/15", text: "text-[#6d28d9]", ring: "ring-brand-purple/30", solid: "bg-brand-purple" },
} as const;
