export function Badge({
  children,
  tone = "forest",
}: {
  children: React.ReactNode;
  tone?: "forest" | "red" | "outline";
}) {
  const tones = {
    forest: "bg-forest text-paper",
    red: "bg-scout-red text-paper",
    outline: "border border-forest/40 text-forest bg-paper",
  };
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
