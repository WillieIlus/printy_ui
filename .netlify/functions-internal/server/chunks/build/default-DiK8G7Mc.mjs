import { w as _export_sfc, d as useAuthStore, _ as __nuxt_component_1$1, c as __nuxt_component_2$1, a as _sfc_main$f, H as useState, S as useCookie } from './server.mjs';
import { _ as __nuxt_component_2, a as __nuxt_component_3 } from './PrintyWordmark-BeHmGDED.mjs';
import { _ as __nuxt_component_4 } from './ThemeCycleButton-CrGRBFNy.mjs';
import { defineComponent, computed, mergeProps, unref, ref, watch, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { C as CommonBadgeCount } from './BadgeCount-DgWpIN1w.mjs';
import { useI18n } from 'vue-i18n';
import { u as useActivityBadgesStore } from './activityBadges-B_bMwbEc.mjs';
import { u as useUserStore } from './user-lxgd7NjH.mjs';
import { u as useSellerStore } from './seller-mv0Z_U7J.mjs';
import { u as useShopStore } from './shop-DqJLBw0V.mjs';
import { u as useQuoteInboxStore } from './quoteInbox-BZeZ2Gtb.mjs';
import { g as getBrowserStorage } from './browser-storage-CN-SIF_V.mjs';
import { u as useNotification } from './useNotification-DxMfmZhF.mjs';
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
import './useNotifications-BB49WIYK.mjs';
import './interval-DiSDr_Za.mjs';
import './seller-9NDANUZF.mjs';
import './quoteDraft-5mvcgeM-.mjs';
import './useApi-Cs2GTEbX.mjs';

const STORAGE_KEY = "printy-language";
const storage = getBrowserStorage();
function useLanguagePreference() {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const { locale: i18nLocale } = useI18n();
  const locale = useState("app-language", () => "en");
  const loading = useState("app-language-loading", () => false);
  const languageCookie = useCookie(STORAGE_KEY, { default: () => "en" });
  const options = [
    { value: "en", label: "English", shortLabel: "EN" },
    { value: "sw", label: "Swahili", shortLabel: "SW" }
  ];
  function normalizeLanguage(value) {
    return value === "sw" ? "sw" : "en";
  }
  function persistLocal(value) {
    languageCookie.value = value;
  }
  function syncI18n(value) {
    i18nLocale.value = value;
  }
  function readLocal() {
    return normalizeLanguage(languageCookie.value ?? storage.getItem(STORAGE_KEY));
  }
  async function setLanguage(next) {
    const normalized = normalizeLanguage(next);
    locale.value = normalized;
    syncI18n(normalized);
    persistLocal(normalized);
    if (!authStore.isAuthenticated) return;
    loading.value = true;
    try {
      const result = await userStore.updateMe({ preferred_language: normalized });
      if (result.success) {
        await authStore.fetchMe();
      }
    } finally {
      loading.value = false;
    }
  }
  async function initializeLanguage() {
    const preferred = normalizeLanguage(authStore.user?.preferred_language ?? readLocal());
    locale.value = preferred;
    syncI18n(preferred);
    persistLocal(preferred);
  }
  watch(
    () => authStore.user?.preferred_language,
    (value) => {
      if (!value) return;
      const normalized = normalizeLanguage(value);
      locale.value = normalized;
      syncI18n(normalized);
      persistLocal(normalized);
    },
    { immediate: true }
  );
  return {
    locale,
    loading,
    options,
    setLanguage,
    initializeLanguage
  };
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const activityBadgesStore = useActivityBadgesStore();
    const userStore = useUserStore();
    useSellerStore();
    const shopStore = useShopStore();
    const quoteInboxStore = useQuoteInboxStore();
    const { locale, loading: languageLoading, options: languageOptions } = useLanguagePreference();
    const { t } = useI18n();
    const mobileOpen = ref(false);
    const becomingShopOwner = ref(false);
    useNotification();
    const isClient = computed(() => authStore.normalizedRole === "client" || !authStore.user?.role);
    computed(() => Boolean(authStore.user?.is_superuser));
    const activeShopSlug = computed(() => shopStore.currentShop?.slug || shopStore.selectedShopSlug || shopStore.myShops[0]?.slug || null);
    const activeShop = computed(() => {
      const slug = activeShopSlug.value;
      if (!slug) return null;
      return shopStore.currentShop?.slug === slug ? shopStore.currentShop : shopStore.myShops.find((shop) => shop.slug === slug) ?? null;
    });
    computed(() => activeShop.value?.name || null);
    computed(() => activeShop.value?.logo || authStore.user?.avatar || userStore.currentUser?.avatar || null);
    const shopRequestBadgeCount = computed(
      () => activityBadgesStore.summary.shop.incoming_requests + activityBadgesStore.summary.shop.messages_replies + activityBadgesStore.summary.shop.pending_quote_actions
    );
    const clientRequestBadgeCount = computed(() => authStore.isAuthenticated && !authStore.isShopOwner ? activityBadgesStore.clientTotal : 0);
    computed(() => {
      const roleCount = authStore.isShopOwner || authStore.isStaffRole || (shopStore.myShops?.length ?? 0) > 0 ? shopRequestBadgeCount.value : clientRequestBadgeCount.value;
      return Math.max(roleCount, activityBadgesStore.summary.notifications.unread_total);
    });
    computed(() => {
      if (authStore.isShopOwner || authStore.isStaffRole || (shopStore.myShops?.length ?? 0) > 0) return "/dashboard";
      return "/quote-draft";
    });
    const clientWorkspaceHomeLink = computed(() => "/quote-draft");
    computed(() => isClient.value ? clientWorkspaceHomeLink.value : "/dashboard");
    computed(() => isClient.value ? t("common.workspace") : t("common.dashboard"));
    computed(() => isClient.value ? "/account" : "/dashboard/profile");
    const navLinks = computed(() => [
      { label: t("common.home"), to: "/", badgeCount: 0 },
      { label: t("header.nav.gallery"), to: "/gallery", badgeCount: 0 },
      { label: t("header.nav.shops"), to: "/shops", badgeCount: 0 },
      { label: t("header.nav.locations"), to: "/locations", badgeCount: 0 },
      { label: t("header.nav.requestsQuotes"), to: "/quote-draft", badgeCount: clientRequestBadgeCount.value }
    ]);
    computed(() => {
      if (!(authStore.isShopOwner || authStore.isStaffRole || (shopStore.myShops?.length ?? 0) > 0) || !activeShopSlug.value) {
        return [];
      }
      return [
        { key: "incoming", label: t("header.inbox.shopIncoming"), count: activityBadgesStore.summary.shop.incoming_requests, to: `/dashboard/shops/${activeShopSlug.value}/incoming-requests?view=new` },
        { key: "messages", label: t("header.inbox.shopMessages"), count: activityBadgesStore.summary.shop.messages_replies, to: `/dashboard/shops/${activeShopSlug.value}/incoming-requests?view=messages` },
        { key: "actions", label: t("header.inbox.shopActions"), count: activityBadgesStore.summary.shop.pending_quote_actions, to: `/dashboard/shops/${activeShopSlug.value}/incoming-requests?view=actions` }
      ];
    });
    computed(() => {
      if (!authStore.isAuthenticated || authStore.isShopOwner && !isClient.value) return [];
      return [
        { key: "quotes", label: t("header.inbox.clientQuotes"), count: activityBadgesStore.summary.client.new_quotes, to: "/inbox" },
        { key: "replies", label: t("header.inbox.clientReplies"), count: activityBadgesStore.summary.client.shop_replies, to: "/inbox" },
        { key: "updates", label: t("header.inbox.clientUpdates"), count: activityBadgesStore.summary.client.request_updates, to: "/inbox" }
      ];
    });
    computed(() => {
      const u = authStore.user;
      if (!u) return t("common.user");
      return [u.first_name, u.last_name].filter(Boolean).join(" ") || u.email?.split("@")[0] || t("common.user");
    });
    computed(() => {
      const u = authStore.user;
      if (!u) return "U";
      if (u.first_name && u.last_name) return `${u.first_name[0]}${u.last_name[0]}`.toUpperCase();
      if (u.first_name) return u.first_name.slice(0, 2).toUpperCase();
      if (u.email) return u.email[0]?.toUpperCase() ?? "U";
      return "U";
    });
    watch(() => authStore.isAuthenticated, (isAuthenticated) => {
      if (!isAuthenticated) {
        activityBadgesStore.stopPolling();
        return;
      }
      if (isClient.value) {
        void quoteInboxStore.fetchDraftFiles("dashboard");
      }
      void activityBadgesStore.fetchSummary(activeShopSlug.value);
      activityBadgesStore.startPolling(activeShopSlug.value);
    });
    watch(activeShopSlug, (shopSlug) => {
      if (!authStore.isAuthenticated) return;
      void activityBadgesStore.fetchSummary(shopSlug);
      activityBadgesStore.startPolling(shopSlug);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1$1;
      const _component_CommonPrintyLogoMark = __nuxt_component_2;
      const _component_CommonPrintyWordmark = __nuxt_component_3;
      const _component_ClientOnly = __nuxt_component_2$1;
      const _component_ThemeCycleButton = __nuxt_component_4;
      const _component_UIcon = _sfc_main$f;
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "sticky top-0 z-50 border-b border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm" }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="flex h-16 items-center justify-between">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden" style="${ssrRenderStyle({ "background": "var(--color-primary-600)" })}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CommonPrintyLogoMark, { "img-class": "h-6 w-6" }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex flex-col justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CommonPrintyWordmark, { "img-class": "h-5 sm:h-6 w-auto max-w-[100px] sm:max-w-[120px]" }, null, _parent2, _scopeId));
            _push2(`<span class="hidden text-[11px] text-[var(--p-text-muted)] sm:block mt-0.5" style="${ssrRenderStyle({ "font-family": "var(--font-body)" })}"${_scopeId}>${ssrInterpolate(unref(t)("header.tagline"))}</span></div>`);
          } else {
            return [
              createVNode("div", {
                class: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden",
                style: { "background": "var(--color-primary-600)" }
              }, [
                createVNode(_component_CommonPrintyLogoMark, { "img-class": "h-6 w-6" })
              ]),
              createVNode("div", { class: "flex flex-col justify-center" }, [
                createVNode(_component_CommonPrintyWordmark, { "img-class": "h-5 sm:h-6 w-auto max-w-[100px] sm:max-w-[120px]" }),
                createVNode("span", {
                  class: "hidden text-[11px] text-[var(--p-text-muted)] sm:block mt-0.5",
                  style: { "font-family": "var(--font-body)" }
                }, toDisplayString(unref(t)("header.tagline")), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="hidden items-center gap-2 md:flex"><!--[-->`);
      ssrRenderList(unref(navLinks), (link) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: link.label,
          to: link.to,
          class: "rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--p-text)] min-w-0"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="flex items-center gap-2 truncate"${_scopeId}><span class="truncate"${_scopeId}>${ssrInterpolate(link.label)}</span>`);
              _push2(ssrRenderComponent(CommonBadgeCount, {
                count: link.badgeCount
              }, null, _parent2, _scopeId));
              _push2(`</span>`);
            } else {
              return [
                createVNode("span", { class: "flex items-center gap-2 truncate" }, [
                  createVNode("span", { class: "truncate" }, toDisplayString(link.label), 1),
                  createVNode(CommonBadgeCount, {
                    count: link.badgeCount
                  }, null, 8, ["count"])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="hidden sm:flex items-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] p-1 shadow-sm"${_scopeId}><span class="px-2.5 py-1 text-[0.75rem] font-semibold text-[var(--p-text)]"${_scopeId}>EN</span></div>`);
          } else {
            return [
              createVNode("div", { class: "hidden sm:flex items-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] p-1 shadow-sm" }, [
                createVNode("span", { class: "px-2.5 py-1 text-[0.75rem] font-semibold text-[var(--p-text)]" }, "EN")
              ])
            ];
          }
        })
      }, _parent));
      _push(ssrRenderComponent(_component_ThemeCycleButton, null, null, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/login",
              class: "hidden text-sm font-semibold text-[var(--p-text-dim)] transition-colors hover:text-[var(--color-primary-600)] sm:inline-flex"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("common.login"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("common.login")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/signup",
              class: "cta-button group inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-flamingo-500/25 transition-all hover:bg-flamingo-400 hover:shadow-flamingo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-flamingo-500 focus-visible:outline-offset-2"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("common.getStarted"))} `);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-right",
                    class: "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("common.getStarted")) + " ", 1),
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-right",
                      class: "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-2" }, [
                createVNode(_component_NuxtLink, {
                  to: "/auth/login",
                  class: "hidden text-sm font-semibold text-[var(--p-text-dim)] transition-colors hover:text-[var(--color-primary-600)] sm:inline-flex"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("common.login")), 1)
                  ]),
                  _: 1
                }),
                createVNode(_component_NuxtLink, {
                  to: "/auth/signup",
                  class: "cta-button group inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-flamingo-500/25 transition-all hover:bg-flamingo-400 hover:shadow-flamingo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-flamingo-500 focus-visible:outline-offset-2"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("common.getStarted")) + " ", 1),
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-right",
                      class: "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    })
                  ]),
                  _: 1
                })
              ])
            ];
          }
        })
      }, _parent));
      _push(`<button class="rounded-lg p-2 text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] md:hidden"${ssrRenderAttr("aria-label", unref(t)("common.menu"))}>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: unref(mobileOpen) ? "i-lucide-x" : "i-lucide-menu",
        class: "h-6 w-6"
      }, null, _parent));
      _push(`</button></div></div>`);
      if (unref(mobileOpen)) {
        _push(`<div class="border-t border-[var(--p-border)] pb-4 pt-3 md:hidden"><div class="grid gap-1"><!--[-->`);
        ssrRenderList(unref(navLinks), (link) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: link.label,
            to: link.to,
            class: "rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--color-primary-600)]",
            onClick: ($event) => mobileOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="flex items-center justify-between gap-3"${_scopeId}><span${_scopeId}>${ssrInterpolate(link.label)}</span>`);
                _push2(ssrRenderComponent(CommonBadgeCount, {
                  count: link.badgeCount
                }, null, _parent2, _scopeId));
                _push2(`</span>`);
              } else {
                return [
                  createVNode("span", { class: "flex items-center justify-between gap-3" }, [
                    createVNode("span", null, toDisplayString(link.label), 1),
                    createVNode(CommonBadgeCount, {
                      count: link.badgeCount
                    }, null, 8, ["count"])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div><div class="mt-3 grid gap-2 px-3 sm:hidden"><div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1"><!--[-->`);
        ssrRenderList(unref(languageOptions), (option) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(locale) === option.value ? "bg-[var(--p-surface-sunken)] text-[var(--p-text)]" : "text-[var(--p-text-muted)] hover:text-[var(--p-text)]", "w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"])}"${ssrIncludeBooleanAttr(unref(languageLoading)) ? " disabled" : ""}>${ssrInterpolate(option.label)}</button>`);
        });
        _push(`<!--]--></div></div>`);
        if (unref(authStore).isAuthenticated && unref(isClient)) {
          _push(`<div class="mt-3 grid gap-2 px-3"><button class="btn-primary cta-button flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-center text-sm font-semibold"${ssrIncludeBooleanAttr(unref(becomingShopOwner)) ? " disabled" : ""}>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-store",
            class: "h-4 w-4"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(becomingShopOwner) ? unref(t)("header.account.updating") : unref(t)("header.account.becomeShopOwner"))}</button></div>`);
        } else {
          _push(`<!---->`);
        }
        if (!unref(authStore).isAuthenticated) {
          _push(`<div class="mt-3 grid gap-2 px-3">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/auth/login",
            class: "rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)]",
            onClick: ($event) => mobileOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("common.login"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("common.login")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/auth/signup",
            class: "cta-button group inline-flex items-center justify-center gap-2 rounded-xl bg-flamingo-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-flamingo-400",
            onClick: ($event) => mobileOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("common.getStarted"))} `);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-arrow-right",
                  class: "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("common.getStarted")) + " ", 1),
                  createVNode(_component_UIcon, {
                    name: "i-lucide-arrow-right",
                    class: "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></nav>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHeader.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$3, { __name: "AppHeader" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "HomeFooterLinks",
  __ssrInlineRender: true,
  setup(__props) {
    const productLinks = [
      { to: "/products", label: "All products" },
      { to: "/products/business-cards", label: "Business cards" },
      { to: "/products/flyers", label: "Flyers" },
      { to: "/products/brochures", label: "Brochures" },
      { to: "/products/stickers", label: "Stickers" },
      { to: "/products/banners", label: "Banners" },
      { to: "/gallery", label: "Gallery" }
    ];
    const locationLinks = [
      { to: "/locations", label: "All locations" },
      { to: "/locations/nairobi", label: "Nairobi" },
      { to: "/locations/westlands", label: "Westlands" },
      { to: "/locations/kilimani", label: "Kilimani" },
      { to: "/locations/cbd", label: "CBD" },
      { to: "/locations/mombasa", label: "Mombasa" },
      { to: "/locations/kisumu", label: "Kisumu" }
    ];
    const shopLinks = [
      { to: "/shops", label: "Browse shops" },
      { to: "/auth/signup", label: "Add your shop" },
      { to: "/#how-it-works", label: "How it works" },
      { to: "/help", label: "Help" }
    ];
    const legalLinks = [
      { to: "/terms", label: "Terms of Service" },
      { to: "/privacy", label: "Privacy Policy" }
    ];
    const socialLinks = [
      { href: "https://facebook.com/printy", label: "Facebook", icon: "i-simple-icons-facebook" },
      { href: "https://instagram.com/printy", label: "Instagram", icon: "i-simple-icons-instagram" },
      { href: "https://linkedin.com/in/printy", label: "LinkedIn", icon: "i-simple-icons-linkedin" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5" }, _attrs))}><div><h4 class="mb-4 font-semibold text-flamingo-500">Products</h4><ul class="space-y-3 text-sm text-slate-200"><!--[-->`);
      ssrRenderList(productLinks, (link) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.to,
          class: "transition-colors hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div><h4 class="mb-4 font-semibold text-flamingo-500">Locations</h4><ul class="space-y-3 text-sm text-slate-200"><!--[-->`);
      ssrRenderList(locationLinks, (link) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.to,
          class: "transition-colors hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div><h4 class="mb-4 font-semibold text-flamingo-500">Shops</h4><ul class="space-y-3 text-sm text-slate-200"><!--[-->`);
      ssrRenderList(shopLinks, (link) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.to,
          class: "transition-colors hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div><h4 class="mb-4 font-semibold text-flamingo-500">Legal</h4><ul class="space-y-3 text-sm text-slate-200"><!--[-->`);
      ssrRenderList(legalLinks, (link) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.to,
          class: "transition-colors hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div><h4 class="mb-4 font-semibold text-flamingo-500">Social</h4><div class="flex flex-wrap gap-3"><!--[-->`);
      ssrRenderList(socialLinks, (link) => {
        _push(`<a${ssrRenderAttr("href", link.href)} target="_blank" rel="noopener noreferrer" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/16 bg-slate-950/72 text-white transition-colors hover:border-flamingo-400/50 hover:bg-slate-900 hover:text-white"${ssrRenderAttr("aria-label", link.label)}${ssrRenderAttr("title", link.label)}>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: link.icon,
          class: "h-4 w-4"
        }, null, _parent));
        _push(`</a>`);
      });
      _push(`<!--]--></div><p class="mt-4 text-sm leading-6 text-slate-200"> Follow Printy for product inspiration, shop updates, and new quote workflow releases. </p></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomeFooterLinks.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "HomeFooterLinks" });
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_HomeFooterLinks = __nuxt_component_0;
  const _component_CommonPrintyLogoMark = __nuxt_component_2;
  const _component_ClientOnly = __nuxt_component_2$1;
  const _component_NuxtLink = __nuxt_component_1$1;
  _push(`<footer${ssrRenderAttrs(mergeProps({
    class: "relative overflow-hidden border-t border-white/10 bg-[#08111f] py-12 text-slate-200 sm:py-16",
    style: { "font-family": "var(--font-body)" }
  }, _attrs))}><div class="pointer-events-none absolute inset-0"><div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(31,53,96,0.32),transparent_38%),linear-gradient(180deg,#0a1220_0%,#08111f_60%,#070d18_100%)]"></div></div><div class="pointer-events-none absolute inset-0 opacity-70"><div class="absolute left-[8%] top-10 h-2 w-2 rounded-full bg-flamingo-500/70"></div><div class="absolute left-[18%] top-24 h-1.5 w-1.5 rounded-full bg-flamingo-400/60"></div><div class="absolute left-[72%] top-16 h-2 w-2 rounded-full bg-flamingo-500/55"></div><div class="absolute right-[12%] top-28 h-1.5 w-1.5 rounded-full bg-flamingo-300/55"></div><div class="absolute bottom-20 left-[14%] h-1.5 w-1.5 rounded-full bg-flamingo-500/50"></div><div class="absolute bottom-12 left-[48%] h-2 w-2 rounded-full bg-flamingo-400/45"></div><div class="absolute bottom-24 right-[22%] h-1.5 w-1.5 rounded-full bg-flamingo-500/55"></div><div class="absolute bottom-10 right-[8%] h-2 w-2 rounded-full bg-flamingo-400/40"></div></div><div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="mb-10">`);
  _push(ssrRenderComponent(_component_HomeFooterLinks, null, null, _parent));
  _push(`</div><div class="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row"><div class="flex items-center gap-3"><div class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-flamingo-600">`);
  _push(ssrRenderComponent(_component_CommonPrintyLogoMark, { "img-class": "h-4 w-4" }, null, _parent));
  _push(`</div><span class="text-sm text-slate-200">© `);
  _push(ssrRenderComponent(_component_ClientOnly, null, {
    fallback: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`2025`);
      } else {
        return [
          createTextVNode("2025")
        ];
      }
    })
  }, _parent));
  _push(` Printy</span></div><div class="flex items-center gap-6 text-sm text-slate-200">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/privacy",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Privacy`);
      } else {
        return [
          createTextVNode("Privacy")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/terms",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Terms`);
      } else {
        return [
          createTextVNode("Terms")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></footer>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]), { __name: "AppFooter" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  props: {
    container: { type: Boolean, default: true },
    showFooter: { type: Boolean, default: true }
  },
  setup(__props) {
    const props = __props;
    const containerClass = computed(
      () => "mx-auto w-full px-4 sm:px-6 lg:px-8" + (props.container ? " max-w-7xl" : "")
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppHeader = __nuxt_component_0$1;
      const _component_AppFooter = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col bg-[var(--p-bg)] text-[var(--p-text)]" }, _attrs))}>`);
      if (_ctx.$slots.header) {
        _push(`<header class="sticky top-0 z-50 shrink-0">`);
        ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
        _push(`</header>`);
      } else {
        _push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
      }
      if (_ctx.$slots.breadcrumb) {
        _push(`<div class="border-b border-[var(--p-border)] bg-[var(--p-surface)] shrink-0"><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">`);
        ssrRenderSlot(_ctx.$slots, "breadcrumb", {}, null, _push, _parent);
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main class="${ssrRenderClass([unref(containerClass), "flex-1"])}">`);
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
      _push(`</main>`);
      if (_ctx.$slots.footer) {
        _push(`<footer class="shrink-0">`);
        ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push, _parent);
        _push(`</footer>`);
      } else if (__props.showFooter) {
        _push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-DiK8G7Mc.mjs.map
