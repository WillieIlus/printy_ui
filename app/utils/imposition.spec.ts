import { describe, it, expect } from 'vitest'
import { computeSheetImposition } from './imposition'

describe('computeSheetImposition', () => {
  it('quantity=500, ups=25 => sheets=20', () => {
    const result = computeSheetImposition(500, 25)
    expect(result).not.toBeNull()
    expect(result!.sheets_needed).toBe(20)
    expect(result!.ups_per_sheet).toBe(25)
    expect(result!.calculation_steps).toContain('500 ÷ 25 = 20 sheets')
    expect(result!.notes).toHaveLength(0) // exact division, no rounding
  })

  it('quantity=501, ups=25 => sheets=21', () => {
    const result = computeSheetImposition(501, 25)
    expect(result).not.toBeNull()
    expect(result!.sheets_needed).toBe(21)
    expect(result!.ups_per_sheet).toBe(25)
    expect(result!.calculation_steps).toContain('501 ÷ 25 = 21 sheets')
    expect(result!.notes).toContain('Rounded up to whole sheets')
  })

  it('returns null when ups_per_sheet is null', () => {
    expect(computeSheetImposition(500, null)).toBeNull()
  })

  it('returns null when ups_per_sheet is 0', () => {
    expect(computeSheetImposition(500, 0)).toBeNull()
  })

  it('returns null when ups_per_sheet is negative', () => {
    expect(computeSheetImposition(500, -25)).toBeNull()
  })

  it('quantity=1, ups=1 => sheets=1', () => {
    const result = computeSheetImposition(1, 1)
    expect(result!.sheets_needed).toBe(1)
    expect(result!.notes).toHaveLength(0)
  })

  it('quantity=26, ups=25 => sheets=2', () => {
    const result = computeSheetImposition(26, 25)
    expect(result!.sheets_needed).toBe(2)
    expect(result!.notes).toContain('Rounded up to whole sheets')
  })
})
