/**
 * Demo pricing computation for the Template Gallery.
 *
 * Uses demoRateCard data (backend-aligned models) to compute mock quotes.
 * Pricing logic mirrors the backend: sheets = ceil(qty / copies_per_sheet),
 * cost = paper.selling_price × sheets + PrintingRate × sheets + finishing.
 */

import type { DemoRateCard, DemoQuoteResult } from './demoTypes'
import type { DemoGalleryTemplate } from './demoTemplates'

export type { DemoQuoteResult }

/**
 * Compute a demo quote for a gallery template against a rate card.
 *
 * Sheet mode:  sheets = ceil(defaultQty / copies_per_sheet)
 *   printing = single_price or double_price × sheets
 *   paper    = selling_price × sheets
 *   finishing = per finishing option charge
 *
 * Large format:  area = (w_mm / 1000) × (h_mm / 1000) × qty
 *   material = selling_price × area
 *   printing = sqm printing rate × area
 */
export function computeDemoQuote(
  template: DemoGalleryTemplate,
  rateCard: DemoRateCard,
): DemoQuoteResult {
  if (template.pricing_mode === 'LARGE_FORMAT') {
    return computeLargeFormatQuote(template, rateCard)
  }
  return computeSheetQuote(template, rateCard)
}

function computeSheetQuote(
  template: DemoGalleryTemplate,
  rateCard: DemoRateCard,
): DemoQuoteResult {
  const qty = template.min_quantity
  const copiesPerSheet = Math.max(1, template.copies_per_sheet)
  const sheetsNeeded = Math.ceil(qty / copiesPerSheet)

  const sheetSize = template.default_sheet_size || 'SRA3'
  const isDuplex = template.default_sides === 'DUPLEX'

  const printRate = rateCard.printing_rates.find(
    (r) => r.sheet_size === sheetSize && r.color_mode === 'COLOR',
  )
  const printing = printRate
    ? sheetsNeeded * parseFloat(isDuplex ? printRate.double_price : printRate.single_price)
    : 0

  const targetGsm = template.min_gsm ?? 150
  const paper = rateCard.papers.find(
    (p) => p.sheet_size === sheetSize && p.gsm >= targetGsm && p.is_active,
  )
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
  template: DemoGalleryTemplate,
  rateCard: DemoRateCard,
): DemoQuoteResult {
  const widthM = template.default_finished_width_mm / 1000
  const heightM = template.default_finished_height_mm / 1000
  const qty = template.min_quantity
  const areaSqm = widthM * heightM * qty

  const mat = rateCard.materials[0]
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
  template: DemoGalleryTemplate,
  rateCard: DemoRateCard,
  sheets: number,
  pieces: number,
): number {
  let total = 0
  for (const opt of template.finishing_options) {
    const rate = rateCard.finishing_rates.find((f) => f.id === opt.finishing_rate)
    if (!rate || !rate.is_active) continue
    const price = parseFloat(rate.price)
    switch (rate.charge_unit) {
      case 'PER_SHEET':
        total += sheets * price
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
