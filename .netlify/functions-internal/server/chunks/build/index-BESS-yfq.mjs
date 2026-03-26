import { _ as __nuxt_component_0 } from './DashboardPageHeader-2WLhb5mv.mjs';
import { _ as __nuxt_component_1 } from './BackendQuoteCalculator-ikXAcPgr.mjs';
import { f as useRoute, d as _sfc_main$9 } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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
import './Badge-DRRvJchD.mjs';
import './payload-B09QCjlG.mjs';
import 'pinia';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slug = computed(() => String(route.params.slug || ""));
    const shopStore = useShopStore();
    const setupStore = useSetupStatusStore();
    const quoteInboxStore = useQuoteInboxStore();
    async function refreshPage() {
      await Promise.all([
        shopStore.ensureActiveShop(slug.value),
        setupStore.fetchStatus(slug.value),
        quoteInboxStore.fetchDashboard()
      ]);
    }
    const setupCards = computed(() => [
      { label: "Materials", value: setupStore.status?.has_materials ? "Ready" : "Missing" },
      { label: "Pricing", value: setupStore.status?.has_pricing ? "Ready" : "Missing" },
      { label: "Finishing", value: setupStore.status?.has_finishing ? "Ready" : "Missing" },
      { label: "Products", value: setupStore.status?.has_products ? "Ready" : "Missing" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_QuotesBackendQuoteCalculator = __nuxt_component_1;
      const _component_UButton = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: unref(shopStore).currentShop?.name || "Shop workspace",
        subtitle: "This shop page now behaves like the main quoting desk for the selected shop."
      }, null, _parent));
      if (unref(slug)) {
        _push(ssrRenderComponent(_component_QuotesBackendQuoteCalculator, {
          "fixed-shop-slug": unref(slug),
          eyebrow: "Shop Workspace",
          title: "Quick quote workbench",
          description: "Use the backend preview, then move to the quote inbox actions below.",
          mode: "shop",
          onDraftSaved: refreshPage,
          onDraftSent: refreshPage
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Setup Status</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Backend progression</h2><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(setupStore).status?.next_url || "Setup complete.")}</p></div>`);
      if (unref(setupStore).status?.next_url) {
        _push(ssrRenderComponent(_component_UButton, {
          to: unref(setupStore).status.next_url,
          variant: "soft"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Open next step`);
            } else {
              return [
                createTextVNode("Open next step")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
      ssrRenderList(unref(setupCards), (step) => {
        _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(step.label)}</p><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(step.value)}</p></article>`);
      });
      _push(`<!--]--></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BESS-yfq.mjs.map
