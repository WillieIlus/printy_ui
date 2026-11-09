import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

/**
 * Phase 12 (P12-05 / P12-07): design accessibility structure checks.
 *
 * Source-level assertions over the design-adopted files only (no behaviour
 * tests here: keyboard/focus behaviour needs a browser, which is logged under
 * TOOLING in the phase ledger).
 */

const designDir = resolve(__dirname, '../../app/components/design')
const readDesign = (rel: string) => readFileSync(resolve(designDir, rel), 'utf8')
const designBaseCss = readFileSync(resolve(__dirname, '../../app/assets/css/design/base.css'), 'utf8')
const workspaceShellSource = readDesign('layout/WorkspaceShell.vue')

describe('Design accessibility (Phase 12 P12-05/P12-07)', () => {
  it('design base defines a visible focus-visible ring from tokens', () => {
    expect(designBaseCss).toContain(':focus-visible')
    expect(designBaseCss).toContain('outline: 2px solid var(--color-brand)')
  })

  it('design base reduces motion for prefers-reduced-motion', () => {
    expect(designBaseCss).toContain('prefers-reduced-motion')
    expect(designBaseCss).toContain('scroll-behavior: auto')
  })

  it('workspace skip link becomes visible on keyboard focus', () => {
    expect(workspaceShellSource).toContain('design-skip-link')
  })

  it('design mobile nav keeps a 44px minimum tap target', () => {
    expect(workspaceShellSource).toContain('min-h-11')
  })

  it('design calculator quantity input keeps a visible focus style', () => {
    const source = readDesign('calculator/DesignCalculatorMinimal.vue')
    expect(source).not.toContain('outline-none')
  })

  it('design tracker job code input keeps a visible focus style', () => {
    const source = readDesign('tracker/TrackJobPrompt.vue')
    expect(source).not.toContain('outline-none')
  })
})
