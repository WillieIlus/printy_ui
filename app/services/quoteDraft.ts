/**
 * Quote draft service — Printy_API buyer flow.
 * Uses quote-drafts for draft CRUD, quote-requests for read-only after submission.
 */
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'
import { parseApiError } from '~/utils/api-error'
import type { QuoteDraft, QuoteItem, PreviewPriceResponse } from '~/shared/types'

export type { PreviewPriceResponse }

/** Finishing attachment for a quote item */
export interface QuoteItemFinishingPayload {
  finishing_rate: number
  coverage_qty?: number | null
  price_override?: string | null
  /** For PER_SIDE_PER_SHEET (e.g. lamination): SINGLE, DOUBLE, or BOTH (follows print) */
  apply_to_sides?: 'SINGLE' | 'DOUBLE' | 'BOTH'
}

/** PRODUCT item payload */
export interface AddProductItemPayload {
  item_type: 'PRODUCT'
  product: number
  quantity: number
  pricing_mode?: 'SHEET' | 'LARGE_FORMAT'
  paper?: number | null
  material?: number | null
  sides?: 'SIMPLEX' | 'DUPLEX'
  color_mode?: 'BW' | 'COLOR'
  machine?: number | null
  has_artwork?: boolean
  special_instructions?: string
  finishings?: QuoteItemFinishingPayload[]
}

/** CUSTOM item payload */
export interface AddCustomItemPayload {
  item_type: 'CUSTOM'
  title: string
  spec_text: string
  quantity: number
  chosen_width_mm: number
  chosen_height_mm: number
  paper?: number
  sides?: 'SIMPLEX' | 'DUPLEX'
  color_mode?: 'BW' | 'COLOR'
  has_artwork: boolean
}

export type AddItemPayload = AddProductItemPayload | AddCustomItemPayload

export async function getActiveDraft(shopSlug: string): Promise<QuoteDraft> {
  const api = useApi()
  return await api<QuoteDraft>(API.quoteDraftsActive(shopSlug))
}

/** Read-only view after submission */
export async function getQuoteRequest(id: number): Promise<QuoteDraft> {
  const api = useApi()
  return await api<QuoteDraft>(API.quoteRequestDetail(id))
}

export async function listQuoteRequests(): Promise<QuoteDraft[]> {
  const api = useApi()
  const data = await api<QuoteDraft[] | { results: QuoteDraft[] }>(API.quoteRequests())
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: QuoteDraft[] }).results)) {
    return (data as { results: QuoteDraft[] }).results
  }
  return []
}

export async function addItem(draftId: number, payload: AddItemPayload): Promise<QuoteItem> {
  const api = useApi()
  try {
    return await api<QuoteItem>(API.quoteDraftItems(draftId), {
      method: 'POST',
      body: payload,
    })
  } catch (err) {
    const msg = parseApiError(err, 'Failed to add item to quote')
    throw new Error(msg)
  }
}

export async function updateItem(
  draftId: number,
  itemId: number,
  payload: Partial<AddItemPayload>
): Promise<QuoteItem> {
  const api = useApi()
  return await api<QuoteItem>(API.quoteDraftItemDetail(draftId, itemId), {
    method: 'PATCH',
    body: payload,
  })
}

export async function removeItem(draftId: number, itemId: number): Promise<void> {
  const api = useApi()
  await api(API.quoteDraftItemDetail(draftId, itemId), { method: 'DELETE' })
}

export async function tweakAndAdd(draftId: number, payload: Omit<AddProductItemPayload, 'item_type'>): Promise<QuoteItem> {
  const api = useApi()
  try {
    return await api<QuoteItem>(API.quoteDraftTweakAndAdd(draftId), {
      method: 'POST',
      body: payload,
    })
  } catch (err) {
    const msg = parseApiError(err, 'Failed to tweak and add item')
    throw new Error(msg)
  }
}

/** Update existing tweaked item and recompute pricing */
export async function updateTweakedItem(
  itemId: number,
  payload: Partial<Omit<AddProductItemPayload, 'item_type' | 'product'>>
): Promise<QuoteItem> {
  // #region agent log
  fetch('http://127.0.0.1:7849/ingest/b9715b76-1be8-4df8-8834-bd23c89fb22c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'981bc1'},body:JSON.stringify({sessionId:'981bc1',location:'quoteDraft.ts:updateTweakedItem',message:'PATCH payload',data:{itemId,payload},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  const api = useApi()
  return await api<QuoteItem>(API.tweakedItemDetail(itemId), {
    method: 'PATCH',
    body: payload,
  })
}

export async function previewPrice(draftId: number): Promise<PreviewPriceResponse> {
  const api = useApi()
  return await api<PreviewPriceResponse>(API.quoteDraftPreviewPrice(draftId), {
    method: 'POST',
  })
}

export async function requestQuote(draftId: number): Promise<QuoteDraft> {
  const api = useApi()
  return await api<QuoteDraft>(API.quoteDraftRequestQuote(draftId), {
    method: 'POST',
  })
}
