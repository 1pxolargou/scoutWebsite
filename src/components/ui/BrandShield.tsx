import Image from "next/image";

/**
 * Ο θυρεός από το logo.jpg, κομμένος στο σχήμα του ώστε να μη φαίνεται
 * το τετράγωνο φόντο του αρχείου πάνω στις ισοϋψείς.
 */
const SHIELD_CLIP =
  "polygon(15% 16.5%, 50% 10.5%, 85% 16.5%, 85% 59%, 81% 69%, 71% 79%, 50% 91%, 29% 79%, 19% 69%, 15% 59%)";

export function BrandShield({
  size,
  className = "",
  alt = "",
  priority = false,
}: {
  size: number;
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/logo.jpg"
        alt={alt}
        fill
        sizes={`${size}px`}
        priority={priority}
        style={{ clipPath: SHIELD_CLIP }}
      />
    </span>
  );
}
