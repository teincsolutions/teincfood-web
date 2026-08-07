# TeincFoodWeb

SEO-rich, server-rendered marketing website for the **TeincFood** food-delivery
marketplace. It funnels three audiences to the correct app download:

- **Buyer** → **TeincFood** app
- **Restaurant / Business owner** → **TeincFoodBusiness** app
- **Rider / Driver** → **TeincFoodBusiness** app

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4,
next-intl, framer-motion, and lucide-react.

## Getting started

```bash
yarn            # install (uses yarn.lock)
cp .env.example .env   # then fill in store links
yarn dev        # http://localhost:3000
```

## Scripts

| Command                | Description                        |
|------------------------|------------------------------------|
| `yarn dev`             | Start dev server                   |
| `yarn build`           | Production build (standalone)      |
| `yarn start`           | Serve production build             |
| `yarn lint`            | ESLint (flat config)               |
| `yarn typecheck`       | TypeScript check (`tsc --noEmit`)  |

## Configuration

All go-live values are env-driven (never hardcoded in components):
`NEXT_PUBLIC_SITE_URL`, the four store URLs, `NEXT_PUBLIC_GOOGLE_ANALYTICS`,
`NEXT_PUBLIC_CONTACT_EMAIL`, and optional SMTP vars. See `.env.example`.

## Project structure

```
src/
  app/[locale]/          routes (home, order, business, rider, about, faq, contact, legal/*)
  app/api/contact        SMTP lead-capture endpoint
  app/sitemap.ts, robots.ts, manifest.ts, icon
  components/
    layout/        Navbar, Footer
    install/       AppInstallBanner (iOS/Android/desktop), ServiceWorker
    showcase/      DeviceFrame + PlaceholderScreen (swap screenshots here)
    brand/         Logo, StoreBadges
    sections/      Hero, SectionHeading, StepsSection, FeatureCards
    ui/            Button, Container, Section, Badge
  config/          site.ts (env/links), screens.ts (asset registry), i18n.ts
  content/messages/  en.json, fr.json (all copy)
  i18n/            routing, request
  lib/             seo.ts (canonical/hreflang helper), utils.ts
```

## Adding real app screenshots

Product visuals render through `<DeviceFrame />`. Each slot is registered in
`src/config/screens.ts`. Swap flow:

1. Drop PNGs into `public/screens/`.
2. Set the `image` field of the relevant `ScreenKey` to the path
   (e.g. `"/screens/buyer-home.png"`).
No component changes needed — placeholders disappear automatically.

## Content / i18n

All copy lives in `src/content/messages/{locale}.json`. Add a new language by:
1. Duplicating `en.json` as `{code}.json` and translating.
2. Adding the code to `locales` in `src/config/i18n.ts`.

## SEO

- Per-page metadata with canonical + `hreflang` (`src/lib/seo.ts`).
- JSON-LD: `Organization` (home), `FAQPage` (faq).
- `sitemap.xml` (per-locale with alternates) and `robots.txt` auto-generated.
- OG/Twitter images currently point at `/icon.png` — replace with a designed
  `1200x630` social card in `public/` and update `src/app/layout.tsx`.

## Deployment (Docker + GitHub Actions → GHCR → shared Hetzner server)

Deploys to the **same server** as `TeincFoodBackend`, but as an isolated
compose stack (project `teincfoodweb`, container `teincfood_web`). It joins the
backend's existing `teinc-internal-net` so the reverse proxy can reach it.

- **CI** (`.github/workflows/ci.yml`): lint → typecheck → build → push image
  (`linux/arm64`) to GHCR.
- **Deploy**: on a published GitHub release with target `main` or `test`, the
  self-hosted runner pulls the tagged image and runs `docker compose up -d`
  (isolated project name, no clash with the backend stack).
- Store links + site URL are **build args** (`NEXT_PUBLIC_*` are inlined by
  Next.js at build time — they must be GitHub vars/secrets, not just runtime
  env). SMTP/contact are runtime env on the container.

### Required repository secrets/vars

Secrets:
`NEXT_PUBLIC_BUYER_APP_STORE`, `NEXT_PUBLIC_BUYER_PLAY_STORE`,
`NEXT_PUBLIC_BUSINESS_APP_STORE`, `NEXT_PUBLIC_BUSINESS_PLAY_STORE`,
`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (only if contact email is required).

Vars:
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GOOGLE_ANALYTICS`,
`NEXT_PUBLIC_CONTACT_EMAIL`, `SMTP_PORT`, `SMTP_SECURE`, `FROM_EMAIL`.

Local run (requires the backend's `teinc-internal-net` network on the host):

```bash
docker network create teinc-internal-net 2>/dev/null || true
docker compose up --build -d
```

## Notes

- Manrope variable font is self-hosted via `next/font` (no external request).
- Brand colors: Navy `#1E1E2E`, Orange `#FF7622`, Surface `#FFF9F5`.