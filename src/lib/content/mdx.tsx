import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

/** Μετατρέπει το σώμα ενός .mdx σε React, κατά το build (Server Component). */
export async function Mdx({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, { ...runtime });
  return (
    <div className="prose-scout">
      <Content />
    </div>
  );
}
