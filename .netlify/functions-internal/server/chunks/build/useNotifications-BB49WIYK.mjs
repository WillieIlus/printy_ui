import { o as useApi, A as API } from './server.mjs';

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
  async function getActivitySummary(shopSlug) {
    return api(API.notificationActivitySummary(), {
      params: shopSlug ? { shop_slug: shopSlug } : void 0
    });
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
  return { list, getUnreadCount, getActivitySummary, markRead, markAllRead };
}

export { useNotifications as u };
//# sourceMappingURL=useNotifications-BB49WIYK.mjs.map
