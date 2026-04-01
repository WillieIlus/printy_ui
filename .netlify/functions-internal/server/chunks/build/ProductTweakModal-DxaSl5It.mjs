import { c as formatCurrency, b as formatCurrencyRange } from './formatters-Cc_7PG6h.mjs';
import { u as useGuestQuoteStore, _ as __nuxt_component_0 } from './guestQuote-BUq63JnA.mjs';
import { _ as __nuxt_component_2 } from './PublicCalculator-7GJGXk0j.mjs';
import { defineComponent, useModel, computed, watch, mergeProps, withCtx, unref, createVNode, mergeModels, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { c as useAuthStore, e as useToast, g as useAnalyticsTracking } from './server.mjs';
import { u as useQuoteDraftStore } from './quoteDraft-D14UWIgv.mjs';

function useProductPriceDisplay() {
  function resolveProductCurrency(product) {
    return product.price_range_est?.currency ?? product.price_hint?.currency ?? product.shop?.currency ?? null;
  }
  function priceDisplay(product) {
    const est = product.price_range_est;
    const hint = product.price_hint;
    const currency = resolveProductCurrency(product);
    if (est?.price_display) return est.price_display;
    if (hint?.price_display) return hint.price_display;
    if (est?.lowest?.total) return `From ${formatCurrency(est.lowest.total, currency ?? "KES")}`;
    if (hint?.min_price != null) return `From ${formatCurrency(hint.min_price, currency ?? "KES")}`;
    return "Price on request";
  }
  function priceDisplaySummary(product) {
    const est = product.price_range_est;
    const hint = product.price_hint;
    const src = est ?? hint;
    if (!src?.can_calculate) return null;
    const currency = resolveProductCurrency(product);
    const qty = src.quantity_used ?? product.min_quantity ?? 1;
    const totalLow = src.total_low ?? hint?.min_price ?? (est?.lowest?.total ? parseFloat(est.lowest.total) : null);
    const totalHigh = src.total_high ?? hint?.max_price ?? (est?.highest?.total ? parseFloat(est.highest.total) : null);
    const perLow = src.per_unit_low ?? (totalLow != null && qty ? totalLow / qty : null);
    const perHigh = src.per_unit_high ?? (totalHigh != null && qty ? totalHigh / qty : null);
    const unitLabel = src.unit_label ?? "per item";
    if (totalLow == null) return null;
    const totalLine = totalHigh != null && Math.abs((totalHigh ?? 0) - totalLow) >= 0.01 ? formatCurrencyRange(totalLow, totalHigh, currency ?? "KES") ?? formatCurrency(totalLow, currency ?? "KES") : formatCurrency(totalLow, currency ?? "KES");
    const perUnitLine = perLow != null ? perHigh != null && Math.abs(perHigh - perLow) >= 0.01 ? `${formatCurrencyRange(perLow, perHigh, currency ?? "KES")} ${unitLabel}` : `${formatCurrency(perLow, currency ?? "KES")} ${unitLabel}` : "";
    const totalWithQty = qty > 1 ? `${totalLine} (${qty} pcs)` : totalLine;
    return { totalLine: totalWithQty, perUnitLine };
  }
  function tweakPriceDisplaySummary(product, form, finishingRates = []) {
    const hint = product.price_hint;
    const est = product.price_range_est;
    const src = est ?? hint;
    if (!src?.can_calculate) return null;
    const defaultQty = src.quantity_used ?? product.min_quantity ?? 100;
    const totalLow = src.total_low ?? hint?.min_price ?? (est?.lowest?.total ? parseFloat(est.lowest.total) : null);
    const totalHigh = src.total_high ?? hint?.max_price ?? (est?.highest?.total ? parseFloat(est.highest.total) : null);
    const baseTotal = totalLow ?? totalHigh ?? 0;
    if (baseTotal <= 0) return null;
    let total = baseTotal * (form.quantity / defaultQty);
    if (form.sides === "DUPLEX" && product.default_sides !== "DUPLEX") {
      total *= 1.4;
    }
    for (const f of form.finishings) {
      const rate = finishingRates.find((r) => r.id === f.finishing_rate);
      if (!rate) continue;
      const price = parseFloat(rate.price) || 0;
      if (rate.charge_unit === "FLAT") total += price;
      else total += price * form.quantity;
    }
    const rounded = Math.round(total);
    const perUnit = form.quantity > 0 ? Math.round(total / form.quantity * 100) / 100 : 0;
    const currency = resolveProductCurrency(product);
    return {
      totalLine: formatCurrency(rounded, currency ?? "KES"),
      perUnitLine: `${formatCurrency(perUnit, currency ?? "KES")} per item`
    };
  }
  function priceDiagnostics(product) {
    const est = product.price_range_est;
    const hint = product.price_hint;
    const src = est ?? hint;
    if (!src || src.can_calculate) return null;
    return {
      reason: src.reason,
      missingFields: src.missing_fields,
      suggestions: src.suggestions
    };
  }
  return { priceDisplay, priceDisplaySummary, tweakPriceDisplaySummary, priceDiagnostics };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductTweakModal",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    product: {},
    shopSlug: {},
    shopName: {},
    mode: {}
  }, {
    "modelValue": { type: Boolean, ...{ default: false } },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["added"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isOpen = useModel(__props, "modelValue");
    const authStore = useAuthStore();
    const guestStore = useGuestQuoteStore();
    const quoteDraftStore = useQuoteDraftStore();
    const toast = useToast();
    const { trackQuoteStart } = useAnalyticsTracking();
    const mode = computed(() => props.mode ?? "tweak");
    watch(isOpen, (open) => {
      if (!open) return;
      void trackQuoteStart({
        source: mode.value === "tweak-and-quote" ? "gallery_tweak_and_quote" : "gallery_tweak",
        product_id: props.product.id,
        product_name: props.product.name,
        product_slug: props.product.slug,
        shop_slug: props.shopSlug
      });
    });
    async function onSubmit(payload) {
      if (payload.item_type !== "PRODUCT") return;
      if (!authStore.isAuthenticated) {
        guestStore.addItem(props.shopSlug, props.shopName ?? "Shop", props.product.name, {
          product: payload.product,
          quantity: payload.quantity,
          pricing_mode: payload.pricing_mode,
          paper: payload.paper ?? void 0,
          material: payload.material ?? void 0,
          machine: payload.machine ?? void 0,
          sides: payload.sides,
          color_mode: payload.color_mode,
          finishings: payload.finishings
        });
        toast.add({ title: "Added to draft", description: "Sign in when you are ready to submit the quote request.", color: "success" });
        emit("added");
        isOpen.value = false;
        return;
      }
      await quoteDraftStore.addTweakedProductToQuote(props.shopSlug, payload);
      toast.add({ title: "Added to draft", description: `${props.product.name} added to your draft.`, color: "success" });
      emit("added");
      isOpen.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_QuotesQuoteConfigModal = __nuxt_component_0;
      const _component_QuotesPublicCalculator = __nuxt_component_2;
      _push(ssrRenderComponent(_component_QuotesQuoteConfigModal, mergeProps({
        open: isOpen.value,
        eyebrow: "Quote Configuration",
        title: `Configure ${__props.product.name}`,
        description: "This public tweak flow now runs on the shared calculator engine. Machine selection stays hidden in public mode.",
        size: "lg",
        "onUpdate:open": ($event) => isOpen.value = $event
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_QuotesPublicCalculator, {
              title: `Tweak ${__props.product.name}`,
              description: "Shared public calculator mode for tweak and tweak-and-quote flows.",
              eyebrow: "Tweak Flow",
              mode: unref(mode),
              product: __props.product,
              "fixed-shop-slug": __props.shopSlug,
              "fixed-shop-name": __props.shopName,
              onSubmit
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_QuotesPublicCalculator, {
                title: `Tweak ${__props.product.name}`,
                description: "Shared public calculator mode for tweak and tweak-and-quote flows.",
                eyebrow: "Tweak Flow",
                mode: unref(mode),
                product: __props.product,
                "fixed-shop-slug": __props.shopSlug,
                "fixed-shop-name": __props.shopName,
                onSubmit
              }, null, 8, ["title", "mode", "product", "fixed-shop-slug", "fixed-shop-name"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/ProductTweakModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main, { __name: "QuotesProductTweakModal" });

export { __nuxt_component_9 as _, useProductPriceDisplay as u };
//# sourceMappingURL=ProductTweakModal-DxaSl5It.mjs.map
