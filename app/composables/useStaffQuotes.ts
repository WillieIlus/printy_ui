/**
 * Staff quotes API composable.
 * Uses JWT via $api (Authorization: Bearer).
 * Backend: /api/quotes/ (staff-only).
 */
import { API } from '~/shared/api-paths'
import type { StaffQuote, StaffQuoteItem, StaffPricingSnapshot } from '~/shared/types'

export interface StaffQuoteCreatePayload {
  shop: number
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  notes?: string
}

export interface StaffQuoteItemPayload {
  item_type: 'PRODUCT'
  product: number
  quantity: number
  paper?: number | null
  material?: number | null
  chosen_width_mm?: number | null
  chosen_height_mm?: number | null
  sides?: string
  color_mode?: string
  machine?: number | null
  special_instructions?: string
  finishings?: { finishing_rate: number; price_override?: string | null }[]
}

export interface StaffQuoteListParams {
  status?: string
  created_by?: number
  product?: number
  shop?: number
  date_from?: string
  date_to?: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export function useStaffQuotes() {
  const { $api } = useNuxtApp()

  async function list(params?: StaffQuoteListParams): Promise<PaginatedResponse<StaffQuote>> {
    return $api<PaginatedResponse<StaffQuote>>(API.staffQuotes(), { params })
  }

  async function get(id: number): Promise<StaffQuote> {
    return $api<StaffQuote>(API.staffQuoteDetail(id))
  }

  async function create(payload: StaffQuoteCreatePayload): Promise<StaffQuote> {
    return $api<StaffQuote>(API.staffQuotes(), { method: 'POST', body: payload })
  }

  async function addItem(quoteId: number, payload: StaffQuoteItemPayload): Promise<StaffQuoteItem> {
    return $api<StaffQuoteItem>(API.staffQuoteItems(quoteId), { method: 'POST', body: payload })
  }

  async function updateItem(
    quoteId: number,
    itemId: number,
    payload: Partial<StaffQuoteItemPayload>
  ): Promise<StaffQuoteItem> {
    return $api<StaffQuoteItem>(API.staffQuoteItemDetail(quoteId, itemId), {
      method: 'PATCH',
      body: payload,
    })
  }

  async function deleteItem(quoteId: number, itemId: number): Promise<void> {
    return $api(API.staffQuoteItemDetail(quoteId, itemId), { method: 'DELETE' })
  }

  async function send(quoteId: number): Promise<StaffQuote> {
    return $api<StaffQuote>(API.staffQuoteSend(quoteId), {
      method: 'POST',
      body: {},
    })
  }

  async function whatsappPreview(quoteId: number): Promise<{ message: string }> {
    return $api<{ message: string }>(API.staffQuoteWhatsappPreview(quoteId), {
      method: 'POST',
      body: {},
    })
  }

  return {
    list,
    get,
    create,
    addItem,
    updateItem,
    deleteItem,
    send,
    whatsappPreview,
  }
}
