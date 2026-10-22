import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/dates";
import { categoryLabel, type NewsPost } from "@/lib/facebook";

export function NewsCard({ post }: { post: NewsPost }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border-2 border-forest/15 bg-paper shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-sand">
        {post.images[0] && (
          <Image
            src={post.images[0]}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <time dateTime={post.date.toISOString()} className="text-sm text-ink/75">
            {formatDate(post.date)}
          </time>
          {post.categories.map((c) => (
            <Badge key={c} tone="outline">
              {categoryLabel(c)}
            </Badge>
          ))}
        </div>
        <h3 className="font-sans text-lg leading-snug font-bold tracking-normal text-forest normal-case">
          <Link href={`/nea/${post.id}/`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        {post.text && <p className="mt-2 line-clamp-3 text-sm text-ink/80">{post.text}</p>}
      </div>
    </article>
  );
}
