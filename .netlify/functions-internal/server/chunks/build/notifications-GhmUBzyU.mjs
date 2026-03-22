import { ref, readonly } from 'vue';
import { j as useApi, A as API } from './server.mjs';
import { defineStore } from 'pinia';

function useNotifications() {
  const api = useApi();
  async function list() {
    const data = await api(API.notifications());
    return Array.isArray(data) ? data : data.results ?? [];
  }
  async function getUnreadCount() {
    const data = await api(API.notificationUnreadCount());
    return data?.count ?? 0;
  }
  async function markRead(id) {
    return api(API.notificationMarkRead(id), { method: "POST", body: {} });
  }
  async function markAllRead() {
    const data = await api(API.notificationMarkAllRead(), {
      method: "POST",
      body: {}
    });
    return data?.marked ?? 0;
  }
  return { list, getUnreadCount, markRead, markAllRead };
}
const useNotificationsStore = defineStore("notifications", () => {
  const unreadCount = ref(0);
  const notifications = ref([]);
  async function fetchUnreadCount() {
    const { getUnreadCount } = useNotifications();
    try {
      unreadCount.value = await getUnreadCount();
    } catch {
      unreadCount.value = 0;
    }
  }
  async function fetchNotifications() {
    const { list } = useNotifications();
    try {
      notifications.value = await list();
      unreadCount.value = notifications.value.filter((n) => !n.is_read).length;
    } catch {
      notifications.value = [];
    }
  }
  function decrementUnread(by = 1) {
    unreadCount.value = Math.max(0, unreadCount.value - by);
  }
  function setNotificationRead(id) {
    const n = notifications.value.find((x) => x.id === id);
    if (n && !n.is_read) {
      n.is_read = true;
      n.read_at = (/* @__PURE__ */ new Date()).toISOString();
      decrementUnread();
    }
  }
  return {
    unreadCount: readonly(unreadCount),
    notifications: readonly(notifications),
    fetchUnreadCount,
    fetchNotifications,
    decrementUnread,
    setNotificationRead
  };
});

export { useNotifications as a, useNotificationsStore as u };
//# sourceMappingURL=notifications-GhmUBzyU.mjs.map
