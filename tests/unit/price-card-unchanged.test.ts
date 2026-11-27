import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const appDir = resolve(__dirname, '../../app')

describe('buyer price card stays the reference surface', () => {
  it('keeps the dark card tokens used by the floating next-step card', () => {
    const source = readFileSync(resolve(appDir, 'components/design/calculator/CalculatorPricePanel.vue'), 'utf8')
    expect(source).toContain('rounded-3xl border border-ink bg-ink p-6 text-paper shadow-lift sm:p-7')
    expect(source).toContain('font-mono text-[10.5px] tracking-[0.18em] text-paper/50 uppercase')
    expect(source).toContain('border-t border-paper/15 pt-4')
    expect(source).not.toMatch(/floating-next-step|Update job status/)
  })
})
