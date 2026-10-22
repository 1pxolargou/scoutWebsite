"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/routes";

export function NavLinks({
  className = "",
  linkClassName = "",
  onNavigate,
}: {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {mainNav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={`${linkClassName} ${active ? "underline decoration-2 underline-offset-8" : ""}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
