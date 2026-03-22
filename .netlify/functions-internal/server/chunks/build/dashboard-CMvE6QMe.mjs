import { g as useRoute, _ as __nuxt_component_3$1, a as _sfc_main$f, e as _sfc_main$9, b as __nuxt_component_2$1, h as useToast, w as parseApiError } from './server.mjs';
import { _ as __nuxt_component_1, a as __nuxt_component_2 } from './PrintyWordmark-Crk26e5n.mjs';
import { _ as __nuxt_component_4 } from './ThemeCycleButton-DSdmjbxC.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createVNode, unref, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, watch, isRef, withModifiers, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderSlot, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useSetupStatus } from './useSetupStatus-DT7QXIaC.mjs';
import { _ as __nuxt_component_0 } from './SimpleModal-knQEbNC5.mjs';
import { _ as _sfc_main$4 } from './Textarea-D4hEpwmG.mjs';
import { u as useApi } from './useApi-TeKEHmxj.mjs';
import { u as useSellerStore } from './seller-Bmym44up.mjs';
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
import './seller-B-6aM_bM.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "DashboardBottomNav",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const notificationsStore = useNotificationsStore();
    const navItems = [
      { to: "/", label: "Home", icon: "i-lucide-home" },
      { to: "/dashboard", label: "Print", icon: "i-lucide-layout-dashboard" },
      { to: "/dashboard/notifications", label: "Alerts", icon: "i-lucide-bell" },
      { to: "/dashboard/shops", label: "Shops", icon: "i-lucide-store" },
      { to: "/dashboard/quotes", label: "Requests", icon: "i-lucide-inbox" },
      { to: "/dashboard/profile", label: "Settings", icon: "i-lucide-settings" }
    ];
    function isActive(to) {
      if (to === "/") return route.path === "/";
      if (to === "/dashboard") return route.path === "/dashboard";
      return route.path.startsWith(to);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: "fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around gap-1 border-t border-[var(--p-border)] bg-[var(--p-surface)]/95 backdrop-blur-md py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden",
        role: "navigation",
        "aria-label": "Main navigation"
      }, _attrs))}><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          to: item.to,
          class: ["relative flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-2 px-1 text-xs font-medium transition-colors duration-200", isActive(item.to) ? "text-flamingo-600 dark:text-flamingo-400" : "text-[var(--p-text-muted)] hover:text-[var(--p-text)]"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (item.to === "/dashboard/notifications" && unref(notificationsStore).unreadCount > 0) {
                _push2(`<span class="absolute top-1 right-1/4 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-flamingo-500 px-0.5 text-[9px] font-bold text-white"${_scopeId}>${ssrInterpolate(unref(notificationsStore).unreadCount > 9 ? "9+" : unref(notificationsStore).unreadCount)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(_component_UIcon, {
                name: item.icon,
                class: "w-5 h-5 shrink-0"
              }, null, _parent2, _scopeId));
              _push2(`<span class="truncate w-full text-center"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
            } else {
              return [
                item.to === "/dashboard/notifications" && unref(notificationsStore).unreadCount > 0 ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "absolute top-1 right-1/4 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-flamingo-500 px-0.5 text-[9px] font-bold text-white"
                }, toDisplayString(unref(notificationsStore).unreadCount > 9 ? "9+" : unref(notificationsStore).unreadCount), 1)) : createCommentVNode("", true),
                createVNode(_component_UIcon, {
                  name: item.icon,
                  class: "w-5 h-5 shrink-0"
                }, null, 8, ["name"]),
                createVNode("span", { class: "truncate w-full text-center" }, toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/DashboardBottomNav.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$3, { __name: "DashboardBottomNav" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SetupChecklistBanner",
  __ssrInlineRender: true,
  setup(__props) {
    const { status, dismissed, isSetupComplete, nextRoute, dismiss } = useSetupStatus();
    const steps = computed(() => {
      const s = status.value;
      if (!s) return [];
      const next = s.next_step;
      return [
        { key: "shop", label: "Create Shop", done: s.has_shop, current: next === "shop" },
        { key: "papers", label: "Add Papers", done: s.has_papers, current: next === "papers" || next === "machines" },
        { key: "pricing", label: "Add Pricing", done: s.has_pricing, current: next === "pricing" },
        { key: "products", label: "Publish Products", done: s.has_published_products, current: next === "products" }
      ];
    });
    const showBanner = computed(() => {
      return status.value && !isSetupComplete.value && !dismissed.value;
    });
    function stepClass(step) {
      if (step.done) return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      if (step.current) return "bg-amber-200/60 dark:bg-amber-800/40 text-amber-800 dark:text-amber-200 ring-1 ring-amber-300 dark:ring-amber-700";
      return "bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500";
    }
    function stepIcon(step) {
      if (step.done) return "i-lucide-check-circle";
      if (step.current) return "i-lucide-circle-dot";
      return "i-lucide-circle";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      if (unref(showBanner)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 sm:p-5" }, _attrs))}><div class="flex items-start justify-between gap-4"><div class="flex items-start gap-3 min-w-0"><div class="shrink-0 mt-0.5">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-rocket",
          class: "h-5 w-5 text-amber-600 dark:text-amber-400"
        }, null, _parent));
        _push(`</div><div class="min-w-0"><p class="text-sm font-semibold text-amber-800 dark:text-amber-200">Complete your shop setup</p>`);
        if (unref(status)?.blocking_reason) {
          _push(`<p class="mt-0.5 text-xs text-amber-700 dark:text-amber-300">${ssrInterpolate(unref(status).blocking_reason)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><button class="shrink-0 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 transition-colors" aria-label="Dismiss setup banner">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-x",
          class: "h-4 w-4"
        }, null, _parent));
        _push(`</button></div><div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2"><!--[-->`);
        ssrRenderList(unref(steps), (step) => {
          _push(`<div class="${ssrRenderClass([stepClass(step), "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium"])}">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: stepIcon(step),
            class: "h-4 w-4 shrink-0"
          }, null, _parent));
          _push(`<span class="truncate">${ssrInterpolate(step.label)}</span></div>`);
        });
        _push(`<!--]--></div><div class="mt-4 flex items-center gap-3">`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          size: "sm",
          to: unref(nextRoute),
          class: "shadow-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Continue setup `);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "h-3.5 w-3.5 ml-1"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Continue setup "),
                createVNode(_component_UIcon, {
                  name: "i-lucide-arrow-right",
                  class: "h-3.5 w-3.5 ml-1"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          variant: "soft",
          color: "neutral",
          size: "sm",
          onClick: ($event) => unref(dismiss)()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Dismiss for now `);
            } else {
              return [
                createTextVNode(" Dismiss for now ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/SetupChecklistBanner.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$2, { __name: "DashboardSetupChecklistBanner" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BetaFeedbackModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    page: {},
    userAgent: {}
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { post } = useApi();
    const toast = useToast();
    const message = ref("");
    const rating = ref(null);
    const loading = ref(false);
    const errors = ref({});
    function reset() {
      message.value = "";
      rating.value = null;
      errors.value = {};
    }
    async function submit() {
      const msg = message.value.trim();
      if (msg.length < 10) {
        errors.value = { message: "Message must be at least 10 characters." };
        return;
      }
      errors.value = {};
      loading.value = true;
      try {
        await post("beta-feedback/", {
          message: msg,
          rating: rating.value ?? void 0,
          page: props.page ?? void 0,
          user_agent: props.userAgent ?? void 0
        });
        toast.add({
          title: "Thank you!",
          description: "Your feedback has been sent."
        });
        reset();
        emit("update:open", false);
      } catch (err) {
        const msg2 = parseApiError(err, "Failed to send feedback");
        toast.add({ title: "Error", description: msg2, color: "error" });
        errors.value = { message: msg2 };
      } finally {
        loading.value = false;
      }
    }
    watch(() => props.open, (isOpen) => {
      if (!isOpen) reset();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonSimpleModal = __nuxt_component_0;
      const _component_UIcon = _sfc_main$f;
      const _component_UTextarea = _sfc_main$4;
      const _component_UButton = _sfc_main$9;
      _push(ssrRenderComponent(_component_CommonSimpleModal, mergeProps({
        open: __props.open,
        title: "Send Beta Feedback",
        description: "Help us improve Printy. Your feedback is valuable.",
        "onUpdate:open": ($event) => _ctx.$emit("update:open", $event)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1"${_scopeId}> Rating (optional) </label><div class="flex gap-1"${_scopeId}><!--[-->`);
            ssrRenderList(5, (n) => {
              _push2(`<button type="button" class="${ssrRenderClass([unref(rating) === n ? "bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400" : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300", "p-2 rounded-lg transition-colors"])}"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-star",
                class: "w-5 h-5"
              }, null, _parent2, _scopeId));
              _push2(`</button>`);
            });
            _push2(`<!--]--></div></div><div${_scopeId}><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1"${_scopeId}> Message <span class="text-red-500"${_scopeId}>*</span></label>`);
            _push2(ssrRenderComponent(_component_UTextarea, {
              modelValue: unref(message),
              "onUpdate:modelValue": ($event) => isRef(message) ? message.value = $event : null,
              placeholder: "Tell us what you think, what works, what doesn't...",
              rows: 4,
              class: ["w-full", { "ring-red-500": unref(errors).message }]
            }, null, _parent2, _scopeId));
            if (unref(errors).message) {
              _push2(`<p class="mt-1 text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(errors).message)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="mt-1 text-xs text-[var(--p-text-muted)]"${_scopeId}> Minimum 10 characters </p></div><div class="flex gap-2 justify-end pt-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              onClick: ($event) => _ctx.$emit("update:open", false)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              loading: unref(loading),
              disabled: !unref(message).trim() || unref(message).trim().length < 10
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Send Feedback `);
                } else {
                  return [
                    createTextVNode(" Send Feedback ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                class: "space-y-4",
                onSubmit: withModifiers(submit, ["prevent"])
              }, [
                createVNode("div", null, [
                  createVNode("label", { class: "block text-sm font-medium text-[var(--p-text-dim)] mb-1" }, " Rating (optional) "),
                  createVNode("div", { class: "flex gap-1" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(5, (n) => {
                      return createVNode("button", {
                        key: n,
                        type: "button",
                        class: ["p-2 rounded-lg transition-colors", unref(rating) === n ? "bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400" : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"],
                        onClick: ($event) => rating.value = n
                      }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-star",
                          class: "w-5 h-5"
                        })
                      ], 10, ["onClick"]);
                    }), 64))
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "block text-sm font-medium text-[var(--p-text-dim)] mb-1" }, [
                    createTextVNode(" Message "),
                    createVNode("span", { class: "text-red-500" }, "*")
                  ]),
                  createVNode(_component_UTextarea, {
                    modelValue: unref(message),
                    "onUpdate:modelValue": ($event) => isRef(message) ? message.value = $event : null,
                    placeholder: "Tell us what you think, what works, what doesn't...",
                    rows: 4,
                    class: ["w-full", { "ring-red-500": unref(errors).message }]
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                  unref(errors).message ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-1 text-sm text-red-500"
                  }, toDisplayString(unref(errors).message), 1)) : createCommentVNode("", true),
                  createVNode("p", { class: "mt-1 text-xs text-[var(--p-text-muted)]" }, " Minimum 10 characters ")
                ]),
                createVNode("div", { class: "flex gap-2 justify-end pt-2" }, [
                  createVNode(_component_UButton, {
                    color: "neutral",
                    variant: "outline",
                    onClick: ($event) => _ctx.$emit("update:open", false)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Cancel ")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(loading),
                    disabled: !unref(message).trim() || unref(message).trim().length < 10
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Send Feedback ")
                    ]),
                    _: 1
                  }, 8, ["loading", "disabled"])
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/BetaFeedbackModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$1, { __name: "DashboardBetaFeedbackModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const sellerStore = useSellerStore();
    const notificationsStore = useNotificationsStore();
    useSetupStatus();
    const feedbackOpen = ref(false);
    const userAgent = ref("");
    const navGroups = [
      {
        label: "Overview",
        items: [
          { to: "/dashboard", label: "Dashboard Home", icon: "i-lucide-layout-dashboard" },
          { to: "/dashboard/shops", label: "Shops", icon: "i-lucide-store" },
          { to: "/dashboard/profile", label: "Profile", icon: "i-lucide-user" },
          { to: "/dashboard/notifications", label: "Notifications", icon: "i-lucide-bell" }
        ]
      },
      {
        label: "Production Setup",
        items: [
          { to: "/dashboard/products", label: "Products", icon: "i-lucide-package" },
          { to: "/dashboard/machines", label: "Machines", icon: "i-lucide-printer" },
          { to: "/dashboard/papers", label: "Papers / Stock", icon: "i-lucide-file-stack" },
          { to: "/dashboard/pricing", label: "Price Setup", icon: "i-lucide-wallet" },
          { to: "/dashboard/materials", label: "Materials", icon: "i-lucide-layers" },
          { to: "/dashboard/finishing", label: "Finishing", icon: "i-lucide-scissors" }
        ]
      },
      {
        label: "Jobs & Sales",
        items: [
          { to: "/dashboard/quotes", label: "Quotes", icon: "i-lucide-file-text" },
          { to: "/dashboard/jobs", label: "Jobs", icon: "i-lucide-briefcase" },
          { to: "/dashboard/claims", label: "Claims", icon: "i-lucide-shield-check" }
        ]
      }
    ];
    const activeShop = computed(() => {
      const slug = typeof route.params.slug === "string" ? route.params.slug : "";
      return sellerStore.shops.find((shop) => shop.slug === slug) ?? sellerStore.shops[0] ?? null;
    });
    const shortcuts = computed(() => {
      const slug = activeShop.value?.slug;
      return [
        { label: "Register New Shop", to: "/dashboard/shops/create", icon: "i-lucide-store", emphasis: true },
        { label: "Add Machine", to: slug ? `/dashboard/shops/${slug}/machines` : "/dashboard/machines", icon: "i-lucide-plus-circle", emphasis: true },
        { label: "Create Product", to: slug ? `/dashboard/shops/${slug}/products/create` : "/dashboard/products", icon: "i-lucide-package", emphasis: false }
      ];
    });
    const assistantLine = computed(() => {
      if (!sellerStore.shops.length) {
        return "Register your first shop to start pricing jobs, managing stock papers, and planning imposition.";
      }
      if (!activeShop.value) {
        return "Choose a shop to review machine readiness, product setup, and pricing coverage.";
      }
      return `You are managing ${activeShop.value.name}. Keep machines, papers, and products aligned so costing stays accurate.`;
    });
    function isActive(to) {
      if (to === "/dashboard") return route?.path === "/dashboard";
      return route?.path.startsWith(to);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_CommonPrintyLogoMark = __nuxt_component_1;
      const _component_CommonPrintyWordmark = __nuxt_component_2;
      const _component_UIcon = _sfc_main$f;
      const _component_ThemeCycleButton = __nuxt_component_4;
      const _component_UButton = _sfc_main$9;
      const _component_ClientOnly = __nuxt_component_2$1;
      const _component_DashboardBottomNav = __nuxt_component_7;
      const _component_DashboardSetupChecklistBanner = __nuxt_component_8;
      const _component_DashboardBetaFeedbackModal = __nuxt_component_9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen overflow-x-hidden bg-[var(--p-bg)] text-[var(--p-text)]" }, _attrs))}><div class="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(240,82,36,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_28%)]"></div><header class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-white/10 bg-slate-950/70 px-4 backdrop-blur-xl sm:px-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "flex items-center gap-3 shrink-0 group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="grid h-10 w-10 place-items-center rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-[0_10px_30px_rgba(225,53,21,0.25)]" style="${ssrRenderStyle({ "background": "linear-gradient(135deg, #f05224, #e13515)" })}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CommonPrintyLogoMark, { "img-class": "h-5 w-5" }, null, _parent2, _scopeId));
            _push2(`</span><div class="hidden sm:block"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CommonPrintyWordmark, { "img-class": "h-5 w-auto max-w-[90px]" }, null, _parent2, _scopeId));
            _push2(`<p class="mt-1 text-[10px] uppercase tracking-[0.24em] text-slate-400"${_scopeId}>Print Operations</p></div>`);
          } else {
            return [
              createVNode("span", {
                class: "grid h-10 w-10 place-items-center rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-[0_10px_30px_rgba(225,53,21,0.25)]",
                style: { "background": "linear-gradient(135deg, #f05224, #e13515)" }
              }, [
                createVNode(_component_CommonPrintyLogoMark, { "img-class": "h-5 w-5" })
              ]),
              createVNode("div", { class: "hidden sm:block" }, [
                createVNode(_component_CommonPrintyWordmark, { "img-class": "h-5 w-auto max-w-[90px]" }),
                createVNode("p", { class: "mt-1 text-[10px] uppercase tracking-[0.24em] text-slate-400" }, "Print Operations")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="min-w-0 flex-1"><div class="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-sparkles",
        class: "h-4 w-4 text-orange-300"
      }, null, _parent));
      _push(`<span>${ssrInterpolate(unref(assistantLine))}</span></div></div>`);
      _push(ssrRenderComponent(_component_ThemeCycleButton, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "topbar-end", {}, null, _push, _parent);
      _push(`</header><div class="flex min-h-[calc(100vh-4rem)] flex-1 overflow-hidden min-w-0"><aside class="hidden border-r border-white/10 bg-slate-950/65 backdrop-blur-xl md:flex md:w-[19rem] md:shrink-0 md:flex-col"><nav class="flex flex-1 flex-col gap-6 overflow-y-auto p-4"><div class="rounded-[28px] border border-white/10 bg-white/6 p-4"><p class="text-[11px] uppercase tracking-[0.28em] text-slate-400">Current Shop</p>`);
      if (unref(activeShop)) {
        _push(`<!--[--><div class="mt-3 flex items-start gap-3"><div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-store",
          class: "h-5 w-5 text-orange-300"
        }, null, _parent));
        _push(`</div><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-white">${ssrInterpolate(unref(activeShop).name)}</p><p class="truncate text-xs text-slate-400">/${ssrInterpolate(unref(activeShop).slug)}</p></div></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/dashboard/shops/${unref(activeShop).slug}`,
          class: "mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-orange-300/30 hover:bg-orange-500/10"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>Manage shop</span>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-up-right",
                class: "h-4 w-4 text-orange-300"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("span", null, "Manage shop"),
                createVNode(_component_UIcon, {
                  name: "i-lucide-arrow-up-right",
                  class: "h-4 w-4 text-orange-300"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!--[--><p class="mt-3 text-sm leading-6 text-slate-300"> Start by registering your first print shop, then add machines, parent sheets, and products. </p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: "/dashboard/shops/create",
          color: "primary",
          class: "mt-4 w-full justify-center"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Register New Shop `);
            } else {
              return [
                createTextVNode(" Register New Shop ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</div><div class="space-y-2"><p class="px-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Shortcuts</p><div class="grid grid-cols-1 gap-2"><!--[-->`);
      ssrRenderList(unref(shortcuts), (shortcut) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: shortcut.label,
          to: shortcut.to,
          class: ["flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition", shortcut.emphasis ? "border-orange-400/30 bg-orange-500/12 text-orange-100 hover:bg-orange-500/18" : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: shortcut.icon,
                class: "h-4 w-4 shrink-0"
              }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}>${ssrInterpolate(shortcut.label)}</span>`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: shortcut.icon,
                  class: "h-4 w-4 shrink-0"
                }, null, 8, ["name"]),
                createVNode("span", null, toDisplayString(shortcut.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div><div class="space-y-4"><!--[-->`);
      ssrRenderList(navGroups, (group) => {
        _push(`<div class="space-y-2"><p class="px-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">${ssrInterpolate(group.label)}</p><!--[-->`);
        ssrRenderList(group.items, (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.to,
            to: item.to,
            class: ["flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition", isActive(item.to) ? "border border-orange-400/25 bg-orange-500/12 text-orange-100 shadow-[0_12px_30px_rgba(240,82,36,0.12)]" : "border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/6"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="flex items-center gap-3"${_scopeId}><span class="relative"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: item.icon,
                  class: "h-4 w-4 shrink-0"
                }, null, _parent2, _scopeId));
                if (item.to === "/dashboard/notifications" && unref(notificationsStore).unreadCount > 0) {
                  _push2(`<span class="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white"${_scopeId}>${ssrInterpolate(unref(notificationsStore).unreadCount > 99 ? "99+" : unref(notificationsStore).unreadCount)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</span><span${_scopeId}>${ssrInterpolate(item.label)}</span></span>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-chevron-right",
                  class: "h-4 w-4 text-slate-500"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode("span", { class: "flex items-center gap-3" }, [
                    createVNode("span", { class: "relative" }, [
                      createVNode(_component_UIcon, {
                        name: item.icon,
                        class: "h-4 w-4 shrink-0"
                      }, null, 8, ["name"]),
                      item.to === "/dashboard/notifications" && unref(notificationsStore).unreadCount > 0 ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white"
                      }, toDisplayString(unref(notificationsStore).unreadCount > 99 ? "99+" : unref(notificationsStore).unreadCount), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("span", null, toDisplayString(item.label), 1)
                  ]),
                  createVNode(_component_UIcon, {
                    name: "i-lucide-chevron-right",
                    class: "h-4 w-4 text-slate-500"
                  })
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div><div class="space-y-2"><p class="px-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">My Shops</p>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div></nav>`);
      if (_ctx.$slots["sidebar-footer"]) {
        _push(`<div class="border-t border-white/10 p-4">`);
        ssrRenderSlot(_ctx.$slots, "sidebar-footer", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="border-t border-white/10 p-4">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "neutral",
        variant: "outline",
        size: "sm",
        icon: "i-lucide-message-square-plus",
        class: "w-full justify-start",
        onClick: ($event) => feedbackOpen.value = true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Send Feedback `);
          } else {
            return [
              createTextVNode(" Send Feedback ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></aside>`);
      _push(ssrRenderComponent(_component_DashboardBottomNav, null, null, _parent));
      _push(`<div class="fixed bottom-20 right-4 z-30 md:hidden">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        size: "lg",
        icon: "i-lucide-message-square-plus",
        "aria-label": "Send feedback",
        class: "rounded-full shadow-lg",
        onClick: ($event) => feedbackOpen.value = true
      }, null, _parent));
      _push(`</div><main class="flex-1 min-w-0 overflow-auto px-4 pb-20 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 md:pb-6 lg:pb-8">`);
      _push(ssrRenderComponent(_component_DashboardSetupChecklistBanner, { class: "mb-4" }, null, _parent));
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
      _push(`</main></div>`);
      _push(ssrRenderComponent(_component_DashboardBetaFeedbackModal, {
        open: unref(feedbackOpen),
        page: unref(route)?.path,
        "user-agent": unref(userAgent),
        "onUpdate:open": ($event) => feedbackOpen.value = $event
      }, null, _parent));
      _push(`</div>`);
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
//# sourceMappingURL=dashboard-CMvE6QMe.mjs.map
