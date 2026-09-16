# Cloudflare Transform Rules — Response Header Modification

If you'd rather set headers at the edge (no app redeploy needed),
create the following **Modify Response Header** rules in the Cloudflare
dashboard: *Rules → Transform Rules → Modify Response Header*.

> Order matters. Put the "global" rule first, then the per-path
> noindex rules.

---

## Rule 1 — Global security headers
**When incoming requests match:** `Hostname equals printy.ke`

**Set static headers:**

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-site` |
| `Permissions-Policy` | `accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(self), picture-in-picture=(), publickey-credentials-get=(self), screen-wake-lock=(), sync-xhr=(), usb=(), xr-spatial-tracking=()` |
| `Content-Security-Policy` | `default-src 'self'; base-uri 'self'; form-action 'self' https://printy.ke https://app.printy.ke; frame-ancestors 'self'; object-src 'none'; img-src 'self' data: blob: https://*.printy.ke; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://*.printy.ke; connect-src 'self' https://api.printy.ke https://*.printy.ke wss://*.printy.ke; media-src 'self' blob:; worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests` |

---

## Rule 2 — `noindex` private surfaces
**When:**
```
(http.request.uri.path matches "^/(auth|dashboard|partner|production|admin)(/|$)")
```
**Set static header:**

| Header | Value |
|---|---|
| `X-Robots-Tag` | `noindex, nofollow` |

---

## Rule 3 — Long-cache hashed assets
**When:**
```
(starts_with(http.request.uri.path, "/_nuxt/") or starts_with(http.request.uri.path, "/assets/"))
```
**Set static header:**

| Header | Value |
|---|---|
| `Cache-Control` | `public, max-age=31536000, immutable` |

---

## Rule 4 — Force `Content-Type` on robots/sitemap (only if origin sends HTML)

Right now `https://printy.ke/robots.txt` and `/sitemap.xml` return the
Nuxt SPA shell because the files don't exist. After you deploy the new
`public/robots.txt` and `public/sitemap.xml` this rule is optional, but
it guarantees the right MIME type even if a future deploy regresses.

**When:** `http.request.uri.path eq "/robots.txt"`
| Header | Value |
|---|---|
| `Content-Type` | `text/plain; charset=utf-8` |

**When:** `http.request.uri.path eq "/sitemap.xml"`
| Header | Value |
|---|---|
| `Content-Type` | `application/xml; charset=utf-8` |
