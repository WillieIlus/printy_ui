import { API } from '~/shared/api-paths'

export interface ShopRecord {
  id: number
  name: string
  slug: string
  description?: string
  service_area?: string
  turnaround_statement?: string
  opening_hours_text?: string
  public_whatsapp_number?: string
  phone_number?: string
  city?: string
  is_public?: boolean
  [key: string]: any
}

export interface PaperRecord {
  id: number
  name?: string
  display_name?: string
  sheet_size: string
  gsm: number
  category?: string
  paper_type?: string
  buying_price?: string | number
  selling_price?: string | number
  quantity_in_stock?: number
  is_active?: boolean
  available_for_quoting?: boolean
  use_for_booklet_covers?: boolean
  use_for_booklet_inserts?: boolean
  use_for_stickers_labels?: boolean
  [key: string]: any
}

export interface FinishingRateRecord {
  id: number
  name: string
  charge_unit?: string
  billing_basis?: string
  side_mode?: string
  price?: string | number
  double_side_price?: string | number | null
  minimum_charge?: string | number | null
  setup_fee?: string | number | null
  is_active?: boolean
  [key: string]: any
}

export interface RateCardSetupRecord {
  paper_rows: Array<Record<string, any>>
  finishing_rows: Array<Record<string, any>>
  shop_details: Record<string, any>
  summary?: Record<string, any> | null
  market_guides?: Array<Record<string, any>>
  example_quote?: Record<string, any> | null
  market_label?: string
  completed?: boolean
  pricing_settings?: Record<string, any>
}

type CollectionEnvelope<T> =
  | T[]
  | { results?: T[] | null; papers?: T[] | null; shops?: T[] | null }

function normalizeCollection<T>(payload: CollectionEnvelope<T> | null | undefined): T[] {
  if (Array.isArray(payload)) {
    return payload
  }
  if (Array.isArray(payload?.results)) {
    return payload.results
  }
  if (Array.isArray(payload?.papers)) {
    return payload.papers
  }
  if (Array.isArray(payload?.shops)) {
    return payload.shops
  }
  return []
}

export function useShopsApi() {
  const { api } = useApi()
  const fetchShopPricingSetup = (shopSlug?: string) => api<RateCardSetupRecord>(API.forShops.setup, {
    query: shopSlug ? { shop_slug: shopSlug } : undefined,
  })
  const saveShopPricingSetup = (payload: Record<string, any>, shopSlug?: string) => api<RateCardSetupRecord>(API.forShops.setup, {
    method: 'PATCH',
    query: shopSlug ? { shop_slug: shopSlug } : undefined,
    body: shopSlug ? { ...payload, shop_slug: shopSlug } : payload,
  })
  const completeShopPricingSetup = (shopSlug?: string) => api<Record<string, any>>(API.forShops.complete, {
    method: 'POST',
    body: shopSlug ? { shop_slug: shopSlug } : {},
  })
  return {
    fetchMyShops: async () => normalizeCollection(await api<CollectionEnvelope<ShopRecord>>('/shops/')),
    createShop: (payload: Record<string, any>) => api<ShopRecord>('/shops/', {
      method: 'POST',
      body: payload,
    }),
    updateShop: (slug: string, payload: Record<string, any>) => api<ShopRecord>(`/shops/${slug}/`, {
      method: 'PATCH',
      body: payload,
    }),
    listShopPapers: async (shopSlug: string) => normalizeCollection(await api<CollectionEnvelope<PaperRecord>>(`/shops/${shopSlug}/papers/`)),
    createShopPaper: (shopSlug: string, payload: Record<string, any>) => api<PaperRecord>(`/shops/${shopSlug}/papers/`, {
      method: 'POST',
      body: payload,
    }),
    updateShopPaper: (shopSlug: string, id: number | string, payload: Record<string, any>) => api<PaperRecord>(`/shops/${shopSlug}/papers/${id}/`, {
      method: 'PATCH',
      body: payload,
    }),
    adjustShopPaper: (shopSlug: string, id: number | string, adjustment: number) => api<PaperRecord>(`/shops/${shopSlug}/papers/${id}/adjust/`, {
      method: 'POST',
      body: { adjustment },
    }),
    listShopFinishingRates: async (shopSlug: string) => normalizeCollection(await api<CollectionEnvelope<FinishingRateRecord>>(`/shops/${shopSlug}/finishing-rates/`)),
    createShopFinishingRate: (shopSlug: string, payload: Record<string, any>) => api<FinishingRateRecord>(`/shops/${shopSlug}/finishing-rates/`, {
      method: 'POST',
      body: payload,
    }),
    updateShopFinishingRate: (shopSlug: string, id: number | string, payload: Record<string, any>) => api<FinishingRateRecord>(`/shops/${shopSlug}/finishing-rates/${id}/`, {
      method: 'PATCH',
      body: payload,
    }),
    fetchShopPricingSetup,
    saveShopPricingSetup,
    completeShopPricingSetup,
    fetchShopRateCardSetup: fetchShopPricingSetup,
    saveShopRateCardSetup: saveShopPricingSetup,
    completeShopRateCardSetup: completeShopPricingSetup,
  }
}
