/**
 * Notifications API — list, mark read, unread count.
 */
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'
import type { ActivityBadgeSummary } from '~/shared/types/activityBadges'
import type { Notification } from '~/shared/types/notification'

export function useNotifications() {
  const api = useApi()

  async function list(): Promise<Notification[]> {
    const data = await api<Notification[] | { results: Notification[] }>(API.notifications())
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function getUnreadCount(): Promise<number> {
    const data = await api<{ count: number }>(API.notificationUnreadCount())
    return data?.count ?? 0
  }

  async function getActivitySummary(shopSlug?: string | null): Promise<ActivityBadgeSummary> {
    return api<ActivityBadgeSummary>(API.notificationActivitySummary(), {
      params: shopSlug ? { shop_slug: shopSlug } : undefined,
    })
  }

  async function markRead(id: number): Promise<Notification> {
    return api<Notification>(API.notificationMarkRead(id), { method: 'POST', body: {} })
  }

  async function markAllRead(): Promise<number> {
    const data = await api<{ marked: number }>(API.notificationMarkAllRead(), {
      method: 'POST',
      body: {},
    })
    return data?.marked ?? 0
  }

  return { list, getUnreadCount, getActivitySummary, markRead, markAllRead }
}
