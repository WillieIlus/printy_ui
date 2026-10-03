import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import {
  PAPER_QUALITY_TIERS,
  paperQualityChoices,
  paperQualitySummary,
  selectedPaperQuality,
  supportsPaperQuality,
} from '~/shared/paper-quality'
import type { CalculatorConfig, CalculatorProductConfig } from '~/shared/calculator-config'
import { buildPublicPreviewPayload, type CalculatorSpec } from '~/shared/calculator-spec'
import { calculatorFixture } from './calculator-fixture'

const ROOT = path.resolve(process.cwd())

function product(key: string, overrides: Partial<CalculatorProductConfig> = {}): CalculatorProductConfig {
  return {
    key,
    label: key,
    required_fields: [],
    optional_fields: [],
    defaults: {},
    allowed_paper_categories: [],
    allow_custom_size: false,
    allow_custom_paper_request: true,
    fields: [],
    ...overrides,
  }
}

function configWith(products: CalculatorProductConfig[]): CalculatorConfig {
  return {
    products,
    paper_categories: [
      { value: 'matt', label: 'Matt' },
      { value: 'ivory', label: 'Ivory' },
      { value: 'artcard', label: 'Art Card' },
      { value: 'tictac', label: 'Tictac' },
      { value: 'conqueror', label: 'Conqueror' },
      { value: 'bond', label: 'Bond' },
      { value: 'gloss', label: 'Gloss' },
      { value: 'special', label: 'Special Paper' },
      { value: 'other', label: 'Other' },
    ],
    finishings: [],
    sizes: {},
    print_sides: [],
    color_modes: [],
  }
}

/** Mirrors the real backend's `allowed_paper_categories` per product. */
const REAL_ALLOWED: Record<string, string[]> = {
  business_card: ['artcard', 'matt', 'gloss', 'ivory', 'special', 'other'],
  flyer: ['matt', 'gloss', 'bond', 'ivory', 'special', 'other'],
  label_sticker: ['tictac', 'special', 'other'],
  letterhead: ['bond', 'conqueror', 'ivory', 'special', 'other'],
}

const businessCard = (allowed = REAL_ALLOWED.business_card) => product('business_card', { allowed_paper_categories: allowed })
const flyer = (allowed = REAL_ALLOWED.flyer) => product('flyer', { allowed_paper_categories: allowed })

describe('client-facing paper quality tiers', () => {
  it('never uses "Cheap" and keeps the documented ladder order', () => {
    expect([...PAPER_QUALITY_TIERS]).toEqual(['Budget', 'Economy', 'Standard', 'Professional', 'Premium'])
    const labels = [businessCard(), flyer()].flatMap((p) => paperQualityChoices(p, configWith([p])).map((c) => c.label))
    expect(labels.some((l) => l.toLowerCase() === 'cheap')).toBe(false)
  })

  it('maps flyer weights exactly: 115 Budget, 130 Economy, 150 Standard, 170 Premium', () => {
    const choices = paperQualityChoices(flyer(), configWith([flyer()]))
    expect(choices.map((c) => [c.tier, c.gsm])).toEqual([
      ['Budget', 115],
      ['Economy', 130],
      ['Standard', 150],
      ['Premium', 170],
    ])
  })

  it('maps the configured card stock exactly: 250 Economy, 300 Standard, 350 Professional, Ivory 300 Premium', () => {
    const choices = paperQualityChoices(businessCard(), configWith([businessCard()]))
    expect(choices.map((c) => [c.tier, c.sub])).toEqual([
      ['Economy', 'Matte 250 GSM'],
      ['Standard', 'Matte 300 GSM'],
      ['Professional', 'Matte 350 GSM'],
      ['Premium', 'Ivory 300 GSM'],
    ])
    expect(choices.find((c) => c.tier === 'Premium')?.category).toBe('ivory')
  })

  it('does not force all four levels onto every product', () => {
    const cardTiers = paperQualityChoices(businessCard(), configWith([businessCard()])).map((c) => c.tier)
    const flyerTiers = paperQualityChoices(flyer(), configWith([flyer()])).map((c) => c.tier)
    expect(cardTiers).not.toContain('Budget')
    expect(flyerTiers).not.toContain('Professional')
  })

  it('shows technical detail as secondary text, never as the primary label', () => {
    for (const p of [businessCard(), flyer()]) {
      for (const choice of paperQualityChoices(p, configWith([p]))) {
        expect(choice.label).toMatch(/^(Budget|Economy|Standard|Professional|Premium)$/)
      }
    }
    const standard = paperQualityChoices(businessCard(), configWith([businessCard()])).find((c) => c.tier === 'Standard')
    expect(paperQualitySummary(standard!)).toBe('Standard \u00b7 Matte 300 GSM')
  })
})

describe('paper quality only offers what a product actually supports', () => {
  it('drops tiers whose category the live config no longer allows', () => {
    const withoutIvory = businessCard(['matt', 'artcard', 'gloss'])
    const choices = paperQualityChoices(withoutIvory, configWith([withoutIvory]))
    expect(choices.map((c) => c.tier)).toEqual(['Economy', 'Standard', 'Professional'])
    expect(choices.some((c) => c.category === 'ivory')).toBe(false)
  })

  it('falls back to the config category names for products with no tiers', () => {
    const sticker = product('label_sticker', { allowed_paper_categories: REAL_ALLOWED.label_sticker })
    const choices = paperQualityChoices(sticker, configWith([sticker]))
    expect(choices.map((c) => c.label)).toEqual(['Tictac', 'Special Paper', 'Other'])
    expect(choices.every((c) => c.tier === '' && c.gsm === 0)).toBe(true)
  })

  it('offers untiered products only their own categories', () => {
    const letterhead = product('letterhead', { allowed_paper_categories: REAL_ALLOWED.letterhead })
    expect(paperQualityChoices(letterhead, configWith([letterhead])).map((c) => c.category))
      .toEqual(['bond', 'conqueror', 'ivory', 'special', 'other'])
  })

  it('returns nothing for products without a paper category step', () => {
    expect(supportsPaperQuality(product('large_format'))).toBe(false)
    expect(paperQualityChoices(product('large_format'), configWith([]))).toEqual([])
    expect(paperQualityChoices(null, null)).toEqual([])
  })
})

describe('a quality choice maps onto the existing API contract', () => {
  it('writes requested_paper_category + requested_gsm, and nothing else', () => {
    const spec: CalculatorSpec = { product_type: 'business_card', quantity: 500 }
    spec.requested_paper_category = 'ivory'
    spec.requested_gsm = 300
    expect(buildPublicPreviewPayload(spec)).toEqual({
      product_type: 'business_card',
      quantity: 500,
      requested_paper_category: 'ivory',
      requested_gsm: 300,
    })
  })

  it('never emits the legacy paper_stock key', () => {
    const src = readFileSync(path.join(ROOT, 'app/shared/paper-quality.ts'), 'utf8')
    expect(src).not.toMatch(/paper_stock/)
  })

  it('resolves the selected choice back from category + gsm', () => {
    const choices = paperQualityChoices(businessCard(), configWith([businessCard()]))
    expect(selectedPaperQuality(choices, 'matt', 350)?.tier).toBe('Professional')
    expect(selectedPaperQuality(choices, 'ivory', 300)?.tier).toBe('Premium')
    expect(selectedPaperQuality(choices, 'ivory', undefined)?.tier).toBe('Premium')
    expect(selectedPaperQuality(choices, undefined, undefined)).toBeNull()
  })

  it('still lets a tiered product fall back to categories when the config rules out its tiers', () => {
    const cardSticker = product('business_card', { allowed_paper_categories: ['tictac'] })
    const choices = paperQualityChoices(cardSticker, configWith([cardSticker]))
    expect(choices.map((c) => c.label)).toEqual(['Tictac'])
    expect(choices[0].tier).toBe('')
  })

  it('agrees with the calculator fixture the rest of the suite uses', () => {
    const choices = paperQualityChoices(calculatorFixture.product, calculatorFixture.config)
    expect(choices.map((c) => c.label)).toEqual(['Art card', 'Gloss'])
  })
})

describe('press-sheet and imposition stay out of the client options', () => {
  /** Strips comments so prose about SRA3 is not mistaken for a control. */
  function code(rel: string): string {
    return readFileSync(path.join(ROOT, rel), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[^:])\/\/.*$/gm, '$1')
  }

  it('defines no press-sheet, imposition or SRA3 control in the quality layer', () => {
    const src = code('app/shared/paper-quality.ts')
    expect(src).not.toMatch(/sra3/i)
    expect(src).not.toMatch(/press_?sheet/i)
    expect(src).not.toMatch(/imposition/i)
  })

  it('keeps press-sheet and imposition out of the buyer spec vocabulary', () => {
    const spec = readFileSync(path.join(ROOT, 'app/shared/calculator-spec.ts'), 'utf8')
    const keys = [...spec.matchAll(/^\s{2}(\w+)\??:/gm)].map((m) => m[1])
    expect(keys).toContain('requested_paper_category')
    expect(keys.filter((k) => /sra3|sheet|imposition|press/i.test(k))).toEqual([])
  })

  it('leaves the priced imposition read-only, from the server preview', () => {
    const sheet = readFileSync(path.join(ROOT, 'app/components/workbench/calculator/ImpositionSheet.vue'), 'utf8')
    expect(sheet).toContain('press_sheet')
    expect(sheet).not.toMatch(/v-model/)
  })
})
