import Link from "next/link";
import type { ComponentProps } from "react";
import { t } from "@/i18n/el";

type Variant = "primary" | "secondary" | "ghost-light";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 font-heading text-lg font-semibold uppercase tracking-wide transition-colors";

const variants: Record<Variant, string> = {
  // Λευκό περίγραμμα ώστε το κόκκινο κουμπί να ξεχωρίζει και πάνω σε πράσινο (WCAG 1.4.11).
  primary: "bg-scout-red text-paper border-2 border-paper/80 hover:bg-scout-red-dark",
  secondary: "bg-forest text-paper border-2 border-forest hover:bg-forest-dark",
  "ghost-light": "border-2 border-paper text-paper hover:bg-paper hover:text-forest",
};

export function buttonClasses(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}

/** Εξωτερικός σύνδεσμος σε νέα καρτέλα, με προσβάσιμη ένδειξη. */
export function ExternalLink({
  href,
  children,
  hint = t.externalLink,
  className,
}: {
  href: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> {hint}</span>
    </a>
  );
}

export function ExternalIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
      <path d="M11 3h6v6h-2V6.41l-6.29 6.3-1.42-1.42L13.59 5H11V3z" />
      <path d="M5 5h4v2H5v8h8v-4h2v6H3V5h2z" />
    </svg>
  );
}
