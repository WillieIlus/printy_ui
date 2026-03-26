import { j as useToast, d as _sfc_main$9, J as __nuxt_component_5, a as _sfc_main$f, l as usePublicApiNoAuth, _ as __nuxt_component_3$1$1, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_3$1 } from './EmptyState-CeDSO_D4.mjs';
import { _ as _sfc_main$2 } from './Badge-DRRvJchD.mjs';
import { _ as __nuxt_component_0, b as __nuxt_component_1, a as __nuxt_component_7 } from './QuoteConfigSection-2YjsyAVn.mjs';
import { _ as _sfc_main$3 } from './Input-C14QBOm-.mjs';
import { _ as _sfc_main$4 } from './Checkbox-S5HrhTVg.mjs';
import { _ as _sfc_main$5 } from './Textarea-C3ixaFu9.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, isRef, reactive, watch, openBlock, createBlock, createCommentVNode, Fragment, renderList, withDirectives, vModelRadio, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseEqual } from 'vue/server-renderer';
import { a as getGalleryProductOptions, c as calculateGalleryProductPrice } from './gallery-BkPMGgTl.mjs';
import { getActiveDraft, tweakAndAdd } from './quoteDraft-JSimLcx7.mjs';
import { defineStore } from 'pinia';
import { a as formatKES } from './formatters-r_qbKRfS.mjs';
import { u as useApi } from './useApi-4DUqRt-r.mjs';
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
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

function loadFromStorage() {
  return null;
}
function saveToStorage(quote) {
  return;
}
function generateId() {
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
const useGuestQuoteStore = defineStore("guestQuote", () => {
  const quote = ref(loadFromStorage());
  watch(quote, (q) => saveToStorage(), { deep: true });
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
    const api = useApi();
    const publicApiNoAuth = usePublicApiNoAuth();
    const toast = useToast();
    const authStore = useAuthStore();
    const guestStore = useGuestQuoteStore();
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
        productOptions.value = await getGalleryProductOptions(props.product.id, publicApiNoAuth);
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
        }, api);
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
        setOpen(false);
        return;
      }
      submitting.value = true;
      try {
        const draft = await getActiveDraft(shopSlug, void 0, api);
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
        const item = await tweakAndAdd(draft.id, payload, api);
        addedItem.value = item;
        toast.add({
          title: "Added to quote",
          description: `${props.product.title} added to your draft.`,
          color: "success"
        });
        emit("added", item);
        setOpen(false);
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
      setOpen(false);
    }
    const totalPrice = computed(() => {
      const b = priceResult.value?.breakdown;
      return b?.total ?? 0;
    });
    function close() {
      setOpen(false);
      emit("close");
      addedItem.value = null;
    }
    function setOpen(value) {
      emit("update:open", value);
      if (!value) {
        emit("close");
        addedItem.value = null;
      }
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
    return (_ctx, _push, _parent, _attrs) => {
      const _component_QuotesQuoteConfigModal = __nuxt_component_0;
      const _component_QuotesQuoteConfigSection = __nuxt_component_1;
      const _component_UIcon = _sfc_main$f;
      const _component_UBadge = _sfc_main$2;
      const _component_UButton = _sfc_main$9;
      const _component_UInput = _sfc_main$3;
      const _component_UCheckbox = _sfc_main$4;
      const _component_QuotesQuoteConfigNotice = __nuxt_component_7;
      const _component_UTextarea = _sfc_main$5;
      const _component_NuxtLink = __nuxt_component_3$1$1;
      _push(ssrRenderComponent(_component_QuotesQuoteConfigModal, mergeProps({
        open: __props.open,
        eyebrow: "Product Gallery",
        title: `Configure ${__props.product.title}`,
        description: "Use the same quote configuration flow before adding this product to a draft.",
        size: "lg",
        "onUpdate:open": setOpen
      }, _attrs), {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"${_scopeId}><div class="flex flex-col-reverse gap-3 sm:flex-row"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              color: "neutral",
              class: "sm:min-w-32",
              onClick: close
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (__props.product.shop) {
              _push2(ssrRenderComponent(_component_UButton, {
                color: "primary",
                class: "sm:min-w-40",
                loading: submitting.value,
                disabled: needsMachineWarning.value,
                onClick: handleAddToQuote
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "mr-1 h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(` Add to Quote `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-plus",
                        class: "mr-1 h-4 w-4"
                      }),
                      createTextVNode(" Add to Quote ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col gap-3 sm:flex-row"${_scopeId}>`);
            if (__props.product.shop) {
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "outline",
                color: "primary",
                onClick: goToDraft
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-file-text",
                      class: "mr-1 h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(` ${ssrInterpolate(isLoggedIn.value ? "View Draft" : "View Quote")}`);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-file-text",
                        class: "mr-1 h-4 w-4"
                      }),
                      createTextVNode(" " + toDisplayString(isLoggedIn.value ? "View Draft" : "View Quote"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: "/shops",
                class: "block",
                onClick: close
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UButton, {
                      color: "primary",
                      variant: "outline",
                      class: "w-full"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UIcon, {
                            name: "i-lucide-store",
                            class: "mr-1 h-4 w-4"
                          }, null, _parent4, _scopeId3));
                          _push4(` Browse Shops `);
                        } else {
                          return [
                            createVNode(_component_UIcon, {
                              name: "i-lucide-store",
                              class: "mr-1 h-4 w-4"
                            }),
                            createTextVNode(" Browse Shops ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
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
                            class: "mr-1 h-4 w-4"
                          }),
                          createTextVNode(" Browse Shops ")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col-reverse gap-3 sm:flex-row sm:justify-between" }, [
                createVNode("div", { class: "flex flex-col-reverse gap-3 sm:flex-row" }, [
                  createVNode(_component_UButton, {
                    variant: "soft",
                    color: "neutral",
                    class: "sm:min-w-32",
                    onClick: close
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Cancel ")
                    ]),
                    _: 1
                  }),
                  __props.product.shop ? (openBlock(), createBlock(_component_UButton, {
                    key: 0,
                    color: "primary",
                    class: "sm:min-w-40",
                    loading: submitting.value,
                    disabled: needsMachineWarning.value,
                    onClick: handleAddToQuote
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-plus",
                        class: "mr-1 h-4 w-4"
                      }),
                      createTextVNode(" Add to Quote ")
                    ]),
                    _: 1
                  }, 8, ["loading", "disabled"])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "flex flex-col gap-3 sm:flex-row" }, [
                  __props.product.shop ? (openBlock(), createBlock(_component_UButton, {
                    key: 0,
                    variant: "outline",
                    color: "primary",
                    onClick: goToDraft
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-file-text",
                        class: "mr-1 h-4 w-4"
                      }),
                      createTextVNode(" " + toDisplayString(isLoggedIn.value ? "View Draft" : "View Quote"), 1)
                    ]),
                    _: 1
                  })) : (openBlock(), createBlock(_component_NuxtLink, {
                    key: 1,
                    to: "/shops",
                    class: "block",
                    onClick: close
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UButton, {
                        color: "primary",
                        variant: "outline",
                        class: "w-full"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-store",
                            class: "mr-1 h-4 w-4"
                          }),
                          createTextVNode(" Browse Shops ")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }))
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4 sm:space-y-5"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_QuotesQuoteConfigSection, {
              title: "Product",
              description: "Gallery product details before configuration."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-4 rounded-xl bg-[var(--p-surface)] p-4"${_scopeId2}>`);
                  if (imageUrl.value) {
                    _push3(`<div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--p-border)]"${_scopeId2}><img${ssrRenderAttr("src", imageUrl.value)}${ssrRenderAttr("alt", __props.product.title)} class="h-full w-full object-cover"${_scopeId2}></div>`);
                  } else {
                    _push3(`<div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--p-border)]"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-package",
                      class: "h-8 w-8 text-[var(--p-text-muted)]"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  }
                  _push3(`<div class="min-w-0 flex-1"${_scopeId2}><p class="truncate text-base font-semibold text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(__props.product.title)}</p><p class="mt-1 text-xs text-[var(--p-text-muted)]"${_scopeId2}>${ssrInterpolate(__props.category.name)}</p><div class="mt-2 flex flex-wrap gap-1.5"${_scopeId2}>`);
                  if (__props.product.dimensions_label) {
                    _push3(ssrRenderComponent(_component_UBadge, {
                      variant: "soft",
                      color: "neutral",
                      size: "xs"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(__props.product.dimensions_label)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(__props.product.dimensions_label), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (__props.product.weight_label) {
                    _push3(ssrRenderComponent(_component_UBadge, {
                      variant: "soft",
                      color: "neutral",
                      size: "xs"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(__props.product.weight_label)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(__props.product.weight_label), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-4 rounded-xl bg-[var(--p-surface)] p-4" }, [
                      imageUrl.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--p-border)]"
                      }, [
                        createVNode("img", {
                          src: imageUrl.value,
                          alt: __props.product.title,
                          class: "h-full w-full object-cover"
                        }, null, 8, ["src", "alt"])
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--p-border)]"
                      }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-package",
                          class: "h-8 w-8 text-[var(--p-text-muted)]"
                        })
                      ])),
                      createVNode("div", { class: "min-w-0 flex-1" }, [
                        createVNode("p", { class: "truncate text-base font-semibold text-[var(--p-text)]" }, toDisplayString(__props.product.title), 1),
                        createVNode("p", { class: "mt-1 text-xs text-[var(--p-text-muted)]" }, toDisplayString(__props.category.name), 1),
                        createVNode("div", { class: "mt-2 flex flex-wrap gap-1.5" }, [
                          __props.product.dimensions_label ? (openBlock(), createBlock(_component_UBadge, {
                            key: 0,
                            variant: "soft",
                            color: "neutral",
                            size: "xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.product.dimensions_label), 1)
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          __props.product.weight_label ? (openBlock(), createBlock(_component_UBadge, {
                            key: 1,
                            variant: "soft",
                            color: "neutral",
                            size: "xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.product.weight_label), 1)
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (optionsLoading.value) {
              _push2(ssrRenderComponent(_component_QuotesQuoteConfigSection, {
                title: "Loading",
                description: "Preparing available options for this product."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex flex-col items-center justify-center py-12 text-[var(--p-text-muted)]"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-loader-2",
                      class: "mb-3 h-8 w-8 animate-spin"
                    }, null, _parent3, _scopeId2));
                    _push3(`<p class="text-sm"${_scopeId2}>Loading options…</p></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex flex-col items-center justify-center py-12 text-[var(--p-text-muted)]" }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-loader-2",
                          class: "mb-3 h-8 w-8 animate-spin"
                        }),
                        createVNode("p", { class: "text-sm" }, "Loading options…")
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<form class="space-y-4 sm:space-y-5"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_QuotesQuoteConfigSection, {
                title: "Specifications",
                description: "Use the same configuration controls available from shop and draft flows."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="space-y-5"${_scopeId2}><div${_scopeId2}><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]"${_scopeId2}>Quantity</label><div class="flex items-center gap-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UButton, {
                      variant: "soft",
                      color: "neutral",
                      size: "sm",
                      icon: "i-lucide-minus",
                      onClick: ($event) => quantity.value = Math.max(minQuantity.value, quantity.value - 50)
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: quantity.value,
                      "onUpdate:modelValue": ($event) => quantity.value = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: minQuantity.value,
                      class: "w-24 text-center",
                      onBlur: ($event) => quantity.value = Math.max(minQuantity.value, quantity.value || minQuantity.value)
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_UButton, {
                      variant: "soft",
                      color: "neutral",
                      size: "sm",
                      icon: "i-lucide-plus",
                      onClick: ($event) => quantity.value += 50
                    }, null, _parent3, _scopeId2));
                    _push3(`<span class="text-xs text-[var(--p-text-muted)]"${_scopeId2}>min ${ssrInterpolate(minQuantity.value)}</span></div></div>`);
                    if (pricingMode.value === "SHEET") {
                      _push3(`<div class="grid gap-5 lg:grid-cols-2"${_scopeId2}><div${_scopeId2}><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]"${_scopeId2}>Sides</label><div class="grid grid-cols-2 gap-2"${_scopeId2}><button type="button" class="${ssrRenderClass([form.sides === "SIMPLEX" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20" : "border-[var(--p-border)] text-[var(--p-text-dim)]", "rounded-lg border px-3 py-2 text-sm font-medium transition-all"])}"${_scopeId2}> Single-sided </button><button type="button" class="${ssrRenderClass([form.sides === "DUPLEX" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20" : "border-[var(--p-border)] text-[var(--p-text-dim)]", "rounded-lg border px-3 py-2 text-sm font-medium transition-all"])}"${_scopeId2}> Double-sided </button></div></div></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (pricingMode.value === "SHEET" && machines.value.length) {
                      _push3(`<div${_scopeId2}><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]"${_scopeId2}>Printing machine</label><div class="space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2"${_scopeId2}><!--[-->`);
                      ssrRenderList(machines.value, (m) => {
                        _push3(`<label class="${ssrRenderClass([form.machine === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]", "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"])}"${_scopeId2}><input${ssrIncludeBooleanAttr(ssrLooseEqual(form.machine, m.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", m.id)} class="accent-flamingo-500"${_scopeId2}><span class="text-sm text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(m.name)}</span></label>`);
                      });
                      _push3(`<!--]--></div></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (pricingMode.value === "SHEET" && papers.value.length) {
                      _push3(`<div${_scopeId2}><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]"${_scopeId2}>Paper</label><div class="space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2"${_scopeId2}><!--[-->`);
                      ssrRenderList(papers.value, (p) => {
                        _push3(`<label class="${ssrRenderClass([form.paper === p.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]", "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"])}"${_scopeId2}><input${ssrIncludeBooleanAttr(ssrLooseEqual(form.paper, p.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", p.id)} class="accent-flamingo-500"${_scopeId2}><span class="text-sm text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(p.sheet_size)} ${ssrInterpolate(p.gsm)}gsm ${ssrInterpolate(p.paper_type)}</span></label>`);
                      });
                      _push3(`<!--]--></div></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (pricingMode.value === "LARGE_FORMAT" && materials.value.length) {
                      _push3(`<div${_scopeId2}><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]"${_scopeId2}>Material</label><div class="space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2"${_scopeId2}><!--[-->`);
                      ssrRenderList(materials.value, (m) => {
                        _push3(`<label class="${ssrRenderClass([form.material === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]", "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"])}"${_scopeId2}><input${ssrIncludeBooleanAttr(ssrLooseEqual(form.material, m.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", m.id)} class="accent-flamingo-500"${_scopeId2}><span class="text-sm text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(m.material_type ?? "Material")}</span></label>`);
                      });
                      _push3(`<!--]--></div></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "space-y-5" }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Quantity"),
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode(_component_UButton, {
                              variant: "soft",
                              color: "neutral",
                              size: "sm",
                              icon: "i-lucide-minus",
                              onClick: ($event) => quantity.value = Math.max(minQuantity.value, quantity.value - 50)
                            }, null, 8, ["onClick"]),
                            createVNode(_component_UInput, {
                              modelValue: quantity.value,
                              "onUpdate:modelValue": ($event) => quantity.value = $event,
                              modelModifiers: { number: true },
                              type: "number",
                              min: minQuantity.value,
                              class: "w-24 text-center",
                              onBlur: ($event) => quantity.value = Math.max(minQuantity.value, quantity.value || minQuantity.value)
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "min", "onBlur"]),
                            createVNode(_component_UButton, {
                              variant: "soft",
                              color: "neutral",
                              size: "sm",
                              icon: "i-lucide-plus",
                              onClick: ($event) => quantity.value += 50
                            }, null, 8, ["onClick"]),
                            createVNode("span", { class: "text-xs text-[var(--p-text-muted)]" }, "min " + toDisplayString(minQuantity.value), 1)
                          ])
                        ]),
                        pricingMode.value === "SHEET" ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "grid gap-5 lg:grid-cols-2"
                        }, [
                          createVNode("div", null, [
                            createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Sides"),
                            createVNode("div", { class: "grid grid-cols-2 gap-2" }, [
                              createVNode("button", {
                                type: "button",
                                class: ["rounded-lg border px-3 py-2 text-sm font-medium transition-all", form.sides === "SIMPLEX" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20" : "border-[var(--p-border)] text-[var(--p-text-dim)]"],
                                onClick: ($event) => form.sides = "SIMPLEX"
                              }, " Single-sided ", 10, ["onClick"]),
                              createVNode("button", {
                                type: "button",
                                class: ["rounded-lg border px-3 py-2 text-sm font-medium transition-all", form.sides === "DUPLEX" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20" : "border-[var(--p-border)] text-[var(--p-text-dim)]"],
                                onClick: ($event) => form.sides = "DUPLEX"
                              }, " Double-sided ", 10, ["onClick"])
                            ])
                          ])
                        ])) : createCommentVNode("", true),
                        pricingMode.value === "SHEET" && machines.value.length ? (openBlock(), createBlock("div", { key: 1 }, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Printing machine"),
                          createVNode("div", { class: "space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(machines.value, (m) => {
                              return openBlock(), createBlock("label", {
                                key: m.id,
                                class: ["flex items-center gap-3 rounded-lg px-3 py-2 transition-colors", form.machine === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]"]
                              }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => form.machine = $event,
                                  type: "radio",
                                  value: m.id,
                                  class: "accent-flamingo-500"
                                }, null, 8, ["onUpdate:modelValue", "value"]), [
                                  [vModelRadio, form.machine]
                                ]),
                                createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(m.name), 1)
                              ], 2);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true),
                        pricingMode.value === "SHEET" && papers.value.length ? (openBlock(), createBlock("div", { key: 2 }, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Paper"),
                          createVNode("div", { class: "space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(papers.value, (p) => {
                              return openBlock(), createBlock("label", {
                                key: p.id,
                                class: ["flex items-center gap-3 rounded-lg px-3 py-2 transition-colors", form.paper === p.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]"]
                              }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => form.paper = $event,
                                  type: "radio",
                                  value: p.id,
                                  class: "accent-flamingo-500"
                                }, null, 8, ["onUpdate:modelValue", "value"]), [
                                  [vModelRadio, form.paper]
                                ]),
                                createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(p.sheet_size) + " " + toDisplayString(p.gsm) + "gsm " + toDisplayString(p.paper_type), 1)
                              ], 2);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true),
                        pricingMode.value === "LARGE_FORMAT" && materials.value.length ? (openBlock(), createBlock("div", { key: 3 }, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Material"),
                          createVNode("div", { class: "space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(materials.value, (m) => {
                              return openBlock(), createBlock("label", {
                                key: m.id,
                                class: ["flex items-center gap-3 rounded-lg px-3 py-2 transition-colors", form.material === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]"]
                              }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => form.material = $event,
                                  type: "radio",
                                  value: m.id,
                                  class: "accent-flamingo-500"
                                }, null, 8, ["onUpdate:modelValue", "value"]), [
                                  [vModelRadio, form.material]
                                ]),
                                createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(m.material_type ?? "Material"), 1)
                              ], 2);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (finishingRates.value.length) {
                _push2(ssrRenderComponent(_component_QuotesQuoteConfigSection, {
                  title: "Finishing",
                  description: "Optional finishing for this product."
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="space-y-2"${_scopeId2}><!--[-->`);
                      ssrRenderList(finishingRates.value, (fr) => {
                        _push3(`<label class="flex items-center gap-3 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-3"${_scopeId2}>`);
                        _push3(ssrRenderComponent(_component_UCheckbox, {
                          "model-value": form.finishings.some((f) => f.finishing_rate === fr.id),
                          "onUpdate:modelValue": ($event) => toggleFinishing(fr.id, $event)
                        }, null, _parent3, _scopeId2));
                        _push3(`<span class="flex-1 text-sm text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(fr.name)}</span></label>`);
                      });
                      _push3(`<!--]--></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "space-y-2" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(finishingRates.value, (fr) => {
                            return openBlock(), createBlock("label", {
                              key: fr.id,
                              class: "flex items-center gap-3 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-3"
                            }, [
                              createVNode(_component_UCheckbox, {
                                "model-value": form.finishings.some((f) => f.finishing_rate === fr.id),
                                "onUpdate:modelValue": ($event) => toggleFinishing(fr.id, $event)
                              }, null, 8, ["model-value", "onUpdate:modelValue"]),
                              createVNode("span", { class: "flex-1 text-sm text-[var(--p-text)]" }, toDisplayString(fr.name), 1)
                            ]);
                          }), 128))
                        ])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (needsMachineWarning.value) {
                _push2(ssrRenderComponent(_component_QuotesQuoteConfigNotice, {
                  tone: "error",
                  title: "Machine not chosen",
                  message: "Please select a printing machine before adding this product to your quote."
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(_component_QuotesQuoteConfigSection, {
                title: "Notes",
                description: "Optional notes to send with this quote request."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UTextarea, {
                      modelValue: form.special_instructions,
                      "onUpdate:modelValue": ($event) => form.special_instructions = $event,
                      placeholder: "Any notes for the shop (optional)",
                      rows: 3
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UTextarea, {
                        modelValue: form.special_instructions,
                        "onUpdate:modelValue": ($event) => form.special_instructions = $event,
                        placeholder: "Any notes for the shop (optional)",
                        rows: 3
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_QuotesQuoteConfigSection, {
                title: "Pricing",
                description: "Live preview for the same quote configuration."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="space-y-3"${_scopeId2}>`);
                    if (calculating.value) {
                      _push3(`<div class="flex items-center gap-2 text-sm text-[var(--p-text-muted)]"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_UIcon, {
                        name: "i-lucide-loader-2",
                        class: "h-4 w-4 animate-spin"
                      }, null, _parent3, _scopeId2));
                      _push3(` Calculating... </div>`);
                    } else if (priceResult.value) {
                      _push3(`<div class="rounded-xl border border-flamingo-200/70 bg-flamingo-50/70 p-4 dark:border-flamingo-800/40 dark:bg-flamingo-900/10"${_scopeId2}><div class="flex items-baseline justify-between gap-4"${_scopeId2}><span class="font-semibold text-[var(--p-text)]"${_scopeId2}>Estimated total</span><span class="text-xl font-bold text-flamingo-600 dark:text-flamingo-400"${_scopeId2}>${ssrInterpolate(unref(formatKES)(totalPrice.value))}</span></div>`);
                      if (isDemoMode.value) {
                        _push3(`<p class="mt-2 text-xs italic text-[var(--p-text-muted)]"${_scopeId2}> Demo pricing fallback. Final price will come from the shop. </p>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div>`);
                    } else {
                      _push3(`<p class="text-sm text-[var(--p-text-muted)]"${_scopeId2}>Complete the configuration to preview the estimated total.</p>`);
                    }
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "space-y-3" }, [
                        calculating.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex items-center gap-2 text-sm text-[var(--p-text-muted)]"
                        }, [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-loader-2",
                            class: "h-4 w-4 animate-spin"
                          }),
                          createTextVNode(" Calculating... ")
                        ])) : priceResult.value ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "rounded-xl border border-flamingo-200/70 bg-flamingo-50/70 p-4 dark:border-flamingo-800/40 dark:bg-flamingo-900/10"
                        }, [
                          createVNode("div", { class: "flex items-baseline justify-between gap-4" }, [
                            createVNode("span", { class: "font-semibold text-[var(--p-text)]" }, "Estimated total"),
                            createVNode("span", { class: "text-xl font-bold text-flamingo-600 dark:text-flamingo-400" }, toDisplayString(unref(formatKES)(totalPrice.value)), 1)
                          ]),
                          isDemoMode.value ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "mt-2 text-xs italic text-[var(--p-text-muted)]"
                          }, " Demo pricing fallback. Final price will come from the shop. ")) : createCommentVNode("", true)
                        ])) : (openBlock(), createBlock("p", {
                          key: 2,
                          class: "text-sm text-[var(--p-text-muted)]"
                        }, "Complete the configuration to preview the estimated total."))
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</form>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 sm:space-y-5" }, [
                createVNode(_component_QuotesQuoteConfigSection, {
                  title: "Product",
                  description: "Gallery product details before configuration."
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex items-center gap-4 rounded-xl bg-[var(--p-surface)] p-4" }, [
                      imageUrl.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--p-border)]"
                      }, [
                        createVNode("img", {
                          src: imageUrl.value,
                          alt: __props.product.title,
                          class: "h-full w-full object-cover"
                        }, null, 8, ["src", "alt"])
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--p-border)]"
                      }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-package",
                          class: "h-8 w-8 text-[var(--p-text-muted)]"
                        })
                      ])),
                      createVNode("div", { class: "min-w-0 flex-1" }, [
                        createVNode("p", { class: "truncate text-base font-semibold text-[var(--p-text)]" }, toDisplayString(__props.product.title), 1),
                        createVNode("p", { class: "mt-1 text-xs text-[var(--p-text-muted)]" }, toDisplayString(__props.category.name), 1),
                        createVNode("div", { class: "mt-2 flex flex-wrap gap-1.5" }, [
                          __props.product.dimensions_label ? (openBlock(), createBlock(_component_UBadge, {
                            key: 0,
                            variant: "soft",
                            color: "neutral",
                            size: "xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.product.dimensions_label), 1)
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          __props.product.weight_label ? (openBlock(), createBlock(_component_UBadge, {
                            key: 1,
                            variant: "soft",
                            color: "neutral",
                            size: "xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.product.weight_label), 1)
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ]),
                  _: 1
                }),
                optionsLoading.value ? (openBlock(), createBlock(_component_QuotesQuoteConfigSection, {
                  key: 0,
                  title: "Loading",
                  description: "Preparing available options for this product."
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex flex-col items-center justify-center py-12 text-[var(--p-text-muted)]" }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-loader-2",
                        class: "mb-3 h-8 w-8 animate-spin"
                      }),
                      createVNode("p", { class: "text-sm" }, "Loading options…")
                    ])
                  ]),
                  _: 1
                })) : (openBlock(), createBlock("form", {
                  key: 1,
                  class: "space-y-4 sm:space-y-5",
                  onSubmit: withModifiers(handleAddToQuote, ["prevent"])
                }, [
                  createVNode(_component_QuotesQuoteConfigSection, {
                    title: "Specifications",
                    description: "Use the same configuration controls available from shop and draft flows."
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "space-y-5" }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Quantity"),
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode(_component_UButton, {
                              variant: "soft",
                              color: "neutral",
                              size: "sm",
                              icon: "i-lucide-minus",
                              onClick: ($event) => quantity.value = Math.max(minQuantity.value, quantity.value - 50)
                            }, null, 8, ["onClick"]),
                            createVNode(_component_UInput, {
                              modelValue: quantity.value,
                              "onUpdate:modelValue": ($event) => quantity.value = $event,
                              modelModifiers: { number: true },
                              type: "number",
                              min: minQuantity.value,
                              class: "w-24 text-center",
                              onBlur: ($event) => quantity.value = Math.max(minQuantity.value, quantity.value || minQuantity.value)
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "min", "onBlur"]),
                            createVNode(_component_UButton, {
                              variant: "soft",
                              color: "neutral",
                              size: "sm",
                              icon: "i-lucide-plus",
                              onClick: ($event) => quantity.value += 50
                            }, null, 8, ["onClick"]),
                            createVNode("span", { class: "text-xs text-[var(--p-text-muted)]" }, "min " + toDisplayString(minQuantity.value), 1)
                          ])
                        ]),
                        pricingMode.value === "SHEET" ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "grid gap-5 lg:grid-cols-2"
                        }, [
                          createVNode("div", null, [
                            createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Sides"),
                            createVNode("div", { class: "grid grid-cols-2 gap-2" }, [
                              createVNode("button", {
                                type: "button",
                                class: ["rounded-lg border px-3 py-2 text-sm font-medium transition-all", form.sides === "SIMPLEX" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20" : "border-[var(--p-border)] text-[var(--p-text-dim)]"],
                                onClick: ($event) => form.sides = "SIMPLEX"
                              }, " Single-sided ", 10, ["onClick"]),
                              createVNode("button", {
                                type: "button",
                                class: ["rounded-lg border px-3 py-2 text-sm font-medium transition-all", form.sides === "DUPLEX" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20" : "border-[var(--p-border)] text-[var(--p-text-dim)]"],
                                onClick: ($event) => form.sides = "DUPLEX"
                              }, " Double-sided ", 10, ["onClick"])
                            ])
                          ])
                        ])) : createCommentVNode("", true),
                        pricingMode.value === "SHEET" && machines.value.length ? (openBlock(), createBlock("div", { key: 1 }, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Printing machine"),
                          createVNode("div", { class: "space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(machines.value, (m) => {
                              return openBlock(), createBlock("label", {
                                key: m.id,
                                class: ["flex items-center gap-3 rounded-lg px-3 py-2 transition-colors", form.machine === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]"]
                              }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => form.machine = $event,
                                  type: "radio",
                                  value: m.id,
                                  class: "accent-flamingo-500"
                                }, null, 8, ["onUpdate:modelValue", "value"]), [
                                  [vModelRadio, form.machine]
                                ]),
                                createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(m.name), 1)
                              ], 2);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true),
                        pricingMode.value === "SHEET" && papers.value.length ? (openBlock(), createBlock("div", { key: 2 }, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Paper"),
                          createVNode("div", { class: "space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(papers.value, (p) => {
                              return openBlock(), createBlock("label", {
                                key: p.id,
                                class: ["flex items-center gap-3 rounded-lg px-3 py-2 transition-colors", form.paper === p.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]"]
                              }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => form.paper = $event,
                                  type: "radio",
                                  value: p.id,
                                  class: "accent-flamingo-500"
                                }, null, 8, ["onUpdate:modelValue", "value"]), [
                                  [vModelRadio, form.paper]
                                ]),
                                createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(p.sheet_size) + " " + toDisplayString(p.gsm) + "gsm " + toDisplayString(p.paper_type), 1)
                              ], 2);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true),
                        pricingMode.value === "LARGE_FORMAT" && materials.value.length ? (openBlock(), createBlock("div", { key: 3 }, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Material"),
                          createVNode("div", { class: "space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(materials.value, (m) => {
                              return openBlock(), createBlock("label", {
                                key: m.id,
                                class: ["flex items-center gap-3 rounded-lg px-3 py-2 transition-colors", form.material === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]"]
                              }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => form.material = $event,
                                  type: "radio",
                                  value: m.id,
                                  class: "accent-flamingo-500"
                                }, null, 8, ["onUpdate:modelValue", "value"]), [
                                  [vModelRadio, form.material]
                                ]),
                                createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(m.material_type ?? "Material"), 1)
                              ], 2);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true)
                      ])
                    ]),
                    _: 1
                  }),
                  finishingRates.value.length ? (openBlock(), createBlock(_component_QuotesQuoteConfigSection, {
                    key: 0,
                    title: "Finishing",
                    description: "Optional finishing for this product."
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "space-y-2" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(finishingRates.value, (fr) => {
                          return openBlock(), createBlock("label", {
                            key: fr.id,
                            class: "flex items-center gap-3 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-3"
                          }, [
                            createVNode(_component_UCheckbox, {
                              "model-value": form.finishings.some((f) => f.finishing_rate === fr.id),
                              "onUpdate:modelValue": ($event) => toggleFinishing(fr.id, $event)
                            }, null, 8, ["model-value", "onUpdate:modelValue"]),
                            createVNode("span", { class: "flex-1 text-sm text-[var(--p-text)]" }, toDisplayString(fr.name), 1)
                          ]);
                        }), 128))
                      ])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  needsMachineWarning.value ? (openBlock(), createBlock(_component_QuotesQuoteConfigNotice, {
                    key: 1,
                    tone: "error",
                    title: "Machine not chosen",
                    message: "Please select a printing machine before adding this product to your quote."
                  })) : createCommentVNode("", true),
                  createVNode(_component_QuotesQuoteConfigSection, {
                    title: "Notes",
                    description: "Optional notes to send with this quote request."
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UTextarea, {
                        modelValue: form.special_instructions,
                        "onUpdate:modelValue": ($event) => form.special_instructions = $event,
                        placeholder: "Any notes for the shop (optional)",
                        rows: 3
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_QuotesQuoteConfigSection, {
                    title: "Pricing",
                    description: "Live preview for the same quote configuration."
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "space-y-3" }, [
                        calculating.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex items-center gap-2 text-sm text-[var(--p-text-muted)]"
                        }, [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-loader-2",
                            class: "h-4 w-4 animate-spin"
                          }),
                          createTextVNode(" Calculating... ")
                        ])) : priceResult.value ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "rounded-xl border border-flamingo-200/70 bg-flamingo-50/70 p-4 dark:border-flamingo-800/40 dark:bg-flamingo-900/10"
                        }, [
                          createVNode("div", { class: "flex items-baseline justify-between gap-4" }, [
                            createVNode("span", { class: "font-semibold text-[var(--p-text)]" }, "Estimated total"),
                            createVNode("span", { class: "text-xl font-bold text-flamingo-600 dark:text-flamingo-400" }, toDisplayString(unref(formatKES)(totalPrice.value)), 1)
                          ]),
                          isDemoMode.value ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "mt-2 text-xs italic text-[var(--p-text-muted)]"
                          }, " Demo pricing fallback. Final price will come from the shop. ")) : createCommentVNode("", true)
                        ])) : (openBlock(), createBlock("p", {
                          key: 2,
                          class: "text-sm text-[var(--p-text-muted)]"
                        }, "Complete the configuration to preview the estimated total."))
                      ])
                    ]),
                    _: 1
                  })
                ], 32))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
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
//# sourceMappingURL=gallery-CkQ79Bgv.mjs.map
