import { w as _export_sfc, a as _sfc_main$f } from './server.mjs';
import { defineComponent, mergeProps, useModel, computed, unref, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const calculatorTypeOptions = [
  {
    label: "Flat",
    value: "flat",
    description: "Standard flat-print jobs with backend pricing and imposition.",
    icon: "i-lucide-rectangle-horizontal"
  },
  {
    label: "Booklet",
    value: "booklet",
    description: "Booklet workflows with cover, inserts, binding, and turnaround.",
    icon: "i-lucide-book-open"
  },
  {
    label: "Large Format",
    value: "large_format",
    description: "Area-based pricing for banners, posters, stickers, roll-ups, and boards.",
    icon: "i-lucide-image"
  }
];
function getCalculatorTypeLabel(type) {
  return calculatorTypeOptions.find((option) => option.value === type)?.label ?? "Flat";
}
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "CalculatorTypeSwitcher",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    options: { default: () => calculatorTypeOptions },
    size: { default: "md" },
    tone: { default: "default" }
  }, {
    "modelValue": { default: "flat" },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const model = useModel(__props, "modelValue");
    const normalizedOptions = computed(() => props.options.length ? props.options : calculatorTypeOptions);
    const sizeClass = computed(
      () => props.size === "sm" ? "min-h-9 px-3 py-2 text-[0.76rem] font-semibold" : "min-h-10 px-3.5 py-2 text-sm font-semibold"
    );
    const iconClass = computed(() => props.size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4");
    const activeClass = computed(
      () => props.tone === "embedded" ? `${sizeClass.value} border-flamingo-400/80 bg-flamingo-500/18 text-white shadow-[0_12px_30px_rgba(240,82,36,0.18)]` : `${sizeClass.value} border-flamingo-500 bg-flamingo-500 text-white shadow-sm`
    );
    const inactiveClass = computed(
      () => props.tone === "embedded" ? `${sizeClass.value} border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white` : `${sizeClass.value} border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-text)] hover:border-flamingo-300 hover:text-flamingo-600`
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "flex flex-nowrap gap-2 overflow-x-auto pb-1",
        role: "tablist",
        "aria-label": "Calculator type"
      }, _attrs))}><!--[-->`);
      ssrRenderList(unref(normalizedOptions), (option) => {
        _push(`<button type="button" class="${ssrRenderClass([option.value === model.value ? unref(activeClass) : unref(inactiveClass), "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border transition"])}"${ssrRenderAttr("aria-selected", option.value === model.value)}${ssrRenderAttr("aria-pressed", option.value === model.value)}>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: option.icon,
          class: unref(iconClass)
        }, null, _parent));
        _push(` ${ssrInterpolate(option.label)}</button>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/CalculatorTypeSwitcher.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const CalculatorTypeSwitcher = Object.assign(_sfc_main$7, { __name: "CalculatorTypeSwitcher" });
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/CalculatorFieldGroup.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const CalculatorFieldGroup = Object.assign(_sfc_main$6, { __name: "CalculatorFieldGroup" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/CalculatorFormGrid.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const CalculatorFormGrid = Object.assign(_sfc_main$5, { __name: "CalculatorFormGrid" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "CalculatorHeaderBlock",
  __ssrInlineRender: true,
  props: {
    eyebrow: { default: "" },
    title: { default: "" },
    description: { default: "" },
    compact: { type: Boolean, default: false }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.eyebrow || __props.title || __props.description) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: __props.compact ? "space-y-2" : "space-y-3"
        }, _attrs))}>`);
        if (__props.eyebrow) {
          _push(`<p class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-300">${ssrInterpolate(__props.eyebrow)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.title) {
          _push(`<h2 class="${ssrRenderClass(__props.compact ? "text-xl font-semibold text-white" : "text-2xl font-semibold text-white sm:text-3xl")}">${ssrInterpolate(__props.title)}</h2>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.description) {
          _push(`<p class="max-w-3xl text-sm leading-6 text-slate-300">${ssrInterpolate(__props.description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/CalculatorHeaderBlock.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const CalculatorHeaderBlock = Object.assign(_sfc_main$4, { __name: "CalculatorHeaderBlock" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-e929f31c><div class="grid gap-5 lg:grid-cols-[minmax(0,1.42fr)_minmax(19rem,0.78fr)] lg:gap-6" data-v-e929f31c><div class="min-w-0 space-y-5" data-v-e929f31c>`);
      ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "form", {}, null, _push, _parent);
      _push(`</div><div class="min-w-0 lg:border-l lg:border-white/10 lg:pl-6" data-v-e929f31c>`);
      ssrRenderSlot(_ctx.$slots, "preview", {}, null, _push, _parent);
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/CalculatorShell.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const CalculatorShell = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["__scopeId", "data-v-e929f31c"]]), { __name: "CalculatorShell" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/QuotePreviewMeta.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const QuotePreviewMeta = Object.assign(_sfc_main$2, { __name: "CalculatorQuotePreviewMeta" });
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "calculator-preview-light rounded-lg border border-slate-200 bg-white p-4 text-slate-900 shadow-md sm:p-5" }, _attrs))} data-v-7b26b81a>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/QuotePreviewPanel.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const QuotePreviewPanel = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-7b26b81a"]]), { __name: "CalculatorQuotePreviewPanel" });
const _sfc_main = /* @__PURE__ */ defineComponent({
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/QuotePreviewRequirementsState.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const QuotePreviewRequirementsState = Object.assign(_sfc_main, { __name: "CalculatorQuotePreviewRequirementsState" });
const calculatorSelectUi = {
  base: "softui-control relative w-full min-h-10 overflow-hidden rounded-md border border-white/10 bg-white/5 text-sm text-slate-100",
  trigger: "flex min-w-0 w-full items-center gap-2 bg-transparent px-4 py-2 pe-10 text-sm text-slate-100",
  value: "min-w-0 flex-1 truncate text-slate-100",
  placeholder: "min-w-0 flex-1 truncate text-slate-400",
  trailing: "pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3",
  trailingIcon: "h-4 w-4 shrink-0 text-slate-400",
  content: "z-[100000] overflow-hidden rounded-lg border border-[var(--p-border)] bg-white text-slate-900 shadow-lg",
  viewport: "max-h-72 overflow-y-auto p-1",
  item: "rounded-md text-slate-900 data-highlighted:not-data-disabled:bg-slate-100 data-highlighted:not-data-disabled:text-slate-900",
  itemLabel: "truncate",
  itemDescription: "text-xs text-slate-500",
  empty: "px-3 py-2 text-sm text-slate-500"
};
const sizePresets = [
  { label: "Business Card", widthMm: 85, heightMm: 55 },
  { label: "A6", widthMm: 105, heightMm: 148 },
  { label: "A5", widthMm: 148, heightMm: 210 },
  { label: "A4", widthMm: 210, heightMm: 297 },
  { label: "A3", widthMm: 297, heightMm: 420 },
  { label: "Letter", widthMm: 216, heightMm: 279 },
  { label: "Legal", widthMm: 216, heightMm: 356 }
];
const unitFactors = {
  mm: 1,
  cm: 10,
  m: 1e3,
  in: 25.4
};
function roundCanonicalMm(value) {
  return Math.max(1, Math.round(value));
}
function trimTrailingZeros(value) {
  return value.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
function getSizePreset(label) {
  if (!label) return null;
  return sizePresets.find((preset) => preset.label.toLowerCase() === String(label).trim().toLowerCase()) ?? null;
}
function inferSizePresetLabel(widthMm, heightMm) {
  const width = typeof widthMm === "number" ? roundCanonicalMm(widthMm) : null;
  const height = typeof heightMm === "number" ? roundCanonicalMm(heightMm) : null;
  if (!width || !height) return null;
  return sizePresets.find((preset) => preset.widthMm === width && preset.heightMm === height)?.label ?? null;
}
function convertInputToMm(value, unit) {
  if (value === null || value === void 0 || value === "") return null;
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return roundCanonicalMm(parsed * unitFactors[unit]);
}
function convertMmToDisplay(mm, unit) {
  if (typeof mm !== "number" || !Number.isFinite(mm) || mm <= 0) return "";
  const decimals = unit === "mm" ? 0 : 3;
  return trimTrailingZeros((mm / unitFactors[unit]).toFixed(decimals));
}
function formatMmSize(widthMm, heightMm) {
  if (!widthMm || !heightMm) return "";
  return `${roundCanonicalMm(widthMm)} x ${roundCanonicalMm(heightMm)} mm`;
}
function formatSizeSummary(widthMm, heightMm, sizeLabel) {
  const metric = formatMmSize(widthMm, heightMm);
  if (!metric) return "";
  return sizeLabel ? `${sizeLabel} · ${metric}` : metric;
}
function asRecord(value) {
  return value && typeof value === "object" ? value : null;
}
function normalizeMoney(value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}
function getCalculationLineItems(preview) {
  const record = asRecord(preview);
  const calculationResult = asRecord(record?.calculation_result);
  const lineItems = calculationResult?.line_items;
  return Array.isArray(lineItems) ? lineItems : [];
}
function getCalculationLineAmount(preview, matcher) {
  const line = getCalculationLineItems(preview).find(matcher);
  return normalizeMoney(line?.amount);
}
function extractCalculationResult(preview) {
  const record = asRecord(preview);
  return asRecord(record?.calculation_result);
}
function getPreviewMoney(preview, key) {
  const record = asRecord(preview);
  const totals = asRecord(record?.totals);
  const calculationResult = extractCalculationResult(record);
  if (key === "paper_cost") {
    return normalizeMoney(totals?.paper_cost) ?? getCalculationLineAmount(record, (line) => line.code === "paper");
  }
  if (key === "print_cost") {
    return normalizeMoney(totals?.print_cost) ?? getCalculationLineAmount(record, (line) => line.code === "printing");
  }
  if (key === "vat") {
    return normalizeMoney(totals?.vat) ?? normalizeMoney(totals?.vat_amount) ?? getCalculationLineAmount(record, (line) => line.code === "vat") ?? normalizeMoney(asRecord(record?.vat)?.amount);
  }
  if (key === "finishing_total") {
    return normalizeMoney(totals?.finishing_total) ?? normalizeMoney(calculationResult?.finishing_total);
  }
  if (key === "grand_total") {
    return normalizeMoney(totals?.grand_total) ?? normalizeMoney(calculationResult?.grand_total) ?? normalizeMoney(record?.total);
  }
  if (key === "subtotal") {
    return normalizeMoney(totals?.subtotal) ?? normalizeMoney(calculationResult?.subtotal);
  }
  if (key === "unit_price") {
    return normalizeMoney(totals?.unit_price) ?? normalizeMoney(calculationResult?.unit_price);
  }
  return null;
}

export { CalculatorShell as C, QuotePreviewPanel as Q, getCalculatorTypeLabel as a, CalculatorTypeSwitcher as b, calculatorTypeOptions as c, QuotePreviewMeta as d, QuotePreviewRequirementsState as e, formatSizeSummary as f, getPreviewMoney as g, CalculatorFormGrid as h, CalculatorFieldGroup as i, calculatorSelectUi as j, CalculatorHeaderBlock as k, inferSizePresetLabel as l, convertInputToMm as m, convertMmToDisplay as n, getSizePreset as o, sizePresets as s };
//# sourceMappingURL=calculationResult-SiwRgRTu.mjs.map
