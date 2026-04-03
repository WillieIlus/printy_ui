import { _ as __nuxt_component_0 } from './DashboardPageHeader-Cmi_LCe-.mjs';
import { _ as __nuxt_component_1, a as _sfc_main$f } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useAdminWorkspace } from './useAdminWorkspace-Bk2O9d8U.mjs';
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
import 'pinia';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'vue-i18n';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './useSetupFlow-BWiVCewA.mjs';
import './useSetupStatus-BlqBMF6r.mjs';
import './setupStatus-BIGAzyB1.mjs';
import './shop-DqJLBw0V.mjs';
import './browser-storage-CN-SIF_V.mjs';
import './seller-mv0Z_U7J.mjs';
import './seller-9NDANUZF.mjs';
import './activityBadges-B_bMwbEc.mjs';
import './useNotifications-BB49WIYK.mjs';
import './interval-DiSDr_Za.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const { shopRoute } = useAdminWorkspace();
    const settingsItems = computed(() => [
      {
        label: "Profile",
        description: "Your account details and supported personal settings.",
        to: "/dashboard/profile",
        icon: "i-lucide-user"
      },
      {
        label: "Shop Profile",
        description: "Business details for the active shop workspace.",
        to: shopRoute("/edit"),
        icon: "i-lucide-store"
      },
      {
        label: "Notifications",
        description: "Unread alerts, request activity, and updates.",
        to: "/dashboard/notifications",
        icon: "i-lucide-bell"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_1;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Settings",
        subtitle: "Account and workspace settings are grouped here instead of scattered across the dashboard."
      }, null, _parent));
      _push(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(settingsItems), (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          to: item.to,
          class: "rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm transition hover:border-orange-300 dark:hover:border-orange-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-start gap-3"${_scopeId}><span class="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: item.icon,
                class: "h-5 w-5"
              }, null, _parent2, _scopeId));
              _push2(`</span><div${_scopeId}><p class="text-sm font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.label)}</p><p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(item.description)}</p></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-start gap-3" }, [
                  createVNode("span", { class: "flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]" }, [
                    createVNode(_component_UIcon, {
                      name: item.icon,
                      class: "h-5 w-5"
                    }, null, 8, ["name"])
                  ]),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-semibold text-[var(--p-text)]" }, toDisplayString(item.label), 1),
                    createVNode("p", { class: "mt-1 text-sm leading-6 text-[var(--p-text-muted)]" }, toDisplayString(item.description), 1)
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-_ucFCBmt.mjs.map
