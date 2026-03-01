/**
 * Imposition calculation utilities.
 * Used when backend does not return imposition fields, or for client-side fallback.
 */

export interface ImpositionResult {
  ups_per_sheet: number
  sheets_needed: number
  calculation_steps: string[]
  notes: string[]
}

/**
 * Compute sheets needed and calculation steps from quantity and ups_per_sheet.
 * sheets_needed = ceil(quantity / ups_per_sheet)
 *
 * @param quantity - Number of units (pieces) required
 * @param upsPerSheet - Units per sheet (e.g. 25 for business cards)
 * @returns Imposition result or null if upsPerSheet is invalid
 */
export function computeSheetImposition(
  quantity: number,
  upsPerSheet: number | null | undefined
): ImpositionResult | null {
  if (upsPerSheet == null || upsPerSheet <= 0 || !Number.isInteger(upsPerSheet)) {
    return null
  }
  if (quantity <= 0 || !Number.isInteger(quantity)) {
    return null
  }

  const sheetsNeeded = Math.ceil(quantity / upsPerSheet)
  const steps: string[] = [`${quantity} ÷ ${upsPerSheet} = ${sheetsNeeded} sheets`]
  const notes: string[] = []

  if (quantity % upsPerSheet !== 0) {
    notes.push('Rounded up to whole sheets')
  }

  return {
    ups_per_sheet: upsPerSheet,
    sheets_needed: sheetsNeeded,
    calculation_steps: steps,
    notes,
  }
}
