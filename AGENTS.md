# AGENTS.md — Teinc FoodWeb

Guidelines for AI agents and developers working in this repository.

## Commands

- `yarn dev` — start dev server (http://localhost:3000)
- `yarn build` — production build (standalone output)
- `yarn lint` — ESLint (flat config, `eslint .`). **Run before finishing.**
- `yarn typecheck` — `tsc --noEmit`. **Run before finishing.**
- `yarn start` — serve a production build

Uses **yarn (1.x)** with a committed `yarn.lock`. In CI/Docker install via
`yarn install --frozen-lockfile`. Regenerate the lock after dependency changes
with `yarn install`. Always run `yarn lint` and `yarn typecheck` after changes;
the CI pipeline fails otherwise.

## Architecture rules

- **Config-driven, never hardcoded.** Store links, site URL, analytics, and
  contact email all come from env via `src/config/site.ts`. Add new env-driven
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
- Deploys to the **same server as Teinc FoodBackend** as an isolated compose
  project (`name: teincfoodweb`, container `teincfood_web`), joining the
  external `teinc-internal-net` so the shared reverse proxy can route to it.
- `NEXT_PUBLIC_*` are **build args** (Next.js inlines them at build time) —
  keep them in sync between `Dockerfile` args, `docker-compose.yml` build
  args, and the CI `build-args`. `TEINCFOOD_API_BASE_URL` is a runtime
  container env used by the contact + delete-account proxies.
- `TEINCFOOD_API_BASE_URL` is **version-less** (e.g.
  `https://food.teincsolutions.com/api`). The API version comes from
  `TEINCFOOD_API_VERSION` (default `v1`) and is appended by
  `src/lib/api-base.ts` — always build backend URLs with `apiUrl(path)`, never
  by string-concatenating the base yourself, so a future v2 needs no code
  change.
- Secrets/vars are injected from GitHub; see `docker-compose.yml` for the env
  contract and `.env.example` for the local contract.
