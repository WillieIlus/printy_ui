import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

/**
 * Phase 1f (S1-10..S1-14): the app must render with the design fonts bundled
 * under app/assets/fonts/design, and no font may be fetched from a remote host.
 *
 * Node fs only: no component mounting, no browser.
 */

const ROOT = process.cwd()
const FONTS_CSS_PATH = path.join(ROOT, 'app/assets/css/design/fonts.css')
const TOKENS_CSS_PATH = path.join(ROOT, 'app/assets/css/design/tokens.css')
const MAIN_CSS_PATH = path.join(ROOT, 'app/assets/css/main.css')
const NUXT_CONFIG_PATH = path.join(ROOT, 'nuxt.config.ts')

/** Families that only exist in the design source. */
const DESIGN_FAMILIES = ['AgletSansVF', 'Montserrat']

/**
 * Printy font tokens that carry a literal family stack (so a "first family"
 * exists). --font-sans is an alias of --font-body and is checked separately.
 */
const PRINTY_FONT_TOKENS = [
  '--font-body',
  '--font-heading',
  '--font-accent',
  '--font-display',
  '--font-mono2',
  '--p-font-body',
  '--p-font-heading',
  '--font-mono',
]

function read(filePath: string): string {
  return readFileSync(filePath, 'utf8')
}

/** First family of a custom-property declaration, quotes stripped. */
function firstFamily(css: string, token: string): string | null {
  const line = css
    .split(/\r?\n/)
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${token}:`))
  if (!line) return null
  const value = line.slice(token.length + 1).trim().replace(/;\s*$/, '')
  return value.split(',')[0]!.trim().replace(/^["']|["']$/g, '')
}

interface FontFaceBlock {
  family: string
  urls: string[]
  formats: string[]
}

function fontFaces(css: string): FontFaceBlock[] {
  const blocks: FontFaceBlock[] = []
  const matcher = /@font-face\s*\{([\s\S]*?)\}/g
  let match: RegExpExecArray | null
  while ((match = matcher.exec(css)) !== null) {
    const body = match[1]!
    const family = /font-family:\s*"([^"]+)"/.exec(body)?.[1] ?? ''
    const urls = [...body.matchAll(/url\("([^"]+)"\)/g)].map((m) => m[1]!)
    const formats = [...body.matchAll(/format\("([^"]+)"\)/g)].map((m) => m[1]!)
    blocks.push({ family, urls, formats })
  }
  return blocks
}

const fontsCss = read(FONTS_CSS_PATH)
const tokensCss = read(TOKENS_CSS_PATH)
const mainCss = read(MAIN_CSS_PATH)
const nuxtConfig = read(NUXT_CONFIG_PATH)

describe('design fonts: token mapping', () => {
  it.each(PRINTY_FONT_TOKENS)('%s resolves to a design family first', (token) => {
    const family = firstFamily(mainCss, token) ?? firstFamily(tokensCss, token)
    expect(family, `token ${token} is not declared`).not.toBeNull()
    expect(DESIGN_FAMILIES).toContain(family)
  })

  it('--font-sans stays an alias of --font-body', () => {
    expect(firstFamily(mainCss, '--font-sans')).toBe('var(--font-body)')
  })

  it('every design family is declared by @font-face and used by a token', () => {
    const declared = new Set(fontFaces(fontsCss).map((face) => face.family))
    expect([...declared].sort()).toEqual(['AgletSansVF', 'Montserrat'])

    for (const family of DESIGN_FAMILIES) {
      const tokenLines = `${mainCss}\n${tokensCss}`
        .split(/\r?\n/)
        .filter((line) => /^\s*--(p-)?font-[\w-]+:/.test(line))
        .join('\n')
      expect(tokenLines).toContain(`"${family}"`)
    }
  })
})

describe('design fonts: @font-face sources', () => {
  const faces = fontFaces(fontsCss)

  it('declares every bundled design font file', () => {
    const urls = faces.flatMap((face) => face.urls)
    expect(urls.length).toBe(16)
  })

  it('every referenced font file exists on disk', () => {
    const baseDir = path.dirname(FONTS_CSS_PATH)
    for (const url of faces.flatMap((face) => face.urls)) {
      const resolved = path.resolve(baseDir, url)
      expect(existsSync(resolved), `missing font file: ${url}`).toBe(true)
    }
  })

  it('declared formats match the file extensions', () => {
    const expected: Record<string, string> = {
      '.ttf': 'truetype',
      '.woff2': 'woff2',
      '.woff': 'woff',
      '.otf': 'opentype',
    }
    for (const face of faces) {
      for (const url of face.urls) {
        const ext = path.extname(url).toLowerCase()
        expect(face.formats).toContain(expected[ext] ?? ext)
      }
    }
  })

  it('every @font-face has a family and a source', () => {
    for (const face of faces) {
      expect(face.family.length).toBeGreaterThan(0)
      expect(face.urls.length).toBeGreaterThan(0)
    }
  })
})

describe('design fonts: no remote sources', () => {
  it('font CSS contains no remote URL', () => {
    for (const css of [fontsCss, tokensCss]) {
      expect(css).not.toMatch(/https?:\/\//)
    }
  })

  it('main.css no longer imports or links a remote font host', () => {
    expect(mainCss).not.toMatch(/fonts\.googleapis\.com/)
    expect(mainCss).not.toMatch(/fonts\.gstatic\.com/)
    expect(mainCss).not.toMatch(/@import\s+url\(/)
  })

  it('nuxt.config.ts references no remote font host', () => {
    expect(nuxtConfig).not.toMatch(/fonts\.googleapis\.com/)
    expect(nuxtConfig).not.toMatch(/fonts\.gstatic\.com/)
  })

  it('no family is still requested from the old remote pair', () => {
    const remoteOnly = /font-family:\s*"?\s*(Space Grotesk|IBM Plex Mono)"?\s*(,|;)/
    expect(remoteOnly.test(fontsCss)).toBe(false)
  })
})
