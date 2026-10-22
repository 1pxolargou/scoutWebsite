import { Container } from "@/components/layout/Container";
import { ContourPattern } from "./ContourPattern";

/** Πράσινη κεφαλίδα σελίδας με ισοϋψείς. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
  seed = 3,
}: {
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
  children?: React.ReactNode;
  seed?: number;
}) {
  return (
    <section className="on-dark relative overflow-hidden border-b-4 border-scout-red bg-forest text-paper">
      <ContourPattern seed={seed} className="text-forest-light opacity-60" />
      <Container className="relative py-14 sm:py-20">
        {eyebrow && <p className="heading mb-3 text-lg tracking-widest text-paper/85">{eyebrow}</p>}
        <h1 className="max-w-3xl text-4xl sm:text-6xl">{title}</h1>
        {intro && <div className="mt-5 max-w-2xl text-lg text-paper/90">{intro}</div>}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
