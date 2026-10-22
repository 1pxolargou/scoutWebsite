import type { Metadata } from "next";
import { siteConfig } from "@site-config";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = { title: "Πολιτική Απορρήτου" };

// TODO: έλεγχος του κειμένου από νομικό σύμβουλο πριν τη δημοσίευση.
export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Πολιτική Απορρήτου" intro="Τελευταία ενημέρωση: TODO" seed={5} />
      <Container className="py-12 sm:py-16">
        <div className="prose-scout">
          <h2>Ποιοι είμαστε</h2>
          <p>
            Υπεύθυνος επεξεργασίας είναι το {siteConfig.name}, μέλος του{" "}
            {siteConfig.parentOrganization.name}. Επικοινωνία: {siteConfig.contact.email}.
          </p>
          <h2>Τι δεδομένα συλλέγουμε</h2>
          <ul>
            <li>
              <strong>Αιτήσεις εγγραφής:</strong> συλλέγονται μέσω φόρμας Google Forms. Τα δεδομένα
              αποθηκεύονται στον λογαριασμό Google του Συστήματος και χρησιμοποιούνται μόνο για την
              επικοινωνία μαζί σας σχετικά με την εγγραφή.
            </li>
            <li>
              <strong>Φόρμα επικοινωνίας:</strong> όνομα, email και μήνυμα, μόνο για να σας
              απαντήσουμε. Δεν αποθηκεύονται σε βάση δεδομένων.
            </li>
          </ul>
          <h2>Νέα από το Facebook</h2>
          <p>
            Τα νέα του site προέρχονται από τη δημόσια σελίδα μας στο Facebook και εμφανίζονται μέσα
            από το site μας. Δεν φορτώνονται scripts του Facebook και το Facebook δεν παρακολουθεί
            την επίσκεψή σας εδώ.
          </p>
          <h2>Φωτογραφίες ανηλίκων</h2>
          <p>
            Δημοσιεύουμε φωτογραφίες μόνο με τη συγκατάθεση των γονέων και ποτέ ονόματα, σχολεία ή
            άλλα προσωπικά στοιχεία παιδιών. Για αφαίρεση φωτογραφίας γράψτε μας στο{" "}
            {siteConfig.contact.email}.
          </p>
          <h2>Cookies και στατιστικά</h2>
          <p>
            Το site δεν χρησιμοποιεί cookies παρακολούθησης. Χάρτες και φόρμες τρίτων φορτώνονται
            μόνο αν το επιλέξετε.
          </p>
          <h2>Τα δικαιώματά σας</h2>
          <p>
            Έχετε δικαίωμα πρόσβασης, διόρθωσης και διαγραφής των δεδομένων σας, καθώς και
            καταγγελίας στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (www.dpa.gr).
          </p>
        </div>
      </Container>
    </>
  );
}
