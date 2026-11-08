import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import path from 'node:path'

/**
 * Phase 1f (S1-20..S1-23): the design adoption keeps the ORIGINAL Printy logo.
 *
 * - Design layouts/components may not reference a design logo asset or the
 *   recreated design glyph; they must use the original brand mark.
 * - Every original logo / favicon / PWA / wordmark file is byte-identical to
 *   PRE_SNAPSHOT_SHA 2938d99ac29c1930513f1f5e160116214726cd82.
 *
 * Node fs only: no component mounting.
 */

const ROOT = process.cwd()

/** The logo the original app renders: layouts/default.vue uses <Mark />. */
const ORIGINAL_LOGO_COMPONENT = 'app/components/workbench/ui/Mark.vue'

/** Recreated logo glyph that the design source drew by hand (must be gone). */
const DESIGN_GLYPH_PATH = 'M6 9V3h12v6'

/** Design-only logo locations that must never be referenced. */
const DESIGN_LOGO_PATTERNS = [
  /\/images\/design\/[^"']*logo/i,
  /\/assets\/images\/design\//i,
  /\/assets\/icons\/design\//i,
  /design[-_]logo/i,
]

/**
 * sha256 of each original brand file at PRE_SNAPSHOT_SHA. Text files (.svg,
 * .webmanifest) are hashed with CRLF normalised to LF so the values are
 * identical on Windows and Linux checkouts; binaries are hashed as-is.
 */
const ORIGINAL_BRAND_SHA256: Record<string, string> = {
  'public/assets/favicons/favicon.svg': 'c8adeee43ef7d377cefe8801f3091b70d1d16c58205886c2e292d1705e7d3b1a',
  'public/assets/logo-mark/dark/printy-logo-mark-01-128.png': 'cac549e826127e60c65fe0b7dde5572b2e4b108539aa725553a1405527b56a66',
  'public/assets/logo-mark/dark/printy-logo-mark-01-16.png': 'cc08d0e35f05d5128f485a981e6af300545233bf161d21b80e7371070eff5276',
  'public/assets/logo-mark/dark/printy-logo-mark-01-180.png': 'caea615feba29383c722f2a19db60e4b942e662f7fe2642f3e9646ec6c753986',
  'public/assets/logo-mark/dark/printy-logo-mark-01-192.png': '29b4f480504cc4988c7b62bdbef68009ede8fa65744fb5aae59656a041a93fa4',
  'public/assets/logo-mark/dark/printy-logo-mark-01-256.png': '4d5b64c38cd485331a396cf57dd5327c5b1b1dcd0ede98f676fb67302dea282e',
  'public/assets/logo-mark/dark/printy-logo-mark-01-32.png': 'ae64121771ab6958fab93b302c2449a4760e02ade20b0ae0090f809839032241',
  'public/assets/logo-mark/dark/printy-logo-mark-01-48.png': 'b47785835435cd6e4d6071f578747e00f7a0b5c8f3ced5cd7f82657b479cbb8e',
  'public/assets/logo-mark/dark/printy-logo-mark-01-512.png': 'd49f42b06570699552f77224dbe81ada6016b4c056047d8905381aaeb6d56dd1',
  'public/assets/logo-mark/dark/printy-logo-mark-01-64.png': 'a05fe6a1c857018257e6da49e561cdbd2b8de1c29449e7b5aed66ceba810a618',
  'public/assets/logo-mark/dark/printy-logo-mark-01-96.png': '57d7ffb6c7b4b379c10a21c9c1cf5e2eb9234f0c7defeb72959a0bf0354a5d8a',
  'public/assets/logo-mark/dark/printy-logo-mark-01.svg': '4c55cff9dc4880d0d05d63e49fa7d832d735f06a135fbd765bf53eef04559f77',
  'public/assets/logo-mark/dark/printy-logo-mark-02.svg': '2cfdb7ee369ac8b90dce5d4043bb7421a550220e849a6d2a34d84354a205ebb5',
  'public/assets/logo-mark/light/printy-logo-mark-01.svg': '24e8f6396dfe96acc3ebfb968055dbc0c35424e1d69f32abd87f94a29aa2ca2f',
  'public/assets/logo-mark/light/printy-logo-mark-02-128.png': '60f409e7745025ebbc25391e445c682209335d81aa8e434a5947c9a1713be8e2',
  'public/assets/logo-mark/light/printy-logo-mark-02-16.png': '9b0ed4fc87b636de52beefa1521183760b54b94326f18de525f3c2c4e3620a50',
  'public/assets/logo-mark/light/printy-logo-mark-02-180.png': '24ff004a4057ffa62f0f19efba1f4390ae17e269956cd047566808055fd6345d',
  'public/assets/logo-mark/light/printy-logo-mark-02-192.png': '8222fbb68a876c188ea86f805c0a6ed7bf996694976f0125fa02fedfa43683cf',
  'public/assets/logo-mark/light/printy-logo-mark-02-256.png': '882792322b97a5eee7893a330408dea4af75be7182ed075b2199ecf8b94cd48a',
  'public/assets/logo-mark/light/printy-logo-mark-02-32.png': 'e012b9c572379ade9760c960dd5f974d4441fbdb811c7812be53ec8b218535ea',
  'public/assets/logo-mark/light/printy-logo-mark-02-48.png': '6c313bd0437500627076833ce30555943fa1838de0f6099dea0984647db7c708',
  'public/assets/logo-mark/light/printy-logo-mark-02-512.png': '0f07b1b0f341238a4c714bad0f8204ce0f27877955be9f505df1ebab890cebd6',
  'public/assets/logo-mark/light/printy-logo-mark-02-64.png': '809f06efe134a36fa3a664fb3a1adcaaa18f8fe0286d845e61a8dc7c6af1407c',
  'public/assets/logo-mark/light/printy-logo-mark-02-96.png': '254cbea5a541c3a87dbd84d6bad0ccb13e0ea64830fd909c3432a859b1c1e6b1',
  'public/assets/logo-mark/light/printy-logo-mark-02.svg': '8fd157a3f6f1cb253ddd471f2bb6a0c4ffbe637797ce6875115f1a9621df4ac6',
  'public/assets/pwa/dark/apple-touch-icon.png': 'fed92bdaba8dd44497dd611554cc8a4a2a8d72f8038b28cee8ed9fc91f9ee1bd',
  'public/assets/pwa/dark/pwa-192.png': 'dc7a50f8cb41b388bcf9aa4d09324747d8bbe1de35a7e90a546cb7c5dc8cc261',
  'public/assets/pwa/dark/pwa-512.png': 'b010e5f4726db7887f1c08d79288246b53215ca68b031c9500f181795867d4b7',
  'public/assets/pwa/dark/pwa-maskable-192.png': 'd1a3d552b3d95b1d97d190b9ee4b9ad8fca881c9126750d3f9127e2996d4ca6c',
  'public/assets/pwa/dark/pwa-maskable-512.png': '5897760cfe27f56cc465508d78e2478b08778a32dfa1716c26fe144c23fc2445',
  'public/assets/pwa/light/apple-touch-icon.png': '3ba6089bb6f3689643c2a365f4d50178369445c014a5d5b09499231e54cc1463',
  'public/assets/pwa/light/pwa-192.png': '4a09d717b7868e085e6fdea5f895421def66aa718ea2fb6fe745bfc7b91e34db',
  'public/assets/pwa/light/pwa-512.png': '2bf145f8426ddb30a5d9e3f6de9e58ad39205f8fa57fbd0849add17627d75d0c',
  'public/assets/word-mark/dark/printy-word-mark-03-w1024.png': '1df91e9ee91389300edf77867c7c57343ff9aeed621706d0c17bcf856b008d88',
  'public/assets/word-mark/dark/printy-word-mark-03-w256.png': '805e6505aa18c47b50a00913d75b8562ccd83b0ce9556ee754c60f445b05ef1c',
  'public/assets/word-mark/dark/printy-word-mark-03-w512.png': 'bb5e7c94082cc4668e4e07b70adc1d9a4c8f0ea1fbc124d557f60a10683c9676',
  'public/assets/word-mark/dark/printy-word-mark-03.svg': '0e12c4c9476ad23e3640a78b631a29a586357d77b69e3c1e3bff273dd306037b',
  'public/assets/word-mark/dark/printy-word-mark-04.svg': 'b83568528e1684e855ffef1948dd5e636ee0b8949a07c35ec2276e84c02705a0',
  'public/assets/word-mark/light/printy-word-mark-03.svg': '31eae7889546515688f9ba31f0ada287d513dce8d6ee90c2ecbbc3465757a060',
  'public/assets/word-mark/light/printy-word-mark-04-w1024.png': 'ea98106ddb53f97cdea66e7e878854b1526665fba85a666f91349d367f4072f8',
  'public/assets/word-mark/light/printy-word-mark-04-w256.png': '58c97ced45d9e2c9297df1b75a9730da0ce36779c7982b967b426fba214923be',
  'public/assets/word-mark/light/printy-word-mark-04-w512.png': '77cefcdc5e479f4f25deb52eca86955ff234f90e8f299fc8ca0de0216a8e440e',
  'public/assets/word-mark/light/printy-word-mark-04.svg': '52d23037b81a20a58d0ca137d42b4bbe3dad0c6c7680cecd82df3decfa0606f7',
  'public/manifest.webmanifest': 'a8c3c19ce816fd3f6b82896aaa5398cc2149d3896ce967468db25e6a360f97dc',
}

const TEXT_EXTENSIONS = new Set(['.svg', '.webmanifest', '.json', '.txt'])

function brandFileSha256(relativePath: string): string {
  const bytes = readFileSync(path.join(ROOT, relativePath))
  const normalised = TEXT_EXTENSIONS.has(path.extname(relativePath).toLowerCase())
    ? Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n'), 'utf8')
    : bytes
  return createHash('sha256').update(normalised).digest('hex')
}

function vueFiles(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) return vueFiles(full)
    return full.endsWith('.vue') ? [full] : []
  })
}

const designLayouts = readdirSync(path.join(ROOT, 'app/layouts'))
  .filter((entry) => entry.startsWith('design-') && entry.endsWith('.vue'))
  .map((entry) => path.join(ROOT, 'app/layouts', entry))
const designComponents = vueFiles(path.join(ROOT, 'app/components/design'))
const wordmarkSource = readFileSync(
  path.join(ROOT, 'app/components/design/layout/Wordmark.vue'),
  'utf8',
)
const nuxtConfig = readFileSync(path.join(ROOT, 'nuxt.config.ts'), 'utf8')

describe('design logo: original mark is used', () => {
  it('the original logo component exists', () => {
    expect(existsSync(path.join(ROOT, ORIGINAL_LOGO_COMPONENT))).toBe(true)
  })

  it('the design wordmark renders the original Mark component', () => {
    expect(wordmarkSource).toContain('workbench/ui/Mark.vue')
    expect(wordmarkSource).toContain('<PrintyMark')
  })

  it('the recreated design glyph is gone', () => {
    expect(wordmarkSource).not.toContain(DESIGN_GLYPH_PATH)
    for (const file of [...designLayouts, ...designComponents]) {
      expect(readFileSync(file, 'utf8'), file).not.toContain(DESIGN_GLYPH_PATH)
    }
  })

  it('no design layout or component references a design logo asset', () => {
    for (const file of [...designLayouts, ...designComponents]) {
      const source = readFileSync(file, 'utf8')
      for (const pattern of DESIGN_LOGO_PATTERNS) {
        expect(pattern.test(source), `${file} matches ${pattern}`).toBe(false)
      }
    }
  })
})

describe('design logo: original brand files are intact', () => {
  const entries = Object.entries(ORIGINAL_BRAND_SHA256)

  it('covers 44 original brand files', () => {
    expect(entries.length).toBe(44)
  })

  it.each(entries)('%s is byte-identical to PRE_SNAPSHOT_SHA', (relativePath, expected) => {
    expect(existsSync(path.join(ROOT, relativePath)), `missing ${relativePath}`).toBe(true)
    expect(brandFileSha256(relativePath)).toBe(expected)
  })

  it('the design logo files are left on disk, unreferenced', () => {
    expect(existsSync(path.join(ROOT, 'public/images/design'))).toBe(true)
  })
})

describe('design logo: head meta is unchanged', () => {
  it('keeps the original favicon, apple-touch, manifest and og:image paths', () => {
    expect(nuxtConfig).toContain('/assets/favicons/favicon.svg')
    expect(nuxtConfig).toContain('/assets/logo-mark/dark/printy-logo-mark-01-32.png')
    expect(nuxtConfig).toContain('/assets/logo-mark/dark/printy-logo-mark-01-16.png')
    expect(nuxtConfig).toContain('/assets/pwa/dark/apple-touch-icon.png')
    expect(nuxtConfig).toContain('/manifest.webmanifest')
    expect(nuxtConfig).toContain('/assets/word-mark/dark/printy-word-mark-03-w1024.png')
  })

  it('keeps the JSON-LD logo on the original word-mark', () => {
    expect(nuxtConfig).toContain('/assets/word-mark/dark/printy-word-mark-04.svg')
  })
})
