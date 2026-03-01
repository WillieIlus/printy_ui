/**
 * Quote draft service — Printy_API buyer flow.
 * Uses quote-drafts for draft CRUD, quote-requests for read-only after submission.
 */
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'
import { parseApiError } from '~/utils/api-error'
import type { QuoteDraft, QuoteItem, PreviewPriceResponse } from '~/shared/types'

export type { PreviewPriceResponse }

/** PRODUCT item payload */
export interface AddProductItemPayload {
  item_type: 'PRODUCT'
  product: number
  quantity: number
  paper?: number
  sides?: 'SIMPLEX' | 'DUPLEX'
  color_mode?: 'BW' | 'COLOR'
  finishing_rate_ids?: number[]
  has_artwork?: boolean
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
