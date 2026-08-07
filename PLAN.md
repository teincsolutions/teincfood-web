# TeincFoodWeb — Marketing + App Landing Website

SEO-rich, server-rendered marketing website for the **TeincFood** delivery
marketplace. Three distinct audience funnels, each pushing the correct app
download:

- **Buyer** → installs the **TeincFood** app (iOS + Android)
- **Restaurant / Business owner** → installs the **TeincFoodBusiness** app
- **Rider / Driver** (also fleet manager) → installs the **TeincFoodBusiness** app

All pages are statically prerendered (`generateStaticParams`) for maximum SEO,
crawlability and speed, with an automatic app-install prompt for visitors.

---

## 1. Stack

| Concern        | Choice                                              |
|----------------|-----------------------------------------------------|
| Framework      | Next.js 16 (App Router), React 19, TypeScript       |
| Styling        | Tailwind CSS v4                                     |
| Motion         | framer-motion, `next/image`                         |
| Icons          | lucide-react                                        |
| Font           | Manrope via `next/font` (self-hosted variable font) |
| i18n           | next-intl (English default, locale-ready)           |
| SEO            | Metadata API, `sitemap.ts`, `robots.ts`, `next/og`, JSON-LD |
| Install/PWA    | Custom banner + PWA manifest + service worker       |
| Deploy         | Docker + GitHub Actions → GHCR → Hetzner VPS (arm64) |

### Brand tokens (extracted from logo SVGs)
- Navy: `#1E1E2E`
- Orange: `#FF7622`
- Surface: `#FFF9F5`
- White/Cream: `#FFFFFF` / `#FFFEFF`

Font: Manrope variable weight (Regular → ExtraBold).

---

## Data / configuration (env-driven)

One typed helper (`src/config/site.ts`) reads env; pages never hardcode values.

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_BUYER_APP_STORE
NEXT_PUBLIC_BUYER_PLAY_STORE
NEXT_PUBLIC_BUSINESS_APP_STORE
NEXT_PUBLIC_BUSINESS_PLAY_STORE
NEXT_PUBLIC_GOOGLE_ANALYTICS (optional)
NEXT_PUBLIC_CONTACT_EMAIL (optional)
```

## Pages

| Route            | Purpose                                              |
|------------------|------------------------------------------------------|
| `/`              | Hub: hero + Buy / Business / Rider role cards, how-it-works, features, cities, install banner |
| `/order`         | Buyer funnel (TeincFood app)                          |
| `/business`      | Merchant funnel (TeincFoodBusiness app)               |
| `/rider`         | Rider funnel (TeincFoodBusiness app)                  |
| `/about`, `/faq` | Trust + SEO long-tail                                 |
| `/legal/privacy`, `/legal/terms` | Legal (required for app stores)        |
| `/contact`       | Lead capture → SMTP API route                         |

Each page: unique title/description/canonical/OG image + JSON-LD
(`Organization`, `WebSite`, `SoftwareApplication`, `FAQPage`).

## Imagery strategy

- **No screenshots/food photography yet.** Product visuals render through a
  faithful **`<DeviceFrame />`** component. Each feature slot maps to an entry
  in **`src/config/screens.ts`**. If the slot has no image, `<DeviceFrame />`
  renders a stylish on-brand placeholder screen. Swapping in real captures
  later = drop PNGs into `public/screens/` and update one entry.
- Brand assets (SVG logos) come from `TeincFoodBrand Doc/Logo Asset/`.

## Install / download UX

- iOS Safari: Apple Smart App Banner meta + custom fallback.
- Android: `beforeinstallprompt` → install; else Google Play.
- Desktop: QR-to-download + store badges.
- Dismissal persisted in `localStorage`; never blocks above-fold content.
- PWA manifest + service worker (offline shell).

## Mobile-first

- Tailwind authored mobile-first (base = phone, `sm/md/lg` scale up).
- `DeviceFrame` is the primary product visual, responsive.
- ≥48px tap targets, sticky bottom CTAs, safe-area insets.
- LCP-performant: self-hosted font, `next/image` sizes/priority, lazy below fold.
- Lighthouse mobile pass during build.

## CI/CD (mirrors TeincFoodBackend)

- Multi-stage Dockerfile → `next build` (standalone) → slim Node runtime, non-root, `linux/arm64`.
- GitHub Actions: build & push image to GHCR → deploy on self-hosted runner
  (release-tag) via docker-compose on Hetzner, health check.
- Env via GitHub secrets/vars.

## Build order

1. Scaffold project
2. Design system (tokens, Manrope, ui primitives)
3. i18n frame + layout/nav/footer
4. DeviceFrame + screens registry
5. Home
6. order, business, rider pages
7. about / faq / legal / contact
8. SEO layer (metadata, JSON-LD, sitemap, robots, OG)
9. Install banner + PWA
10. Dockerfile / compose / GHA
11. Build + lint, `.env.example`, `README.md`, `AGENTS.md`