import { API } from '~/shared/api-paths'
import type { CalculatorConfigResponse, CalculatorPreviewResponse } from '~/types/api/calculator'

type ApiClient = <T>(url: string, options?: Record<string, unknown>) => Promise<T>

export async function fetchCalculatorConfig(api?: ApiClient): Promise<CalculatorConfigResponse> {
  const client = (api ?? useNuxtApp().$publicApiNoAuth) as ApiClient
  const response = await client<CalculatorConfigResponse>(API.calculatorConfig(), {
    method: 'GET',
  })
  return normalizeCalculatorConfigResponse(response)
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

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : []
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

function normalizeChoiceOption(value: unknown) {
  const option = asRecord(value)
  if (!option) return null

  return {
    ...option,
    label: typeof option.label === 'string'
      ? option.label
      : typeof option.display_name === 'string'
        ? option.display_name
        : typeof option.value === 'string'
          ? option.value
          : typeof option.key === 'string'
            ? option.key
            : '',
  }
}

function normalizeFieldConfig(value: unknown) {
  const field = asRecord(value)
  if (!field || typeof field.key !== 'string') return null

  const type = field.type === 'number' || field.type === 'boolean' || field.type === 'select'
    ? field.type
    : 'select'

  return {
    ...field,
    key: field.key,
    label: typeof field.label === 'string' ? field.label : field.key,
    type,
    required: Boolean(field.required),
    options: asArray(field.options).map(normalizeChoiceOption).filter(Boolean),
  }
}

function normalizeProductConfig(value: unknown) {
  const product = asRecord(value)
  if (!product || typeof product.key !== 'string') return null

  return {
    ...product,
    key: product.key,
    label: typeof product.label === 'string' ? product.label : product.key,
    required_fields: asStringList(product.required_fields),
    optional_fields: asStringList(product.optional_fields),
    defaults: asRecord(product.defaults) ?? {},
    allowed_paper_categories: asStringList(product.allowed_paper_categories),
    allowed_cover_categories: asStringList(product.allowed_cover_categories),
    allowed_insert_categories: asStringList(product.allowed_insert_categories),
    allowed_finishings: asStringList(product.allowed_finishings),
    allowed_print_sides: asStringList(product.allowed_print_sides),
    sizes: asArray(product.sizes).map(normalizeChoiceOption).filter(Boolean),
    fields: asArray(product.fields).map(normalizeFieldConfig).filter(Boolean),
  }
}

export function normalizeCalculatorConfigResponse(response: CalculatorConfigResponse | Record<string, unknown> | null | undefined): CalculatorConfigResponse {
  const source = asRecord(response) ?? {}
  const sizesSource = asRecord(source.sizes) ?? {}

  return {
    products: asArray(source.products).map(normalizeProductConfig).filter(Boolean),
    paper_categories: asArray(source.paper_categories).map(normalizeChoiceOption).filter(Boolean),
    paper_stocks: asArray(source.paper_stocks).map(normalizeChoiceOption).filter(Boolean),
    finishings: asArray(source.finishings).map(normalizeChoiceOption).filter(Boolean),
    sizes: Object.fromEntries(
      Object.entries(sizesSource).map(([key, value]) => [key, asArray(value).map(normalizeChoiceOption).filter(Boolean)]),
    ),
    print_sides: asArray(source.print_sides).map(normalizeChoiceOption).filter(Boolean),
    color_modes: asArray(source.color_modes).map(normalizeChoiceOption).filter(Boolean),
    preview_endpoint: typeof source.preview_endpoint === 'string' ? source.preview_endpoint : API.calculatorPublicPreview(),
  }
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
