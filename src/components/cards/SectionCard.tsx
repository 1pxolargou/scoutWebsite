import Image from "next/image";
import Link from "next/link";
import type { SectionInfo } from "@site-config";
import { Shield } from "@/components/ui/Shield";
import { routes } from "@/lib/routes";

export function SectionCard({ section, image }: { section: SectionInfo; image: string }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border-2 border-forest/15 bg-paper shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
      </div>
      <Shield className="absolute top-4 right-4 h-24 w-20">
        <span className="heading block text-[0.95rem] leading-tight">
          {section.ageRange.replace(" ετών", "")}
          <span className="block text-xs">ετών</span>
        </span>
      </Shield>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl text-forest">
          <Link href={routes.section(section.slug)} className="after:absolute after:inset-0">
            {section.name}
          </Link>
        </h3>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="font-semibold">Τάξεις:</dt>
            <dd>{section.grades}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold">Συγκέντρωση:</dt>
            <dd>{section.meeting}</dd>
          </div>
        </dl>
        <span className="heading mt-auto pt-5 text-forest underline decoration-scout-red decoration-2 underline-offset-8">
          Μάθε περισσότερα →
        </span>
      </div>
    </article>
  );
}
