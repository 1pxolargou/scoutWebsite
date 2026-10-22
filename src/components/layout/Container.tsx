export function Container({
  children,
  className = "",
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Πλατύτερο πλάτος, για τη μπάρα πλοήγησης */
  wide?: boolean;
}) {
  return (
    <div className={`mx-auto w-full ${wide ? "max-w-7xl" : "max-w-6xl"} px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}
