import { _ as __nuxt_component_0 } from './DashboardPageHeader-Cmi_LCe-.mjs';
import { _ as _sfc_main$1 } from './Badge-Dn_IFHF_.mjs';
import { w as _export_sfc, b as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useAdminWorkspace, a as useSetupChecklist } from './useAdminWorkspace-Bk2O9d8U.mjs';
import { u as useSetupStatus } from './useSetupStatus-BlqBMF6r.mjs';
import { u as useShopStore } from './shop-DqJLBw0V.mjs';
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
import './useSetupFlow-BWiVCewA.mjs';
import './seller-mv0Z_U7J.mjs';
import './seller-9NDANUZF.mjs';
import './activityBadges-B_bMwbEc.mjs';
import './useNotifications-BB49WIYK.mjs';
import './interval-DiSDr_Za.mjs';
import './setupStatus-BIGAzyB1.mjs';
import './browser-storage-CN-SIF_V.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "setup-guide",
  __ssrInlineRender: true,
  setup(__props) {
    useShopStore();
    const { nextRoute } = useSetupStatus();
    const { selectedShop } = useAdminWorkspace();
    const {
      items: guideItems,
      summary,
      progressPercent,
      nextRequiredItem
    } = useSetupChecklist();
    function badgeColor(state) {
      if (state === "complete") return "success";
      if (state === "current") return "warning";
      return "neutral";
    }
    function badgeLabel(state) {
      if (state === "complete") return "Complete";
      if (state === "current") return "Current step";
      return "Blocked";
    }
    function cardClass(card) {
      if (card.state === "complete") {
        return "border-emerald-300/45 bg-[color:color-mix(in_oklab,var(--p-surface)_88%,rgb(16_185_129)_8%)]";
      }
      if (card.state === "current") {
        return "setup-current-card border-amber-300/70 bg-[color:color-mix(in_oklab,var(--p-surface)_84%,rgb(245_158_11)_12%)] shadow-[0_14px_34px_rgba(245,158,11,0.08)]";
      }
      return `border-[color:color-mix(in_oklab,var(--p-border)_88%,transparent)] bg-[color:color-mix(in_oklab,var(--p-surface-sunken)_92%,transparent)] opacity-90 before:hidden`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UBadge = _sfc_main$1;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))} data-v-25f0cf22>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Setup Guide",
        subtitle: "Follow one guided onboarding path from shop setup through quote-ready products."
      }, null, _parent));
      _push(`<section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm" data-v-25f0cf22><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between" data-v-25f0cf22><div data-v-25f0cf22><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]" data-v-25f0cf22>Shop Readiness</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]" data-v-25f0cf22>${ssrInterpolate(unref(selectedShop) ? unref(selectedShop).name : "No shop selected")}</h2><p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--p-text-muted)]" data-v-25f0cf22> Complete one step at a time. Finished sections stay reviewable, the current required step stands out, and later sections stay intentionally gated. </p><p class="mt-3 text-sm font-medium text-[var(--p-text)]" data-v-25f0cf22>${ssrInterpolate(unref(summary))}</p></div><div class="flex flex-col items-start gap-3" data-v-25f0cf22>`);
      _push(ssrRenderComponent(_component_UBadge, {
        color: unref(nextRequiredItem) ? "warning" : "success",
        variant: "soft",
        size: "lg",
        class: unref(nextRequiredItem) ? "setup-current-badge" : ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(nextRequiredItem) ? `Next: ${unref(nextRequiredItem).label}` : "Ready to quote")}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(nextRequiredItem) ? `Next: ${unref(nextRequiredItem).label}` : "Ready to quote"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(nextRoute)) {
        _push(ssrRenderComponent(_component_UButton, {
          to: unref(nextRoute),
          variant: "soft",
          color: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(nextRequiredItem) ? "Complete now" : "Review workspace")}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(nextRequiredItem) ? "Complete now" : "Review workspace"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="mt-5" data-v-25f0cf22><div class="h-2 overflow-hidden rounded-full bg-[var(--p-surface-sunken)]" data-v-25f0cf22><div class="h-full rounded-full bg-emerald-500 transition-all" style="${ssrRenderStyle({ width: `${unref(progressPercent)}%` })}" data-v-25f0cf22></div></div></div><div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-v-25f0cf22><!--[-->`);
      ssrRenderList(unref(guideItems), (card) => {
        _push(`<article class="${ssrRenderClass([cardClass(card), "rounded-2xl border p-4 transition"])}" data-v-25f0cf22><div class="flex items-start justify-between gap-3" data-v-25f0cf22><span class="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]" data-v-25f0cf22>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: card.icon,
          class: "h-4 w-4"
        }, null, _parent));
        _push(`</span>`);
        _push(ssrRenderComponent(_component_UBadge, {
          color: badgeColor(card.state),
          variant: "soft",
          size: "xs",
          class: card.state === "current" ? "setup-current-badge" : ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(badgeLabel(card.state))}`);
            } else {
              return [
                createTextVNode(toDisplayString(badgeLabel(card.state)), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div><h3 class="mt-4 text-sm font-semibold text-[var(--p-text)]" data-v-25f0cf22>${ssrInterpolate(card.label)}</h3><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]" data-v-25f0cf22>${ssrInterpolate(card.description)}</p><p class="mt-3 flex items-center gap-2 text-xs text-[var(--p-text-muted)]" data-v-25f0cf22>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: card.state === "blocked" ? "i-lucide-lock" : card.state === "complete" ? "i-lucide-check-circle-2" : "i-lucide-sparkles",
          class: "h-3.5 w-3.5 shrink-0"
        }, null, _parent));
        _push(`<span data-v-25f0cf22>${ssrInterpolate(card.helper)}</span></p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: card.ctaTo,
          variant: card.state === "current" ? "solid" : "soft",
          color: card.state === "complete" ? "success" : card.state === "current" ? "warning" : "neutral",
          class: "mt-4 w-full justify-center"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(card.ctaLabel)}`);
            } else {
              return [
                createTextVNode(toDisplayString(card.ctaLabel), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</article>`);
      });
      _push(`<!--]--></div></section><section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm" data-v-25f0cf22><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]" data-v-25f0cf22>Guidance</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]" data-v-25f0cf22>How this workspace now works</h2><div class="mt-4 grid gap-3 md:grid-cols-3" data-v-25f0cf22><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" data-v-25f0cf22><p class="text-sm font-medium text-[var(--p-text)]" data-v-25f0cf22>One master navigation</p><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]" data-v-25f0cf22>The left sidebar is the source of truth. Sections are no longer duplicated in multiple overview cards.</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" data-v-25f0cf22><p class="text-sm font-medium text-[var(--p-text)]" data-v-25f0cf22>Contextual actions</p><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]" data-v-25f0cf22>Create and edit actions live inside the relevant page instead of being repeated across unrelated screens.</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" data-v-25f0cf22><p class="text-sm font-medium text-[var(--p-text)]" data-v-25f0cf22>Stable pages over large modals</p><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]" data-v-25f0cf22>Long forms now use page or side-panel layouts, while small confirmations can remain lightweight.</p></div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/setup-guide.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const setupGuide = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-25f0cf22"]]);

export { setupGuide as default };
//# sourceMappingURL=setup-guide-EpPWISao.mjs.map
