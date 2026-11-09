import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

/**
 * Phase 12 (P12-06): design contrast audit.
 *
 * Reads the design token values from app/assets/css/design (base + tokens) and
 * checks the declared text/background pairs against WCAG 2.1 AA
 * (4.5:1 for normal text, 3.0:1 for large text).
 *
 * Token values themselves are never modified by a phase (MASTER_RULES); a pair
 * that fails is either fixed by switching the usage to another existing token,
 * or logged as DECISION NEEDED when the token palette itself cannot satisfy it.
 */

const designCssDir = resolve(__dirname, '../../app/assets/css/design')
const DESIGN_BASE_CSS_PATH = resolve(designCssDir, 'base.css')
const DESIGN_TOKENS_CSS_PATH = resolve(designCssDir, 'tokens.css')

/** Design colour tokens as declared outside `[data-role]` scopes (the default
 *  design values); scoped role overrides are applied by the consuming components
 *  through the same token names. */
function readDesignTokens(): Record<string, string> {
  let css = readFileSync(DESIGN_BASE_CSS_PATH, 'utf8') + '\n' + readFileSync(DESIGN_TOKENS_CSS_PATH, 'utf8')
  css = css.replace(/\[data-role="[^"]+"\]\s*\{[^}]*\}/g, '')
  const tokens: Record<string, string> = {}
  const pattern = /--([\w-]+)\s*:\s*([^;]+);/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(css)) !== null) {
    const name = match[1]
    if (!name.startsWith('color-')) continue
    const hex = match[2].trim().match(/^#([0-9a-fA-F]+)$/)
    if (!hex) continue
    let digits = hex[1]
    if (digits.length === 3) digits = digits.split('').map((c) => c + c).join('')
    if (digits.length !== 6) continue
    tokens[name] = `#${digits.toLowerCase()}`
  }
  return tokens
}

function toHex(value: string | undefined): string | null {
  if (!value) return null
  const match = value.trim().match(/^#([0-9a-fA-F]+)$/)
  if (!match) return null
  let digits = match[1]
  if (digits.length === 3) digits = digits.split('').map((c) => c + c).join('')
  if (digits.length !== 6) return null
  return `#${digits.toLowerCase()}`
}

function luminance(hex: string): number {
  const value = hex.replace('#', '')
  const channel = (index: number) => parseInt(value.slice(index, index + 2), 16) / 255
  const linear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  const r = linear(channel(0))
  const g = linear(channel(2))
  const b = linear(channel(4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(fg: string, bg: string): number {
  const light = luminance(fg)
  const dark = luminance(bg)
  const hi = Math.max(light, dark)
  const lo = Math.min(light, dark)
  return (hi + 0.05) / (lo + 0.05)
}

function expectAa(name: string, fgHex: string, bgToken: string, min: number) {
  const bg = toHex(readDesignTokens()[bgToken])
  expect(bg, `${name}: background token ${bgToken} should resolve to a hex value`).not.toBeNull()
  const ratio = contrastRatio(fgHex, bg as string)
  expect(
    ratio,
    `${name}: contrast ratio ${ratio.toFixed(2)}:1 should be at least ${min}:1 (WCAG AA)`,
  ).toBeGreaterThanOrEqual(min)
}

describe('Design contrast (Phase 12 P12-06)', () => {
  const tokens = readDesignTokens()

  it('reads the design colour tokens from the design stylesheets', () => {
    expect(tokens['color-paper']).toBe('#f6f2e7')
    expect(tokens['color-ink']).toBe('#1a1712')
    expect(tokens['color-card']).toBe('#fdfbf4')
    expect(tokens['color-ink-2']).toBe('#565043')
    expect(tokens['color-brand']).toBe('#0e7c5f')
    expect(tokens['color-brand-deep']).toBe('#093d30')
    expect(tokens['color-mint']).toBe('#dfeee2')
    expect(tokens['color-green']).toBe('#0f5d63')
    expect(tokens['color-green-soft']).toBe('#dceced')
    expect(tokens['color-red']).toBe('#9d1c17')
    expect(tokens['color-red-soft']).toBe('#f7dedb')
  })

  it('meets WCAG AA for primary text on design surfaces', () => {
    expectAa('primary text ink on paper', '#1a1712', 'color-paper', 4.5)
    expectAa('primary text ink on card', '#1a1712', 'color-card', 4.5)
    expectAa('primary text ink on paper-2', '#1a1712', 'color-paper-2', 4.5)
  })

  it('meets WCAG AA for secondary text on design surfaces', () => {
    expectAa('secondary text ink-2 on paper', '#565043', 'color-paper', 4.5)
    expectAa('secondary text ink-2 on card', '#565043', 'color-card', 4.5)
    expectAa('secondary text ink-2 on mint', '#565043', 'color-mint', 4.5)
  })

  it('meets WCAG AA for brand-led text and call-to-action text', () => {
    expectAa('brand-deep text on mint', '#093d30', 'color-mint', 4.5)
    expectAa('CTA text paper on brand-deep', '#f6f2e7', 'color-brand-deep', 4.5)
    expectAa('white text on brand-deep', '#ffffff', 'color-brand-deep', 4.5)
  })

  it('meets WCAG AA for status text on status surfaces', () => {
    expectAa('status delivered green on green-soft', '#0f5d63', 'color-green-soft', 4.5)
    expectAa('status late red on red-soft', '#9d1c17', 'color-red-soft', 4.5)
    expectAa('status ontrack on ontrack-soft', '#6f8212', 'color-ontrack-soft', 3)
  })
})
