import { getEvent, getEvents } from "@/lib/content/load";
import { eventToIcs } from "@/lib/ics";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getEvents().map((e) => ({ slug: e.slug }));
}

export async function GET(
  _req: Request,
  { params }: RouteContext<"/ekdiloseis/[slug]/calendar.ics">,
) {
  const event = getEvent((await params).slug);
  if (!event) return new Response("Not found", { status: 404 });
  return new Response(eventToIcs(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}
