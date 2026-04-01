import { _ as __nuxt_component_0 } from './DashboardPageHeader-By409uiV.mjs';
import { d as _sfc_main$9, h as useApi, n as navigateTo, A as API } from './server.mjs';
import { _ as _sfc_main$1 } from './Alert-BD7KCbft.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, unref, createTextVNode, openBlock, createBlock, createCommentVNode, readonly, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { defineStore } from 'pinia';
import '../_/nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
import 'devalue';
import 'consola';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'vue-bundle-renderer/runtime';
import '@iconify/utils';
import 'node:crypto';
import 'fast-xml-parser';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'vue-i18n';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const notificationsStore = typeof useNotificationsStore === "function" ? useNotificationsStore() : null;
    const notificationsApi = useNotifications();
    const loading = ref(true);
    const error = ref(null);
    const markingAll = ref(false);
    const storeReady = computed(() => Boolean(
      notificationsStore && typeof notificationsStore.fetchNotifications === "function" && typeof notificationsStore.fetchUnreadCount === "function"
    ));
    const storeWarning = computed(() => {
      if (storeReady.value) return "";
      return "The notifications store could not be initialized. The page will stay available, but live notification data is disabled until the app reloads cleanly.";
    });
    const notifications = computed(() => {
      const list = notificationsStore?.notifications;
      return Array.isArray(list) ? list : [];
    });
    const unreadCount = computed(() => {
      const count = notificationsStore?.unreadCount;
      return typeof count === "number" ? count : 0;
    });
    const emptyStateDescription = computed(() => {
      if (storeWarning.value) {
        return "Notifications could not be loaded from the current app state. Reload the app after the dev server stabilizes, or continue working without notifications for now.";
      }
      return "Quote updates, shop responses, and request changes will appear here when they are available.";
    });
    async function fetchNotifications() {
      if (!storeReady.value || !notificationsStore) {
        loading.value = false;
        error.value = null;
        return;
      }
      loading.value = true;
      error.value = null;
      try {
        await notificationsStore.fetchNotifications();
      } catch (e) {
        error.value = e instanceof Error ? e.message : "Failed to load notifications.";
      } finally {
        loading.value = false;
      }
    }
    async function onNotificationClick(n) {
      if (!n?.id) return;
      if (!n.is_read) {
        try {
          await notificationsApi.markRead(n.id);
          notificationsStore?.setNotificationRead?.(n.id);
        } catch {
        }
      }
      if (n.target_url) {
        await navigateTo(n.target_url, { external: /^https?:\/\//.test(n.target_url) });
      }
    }
    async function onMarkAllRead() {
      if (!storeReady.value || !notificationsStore) return;
      markingAll.value = true;
      try {
        await notificationsApi.markAllRead();
        await notificationsStore.fetchUnreadCount();
        await fetchNotifications();
      } catch {
      } finally {
        markingAll.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UAlert = _sfc_main$1;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_NotificationCard = resolveComponent("NotificationCard");
      const _component_DashboardEmptyState = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Notifications",
        subtitle: "Quote requests, shop responses, and operational updates."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(storeReady) && unref(unreadCount) > 0) {
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "soft",
                size: "sm",
                loading: unref(markingAll),
                onClick: onMarkAllRead
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Mark all as read `);
                  } else {
                    return [
                      createTextVNode(" Mark all as read ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(storeReady) && unref(unreadCount) > 0 ? (openBlock(), createBlock(_component_UButton, {
                key: 0,
                variant: "soft",
                size: "sm",
                loading: unref(markingAll),
                onClick: onMarkAllRead
              }, {
                default: withCtx(() => [
                  createTextVNode(" Mark all as read ")
                ]),
                _: 1
              }, 8, ["loading"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(storeWarning)) {
        _push(ssrRenderComponent(_component_UAlert, {
          color: "warning",
          variant: "soft",
          title: "Notifications are temporarily unavailable",
          description: unref(storeWarning),
          icon: "i-lucide-bell-off"
        }, null, _parent));
      } else if (unref(loading) && !unref(notifications).length) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"><p class="text-sm text-red-700 dark:text-red-300">${ssrInterpolate(unref(error))}</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          variant: "soft",
          color: "error",
          size: "sm",
          class: "mt-2",
          disabled: !unref(storeReady),
          onClick: fetchNotifications
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Try again `);
            } else {
              return [
                createTextVNode(" Try again ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else if (unref(notifications).length) {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(notifications), (n) => {
          _push(ssrRenderComponent(_component_NotificationCard, {
            key: n.id,
            notification: n,
            onClick: ($event) => onNotificationClick(n)
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: "No notifications",
          description: unref(emptyStateDescription),
          icon: "i-lucide-bell"
        }, null, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/notifications/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BoxxD7kQ.mjs.map
