import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const productLinks = [
    { href: "/download?app=buyer", label: t("apps.customer") },
    { href: "/download?app=business", label: t("apps.business") },
    { href: "/download?app=desktop", label: t("apps.desktop") },
    { href: "/whatsapp", label: t("apps.whatsapp") },
  ];
  const companyLinks = [
    { href: "/plans", label: nav("plans") },
    { href: "/about", label: nav("about") },
    { href: "/faq", label: nav("faq") },
    { href: "/contact", label: nav("contact") },
  ];
  const legalLinks = [
    { href: "/legal/privacy", label: t("privacy") },
    { href: "/legal/terms", label: t("terms") },
    { href: siteConfig.deleteAccountPath, label: t("deleteAccount") },
  ];

  return (
    <footer className="bg-navy-deep text-white">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-20">
        <div className="space-y-5">
          <Logo variant="footer" />
          <p className="max-w-xs text-sm leading-relaxed text-white/65">
            {t("tagline")}
          </p>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            <Mail aria-hidden="true" className="size-4" />
            {siteConfig.contactEmail}
          </a>
        </div>

        <FooterCol title={t("product")} links={productLinks} />
        <FooterCol title={t("company")} links={companyLinks} />
        <FooterCol title={t("legal")} links={legalLinks} />
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {t("rights")}
          </p>
          <Link
            href="/download"
            className="inline-flex min-h-11 items-center font-semibold text-white/75 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            {t("downloadApp")}
          </Link>
        </Container>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
        {title}
      </h2>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-10 items-center text-sm text-white/75 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
