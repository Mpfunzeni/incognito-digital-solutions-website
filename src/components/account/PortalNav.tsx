"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, LogOut, Server, Shield, UserRound } from "lucide-react";
import { logOutAction } from "@/app/account/actions";

const items = [
  { href: "/account", label: "Overview", icon: LayoutDashboard },
  { href: "/account/services", label: "Hosting services", icon: Server },
  { href: "/account/invoices", label: "Invoices", icon: FileText },
  { href: "/account/profile", label: "Profile", icon: UserRound },
];

export function PortalNav({ admin }: { admin: boolean }) {
  const pathname = usePathname();
  const all = admin ? [...items, { href: "/account/admin", label: "Admin", icon: Shield }] : items;
  return (
    <nav aria-label="Client area">
      <ul className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {all.map(({ href, label, icon: I }) => {
          const active = href === "/account" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-[0.95rem] font-medium transition-colors ${
                  active ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-white hover:text-ink-900"
                }`}
              >
                <I className="size-4.5" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
        <li className="shrink-0 lg:mt-4 lg:border-t lg:border-line lg:pt-4">
          <form action={logOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[0.95rem] font-medium text-ink-700 hover:bg-white hover:text-ink-900"
            >
              <LogOut className="size-4.5" aria-hidden="true" />
              Log out
            </button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
