/** Σχήμα θυρεού με κόκκινο περίγραμμα, όπως στο λογότυπο. Το περιεχόμενο μπαίνει στο κέντρο. */
export function Shield({
  children,
  className = "",
  tone = "forest",
}: {
  children?: React.ReactNode;
  className?: string;
  tone?: "forest" | "paper";
}) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 116"
        className="absolute inset-0 h-full w-full drop-shadow-sm"
        preserveAspectRatio="none"
      >
        <path
          d="M5 5 H95 V66 Q95 90 50 111 Q5 90 5 66 Z"
          className={tone === "forest" ? "fill-forest" : "fill-paper"}
          stroke="var(--color-scout-red)"
          strokeWidth="5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div
        className={`relative pb-[18%] text-center ${tone === "forest" ? "text-paper" : "text-forest"}`}
      >
        {children}
      </div>
    </div>
  );
}
