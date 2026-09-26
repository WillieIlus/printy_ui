import { describe, it, expect } from 'vitest'

import {
  buildImpositionDiagram,
  diagramHeight,
  DIAGRAM_GAP,
  DIAGRAM_WIDTH,
} from '~/shared/imposition-layout'

// The 13x19in press sheet from the live calculator: 5 x 5 rotated business cards.
const PRESS = { pressWidthMm: 330, pressHeightMm: 483, cols: 5, rows: 5 }

function build(mode: 'grid' | 'brick', overrides: Partial<typeof PRESS> = {}) {
  return buildImpositionDiagram({ ...PRESS, ...overrides, mode })
}

function rightEdges(diag: ReturnType<typeof build>) {
  return diag.cells.map(c => c.x + c.w)
}

describe('buildImpositionDiagram', () => {
  it('draws the grid flush to the left edge', () => {
    const diag = build('grid')
    const firstRow = diag.cells.slice(0, PRESS.cols)
    expect(firstRow[0].x).toBe(0)
    expect(rightEdges(diag)[PRESS.cols - 1]).toBeCloseTo(DIAGRAM_WIDTH, 6)
  })

  it('keeps the piece count identical in grid and brick', () => {
    // The whole point: brick is a redraw, never a different quantity.
    expect(build('brick').cells.length).toBe(build('grid').cells.length)
    expect(build('brick').cells.length).toBe(PRESS.cols * PRESS.rows)
  })

  it('staggeres only the odd rows by half a cell', () => {
    const { cols } = PRESS
    const diag = build('brick')
    const rowStart = (r: number) => diag.cells[r * cols].x
    const row2Start = (r: number) => diag.cells[(r * cols) + cols - 1].x + diag.cells[r * cols].w

    expect(rowStart(0)).toBe(0)
    expect(rowStart(2)).toBe(0)
    expect(rowStart(4)).toBe(0)

    const half = diag.cells[0].w / 2
    expect(rowStart(1)).toBeCloseTo(half, 6)
    expect(rowStart(3)).toBeCloseTo(half, 6)

    // Staggered rows are shifted by exactly half a cell, nothing more.
    expect(row2Start(1) - row2Start(0)).toBeCloseTo(half, 6)
  })

  it('never overflows the sheet it is depicting', () => {
    // Offsetting naively would push odd rows past the right edge; narrowing the
    // cell to cols + 0.5 divisions is what keeps the drawing honest.
    for (const mode of ['grid', 'brick'] as const) {
      const diag = build(mode)
      for (const edge of rightEdges(diag)) {
        expect(edge).toBeLessThanOrEqual(DIAGRAM_WIDTH + 1e-9)
        expect(edge).toBeGreaterThan(0)
      }
      for (const cell of diag.cells) {
        expect(cell.x).toBeGreaterThanOrEqual(-1e-9)
        expect(cell.y + cell.h).toBeLessThanOrEqual(diag.H + 1e-9)
      }
    }
  })

  it('lands the staggered rows flush on the right edge', () => {
    // Even rows end half a cell short of the right edge so the odd rows can
    // interlock and finish flush. That offset is the whole brick effect.
    const { cols } = PRESS
    const diag = build('brick')
    const rowEdge = (r: number) => {
      const last = diag.cells[(r * cols) + cols - 1]
      return last.x + last.w
    }
    const half = diag.cells[0].w / 2

    expect(rowEdge(0)).toBeCloseTo(DIAGRAM_WIDTH - half, 6)
    expect(rowEdge(2)).toBeCloseTo(DIAGRAM_WIDTH - half, 6)
    expect(rowEdge(1)).toBeCloseTo(DIAGRAM_WIDTH, 6)
    expect(rowEdge(3)).toBeCloseTo(DIAGRAM_WIDTH, 6)
    expect(rowEdge(1) - rowEdge(0)).toBeCloseTo(half, 6)
  })

  it('preserves the press sheet aspect ratio in both modes', () => {
    for (const mode of ['grid', 'brick'] as const) {
      expect(build(mode).H).toBe(diagramHeight(330, 483))
    }
    expect(diagramHeight(330, 483)).toBeCloseTo((483 / 330) * DIAGRAM_WIDTH, 1)
  })

  it('falls back to a sane height without press sheet dimensions', () => {
    const diag = build('brick', { pressWidthMm: null, pressHeightMm: null })
    expect(diag.H).toBeCloseTo(DIAGRAM_WIDTH * 0.72, 1)
    expect(diag.cells.length).toBe(PRESS.cols * PRESS.rows)
  })

  it('returns no cells for a degenerate layout', () => {
    for (const bad of [{ cols: 0, rows: 5 }, { cols: 5, rows: 0 }, { cols: -1, rows: 2 }]) {
      const diag = buildImpositionDiagram({ ...PRESS, ...bad, mode: 'brick' })
      expect(diag.cells).toEqual([])
    }
  })

  it('spaces rows with the same gap as columns', () => {
    const { cols } = PRESS
    const diag = build('brick')
    expect(diag.cells[cols].y - diag.cells[0].y).toBeCloseTo(diag.cells[0].h + DIAGRAM_GAP, 6)
  })
})
