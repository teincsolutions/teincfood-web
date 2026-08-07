# AGENTS.md — TeincFoodWeb

Guidelines for AI agents and developers working in this repository.

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build (standalone output)
- `npm run lint` — ESLint (flat config, `eslint .`). **Run before finishing.**
- `npm run typecheck` — `tsc --noEmit`. **Run before finishing.**
- `npm run start` — serve a production build

Always run `npm run lint` and `npm run typecheck` after changes; the CI pipeline
fails otherwise.

## Architecture rules

- **Config-driven, never hardcoded.** Store links, site URL, analytics, and
  contact SMTP all come from env via `src/config/site.ts`. Add new env-driven
  values there, not in components.
- **Imagery registry.** Product screen slots live in `src/config/screens.ts`.
  Real screenshots are swapped in by setting an `image` path under
  `public/screens/` — never edit `<DeviceFrame />`/`<PlaceholderScreen />` to
  show screenshots.
- **All copy is i18n.** Text lives in `src/content/messages/{locale}.json`
  (en/fr). Use `useTranslations` / `getTranslations`. Do not hardcode visible
  copy in components. Add locales in `src/config/i18n.ts`.
- **Locale routing.** Pages live under `src/app/[locale]/`. Use `Link` from
  `@/i18n/routing` (NOT `next-intl/link`, which v4 removed). `next-intl`
  requires the `createNextIntlPlugin()` wrapper in `next.config.ts`.
- **Mobile-first.** Tailwind classes start at mobile and scale up with
  `sm:`/`md:`/`lg:`. Keep tap targets ≥48px. Product imagery uses
  `<DeviceFrame />`.
- **No emojis** — use icons from `lucide-react`.
- **Server components by default.** Add `"use client"` only for interactive
  pieces (Navbar menu, install banner, contact form).
- **Metadata/SEO.** Per-page `generateMetadata` should use
  `localizeMetadata()` from `src/lib/seo.ts` so canonical + hreflang are
  emitted. Add JSON-LD via `<JsonLd />` (`src/components/seo/JsonLd.tsx`).

## Deploy

- Docker multi-stage build (`.next/standalone`, non-root, `linux/arm64`).
- GitHub Actions (`.github/workflows/ci.yml`) builds/pushes to GHCR; a
  self-hosted runner deploys via `docker compose` on release tags.
- Secrets/vars are injected from GitHub; see `docker-compose.yml` for the env
  contract and `.env.example` for the local contract.