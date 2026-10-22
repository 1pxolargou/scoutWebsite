import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@site-config";
import { CopyButton } from "@/components/interactive/CopyButton";
import { Container } from "@/components/layout/Container";
import { buttonClasses } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { Shield } from "@/components/ui/Shield";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Περιοχή Μελών",
  description: "Έντυπα και στοιχεία πληρωμής συνδρομών για τα μέλη του Συστήματος.",
  // Δεν θέλουμε να εμφανίζεται σε μηχανές αναζήτησης.
  robots: { index: false, follow: false },
};

export default function MembersPage() {
  const { healthForm, payment } = siteConfig.members;
  return (
    <>
      <PageHero
        eyebrow="🔒 Για τα μέλη και τις οικογένειές τους"
        title="Περιοχή Μελών"
        intro="Ό,τι χρειάζεστε μαζεμένο σε ένα σημείο: το Δελτίο Υγείας και τα στοιχεία πληρωμής της ετήσιας συνδρομής."
        seed={321}
      />

      <div className="border-b-2 border-scout-red/30 bg-sand">
        <Container className="flex items-start gap-3 py-4 text-sm">
          <span aria-hidden="true" className="text-xl">
            ℹ️
          </span>
          <p>
            Η σελίδα αυτή απευθύνεται σε γονείς και μέλη του Συστήματος. Αν σκέφτεστε να γράψετε το
            παιδί σας, δείτε πρώτα τη σελίδα{" "}
            <Link href={routes.join} className="font-semibold text-forest underline">
              Εγγραφές
            </Link>
            .
          </p>
        </Container>
      </div>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-2">
          {/* Δελτίο Υγείας */}
          <article
            aria-labelledby="health-title"
            className="flex flex-col rounded-card border-2 border-forest/20 bg-paper p-6 sm:p-8"
          >
            <div className="mb-5 flex items-center gap-4">
              <Shield className="h-20 w-16 shrink-0">
                <span aria-hidden="true" className="text-2xl">
                  ✚
                </span>
              </Shield>
              <div>
                <p className="text-sm font-semibold tracking-wider text-scout-red uppercase">
                  Έντυπο
                </p>
                <h2 id="health-title" className="text-3xl text-forest">
                  Δελτίο Υγείας
                </h2>
              </div>
            </div>
            {/* TODO: οδηγίες από το Συμβούλιο Βαθμοφόρων */}
            <ol className="mb-6 list-decimal space-y-2 pl-5">
              <li>Κατεβάστε και εκτυπώστε το Δελτίο Υγείας.</li>
              <li>
                Συμπληρώστε το και υπογράψτε το μαζί με τον παιδίατρο ή τον οικογενειακό γιατρό.
              </li>
              <li>Παραδώστε το στον Αρχηγό του τμήματος σε κλειστό φάκελο.</li>
            </ol>
            <p className="mb-6 rounded-md border-l-4 border-scout-red bg-sand p-3 text-sm">
              Το Δελτίο ανανεώνεται <strong>κάθε χρονιά</strong> και είναι απαραίτητο για τη
              συμμετοχή σε εκδρομές και κατασκηνώσεις. Ενημερώστε μας αμέσως για κάθε αλλαγή
              (αλλεργίες, φάρμακα).
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-4">
              <a href={healthForm.url} download className={buttonClasses("secondary")}>
                <span aria-hidden="true">⬇</span> Λήψη {healthForm.label}
              </a>
              <span className="text-sm text-ink/75">
                {healthForm.format} · ενημέρωση {healthForm.updated}
              </span>
            </div>
          </article>

          {/* Πληρωμή συνδρομών */}
          <article
            aria-labelledby="payment-title"
            className="flex flex-col rounded-card border-2 border-forest/20 bg-paper p-6 sm:p-8"
          >
            <div className="mb-5 flex items-center gap-4">
              <Shield className="h-20 w-16 shrink-0">
                <span aria-hidden="true" className="heading text-2xl">
                  €
                </span>
              </Shield>
              <div>
                <p className="text-sm font-semibold tracking-wider text-scout-red uppercase">
                  Συνδρομές
                </p>
                <h2 id="payment-title" className="text-3xl text-forest">
                  Τρόπος πληρωμής
                </h2>
              </div>
            </div>
            <p className="mb-5">
              Η ετήσια συνδρομή ({payment.annualFee}) πληρώνεται με κατάθεση ή μεταφορά σε τραπεζικό
              λογαριασμό του Συστήματος, <strong>{payment.deadline}</strong>.
            </p>
            <dl className="mb-6 divide-y divide-forest/15 rounded-md border-2 border-forest/15">
              <div className="grid gap-1 p-3 sm:grid-cols-[9rem_1fr]">
                <dt className="text-sm font-semibold text-forest">Δικαιούχος</dt>
                <dd>{payment.beneficiary}</dd>
              </div>
              <div className="grid gap-1 p-3 sm:grid-cols-[9rem_1fr]">
                <dt className="text-sm font-semibold text-forest">Τράπεζα</dt>
                <dd>{payment.bank}</dd>
              </div>
              <div className="grid gap-1 p-3 sm:grid-cols-[9rem_1fr]">
                <dt className="text-sm font-semibold text-forest">IBAN</dt>
                <dd className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[0.95rem] tracking-wide break-all">
                    {payment.iban}
                  </span>
                  <CopyButton value={payment.iban} label="Αντιγραφή IBAN" />
                </dd>
              </div>
              <div className="grid gap-1 p-3 sm:grid-cols-[9rem_1fr]">
                <dt className="text-sm font-semibold text-forest">Αιτιολογία</dt>
                <dd>{payment.reference}</dd>
              </div>
            </dl>
            <p className="mt-auto text-sm text-ink/80">
              Στείλτε το αποδεικτικό στο{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="font-semibold text-forest underline"
              >
                {siteConfig.contact.email}
              </a>
              . Για δυσκολίες στην πληρωμή μιλήστε εμπιστευτικά με τον Αρχηγό ή τον Ταμία της ΕΚΣ.
            </p>
          </article>
        </Container>
      </section>
    </>
  );
}
