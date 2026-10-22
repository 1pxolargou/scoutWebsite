/** Accordion με native <details>: προσβάσιμο από πληκτρολόγιο, χωρίς JavaScript. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-forest/15 overflow-hidden rounded-card border-2 border-forest/20 bg-paper">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-forest hover:bg-sand [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden="true"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-scout-red text-scout-red transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="px-5 pb-5 leading-relaxed">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
