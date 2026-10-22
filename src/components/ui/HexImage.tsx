import Image from "next/image";

const HEX = "polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0% 50%)";

/** Φωτογραφία σε εξάγωνο με κόκκινο περίγραμμα, όπως στις αφίσες του Συστήματος. */
export function HexImage({
  src,
  alt,
  className = "",
  sizes = "300px",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`aspect-[1.15] bg-scout-red ${className}`} style={{ clipPath: HEX }}>
      <div className="relative h-full w-full scale-[0.95]" style={{ clipPath: HEX }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    </div>
  );
}
