import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * Placement and visibility rules for the imposition sheet.
 *
 * 1. It lives in the left column of the calculator, between the paper/GSM step
 *    and the Artwork step, not in the right-hand price rail.
 * 2. It must not sit inside the `open && !locked && canPrice` paywall gate. The
 *    landing page renders the calculator locked, and the copy promises "Build
 *    your job. See the sheet."
 * 3. It must render once, not once per price-rail instance (desktop aside and
 *    mobile bottom sheet each mount a PriceRail).
 *
 * These are structural assertions on purpose: the failure modes are template
 * nesting and placement, not geometry.
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

describe('imposition sheet placement', () => {
  it('is not rendered by PriceRail at all', () => {
    // PriceRail is mounted twice (desktop aside + mobile sheet). If the sheet
    // lived here it would appear twice and behind the price lock.
    expect(rail).not.toContain('ImpositionSheet')
  })

  it('is rendered by CalculatorView in the left column', () => {
    expect(view).toContain("import ImpositionSheet from '../calculator/ImpositionSheet.vue'")
    expect(viewTemplate).toContain('<ImpositionSheet :imposition="preview.production_preview" />')
  })

  it('sits below the paper/GSM step and above the artwork step', () => {
    const sheetAt = viewTemplate.indexOf('<ImpositionSheet')
    const gsmAt = viewTemplate.indexOf('requested_gsm')
    const artworkAt = viewTemplate.indexOf('Attach artwork')
    expect(gsmAt).toBeGreaterThan(-1)
    expect(artworkAt).toBeGreaterThan(-1)
    expect(sheetAt).toBeGreaterThan(gsmAt)
    expect(sheetAt).toBeLessThan(artworkAt)
  })

  it('is wrapped in a Step so it matches the other calculator steps', () => {
    const sheetAt = viewTemplate.indexOf('<ImpositionSheet')
    const before = viewTemplate.slice(Math.max(0, sheetAt - 400), sheetAt)
    expect(before).toContain('title="How your sheet is laid out"')
  })

  it('only appears once the preview has resolved a production layout', () => {
    expect(viewTemplate).toContain('v-if="preview?.production_preview"')
  })

  it('is never inside the paywall gate', () => {
    expect(lockedGateBody()).not.toContain('ImpositionSheet')
    // Proves the walk found the real container rather than an empty region.
    expect(lockedGateBody()).toContain('Estimated market range')
  })

  it('keeps the price range inside the paywall gate', () => {
    const body = lockedGateBody()
    expect(body).toContain('Estimated market range')
    expect(body).toContain('This price is final')
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
})
