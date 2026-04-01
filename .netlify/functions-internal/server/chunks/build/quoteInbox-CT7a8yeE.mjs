import { ref, defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderSlot, ssrRenderComponent } from 'vue/server-renderer';
import { E as useNuxtApp, A as API, F as _export_sfc } from './server.mjs';
import { _ as _sfc_main$9 } from './SelectMenu-DDFAjir1.mjs';
import { defineStore } from 'pinia';

const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "CalculatorFieldGroup",
  __ssrInlineRender: true,
  props: {
    label: {},
    help: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-2" }, _attrs))}>`);
      if (__props.label) {
        _push(`<label class="block text-sm font-semibold text-slate-100">${ssrInterpolate(__props.label)}</label>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      if (__props.help) {
        _push(`<p class="text-xs leading-5 text-slate-400">${ssrInterpolate(__props.help)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/CalculatorFieldGroup.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const CalculatorFieldGroup = Object.assign(_sfc_main$8, { __name: "CalculatorFieldGroup" });
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "CalculatorFormGrid",
  __ssrInlineRender: true,
  emits: ["submit"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</form>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/CalculatorFormGrid.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const CalculatorFormGrid = Object.assign(_sfc_main$7, { __name: "CalculatorFormGrid" });
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "CalculatorHeaderBlock",
  __ssrInlineRender: true,
  props: {
    eyebrow: {},
    title: {},
    description: {},
    compact: { type: Boolean, default: false }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: __props.compact ? "space-y-2" : "space-y-3"
      }, _attrs))}><p class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-300">${ssrInterpolate(__props.eyebrow)}</p><h2 class="${ssrRenderClass(__props.compact ? "text-xl font-semibold text-white" : "text-2xl font-semibold text-white sm:text-3xl")}">${ssrInterpolate(__props.title)}</h2><p class="max-w-3xl text-sm leading-6 text-slate-300">${ssrInterpolate(__props.description)}</p></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/CalculatorHeaderBlock.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const CalculatorHeaderBlock = Object.assign(_sfc_main$6, { __name: "CalculatorHeaderBlock" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "CalculatorShell",
  __ssrInlineRender: true,
  props: {
    anchorId: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: __props.anchorId,
        class: "calculator-shell dark rounded-xl border border-white/10 bg-mirage-950 text-white shadow-lg"
      }, _attrs))} data-v-8dec1359><div class="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.88fr)] lg:gap-6" data-v-8dec1359><div class="min-w-0 space-y-5" data-v-8dec1359>`);
      ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "form", {}, null, _push, _parent);
      _push(`</div><div class="min-w-0 lg:border-l lg:border-white/10 lg:pl-6" data-v-8dec1359>`);
      ssrRenderSlot(_ctx.$slots, "preview", {}, null, _push, _parent);
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/CalculatorShell.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const CalculatorShell = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$5, [["__scopeId", "data-v-8dec1359"]]), { __name: "CalculatorShell" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "FinishingSelector",
  __ssrInlineRender: true,
  props: {
    groups: {},
    laminationSides: {},
    selectUi: {},
    isSelected: { type: Function },
    showSideSelector: { type: Function },
    getSide: { type: Function }
  },
  emits: ["toggle", "update-side"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3 rounded-lg border border-white/10 bg-white/5 p-3" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.groups, (group) => {
        _push(`<div class="space-y-3 rounded-lg border border-white/10 bg-mirage-900/70 p-3"><p class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-300">${ssrInterpolate(group.label)}</p><div class="flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(group.options, (option) => {
          _push(`<button type="button" class="${ssrRenderClass([__props.isSelected(option.id) ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white", "rounded-md border px-3 py-2 text-sm font-medium transition-colors"])}">${ssrInterpolate(option.name)}</button>`);
        });
        _push(`<!--]--></div><!--[-->`);
        ssrRenderList(group.options.filter((item) => __props.showSideSelector(item.id)), (option) => {
          _push(`<div>`);
          _push(ssrRenderComponent(_component_USelectMenu, {
            "model-value": __props.getSide(option.id),
            items: __props.laminationSides,
            "value-key": "value",
            "label-key": "label",
            ui: __props.selectUi,
            portal: "body",
            class: "w-full",
            "onUpdate:modelValue": ($event) => _ctx.$emit("update-side", option.id, $event)
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/FinishingSelector.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const FinishingSelector = Object.assign(_sfc_main$4, { __name: "CalculatorFinishingSelector" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "QuotePreviewMeta",
  __ssrInlineRender: true,
  props: {
    title: {},
    lines: {},
    placeholder: { default: "Pending" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-2" }, _attrs))}><p class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-500">${ssrInterpolate(__props.title)}</p><div class="space-y-1.5"><!--[-->`);
      ssrRenderList(__props.lines, (line) => {
        _push(`<div class="flex items-start justify-between gap-3 text-sm"><span class="text-slate-500">${ssrInterpolate(line.label)}</span><span class="text-right font-medium text-slate-900">${ssrInterpolate(line.value || __props.placeholder)}</span></div>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/QuotePreviewMeta.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const QuotePreviewMeta = Object.assign(_sfc_main$3, { __name: "CalculatorQuotePreviewMeta" });
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "calculator-preview-light rounded-lg border border-slate-200 bg-white p-4 text-slate-900 shadow-md sm:p-5" }, _attrs))} data-v-7b26b81a>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/QuotePreviewPanel.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const QuotePreviewPanel = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-7b26b81a"]]), { __name: "CalculatorQuotePreviewPanel" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "QuotePreviewRequirementsState",
  __ssrInlineRender: true,
  props: {
    title: {},
    items: {},
    helper: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "rounded-lg border border-amber-200 bg-amber-50 p-4" }, _attrs))}><p class="text-sm font-semibold text-amber-900">${ssrInterpolate(__props.title)}</p><ul class="mt-3 space-y-2 text-sm text-amber-900"><!--[-->`);
      ssrRenderList(__props.items, (item) => {
        _push(`<li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500"></span><span>${ssrInterpolate(item)}</span></li>`);
      });
      _push(`<!--]--></ul>`);
      if (__props.helper) {
        _push(`<p class="mt-3 text-xs leading-5 text-amber-700">${ssrInterpolate(__props.helper)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/QuotePreviewRequirementsState.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const QuotePreviewRequirementsState = Object.assign(_sfc_main$1, { __name: "CalculatorQuotePreviewRequirementsState" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ShopSelectionChips",
  __ssrInlineRender: true,
  props: {
    shops: {},
    selectedSlugs: {}
  },
  emits: ["toggle"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] p-3" }, _attrs))}><div class="flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(__props.shops, (shop) => {
        _push(`<button type="button" class="${ssrRenderClass([__props.selectedSlugs.includes(shop.slug) ? "border-flamingo-400 bg-flamingo-500/12 text-[var(--p-text)]" : "border-[var(--p-border)] bg-[var(--p-surface-sunken)] text-[var(--p-text-muted)] hover:border-flamingo-300 hover:text-[var(--p-text)]", "rounded-md border px-3 py-2 text-sm font-medium transition-colors"])}">${ssrInterpolate(shop.label)}</button>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/ShopSelectionChips.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const QuotesShopSelectionChips = Object.assign(_sfc_main, { __name: "QuotesShopSelectionChips" });
const calculatorSelectUi = {
  base: "softui-control relative w-full min-h-10 overflow-hidden rounded-md border border-white/10 bg-white/5 text-sm text-slate-100",
  trigger: "flex min-w-0 w-full items-center gap-2 bg-transparent px-4 py-2 pe-10 text-sm text-slate-100",
  value: "min-w-0 flex-1 truncate text-slate-100",
  placeholder: "min-w-0 flex-1 truncate text-slate-400",
  trailingIcon: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400",
  content: "z-[100000] overflow-hidden rounded-lg border border-[var(--p-border)] bg-white text-slate-900 shadow-lg",
  viewport: "max-h-72 overflow-y-auto p-1",
  item: "rounded-md text-slate-900 data-highlighted:not-data-disabled:bg-slate-100 data-highlighted:not-data-disabled:text-slate-900",
  itemLabel: "truncate",
  itemDescription: "text-xs text-slate-500",
  empty: "px-3 py-2 text-sm text-slate-500"
};
const useQuoteInboxStore = defineStore("quoteInbox", () => {
  const dashboard = ref(null);
  const drafts = ref([]);
  const clientRequests = ref([]);
  const loading = ref(false);
  const loaded = ref(false);
  const error = ref(null);
  async function fetchDashboard() {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      dashboard.value = await $api(API.dashboardShopHome());
      loaded.value = true;
      return dashboard.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load dashboard.";
      throw err;
    } finally {
      loading.value = false;
    }
  }
  async function fetchDrafts() {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      drafts.value = await $api(API.calculatorDrafts());
      return drafts.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load drafts.";
      throw err;
    } finally {
      loading.value = false;
    }
  }
  async function fetchClientRequests() {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      const requests = await $api(API.quoteRequests());
      const requestList = Array.isArray(requests) ? requests : requests.results ?? [];
      const requestWithResponses = await Promise.all(requestList.map(async (request) => {
        const responses = await $api(API.quoteRequestResponses(request.id));
        const responseList = Array.isArray(responses) ? responses : responses.results ?? [];
        const latestResponse = [...responseList].sort(
          (left, right) => new Date(right.created_at ?? right.sent_at ?? 0).getTime() - new Date(left.created_at ?? left.sent_at ?? 0).getTime()
        )[0] ?? null;
        return {
          ...request,
          latest_response: latestResponse,
          response_status: latestResponse?.status ?? "pending"
        };
      }));
      clientRequests.value = requestWithResponses;
      loaded.value = true;
      return clientRequests.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load requests.";
      throw err;
    } finally {
      loading.value = false;
    }
  }
  async function saveDraft(payload) {
    const { $api } = useNuxtApp();
    const draft = await $api(API.calculatorDrafts(), {
      method: "POST",
      body: payload
    });
    await fetchDrafts();
    return draft;
  }
  async function sendDraft(id, shops, requestDetailsSnapshot) {
    const { $api } = useNuxtApp();
    const responses = await $api(API.calculatorDraftSend(id), {
      method: "POST",
      body: {
        shops,
        request_details_snapshot: requestDetailsSnapshot ?? {}
      }
    });
    await fetchDrafts();
    return responses;
  }
  return {
    dashboard,
    drafts,
    clientRequests,
    loading,
    loaded,
    error,
    fetchDashboard,
    fetchDrafts,
    fetchClientRequests,
    saveDraft,
    sendDraft
  };
});

export { CalculatorShell as C, FinishingSelector as F, QuotesShopSelectionChips as Q, QuotePreviewPanel as a, QuotePreviewMeta as b, QuotePreviewRequirementsState as c, CalculatorFormGrid as d, CalculatorFieldGroup as e, calculatorSelectUi as f, CalculatorHeaderBlock as g, useQuoteInboxStore as u };
//# sourceMappingURL=quoteInbox-CT7a8yeE.mjs.map
