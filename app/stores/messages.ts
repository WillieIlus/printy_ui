import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { normalizeApiList } from '~/shared/api'
import type { InboxMessage } from '~/shared/types'

/**
 * Quote inbox (port of the old app's client/shop message inbox).
 *
 * A single store fronts both inboxes because the payload shape is identical —
 * only the endpoint family (client vs shop) changes. The backend scopes every
 * query to the authenticated participant, so switching `mode` is safe.
 */

export type InboxMode = 'client' | 'shop'

const POLL_INTERVAL_MS = 20000

interface InboxPaths {
  list: string
  outbox: string
  unread: string
  markAllRead: string
  read: (id: number | string) => string
}

function pathsFor(mode: InboxMode): InboxPaths {
  return mode === 'shop'
    ? {
        list: API.messages.shop,
        outbox: `${API.messages.shop}outbox/`,
        unread: API.messages.shopUnread,
        markAllRead: `${API.messages.shop}mark-all-read/`,
        read: API.messages.shopRead,
      }
    : {
        list: API.messages.client,
        outbox: `${API.messages.client}outbox/`,
        unread: API.messages.clientUnread,
        markAllRead: `${API.messages.client}mark-all-read/`,
        read: API.messages.clientRead,
      }
}

export const useMessagesStore = defineStore('messages', {
  state: () => ({
    mode: 'client' as InboxMode,
    items: [] as InboxMessage[],
    totalUnread: 0,
    loading: false,
    error: '' as string,
  }),
  getters: {
    unreadCount: (state) => state.totalUnread,
    inbound: (state) => state.items.filter((message) => message.direction === 'inbound'),
    hasMessages: (state) => state.items.length > 0,
  },
  actions: {
    setMode(mode: InboxMode) {
      if (this.mode !== mode) {
        this.mode = mode
        this.items = []
        this.totalUnread = 0
        this.error = ''
      }
    },
    async fetch(mode?: InboxMode) {
      const target = mode ?? this.mode
      this.setMode(target)
      const { api } = useApi()
      const paths = pathsFor(target)
      this.loading = true
      this.error = ''
      try {
        const [list, unread] = await Promise.all([
          api<InboxMessage[] | { results: InboxMessage[] }>(paths.list, { method: 'GET' }),
          api<{ unread_count: number }>(paths.unread, { method: 'GET' }),
        ])
        this.items = normalizeApiList(list) as InboxMessage[]
        this.totalUnread = unread.unread_count ?? 0
      } catch {
        this.error = "We couldn't load your messages."
      } finally {
        this.loading = false
      }
    },
    async markRead(message: InboxMessage) {
      if (message.read_at) {
        return
      }
      const { api } = useApi()
      const paths = pathsFor(this.mode)
      this.totalUnread = Math.max(0, this.totalUnread - 1)
      message.read_at = new Date().toISOString()
      try {
        await api<InboxMessage>(paths.read(message.id), { method: 'POST' })
      } catch {
        this.fetch()
      }
    },
    async markAllRead() {
      if (this.totalUnread === 0) {
        return
      }
      const { api } = useApi()
      const paths = pathsFor(this.mode)
      try {
        await api<{ marked_read: number }>(paths.markAllRead, { method: 'POST' })
        this.items.forEach((message) => { message.read_at = message.read_at ?? new Date().toISOString() })
        this.totalUnread = 0
      } catch {
        this.fetch()
      }
    },
  },
})

export function startMessagePolling(store = useMessagesStore(), intervalMs = POLL_INTERVAL_MS) {
  if (!import.meta.client) {
    return () => {}
  }
  const timer = window.setInterval(() => { store.fetch() }, intervalMs)
  return () => window.clearInterval(timer)
}
