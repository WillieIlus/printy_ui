/**
 * The single source of truth for Printy brand artwork and colours.
 *
 * Every logo, favicon and PWA reference in the app resolves through this module
 * so a future brand refresh only has to touch one file. The files themselves
 * live in `public/branding` (logo lockups/mark/wordmark), `public/favicon`
 * (browser icons) and `public/icons` (iOS/PWA icons) and are the official
 * assets supplied in `printy-brand-assets` - never redrawn, recoloured or
 * distorted here.
 */

export const BRAND_NAME = 'Printy'

/** Brand colours sampled from the official artwork. */
export const BRAND_COLOURS = {
  orange: '#E54725',
  charcoal: '#404043',
  white: '#FFFFFF',
  /** Browser/PWA chrome colour. */
  theme: '#404043',
  /** PWA splash colour behind the installed icon. */
  background: '#404043',
} as const

/**
 * Cache-busting version for the small, frequently-cached identity files
 * (favicons, manifest). Immutable art under /branding, /icons and the PNG
 * favicons is long-cached, so bump this when a file changes in place.
 */
export const BRAND_ASSET_VERSION = '4'

export const BRAND_ASSETS = {
  /** Horizontal symbol + wordmark lockup (light backgrounds). */
  logo: '/branding/svg/printy-logo.svg',
  /** Standalone symbol. */
  mark: '/branding/svg/printy-mark.svg',
  /** Standalone wordmark. */
  wordmark: '/branding/svg/printy-wordmark.svg',
  /** Single-colour lockup for one-colour printing/embossing. */
  logoMono: '/branding/svg/printy-logo-mono.svg',
  markMono: '/branding/svg/printy-mark-mono.svg',
  wordmarkMono: '/branding/svg/printy-wordmark-mono.svg',
  /** Raster exports, used by email/social pipelines that cannot take SVG. */
  logoPng: '/branding/png/printy-logo.png',
  markPng: '/branding/png/printy-mark.png',
  wordmarkPng: '/branding/png/printy-wordmark.png',
  /** 1200x630 Open Graph / Twitter card. */
  socialPreview: '/branding/social/printy-social-preview.png',
} as const

export type BrandAsset = keyof typeof BRAND_ASSETS
export type BrandVariant = 'logo' | 'mark' | 'wordmark'

/** Native viewBox aspect (width / height) of each official SVG. */
export const BRAND_ASPECT: Record<BrandVariant, number> = {
  logo: 128.388 / 47.124,
  mark: 36.269 / 47.124,
  wordmark: 88.455 / 31.912,
}

/** Resolve the official artwork for a variant/tone combination. */
export function brandAsset(variant: BrandVariant, tone: 'brand' | 'mono' = 'brand'): string {
  if (tone === 'mono') {
    return BRAND_ASSETS[`${variant}Mono` as BrandAsset]
  }
  return BRAND_ASSETS[variant]
}

/** Versioned URL for the small identity files served with a short cache. */
export function versionedBrandUrl(path: string): string {
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}v=${BRAND_ASSET_VERSION}`
}
