import { a as _sfc_main$f } from './server.mjs';
import { ref, watch, computed, defineComponent, unref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { g as getBrowserStorage } from './browser-storage-CN-SIF_V.mjs';
import { defineStore } from 'pinia';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "QuoteConfigModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    title: {},
    description: { default: "" },
    eyebrow: { default: "" },
    size: { default: "lg" }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const panelClasses = computed(() => {
      if (props.size === "md") {
        return "max-h-[92dvh] sm:max-h-[90dvh] sm:max-w-2xl";
      }
      if (props.size === "xl") {
        return "max-h-[96dvh] sm:max-h-[94dvh] sm:max-w-5xl";
      }
      return "max-h-[96dvh] sm:max-h-[92dvh] sm:max-w-4xl";
    });
    watch(() => props.open, (open) => {
      (void 0).body.style.overflow = open ? "hidden" : "";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true"><div class="absolute inset-0 bg-black/55 backdrop-blur-sm" aria-hidden="true"></div><div class="${ssrRenderClass([unref(panelClasses), "modal-panel relative z-[100010] flex w-full flex-col overflow-hidden rounded-t-lg border border-[var(--p-border)] bg-[var(--p-surface-raised)] shadow-lg sm:rounded-lg"])}"><div class="sticky top-0 z-10 border-b border-[var(--p-border)] bg-[var(--p-surface)]/96 px-4 py-4 backdrop-blur sm:px-6"><div class="flex items-start justify-between gap-4"><div class="min-w-0">`);
          if (__props.eyebrow) {
            _push2(`<p class="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">${ssrInterpolate(__props.eyebrow)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<h2 class="mt-1 text-base font-semibold text-[var(--p-text)] sm:text-lg">${ssrInterpolate(__props.title)}</h2>`);
          if (__props.description) {
            _push2(`<p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(__props.description)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><button type="button" class="rounded-md p-1.5 text-[var(--p-text-muted)] transition-colors hover:bg-[var(--p-surface-sunken)] hover:text-[var(--p-text)]" aria-label="Close">`);
          _push2(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-x",
            class: "h-5 w-5"
          }, null, _parent));
          _push2(`</button></div></div><div class="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div>`);
          if (_ctx.$slots.footer) {
            _push2(`<div class="border-t border-[var(--p-border)] bg-[var(--p-surface)]/98 px-4 py-4 backdrop-blur sm:px-6">`);
            ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push2, _parent);
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/QuoteConfigModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "QuotesQuoteConfigModal" });
const STORAGE_KEY = "printy-guest-quote";
const storage = getBrowserStorage();
function loadFromStorage() {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.shopSlug || !Array.isArray(parsed.items)) return null;
    return parsed;
  } catch {
    return null;
  }
}
function saveToStorage(quote) {
  try {
    if (quote && quote.items.length > 0) {
      storage.setItem(STORAGE_KEY, JSON.stringify(quote));
    } else {
      storage.removeItem(STORAGE_KEY);
    }
  } catch {
  }
}
function generateId() {
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
const useGuestQuoteStore = defineStore("guestQuote", () => {
  const quote = ref(loadFromStorage());
  watch(quote, (q) => saveToStorage(q), { deep: true });
  const hasItems = computed(() => (quote.value?.items?.length ?? 0) > 0);
  const itemCount = computed(() => quote.value?.items?.length ?? 0);
  function setQuote(shopSlug, shopName) {
    const existing = quote.value;
    if (existing && existing.shopSlug !== shopSlug) {
      quote.value = { shopSlug, shopName, items: [] };
    } else if (!existing) {
      quote.value = { shopSlug, shopName, items: [] };
    } else {
      quote.value = { ...existing, shopName };
    }
  }
  function addItem(shopSlug, shopName, productName, payload) {
    if (!quote.value || quote.value.shopSlug !== shopSlug) {
      quote.value = { shopSlug, shopName, items: [] };
    }
    const item = {
      id: generateId(),
      item_type: "PRODUCT",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      product: payload.product,
      product_name: productName,
      quantity: payload.quantity ?? 100,
      pricing_mode: payload.pricing_mode,
      paper: payload.paper ?? null,
      material: payload.material ?? null,
      machine: payload.machine ?? null,
      sides: payload.sides,
      color_mode: payload.color_mode,
      special_instructions: payload.special_instructions,
      finishings: payload.finishings
    };
    quote.value.items.push(item);
  }
  function updateItemQty(itemId, qty) {
    const item = quote.value?.items.find((i) => i.id === itemId);
    if (!item) return;
    item.quantity = Math.max(100, qty);
  }
  function removeItem(itemId) {
    if (!quote.value) return;
    quote.value.items = quote.value.items.filter((i) => i.id !== itemId);
    if (quote.value.items.length === 0) {
      quote.value = null;
    }
  }
  function clear() {
    quote.value = null;
    saveToStorage(null);
  }
  function getAddPayloads() {
    return (quote.value?.items ?? []).map((i) => ({
      product: i.product,
      quantity: i.quantity,
      pricing_mode: i.pricing_mode ?? "SHEET",
      paper: i.paper ?? void 0,
      material: i.material ?? void 0,
      machine: i.machine ?? void 0,
      sides: i.sides ?? "SIMPLEX",
      color_mode: i.color_mode ?? "COLOR",
      special_instructions: i.special_instructions ?? void 0,
      finishings: i.finishings ?? void 0
    }));
  }
  return {
    quote,
    hasItems,
    itemCount,
    setQuote,
    addItem,
    updateItemQty,
    removeItem,
    clear,
    getAddPayloads
  };
});

export { __nuxt_component_0 as _, useGuestQuoteStore as u };
//# sourceMappingURL=guestQuote-BUq63JnA.mjs.map
