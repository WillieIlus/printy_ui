import { f as useRoute, c as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_2 } from './LoadingSpinner-DUXHKoma.mjs';
import { _ as _sfc_main$1 } from './Alert-Dt8CKxt0.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
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
import 'tailwindcss/colors';
import '@iconify/vue';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const id = computed(() => route.params.id);
    const quote = ref(null);
    const loading = ref(true);
    const statusLabels = {
      DRAFT: "Draft",
      SUBMITTED: "Submitted",
      PRICED: "Priced",
      SENT: "Sent",
      ACCEPTED: "Accepted",
      REJECTED: "Rejected"
    };
    const statusLabel = computed(() => quote.value ? statusLabels[quote.value.status] ?? quote.value.status : "");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_2;
      const _component_UAlert = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-amber-50/80 dark:bg-stone-950" }, _attrs))}><div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"><h1 class="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 font-[family-name:var(--font-heading)]"> Quote #${ssrInterpolate(unref(id))}</h1>`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/quotes",
        variant: "outline",
        color: "neutral"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-left",
              class: "mr-2 h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` My quotes `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "mr-2 h-4 w-4"
              }),
              createTextVNode(" My quotes ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(quote)) {
        _push(`<!--[-->`);
        if (unref(quote).status === "SUBMITTED") {
          _push(ssrRenderComponent(_component_UAlert, {
            color: "primary",
            variant: "soft",
            icon: "i-lucide-clock",
            title: "Waiting for pricing…",
            description: "Your request has been sent to the shop. They will review and send you a priced quote.",
            class: "mb-6"
          }, null, _parent));
        } else if (unref(quote).status === "PRICED" || unref(quote).status === "SENT") {
          _push(ssrRenderComponent(_component_UAlert, {
            color: "success",
            variant: "soft",
            icon: "i-lucide-check-circle",
            title: "Quote ready",
            description: "The shop has priced your quote. Check the details below.",
            class: "mb-6"
          }, null, _parent));
        } else if (unref(quote).status === "ACCEPTED") {
          _push(ssrRenderComponent(_component_UAlert, {
            color: "success",
            variant: "soft",
            icon: "i-lucide-check-circle",
            title: "Accepted",
            description: "You've accepted this quote.",
            class: "mb-6"
          }, null, _parent));
        } else if (unref(quote).status === "REJECTED") {
          _push(ssrRenderComponent(_component_UAlert, {
            color: "error",
            variant: "soft",
            icon: "i-lucide-x-circle",
            title: "Rejected",
            description: "This quote was rejected.",
            class: "mb-6"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-stone-900 shadow-sm overflow-hidden"><div class="px-6 py-4 border-b border-amber-200/60 dark:border-amber-800/40"><h2 class="font-semibold text-stone-800 dark:text-stone-100">${ssrInterpolate(unref(quote).shop_name)}</h2><p class="text-sm text-stone-500 dark:text-stone-400"> Status: ${ssrInterpolate(unref(statusLabel))}</p></div><ul class="divide-y divide-amber-200/60 dark:divide-amber-800/40"><!--[-->`);
        ssrRenderList(unref(quote).items, (item) => {
          _push(`<li class="flex items-center justify-between gap-4 px-6 py-4"><div class="min-w-0 flex-1"><p class="font-medium text-stone-800 dark:text-stone-100">${ssrInterpolate(item.title ?? item.product_name ?? "Product")}</p><p class="text-sm text-stone-500 dark:text-stone-400"> Qty: ${ssrInterpolate(item.quantity)} · ${ssrInterpolate(item.spec_text || item.pricing_mode || (item.chosen_width_mm && item.chosen_height_mm ? `${item.chosen_width_mm}×${item.chosen_height_mm}mm` : ""))}</p></div>`);
          if (item.line_total) {
            _push(`<div class="shrink-0 text-sm font-medium text-stone-700 dark:text-stone-300 tabular-nums">${ssrInterpolate(item.line_total)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul>`);
        if (unref(quote).totals?.total) {
          _push(`<div class="px-6 py-4 border-t border-amber-200/60 dark:border-amber-800/40 bg-amber-50/50 dark:bg-stone-800/50"><div class="flex justify-between font-semibold text-stone-800 dark:text-stone-100"><span>Total</span><span class="tabular-nums">${ssrInterpolate(unref(quote).totals.total)}</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><!--]-->`);
      } else {
        _push(`<div class="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-white dark:bg-stone-900 p-12 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-file-question",
          class: "mx-auto h-16 w-16 text-amber-200 dark:text-amber-800"
        }, null, _parent));
        _push(`<h3 class="mt-4 text-lg font-medium text-stone-700 dark:text-stone-300">Quote not found</h3><p class="mt-2 text-sm text-stone-500 dark:text-stone-400">This quote may have been removed or you don&#39;t have access.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: "/quotes",
          class: "mt-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`My quotes`);
            } else {
              return [
                createTextVNode("My quotes")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quotes/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-D3ADooAi.mjs.map
