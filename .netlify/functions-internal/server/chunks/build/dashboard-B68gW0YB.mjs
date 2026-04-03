import { f as useRoute, e as useToast, n as navigateTo, b as _sfc_main$9, _ as __nuxt_component_1, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_2, a as __nuxt_component_3 } from './PrintyWordmark-BeHmGDED.mjs';
import { _ as __nuxt_component_4 } from './ThemeCycleButton-CrGRBFNy.mjs';
import { _ as _sfc_main$1 } from './SelectMenu-D3Bra_sq.mjs';
import { _ as _sfc_main$2 } from './Badge-Dn_IFHF_.mjs';
import { defineComponent, ref, computed, watch, mergeProps, withCtx, createVNode, unref, isRef, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { C as CommonBadgeCount } from './BadgeCount-DgWpIN1w.mjs';
import { u as useSellerStore } from './seller-mv0Z_U7J.mjs';
import { u as useActivityBadgesStore } from './activityBadges-B_bMwbEc.mjs';
import { u as useSetupStatus } from './useSetupStatus-BlqBMF6r.mjs';
import { u as useAdminWorkspace } from './useAdminWorkspace-Bk2O9d8U.mjs';
import { u as useSetupRedirectNotice } from './useSetupRedirectNotice-Bt9QfVIM.mjs';
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
import './Input-Hudv-7BP.mjs';
import './seller-9NDANUZF.mjs';
import './useNotifications-BB49WIYK.mjs';
import './interval-DiSDr_Za.mjs';
import './setupStatus-BIGAzyB1.mjs';
import './shop-DqJLBw0V.mjs';
import './browser-storage-CN-SIF_V.mjs';
import './useSetupFlow-BWiVCewA.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useToast();
    const sellerStore = useSellerStore();
    const activityBadgesStore = useActivityBadgesStore();
    useSetupStatus();
    const { navSections, selectedShop, selectedShopSlug } = useAdminWorkspace();
    const { notice } = useSetupRedirectNotice();
    const sidebarOpen = ref(false);
    const shopOptions = computed(
      () => sellerStore.shops.map((shop) => ({
        label: shop.name,
        value: shop.slug
      }))
    );
    const selectedShopValue = computed({
      get: () => selectedShopSlug.value || sellerStore.shops[0]?.slug || "",
      set: (value) => {
        const slug = typeof value === "object" && value ? value.value : value;
        if (!slug || slug === selectedShopSlug.value) return;
        navigateTo(`/dashboard/shops/${slug}`);
      }
    });
    const headerLine = computed(() => {
      if (!sellerStore.shops.length) {
        return "Create a shop, complete setup, and manage all admin work from the left navigation.";
      }
      return selectedShop.value ? `${selectedShop.value.name} is active. Open a section from the left to manage setup, quotes, and settings.` : "Select a shop to work on one workspace at a time.";
    });
    function isActive(to) {
      if (!to) return false;
      const [path = "", queryString] = to.split("?");
      if (path === "/dashboard") return route.path === "/dashboard";
      if (!route.path.startsWith(path)) return false;
      if (!queryString) return true;
      const params = new URLSearchParams(queryString);
      return Array.from(params.entries()).every(([key, value]) => String(route.query[key] ?? "") === value);
    }
    function navItemClass(sectionKind, to, label) {
      if (isActive(to)) {
        return "bg-[var(--p-surface-sunken)] text-[var(--p-text)] shadow-sm";
      }
      if (sectionKind === "utility" && label === "Sign out") {
        return "text-red-600 hover:bg-red-500/8 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-500/12 dark:hover:text-red-200";
      }
      if (sectionKind === "utility") {
        return "text-[var(--p-text-muted)] hover:bg-[var(--p-surface-sunken)]/70 hover:text-[var(--p-text)]";
      }
      return "text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)]/70 hover:text-[var(--p-text)]";
    }
    function handleLinkClick() {
      sidebarOpen.value = false;
    }
    watch(() => route.fullPath, () => {
      sidebarOpen.value = false;
    });
    watch(notice, (value) => {
      return;
    }, { immediate: true });
    watch(selectedShopSlug, (slug) => {
      if (!slug) {
        activityBadgesStore.stopPolling();
        return;
      }
      void activityBadgesStore.fetchSummary(slug);
      activityBadgesStore.startPolling(slug);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_NuxtLink = __nuxt_component_1;
      const _component_CommonPrintyLogoMark = __nuxt_component_2;
      const _component_CommonPrintyWordmark = __nuxt_component_3;
      const _component_ThemeCycleButton = __nuxt_component_4;
      const _component_USelectMenu = _sfc_main$1;
      const _component_UIcon = _sfc_main$f;
      const _component_UBadge = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)] text-[var(--p-text)]" }, _attrs))}><header class="sticky top-0 z-40 border-b border-[var(--p-border)] bg-[color:color-mix(in_srgb,var(--p-surface)_88%,white_12%)]/95 backdrop-blur"><div class="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-8">`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-lucide-menu",
        color: "neutral",
        variant: "ghost",
        class: "lg:hidden",
        "aria-label": "Toggle navigation",
        onClick: ($event) => sidebarOpen.value = true
      }, null, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "flex min-w-0 items-center gap-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="grid h-10 w-10 place-items-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CommonPrintyLogoMark, { "img-class": "h-5 w-5" }, null, _parent2, _scopeId));
            _push2(`</span><div class="min-w-0"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CommonPrintyWordmark, { "img-class": "h-5 w-auto max-w-[100px]" }, null, _parent2, _scopeId));
            _push2(`<p class="text-[11px] uppercase tracking-[0.24em] text-[var(--p-text-muted)]"${_scopeId}>Admin Workspace</p></div>`);
          } else {
            return [
              createVNode("span", { class: "grid h-10 w-10 place-items-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm" }, [
                createVNode(_component_CommonPrintyLogoMark, { "img-class": "h-5 w-5" })
              ]),
              createVNode("div", { class: "min-w-0" }, [
                createVNode(_component_CommonPrintyWordmark, { "img-class": "h-5 w-auto max-w-[100px]" }),
                createVNode("p", { class: "text-[11px] uppercase tracking-[0.24em] text-[var(--p-text-muted)]" }, "Admin Workspace")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="min-w-0 flex-1"><p class="truncate text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(headerLine))}</p></div>`);
      _push(ssrRenderComponent(_component_ThemeCycleButton, null, null, _parent));
      _push(`</div></header><div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1600px]">`);
      if (unref(sidebarOpen)) {
        _push(`<div class="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<aside class="${ssrRenderClass([unref(sidebarOpen) ? "translate-x-0" : "-translate-x-full lg:translate-x-0", "fixed inset-y-0 left-0 z-50 w-[18.5rem] border-r border-[var(--p-border)] bg-[var(--p-surface)] transition-transform duration-200 lg:sticky lg:top-16 lg:z-10 lg:h-[calc(100vh-4rem)] lg:translate-x-0"])}"><div class="flex h-full flex-col"><div class="border-b border-[var(--p-border)] px-4 py-4"><div class="flex items-center justify-between gap-3 lg:hidden"><p class="text-sm font-semibold text-[var(--p-text)]">Navigation</p>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-lucide-x",
        "aria-label": "Close navigation",
        onClick: ($event) => sidebarOpen.value = false
      }, null, _parent));
      _push(`</div><div class="mt-1 space-y-3 lg:mt-0"><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Current Shop</p>`);
      if (unref(sellerStore).shops.length) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_USelectMenu, {
          modelValue: unref(selectedShopValue),
          "onUpdate:modelValue": ($event) => isRef(selectedShopValue) ? selectedShopValue.value = $event : null,
          items: unref(shopOptions),
          "value-key": "value",
          class: "mt-3 w-full"
        }, null, _parent));
        _push(`<p class="mt-3 text-sm leading-6 text-[var(--p-text-muted)]"> Use one shop workspace at a time. Actions stay inside the page that owns them. </p><!--]-->`);
      } else {
        _push(`<!--[--><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]"> Create your first shop to unlock the full admin workspace. </p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: "/dashboard/shops/create",
          color: "primary",
          class: "mt-3 w-full justify-center"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Create Shop `);
            } else {
              return [
                createTextVNode(" Create Shop ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</div></div></div><nav class="flex-1 space-y-6 overflow-y-auto px-4 py-5"><!--[-->`);
      ssrRenderList(unref(navSections), (section) => {
        _push(`<section class="${ssrRenderClass(section.kind === "utility" ? "border-t border-[var(--p-border)] pt-5" : "")}"><p class="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">${ssrInterpolate(section.label)}</p><div class="space-y-1"><!--[-->`);
        ssrRenderList(section.items, (item) => {
          _push(`<!--[-->`);
          if (item && item.to) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: item.to,
              class: ["flex items-start gap-3 rounded-2xl px-3 py-3 transition", navItemClass(section.kind, item.to, item.label)],
              onClick: handleLinkClick
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)]"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: item.icon,
                    class: "h-4 w-4"
                  }, null, _parent2, _scopeId));
                  _push2(`</span><span class="min-w-0 flex-1"${_scopeId}><span class="flex items-center justify-between gap-3"${_scopeId}><span class="truncate text-sm font-medium"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
                  _push2(ssrRenderComponent(CommonBadgeCount, {
                    count: item.badgeCount
                  }, null, _parent2, _scopeId));
                  if (item.badge) {
                    _push2(ssrRenderComponent(_component_UBadge, {
                      color: item.badge === "Missing" ? "warning" : "primary",
                      variant: "soft",
                      size: "xs"
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`${ssrInterpolate(item.badge)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(item.badge), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</span>`);
                  if (item.helper) {
                    _push2(`<span class="mt-1 block text-xs leading-5 text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(item.helper)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</span>`);
                } else {
                  return [
                    createVNode("span", { class: "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)]" }, [
                      createVNode(_component_UIcon, {
                        name: item.icon,
                        class: "h-4 w-4"
                      }, null, 8, ["name"])
                    ]),
                    createVNode("span", { class: "min-w-0 flex-1" }, [
                      createVNode("span", { class: "flex items-center justify-between gap-3" }, [
                        createVNode("span", { class: "truncate text-sm font-medium" }, toDisplayString(item.label), 1),
                        createVNode(CommonBadgeCount, {
                          count: item.badgeCount
                        }, null, 8, ["count"]),
                        item.badge ? (openBlock(), createBlock(_component_UBadge, {
                          key: 0,
                          color: item.badge === "Missing" ? "warning" : "primary",
                          variant: "soft",
                          size: "xs"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(item.badge), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"])) : createCommentVNode("", true)
                      ]),
                      item.helper ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "mt-1 block text-xs leading-5 text-[var(--p-text-muted)]"
                      }, toDisplayString(item.helper), 1)) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else if (item) {
            _push(`<button type="button" class="${ssrRenderClass([navItemClass(section.kind, item.to, item.label), "flex items-start gap-3 rounded-2xl px-3 py-3 transition"])}"><span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)]">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: item.icon,
              class: "h-4 w-4"
            }, null, _parent));
            _push(`</span><span class="min-w-0 flex-1"><span class="flex items-center justify-between gap-3"><span class="truncate text-sm font-medium">${ssrInterpolate(item.label)}</span>`);
            _push(ssrRenderComponent(CommonBadgeCount, {
              count: item.badgeCount
            }, null, _parent));
            if (item.badge) {
              _push(ssrRenderComponent(_component_UBadge, {
                color: item.badge === "Missing" ? "warning" : "primary",
                variant: "soft",
                size: "xs"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(item.badge)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item.badge), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</span>`);
            if (item.helper) {
              _push(`<span class="mt-1 block text-xs leading-5 text-[var(--p-text-muted)]">${ssrInterpolate(item.helper)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span></button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></div></section>`);
      });
      _push(`<!--]--></nav></div></aside><main class="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8"><div class="mx-auto max-w-6xl">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-B68gW0YB.mjs.map
