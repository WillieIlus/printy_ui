# Printy UI

Nuxt 4 frontend for the Printy pricing engine & gallery. Built with Nuxt 4 conventions, type safety, and scalability.

**Core value proposition:**
- **Pricing accuracy** – Reduce underpricing mistakes with suggested selling prices and cost breakdown
- **Speed of quoting** – Generate professional quotes in under 60–90 seconds

## Stack

- **Nuxt 4** – Vue 3, Vite 7
- **@nuxt/ui** – UI components, Tailwind, **light/dark mode**
- **Pinia** – State (auth, shop, quote, claim, profile, pricing)
- **VeeValidate + yup** – Form validation
- **TypeScript** – Strict mode, shared types in `shared/types/`

## Setup

```bash
yarn install
```

Copy environment variables:

```bash
cp .env.example .env
```

Edit `.env` – set `NUXT_PUBLIC_API_BASE_URL` (server root, no trailing slash):

```
# Default
# NUXT_PUBLIC_API_BASE_URL=https://api.printy.ke
# NUXT_PUBLIC_SITE_URL=https://printy.ke

NUXT_PUBLIC_API_BASE_URL=https://api.printy.ke
NUXT_PUBLIC_SITE_URL=https://printy.ke
```

**Netlify / DigitalOcean:** Set `NUXT_PUBLIC_API_BASE_URL` in your hosting environment variables to the deployed backend origin, for example `https://api.printy.ke`.

## Development

```bash
yarn dev
```

Open your running app URL and use the header **sun/moon** icon to toggle light/dark mode.

## Build & type check

```bash
yarn build
yarn typecheck
yarn lint
```

## Features

### Quote & Pricing

- **Business Output Panel** – On the shop page (`/shops/[slug]`), the price calculator shows:
  - **Suggested Selling Price** – Prominent, live-updating
  - **Cost Breakdown** – Paper, Printing, Finishing, Wastage, Machine/Labor
  - **Your Profit & Margin** – When cost data is configured
  - **Underpricing Warning** – Red alert when override price is below suggested
  - **Quote time hint** – “Quote ready instantly”
- **Instant Price Calculator** – Job specs (paper size, GSM, quantity, sides, finishing) update the quote in real time
- **KES formatting** – Kenyan Shilling currency throughout

### Auth & Shops

- Cookie-based auth (tokens in cookies only; see `app/stores/README.md` for persistence rules)
- Shop management, members, hours, social links
- Rate card and pricing configuration for shop owners

## Structure (Nuxt 4)

- **`app/`** – Components, composables, layouts, middleware, pages, plugins, assets
- **`app/components/quotes/`** – QuoteOutputPanel, CostBreakdownTable, QuoteForm, QuoteCalculator
- **`app/components/pricing/`** – PriceCalculatorWidget, RateCardDisplay, pricing forms
- **`shared/types/`** – Shared TypeScript types (auth, shop, quote, claim, pricing, api)
- **`stores/`** – Pinia stores (auth, profile, shop, quote, claim, pricing)
- **`server/api/`** – Server routes (e.g. proxy/catch-all)

See `QUOTE_REDESIGN_PLAN.md` for the full quote UX redesign roadmap.
