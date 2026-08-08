import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { StoreBadges } from "@/components/brand/StoreBadges";
import { storeLinks, siteConfig } from "@/config/site";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const productLinks = [
    { href: "/order", label: nav("order") },
    { href: "/business", label: nav("business") },
    { href: "/rider", label: nav("rider") },
  ];
  const companyLinks = [
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
    <footer className="bg-navy text-white">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-1">
          <Logo variant="footer" />
          <p className="text-sm leading-relaxed text-white/60">
            {t("tagline")}
          </p>
        </div>

        <FooterCol title={t("product")} links={productLinks} />
        <FooterCol title={t("company")} links={companyLinks} />
        <FooterCol title={t("legal")} links={legalLinks} />
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <StoreBadges
            appStoreUrl={storeLinks.buyer.appStore}
            playStoreUrl={storeLinks.buyer.playStore}
            size="sm"
          />
          <div className="text-sm text-white/50">
            © {new Date().getFullYear()} {siteConfig.name}. {t("rights")}
          </div>
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
      <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/50">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}