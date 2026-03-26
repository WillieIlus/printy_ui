import { _ as __nuxt_component_1 } from './BackendQuoteCalculator-ikXAcPgr.mjs';
import { n as navigateTo, d as _sfc_main$9 } from './server.mjs';
import { _ as _sfc_main$1 } from './Badge-DRRvJchD.mjs';
import { defineComponent, watchEffect, mergeProps, withCtx, createTextVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import './SelectMenu-C6Eyp_GI.mjs';
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
import '@vueuse/core';
import './Input-C14QBOm-.mjs';
import './Checkbox-S5HrhTVg.mjs';
import './Textarea-C3ixaFu9.mjs';
import './payload-B09QCjlG.mjs';
import 'pinia';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "quote-draft",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const quoteInboxStore = useQuoteInboxStore();
    watchEffect(() => {
      if (authStore.isShopOwner) {
        navigateTo("/dashboard");
      }
    });
    async function refreshDrafts() {
      if (!authStore.isClient) return;
      await quoteInboxStore.fetchDrafts();
    }
    function handleDraftSaved() {
      refreshDrafts();
    }
    function handleDraftSent() {
      refreshDrafts();
    }
    function badgeColor(status) {
      if (status === "accepted") return "success";
      if (status === "rejected") return "error";
      if (status === "modified") return "warning";
      return "neutral";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_QuotesBackendQuoteCalculator = __nuxt_component_1;
      const _component_UButton = _sfc_main$9;
      const _component_UBadge = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-surface)]" }, _attrs))}><main class="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8"><section class="rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-8 shadow-sm"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Client Workspace</p><h1 class="mt-3 text-4xl font-semibold tracking-tight text-[var(--p-text)]">Quote drafts</h1><p class="mt-3 max-w-3xl text-base leading-7 text-[var(--p-text-muted)]"> Preview prices from the backend, save prepared drafts, then send them to shops without guessing totals or quote states in the browser. </p></section>`);
      _push(ssrRenderComponent(_component_QuotesBackendQuoteCalculator, {
        title: "Prepare a quote draft",
        description: "Use the same backend preview path as the homepage and dashboard. Totals and finishing breakdowns come directly from the API.",
        eyebrow: "Client Drafts",
        mode: "client",
        onDraftSaved: handleDraftSaved,
        onDraftSent: handleDraftSent
      }, null, _parent));
      _push(`<section class="rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Saved Drafts</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Backend draft history</h2></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        onClick: refreshDrafts
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Refresh`);
          } else {
            return [
              createTextVNode("Refresh")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(quoteInboxStore).loading && !unref(quoteInboxStore).drafts.length) {
        _push(`<div class="mt-6 grid gap-4 md:grid-cols-2"><!--[-->`);
        ssrRenderList(4, (index) => {
          _push(`<div class="h-36 animate-pulse rounded-2xl bg-[var(--p-surface-sunken)]"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(quoteInboxStore).drafts.length) {
        _push(`<div class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]"> No drafts yet. Save a backend draft from the calculator above. </div>`);
      } else {
        _push(`<div class="mt-6 grid gap-4 md:grid-cols-2"><!--[-->`);
        ssrRenderList(unref(quoteInboxStore).drafts, (draft) => {
          _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"><div class="flex items-start justify-between gap-3"><div><p class="text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(draft.title || draft.draft_reference || `Draft #${draft.id}`)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(draft.status)}</p></div>`);
          _push(ssrRenderComponent(_component_UBadge, {
            variant: "soft",
            color: badgeColor(draft.status)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(draft.status)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(draft.status), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><p class="mt-4 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(draft.pricing_snapshot?.totals?.grand_total || "Awaiting preview total")}</p><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(draft.request_details_snapshot?.customer_name || "No customer name yet")}</p></article>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</section></main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quote-draft.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=quote-draft-E8R9EBM_.mjs.map
