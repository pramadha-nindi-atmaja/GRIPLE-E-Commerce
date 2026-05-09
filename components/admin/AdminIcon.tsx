type AdminIconProps = {
  name: string;
  className?: string;
  /** Matches active nav in Stitch mockups (filled icon). */
  filled?: boolean;
};

export function AdminIcon({ name, className = "", filled = false }: AdminIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`.trim()}
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
      aria-hidden
    >
      {name}
    </span>
  );
}
