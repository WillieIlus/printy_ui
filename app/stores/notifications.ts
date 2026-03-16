/**
 * Notifications store — unread count for badge, lightweight polling.
 */
import type { Notification } from '~/shared/types/notification'

export const useNotificationsStore = defineStore('notifications', () => {
  const unreadCount = ref(0)
  const notifications = ref<Notification[]>([])

  async function fetchUnreadCount() {
    const { getUnreadCount } = useNotifications()
    try {
      unreadCount.value = await getUnreadCount()
    } catch {
      unreadCount.value = 0
    }
  }

  async function fetchNotifications() {
    const { list } = useNotifications()
    try {
      notifications.value = await list()
      unreadCount.value = notifications.value.filter((n) => !n.is_read).length
    } catch {
      notifications.value = []
    }
  }

  function decrementUnread(by = 1) {
    unreadCount.value = Math.max(0, unreadCount.value - by)
  }

  function setNotificationRead(id: number) {
    const n = notifications.value.find((x) => x.id === id)
    if (n && !n.is_read) {
      n.is_read = true
      n.read_at = new Date().toISOString()
      decrementUnread()
    }
  }

  return {
    unreadCount: readonly(unreadCount),
    notifications: readonly(notifications),
    fetchUnreadCount,
    fetchNotifications,
    decrementUnread,
    setNotificationRead,
  }
})
