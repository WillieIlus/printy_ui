import type { ShopPublic, Product } from '~/shared/types'
import type { PreviewPriceResponse } from '~/shared/types/buyer'
import { API } from '~/shared/api-paths'
import { usePublicApi, usePublicApiNoAuth } from '~/shared/api'

export interface CatalogResponse {
  shop: ShopPublic
  products: Product[]
}

export interface PublicMatchShop {
  id: number
  name: string
  slug: string
  currency?: string | null
  can_calculate?: boolean
  reason?: string
  missing_fields?: string[]
  total?: string | null
  preview?: PreviewPriceResponse | null
  selection?: {
    paper_id?: number
    paper_label?: string
    material_id?: number
    material_label?: string
    machine_id?: number
    machine_label?: string
  }
  similarity_score?: number
  confidence_score?: number
  distance_km?: number | null
  exact_or_estimated?: boolean
}

export interface PublicCalculatorPayload {
  calculator_mode?: string
  product_family?: 'flat' | 'booklet' | 'large_format'
  shop_scope?: 'marketplace' | 'single_shop' | 'admin' | 'quote_draft' | 'tweak'
  pricing_mode: 'catalog' | 'custom'
  product_pricing_mode: 'SHEET' | 'LARGE_FORMAT'
  product_id?: number | null
  template_id?: number | null
  size_mode?: 'standard' | 'custom'
  size_label?: string
  input_unit?: 'mm' | 'cm' | 'm' | 'in'
  width_input?: string | number | null
  height_input?: string | number | null
  width_mm?: number | null
  height_mm?: number | null
  normalized_size?: string
  quantity: number
  print_sides: 'SIMPLEX' | 'DUPLEX'
  apply_duplex_surcharge?: boolean | null
  colour_mode: 'BW' | 'COLOR'
  paper_id?: number | null
  material_id?: number | null
  material_type?: string
  sheet_size?: string
  paper_gsm?: number | null
  paper_type?: string
  finishing_ids?: number[]
  finishing_slugs?: string[]
  finishings?: Array<{
    finishing_rate_id?: number
    finishing_id?: number
    slug?: string
    selected_side?: 'front' | 'back' | 'both'
  }>
  turnaround_days?: number | null
  turnaround_hours?: number | null
  turnaround_mode?: 'standard' | 'rush'
  custom_title?: string
  custom_brief?: string
  fixed_shop_slug?: string
  lat?: number | null
  lng?: number | null
  radius_km?: number | null
}

export interface PublicMatchShopsResponse {
  mode: string
  matches: PublicMatchShop[]
  shops: PublicMatchShop[]
  matches_count: number
  min_price?: string | null
  max_price?: string | null
  currency?: string | null
  selected_shops?: PublicMatchShop[]
  fixed_shop_preview?: PublicMatchShop | null
  missing_requirements?: string[]
  unsupported_reasons?: string[]
  summary?: string
  exact_or_estimated?: boolean
}

export interface ShopCustomOptionsResponse {
  available_papers?: Array<{
    id: number
    sheet_size: string
    gsm: number
    paper_type: string
    selling_price?: string
  }>
  available_materials?: Array<{
    id: number
    material_type?: string
    unit?: string
    selling_price?: string
    print_price_per_sqm?: string
  }>
  available_finishings?: Array<{
    id: number
    slug?: string
    name: string
    price?: string
    charge_unit?: string
    billing_basis?: string
    side_mode?: string
    display_unit_label?: string
    category?: string | null
  }>
}

type PublicApiClient = ReturnType<typeof usePublicApi>
type PublicApiNoAuthClient = ReturnType<typeof usePublicApiNoAuth>

export async function listShops(publicApi: PublicApiClient = usePublicApi()): Promise<ShopPublic[]> {
  const data = await publicApi<ShopPublic[] | { results: ShopPublic[] }>(API.publicShops())
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: ShopPublic[] }).results)) {
    return (data as { results: ShopPublic[] }).results
  }
  return []
}

export async function getCatalog(
  shopSlug: string,
  publicApi: PublicApiClient = usePublicApi()
): Promise<CatalogResponse | null> {
  try {
    return await publicApi<CatalogResponse>(API.publicShopCatalog(shopSlug))
  } catch {
    return null
  }
}

export async function matchShops(
  payload: PublicCalculatorPayload,
  publicApi: PublicApiNoAuthClient = usePublicApiNoAuth()
): Promise<PublicMatchShopsResponse> {
  const data = await publicApi<PublicMatchShopsResponse>(API.publicMatchShops(), {
    method: 'POST',
    body: payload,
  })
  return {
    mode: data?.mode ?? 'marketplace',
    matches: data?.matches ?? data?.shops ?? [],
    shops: data?.shops ?? [],
    matches_count: data?.matches_count ?? 0,
    min_price: data?.min_price ?? null,
    max_price: data?.max_price ?? null,
    currency: data?.currency ?? null,
    selected_shops: data?.selected_shops ?? [],
    fixed_shop_preview: data?.fixed_shop_preview ?? null,
    missing_requirements: data?.missing_requirements ?? [],
    unsupported_reasons: data?.unsupported_reasons ?? [],
    summary: data?.summary ?? '',
    exact_or_estimated: data?.exact_or_estimated ?? false,
  }
}

export async function previewShopCalculator(
  shopSlug: string,
  payload: PublicCalculatorPayload,
  publicApi: PublicApiNoAuthClient = usePublicApiNoAuth()
): Promise<PublicMatchShopsResponse> {
  const data = await publicApi<PublicMatchShopsResponse>(API.publicShopCalculatorPreview(shopSlug), {
    method: 'POST',
    body: payload,
  })
  return {
    mode: data?.mode ?? 'single-shop',
    matches: data?.matches ?? data?.shops ?? [],
    shops: data?.shops ?? [],
    matches_count: data?.matches_count ?? 0,
    min_price: data?.min_price ?? null,
    max_price: data?.max_price ?? null,
    currency: data?.currency ?? null,
    selected_shops: data?.selected_shops ?? [],
    fixed_shop_preview: data?.fixed_shop_preview ?? null,
    missing_requirements: data?.missing_requirements ?? [],
    unsupported_reasons: data?.unsupported_reasons ?? [],
    summary: data?.summary ?? '',
    exact_or_estimated: data?.exact_or_estimated ?? false,
  }
}

export async function matchBookletShops(
  payload: Record<string, unknown>,
  publicApi: PublicApiNoAuthClient = usePublicApiNoAuth()
): Promise<PublicMatchShopsResponse> {
  const data = await publicApi<PublicMatchShopsResponse>(API.publicMatchBookletShops(), {
    method: 'POST',
    body: payload,
  })
  return {
    mode: data?.mode ?? 'marketplace',
    matches: data?.matches ?? data?.shops ?? [],
    shops: data?.shops ?? data?.matches ?? [],
    matches_count: data?.matches_count ?? 0,
    min_price: data?.min_price ?? null,
    max_price: data?.max_price ?? null,
    currency: data?.currency ?? null,
    selected_shops: data?.selected_shops ?? data?.matches ?? [],
    fixed_shop_preview: data?.fixed_shop_preview ?? null,
    missing_requirements: data?.missing_requirements ?? [],
    unsupported_reasons: data?.unsupported_reasons ?? [],
    summary: data?.summary ?? '',
    exact_or_estimated: data?.exact_or_estimated ?? false,
  }
}

export async function getShopCustomOptions(
  shopSlug: string,
  publicApi: PublicApiNoAuthClient = usePublicApiNoAuth()
): Promise<ShopCustomOptionsResponse> {
  return await publicApi<ShopCustomOptionsResponse>(API.publicShopCustomOptions(shopSlug))
}
