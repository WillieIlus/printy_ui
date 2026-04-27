import { API } from '~/shared/api-paths'
import type { CalculatorConfigResponse, CalculatorPreviewResponse } from '~/types/api/calculator'

type ApiClient = <T>(url: string, options?: Record<string, unknown>) => Promise<T>

export async function fetchCalculatorConfig(api?: ApiClient): Promise<CalculatorConfigResponse> {
  const client = (api ?? useNuxtApp().$publicApiNoAuth) as ApiClient
  return await client<CalculatorConfigResponse>(API.calculatorConfig(), {
    method: 'GET',
  })
}

export async function fetchCalculatorPreview(
  payload: Record<string, unknown>,
  api?: ApiClient,
): Promise<CalculatorPreviewResponse> {
  const client = (api ?? useNuxtApp().$publicApiNoAuth) as ApiClient
  return await client<CalculatorPreviewResponse>(API.calculatorPublicPreview(), {
    method: 'POST',
    body: payload,
    timeout: 20000,
  })
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

function asMatches(value: unknown): NonNullable<CalculatorPreviewResponse['matches']> {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is NonNullable<CalculatorPreviewResponse['matches']>[number] => Boolean(item) && typeof item === 'object')
}

export function normalizeCalculatorPreviewResponse(response: CalculatorPreviewResponse | Record<string, unknown> | null | undefined): CalculatorPreviewResponse {
  const source = asRecord(response) ?? {}
  const matches = asMatches(source.matches ?? source.shop_matches ?? source.shops ?? source.marketplace_results ?? source.results)
  const missingFields = asStringList(source.missing_fields ?? source.missing_requirements)

  return {
    can_calculate: typeof source.can_calculate === 'boolean' ? source.can_calculate : matches.length > 0,
    product_type: typeof source.product_type === 'string' ? source.product_type : null,
    price_mode: source.price_mode === 'exact' || source.price_mode === 'estimate' ? source.price_mode : null,
    total: typeof source.total === 'string' ? source.total : null,
    breakdown: asRecord(source.breakdown),
    missing_fields: missingFields,
    warnings: asStringList(source.warnings),
    assumptions: asStringList(source.assumptions),
    message: typeof source.message === 'string' ? source.message : undefined,
    matches,
    matches_count: typeof source.matches_count === 'number' ? source.matches_count : matches.length,
    min_price: typeof source.min_price === 'string' ? source.min_price : null,
    max_price: typeof source.max_price === 'string' ? source.max_price : null,
    currency: typeof source.currency === 'string' ? source.currency : null,
    summary: typeof source.summary === 'string'
      ? source.summary
      : typeof source.message === 'string'
        ? source.message
        : '',
    production_preview: asRecord(source.production_preview) as CalculatorPreviewResponse['production_preview'],
    pricing_breakdown: asRecord(source.pricing_breakdown) as CalculatorPreviewResponse['pricing_breakdown'],
  }
}
