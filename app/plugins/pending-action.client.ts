import { useAuthStore } from '~/stores/auth'
import { usePrintyToast } from '~/composables/usePrintyToast'
import { usePendingActionStore } from '~/stores/pendingAction'
import { useQuoteRequestBlast } from '~/composables/useQuoteRequestBlast'
import { useQuoteDraftStore } from '~/stores/quoteDraft'
import { useCalculatorDraftRecoveryStore } from '~/stores/calculatorDraftRecovery'
import type { AddProductItemPayload } from '~/services/quoteDraft'

type SaveAndSendPayload = Parameters<ReturnType<typeof useQuoteRequestBlast>['saveAndSend']>[0]
type AddTweakedProductPayload = {
  shopSlug: string
  payload: AddProductItemPayload
}

function isSaveAndSendPayload(payload: unknown): payload is SaveAndSendPayload {
  return Boolean(
    payload
    && typeof payload === 'object'
    && Array.isArray((payload as { selectedShopIds?: unknown }).selectedShopIds),
  )
}

function isAddTweakedProductPayload(payload: unknown): payload is AddTweakedProductPayload {
  return Boolean(
    payload
    && typeof payload === 'object'
    && typeof (payload as { shopSlug?: unknown }).shopSlug === 'string'
    && typeof (payload as { payload?: unknown }).payload === 'object',
  )
}

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const authStore = useAuthStore()
  const pendingActionStore = usePendingActionStore()
  const { saveAndSend } = useQuoteRequestBlast()
  const quoteDraftStore = useQuoteDraftStore()
  const calculatorDraftRecoveryStore = useCalculatorDraftRecoveryStore()
  const toast = usePrintyToast()

  // Watch for authentication to trigger pending actions
  watch(
    () => authStore.isAuthenticated,
    async (authenticated) => {
      if (authenticated) {
        calculatorDraftRecoveryStore.handleAuthenticatedUser()
      }

      if (authenticated && pendingActionStore.action) {
        const { name, payload } = pendingActionStore.action

        if (name === 'saveAndSend') {
          // Small delay to ensure stores are ready
          setTimeout(async () => {
            try {
              if (isSaveAndSendPayload(payload)) {
                await saveAndSend(payload)
              }
              pendingActionStore.clearAction()
            } catch (err) {
              console.error('Failed to execute pending action:', err)
              pendingActionStore.clearAction()
            }
          }, 500)
        } else if (name === 'addTweakedProductToQuote') {
          setTimeout(async () => {
            try {
              if (isAddTweakedProductPayload(payload)) {
                await quoteDraftStore.addTweakedProductToQuote(payload.shopSlug, payload.payload)
              }
              toast.quoteSaved()
              pendingActionStore.clearAction()
            } catch (err) {
              console.error('Failed to execute pending action:', err)
              pendingActionStore.clearAction()
            }
          }, 500)
        }
      }
    },
    { immediate: true },
  )
})
