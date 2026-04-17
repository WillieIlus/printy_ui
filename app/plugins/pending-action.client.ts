import { useAuthStore } from '~/stores/auth'
import { usePendingActionStore } from '~/stores/pendingAction'
import { useQuoteRequestBlast } from '~/composables/useQuoteRequestBlast'
import { useQuoteDraftStore } from '~/stores/quoteDraft'

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const authStore = useAuthStore()
  const pendingActionStore = usePendingActionStore()
  const { saveAndSend } = useQuoteRequestBlast()
  const quoteDraftStore = useQuoteDraftStore()
  const { t } = useI18n()
  const toast = useToast()

  // Watch for authentication to trigger pending actions
  watch(
    () => authStore.isAuthenticated,
    async (authenticated) => {
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
                title: t('shop.addedToQuoteTitle'),
                description: t('shop.addedToQuoteDescription', { name: payload.payload.name || 'Product' }),
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
