/**
 * Quote draft service - Printy_API buyer flow.
 * Uses quote-drafts for draft CRUD, quote-requests for read-only after submission.
 */
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import type { PreviewPriceResponse, QuoteDraft, QuoteDraftFile, QuoteItem } from '~/shared/types/buyer'
import type { QuoteRequest } from '~/shared/types/quoteRequest'
import { parseApiError } from '~/utils/api-error'

export type { PreviewPriceResponse }

type ApiClient = ReturnType<typeof useApi>
export type QuoteDraftFileScope = 'draft' | 'dashboard'

export interface QuoteDraftFileWhatsappPreview {
  message: string
  customer?: {
    label?: string
    company_name?: string
    contact_name?: string
    contact_email?: string
    contact_phone?: string
  }
  shop_count?: number
  item_count?: number
  status?: string
}

function resolveApi(api?: ApiClient): ApiClient {
  return api ?? useApi()
}

async function getBlob(url: string, options?: Record<string, unknown>): Promise<Blob> {
  const { $api } = useNuxtApp()
  return await ($api as (request: string, opts?: object) => Promise<Blob>)(url, {
    ...(options ?? {}),
    responseType: 'blob',
  })
}

/** Finishing attachment for a quote item */
export interface QuoteItemFinishingPayload {
  finishing_rate: number
  coverage_qty?: number | null
  price_override?: string | null
  /** For PER_SIDE_PER_SHEET (e.g. lamination): SINGLE, DOUBLE, or BOTH (follows print) */
  apply_to_sides?: 'SINGLE' | 'DOUBLE' | 'BOTH'
  selected_side?: 'front' | 'back' | 'both'
}

export interface QuoteItemAttachmentRecord {
  id: number
  file: string
  name: string
  created_at: string
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
  spec_text?: string
  quantity: number
  pricing_mode?: 'SHEET' | 'LARGE_FORMAT'
  chosen_width_mm?: number | null
  chosen_height_mm?: number | null
  paper?: number | null
  material?: number | null
  sides?: 'SIMPLEX' | 'DUPLEX'
  color_mode?: 'BW' | 'COLOR'
  finishings?: QuoteItemFinishingPayload[]
  item_spec_snapshot?: Record<string, unknown>
  has_artwork?: boolean
  machine?: number | null
  special_instructions?: string
}

export type AddItemPayload = AddProductItemPayload | AddCustomItemPayload

export async function getActiveDraft(
  shopSlug: string,
  fileId?: number | null,
  api?: ApiClient
): Promise<QuoteDraft> {
  return await resolveApi(api).get<QuoteDraft>(API.quoteDraftsActive(shopSlug, fileId))
}

/** Read-only view after submission */
export async function getQuoteRequest(id: number, api?: ApiClient): Promise<QuoteDraft> {
  return await resolveApi(api).get<QuoteDraft>(API.quoteRequestDetail(id))
}

export async function listQuoteRequests(api?: ApiClient): Promise<QuoteDraft[]> {
  const data = await resolveApi(api).get<QuoteDraft[] | { results: QuoteDraft[] }>(API.quoteRequests())
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: QuoteDraft[] }).results)) {
    return (data as { results: QuoteDraft[] }).results
  }
  return []
}

export async function addItem(
  draftId: number,
  payload: AddItemPayload,
  api?: ApiClient
): Promise<QuoteItem> {
  try {
    return await resolveApi(api).post<QuoteItem>(API.quoteDraftItems(draftId), payload as unknown as Record<string, unknown>)
  } catch (err) {
    throw new Error(parseApiError(err, 'Failed to add item to quote'))
  }
}

export async function updateItem(
  draftId: number,
  itemId: number,
  payload: Partial<AddItemPayload>,
  api?: ApiClient
): Promise<QuoteItem> {
  return await resolveApi(api).patch<QuoteItem>(API.quoteDraftItemDetail(draftId, itemId), payload as unknown as Record<string, unknown>)
}

export async function removeItem(draftId: number, itemId: number, api?: ApiClient): Promise<void> {
  await resolveApi(api).del<void>(API.quoteDraftItemDetail(draftId, itemId))
}

export async function tweakAndAdd(
  draftId: number,
  payload: Omit<AddProductItemPayload, 'item_type'>,
  api?: ApiClient
): Promise<QuoteItem> {
  try {
    return await resolveApi(api).post<QuoteItem>(API.quoteDraftTweakAndAdd(draftId), payload as unknown as Record<string, unknown>)
  } catch (err) {
    throw new Error(parseApiError(err, 'Failed to tweak and add item'))
  }
}

/** Update existing tweaked item and recompute pricing */
export async function updateTweakedItem(
  itemId: number,
  payload: Partial<Omit<AddProductItemPayload, 'item_type' | 'product'>>,
  api?: ApiClient
): Promise<QuoteItem> {
  return await resolveApi(api).patch<QuoteItem>(API.tweakedItemDetail(itemId), payload as unknown as Record<string, unknown>)
}

export async function previewPrice(draftId: number, api?: ApiClient): Promise<PreviewPriceResponse> {
  return await resolveApi(api).post<PreviewPriceResponse>(API.quoteDraftPreviewPrice(draftId), {})
}

export async function requestQuote(draftId: number, api?: ApiClient): Promise<QuoteDraft> {
  return await resolveApi(api).post<QuoteDraft>(API.quoteDraftRequestQuote(draftId), {})
}

export async function requestQuoteItem(
  draftId: number,
  itemId: number,
  api?: ApiClient,
): Promise<QuoteRequest> {
  return await resolveApi(api).post<QuoteRequest>(API.quoteDraftItemRequestQuote(draftId, itemId), {})
}

export async function uploadQuoteItemAttachment(
  draftId: number,
  itemId: number,
  file: File,
  name?: string,
  api?: ApiClient,
): Promise<QuoteItemAttachmentRecord> {
  const formData = new FormData()
  formData.append('file', file)
  if (name) formData.append('name', name)
  return await resolveApi(api).post<QuoteItemAttachmentRecord>(API.quoteDraftItemAttachments(draftId, itemId), formData)
}

export async function removeQuoteItemAttachment(
  draftId: number,
  itemId: number,
  attachmentId: number,
  api?: ApiClient,
): Promise<void> {
  await resolveApi(api).del<void>(API.quoteDraftItemAttachmentDetail(draftId, itemId, attachmentId))
}

export async function listQuoteDraftFiles(
  api?: ApiClient,
  scope: QuoteDraftFileScope = 'draft'
): Promise<QuoteDraftFile[]> {
  const params = scope === 'dashboard' ? { scope: 'dashboard' } : undefined
  return await resolveApi(api).get<QuoteDraftFile[]>(API.quoteDraftFiles(), params)
}

export async function getQuoteDraftFile(
  fileId: number,
  api?: ApiClient,
  scope: QuoteDraftFileScope = 'draft'
): Promise<QuoteDraftFile> {
  const params = scope === 'dashboard' ? { scope: 'dashboard' } : undefined
  return await resolveApi(api).get<QuoteDraftFile>(API.quoteDraftFileDetail(fileId), params)
}

export async function createQuoteDraftFile(
  payload: Partial<QuoteDraftFile> & { company_name: string },
  api?: ApiClient
): Promise<QuoteDraftFile> {
  return await resolveApi(api).post<QuoteDraftFile>(API.quoteDraftFiles(), payload as Record<string, unknown>)
}

export async function updateQuoteDraftFile(
  fileId: number,
  payload: Partial<QuoteDraftFile>,
  api?: ApiClient
): Promise<QuoteDraftFile> {
  return await resolveApi(api).patch<QuoteDraftFile>(API.quoteDraftFileDetail(fileId), payload as Record<string, unknown>)
}

export async function downloadQuoteDraftPdf(draftId: number): Promise<Blob> {
  return await getBlob(API.quoteDraftDownloadPdf(draftId), { method: 'GET' })
}

export async function downloadQuoteDraftFilePdf(
  fileId: number,
  _api?: ApiClient,
  scope: QuoteDraftFileScope = 'draft'
): Promise<Blob> {
  return await getBlob(API.quoteDraftFileDownloadPdf(fileId), {
    method: 'GET',
    params: scope === 'dashboard' ? { scope: 'dashboard' } : undefined,
  })
}

export async function previewQuoteDraftFileWhatsapp(
  fileId: number,
  api?: ApiClient
): Promise<QuoteDraftFileWhatsappPreview> {
  return await resolveApi(api).get<QuoteDraftFileWhatsappPreview>(API.quoteDraftFileWhatsappPreview(fileId))
}
