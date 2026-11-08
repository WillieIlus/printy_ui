import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

/**
 * Brand migration guard.
 *
 * The official Printy artwork lives in `public/branding` (lockups/mark/wordmark),
 * `public/favicon` (browser icons) and `public/icons` (iOS/PWA icons). These
 * assertions make sure:
 *
 * - the supplied assets are present and still vector where they should be,
 * - no component or config reaches for the retired logo/favicon/PWA files,
 * - every logo surface renders the official artwork through one component,
 * - head metadata and the web app manifest point at the new files.
 */

const ROOT = process.cwd()

const OFFICIAL_SVG = [
  'printy-logo.svg',
  'printy-logo-mono.svg',
  'printy-logo-on-dark.svg',
  'printy-mark.svg',
  'printy-mark-mono.svg',
  'printy-mark-on-dark.svg',
  'printy-wordmark.svg',
  'printy-wordmark-mono.svg',
  'printy-wordmark-on-dark.svg',
].map((name) => `public/branding/svg/${name}`)

const OFFICIAL_RASTER = [
  'public/branding/png/printy-logo.png',
  'public/branding/png/printy-mark.png',
  'public/branding/png/printy-wordmark.png',
  'public/branding/png/printy-logo-512.png',
  'public/branding/png/printy-mark-512.png',
  'public/branding/png/printy-wordmark-512.png',
  'public/branding/social/printy-social-preview.png',
]

const BROWSER_ICONS = [
  'public/favicon.ico',
  'public/favicon.svg',
  'public/favicon/favicon.ico',
  'public/favicon/favicon-16.png',
  'public/favicon/favicon-32.png',
  'public/favicon/favicon-48.png',
  'public/favicon/favicon-64.png',
  'public/favicon/favicon-128.png',
]

const PWA_ICONS = [
  'public/icons/icon-192.png',
  'public/icons/icon-512.png',
  'public/icons/icon-512-maskable.png',
  'public/icons/apple-touch-icon-152.png',
  'public/icons/apple-touch-icon-167.png',
  'public/icons/apple-touch-icon-180.png',
]

/** Retired pre-migration branding: no file and no reference may survive. */
const RETIRED_PATHS = [
  'public/assets',
  'public/assets/logo-mark',
  'public/assets/word-mark',
  'public/assets/pwa',
  'public/assets/favicons',
  'public/favicon-16x16.png',
  'public/favicon-32x32.png',
  'public/favicon-48x48.png',
  'public/icons/favicon.svg',
]

const RETIRED_REFERENCE_PATTERN = /\/assets\/(logo-mark|word-mark|pwa|favicons)\//

function read(relativePath: string): string {
  return readFileSync(path.join(ROOT, relativePath), 'utf8')
}

function vueFiles(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) return vueFiles(full)
    return full.endsWith('.vue') ? [full] : []
  })
}

const appFiles = vueFiles(path.join(ROOT, 'app'))
const nuxtConfig = read('nuxt.config.ts')
const brandModule = read('app/shared/brand.ts')
const manifest = JSON.parse(read('public/manifest.webmanifest')) as {
  name: string
  short_name: string
  theme_color: string
  background_color: string
  display: string
  icons: Array<{ src: string; sizes: string; purpose?: string }>
}
const wordmark = read('app/components/design/layout/Wordmark.vue')
const logoComponent = read('app/components/branding/PrintyLogo.vue')
const markComponent = read('app/components/workbench/ui/Mark.vue')

describe('brand: official assets are present', () => {
  it.each([...OFFICIAL_SVG, ...OFFICIAL_RASTER, ...BROWSER_ICONS, ...PWA_ICONS])('%s exists', (file) => {
    expect(existsSync(path.join(ROOT, file)), `missing ${file}`).toBe(true)
  })

  it('ships real vector artwork for every lockup, mark and wordmark', () => {
    for (const file of OFFICIAL_SVG) {
      const svg = read(file)
      expect(svg.startsWith('<svg'), file).toBe(true)
      expect(svg).toContain('viewBox=')
      expect(svg).toContain('<path')
    }
  })

  it('uses the sampled brand colours in the shipped SVGs', () => {
    expect(read('public/branding/svg/printy-logo.svg')).toContain('#e54725')
    expect(read('public/branding/svg/printy-wordmark.svg')).toContain('#404041')
  })

  it('ships the official social preview at 1200x630', () => {
    const png = readFileSync(path.join(ROOT, 'public/branding/social/printy-social-preview.png'))
    // PNG IHDR: width/height are big-endian uint32 at byte offsets 16 and 20.
    expect(png.readUInt32BE(16)).toBe(1200)
    expect(png.readUInt32BE(20)).toBe(630)
  })
})

describe('brand: retired artwork is gone', () => {
  it.each(RETIRED_PATHS)('%s does not exist', (file) => {
    expect(existsSync(path.join(ROOT, file)), `retired ${file} still exists`).toBe(false)
  })

  it('no app component or config references a retired brand path', () => {
    const offenders = [...appFiles.filter((file) => RETIRED_REFERENCE_PATTERN.test(readFileSync(file, 'utf8')))]
    for (const file of ['nuxt.config.ts', 'app/shared/brand.ts', 'public/manifest.webmanifest']) {
      if (RETIRED_REFERENCE_PATTERN.test(read(file))) offenders.push(path.join(ROOT, file))
    }
    expect(offenders).toEqual([])
  })

  it('keeps no inline copy of the pre-migration glyph', () => {
    // The old Wordmark drew its own "p" glyph by hand; the official artwork wins.
    expect(wordmark).not.toContain('M6 9V3h12v6')
  })
})

describe('brand: one component owns the logo', () => {
  it('the brand module is the single source of asset paths', () => {
    expect(brandModule).toContain("logo: '/branding/svg/printy-logo.svg'")
    expect(brandModule).toContain("mark: '/branding/svg/printy-mark.svg'")
    expect(brandModule).toContain("wordmark: '/branding/svg/printy-wordmark.svg'")
    expect(brandModule).toContain("socialPreview: '/branding/social/printy-social-preview.png'")
  })

  it('PrintyLogo resolves every variant from the official files', () => {
    expect(logoComponent).toContain('brandAsset')
    expect(logoComponent).toContain('BRAND_ASPECT')
    expect(logoComponent).toContain('versionedBrandUrl')
    expect(logoComponent).toContain("variant: 'logo'")
  })

  it('the site wordmark renders the official lockup through PrintyLogo', () => {
    expect(wordmark).toContain('branding/PrintyLogo.vue')
    expect(wordmark).toContain('<PrintyLogo')
    expect(wordmark).toContain('variant="logo"')
    expect(wordmark).toContain('responsive')
  })

  it('the legacy mark draws the official symbol instead of inline paths', () => {
    expect(markComponent).toContain('BRAND_ASSETS.mark')
    expect(markComponent).toContain('maskImage')
    expect(markComponent).not.toContain('M237.37557')
  })

  it('every logo surface imports the official artwork', () => {
    for (const file of appFiles) {
      const source = readFileSync(file, 'utf8')
      if (source.includes('branding/PrintyLogo.vue')) continue
      if (!/<PrintyLogo|<DesignWordmark|PrintyMark/.test(source)) continue
      expect(source, `${file} renders a logo without the official component`).toMatch(
        /from '.*PrintyLogo\.vue'|from '.*Wordmark\.vue'|from '.*Mark\.vue'/,
      )
    }
  })
})

describe('brand: head metadata', () => {
  it('declares the official favicon set', () => {
    expect(nuxtConfig).toContain('/favicon.svg?')
    expect(nuxtConfig).toContain('/favicon/favicon-32.png?')
    expect(nuxtConfig).toContain('/favicon/favicon-16.png?')
    expect(nuxtConfig).toContain('/favicon.ico?')
    expect(nuxtConfig).toContain("rel: 'mask-icon'")
  })

  it('declares the apple touch icons and mobile web app metadata', () => {
    expect(nuxtConfig).toContain('/icons/apple-touch-icon-180.png?')
    expect(nuxtConfig).toContain('apple-mobile-web-app-title')
    expect(nuxtConfig).toContain('apple-mobile-web-app-capable')
  })

  it('points social and structured data at the official branding', () => {
    expect(nuxtConfig).toContain('BRAND_ASSETS.socialPreview')
    expect(nuxtConfig).toContain('BRAND_ASSETS.logo')
    expect(nuxtConfig).not.toContain('/assets/word-mark')
  })

  it('long-caches brand art and keeps the manifest short-lived', () => {
    expect(nuxtConfig).toContain("'/branding/**'")
    expect(nuxtConfig).toContain('immutable')
    expect(nuxtConfig).toContain("'/manifest.webmanifest'")
    expect(nuxtConfig).toContain('must-revalidate')
  })
})

describe('brand: web app manifest', () => {
  it('uses the official name, short name and chrome colours', () => {
    expect(manifest.name).toBe('Printy')
    expect(manifest.short_name).toBe('Printy')
    expect(manifest.theme_color).toBe('#404043')
    expect(manifest.background_color).toBe('#404043')
    expect(manifest.display).toBe('standalone')
  })

  it('points at the official 192, 512 and maskable icons', () => {
    const sources = manifest.icons.map((icon) => icon.src)
    expect(sources.some((src) => src.startsWith('/icons/icon-192.png'))).toBe(true)
    expect(sources.some((src) => src.startsWith('/icons/icon-512.png'))).toBe(true)
    expect(manifest.icons.some((icon) => icon.purpose === 'maskable')).toBe(true)
    expect(sources.every((src) => src.startsWith('/icons/'))).toBe(true)
  })

  it('does not reference the retired logo or favicon folders', () => {
    expect(JSON.stringify(manifest)).not.toMatch(RETIRED_REFERENCE_PATTERN)
  })
})
