/**
 * Imposition layout geometry for the buyer-facing sheet diagram.
 *
 * This is a DRAWING helper only. The priced imposition (copies per sheet, good
 * sheets, spoilage) always comes from the server's grid layout; these functions
 * only decide where each piece is drawn inside the preview.
 */

export type DiagramLayoutMode = 'grid' | 'brick'

export interface ImpositionCell {
  x: number
  y: number
  w: number
  h: number
}

export interface ImpositionDiagram {
  W: number
  H: number
  cells: ImpositionCell[]
  /** Pixel inset of the packed grid: the sheet's margin bands drawn to scale. */
  inset: { x: number; y: number }
}

export const DIAGRAM_WIDTH = 232
export const DIAGRAM_GAP = 2
const FALLBACK_ASPECT = 0.72

export function diagramHeight(
  pressWidthMm: number | null,
  pressHeightMm: number | null,
  width: number = DIAGRAM_WIDTH,
): number {
  if (pressWidthMm && pressHeightMm) {
    return Math.round((pressHeightMm / pressWidthMm) * width * 10) / 10
  }
  return Math.round(width * FALLBACK_ASPECT * 10) / 10
}

/**
 * Build the cell rectangles for a sheet preview.
 *
 * 'grid' packs `cols` x `rows` rectangles flush to the left edge.
 * 'brick' keeps the same piece count but offsets every second row by half a
 * cell, so the rows interlock. The cell is narrowed to `cols + 0.5` divisions
 * so the staggered row still lands exactly on the right-hand edge -- the
 * drawing never overflows the sheet it is meant to depict.
 *
 * `marginsMm` (server-derived, optional) insets the whole packed grid so the
 * diagram shows the real sheet margins: cells start after the horizontal /
 * vertical margin bands scaled to the drawing. Without it the behaviour is
 * exactly the historical flush-to-edge packing. The margins are only ever
 * drawn, never fitted -- the engine decides how many pieces fit.
 */
export function buildImpositionDiagram(options: {
  cols: number
  rows: number
  pressWidthMm: number | null
  pressHeightMm: number | null
  mode: DiagramLayoutMode
  width?: number
  gap?: number
  marginsMm?: { horizontal?: number | null; vertical?: number | null } | null
}): ImpositionDiagram {
  const { cols, rows, pressWidthMm, pressHeightMm, mode } = options
  const W = options.width ?? DIAGRAM_WIDTH
  const gap = options.gap ?? DIAGRAM_GAP

  if (!Number.isFinite(cols) || !Number.isFinite(rows) || cols < 1 || rows < 1) {
    return { W, H: 0, cells: [], inset: { x: 0, y: 0 } }
  }

  const H = diagramHeight(pressWidthMm, pressHeightMm, W)
  const brick = mode === 'brick'

  // Scale millimetres to the drawing using the sheet's own scale, then clamp
  // so bad server data can never invert or collapse the diagram.
  let insetX = 0
  let insetY = 0
  const horizontalMm = options.marginsMm?.horizontal
  const verticalMm = options.marginsMm?.vertical
  if (pressWidthMm && pressWidthMm > 0 && Number.isFinite(Number(horizontalMm)) && Number(horizontalMm) >= 0) {
    insetX = (Number(horizontalMm) * W) / pressWidthMm
  }
  if (pressWidthMm && pressWidthMm > 0 && pressHeightMm && Number.isFinite(Number(verticalMm)) && Number(verticalMm) >= 0) {
    insetY = (Number(verticalMm) * W) / pressWidthMm
  }
  insetX = Math.min(insetX, W / 2)
  insetY = Math.min(insetY, H / 2)
  if (W - 2 * insetX < 1 || H - 2 * insetY < 1) {
    insetX = 0
    insetY = 0
  }

  const innerW = W - 2 * insetX
  const innerH = H - 2 * insetY
  const cellW = (innerW - gap * (cols - 1)) / (brick ? cols + 0.5 : cols)
  const cellH = (innerH - gap * (rows - 1)) / rows
  const stagger = brick ? cellW / 2 : 0

  const cells: ImpositionCell[] = []
  for (let r = 0; r < rows; r++) {
    const offset = r % 2 === 1 ? stagger : 0
    for (let c = 0; c < cols; c++) {
      cells.push({
        x: insetX + c * (cellW + gap) + offset,
        y: insetY + r * (cellH + gap),
        w: cellW,
        h: cellH,
      })
    }
  }
  return { W, H, cells, inset: { x: insetX, y: insetY } }
}
