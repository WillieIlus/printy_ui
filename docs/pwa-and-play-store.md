# Printy as an app: PWA today, Play Store next

Status: verified from the repository on 2026-11-21.

## Why Printy installs today

Printy already ships the browser-installable web app pieces:

- `public/manifest.webmanifest` with `name`, `short_name`, `start_url`, `scope`,
  `display: standalone`, `theme_color`, `background_color`, and 192/512/maskable
  icons.
- `nuxt.config.ts` links the manifest and the Apple touch icons.
- HTTPS on `https://printy.ke`.
- `display: standalone`, so an installed copy opens without browser chrome.
- Android/desktop Chrome and Edge offer **Install app**; iOS Safari offers
  **Share -> Add to Home Screen**; Samsung Internet offers **Add page to**.

There is no service worker yet (`public/sw.js` is absent). That does not stop
the current install shortcuts, but it means there is no offline cache and some
browsers may be stricter about installability. A service worker is a separate
improvement, not a requirement for a Play Store wrapper.

## Can it go to the Play Store as-is?

No. Google Play accepts Android App Bundles (`.aab`) or APKs, not a URL or a
PWA. A PWA is published to Play by wrapping it in a **Trusted Web Activity
(TWA)**. The TWA is a thin Android shell that opens the live Printy site
full-screen and verifies domain ownership.

This is the standard route and it does not require rewriting Printy as a native
app.

### What is needed

1. A Google Play Console account (one-time registration fee).
2. A package id, for example `ke.printy.app`.
3. An Android signing key (keep it safe; Play App Signing can hold the upload
   key).
4. A TWA wrapper built from the live manifest, for example with Bubblewrap:
   ```bash
   npx @bubblewrap/cli init --manifest https://printy.ke/manifest.webmanifest
   npx @bubblewrap/cli build
   ```
   PWABuilder (https://www.pwabuilder.com) produces the same package in a web
   flow.
5. Digital Asset Links on the domain. After the signing key exists, put its
   SHA-256 fingerprint in:
   `https://printy.ke/.well-known/assetlinks.json`
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "ke.printy.app",
       "sha256_cert_fingerprints": ["AA:BB:...:ZZ"]
     }
   }]
   ```
6. Store listing: title, short/full description, 512 icon, feature graphic,
   phone screenshots, privacy policy URL, content rating, data-safety form.
7. Upload the `.aab`, run the closed test, then production.

### Before submitting

- Fix the `/track` HTTP 404 from the static host. The SPA renders, but a store
  reviewer or uptime check sees a 404 status.
- Keep `MPESA_ENV=production` and real Daraja credentials out of the review
  build until live money is intended.
- Add a privacy policy page that covers account, job, artwork and payment data.
- Decide whether the Android app should allow the buyer/manager/printer roles;
  the same web app already serves all roles.

### Recommended next step

Build the TWA with Bubblewrap, add `assetlinks.json` with the real fingerprint,
and submit through an internal/closed test track first. No application code
change is needed for the wrapper; only the domain verification file and the
Android package are new.
