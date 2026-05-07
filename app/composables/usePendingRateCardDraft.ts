import { API } from '~/shared/api-paths'
import { LEGACY_PENDING_RATE_CARD_DRAFT_KEY, PENDING_RATE_CARD_DRAFT_KEY, ROUTES } from '~/shared/routes'
import { useApi } from '~/shared/api'

type StoredPaperRow = {
  key?: string
  single_side_price?: string | number | null
  double_side_price?: string | number | null
  active?: boolean
}

type StoredFinishingRow = {
  key?: string
  price?: string | number | null
  active?: boolean
}

type StoredDraft = {
  paper_rows?: StoredPaperRow[]
  finishing_rows?: StoredFinishingRow[]
  shop_details?: {
    shop_name?: string
    whatsapp_number?: string
    location_area?: string
  }
}

type SaveDraftResponse = {
  redirect_url?: string
}

function readStoredDraft(): StoredDraft | null {
  if (!import.meta.client) return null
  const raw = window.localStorage.getItem(PENDING_RATE_CARD_DRAFT_KEY)
    ?? window.localStorage.getItem(LEGACY_PENDING_RATE_CARD_DRAFT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredDraft
  } catch {
    return null
  }
}

export function usePendingRateCardDraft() {
  const api = useApi()

  function hasPendingDraft() {
    const draft = readStoredDraft()
    return Boolean(
      draft
      && (draft.paper_rows?.length || draft.finishing_rows?.length),
    )
  }

  async function savePendingDraftAfterAuth() {
    const draft = readStoredDraft()
    if (!draft) {
      return { handled: false, redirectUrl: ROUTES.shopSetup }
    }

    const response = await api<SaveDraftResponse>(API.forShopsRateCardSave(), {
      method: 'POST',
      body: {
        shop: {
          name: draft.shop_details?.shop_name ?? '',
          whatsapp: draft.shop_details?.whatsapp_number ?? '',
          location: draft.shop_details?.location_area ?? '',
        },
        paper_prices: (draft.paper_rows || []).map(row => ({
          key: row.key,
          single_side_price: row.single_side_price ?? null,
          double_side_price: row.double_side_price ?? null,
          active: Boolean(row.active),
        })),
        finishings: (draft.finishing_rows || []).map(row => ({
          key: row.key,
          price: row.price ?? null,
          active: Boolean(row.active),
        })),
      },
    })

    if (import.meta.client) {
      window.localStorage.removeItem(PENDING_RATE_CARD_DRAFT_KEY)
      window.localStorage.removeItem(LEGACY_PENDING_RATE_CARD_DRAFT_KEY)
    }

    return {
      handled: true,
      redirectUrl: response.redirect_url || ROUTES.shopSetup,
    }
  }

  return {
    hasPendingDraft,
    savePendingDraftAfterAuth,
  }
}
