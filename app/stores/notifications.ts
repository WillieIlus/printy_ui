import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { normalizeApiList } from '~/shared/api'
import type { ApiListResponse, PrintyNotification } from '~/shared/types'

const POLL_INTERVAL_MS = 45000

export type NotificationFilter = 'all' | 'unread' | 'action_needed'

function extractCursor(next?: string | null): string | null {
  if (!next) {
    return null
  }
  try {
    return new URL(next, 'http://localhost').searchParams.get('cursor')
  } catch {
    return null
  }
}

/**
 * Poll-backed in-app notifications (DB-backed structured records + short-interval
 * polling; SSE is a later upgrade over the same model).
 *
 * `fetch()` powers the bell popover (page-based list, newest first). `fetchFeed()`
 * powers the full /notifications page using the cursor feed so new arrivals never
 * shift the page under the reader.
 */
export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    items: [] as PrintyNotification[],
    totalUnread: 0,
    loading: false,
    loadingMore: false,
    error: '' as string,
    filter: 'all' as NotificationFilter,
    nextCursor: null as string | null,
    hasMore: false,
  }),
  getters: {
    unreadCount: (state) => state.totalUnread,
  },
  actions: {
    async fetch() {
      const { api } = useApi()
      this.loading = true
      this.error = ''
      try {
        const [list, unread] = await Promise.all([
          api<ApiListResponse<PrintyNotification>>(API.notifications.list),
          api<{ count: number }>(API.notifications.unreadCount),
        ])
        this.items = normalizeApiList(list) as PrintyNotification[]
        this.totalUnread = unread.count ?? this.totalUnread
      } catch {
        this.error = "We couldn't load your notifications."
      } finally {
        this.loading = false
      }
    },
    async fetchFeed(filter?: NotificationFilter) {
      const { api } = useApi()
      const target = filter ?? this.filter
      this.filter = target
      this.loading = true
      this.error = ''
      this.nextCursor = null
      this.hasMore = false
      try {
        const [feed, unread] = await Promise.all([
          api<ApiListResponse<PrintyNotification>>(
            API.notifications.feed,
            target === 'all' ? undefined : { query: { filter: target } },
          ),
          api<{ count: number }>(API.notifications.unreadCount),
        ])
        this.items = normalizeApiList(feed) as PrintyNotification[]
        this.nextCursor = extractCursor(feed.next)
        this.hasMore = Boolean(feed.next)
        this.totalUnread = unread.count ?? this.totalUnread
      } catch {
        this.error = "We couldn't load your notifications."
      } finally {
        this.loading = false
      }
    },
    async loadMore() {
      if (!this.nextCursor || this.loadingMore) {
        return
      }
      const { api } = useApi()
      this.loadingMore = true
      try {
        const query: Record<string, string> = { cursor: this.nextCursor }
        if (this.filter !== 'all') {
          query.filter = this.filter
        }
        const feed = await api<ApiListResponse<PrintyNotification>>(API.notifications.feed, { query })
        this.items = [...this.items, ...(normalizeApiList(feed) as PrintyNotification[])]
        this.nextCursor = extractCursor(feed.next)
        this.hasMore = Boolean(feed.next)
      } catch {
        this.error = "We couldn't load more notifications."
      } finally {
        this.loadingMore = false
      }
    },
    async markRead(notification: PrintyNotification) {
      if (notification.is_read) {
        return
      }
      const { api } = useApi()
      this.totalUnread = Math.max(0, this.totalUnread - 1)
      notification.is_read = true
      notification.read_at = new Date().toISOString()
      try {
        await api<{ status: string }>(API.notifications.markRead(notification.id), {
          method: 'PATCH',
        })
      } catch {
        this.fetch()
      }
    },
    async markAllRead() {
      if (this.totalUnread === 0) {
        return
      }
      const { api } = useApi()
      try {
        await api<{ marked: number }>(API.notifications.markAllRead, { method: 'PATCH' })
        this.items.forEach((item) => { item.is_read = true })
        this.totalUnread = 0
      } catch {
        this.fetch()
      }
    },
  },
})

export function startNotificationPolling(store = useNotificationsStore(), intervalMs = POLL_INTERVAL_MS) {
  if (!import.meta.client) {
    return () => {}
  }
  const timer = window.setInterval(() => { store.fetch() }, intervalMs)
  return () => window.clearInterval(timer)
}
