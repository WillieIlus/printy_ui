import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * Imposition / press-sheet visibility (law 1.3, 4.4, 4.8).
 *
 * Buyers and anonymous visitors must never see the imposition sheet, press
 * sheets, sheet counts or spoilage — that is production detail reserved for
 * managers and printers. The calculator view must not render the sheet, and the
 * public price rail must reveal the estimated market range *before* the signup
 * gate while never falling back to dash placeholders.
 */
const CALCULATOR_DIR = path.resolve(process.cwd(), 'app/components/workbench/calculator')
const VIEWS_DIR = path.resolve(process.cwd(), 'app/components/workbench/views')

const rail = readFileSync(path.join(CALCULATOR_DIR, 'PriceRail.vue'), 'utf8')
const view = readFileSync(path.join(VIEWS_DIR, 'CalculatorView.vue'), 'utf8')
const sheet = readFileSync(path.join(CALCULATOR_DIR, 'ImpositionSheet.vue'), 'utf8')

const railTemplate = rail.slice(rail.indexOf('<template>'))
const viewTemplate = view.slice(view.indexOf('<template>'))

/** Body of the `open && !locked && canPrice` gate inside PriceRail. */
function lockedGateBody(): string {
  const start = railTemplate.indexOf('v-if="open && !locked && canPrice"')
  expect(start, 'locked gate must still exist in PriceRail').toBeGreaterThan(-1)
  const open = railTemplate.indexOf('>', start)
  let depth = 1
  let i = open + 1
  while (depth > 0 && i < railTemplate.length) {
    if (railTemplate.startsWith('<div', i)) depth++
    if (railTemplate.startsWith('</div>', i)) depth--
    i++
  }
  return railTemplate.slice(open + 1, i)
}

describe('imposition sheet is hidden from buyers and the public calculator', () => {
  it('is not imported or rendered by the calculator view', () => {
    expect(view).not.toContain('ImpositionSheet')
    expect(viewTemplate).not.toContain('<ImpositionSheet')
  })

  it('is never rendered by the price rail', () => {
    // PriceRail is mounted twice (desktop aside + mobile sheet) and sits behind
    // the price lock for anonymous visitors.
    expect(rail).not.toContain('ImpositionSheet')
  })

  it('does not read production-preview fields in the calculator view', () => {
    expect(viewTemplate).not.toContain('production_preview')
  })

  it('drops "nothing hidden" claims from the buyer-facing copy', () => {
    const files = [
      path.join(CALCULATOR_DIR, 'PriceRail.vue'),
      path.join(CALCULATOR_DIR, 'ImpositionSheet.vue'),
      path.join(VIEWS_DIR, 'CalculatorView.vue'),
      path.join(VIEWS_DIR, 'HomeView.vue'),
      path.join(VIEWS_DIR, 'BuyerView.vue'),
    ]
    const sources = files.map((file) => readFileSync(file, 'utf8')).join('\n')
    expect(sources.toLowerCase()).not.toContain('nothing hidden')
  })
})

describe('price range is visible before the signup gate', () => {
  it('shows the estimated market range outside the paywall gate', () => {
    const gateAt = railTemplate.indexOf('v-if="open && !locked && canPrice"')
    const rangeAt = railTemplate.indexOf('Estimated market range')
    expect(rangeAt).toBeGreaterThan(-1)
    expect(rangeAt).toBeLessThan(gateAt)
  })

  it('never falls back to a dash placeholder', () => {
    expect(railTemplate).not.toContain("'—'")
    expect(railTemplate).not.toContain('---')
    expect(railTemplate).not.toMatch(/>\s*—\s*</)
  })

  it('keeps the final-price breakdown inside the gate', () => {
    expect(lockedGateBody()).toContain('This price is final')
  })
})

describe('ImpositionSheet is self-sufficient', () => {
  it('owns the layout mode toggle and both captions', () => {
    expect(sheet).toContain("ref<DiagramLayoutMode>('grid')")
    expect(sheet).toContain('Illustrative only')
    expect(sheet).toContain('This is the actual imposition your price is built from')
  })

  it('labels the priced row so brick is never presented as the priced layout', () => {
    expect(sheet).toContain("layoutMode.value === 'brick' ? 'Priced layout' : 'Layout'")
  })

  it('leaves the title to the parent Step instead of duplicating it', () => {
    expect(sheet).not.toContain('How your sheet is laid out')
  })

  it('hides the diagram but keeps the rows when the layout is unknown', () => {
    expect(sheet).toContain('v-if="diagram.cells.length"')
  })

  it('keeps the sheet compact, side-by-side with the rows', () => {
    // The reference design (design-base/src/views/Calculator.tsx) draws a
    // fixed 260px sheet beside the rows. A w-full diagram ballooned to 648x948
    // on a 1440px viewport, which is what the compact layout replaces.
    expect(sheet).toContain('w-[260px]')
    expect(sheet).not.toMatch(/class="[^"]*\bw-full\b[^"]*"[\s\S]{0,80}<rect/)
    expect(sheet).toContain('min-w-[180px] flex-1')
    expect(sheet).toContain('flex flex-wrap items-start gap-5')
  })

  it('draws trim marks inward so the diagram keeps its exact width', () => {
    // Overhanging marks would need a larger viewBox, which shrinks the sheet
    // inside the 260px box and undoes the compact sizing.
    expect(sheet).toContain('trimMarks')
    expect(sheet).toContain("m.x === 0 ? 5 : -5")
    expect(sheet).toContain("m.y === 0 ? 5 : -5")
  })

  it('ships a legend keyed only to marks that are actually drawn', () => {
    // A legend entry with no matching mark on the sheet is worse than no legend.
    expect(sheet).toContain('const legend = computed')
    expect(sheet).toContain("key: 'piece'")
    expect(sheet).toContain("key: 'marks'")
    expect(sheet).toContain('Gaps are drawn for clarity, not waste')
  })

  it('labels the brick offset only while brick is selected', () => {
    expect(sheet).toContain('Rows offset by half a piece')
    const brickEntry = sheet.slice(sheet.indexOf("layoutMode.value === 'brick'"), sheet.indexOf('return items'))
    expect(brickEntry).toContain("key: 'brick'")
  })

  it('sources legend labels from the server payload rather than computing them', () => {
    expect(sheet).toContain('p.value.size_label')
    expect(sheet).toContain('numberish(press?.width_mm)')
  })
})
