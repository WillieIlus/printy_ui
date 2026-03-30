import type { QuoteRequest } from '~/shared/types/quoteRequest'
import { useAuthStore } from '~/stores/auth'
import { useQuoteInboxStore } from '~/stores/quoteInbox'

interface BlastPayload {
  title: string
  shop?: number | null
  selectedProduct?: number | null
  calculatorInputsSnapshot: Record<string, unknown>
  pricingSnapshot?: Record<string, unknown> | null
  customProductSnapshot?: Record<string, unknown> | null
  requestDetailsSnapshot?: Record<string, unknown> | null
  selectedShopIds: number[]
  loginRedirectPath?: string
}

export function useQuoteRequestBlast() {
  const authStore = useAuthStore()
  const quoteInboxStore = useQuoteInboxStore()
  const toast = useToast()

  async function saveAndSend(payload: BlastPayload): Promise<QuoteRequest[] | null> {
    if (!payload.selectedShopIds.length) {
      toast.add({ title: 'No shops selected', description: 'Select at least one shop before sending.', color: 'warning' })
      return null
    }

    if (!authStore.isAuthenticated) {
      await navigateTo({
        path: '/auth/login',
        query: { redirect: payload.loginRedirectPath || '/quote-draft' },
      })
      return null
    }

    if (!authStore.isClient) {
      toast.add({ title: 'Client account required', description: 'Only client accounts can send quote requests to shops.', color: 'warning' })
      return null
    }

    const draft = await quoteInboxStore.saveDraft({
      title: payload.title,
      shop: payload.shop ?? null,
      selected_product: payload.selectedProduct ?? null,
      calculator_inputs_snapshot: payload.calculatorInputsSnapshot,
      pricing_snapshot: payload.pricingSnapshot ?? null,
      custom_product_snapshot: payload.customProductSnapshot ?? null,
      request_details_snapshot: payload.requestDetailsSnapshot ?? {},
    })

    return await quoteInboxStore.sendDraft(
      draft.id,
      payload.selectedShopIds,
      payload.requestDetailsSnapshot ?? {},
    )
  }

  async function sendSavedDraft(
    draftId: number,
    selectedShopIds: number[],
    requestDetailsSnapshot?: Record<string, unknown> | null,
  ): Promise<QuoteRequest[] | null> {
    if (!selectedShopIds.length) {
      toast.add({ title: 'No shops selected', description: 'Select at least one shop before sending.', color: 'warning' })
      return null
    }
    return await quoteInboxStore.sendDraft(draftId, selectedShopIds, requestDetailsSnapshot ?? {})
  }

  return {
    saveAndSend,
    sendSavedDraft,
  }
}
