import { _ as __nuxt_component_0 } from './DashboardPageHeader-By409uiV.mjs';
import { _ as _sfc_main$1 } from './Badge-C1UUP90f.mjs';
import { d as _sfc_main$9, _ as __nuxt_component_3$1, a as _sfc_main$f } from './server.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { u as useAdminWorkspace, a as useSetupChecklist } from './useAdminWorkspace-C08JPEZs.mjs';
import { u as useSetupStatus } from './useSetupStatus-CUJDN1af.mjs';
import { u as useShopStore } from './shop-DfXxeXDQ.mjs';
import 'reka-ui';
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
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './seller-B_HIq8FR.mjs';
import './seller-B7IxAeLp.mjs';
import './setupStatus-pIJLkKpM.mjs';
import './browser-storage-CN-SIF_V.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "setup-guide",
  __ssrInlineRender: true,
  setup(__props) {
    useShopStore();
    const { status: setupStatus } = useSetupStatus();
    const { selectedShop } = useAdminWorkspace();
    const {
      items: guideItems,
      summary,
      progressPercent,
      nextRequiredItem
    } = useSetupChecklist();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UBadge = _sfc_main$1;
      const _component_UButton = _sfc_main$9;
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Setup Guide",
        subtitle: "Essential setup is centralized here so missing requirements are obvious and calm."
      }, null, _parent));
      _push(`<section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Shop Readiness</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">${ssrInterpolate(unref(selectedShop) ? unref(selectedShop).name : "No shop selected")}</h2><p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--p-text-muted)]"> Finish the missing essentials in order. Each link opens the page that owns the action. </p><p class="mt-3 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(unref(summary))}</p></div><div class="flex flex-col items-start gap-3">`);
      _push(ssrRenderComponent(_component_UBadge, {
        color: unref(nextRequiredItem) ? "warning" : "success",
        variant: "soft",
        size: "lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(nextRequiredItem) ? "Needs setup" : "Ready to quote")}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(nextRequiredItem) ? "Needs setup" : "Ready to quote"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(setupStatus)?.next_url) {
        _push(ssrRenderComponent(_component_UButton, {
          to: unref(setupStatus).next_url,
          variant: "soft",
          color: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Open backend next step `);
            } else {
              return [
                createTextVNode(" Open backend next step ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="mt-5"><div class="h-2 overflow-hidden rounded-full bg-[var(--p-surface-sunken)]"><div class="h-full rounded-full bg-orange-500 transition-all" style="${ssrRenderStyle({ width: `${unref(progressPercent)}%` })}"></div></div></div><div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5"><!--[-->`);
      ssrRenderList(unref(guideItems), (card) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: card.label,
          to: card.to,
          class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 transition hover:border-orange-300 dark:hover:border-orange-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-start justify-between gap-3"${_scopeId}><span class="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: card.icon,
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
              _push2(`</span>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: card.state === "complete" ? "success" : card.state === "required" ? "warning" : "neutral",
                variant: "soft",
                size: "xs"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(card.state === "complete" ? "Complete" : card.state === "required" ? "Required" : "Missing")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(card.state === "complete" ? "Complete" : card.state === "required" ? "Required" : "Missing"), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div><h3 class="mt-4 text-sm font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(card.label)}</h3><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(card.description)}</p>`);
              _push2(ssrRenderComponent(_component_UButton, {
                to: card.to,
                variant: "soft",
                color: "primary",
                class: "mt-4 w-full justify-center"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(card.state === "complete" ? "Review" : card.state === "required" ? "Complete now" : "Open section")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(card.state === "complete" ? "Review" : card.state === "required" ? "Complete now" : "Open section"), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                  createVNode("span", { class: "flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]" }, [
                    createVNode(_component_UIcon, {
                      name: card.icon,
                      class: "h-4 w-4"
                    }, null, 8, ["name"])
                  ]),
                  createVNode(_component_UBadge, {
                    color: card.state === "complete" ? "success" : card.state === "required" ? "warning" : "neutral",
                    variant: "soft",
                    size: "xs"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(card.state === "complete" ? "Complete" : card.state === "required" ? "Required" : "Missing"), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ]),
                createVNode("h3", { class: "mt-4 text-sm font-semibold text-[var(--p-text)]" }, toDisplayString(card.label), 1),
                createVNode("p", { class: "mt-2 text-sm leading-6 text-[var(--p-text-muted)]" }, toDisplayString(card.description), 1),
                createVNode(_component_UButton, {
                  to: card.to,
                  variant: "soft",
                  color: "primary",
                  class: "mt-4 w-full justify-center"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(card.state === "complete" ? "Review" : card.state === "required" ? "Complete now" : "Open section"), 1)
                  ]),
                  _: 2
                }, 1032, ["to"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></section><section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Guidance</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">How this workspace now works</h2><div class="mt-4 grid gap-3 md:grid-cols-3"><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-sm font-medium text-[var(--p-text)]">One master navigation</p><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">The left sidebar is the source of truth. Sections are no longer duplicated in multiple overview cards.</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-sm font-medium text-[var(--p-text)]">Contextual actions</p><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">Create and edit actions live inside the relevant page instead of being repeated across unrelated screens.</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-sm font-medium text-[var(--p-text)]">Stable pages over large modals</p><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">Long forms now use page or side-panel layouts, while small confirmations can remain lightweight.</p></div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/setup-guide.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=setup-guide-Dpsyi313.mjs.map
