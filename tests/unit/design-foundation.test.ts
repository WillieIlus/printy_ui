import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const designCssDir = resolve(__dirname, '../../app/assets/css/design')
const mainCssPath = resolve(__dirname, '../../app/assets/css/main.css')
const fontsDir = resolve(__dirname, '../../app/assets/fonts/design')

const designSourceFiles = ['tokens.css', 'utilities.css', 'fonts.css'] as const

/**
 * Legacy printy_ui `--p-*` custom properties that must keep being declared in
 * app/assets/css/main.css until every workbench view has been migrated to the
 * design tokens. Hard-coded list on purpose: if a legacy var is dropped, the
 * Phase 1 guard fails instead of silently changing the look of old views.
 */
const legacyPrintyVars = [
  '--p-font-body',
  '--p-font-heading',
  '--radius-control',
  '--radius-panel',
  '--radius-showcase',
  '--shadow-control',
  '--shadow-panel',
  '--shadow-modal',
  '--p-bg',
  '--p-bg-soft',
  '--p-surface',
  '--p-surface-soft',
  '--p-surface-dark',
  '--p-text',
  '--p-text-muted',
  '--p-text-soft',
  '--p-border',
  '--p-border-strong',
  '--p-primary',
  '--p-primary-hover',
  '--p-primary-border',
  '--p-secondary',
  '--p-secondary-hover',
  '--p-secondary-soft',
  '--p-secondary-dark',
  '--p-success',
  '--p-success-soft',
  '--p-error',
  '--p-error-soft',
  '--p-warning',
  '--p-warning-soft',
  '--p-info',
  '--p-info-soft',
  '--p-calculator-bg',
  '--p-calculator-surface',
  '--p-calculator-text',
  '--p-calculator-muted',
  '--p-calculator-border',
  '--p-whatsapp',
  '--p-whatsapp-hover',
  '--p-text-on-dark',
  '--p-text-on-dark-muted',
  '--p-text-on-dark-soft',
  '--p-soft-shadow',
  '--p-soft-shadow-inset',
] as const

describe('Design foundation (Phase 1)', () => {
  it('keeps the design token, utility and font source files present', () => {
    for (const file of designSourceFiles) {
      expect(existsSync(resolve(designCssDir, file)), `${file} should exist`).toBe(true)
    }
  })

  it('keeps every legacy --p-* variable declared in printy main.css', () => {
    const mainCss = readFileSync(mainCssPath, 'utf8')
    for (const name of legacyPrintyVars) {
      expect(
        mainCss,
        `${name} should stay declared in app/assets/css/main.css until migration completes`,
      ).toMatch(new RegExp(`${name}\\s*:`))
    }
  })

  it.each(designSourceFiles)('design source file %s contains no remote http(s) URLs', (file) => {
    const css = readFileSync(resolve(designCssDir, file), 'utf8')
    const urls = Array.from(css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g), (m) => m[1])
    for (const url of urls) {
      // data: URIs are local inline assets; remote references are not allowed.
      expect(
        /^data:/i.test(url) || !/^https?:/i.test(url),
        `${file} should not load remote assets: ${url}`,
      ).toBe(true)
    }
    expect(css).not.toMatch(/@import\s+url\(/i)
  })

  it('design fonts.css references bundled font files that exist', () => {
    const fontsCss = readFileSync(resolve(designCssDir, 'fonts.css'), 'utf8')
    const urls = Array.from(fontsCss.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g), (m) => m[1])
    expect(urls.length).toBeGreaterThan(0)
    for (const url of urls) {
      const fontPath = resolve(designCssDir, url)
      expect(existsSync(fontPath), `font file referenced by fonts.css should exist: ${url}`).toBe(true)
    }
  })

  it('design bundled font files exist on disk', () => {
    expect(
      existsSync(resolve(fontsDir, 'Aglet-Sans-Regular-iF66695ff67c970.ttf')),
    ).toBe(true)
  })
})
