import type { CalculatorPreviewMatch, CalculatorPreviewResponse } from '~/types/api/calculator'

type SnapshotBuilderOptions = {
  preview: CalculatorPreviewResponse | null | undefined
  selectedMatches: CalculatorPreviewMatch[]
  isExact: (match: CalculatorPreviewMatch) => boolean
  getMatchedSpecs: (match: CalculatorPreviewMatch) => string[]
  getMissingSpecs: (match: CalculatorPreviewMatch) => string[]
}

export function getMatchReadyText(match: CalculatorPreviewMatch): string | null {
  return match.human_ready_text ?? null
}

export function buildVisibilitySafePricingSnapshot({
  preview,
  selectedMatches,
  isExact,
  getMatchedSpecs,
  getMissingSpecs,
}: SnapshotBuilderOptions) {
  return {
    source: 'homepage_calculator',
    visibility: {
      actor: 'client',
      exposes_internal_economics: false,
      topology_mode: 'managed',
    },
    currency: preview?.currency ?? 'KES',
    min_price: preview?.min_price ?? null,
    max_price: preview?.max_price ?? null,
    total: preview?.total ?? null,
    summary: preview?.summary ?? '',
    warnings: preview?.warnings ?? [],
    assumptions: preview?.assumptions ?? [],
    price_mode: preview?.price_mode ?? null,
    production_preview: preview?.production_preview ?? null,
    pricing_preview: null,
    selected_shops: selectedMatches.map(match => ({
      id: match.id,
      exact_match: isExact(match),
      matched_specs: getMatchedSpecs(match),
      needs_confirmation: getMissingSpecs(match),
      production_preview: match.production_preview ?? null,
    })),
  }
}
