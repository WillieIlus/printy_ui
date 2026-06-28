# Printy SEO + Security drop-in pack

Generated 2026-06-24. Drop these files into the Printy Nuxt repo
(or the deploy target) to close the gaps flagged in the audit:
robots/sitemap missing, no meta description / OG tags, no `lang`,
no security headers, no PWA manifest, `/auth/*` indexable.

```
printy-seo/
├── public/
│   ├── robots.txt              → ship at  https://printy.ke/robots.txt
│   ├── sitemap.xml             → ship at  https://printy.ke/sitemap.xml
│   └── manifest.webmanifest    → ship at  https://printy.ke/manifest.webmanifest
├── assets/
│   └── og/
│       └── printy-og-default.jpg   → ship at /assets/og/printy-og-default.jpg
│                                     (1200×630, ~101 KB, JPEG progressive)
├── nuxt/
│   ├── app.head.ts             → merge into nuxt.config.ts (`app.head` + `routeRules`)
│   ├── nitro.security.ts       → merge into nuxt.config.ts (`nitro.routeRules`)
│   └── pages/
│       ├── track-job.vue       → ships /track-job  (fixes the broken header link)
│       ├── contact.vue         → ships /contact    (phone, WhatsApp, email, address)
│       └── legal/
│           ├── privacy.vue         → /legal/privacy
│           ├── terms.vue           → /legal/terms
│           └── refund-policy.vue   → /legal/refund-policy
├── cloudflare/
│   ├── _headers                → use this if you deploy via Pages / Netlify
│   └── transform-rules.md      → equivalent rules for the Cloudflare dashboard
└── README.md
```

---

## 1) Static files — `public/`

Anything inside Nuxt's `public/` directory is served as-is from the
domain root. Just copy:

```bash
cp printy-seo/public/robots.txt           printy-app/public/robots.txt
cp printy-seo/public/sitemap.xml          printy-app/public/sitemap.xml
cp printy-seo/public/manifest.webmanifest printy-app/public/manifest.webmanifest
```

Verify after deploy:

```bash
curl -I https://printy.ke/robots.txt          # expect 200 + text/plain
curl -I https://printy.ke/sitemap.xml         # expect 200 + application/xml
curl -I https://printy.ke/manifest.webmanifest
```

> **Heads-up:** the current site returns the Nuxt SPA shell on
> `/robots.txt` and `/sitemap.xml` (HTTP 200 but HTML). Once these
> static files exist in `public/`, Nitro will serve them first.

### Better: generate `sitemap.xml` dynamically

For a real site, install `@nuxtjs/sitemap` so new product pages get
indexed automatically:

```bash
pnpm add -D @nuxtjs/sitemap @nuxtjs/robots
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap', '@nuxtjs/robots'],
  site: { url: 'https://printy.ke', name: 'Printy' },
  sitemap: {
    exclude: ['/auth/**', '/dashboard/**', '/partner/**', '/production/**', '/admin/**'],
  },
  robots: {
    disallow: ['/auth/', '/dashboard/', '/partner/', '/production/', '/admin/', '/api/'],
    sitemap:  'https://printy.ke/sitemap.xml',
  },
})
```

Then delete the static `robots.txt` / `sitemap.xml` — the modules will
emit them at build time and keep them in sync with your route table.

---

## 2) Meta tags + structured data — `nuxt/app.head.ts`

Open your `nuxt.config.ts` and merge the exported object's `app.head`
and `routeRules` keys into the existing config. This gives you:

- `<html lang="en">`
- Title template that no longer double-prints "| Printy"
- Real `<meta name="description">`
- Full Open Graph + Twitter card set
- `<link rel="canonical">`
- JSON-LD `Organization` + `WebSite` + `WebApplication`
- `<link rel="preconnect" href="https://api.printy.ke">` (faster first estimate)
- Apple touch icon + `manifest.webmanifest` wiring
- `routeRules` to `noindex` `/auth`, `/dashboard`, `/partner`,
  `/production`, `/admin`

### Per-page overrides

Each page that has its own unique content (product pages, FAQ, etc.)
should also call `useSeoMeta()` to set its own title/description/OG
image. The bottom of `nuxt/app.head.ts` has a copy-paste template.

---

## 3) Security headers — pick **one** path

### Path A — Nitro (preferred, lives with the code)

Merge the `nitro.routeRules` block from `nuxt/nitro.security.ts` into
`nuxt.config.ts`. Nuxt 3 will emit those headers on every response.

### Path B — Cloudflare (no redeploy)

If you'd rather configure headers in the dashboard, follow
`cloudflare/transform-rules.md`. If your build pipeline already
publishes to Cloudflare Pages / Netlify, just drop `cloudflare/_headers`
at the root of the published directory.

### Test after deploy

```bash
curl -sI https://printy.ke/ | grep -iE \
  'strict-transport|x-content|x-frame|referrer|permissions|content-security|cross-origin'
```

Then verify externally:

- https://securityheaders.com/?q=printy.ke
- https://observatory.mozilla.org/analyze/printy.ke
- https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fprinty.ke

> If the CSP breaks anything (e.g. Cloudflare Insights, Plausible,
> Google Tag Manager), add the script/connect source to the matching
> directive — don't fall back to `'unsafe-inline'` everywhere.

---

## 4) Pages — `nuxt/pages/`

Copy these straight into your repo's `pages/` directory (Nuxt 3 file-
based routing will map them to the URLs below):

| File | Route | Notes |
|---|---|---|
| `track-job.vue`         | `/track-job`         | Fixes the broken header link. Posts to `POST /api/jobs/public-status/` (add this endpoint, or change `submit()` to hit your existing tracker). |
| `contact.vue`           | `/contact`          | Single source of truth for phone, WhatsApp, email, address. Mirrors the JSON-LD `ContactPoint` declared in `app.head.ts`. |
| `legal/privacy.vue`     | `/legal/privacy`    | DPA 2019 compliant. Replace every `[[…]]` placeholder. |
| `legal/terms.vue`       | `/legal/terms`      | Distinguishes Printy (platform) from Print Shops (manufacturers). |
| `legal/refund-policy.vue` | `/legal/refund-policy` | Plain-language reprint/refund rules under Consumer Protection Act 2012. |

> Each page sets its own `useSeoMeta()` and `<link rel="canonical">`
> so it gets a unique title/description and clean social previews.

## 5) Things still to generate yourself

1. **Favicon set** — `favicon-32.png`, `apple-touch-icon.png` (180×180),
   `icon-192.png`, `icon-512.png`, `maskable-192.png`, `maskable-512.png`
   from your SVG wordmark. Quickest path:
   [realfavicongenerator.net](https://realfavicongenerator.net).
2. **OG image is bundled** at `assets/og/printy-og-default.jpg`
   (1200×630, ~101 KB). Replace with a hand-designed version when
   brand assets are finalised.
3. **Legal review** — have a Kenyan advocate look at the three `legal/`
   files before publishing. Replace every `[[…]]` placeholder with your
   real company details (registration, KRA PIN, ODPC reg, address).
4. **Backend endpoint for the tracker** — `POST /api/jobs/public-status/`
   accepting `{reference, contact}` and returning `{reference, product,
   quantity, stage, stageLabel, estCompletion}` or a `{redirect}`
   payload. Rate-limit it (currently the page handles HTTP 429 nicely).
5. **Analytics + consent banner** — pick Plausible or GA4 and register
   the host in CSP `script-src` + `connect-src`.

---

## Quick deploy checklist

- [ ] `public/robots.txt`            committed
- [ ] `public/sitemap.xml`           committed (or `@nuxtjs/sitemap` installed)
- [ ] `public/manifest.webmanifest`  committed
- [ ] `assets/og/printy-og-default.jpg` (1200×630) committed
- [ ] Favicon PNG set generated and placed in `/assets/favicons/`
- [ ] `nuxt.config.ts` merged with `app.head` + `routeRules`
- [ ] Security headers shipped (Nitro **or** Cloudflare)
- [ ] `pages/track-job.vue` committed → `/track-job` returns 200
- [ ] `pages/contact.vue` committed and linked from the footer
- [ ] `pages/legal/{privacy,terms,refund-policy}.vue` committed and linked from the footer
- [ ] Every `[[…]]` placeholder in legal pages replaced with real values
- [ ] Kenyan advocate has reviewed the three legal pages
- [ ] Backend route `POST /api/jobs/public-status/` exists and is rate-limited
- [ ] `/auth/*` returns `X-Robots-Tag: noindex, nofollow`
- [ ] `curl -sI https://printy.ke/ | grep -i strict-transport` returns the header
- [ ] securityheaders.com grade ≥ A
- [ ] Google Search Console: submit `https://printy.ke/sitemap.xml`
- [ ] Bing Webmaster Tools: submit the same sitemap
#   p r i n t y _ u i  
 #   p r i n t y _ u i  
 