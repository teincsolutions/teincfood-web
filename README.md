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
npm install
cp .env.example .env   # then fill in store links
npm run dev            # http://localhost:3000
```

## Scripts

| Command                | Description                        |
|------------------------|------------------------------------|
| `npm run dev`          | Start dev server                   |
| `npm run build`        | Production build (standalone)      |
| `npm run start`        | Serve production build             |
| `npm run lint`         | ESLint (flat config)               |
| `npm run typecheck`    | TypeScript check (`tsc --noEmit`)  |

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

## Deployment (Docker + GitHub Actions → GHCR → Hetzner VPS)

Mirrors the TeincFoodBackend pipeline.

- **CI** (`.github/workflows/ci.yml`): lint → typecheck → build → push image
  (`linux/arm64`) to GHCR.
- **Deploy**: on a published GitHub release with target `main`, a self-hosted
  runner on Hetzner pulls the tagged image and runs `docker compose up -d`.
- Store links + site URL + SMTP are injected from repo/secrets/vars.

### Required repository secrets/vars

Secrets:
`NEXT_PUBLIC_BUYER_APP_STORE`, `NEXT_PUBLIC_BUYER_PLAY_STORE`,
`NEXT_PUBLIC_BUSINESS_APP_STORE`, `NEXT_PUBLIC_BUSINESS_PLAY_STORE`,
`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (only if contact email is required).

Vars:
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GOOGLE_ANALYTICS`,
`NEXT_PUBLIC_CONTACT_EMAIL`, `SMTP_PORT`, `SMTP_SECURE`, `FROM_EMAIL`.

Local same-server run:

```bash
docker compose up --build -d
```

## Notes

- Manrope variable font is self-hosted via `next/font` (no external request).
- Brand colors: Navy `#1E1E2E`, Orange `#FF7622`, Surface `#FFF9F5`.