/**
 * Σε κεφαλαία το «1ο» γίνεται «1Ο» και διαβάζεται σαν «10».
 * Κρατάμε το «ο» πεζό και ως εκθέτη.
 */
export function OrdinalText({ text }: { text: string }) {
  const match = text.match(/^(\d+)ο(\s.*)$/);
  if (!match) return text;
  return (
    <>
      {match[1]}
      <sup className="normal-case">ο</sup>
      {match[2]}
    </>
  );
}
