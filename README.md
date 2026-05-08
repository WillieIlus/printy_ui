# Printy UI

Nuxt 4 frontend for Printy, a Kenya-focused print quoting and shop setup product. The app combines a public quote-calculator and shop discovery surface with authenticated client and print-shop dashboards.

## What this app includes

- Public marketplace homepage with calculator-led quote discovery
- Public shop profiles at `/shops/[slug]`
- Public product catalog pages
- Shop-owner acquisition and rate-card builder at `/for-shops`
- Auth flows for login, signup, and email verification
- Client dashboard for requests, responses, files, favorites, and drafts
- Shop dashboard for setup, materials, pricing, finishing, products, inbox, and calculator workspaces

## Stack

- Nuxt 4
- Vue 3 + TypeScript
- `@nuxt/ui`
- Pinia
- VeeValidate + Yup
- `vue-i18n` with local `en` and `sw` message files
- Vitest for unit tests

## Runtime model

- Public marketing and SEO pages use SSR
- Private app areas such as `/dashboard/**`, `/auth/**`, and `/quote-draft` run client-side
- API calls are driven by `NUXT_PUBLIC_API_BASE`
- Auth tokens are kept in cookies, not localStorage
- Dynamic sitemap URLs are fetched from the backend with a local fallback

## Requirements

- Node.js 20
- Yarn 1.22.x

## Local setup

```bash
yarn install
```

Create `.env` from the example and set the backend URL:

```bash
cp .env.example .env
```

```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
NUXT_PUBLIC_SITE_URL=https://printy.ke
NUXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NUXT_PUBLIC_GOOGLE_CLIENT_ID=replace-with-google-client-id
```

Important:

- `NUXT_PUBLIC_API_BASE` should include `/api`
- Do not add a trailing slash
- `NUXT_SITE_ENV=production` is optional and only relevant for live SEO/indexing behavior

## Scripts

```bash
yarn dev
yarn build
yarn generate
yarn preview
yarn typecheck
yarn lint
yarn test
```

`postinstall` runs `nuxt prepare` and `scripts/patch-rollup-native.mjs`.

## Main app areas

### Public

- `/`: homepage with calculator-first discovery flow
- `/for-shops`: shop-owner landing page and rate-card onboarding flow
- `/shops`: public shop listing
- `/shops/[slug]`: public shop profile, visible rate-card signals, public catalog
- `/products` and `/products/[slug]`: public catalog pages

### Authenticated

- `/dashboard/client/**`: buyer request, response, draft, favorite, file, and account flows
- `/dashboard/shop/**`: shop setup, materials, pricing, finishing, products, request inbox, profile, and calculator flows

## Project structure

- [`app/`](app): Nuxt app code
- [`app/pages/`](app/pages): route entrypoints
- [`app/components/`](app/components): UI, dashboard, marketing, quote, and auth components
- [`app/composables/`](app/composables): reusable client-side logic
- [`app/stores/`](app/stores): Pinia stores
- [`app/services/`](app/services): higher-level API/domain services
- [`app/shared/`](app/shared): shared route, type, and API-path definitions
- [`app/utils/`](app/utils): formatting, calculator, payload, quote, and media helpers
- [`server/api/`](server/api): lightweight server handlers used by Nuxt
- [`locales/`](locales): English and Swahili message catalogs
- [`public/`](public): fonts, logos, PWA icons, and static assets
- [`docs/`](docs): product and IA notes

The `new color/` and `simplify-homepage-demo/` directories are standalone exploration/demo work, not the main Nuxt app runtime.

## API and routing notes

- Backend endpoint shapes are centralized in [`app/shared/api-paths.ts`](app/shared/api-paths.ts)
- Frontend route constants for shop-owner auth/setup live in [`app/shared/routes.ts`](app/shared/routes.ts)
- Shared fetch helpers live in [`app/shared/api.ts`](app/shared/api.ts)
- The catch-all handler in [`server/api/[...].ts`](server/api/%5B...%5D.ts) is only a minimal local handler, not a full backend proxy

## Persistence

From [`app/stores/README.md`](app/stores/README.md):

- Auth state persists in cookies
- Local quote-style drafts may use localStorage
- Most operational stores are session-only and refetch on load

## Testing

Vitest is configured in [`vitest.config.ts`](vitest.config.ts). The repository currently has limited unit-test coverage; one example is [`app/utils/productVisual.spec.ts`](app/utils/productVisual.spec.ts).

## Deployment

[`netlify.toml`](netlify.toml) contains the current Netlify build settings and redirects for `/api/*` and `/media/*`.
