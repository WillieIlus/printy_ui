import { _ as __nuxt_component_3$1, a as _sfc_main$f } from './server.mjs';
import { defineComponent, computed, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const quoteDraftStore = useQuoteDraftStore();
    const hasDraftItems = computed(() => {
      const draft = quoteDraftStore.activeDraft;
      return draft && (draft.items?.length ?? 0) > 0;
    });
    const draftItemCount = computed(() => {
      const draft = quoteDraftStore.activeDraft;
      return draft?.items?.length ?? 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)]" }, _attrs))}><div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12"><div class="mb-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/quotes",
        class: "text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)] flex items-center gap-1 mb-4"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-left",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` Quote Requests `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "h-4 w-4"
              }),
              createTextVNode(" Quote Requests ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-2xl font-bold text-[var(--p-text)]">Request a quote</h1><p class="mt-2 text-[var(--p-text-muted)]"> Add products from a print shop to your draft, then submit your request. The shop will respond with a quote. </p></div><div class="space-y-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shops",
        class: "flex items-center gap-4 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:bg-flamingo-50/30 dark:hover:bg-flamingo-900/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/40"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-store",
              class: "h-6 w-6 text-flamingo-600 dark:text-flamingo-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><h2 class="font-semibold text-[var(--p-text)]"${_scopeId}>Browse shops</h2><p class="text-sm text-[var(--p-text-muted)]"${_scopeId}>Find a print shop and add products to your request.</p></div>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-chevron-right",
              class: "h-5 w-5 text-[var(--p-text-muted)] shrink-0"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/40" }, [
                createVNode(_component_UIcon, {
                  name: "i-lucide-store",
                  class: "h-6 w-6 text-flamingo-600 dark:text-flamingo-400"
                })
              ]),
              createVNode("div", { class: "min-w-0 flex-1" }, [
                createVNode("h2", { class: "font-semibold text-[var(--p-text)]" }, "Browse shops"),
                createVNode("p", { class: "text-sm text-[var(--p-text-muted)]" }, "Find a print shop and add products to your request.")
              ]),
              createVNode(_component_UIcon, {
                name: "i-lucide-chevron-right",
                class: "h-5 w-5 text-[var(--p-text-muted)] shrink-0"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/quote-draft",
        class: "flex items-center gap-4 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:bg-flamingo-50/30 dark:hover:bg-flamingo-900/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-shopping-cart",
              class: "h-6 w-6 text-amber-600 dark:text-amber-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><h2 class="font-semibold text-[var(--p-text)]"${_scopeId}>Quote draft</h2><p class="text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(unref(hasDraftItems) ? `Continue with ${unref(draftItemCount)} item(s) and submit.` : "View or edit items in your draft.")}</p></div>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-chevron-right",
              class: "h-5 w-5 text-[var(--p-text-muted)] shrink-0"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40" }, [
                createVNode(_component_UIcon, {
                  name: "i-lucide-shopping-cart",
                  class: "h-6 w-6 text-amber-600 dark:text-amber-400"
                })
              ]),
              createVNode("div", { class: "min-w-0 flex-1" }, [
                createVNode("h2", { class: "font-semibold text-[var(--p-text)]" }, "Quote draft"),
                createVNode("p", { class: "text-sm text-[var(--p-text-muted)]" }, toDisplayString(unref(hasDraftItems) ? `Continue with ${unref(draftItemCount)} item(s) and submit.` : "View or edit items in your draft."), 1)
              ]),
              createVNode(_component_UIcon, {
                name: "i-lucide-chevron-right",
                class: "h-5 w-5 text-[var(--p-text-muted)] shrink-0"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quotes/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-bfHfKQcQ.mjs.map
