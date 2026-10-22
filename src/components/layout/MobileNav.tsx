"use client";

import { useRef } from "react";
import { t } from "@/i18n/el";
import { NavLinks } from "./NavLinks";

/**
 * Drawer με native <dialog>: το showModal() δίνει focus trap, Esc και inert φόντο
 * χωρίς επιπλέον κώδικα.
 */
export function MobileNav({ children }: { children?: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md border-2 border-paper/70 text-paper xl:hidden"
        aria-haspopup="dialog"
      >
        <span className="sr-only">{t.nav.openMenu}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={t.nav.label}
        className="on-dark m-0 ml-auto h-dvh max-h-none w-[min(22rem,88vw)] bg-forest p-0 text-paper backdrop:bg-ink/60 open:flex open:flex-col"
        onClick={(e) => {
          // Κλικ στο backdrop κλείνει το μενού.
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="flex items-center justify-end border-b border-forest-light p-4">
          <button
            type="button"
            onClick={close}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border-2 border-paper/70"
          >
            <span className="sr-only">{t.nav.closeMenu}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav aria-label={t.nav.label} className="flex-1 overflow-y-auto p-4">
          <NavLinks
            onNavigate={close}
            className="flex flex-col"
            linkClassName="block border-b border-forest-light py-3 font-heading text-2xl font-semibold uppercase"
          />
        </nav>
        {children && (
          // Κλείνει το μενού όταν πατηθεί σύνδεσμος μέσα στο κάτω μέρος.
          <div
            className="border-t border-forest-light p-4"
            onClick={(e) => (e.target as HTMLElement).closest("a") && close()}
          >
            {children}
          </div>
        )}
      </dialog>
    </>
  );
}
