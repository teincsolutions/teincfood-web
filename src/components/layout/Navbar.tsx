"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const productLinks = [
  { href: "/order", key: "order" },
  { href: "/business", key: "business" },
  { href: "/business/fleet", key: "fleet" },
  { href: "/rider", key: "rider" },
  { href: "/whatsapp", key: "whatsapp" },
  { href: "/desktop", key: "desktop" },
  { href: "/download", key: "downloads" },
] as const;

const secondaryLinks = [
  { href: "/about", key: "about" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  // For /business, don't match /business/fleet
  if (href === "/business") return pathname === "/business";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const productsActive = productLinks.some((l) => isActive(pathname, l.href));

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-navy/5 bg-white/90 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="container-site flex h-16 items-center justify-between gap-4"
      >
        <Logo />

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          <li>
            <Link
              href="/"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange",
                isActive(pathname, "/")
                  ? "bg-navy text-white"
                  : "text-navy/70 hover:bg-navy/5 hover:text-navy",
              )}
            >
              {t("home")}
            </Link>
          </li>
          {/* Products dropdown */}
          <li>
            <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setProductsOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange",
                productsActive
                  ? "bg-navy text-white"
                  : "text-navy/70 hover:bg-navy/5 hover:text-navy",
              )}
            >
              {t("products")}
              <ChevronDown className={cn("size-3 transition-transform", productsOpen && "rotate-180")} />
            </button>
            {productsOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-navy/10 bg-white p-2 shadow-lg">
                {productLinks.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setProductsOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-navy/5 hover:text-navy",
                      isActive(pathname, item.href)
                        ? "bg-navy/10 text-navy"
                        : "text-navy/70",
                    )}
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            )}
            </div>
          </li>

          {secondaryLinks.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange",
                  isActive(pathname, item.href)
                    ? "bg-navy text-white"
                    : "text-navy/70 hover:bg-navy/5 hover:text-navy",
                )}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ButtonLink
            href="/download"
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
          open ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <ul className="container-site flex flex-col gap-1 py-4">
          <li>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-navy/5",
                isActive(pathname, "/") ? "bg-navy/10 text-navy" : "text-navy/80",
              )}
            >
              {t("home")}
            </Link>
          </li>
          {/* Products group */}
          <li>
            <span className="block px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-widest text-navy/40">
              {t("products")}
            </span>
          </li>
          {productLinks.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-navy/5",
                  isActive(pathname, item.href) ? "bg-navy/10 text-navy" : "text-navy/80",
                )}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
          {/* Company group */}
          <li>
            <span className="block px-3 pb-1 pt-4 text-xs font-bold uppercase tracking-widest text-navy/40">
              {t("company")}
            </span>
          </li>
          {secondaryLinks.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-navy/5",
                  isActive(pathname, item.href) ? "bg-navy/10 text-navy" : "text-navy/80",
                )}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
          <li className="pt-3">
            <ButtonLink
              href="/download"
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
