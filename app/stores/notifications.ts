import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { normalizeApiList } from '~/shared/api'
import type { ApiListResponse, PrintyNotification } from '~/shared/types'

const POLL_INTERVAL_MS = 15000

/**
 * Poll-backed in-app notifications (Phase 4 decision: DB-backed + short-interval
 * polling; real-time WebSockets are a later upgrade over the same model).
 *
 * The backend guarantees the list endpoint is scoped to the authenticated user,
 * paginated (page size 20) and newest-first, so a small poll surface stays cheap.
 */
export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    items: [] as PrintyNotification[],
    totalUnread: 0,
    loading: false,
    error: '' as string,
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
    async markRead(notification: PrintyNotification) {
      if (notification.is_read) {
        return
      }
      const { api } = useApi()
      this.totalUnread = Math.max(0, this.totalUnread - 1)
      try {
        await api<{ status: string }>(API.notifications.markRead(notification.id), {
          method: 'PATCH',
        })
        notification.is_read = true
        notification.read_at = new Date().toISOString()
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