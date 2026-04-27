import { useAuthStore } from '~/stores/auth'
import { usePendingActionStore } from '~/stores/pendingAction'
import { useQuoteRequestBlast } from '~/composables/useQuoteRequestBlast'
import { useQuoteDraftStore } from '~/stores/quoteDraft'
import { useCalculatorDraftRecoveryStore } from '~/stores/calculatorDraftRecovery'

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const authStore = useAuthStore()
  const pendingActionStore = usePendingActionStore()
  const { saveAndSend } = useQuoteRequestBlast()
  const quoteDraftStore = useQuoteDraftStore()
  const calculatorDraftRecoveryStore = useCalculatorDraftRecoveryStore()
  const { t } = useI18n()
  const toast = useToast()

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
              await saveAndSend(payload)
              pendingActionStore.clearAction()
            } catch (err) {
              console.error('Failed to execute pending action:', err)
              pendingActionStore.clearAction()
            }
          }, 500)
        } else if (name === 'addTweakedProductToQuote') {
          setTimeout(async () => {
            try {
              await quoteDraftStore.addTweakedProductToQuote(payload.shopSlug, payload.payload)
              toast.add({
                title: 'Added to quote',
                description: `${payload.payload.name || 'Product'} was added to your quote draft.`,
                color: 'success',
              })
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
