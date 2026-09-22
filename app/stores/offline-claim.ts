import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import type { OfflineQuoteClaimResult } from '~/shared/types'

/**
 * Claims a walk-in / offline quote onto the signed-in client account using the
 * claim token printed on the offline quote link.
 */
export const useOfflineClaimStore = defineStore('offlineClaim', {
  state: () => ({
    claiming: false,
    result: null as OfflineQuoteClaimResult | null,
    error: '' as string,
  }),
  getters: {
    claimed: (state) => Boolean(state.result?.quote_request_id),
  },
  actions: {
    async claim(token: string) {
      const { api } = useApi()
      this.claiming = true
      this.error = ''
      try {
        this.result = await api<OfflineQuoteClaimResult>(API.offlineClaim.claim, {
          method: 'POST',
          body: { claim_token: token },
        })
        return this.result
      } finally {
        this.claiming = false
      }
    },
    reset() {
      this.result = null
      this.error = ''
    },
  },
})
