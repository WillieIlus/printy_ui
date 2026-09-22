import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { normalizeApiList } from '~/shared/api'
import type { ApiListResponse, ClientQuoteResponse, ClientReplyPayload } from '~/shared/types'

/**
 * Client-facing quote responses (offers sent back by print partners).
 *
 * Mirrors the old app's "responses" inbox: the client can accept, reject or
 * counter a received offer. Accepting settles the offer and opens a payment.
 */
export const useClientResponsesStore = defineStore('clientResponses', {
  state: () => ({
    items: [] as ClientQuoteResponse[],
    loading: false,
    actingId: null as number | null,
    error: '' as string,
  }),
  getters: {
    pending: (state) => state.items.filter((item) => ['sent', 'revised', 'modified'].includes(item.status)),
    hasResponses: (state) => state.items.length > 0,
  },
  actions: {
    upsert(updated: Partial<ClientQuoteResponse> & { id: number }) {
      const idx = this.items.findIndex((item) => item.id === updated.id)
      if (idx >= 0) {
        this.items[idx] = { ...this.items[idx]!, ...updated }
      }
    },
    async fetch() {
      const { api } = useApi()
      this.loading = true
      this.error = ''
      try {
        const payload = await api<ApiListResponse<ClientQuoteResponse> | ClientQuoteResponse[]>(API.client.responses)
        this.items = normalizeApiList(payload) as ClientQuoteResponse[]
      } catch {
        this.error = "We couldn't load your quote responses."
      } finally {
        this.loading = false
      }
    },
    async accept(response: ClientQuoteResponse) {
      const { api } = useApi()
      this.actingId = response.id
      try {
        await api<{ status: string }>(API.client.responseAccept(response.id), { method: 'POST' })
        this.upsert({ id: response.id, status: 'accepted' })
      } finally {
        this.actingId = null
      }
    },
    async reject(response: ClientQuoteResponse, reason: string, message = '') {
      const { api } = useApi()
      this.actingId = response.id
      try {
        await api<{ status: string }>(API.client.responseReject(response.id), {
          method: 'POST',
          body: { reason, message },
        })
        this.upsert({ id: response.id, status: 'rejected' })
      } finally {
        this.actingId = null
      }
    },
    async reply(response: ClientQuoteResponse, payload: ClientReplyPayload) {
      const { api } = useApi()
      this.actingId = response.id
      try {
        await api(API.client.responseReply(response.id), { method: 'POST', body: payload })
        this.upsert({ id: response.id, latest_message: payload.message })
      } finally {
        this.actingId = null
      }
    },
  },
})
