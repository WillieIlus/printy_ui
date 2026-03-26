import { useSlots, toRef, computed, unref, mergeProps, withCtx, renderSlot, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, createVNode, createTextVNode, defineComponent, reactive, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderTeleport } from 'vue/server-renderer';
import { a0 as defu } from '../_/nitro.mjs';
import { useForwardPropsEmits, TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, TooltipArrow, Primitive } from 'reka-ui';
import { reactivePick, createSharedComposable } from '@vueuse/core';
import { p as useAppConfig, q as usePortal, w as tv, d as _sfc_main$9, J as __nuxt_component_5, a as _sfc_main$f } from './server.mjs';
import { _ as _sfc_main$3 } from './Badge-DRRvJchD.mjs';
import { u as useProductPriceDisplay } from './ProductTweakModal-DTcQxKaX.mjs';

const kbdKeysMap = {
  meta: "",
  ctrl: "",
  alt: "",
  win: "⊞",
  command: "⌘",
  shift: "⇧",
  control: "⌃",
  option: "⌥",
  enter: "↵",
  delete: "⌦",
  backspace: "⌫",
  escape: "Esc",
  tab: "⇥",
  capslock: "⇪",
  arrowup: "↑",
  arrowright: "→",
  arrowdown: "↓",
  arrowleft: "←",
  pageup: "⇞",
  pagedown: "⇟",
  home: "↖",
  end: "↘"
};
const _useKbd = () => {
  const macOS = computed(() => false);
  const kbdKeysSpecificMap = reactive({
    meta: " ",
    alt: " ",
    ctrl: " "
  });
  function getKbdKey(value) {
    if (!value) {
      return;
    }
    if (["meta", "alt", "ctrl"].includes(value)) {
      return kbdKeysSpecificMap[value];
    }
    return kbdKeysMap[value] || value;
  }
  return {
    macOS,
    getKbdKey
  };
};
const useKbd = /* @__PURE__ */ createSharedComposable(_useKbd);
const theme$1 = {
  "base": "inline-flex items-center justify-center px-1 rounded-sm font-medium font-sans uppercase",
  "variants": {
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "variant": {
      "solid": "",
      "outline": "",
      "soft": "",
      "subtle": ""
    },
    "size": {
      "sm": "h-4 min-w-[16px] text-[10px]",
      "md": "h-5 min-w-[20px] text-[11px]",
      "lg": "h-6 min-w-[24px] text-[12px]"
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": "solid",
      "class": "text-inverted bg-primary"
    },
    {
      "color": "secondary",
      "variant": "solid",
      "class": "text-inverted bg-secondary"
    },
    {
      "color": "success",
      "variant": "solid",
      "class": "text-inverted bg-success"
    },
    {
      "color": "info",
      "variant": "solid",
      "class": "text-inverted bg-info"
    },
    {
      "color": "warning",
      "variant": "solid",
      "class": "text-inverted bg-warning"
    },
    {
      "color": "error",
      "variant": "solid",
      "class": "text-inverted bg-error"
    },
    {
      "color": "primary",
      "variant": "outline",
      "class": "ring ring-inset ring-primary/50 text-primary"
    },
    {
      "color": "secondary",
      "variant": "outline",
      "class": "ring ring-inset ring-secondary/50 text-secondary"
    },
    {
      "color": "success",
      "variant": "outline",
      "class": "ring ring-inset ring-success/50 text-success"
    },
    {
      "color": "info",
      "variant": "outline",
      "class": "ring ring-inset ring-info/50 text-info"
    },
    {
      "color": "warning",
      "variant": "outline",
      "class": "ring ring-inset ring-warning/50 text-warning"
    },
    {
      "color": "error",
      "variant": "outline",
      "class": "ring ring-inset ring-error/50 text-error"
    },
    {
      "color": "primary",
      "variant": "soft",
      "class": "text-primary bg-primary/10"
    },
    {
      "color": "secondary",
      "variant": "soft",
      "class": "text-secondary bg-secondary/10"
    },
    {
      "color": "success",
      "variant": "soft",
      "class": "text-success bg-success/10"
    },
    {
      "color": "info",
      "variant": "soft",
      "class": "text-info bg-info/10"
    },
    {
      "color": "warning",
      "variant": "soft",
      "class": "text-warning bg-warning/10"
    },
    {
      "color": "error",
      "variant": "soft",
      "class": "text-error bg-error/10"
    },
    {
      "color": "primary",
      "variant": "subtle",
      "class": "text-primary ring ring-inset ring-primary/25 bg-primary/10"
    },
    {
      "color": "secondary",
      "variant": "subtle",
      "class": "text-secondary ring ring-inset ring-secondary/25 bg-secondary/10"
    },
    {
      "color": "success",
      "variant": "subtle",
      "class": "text-success ring ring-inset ring-success/25 bg-success/10"
    },
    {
      "color": "info",
      "variant": "subtle",
      "class": "text-info ring ring-inset ring-info/25 bg-info/10"
    },
    {
      "color": "warning",
      "variant": "subtle",
      "class": "text-warning ring ring-inset ring-warning/25 bg-warning/10"
    },
    {
      "color": "error",
      "variant": "subtle",
      "class": "text-error ring ring-inset ring-error/25 bg-error/10"
    },
    {
      "color": "neutral",
      "variant": "solid",
      "class": "text-inverted bg-inverted"
    },
    {
      "color": "neutral",
      "variant": "outline",
      "class": "ring ring-inset ring-accented text-default bg-default"
    },
    {
      "color": "neutral",
      "variant": "soft",
      "class": "text-default bg-elevated"
    },
    {
      "color": "neutral",
      "variant": "subtle",
      "class": "ring ring-inset ring-accented text-default bg-elevated"
    }
  ],
  "defaultVariants": {
    "variant": "outline",
    "color": "neutral",
    "size": "md"
  }
};
const _sfc_main$2 = {
  __name: "UKbd",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false, default: "kbd" },
    value: { type: null, required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    class: { type: null, required: false }
  },
  setup(__props) {
    const props = __props;
    const { getKbdKey } = useKbd();
    const appConfig = useAppConfig();
    const ui = computed(() => tv({ extend: tv(theme$1), ...appConfig.ui?.kbd || {} }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        class: ui.value({ class: props.class, color: props.color, variant: props.variant, size: props.size })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              _push2(`${ssrInterpolate(unref(getKbdKey)(__props.value))}`);
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, () => [
                createTextVNode(toDisplayString(unref(getKbdKey)(__props.value)), 1)
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Kbd.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const theme = {
  "slots": {
    "content": "flex items-center gap-1 bg-default text-highlighted shadow-sm rounded-sm ring ring-default h-6 px-2.5 py-1 text-xs select-none data-[state=delayed-open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-tooltip-content-transform-origin) pointer-events-auto",
    "arrow": "fill-default",
    "text": "truncate",
    "kbds": "hidden lg:inline-flex items-center shrink-0 gap-0.5 not-first-of-type:before:content-['·'] not-first-of-type:before:me-0.5",
    "kbdsSize": "sm"
  }
};
const _sfc_main$1 = {
  __name: "UTooltip",
  __ssrInlineRender: true,
  props: {
    text: { type: String, required: false },
    kbds: { type: Array, required: false },
    content: { type: Object, required: false },
    arrow: { type: [Boolean, Object], required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    reference: { type: null, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    defaultOpen: { type: Boolean, required: false },
    open: { type: Boolean, required: false },
    delayDuration: { type: Number, required: false },
    disableHoverableContent: { type: Boolean, required: false },
    disableClosingTrigger: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    ignoreNonKeyboardFocus: { type: Boolean, required: false }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const appConfig = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "defaultOpen", "open", "delayDuration", "disableHoverableContent", "disableClosingTrigger", "ignoreNonKeyboardFocus"), emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8 }));
    const arrowProps = toRef(() => props.arrow);
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.tooltip || {} })({
      side: contentProps.value.side
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TooltipRoot), mergeProps(unref(rootProps), {
        disabled: !(__props.text || __props.kbds?.length || !!slots.content) || props.disabled
      }, _attrs), {
        default: withCtx(({ open }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!!slots.default || !!__props.reference) {
              _push2(ssrRenderComponent(unref(TooltipTrigger), mergeProps(_ctx.$attrs, {
                "as-child": "",
                reference: __props.reference,
                class: props.class
              }), {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", { open }, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", { open })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(TooltipPortal), unref(portalProps), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(TooltipContent), mergeProps(contentProps.value, {
                    "data-slot": "content",
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }), {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "content", { ui: ui.value }, () => {
                          if (__props.text) {
                            _push4(`<span data-slot="text" class="${ssrRenderClass(ui.value.text({ class: props.ui?.text }))}"${_scopeId3}>${ssrInterpolate(__props.text)}</span>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (__props.kbds?.length) {
                            _push4(`<span data-slot="kbds" class="${ssrRenderClass(ui.value.kbds({ class: props.ui?.kbds }))}"${_scopeId3}><!--[-->`);
                            ssrRenderList(__props.kbds, (kbd, index) => {
                              _push4(ssrRenderComponent(_sfc_main$2, mergeProps({
                                key: index,
                                size: props.ui?.kbdsSize || ui.value.kbdsSize()
                              }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, _parent4, _scopeId3));
                            });
                            _push4(`<!--]--></span>`);
                          } else {
                            _push4(`<!---->`);
                          }
                        }, _push4, _parent4, _scopeId3);
                        if (!!__props.arrow) {
                          _push4(ssrRenderComponent(unref(TooltipArrow), mergeProps(arrowProps.value, {
                            "data-slot": "arrow",
                            class: ui.value.arrow({ class: props.ui?.arrow })
                          }), null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "content", { ui: ui.value }, () => [
                            __props.text ? (openBlock(), createBlock("span", {
                              key: 0,
                              "data-slot": "text",
                              class: ui.value.text({ class: props.ui?.text })
                            }, toDisplayString(__props.text), 3)) : createCommentVNode("", true),
                            __props.kbds?.length ? (openBlock(), createBlock("span", {
                              key: 1,
                              "data-slot": "kbds",
                              class: ui.value.kbds({ class: props.ui?.kbds })
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.kbds, (kbd, index) => {
                                return openBlock(), createBlock(_sfc_main$2, mergeProps({
                                  key: index,
                                  size: props.ui?.kbdsSize || ui.value.kbdsSize()
                                }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
                              }), 128))
                            ], 2)) : createCommentVNode("", true)
                          ]),
                          !!__props.arrow ? (openBlock(), createBlock(unref(TooltipArrow), mergeProps({ key: 0 }, arrowProps.value, {
                            "data-slot": "arrow",
                            class: ui.value.arrow({ class: props.ui?.arrow })
                          }), null, 16, ["class"])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(TooltipContent), mergeProps(contentProps.value, {
                      "data-slot": "content",
                      class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                    }), {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "content", { ui: ui.value }, () => [
                          __props.text ? (openBlock(), createBlock("span", {
                            key: 0,
                            "data-slot": "text",
                            class: ui.value.text({ class: props.ui?.text })
                          }, toDisplayString(__props.text), 3)) : createCommentVNode("", true),
                          __props.kbds?.length ? (openBlock(), createBlock("span", {
                            key: 1,
                            "data-slot": "kbds",
                            class: ui.value.kbds({ class: props.ui?.kbds })
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.kbds, (kbd, index) => {
                              return openBlock(), createBlock(_sfc_main$2, mergeProps({
                                key: index,
                                size: props.ui?.kbdsSize || ui.value.kbdsSize()
                              }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
                            }), 128))
                          ], 2)) : createCommentVNode("", true)
                        ]),
                        !!__props.arrow ? (openBlock(), createBlock(unref(TooltipArrow), mergeProps({ key: 0 }, arrowProps.value, {
                          "data-slot": "arrow",
                          class: ui.value.arrow({ class: props.ui?.arrow })
                        }), null, 16, ["class"])) : createCommentVNode("", true)
                      ]),
                      _: 3
                    }, 16, ["class"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              !!slots.default || !!__props.reference ? (openBlock(), createBlock(unref(TooltipTrigger), mergeProps({ key: 0 }, _ctx.$attrs, {
                "as-child": "",
                reference: __props.reference,
                class: props.class
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", { open })
                ]),
                _: 2
              }, 1040, ["reference", "class"])) : createCommentVNode("", true),
              createVNode(unref(TooltipPortal), unref(portalProps), {
                default: withCtx(() => [
                  createVNode(unref(TooltipContent), mergeProps(contentProps.value, {
                    "data-slot": "content",
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }), {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "content", { ui: ui.value }, () => [
                        __props.text ? (openBlock(), createBlock("span", {
                          key: 0,
                          "data-slot": "text",
                          class: ui.value.text({ class: props.ui?.text })
                        }, toDisplayString(__props.text), 3)) : createCommentVNode("", true),
                        __props.kbds?.length ? (openBlock(), createBlock("span", {
                          key: 1,
                          "data-slot": "kbds",
                          class: ui.value.kbds({ class: props.ui?.kbds })
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.kbds, (kbd, index) => {
                            return openBlock(), createBlock(_sfc_main$2, mergeProps({
                              key: index,
                              size: props.ui?.kbdsSize || ui.value.kbdsSize()
                            }, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
                          }), 128))
                        ], 2)) : createCommentVNode("", true)
                      ]),
                      !!__props.arrow ? (openBlock(), createBlock(unref(TooltipArrow), mergeProps({ key: 0 }, arrowProps.value, {
                        "data-slot": "arrow",
                        class: ui.value.arrow({ class: props.ui?.arrow })
                      }), null, 16, ["class"])) : createCommentVNode("", true)
                    ]),
                    _: 3
                  }, 16, ["class"])
                ]),
                _: 3
              }, 16)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Tooltip.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "GalleryProductDetailModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    product: {},
    productImageUrl: {}
  },
  emits: ["update:modelValue", "tweak"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { priceDisplay, priceDisplaySummary, priceDiagnostics } = useProductPriceDisplay();
    const productCategoryName = computed(() => {
      const p = props.product;
      if (!p) return "";
      const c = p.category;
      if (typeof c === "string") return c.trim();
      if (c && typeof c === "object" && "name" in c && typeof c.name === "string") {
        return c.name.trim();
      }
      return "";
    });
    const editUrl = computed(() => {
      const p = props.product;
      if (!p?.shop?.slug) return null;
      return `/dashboard/shops/${p.shop.slug}/products/${p.id}`;
    });
    const setupUrl = computed(() => {
      const p = props.product;
      if (!p?.shop?.slug) return null;
      return `/dashboard/shops/${p.shop.slug}/setup`;
    });
    const MISSING_FIELDS_LABELS = {
      paper: "Paper stock (add under Shop → Papers)",
      machine: "Machine (add under Shop → Machines)",
      printing_rate: "Printing rates (add under Machine → Printing Rates)",
      dimensions: "Product dimensions (default_finished_width_mm, default_finished_height_mm)",
      product_rules: "Product rules (gsm range, allowed sheet sizes)"
    };
    function missingFieldsLabels(fields) {
      return fields.map((f) => MISSING_FIELDS_LABELS[f] ?? f);
    }
    function onTweak() {
      emit("update:modelValue", false);
      emit("tweak");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_NuxtImg = __nuxt_component_5;
      const _component_UIcon = _sfc_main$f;
      const _component_UBadge = _sfc_main$3;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.modelValue) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true"><div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div><div class="modal-panel relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--p-surface)] rounded-2xl shadow-2xl z-10"><div class="p-6"><div class="flex items-start justify-between gap-4 mb-4"><div class="min-w-0"><h2 class="text-xl font-bold text-[var(--p-text)]">${ssrInterpolate(__props.product?.name)}</h2>`);
          if (__props.product?.shop) {
            _push2(`<p class="mt-0.5 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(__props.product.shop.name)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
          _push2(ssrRenderComponent(_component_UButton, {
            color: "neutral",
            variant: "ghost",
            icon: "i-lucide-x",
            size: "sm",
            onClick: ($event) => _ctx.$emit("update:modelValue", false)
          }, null, _parent));
          _push2(`</div>`);
          if (__props.productImageUrl) {
            _push2(`<div class="rounded-xl overflow-hidden bg-[var(--p-surface-sunken)] aspect-[4/3] mb-4">`);
            _push2(ssrRenderComponent(_component_NuxtImg, {
              src: __props.productImageUrl,
              alt: __props.product?.name ?? "",
              class: "w-full h-full object-cover"
            }, null, _parent));
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="space-y-3 text-sm">`);
          if (__props.product?.description) {
            _push2(`<p class="text-[var(--p-text-muted)]">${ssrInterpolate(__props.product.description)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(productCategoryName)) {
            _push2(`<div class="flex items-center gap-2">`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-tag",
              class: "h-4 w-4 text-[var(--p-text-muted)]"
            }, null, _parent));
            _push2(`<span>${ssrInterpolate(unref(productCategoryName))}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.product?.final_size) {
            _push2(`<div class="flex items-center gap-2">`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-ruler",
              class: "h-4 w-4 text-[var(--p-text-muted)]"
            }, null, _parent));
            _push2(`<span>${ssrInterpolate(__props.product.final_size)}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.product?.imposition_summary) {
            _push2(`<div class="flex items-center gap-2">`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-grid-2x2",
              class: "h-4 w-4 text-[var(--p-text-muted)]"
            }, null, _parent));
            _push2(`<span>Fits on ${ssrInterpolate(__props.product.imposition_summary)}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.product?.min_quantity) {
            _push2(`<div class="flex items-center gap-2">`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-hash",
              class: "h-4 w-4 text-[var(--p-text-muted)]"
            }, null, _parent));
            _push2(`<span>Min ${ssrInterpolate(__props.product.min_quantity)} pcs</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.product?.finishing_summary?.length) {
            _push2(`<div class="flex flex-wrap gap-1"><!--[-->`);
            ssrRenderList(__props.product.finishing_summary, (finish) => {
              _push2(ssrRenderComponent(_component_UBadge, {
                key: finish,
                variant: "soft",
                color: "neutral",
                size: "xs"
              }, {
                default: withCtx((_, _push3, _parent2, _scopeId) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(finish)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(finish), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            });
            _push2(`<!--]--></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="mt-4 pt-4 border-t border-[var(--p-border)]">`);
          if (unref(priceDisplaySummary)(__props.product)) {
            _push2(`<!--[--><div class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400"> Total: ${ssrInterpolate(unref(priceDisplaySummary)(__props.product).totalLine)}</div><div class="text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(priceDisplaySummary)(__props.product).perUnitLine)}</div><!--]-->`);
          } else {
            _push2(`<div><div class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">${ssrInterpolate(unref(priceDisplay)(__props.product))}</div>`);
            if (unref(priceDiagnostics)(__props.product)) {
              _push2(`<div class="mt-3 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-3"><p class="text-sm font-medium text-amber-800 dark:text-amber-200"> Why can&#39;t we show a price? </p><p class="mt-1 text-xs text-amber-700 dark:text-amber-300">${ssrInterpolate(unref(priceDiagnostics)(__props.product).reason)}</p>`);
              if (unref(priceDiagnostics)(__props.product).missingFields?.length) {
                _push2(`<div class="mt-2"><p class="text-xs font-medium text-amber-800 dark:text-amber-200">Missing:</p><ul class="mt-0.5 list-disc list-inside text-xs text-amber-700 dark:text-amber-300 space-y-0.5"><!--[-->`);
                ssrRenderList(missingFieldsLabels(unref(priceDiagnostics)(__props.product).missingFields), (field) => {
                  _push2(`<li>${ssrInterpolate(field)}</li>`);
                });
                _push2(`<!--]--></ul></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(priceDiagnostics)(__props.product).suggestions?.length) {
                _push2(`<div class="mt-2"><p class="text-xs font-medium text-amber-800 dark:text-amber-200">What to do:</p><ul class="mt-0.5 space-y-1 text-xs text-amber-700 dark:text-amber-300"><!--[-->`);
                ssrRenderList(unref(priceDiagnostics)(__props.product).suggestions, (s, i) => {
                  _push2(`<li class="flex items-start gap-1.5">`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-right",
                    class: "h-3 w-3 shrink-0 mt-0.5"
                  }, null, _parent));
                  _push2(` ${ssrInterpolate(s.message)}</li>`);
                });
                _push2(`<!--]--></ul></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          }
          _push2(`</div><div class="mt-6 flex flex-wrap gap-2">`);
          if (__props.product?.shop?.slug) {
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              onClick: onTweak
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-sliders-horizontal",
                    class: "h-4 w-4 mr-2"
                  }, null, _parent2, _scopeId));
                  _push3(` Tweak &amp; add to quote `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-sliders-horizontal",
                      class: "h-4 w-4 mr-2"
                    }),
                    createTextVNode(" Tweak & add to quote ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          if (__props.product?.is_owner && __props.product?.shop?.slug && unref(priceDiagnostics)(__props.product)) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: unref(setupUrl),
              variant: "outline",
              color: "warning"
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-settings",
                    class: "h-4 w-4 mr-2"
                  }, null, _parent2, _scopeId));
                  _push3(` Fix missing setup `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-settings",
                      class: "h-4 w-4 mr-2"
                    }),
                    createTextVNode(" Fix missing setup ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          if (__props.product?.is_owner && __props.product?.shop?.slug) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: unref(editUrl),
              variant: "outline",
              color: "neutral"
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-pencil",
                    class: "h-4 w-4 mr-2"
                  }, null, _parent2, _scopeId));
                  _push3(` Edit product `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-pencil",
                      class: "h-4 w-4 mr-2"
                    }),
                    createTextVNode(" Edit product ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/gallery/GalleryProductDetailModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main, { __name: "GalleryProductDetailModal" });

export { _sfc_main$1 as _, __nuxt_component_8 as a };
//# sourceMappingURL=GalleryProductDetailModal-CLsihmtb.mjs.map
