/**
 * Demo pricing computation — backend-aligned logic.
 *
 * Uses rate card data (from API or static) to compute quotes locally.
 * Logic mirrors backend demo/services.py:
 *   - Paper: gsm >= targetGsm, pick lowest gsm (order_by gsm)
 *   - Finishing: use price_adjustment when present, else rate.price
 *   - Imposition: sheets = ceil(qty / copies_per_sheet)
 */

import type { DemoRateCard, DemoQuoteResult, DemoRateCardApiResponse  } from './demoTypes'
import type { DemoGalleryTemplate } from './demoTemplates'


export type { DemoQuoteResult }

/** Template shape for computation (API or static) */
interface DemoTemplateForCompute {
  pricing_mode: string
  default_finished_width_mm: number
  default_finished_height_mm: number
  default_sides: string
  min_quantity: number
  default_sheet_size: string
  copies_per_sheet: number
  min_gsm: number | null
  finishing_options: Array<{ finishing_rate: number; price_adjustment?: string | null }>
}

/** Rate card shape for computation (API or static) */
interface DemoRateCardForCompute {
  printing_rates: Array<{
    sheet_size: string
    color_mode: string
    single_price: string
    double_price: string
    is_active: boolean
  }>
  papers: Array<{
    sheet_size: string
    gsm: number
    selling_price: string
    is_active: boolean
  }>
  finishing_rates: Array<{
    id: number
    charge_unit: string
    price: string
    setup_fee: string | null
    is_active: boolean
  }>
  materials: Array<{
    selling_price: string
    is_active: boolean
  }>
}

function toRateCardForCompute(rc: DemoRateCard | DemoRateCardApiResponse): DemoRateCardForCompute {
  if ('templates' in rc) {
    return {
      printing_rates: rc.printing_rates,
      papers: rc.papers,
      finishing_rates: rc.finishing_rates,
      materials: rc.materials,
    }
  }
  return {
    printing_rates: rc.printing_rates,
    papers: rc.papers,
    finishing_rates: rc.finishing_rates,
    materials: rc.materials,
  }
}

/**
 * Compute a demo quote for a template against a rate card.
 * Backend-aligned: paper = lowest gsm >= target, finishing uses price_adjustment.
 */
export function computeDemoQuote(
  template: DemoGalleryTemplate | DemoTemplateForCompute,
  rateCard: DemoRateCard | DemoRateCardApiResponse,
): DemoQuoteResult {
  const rc = toRateCardForCompute(rateCard)
  if (template.pricing_mode === 'LARGE_FORMAT') {
    return computeLargeFormatQuote(template, rc)
  }
  return computeSheetQuote(template, rc)
}

function computeSheetQuote(
  template: DemoTemplateForCompute,
  rateCard: DemoRateCardForCompute,
): DemoQuoteResult {
  const qty = template.min_quantity
  const copiesPerSheet = Math.max(1, template.copies_per_sheet)
  const sheetsNeeded = Math.ceil(qty / copiesPerSheet)

  const sheetSize = template.default_sheet_size || 'SRA3'
  const isDuplex = template.default_sides === 'DUPLEX'

  const printRate = rateCard.printing_rates.find(
    (r) => r.sheet_size === sheetSize && r.color_mode === 'COLOR' && r.is_active,
  )
  const printing = printRate
    ? sheetsNeeded * parseFloat(isDuplex ? printRate.double_price : printRate.single_price)
    : 0

  const targetGsm = template.min_gsm ?? 150
  const eligiblePapers = rateCard.papers.filter(
    (p) => p.sheet_size === sheetSize && p.gsm >= targetGsm && p.is_active,
  )
  const paper = eligiblePapers.length
    ? eligiblePapers.sort((a, b) => a.gsm - b.gsm)[0]
    : rateCard.papers
        .filter((p) => p.sheet_size === sheetSize && p.is_active)
        .sort((a, b) => a.gsm - b.gsm)[0]
  const materialCost = paper ? sheetsNeeded * parseFloat(paper.selling_price) : 0

  const finishing = computeFinishingCost(template, rateCard, sheetsNeeded, qty)

  return {
    printing,
    material: materialCost,
    finishing,
    total: printing + materialCost + finishing,
  }
}

function computeLargeFormatQuote(
  template: DemoTemplateForCompute,
  rateCard: DemoRateCardForCompute,
): DemoQuoteResult {
  const widthM = template.default_finished_width_mm / 1000
  const heightM = template.default_finished_height_mm / 1000
  const qty = template.min_quantity
  const areaSqm = widthM * heightM * qty

  const mat = rateCard.materials.find((m) => m.is_active)
  const materialCost = mat ? areaSqm * parseFloat(mat.selling_price) : 0

  const sqmPrintRate = 350
  const printing = areaSqm * sqmPrintRate

  const finishing = computeFinishingCost(template, rateCard, qty, qty)

  return {
    printing,
    material: materialCost,
    finishing,
    total: printing + materialCost + finishing,
  }
}

function computeFinishingCost(
  template: DemoTemplateForCompute,
  rateCard: DemoRateCardForCompute,
  sheets: number,
  pieces: number,
): number {
  const sides = template.default_sides === 'DUPLEX' ? 2 : 1
  let total = 0
  for (const opt of template.finishing_options) {
    const rate = rateCard.finishing_rates.find((f) => f.id === opt.finishing_rate)
    if (!rate || !rate.is_active) continue
    const price =
      opt.price_adjustment != null && opt.price_adjustment !== ''
        ? parseFloat(opt.price_adjustment)
        : parseFloat(rate.price)
    switch (rate.charge_unit) {
      case 'PER_SHEET':
        total += sheets * price
        break
      case 'PER_SIDE_PER_SHEET':
        total += sheets * sides * price
        break
      case 'PER_PIECE':
        total += pieces * price
        break
      case 'PER_SQM':
        total += pieces * price
        break
      case 'FLAT':
        total += price
        break
      default:
        break
    }
    if (rate.setup_fee) {
      total += parseFloat(rate.setup_fee)
    }
  }
  return total
}
