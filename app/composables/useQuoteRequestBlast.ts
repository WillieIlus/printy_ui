import type { QuoteRequest } from '~/shared/types/quoteRequest'
import { useAuthStore } from '~/stores/auth'
import { useCalculatorDraftRecoveryStore } from '~/stores/calculatorDraftRecovery'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import { usePendingActionStore } from '~/stores/pendingAction'
import { usePrintyToast } from '~/composables/usePrintyToast'

interface BlastPayload {
  existingDraftId?: number | null
  title: string
  shop?: number | null
  selectedProduct?: number | null
  calculatorInputsSnapshot: Record<string, unknown>
  pricingSnapshot?: Record<string, unknown> | null
  customProductSnapshot?: Record<string, unknown> | null
  requestDetailsSnapshot?: Record<string, unknown> | null
  selectedShopIds: number[]
  loginRedirectPath?: string
  successRedirectPath?: string
  authPath?: '/auth/login' | '/auth/signup'
}

export function useQuoteRequestBlast() {
  const authStore = useAuthStore()
  const quoteInboxStore = useQuoteInboxStore()
  const draftRecoveryStore = useCalculatorDraftRecoveryStore()
  const pendingActionStore = usePendingActionStore()
  const toast = usePrintyToast()

  async function saveAndSend(payload: BlastPayload): Promise<QuoteRequest[] | null> {
    if (!payload.selectedShopIds.length) {
      toast.warning('No shops selected', 'Select at least one shop before sending.', { context: 'quote' })
      return null
    }

    if (!authStore.isAuthenticated) {
      const authPath = payload.authPath || '/auth/login'
      pendingActionStore.setAction({
        name: 'saveAndSend',
        payload,
        redirectPath: payload.loginRedirectPath || '/quote-draft',
      })

      await navigateTo({
        path: authPath,
        query: {
          redirect: payload.loginRedirectPath || '/quote-draft',
          role: 'client',
        },
      })
      return null
    }

    if (!authStore.isClient) {
      toast.warning('Client account required', 'Only client accounts can send quote requests to shops.', { context: 'quote' })
      return null
    }

    try {
      const draftPayload = {
        title: payload.title,
        shop: payload.shop ?? null,
        selected_product: payload.selectedProduct ?? null,
        calculator_inputs_snapshot: payload.calculatorInputsSnapshot,
        pricing_snapshot: payload.pricingSnapshot ?? null,
        custom_product_snapshot: payload.customProductSnapshot ?? null,
        request_details_snapshot: payload.requestDetailsSnapshot ?? {},
      }
      const draft = payload.existingDraftId
        ? await quoteInboxStore.updateDraft(payload.existingDraftId, draftPayload)
        : await quoteInboxStore.saveDraft(draftPayload)

      toast.quoteSaved()

      if (typeof draft.id !== 'number') {
        throw new Error('Draft was created without an id.')
      }

      const requests = await quoteInboxStore.sendDraft(
        draft.id,
        payload.selectedShopIds,
        payload.requestDetailsSnapshot ?? {},
      )

      if (requests?.length) {
        draftRecoveryStore.markSubmitted()
        toast.quoteSent(requests.length)

        const redirectPath = payload.successRedirectPath
          || (requests.length === 1 ? `/dashboard/client/requests/${requests[0]!.id}` : '/dashboard/client/requests')
        await navigateTo(redirectPath)
      }

      return requests
    } catch (error) {
      toast.quoteFailed(error)
      throw error
    }
  }

  async function sendSavedDraft(
    draftId: number,
    selectedShopIds: number[],
    requestDetailsSnapshot?: Record<string, unknown> | null,
  ): Promise<QuoteRequest[] | null> {
    if (!selectedShopIds.length) {
      toast.warning('No shops selected', 'Select at least one shop before sending.', { context: 'quote' })
      return null
    }
    return await quoteInboxStore.sendDraft(draftId, selectedShopIds, requestDetailsSnapshot ?? {})
  }

  return {
    saveAndSend,
    sendSavedDraft,
  }
}
