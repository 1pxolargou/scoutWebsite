import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { Album } from "@/lib/content/load";
import { athensDate, formatDate } from "@/lib/dates";

export function AlbumCard({ album }: { album: Album }) {
  return (
    <article className="group relative overflow-hidden rounded-card border-2 border-forest/15 bg-forest shadow-sm">
      <div className="relative aspect-[4/3]">
        <Image
          src={album.cover}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100 motion-reduce:transition-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/40 to-transparent" />
      </div>
      <div className="on-dark absolute inset-x-0 bottom-0 p-5 text-paper">
        <div className="mb-2 flex items-center gap-2">
          <Badge tone="red">{album.activity}</Badge>
          <span className="text-sm">{album.photos.length} φωτογραφίες</span>
        </div>
        <h3 className="text-2xl">
          <Link href={`/fotografies/${album.slug}/`} className="after:absolute after:inset-0">
            {album.title}
          </Link>
        </h3>
        <p className="text-sm text-paper/85">{formatDate(athensDate(album.date))}</p>
      </div>
    </article>
  );
}
