/**
 * Quote draft service — Printy_API buyer flow.
 * Uses quote-drafts for draft CRUD, quote-requests for read-only after submission.
 */
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'
import { parseApiError } from '~/utils/api-error'
import type { QuoteDraft, QuoteDraftFile, QuoteItem, PreviewPriceResponse } from '~/shared/types/buyer'

export type { PreviewPriceResponse }
type ApiClient = ReturnType<typeof useApi>
export type QuoteDraftFileScope = 'draft' | 'dashboard'

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

export async function getActiveDraft(
  shopSlug: string,
  fileId?: number | null,
  api: ApiClient = useApi()
): Promise<QuoteDraft> {
  return await api<QuoteDraft>(API.quoteDraftsActive(shopSlug, fileId))
}

/** Read-only view after submission */
export async function getQuoteRequest(id: number, api: ApiClient = useApi()): Promise<QuoteDraft> {
  return await api<QuoteDraft>(API.quoteRequestDetail(id))
}

export async function listQuoteRequests(api: ApiClient = useApi()): Promise<QuoteDraft[]> {
  const data = await api<QuoteDraft[] | { results: QuoteDraft[] }>(API.quoteRequests())
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: QuoteDraft[] }).results)) {
    return (data as { results: QuoteDraft[] }).results
  }
  return []
}

export async function addItem(
  draftId: number,
  payload: AddItemPayload,
  api: ApiClient = useApi()
): Promise<QuoteItem> {
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
  payload: Partial<AddItemPayload>,
  api: ApiClient = useApi()
): Promise<QuoteItem> {
  return await api<QuoteItem>(API.quoteDraftItemDetail(draftId, itemId), {
    method: 'PATCH',
    body: payload,
  })
}

export async function removeItem(draftId: number, itemId: number, api: ApiClient = useApi()): Promise<void> {
  await api(API.quoteDraftItemDetail(draftId, itemId), { method: 'DELETE' })
}

export async function tweakAndAdd(
  draftId: number,
  payload: Omit<AddProductItemPayload, 'item_type'>,
  api: ApiClient = useApi()
): Promise<QuoteItem> {
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
  payload: Partial<Omit<AddProductItemPayload, 'item_type' | 'product'>>,
  api: ApiClient = useApi()
): Promise<QuoteItem> {
  return await api<QuoteItem>(API.tweakedItemDetail(itemId), {
    method: 'PATCH',
    body: payload,
  })
}

export async function previewPrice(draftId: number, api: ApiClient = useApi()): Promise<PreviewPriceResponse> {
  return await api<PreviewPriceResponse>(API.quoteDraftPreviewPrice(draftId), {
    method: 'POST',
  })
}

export async function requestQuote(draftId: number, api: ApiClient = useApi()): Promise<QuoteDraft> {
  return await api<QuoteDraft>(API.quoteDraftRequestQuote(draftId), {
    method: 'POST',
  })
}

export async function listQuoteDraftFiles(
  api: ApiClient = useApi(),
  scope: QuoteDraftFileScope = 'draft'
): Promise<QuoteDraftFile[]> {
  return await api<QuoteDraftFile[]>(API.quoteDraftFiles(), {
    params: scope === 'dashboard' ? { scope: 'dashboard' } : undefined,
  })
}

export async function getQuoteDraftFile(
  fileId: number,
  api: ApiClient = useApi(),
  scope: QuoteDraftFileScope = 'draft'
): Promise<QuoteDraftFile> {
  return await api<QuoteDraftFile>(API.quoteDraftFileDetail(fileId), {
    params: scope === 'dashboard' ? { scope: 'dashboard' } : undefined,
  })
}

export async function createQuoteDraftFile(
  payload: Partial<QuoteDraftFile> & { company_name: string },
  api: ApiClient = useApi()
): Promise<QuoteDraftFile> {
  return await api<QuoteDraftFile>(API.quoteDraftFiles(), {
    method: 'POST',
    body: payload,
  })
}

export async function updateQuoteDraftFile(
  fileId: number,
  payload: Partial<QuoteDraftFile>,
  api: ApiClient = useApi()
): Promise<QuoteDraftFile> {
  return await api<QuoteDraftFile>(API.quoteDraftFileDetail(fileId), {
    method: 'PATCH',
    body: payload,
  })
}

export async function downloadQuoteDraftPdf(draftId: number, api: ApiClient = useApi()): Promise<Blob> {
  return await api<Blob>(API.quoteDraftDownloadPdf(draftId), {
    method: 'GET',
    responseType: 'blob',
  })
}

export async function downloadQuoteDraftFilePdf(
  fileId: number,
  api: ApiClient = useApi(),
  scope: QuoteDraftFileScope = 'draft'
): Promise<Blob> {
  return await api<Blob>(API.quoteDraftFileDownloadPdf(fileId), {
    method: 'GET',
    params: scope === 'dashboard' ? { scope: 'dashboard' } : undefined,
    responseType: 'blob',
  })
}

export async function previewQuoteDraftFileWhatsapp(
  fileId: number,
  api: ApiClient = useApi()
): Promise<{ message: string }> {
  return await api<{ message: string }>(API.quoteDraftFileWhatsappPreview(fileId))
}
