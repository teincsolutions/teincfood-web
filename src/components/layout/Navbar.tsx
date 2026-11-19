"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

const customerLinks = [
  { href: "/order", key: "order" },
  { href: "/whatsapp", key: "whatsapp" },
] as const;

const businessLinks = [
  { href: "/business", key: "merchants" },
  { href: "/business/fleet", key: "fleetManagement" },
] as const;

const resourceLinks = [
  { href: "/plans", key: "plans" },
  { href: "/about", key: "about" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
  { href: "/download", key: "downloads" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/business") return pathname === "/business";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<
    "customers" | "business" | "resources" | null
  >(null);
  const navRef = useRef<HTMLDivElement>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const customersActive = customerLinks.some((item) =>
    isActive(pathname, item.href),
  );
  const businessActive = businessLinks.some((item) =>
    isActive(pathname, item.href),
  );
  const resourcesActive = resourceLinks.some((item) =>
    isActive(pathname, item.href),
  );

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-40 border-b border-navy/5 bg-white/95 backdrop-blur-md"
    >
      <nav
        aria-label="Main"
        className="container-site flex h-[72px] items-center justify-between gap-3"
      >
        <Logo priority className="shrink-0" />

        <ul className="hidden items-center gap-0.5 whitespace-nowrap xl:flex">
          <li>
            <Dropdown
              id="customers-menu"
              label={t("customers")}
              open={openMenu === "customers"}
              active={customersActive}
              onToggle={() =>
                setOpenMenu((current) =>
                  current === "customers" ? null : "customers",
                )
              }
            >
              {customerLinks.map((item) => (
                <DropdownLink
                  key={item.key}
                  href={item.href}
                  label={t(item.key)}
                  active={isActive(pathname, item.href)}
                  onSelect={() => setOpenMenu(null)}
                />
              ))}
            </Dropdown>
          </li>

          <li>
            <Dropdown
              id="business-menu"
              label={t("business")}
              open={openMenu === "business"}
              active={businessActive}
              onToggle={() =>
                setOpenMenu((current) =>
                  current === "business" ? null : "business",
                )
              }
            >
              {businessLinks.map((item) => (
                <DropdownLink
                  key={item.key}
                  href={item.href}
                  label={t(item.key)}
                  active={isActive(pathname, item.href)}
                  onSelect={() => setOpenMenu(null)}
                />
              ))}
            </Dropdown>
          </li>

          <li>
            <Link
              href="/rider"
              className={cn(
                "inline-flex min-h-11 items-center rounded-lg px-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800",
                isActive(pathname, "/rider")
                  ? "bg-navy/[0.06] text-navy"
                  : "text-navy/70 hover:bg-navy/5 hover:text-navy",
              )}
            >
              {t("rider")}
            </Link>
          </li>

          <li>
            <Link
              href="/apps"
              className={cn(
                "inline-flex min-h-11 items-center rounded-lg px-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800",
                isActive(pathname, "/apps")
                  ? "bg-navy/[0.06] text-navy"
                  : "text-navy/70 hover:bg-navy/5 hover:text-navy",
              )}
            >
              {t("apps")}
            </Link>
          </li>

          <li>
            <Dropdown
              id="resources-menu"
              label={t("resources")}
              open={openMenu === "resources"}
              active={resourcesActive}
              onToggle={() =>
                setOpenMenu((current) =>
                  current === "resources" ? null : "resources",
                )
              }
            >
              {resourceLinks.map((item) => (
                <DropdownLink
                  key={item.key}
                  href={item.href}
                  label={t(item.key)}
                  active={isActive(pathname, item.href)}
                  onSelect={() => setOpenMenu(null)}
                />
              ))}
            </Dropdown>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>
          <div className="hidden lg:block">
            <ButtonLink
              href="/download"
              variant="primary"
              size="md"
              className="min-w-44 shrink-0 whitespace-nowrap"
            >
              {t("download")}
            </ButtonLink>
          </div>
          <button
            type="button"
            aria-label={mobileOpen ? t("closeMenu") : t("menu")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex size-12 items-center justify-center rounded-lg text-navy transition-colors hover:bg-navy/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800 xl:hidden"
          >
            {mobileOpen ? (
              <X className="size-6" aria-hidden="true" />
            ) : (
              <Menu className="size-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-t border-navy/5 bg-white xl:hidden"
        >
          <div className="container-site max-h-[calc(100dvh-72px)] space-y-6 overflow-y-auto py-5">
            <div>
              <p className="px-3 text-xs font-bold uppercase tracking-[0.16em] text-navy/45">
                {t("customers")}
              </p>
              <ul className="mt-2 space-y-1">
                {customerLinks.map((item) => (
                  <MobileLink
                    key={item.key}
                    href={item.href}
                    label={t(item.key)}
                    active={isActive(pathname, item.href)}
                  />
                ))}
              </ul>
            </div>

            <div>
              <p className="px-3 text-xs font-bold uppercase tracking-[0.16em] text-navy/45">
                {t("business")}
              </p>
              <ul className="mt-2 space-y-1">
                {businessLinks.map((item) => (
                  <MobileLink
                    key={item.key}
                    href={item.href}
                    label={t(item.key)}
                    active={isActive(pathname, item.href)}
                  />
                ))}
              </ul>
            </div>

            <div>
              <p className="px-3 text-xs font-bold uppercase tracking-[0.16em] text-navy/45">
                {t("apps")}
              </p>
              <ul className="mt-2 space-y-1">
                <MobileLink
                  href="/apps"
                  label={t("apps")}
                  active={isActive(pathname, "/apps")}
                />
              </ul>
            </div>

            <div>
              <p className="px-3 text-xs font-bold uppercase tracking-[0.16em] text-navy/45">
                {t("riders")}
              </p>
              <ul className="mt-2 space-y-1">
                <MobileLink
                  href="/rider"
                  label={t("rider")}
                  active={isActive(pathname, "/rider")}
                />
              </ul>
            </div>

            <div>
              <p className="px-3 text-xs font-bold uppercase tracking-[0.16em] text-navy/45">
                {t("company")}
              </p>
              <ul className="mt-2 space-y-1">
                {resourceLinks.map((item) => (
                  <MobileLink
                    key={item.key}
                    href={item.href}
                    label={t(item.key)}
                    active={isActive(pathname, item.href)}
                  />
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 border-t border-navy/5 pt-5">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Dropdown({
  id,
  label,
  open,
  active,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  open: boolean;
  active: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className={cn(
          "inline-flex min-h-11 items-center gap-1 rounded-lg px-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800",
          active || open
            ? "bg-navy/[0.06] text-navy"
            : "text-navy/70 hover:bg-navy/5 hover:text-navy",
        )}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div
          id={id}
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-navy/10 bg-white p-2 shadow-xl shadow-navy/10"
        >
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownLink({
  href,
  label,
  active,
  onSelect,
}: {
  href: string;
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onSelect}
      className={cn(
        "flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold transition-colors hover:bg-navy/5 hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800",
        active ? "bg-navy/[0.06] text-navy" : "text-navy/70",
      )}
    >
      {label}
    </Link>
  );
}

function MobileLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex min-h-12 items-center rounded-lg px-3 text-base font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800",
          active ? "bg-navy/[0.06] text-navy" : "text-navy/70 hover:bg-navy/5",
        )}
      >
        {label}
      </Link>
    </li>
  );
}
