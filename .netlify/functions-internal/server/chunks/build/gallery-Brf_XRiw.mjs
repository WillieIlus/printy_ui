import { h as useToast, d as _sfc_main$9, l as __nuxt_component_5, a as _sfc_main$f, _ as __nuxt_component_3$1$1, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_3$1 } from './EmptyState-InVpxbUI.mjs';
import { _ as _sfc_main$2 } from './Badge-DzyqaO77.mjs';
import { _ as _sfc_main$3 } from './Input-D98neQoC.mjs';
import { _ as _sfc_main$4 } from './Checkbox-8D35u7U_.mjs';
import { _ as _sfc_main$5 } from './Textarea-m5qrWcEy.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, isRef, reactive, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderTeleport, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseEqual } from 'vue/server-renderer';
import { a as getGalleryProductOptions, c as calculateGalleryProductPrice } from './gallery-B-1C6f8x.mjs';
import { getActiveDraft, tweakAndAdd } from './quoteDraft-BpsjrEHr.mjs';
import { u as useGuestQuoteStore } from './guestQuote-Cd2LcvdR.mjs';
import { a as formatKES } from './formatters-D5StX5za.mjs';
import { u as useApi } from './useApi-FvTSG0mK.mjs';
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
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const DEBOUNCE_MS = 300;
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "GalleryTweakQuoteModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    product: {},
    category: {}
  },
  emits: ["update:open", "close", "added"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { getMediaUrl } = useApi();
    const toast = useToast();
    const authStore = useAuthStore();
    const quantity = ref(100);
    const calculating = ref(false);
    const priceResult = ref(null);
    const isDemoMode = ref(false);
    const productOptions = ref(null);
    const optionsLoading = ref(false);
    const submitting = ref(false);
    const addedItem = ref(null);
    const form = reactive({
      paper: null,
      material: null,
      machine: null,
      finishings: [],
      sides: "DUPLEX",
      color_mode: "COLOR",
      special_instructions: ""
    });
    const needsMachineWarning = computed(
      () => pricingMode.value === "SHEET" && machines.value.length > 0 && !form.machine
    );
    const minQuantity = computed(() => {
      const opts = productOptions.value;
      if (opts?.min_quantity) return opts.min_quantity;
      const dims = props.product.dimensions_label ?? "";
      const isSmall = /(\d+)\s*[×x]\s*(\d+)/i.test(dims);
      return isSmall ? 100 : 50;
    });
    const papers = computed(() => productOptions.value?.available_papers ?? []);
    const materials = computed(() => productOptions.value?.available_materials ?? []);
    const finishingRates = computed(() => productOptions.value?.available_finishings ?? []);
    const machines = computed(() => productOptions.value?.available_machines ?? []);
    const pricingMode = computed(() => productOptions.value?.pricing_mode ?? "SHEET");
    const defaultSides = computed(() => productOptions.value?.default_sides ?? "DUPLEX");
    const imageUrl = computed(() => {
      const path = props.product.preview_image;
      if (!path) return null;
      if (path.startsWith("http")) return path;
      return getMediaUrl(path);
    });
    const isLoggedIn = computed(() => !!authStore.user);
    function parseDimensions(label) {
      if (!label) return { width: 210, height: 297 };
      const m = label.match(/(\d+)\s*[×x]\s*(\d+)/i);
      if (m) return { width: parseInt(m[1], 10), height: parseInt(m[2], 10) };
      return { width: 210, height: 297 };
    }
    function computeDemoPrice() {
      const dims = parseDimensions(props.product.dimensions_label);
      const areaSqm = dims.width / 1e3 * (dims.height / 1e3);
      const basePerPiece = 2.5;
      const material = Math.round(areaSqm * quantity.value * basePerPiece * 100) / 100;
      const printing = Math.round(quantity.value * 0.8 * 100) / 100;
      const finishing = Math.round(quantity.value * 0.15 * 100) / 100;
      const total = material + printing + finishing;
      return {
        product_id: props.product.id,
        product_slug: props.product.slug,
        breakdown: { material, printing, finishing, total }
      };
    }
    async function fetchOptions() {
      optionsLoading.value = true;
      productOptions.value = null;
      try {
        productOptions.value = await getGalleryProductOptions(props.product.id);
        if (productOptions.value) {
          form.sides = defaultSides.value;
          quantity.value = minQuantity.value;
          if (pricingMode.value === "SHEET" && papers.value.length && !form.paper) {
            form.paper = papers.value[0].id;
          }
          if (pricingMode.value === "SHEET" && machines.value.length && !form.machine) {
            form.machine = machines.value[0].id;
          }
          if (pricingMode.value === "LARGE_FORMAT" && materials.value.length && !form.material) {
            form.material = materials.value[0].id;
          }
        }
      } finally {
        optionsLoading.value = false;
      }
    }
    async function fetchPrice() {
      const shopSlug = props.product.shop?.slug;
      if (!shopSlug) {
        priceResult.value = computeDemoPrice();
        isDemoMode.value = true;
        return;
      }
      calculating.value = true;
      priceResult.value = null;
      isDemoMode.value = false;
      try {
        const result = await calculateGalleryProductPrice(shopSlug, props.product.slug, {
          quantity: quantity.value,
          paper_id: form.paper ?? void 0,
          material_id: form.material ?? void 0,
          machine_id: form.machine ?? void 0,
          sides: form.sides,
          color_mode: form.color_mode,
          finishings: form.finishings.length ? form.finishings : void 0
        });
        if (result) {
          priceResult.value = result;
          isDemoMode.value = false;
        } else {
          priceResult.value = computeDemoPrice();
          isDemoMode.value = true;
        }
      } catch {
        priceResult.value = computeDemoPrice();
        isDemoMode.value = true;
      } finally {
        calculating.value = false;
      }
    }
    function toggleFinishing(id, checked) {
      if (checked) {
        form.finishings.push({ finishing_rate: id });
      } else {
        form.finishings = form.finishings.filter((f) => f.finishing_rate !== id);
      }
    }
    async function handleAddToQuote() {
      const shopSlug = props.product.shop?.slug;
      const shopName = props.product.shop?.name ?? "Shop";
      if (!shopSlug) {
        toast.add({ title: "No shop", description: "This product is not linked to a shop.", color: "error" });
        return;
      }
      if (!isLoggedIn.value) {
        if (needsMachineWarning.value) {
          toast.add({ title: "Machine not chosen", description: "Please select a printing machine to add to your quote.", color: "error" });
          return;
        }
        const guestStore = useGuestQuoteStore();
        guestStore.addItem(shopSlug, shopName, props.product.title, {
          product: props.product.id,
          quantity: Math.max(minQuantity.value, quantity.value),
          pricing_mode: pricingMode.value,
          sides: form.sides,
          color_mode: form.color_mode,
          paper: form.paper ?? void 0,
          material: form.material ?? void 0,
          machine: form.machine ?? void 0,
          finishings: form.finishings.length ? form.finishings : void 0,
          special_instructions: form.special_instructions.trim() || void 0
        });
        toast.add({
          title: "Added to quote",
          description: "Sign in when you submit to get your quote request.",
          color: "success"
        });
        addedItem.value = { id: "guest", product_name: props.product.title };
        emit("added", addedItem.value);
        handleOpenChange(false);
        return;
      }
      submitting.value = true;
      try {
        const draft = await getActiveDraft(shopSlug);
        if (needsMachineWarning.value) {
          toast.add({ title: "Machine not chosen", description: "Please select a printing machine to add to your quote.", color: "error" });
          return;
        }
        const payload = {
          item_type: "PRODUCT",
          product: props.product.id,
          quantity: Math.max(minQuantity.value, quantity.value),
          sides: form.sides,
          color_mode: form.color_mode,
          paper: form.paper ?? void 0,
          material: form.material ?? void 0,
          machine: form.machine ?? void 0,
          finishings: form.finishings.length ? form.finishings : void 0,
          special_instructions: form.special_instructions.trim() || void 0
        };
        const item = await tweakAndAdd(draft.id, payload);
        addedItem.value = item;
        toast.add({
          title: "Added to Quote",
          description: `${props.product.title} added to your draft.`,
          color: "success"
        });
        emit("added", item);
        handleOpenChange(false);
      } catch (err) {
        toast.add({
          title: "Could not add to quote",
          description: err instanceof Error ? err.message : "Please try again.",
          color: "error"
        });
      } finally {
        submitting.value = false;
      }
    }
    function goToDraft() {
      const shopSlug = props.product.shop?.slug;
      if (shopSlug) {
        navigateTo(`/quote-draft?shop=${shopSlug}`);
      }
      handleOpenChange(false);
    }
    const totalPrice = computed(() => {
      const b = priceResult.value?.breakdown;
      return b?.total ?? 0;
    });
    function close() {
      emit("update:open", false);
      emit("close");
      addedItem.value = null;
    }
    watch(
      () => props.open,
      async (open) => {
        if (!open) {
          priceResult.value = null;
          isDemoMode.value = false;
          productOptions.value = null;
          form.paper = null;
          form.material = null;
          form.machine = null;
          form.finishings = [];
          form.special_instructions = "";
          return;
        }
        await fetchOptions();
        quantity.value = minQuantity.value;
        await fetchPrice();
      },
      { immediate: true }
    );
    let debounceTimer = null;
    function debouncedFetchPrice() {
      if (!props.open) return;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
        void fetchPrice();
      }, DEBOUNCE_MS);
    }
    watch(quantity, debouncedFetchPrice);
    watch(() => [form.paper, form.material, form.machine, form.sides, form.color_mode, form.finishings], debouncedFetchPrice, { deep: true });
    watch(() => props.open, (open) => {
      if (open) (void 0).body.style.overflow = "hidden";
      else (void 0).body.style.overflow = "";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_UBadge = _sfc_main$2;
      const _component_UButton = _sfc_main$9;
      const _component_UInput = _sfc_main$3;
      const _component_UCheckbox = _sfc_main$4;
      const _component_UTextarea = _sfc_main$5;
      const _component_NuxtLink = __nuxt_component_3$1$1;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true"><div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden></div><div class="modal-panel relative w-full h-full sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-lg sm:rounded-2xl shadow-xl border border-[var(--p-border)] bg-[var(--p-surface)] overflow-hidden flex flex-col z-10"><div class="flex items-center justify-between p-4 sm:px-6 border-b border-[var(--p-border)] shrink-0"><div><h2 class="text-lg font-semibold text-[var(--p-text)]"> Tweak Quote — ${ssrInterpolate(__props.product.title)}</h2><p class="mt-0.5 text-sm text-[var(--p-text-muted)]"> Configure options and add to your draft. </p></div><button type="button" class="rounded-lg p-1.5 text-[var(--p-text-muted)] hover:text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors" aria-label="Close">`);
          _push2(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-x",
            class: "h-5 w-5"
          }, null, _parent));
          _push2(`</button></div><div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"><div class="flex items-center gap-4 rounded-xl bg-[var(--p-surface-sunken)] p-4">`);
          if (imageUrl.value) {
            _push2(`<div class="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[var(--p-border)]"><img${ssrRenderAttr("src", imageUrl.value)}${ssrRenderAttr("alt", __props.product.title)} class="w-full h-full object-cover"></div>`);
          } else {
            _push2(`<div class="w-16 h-16 rounded-lg bg-[var(--p-border)] flex items-center justify-center shrink-0">`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-package",
              class: "h-8 w-8 text-[var(--p-text-muted)]"
            }, null, _parent));
            _push2(`</div>`);
          }
          _push2(`<div class="min-w-0 flex-1"><p class="font-semibold text-[var(--p-text)] truncate">${ssrInterpolate(__props.product.title)}</p><p class="text-xs text-[var(--p-text-muted)]">${ssrInterpolate(__props.category.name)}</p><div class="flex flex-wrap gap-1.5 mt-1">`);
          if (__props.product.dimensions_label) {
            _push2(ssrRenderComponent(_component_UBadge, {
              variant: "soft",
              color: "neutral",
              size: "xs"
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.product.dimensions_label)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.product.dimensions_label), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          if (__props.product.weight_label) {
            _push2(ssrRenderComponent(_component_UBadge, {
              variant: "soft",
              color: "neutral",
              size: "xs"
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.product.weight_label)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.product.weight_label), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div><div><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Quantity</label><div class="flex items-center gap-2">`);
          _push2(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            color: "neutral",
            size: "sm",
            icon: "i-lucide-minus",
            onClick: ($event) => quantity.value = Math.max(minQuantity.value, quantity.value - 50)
          }, null, _parent));
          _push2(ssrRenderComponent(_component_UInput, {
            modelValue: quantity.value,
            "onUpdate:modelValue": ($event) => quantity.value = $event,
            modelModifiers: { number: true },
            type: "number",
            min: minQuantity.value,
            class: "w-24 text-center",
            onBlur: ($event) => quantity.value = Math.max(minQuantity.value, quantity.value || minQuantity.value)
          }, null, _parent));
          _push2(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            color: "neutral",
            size: "sm",
            icon: "i-lucide-plus",
            onClick: ($event) => quantity.value += 50
          }, null, _parent));
          _push2(`<span class="text-xs text-[var(--p-text-muted)]">min ${ssrInterpolate(minQuantity.value)}</span></div></div>`);
          if (pricingMode.value === "SHEET" && machines.value.length) {
            _push2(`<div class="space-y-1.5"><label class="block text-sm font-medium text-[var(--p-text-dim)]">Printing machine</label><div class="max-h-32 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2 space-y-1"><!--[-->`);
            ssrRenderList(machines.value, (m) => {
              _push2(`<label class="${ssrRenderClass([form.machine === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]", "flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(form.machine, m.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", m.id)} class="accent-flamingo-500"><span class="text-sm">${ssrInterpolate(m.name)}</span></label>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (pricingMode.value === "SHEET" && papers.value.length) {
            _push2(`<div class="space-y-1.5"><label class="block text-sm font-medium text-[var(--p-text-dim)]">Paper</label><div class="max-h-32 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2 space-y-1"><!--[-->`);
            ssrRenderList(papers.value, (p) => {
              _push2(`<label class="${ssrRenderClass([form.paper === p.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]", "flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(form.paper, p.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", p.id)} class="accent-flamingo-500"><span class="text-sm">${ssrInterpolate(p.sheet_size)} ${ssrInterpolate(p.gsm)}gsm ${ssrInterpolate(p.paper_type)}</span></label>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (pricingMode.value === "LARGE_FORMAT" && materials.value.length) {
            _push2(`<div class="space-y-1.5"><label class="block text-sm font-medium text-[var(--p-text-dim)]">Material</label><div class="max-h-32 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2 space-y-1"><!--[-->`);
            ssrRenderList(materials.value, (m) => {
              _push2(`<label class="${ssrRenderClass([form.material === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]", "flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(form.material, m.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", m.id)} class="accent-flamingo-500"><span class="text-sm">${ssrInterpolate(m.material_type ?? "Material")}</span></label>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (pricingMode.value === "SHEET") {
            _push2(`<div class="space-y-1.5"><label class="block text-sm font-medium text-[var(--p-text-dim)]">Sides</label><div class="grid grid-cols-2 gap-2"><button type="button" class="${ssrRenderClass([form.sides === "SIMPLEX" ? "border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700" : "border-[var(--p-border)] hover:border-[var(--p-border-dim)]", "rounded-lg border px-3 py-2 text-sm font-medium transition-all"])}"> Single-sided </button><button type="button" class="${ssrRenderClass([form.sides === "DUPLEX" ? "border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700" : "border-[var(--p-border)] hover:border-[var(--p-border-dim)]", "rounded-lg border px-3 py-2 text-sm font-medium transition-all"])}"> Double-sided </button></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (finishingRates.value.length) {
            _push2(`<div class="space-y-1.5"><label class="block text-sm font-medium text-[var(--p-text-dim)]">Finishing</label><div class="max-h-28 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2 space-y-1"><!--[-->`);
            ssrRenderList(finishingRates.value, (fr) => {
              _push2(`<label class="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors hover:bg-[var(--p-surface-sunken)]">`);
              _push2(ssrRenderComponent(_component_UCheckbox, {
                "model-value": form.finishings.some((f) => f.finishing_rate === fr.id),
                "onUpdate:modelValue": ($event) => toggleFinishing(fr.id, $event)
              }, null, _parent));
              _push2(`<span class="text-sm flex-1">${ssrInterpolate(fr.name)}</span></label>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (needsMachineWarning.value) {
            _push2(`<div class="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-300"><p class="font-medium flex items-center gap-2">`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-alert-triangle",
              class: "h-4 w-4 shrink-0"
            }, null, _parent));
            _push2(` Machine not chosen </p><p class="mt-1">Please select a printing machine above to add to your quote.</p></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Special instructions</label>`);
          _push2(ssrRenderComponent(_component_UTextarea, {
            modelValue: form.special_instructions,
            "onUpdate:modelValue": ($event) => form.special_instructions = $event,
            placeholder: "Any notes for the shop (optional)",
            rows: 2
          }, null, _parent));
          _push2(`</div><div class="rounded-xl border border-flamingo-200 dark:border-flamingo-800/50 bg-flamingo-50/50 dark:bg-flamingo-900/10 p-4 space-y-3"><div class="flex justify-between gap-2"><p class="text-xs font-semibold uppercase tracking-wider text-flamingo-600 dark:text-flamingo-400"> Quote Summary </p>`);
          if (isDemoMode.value) {
            _push2(ssrRenderComponent(_component_UBadge, {
              variant: "soft",
              color: "warning",
              size: "xs"
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`Demo mode`);
                } else {
                  return [
                    createTextVNode("Demo mode")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
          if (calculating.value) {
            _push2(`<div class="flex items-center gap-2 text-sm text-[var(--p-text-muted)]">`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-loader-2",
              class: "h-4 w-4 animate-spin"
            }, null, _parent));
            _push2(` Calculating... </div>`);
          } else if (priceResult.value) {
            _push2(`<!--[--><div class="flex justify-between items-baseline"><span class="font-semibold text-[var(--p-text)]">Suggested price</span><span class="text-xl font-bold text-flamingo-600 dark:text-flamingo-400">${ssrInterpolate(unref(formatKES)(totalPrice.value))}</span></div>`);
            if (isDemoMode.value) {
              _push2(`<p class="text-xs text-[var(--p-text-muted)] italic mt-2"> Demo pricing. Actual quote will be provided by the shop. </p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--]-->`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex gap-3 pt-2">`);
          _push2(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            color: "neutral",
            class: "flex-1",
            onClick: close
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(` Close `);
              } else {
                return [
                  createTextVNode(" Close ")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (__props.product.shop) {
            _push2(`<!--[-->`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              class: "flex-1",
              loading: submitting.value,
              disabled: needsMachineWarning.value,
              onClick: handleAddToQuote
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "h-4 w-4 mr-1"
                  }, null, _parent2, _scopeId));
                  _push3(` Add to Quote `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "h-4 w-4 mr-1"
                    }),
                    createTextVNode(" Add to Quote ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "outline",
              color: "primary",
              onClick: goToDraft
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-file-text",
                    class: "h-4 w-4 mr-1"
                  }, null, _parent2, _scopeId));
                  _push3(` ${ssrInterpolate(isLoggedIn.value ? "View Draft" : "View quote")}`);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-file-text",
                      class: "h-4 w-4 mr-1"
                    }),
                    createTextVNode(" " + toDisplayString(isLoggedIn.value ? "View Draft" : "View quote"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`<!--]-->`);
          } else {
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/shops",
              class: "flex-1",
              onClick: close
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "primary",
                    variant: "outline",
                    class: "w-full"
                  }, {
                    default: withCtx((_2, _push4, _parent3, _scopeId2) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UIcon, {
                          name: "i-lucide-store",
                          class: "h-4 w-4 mr-1"
                        }, null, _parent3, _scopeId2));
                        _push4(` Browse Shops `);
                      } else {
                        return [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-store",
                            class: "h-4 w-4 mr-1"
                          }),
                          createTextVNode(" Browse Shops ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_UButton, {
                      color: "primary",
                      variant: "outline",
                      class: "w-full"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-store",
                          class: "h-4 w-4 mr-1"
                        }),
                        createTextVNode(" Browse Shops ")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent));
          }
          _push2(`</div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GalleryTweakQuoteModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$1, { __name: "GalleryTweakQuoteModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "gallery",
  __ssrInlineRender: true,
  setup(__props) {
    const { getMediaUrl } = useApi();
    useToast();
    const categories = ref([]);
    const loading = ref(true);
    const fetchError = ref(null);
    const categoryFilter = ref("");
    const tweakModalOpen = ref(false);
    const tweakProduct = ref(null);
    const tweakCategory = ref(null);
    const allCategories = computed(
      () => categories.value.map((c) => c.category)
    );
    const filteredProducts = computed(() => {
      if (!categoryFilter.value) {
        return categories.value.flatMap(
          (c) => c.products.map((p) => ({ product: p, category: c.category }))
        );
      }
      const cat = categories.value.find(
        (c) => c.category.slug === categoryFilter.value || c.category.name === categoryFilter.value
      );
      if (!cat) return [];
      return cat.products.map((p) => ({ product: p, category: cat.category }));
    });
    function productImageUrl(product) {
      const path = product.preview_image;
      if (!path) return null;
      if (path.startsWith("http")) return path;
      return getMediaUrl(path);
    }
    function openTweak(product, category) {
      tweakProduct.value = product;
      tweakCategory.value = category;
      tweakModalOpen.value = true;
    }
    function onTweakClose() {
      tweakProduct.value = null;
      tweakCategory.value = null;
    }
    function onItemAdded() {
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_CommonEmptyState = __nuxt_component_3$1;
      const _component_NuxtImg = __nuxt_component_5;
      const _component_UIcon = _sfc_main$f;
      const _component_UBadge = _sfc_main$2;
      const _component_GalleryTweakQuoteModal = __nuxt_component_6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-8 sm:py-12" }, _attrs))}><div class="mb-8"><h1 class="text-3xl font-extrabold tracking-tight text-[var(--p-text)] sm:text-4xl"> Products Gallery </h1><p class="mt-2 text-lg text-[var(--p-text-muted)]"> Browse products by category. Click any product to customize and get a quote. </p></div>`);
      if (unref(allCategories).length) {
        _push(`<div class="flex flex-wrap gap-2 mb-6">`);
        _push(ssrRenderComponent(_component_UButton, {
          variant: !unref(categoryFilter) ? "solid" : "outline",
          color: !unref(categoryFilter) ? "primary" : "neutral",
          size: "sm",
          class: "rounded-full",
          onClick: ($event) => categoryFilter.value = ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` All `);
            } else {
              return [
                createTextVNode(" All ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--[-->`);
        ssrRenderList(unref(allCategories), (cat) => {
          _push(ssrRenderComponent(_component_UButton, {
            key: cat.slug,
            variant: unref(categoryFilter) === cat.slug ? "solid" : "outline",
            color: unref(categoryFilter) === cat.slug ? "primary" : "neutral",
            size: "sm",
            class: "rounded-full",
            onClick: ($event) => categoryFilter.value = cat.slug
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(cat.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(cat.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(fetchError) || !unref(filteredProducts).length) {
        _push(ssrRenderComponent(_component_CommonEmptyState, {
          title: unref(fetchError) ? "Could not load products" : "No products available yet",
          description: unref(fetchError) ? "Something went wrong. Please try again later." : "Check back later for new products.",
          icon: "i-lucide-package"
        }, null, _parent));
      } else {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(unref(filteredProducts), ({ product, category }) => {
          _push(`<article class="group rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] overflow-hidden hover:border-flamingo-200 dark:hover:border-flamingo-800/50 transition-all cursor-pointer"><div class="relative aspect-[4/3] bg-[var(--p-surface-sunken)] overflow-hidden">`);
          if (productImageUrl(product)) {
            _push(ssrRenderComponent(_component_NuxtImg, {
              src: productImageUrl(product),
              alt: product.title,
              class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            }, null, _parent));
          } else {
            _push(`<div class="absolute inset-0 flex items-center justify-center">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-package",
              class: "h-16 w-16 text-[var(--p-border)]"
            }, null, _parent));
            _push(`</div>`);
          }
          _push(`<div class="absolute top-3 left-3 flex flex-wrap gap-1.5">`);
          if (product.is_popular) {
            _push(ssrRenderComponent(_component_UBadge, {
              variant: "solid",
              color: "primary",
              size: "xs"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Popular `);
                } else {
                  return [
                    createTextVNode(" Popular ")
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          if (product.is_best_value) {
            _push(ssrRenderComponent(_component_UBadge, {
              variant: "solid",
              color: "success",
              size: "xs"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Best Value `);
                } else {
                  return [
                    createTextVNode(" Best Value ")
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          if (product.is_new) {
            _push(ssrRenderComponent(_component_UBadge, {
              variant: "soft",
              color: "primary",
              size: "xs"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` New `);
                } else {
                  return [
                    createTextVNode(" New ")
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (product.shop) {
            _push(`<div class="absolute top-3 right-3"><span class="inline-flex items-center gap-1.5 rounded-full bg-[var(--p-surface)]/90 backdrop-blur-sm border border-[var(--p-border)] px-3 py-1 text-xs font-medium text-[var(--p-text-dim)]">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-store",
              class: "h-3 w-3"
            }, null, _parent));
            _push(` ${ssrInterpolate(product.shop.name)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="p-5"><h3 class="font-bold text-[var(--p-text)] group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400 transition-colors">${ssrInterpolate(product.title)}</h3>`);
          if (category.name) {
            _push(`<p class="mt-0.5 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(category.name)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="mt-3 space-y-1.5">`);
          if (product.dimensions_label) {
            _push(`<div class="flex items-center gap-2 text-xs text-[var(--p-text-muted)]">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-ruler",
              class: "h-3.5 w-3.5 shrink-0"
            }, null, _parent));
            _push(`<span>${ssrInterpolate(product.dimensions_label)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (product.weight_label) {
            _push(`<div class="flex items-center gap-2 text-xs text-[var(--p-text-muted)]">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-scale",
              class: "h-3.5 w-3.5 shrink-0"
            }, null, _parent));
            _push(`<span>${ssrInterpolate(product.weight_label)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="mt-4 flex items-center justify-between gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            color: "primary",
            variant: "soft",
            size: "sm",
            onClick: ($event) => openTweak(product, category)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-sliders-horizontal",
                  class: "h-4 w-4 mr-1"
                }, null, _parent2, _scopeId));
                _push2(` Tweak Quote `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-sliders-horizontal",
                    class: "h-4 w-4 mr-1"
                  }),
                  createTextVNode(" Tweak Quote ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div></article>`);
        });
        _push(`<!--]--></div>`);
      }
      if (unref(tweakProduct) && unref(tweakCategory)) {
        _push(ssrRenderComponent(_component_GalleryTweakQuoteModal, {
          open: unref(tweakModalOpen),
          "onUpdate:open": ($event) => isRef(tweakModalOpen) ? tweakModalOpen.value = $event : null,
          product: unref(tweakProduct),
          category: unref(tweakCategory),
          onClose: onTweakClose,
          onAdded: onItemAdded
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/products/gallery.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=gallery-Brf_XRiw.mjs.map
