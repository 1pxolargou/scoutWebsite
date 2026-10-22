import { siteConfig } from "@site-config";
import { t } from "@/i18n/el";
import { ExternalIcon, ExternalLink, buttonClasses } from "./Button";

/** Ο μοναδικός τρόπος να ανοίξει η φόρμα εγγραφών Google σε όλο το site. */
export function EnrollButton({
  label = t.enroll.cta,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <ExternalLink
      href={siteConfig.enrollmentFormUrl}
      hint={t.enroll.newTabHint}
      className={buttonClasses("primary", className)}
    >
      {label}
      <ExternalIcon />
    </ExternalLink>
  );
}
