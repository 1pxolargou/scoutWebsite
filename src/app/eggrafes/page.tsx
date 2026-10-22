import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@site-config";
import { LoadOnClick } from "@/components/interactive/LoadOnClick";
import { Container } from "@/components/layout/Container";
import { EnrollButton } from "@/components/ui/EnrollButton";
import { Faq } from "@/components/ui/Faq";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Shield } from "@/components/ui/Shield";
import { getFaq } from "@/lib/content/load";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Εγγραφές",
  description:
    "Πώς γράφεται ένα παιδί στους Προσκόπους Χολαργού: τμήματα, ηλικίες, κόστος, στολή και αίτηση εκδήλωσης ενδιαφέροντος.",
};

const steps = [
  {
    title: "Συμπληρώστε την αίτηση",
    text: "Η αίτηση εκδήλωσης ενδιαφέροντος γίνεται μέσω φόρμας Google και χρειάζεται 2 λεπτά.",
  },
  {
    title: "Σας καλούμε",
    text: "Ο Αρχηγός του τμήματος επικοινωνεί μαζί σας, με σειρά προτεραιότητας, μόλις υπάρξει θέση.",
  },
  {
    title: "Δοκιμαστικές συγκεντρώσεις",
    text: "Το παιδί έρχεται σε μερικές συγκεντρώσεις για να γνωρίσει την ομάδα, χωρίς δέσμευση.",
  },
  {
    title: "Καλώς ήρθες!",
    text: "Ολοκληρώνουμε την εγγραφή στο Σώμα Ελλήνων Προσκόπων και η περιπέτεια ξεκινά.",
  },
];

export default function JoinPage() {
  const embedUrl = siteConfig.enrollmentFormUrl.replace(/\/viewform.*$/, "/viewform?embedded=true");
  return (
    <>
      <PageHero
        eyebrow="Νέα μέλη"
        title="Εγγραφές"
        intro="Θέλετε το παιδί σας να ζήσει την περιπέτεια του προσκοπισμού; Δείτε πώς γίνεται η εγγραφή."
        seed={44}
      >
        <EnrollButton label="Αίτηση Εκδήλωσης Ενδιαφέροντος" className="text-xl" />
      </PageHero>

      <section aria-labelledby="steps-title" className="py-16 sm:py-20">
        <Container>
          <SectionHeading id="steps-title" title="Πώς γίνεται η εγγραφή" />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-card border-2 border-forest/15 bg-paper p-6">
                <Shield className="mb-4 h-16 w-14">
                  <span className="heading text-2xl">{i + 1}</span>
                </Shield>
                <h3 className="text-xl text-forest">{s.title}</h3>
                <p className="mt-2 text-ink/85">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 rounded-card border-l-4 border-scout-red bg-sand p-5">
            <strong className="text-forest">Σημαντικό:</strong> οι θέσεις ανά τμήμα είναι
            περιορισμένες και οι αιτήσεις εξετάζονται με τη σειρά υποβολής τους.
          </p>
        </Container>
      </section>

      <section aria-labelledby="sections-title" className="bg-sand py-16 sm:py-20">
        <Container>
          <SectionHeading id="sections-title" title="Σε ποιο τμήμα;" />
          <div className="overflow-x-auto rounded-card border-2 border-forest/20 bg-paper">
            <table className="w-full min-w-[36rem] text-left">
              <caption className="sr-only">Τμήματα, ηλικίες και συγκεντρώσεις</caption>
              <thead className="bg-forest text-paper">
                <tr>
                  {["Τμήμα", "Ηλικία", "Τάξεις", "Συγκέντρωση"].map((h) => (
                    <th key={h} scope="col" className="heading p-4 text-lg">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {siteConfig.sections.map((s) => (
                  <tr key={s.slug} className="border-t border-forest/15">
                    <th scope="row" className="p-4 font-bold text-forest">
                      <Link href={routes.section(s.slug)} className="underline underline-offset-4">
                        {s.name}
                      </Link>
                    </th>
                    <td className="p-4">{s.ageRange}</td>
                    <td className="p-4">{s.grades}</td>
                    <td className="p-4">{s.meeting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-6 md:grid-cols-2">
          <div className="rounded-card border-2 border-forest/15 p-6">
            <h2 className="text-2xl text-forest">Κόστος</h2>
            {/* TODO: πραγματικά ποσά */}
            <p className="mt-3">
              Ετήσια συνδρομή <strong>TODO €</strong>, που περιλαμβάνει ασφάλιση και εγγραφή στο
              ΣΕΠ. Οι εκδρομές και οι κατασκηνώσεις πληρώνονται ξεχωριστά. Κανένα παιδί δεν μένει
              εκτός για οικονομικούς λόγους: μιλήστε μας εμπιστευτικά.
            </p>
          </div>
          <div className="rounded-card border-2 border-forest/15 p-6">
            <h2 className="text-2xl text-forest">Στολή</h2>
            {/* TODO: πού αγοράζεται και κόστος */}
            <p className="mt-3">
              Στην αρχή αρκούν άνετα ρούχα και αθλητικά παπούτσια. Η στολή (πουκάμισο, μαντήλι,
              καπέλο) αποκτάται μετά την Υπόσχεση, από το πρατήριο του ΣΕΠ. Ενδεικτικό κόστος: TODO
              €.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="faq-title" className="bg-sand py-16 sm:py-20">
        <Container className="max-w-4xl">
          <SectionHeading id="faq-title" title="Συχνές ερωτήσεις" />
          <Faq items={getFaq()} />
        </Container>
      </section>

      <section aria-labelledby="form-title" className="py-16 sm:py-20">
        <Container className="max-w-4xl">
          <SectionHeading
            id="form-title"
            title="Αίτηση Εκδήλωσης Ενδιαφέροντος"
            intro="Ανοίξτε τη φόρμα σε νέα καρτέλα ή συμπληρώστε τη εδώ."
          />
          <EnrollButton label="Άνοιγμα φόρμας σε νέα καρτέλα" className="mb-6" />
          <LoadOnClick
            src={embedUrl}
            title="Φόρμα Google: Αίτηση Εκδήλωσης Ενδιαφέροντος"
            buttonLabel="Εμφάνιση φόρμας εδώ"
            notice="Η φόρμα φιλοξενείται από τη Google. Με το κλικ θα φορτωθεί περιεχόμενο από τη Google, που μπορεί να χρησιμοποιεί cookies."
            height={1100}
          />
        </Container>
      </section>
    </>
  );
}
