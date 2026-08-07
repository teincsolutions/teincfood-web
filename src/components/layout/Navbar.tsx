"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/order", key: "order" },
  { href: "/business", key: "business" },
  { href: "/rider", key: "rider" },
  { href: "/about", key: "about" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-navy/5 bg-white/90 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="container-site flex h-16 items-center justify-between gap-4"
      >
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-navy/70 transition-colors hover:bg-navy/5 hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ButtonLink
            href="#install"
            variant="primary"
            size="sm"
            className="hidden min-h-0 px-5 py-2.5 sm:inline-flex"
          >
            {t("download")}
          </ButtonLink>
          <button
            type="button"
            aria-label={t("menu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-lg text-navy transition-colors hover:bg-navy/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange lg:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden border-t border-navy/5 bg-white transition-[max-height,opacity] duration-200 lg:hidden",
          open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <ul className="container-site flex flex-col gap-1 py-4">
          {navItems.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base font-semibold text-navy/80 transition-colors hover:bg-navy/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <ButtonLink
              href="#install"
              onClick={() => setOpen(false)}
              className="w-full"
            >
              {t("download")}
            </ButtonLink>
          </li>
        </ul>
      </div>
    </header>
  );
}