import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * The public homepage renders <CalculatorView embedded locked>. The imposition
 * disclosure used to sit inside the `open && !locked && canPrice` gate, so a
 * signed-out visitor could never see the sheet diagram even though the landing
 * copy promises "Build your job. See the sheet." and "watch the imposition
 * redraw". These assertions are structural on purpose: the failure mode is a
 * regression in template nesting, not in geometry.
 */
const CALCULATOR_DIR = path.resolve(process.cwd(), 'app/components/workbench/calculator')
const rail = readFileSync(path.join(CALCULATOR_DIR, 'PriceRail.vue'), 'utf8')

const template = rail.slice(rail.indexOf('<template>'))

/** Depth of the <Transition> whose content is the `open && !locked && canPrice` gate. */
function lockedGateBody(): string {
  const start = template.indexOf('v-if="open && !locked && canPrice"')
  expect(start, 'locked gate must still exist in PriceRail').toBeGreaterThan(-1)
  const open = template.indexOf('>', start)
  let depth = 1
  let i = open + 1
  while (depth > 0 && i < template.length) {
    if (template.startsWith('<div', i)) depth++
    if (template.startsWith('</div>', i)) depth--
    i++
  }
  return template.slice(open + 1, i)
}

describe('PriceRail paywall gating', () => {
  it('does NOT render the imposition sheet inside the locked gate', () => {
    expect(lockedGateBody()).not.toContain('ImpositionSheet')
  })

  it('renders the imposition sheet outside the gate', () => {
    const afterGate = template.slice(template.indexOf('</Transition>'))
    expect(afterGate).toContain('<ImpositionSheet v-if="imposition" :imposition="imposition" />')
  })

  it('keeps the price range inside the locked gate', () => {
    const body = lockedGateBody()
    expect(body).toContain('Estimated market range')
    expect(body).toContain('This price is final')
  })

  it('still gates the market range behind the unlock click', () => {
    // A guest sees the sheet but not the money.
    expect(rail).toContain('locked ? emit(\'unlock\')')
  })
})

describe('ImpositionSheet is self-sufficient', () => {
  const sheet = readFileSync(path.join(CALCULATOR_DIR, 'ImpositionSheet.vue'), 'utf8')

  it('owns the layout mode toggle and both captions', () => {
    expect(sheet).toContain("ref<DiagramLayoutMode>('grid')")
    expect(sheet).toContain('Illustrative only')
    expect(sheet).toContain('This is the actual imposition your price is built from')
  })

  it('labels the priced row so brick is never presented as the priced layout', () => {
    expect(sheet).toContain("layoutMode.value === 'brick' ? 'Priced layout' : 'Layout'")
  })

  it('hides the diagram but keeps the panel when the layout is unknown', () => {
    // A guest with no matches still gets the shell, not a blank card.
    expect(sheet).toContain('v-if="diagram.cells.length"')
  })
})
