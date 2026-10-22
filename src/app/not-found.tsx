import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ContourPattern } from "@/components/ui/ContourPattern";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <section className="on-dark relative overflow-hidden bg-forest text-paper">
      <ContourPattern seed={404} className="text-forest-light opacity-60" />
      <Container className="relative py-24 text-center sm:py-32">
        <p className="heading text-8xl text-paper/80 sm:text-9xl">404</p>
        <h1 className="mt-4 text-4xl sm:text-5xl">Χαθήκαμε στο μονοπάτι!</h1>
        <p className="mx-auto mt-4 max-w-md text-lg">
          Η σελίδα που ψάχνετε δεν υπάρχει. Ας βγάλουμε τον χάρτη και την πυξίδα.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink href={routes.home}>Πίσω στην αρχική</ButtonLink>
          <ButtonLink href={routes.contact} variant="ghost-light">
            Επικοινωνία
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
