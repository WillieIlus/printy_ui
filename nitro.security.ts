// nuxt.config.ts — security headers via Nitro routeRules.
// Merge this `routeRules` block with the one in app.head.ts.

export default {
  nitro: {
    routeRules: {
      // Global secure defaults
      '/**': {
        headers: {
          // Force HTTPS for 2 years, include subdomains, allow preload list.
          'Strict-Transport-Security':
            'max-age=63072000; includeSubDomains; preload',

          // MIME-sniffing & clickjacking
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',

          // Referrer & cross-origin isolation
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Resource-Policy': 'same-site',

          // Lock down powerful browser APIs we don't need on the marketing site
          'Permissions-Policy':
            'accelerometer=(), autoplay=(), camera=(), display-capture=(), '
            + 'encrypted-media=(), fullscreen=(self), geolocation=(), '
            + 'gyroscope=(), magnetometer=(), microphone=(), midi=(), '
            + 'payment=(self), picture-in-picture=(), '
            + 'publickey-credentials-get=(self), screen-wake-lock=(), '
            + 'sync-xhr=(), usb=(), xr-spatial-tracking=()',

          // Content-Security-Policy
          // NOTE: 'unsafe-inline' on script-src is only here because Nuxt
          // inlines a tiny bootstrap. Move to nonces/hashes for full hardening.
          'Content-Security-Policy': [
            "default-src 'self'",
            "base-uri 'self'",
            "form-action 'self' https://printy.ke https://app.printy.ke",
            "frame-ancestors 'self'",
            "object-src 'none'",
            "img-src 'self' data: blob: https://*.printy.ke",
            "font-src 'self' data:",
            "style-src 'self' 'unsafe-inline'",
            "script-src 'self' 'unsafe-inline' https://*.printy.ke",
            "connect-src 'self' https://api.printy.ke https://*.printy.ke wss://*.printy.ke",
            "media-src 'self' blob:",
            "worker-src 'self' blob:",
            "manifest-src 'self'",
            "upgrade-insecure-requests",
          ].join('; '),
        },
      },

      // Long-cache static build output
      '/_nuxt/**':  { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
      '/assets/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },

      // robots / sitemap should be fresh-ish
      '/robots.txt':  { headers: { 'Cache-Control': 'public, max-age=3600' } },
      '/sitemap.xml': { headers: { 'Cache-Control': 'public, max-age=3600' } },
    },
  },
}
