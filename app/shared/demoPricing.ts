/**
 * Demo pricing calculation for the Template Gallery.
 * No backend — uses demoRateCard for mock quotes.
 */

import type { DemoRateCard, DemoFinishingRate } from './demoRateCard'

export interface DemoFormState {
  unit: 'A4' | 'A3' | 'SQM'
  sheetSize: 'A5' | 'A4' | 'A3' | 'SRA3'
  piecesPerSheet: number
  sides: 1 | 2
  quantity: number
  materialKey: string
  finishingIds: string[]
  /** For SQM: width in meters */
  widthM: number
  /** For SQM: height in meters */
  heightM: number
}

export interface DemoQuoteResult {
  printing: number
  material: number
  finishing: number
  total: number
}

/**
 * Compute a demo quote from form state and rate card.
 * - Digital: duplex uses price_double_sided per sheet (not 2× per side)
 * - SQM: area = width × height × qty
 */
export function computeDemoQuote(
  formState: DemoFormState,
  rateCard: DemoRateCard
): DemoQuoteResult {
  if (formState.unit === 'SQM') {
    return computeSqmQuote(formState, rateCard)
  }
  return computeDigitalQuote(formState, rateCard)
}

function computeDigitalQuote(
  formState: DemoFormState,
  rateCard: DemoRateCard
): DemoQuoteResult {
  const sheetsNeeded = Math.ceil(
    formState.quantity / formState.piecesPerSheet
  )

  const printRate = rateCard.printing.find(
    (p) => p.sheet_size === formState.sheetSize
  )
  const printing =
    formState.sides === 2 && printRate
      ? sheetsNeeded * printRate.price_double_sided
      : printRate
        ? sheetsNeeded * formState.sides * printRate.price_per_side
        : 0

  const paperRate = rateCard.paper.find(
    (p) =>
      p.sheet_size === formState.sheetSize &&
      (p.key === formState.materialKey ||
        p.label === formState.materialKey)
  )
  const material = paperRate ? sheetsNeeded * paperRate.price_per_sheet : 0

  const finishing = computeFinishingCost(formState, rateCard.finishing)

  return {
    printing,
    material,
    finishing,
    total: printing + material + finishing,
  }
}

function computeSqmQuote(
  formState: DemoFormState,
  rateCard: DemoRateCard
): DemoQuoteResult {
  const areaSqm = formState.widthM * formState.heightM * formState.quantity

  const materialRate = rateCard.sqm_materials.find(
    (m) => m.key === formState.materialKey || m.label === formState.materialKey
  )
  const material = materialRate ? areaSqm * materialRate.price_per_sqm : 0

  const printing = areaSqm * rateCard.sqm_printing_per_m2

  const finishing = computeFinishingCost(formState, rateCard.finishing)

  return {
    printing,
    material,
    finishing,
    total: printing + material + finishing,
  }
}

function computeFinishingCost(
  formState: DemoFormState,
  finishingRates: DemoFinishingRate[]
): number {
  let total = 0
  for (const id of formState.finishingIds) {
    const rate = finishingRates.find((f) => f.id === id)
    if (!rate) continue
    switch (rate.charge_by) {
      case 'PER_SHEET':
        total +=
          formState.unit === 'SQM'
            ? formState.quantity * rate.price
            : Math.ceil(
                  formState.quantity / formState.piecesPerSheet
                ) * rate.price
        break
      case 'PER_PIECE':
        total += formState.quantity * rate.price
        break
      case 'PER_JOB':
        total += rate.price
        break
      default:
        break
    }
  }
  return total
}
