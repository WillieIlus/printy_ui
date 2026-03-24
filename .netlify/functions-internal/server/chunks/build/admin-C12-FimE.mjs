import { g as useRoute, d as _sfc_main$9, _ as __nuxt_component_3$1, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_4 } from './ThemeCycleButton-gyFxFpew.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const sidebarOpen = ref(false);
    const navItems = [
      { to: "/super-admin/analytics", label: "Analytics", icon: "i-lucide-layout-dashboard" }
    ];
    function isActive(to) {
      if (to === "/super-admin/analytics") return route.path === "/super-admin/analytics" || route.path === "/admin";
      return route.path.startsWith(to);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      const _component_ThemeCycleButton = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col bg-[var(--p-bg)] text-[var(--p-text)]" }, _attrs))}><header class="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b border-[var(--p-border)] bg-[var(--p-surface)] px-4 sm:px-6">`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-menu",
        color: "neutral",
        variant: "soft",
        size: "sm",
        "aria-label": "Toggle sidebar",
        class: "lg:hidden",
        onClick: ($event) => sidebarOpen.value = !unref(sidebarOpen)
      }, null, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/super-admin/analytics",
        class: "flex items-center gap-2 shrink-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="grid h-8 w-8 place-items-center rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-shield-check",
              class: "w-4 h-4"
            }, null, _parent2, _scopeId));
            _push2(`</span><span class="font-semibold text-[var(--p-text)] hidden sm:inline"${_scopeId}>Admin</span>`);
          } else {
            return [
              createVNode("span", { class: "grid h-8 w-8 place-items-center rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900" }, [
                createVNode(_component_UIcon, {
                  name: "i-lucide-shield-check",
                  class: "w-4 h-4"
                })
              ]),
              createVNode("span", { class: "font-semibold text-[var(--p-text)] hidden sm:inline" }, "Admin")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex-1 min-w-0"></div>`);
      _push(ssrRenderComponent(_component_ThemeCycleButton, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "topbar-end", {}, null, _push, _parent);
      _push(`</header><div class="flex flex-1 overflow-hidden"><aside class="${ssrRenderClass([unref(sidebarOpen) ? "translate-x-0" : "-translate-x-full", "fixed inset-y-0 left-0 z-30 w-64 transform border-r border-[var(--p-border)] bg-[var(--p-surface)] pt-14 transition-transform duration-200 ease-out lg:static lg:translate-x-0 lg:pt-0"])}"><nav class="flex flex-col gap-1 p-4"><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: item.to,
          class: ["flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", isActive(item.to) ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" : "text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)]"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: item.icon,
                class: "w-5 h-5 shrink-0"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(item.label)}`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: item.icon,
                  class: "w-5 h-5 shrink-0"
                }, null, 8, ["name"]),
                createTextVNode(" " + toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav>`);
      if (_ctx.$slots["sidebar-footer"]) {
        _push(`<div class="mt-auto border-t border-[var(--p-border)] p-4">`);
        ssrRenderSlot(_ctx.$slots, "sidebar-footer", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</aside>`);
      if (unref(sidebarOpen)) {
        _push(`<div class="fixed inset-0 z-20 bg-black/50 lg:hidden" aria-hidden></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">`);
      if (_ctx.$slots.title || _ctx.$slots.actions) {
        _push(`<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">`);
        if (_ctx.$slots.title) {
          _push(`<div>`);
          ssrRenderSlot(_ctx.$slots, "title", {}, null, _push, _parent);
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (_ctx.$slots.actions) {
          _push(`<div class="shrink-0">`);
          ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-C12-FimE.mjs.map
