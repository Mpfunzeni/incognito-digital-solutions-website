/** Decorative hexagon shape echoing the logo's mark. */
export function Hexagon({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 87" className={className} aria-hidden="true" focusable="false">
      <polygon points="25,0 75,0 100,43.5 75,87 25,87 0,43.5" fill={color} />
    </svg>
  );
}
