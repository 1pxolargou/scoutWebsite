import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = { title: "Cookies" };

// TODO: έλεγχος κειμένου πριν τη δημοσίευση.
export default function CookiesPage() {
  return (
    <>
      <PageHero title="Cookies" intro="Σύντομα: δεν σας παρακολουθούμε." seed={6} />
      <Container className="py-12 sm:py-16">
        <div className="prose-scout">
          <p>
            Το site μας <strong>δεν χρησιμοποιεί cookies</strong> για διαφήμιση ή παρακολούθηση και
            γι&apos; αυτό δεν σας ζητάμε συγκατάθεση με αναδυόμενο παράθυρο.
          </p>
          <h2>Περιεχόμενο τρίτων</h2>
          <ul>
            <li>
              <strong>Χάρτης (OpenStreetMap)</strong>: φορτώνεται μόνο όταν πατήσετε «Εμφάνιση
              χάρτη».
            </li>
            <li>
              <strong>Φόρμα εγγραφής (Google Forms)</strong>: ανοίγει σε νέα καρτέλα ή φορτώνεται
              μόνο αν πατήσετε «Εμφάνιση φόρμας εδώ». Η Google μπορεί τότε να χρησιμοποιήσει δικά
              της cookies.
            </li>
          </ul>
          <h2>Στατιστικά</h2>
          <p>
            Αν στο μέλλον προστεθούν στατιστικά επισκεψιμότητας, θα χρησιμοποιηθεί υπηρεσία χωρίς
            cookies που δεν αναγνωρίζει προσωπικά τους επισκέπτες.
          </p>
        </div>
      </Container>
    </>
  );
}
