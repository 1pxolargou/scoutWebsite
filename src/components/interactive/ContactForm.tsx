"use client";

import Link from "next/link";
import { useState } from "react";
import { contactSchema, subjectLabels } from "@/lib/contact";
import { routes } from "@/lib/routes";

type Errors = Partial<Record<string, string>>;
type Status = "idle" | "error" | "success";

/**
 * Στατική έκδοση: μετά τον έλεγχο ανοίγει το πρόγραμμα email του επισκέπτη με
 * έτοιμο μήνυμα. Όταν ανέβει το site σε server, η αποστολή θα γίνεται με Server Action.
 */
export function ContactForm({ email }: { email: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({
      ...Object.fromEntries(fd),
      consent: fd.get("consent") === "on",
    });
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message;
      setErrors(errs);
      setStatus("error");
      return;
    }
    setErrors({});
    if (parsed.data.website) return; // bot: σιωπηλή απόρριψη
    const { name, email: from, subject, message } = parsed.data;
    const body = `${message}\n\n— ${name} (${from})`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`[Site] ${subjectLabels[subject]}`)}&body=${encodeURIComponent(body)}`;
    setStatus("success");
  }

  const field =
    "mt-1 block w-full rounded-md border-2 border-forest/30 bg-paper px-3 py-2.5 focus:border-forest";
  const errorText = (name: string) =>
    errors[name] && (
      <p id={`${name}-error`} className="mt-1 text-sm font-semibold text-scout-red">
        {errors[name]}
      </p>
    );
  const aria = (name: string) => ({
    "aria-invalid": !!errors[name] || undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      <div aria-live="polite">
        {status === "error" && (
          <p className="rounded-md border-2 border-scout-red bg-paper p-3 font-semibold text-scout-red">
            Ελέγξτε τα πεδία που επισημαίνονται.
          </p>
        )}
        {status === "success" && (
          <p className="rounded-md border-2 border-forest bg-sand p-3 font-semibold text-forest">
            Ευχαριστούμε! Ανοίξαμε το πρόγραμμα email σας με έτοιμο το μήνυμα. Πατήστε «Αποστολή»
            εκεί για να μας το στείλετε.
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="font-semibold">Ονοματεπώνυμο</span>
          <input name="name" autoComplete="name" className={field} {...aria("name")} />
          {errorText("name")}
        </label>
        <label className="block">
          <span className="font-semibold">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className={field}
            {...aria("email")}
          />
          {errorText("email")}
        </label>
      </div>

      <label className="block">
        <span className="font-semibold">Θέμα</span>
        <select name="subject" defaultValue="" className={field} {...aria("subject")}>
          <option value="" disabled>
            Επιλέξτε…
          </option>
          {Object.entries(subjectLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errorText("subject")}
      </label>

      <label className="block">
        <span className="font-semibold">Μήνυμα</span>
        <textarea name="message" rows={6} className={field} {...aria("message")} />
        {errorText("message")}
      </label>

      {/* Honeypot: κρυφό από ανθρώπους και αναγνώστες οθόνης */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label className="flex items-start gap-3">
          <input
            name="consent"
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 accent-forest"
            {...aria("consent")}
          />
          <span className="text-sm">
            Συμφωνώ να χρησιμοποιηθούν τα στοιχεία μου μόνο για την απάντηση στο μήνυμά μου, σύμφωνα
            με την{" "}
            <Link href={routes.privacy} className="font-semibold text-forest underline">
              Πολιτική Απορρήτου
            </Link>
            .
          </span>
        </label>
        {errorText("consent")}
      </div>

      <button
        type="submit"
        className="heading rounded-md border-2 border-scout-red bg-scout-red px-6 py-3 text-lg text-paper hover:bg-scout-red-dark"
      >
        Αποστολή μηνύματος
      </button>
    </form>
  );
}
