import { _ as __nuxt_component_0 } from './DashboardPageHeader-Cmi_LCe-.mjs';
import { f as useRoute, b as _sfc_main$9 } from './server.mjs';
import { _ as __nuxt_component_4 } from './SkeletonState-BhcHA7h3.mjs';
import { _ as _sfc_main$2 } from './Card-euyZbd6S.mjs';
import { _ as _sfc_main$3 } from './FormField-DY4KZuoQ.mjs';
import { _ as _sfc_main$4 } from './Input-Hudv-7BP.mjs';
import { _ as _sfc_main$5 } from './Checkbox-COEi3vth.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, watch, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, renderSlot, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { u as useShopStore$1 } from './shop-DqJLBw0V.mjs';
import { u as useSetupStatus } from './useSetupStatus-BlqBMF6r.mjs';
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
import 'vue-i18n';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './browser-storage-CN-SIF_V.mjs';
import './setupStatus-BIGAzyB1.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ShopHours",
  __ssrInlineRender: true,
  props: {
    hours: {},
    editable: { type: Boolean },
    shopSlug: {}
  },
  emits: ["saved"],
  setup(__props, { emit: __emit }) {
    const WEEKDAYS = {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      7: "Sunday"
    };
    const props = __props;
    const emit = __emit;
    const editing = ref(false);
    const saving = ref(false);
    const localHours = ref([]);
    watch(
      () => props.hours,
      (h) => {
        if (h?.length) {
          localHours.value = h.map((x) => ({
            ...x,
            from_hour: x.from_hour || "08:00",
            to_hour: x.to_hour || "18:00"
          }));
        }
      },
      { immediate: true }
    );
    function dayLabel(weekday) {
      return WEEKDAYS[weekday] ?? `Day ${weekday}`;
    }
    function formatTime(time) {
      if (!time) return "--";
      return time.length > 5 ? time.slice(0, 5) : time;
    }
    async function saveHours() {
      if (!props.shopSlug) return;
      saving.value = true;
      try {
        const shopStore = useShopStore();
        const payload = localHours.value.map((h) => ({
          id: h.id,
          weekday: h.weekday,
          from_hour: h.is_closed ? "" : h.from_hour || "08:00",
          to_hour: h.is_closed ? "" : h.to_hour || "18:00",
          is_closed: h.is_closed
        }));
        const ok = await shopStore.updateShopHoursBulk(props.shopSlug, payload);
        if (ok?.success !== false) {
          editing.value = false;
          emit("saved");
        }
      } finally {
        saving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$2;
      const _component_UButton = _sfc_main$9;
      const _component_UFormField = _sfc_main$3;
      const _component_UInput = _sfc_main$4;
      const _component_UCheckbox = _sfc_main$5;
      _push(ssrRenderComponent(_component_UCard, _attrs, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><h3 class="text-lg font-semibold text-[var(--p-text)]"${_scopeId}>Business hours</h3>`);
            if (__props.editable && __props.hours?.length) {
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "soft",
                size: "xs",
                loading: unref(saving),
                onClick: ($event) => unref(editing) ? saveHours() : editing.value = true
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(editing) ? "Save" : "Edit")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(editing) ? "Save" : "Edit"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("h3", { class: "text-lg font-semibold text-[var(--p-text)]" }, "Business hours"),
                __props.editable && __props.hours?.length ? (openBlock(), createBlock(_component_UButton, {
                  key: 0,
                  variant: "soft",
                  size: "xs",
                  loading: unref(saving),
                  onClick: ($event) => unref(editing) ? saveHours() : editing.value = true
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(editing) ? "Save" : "Edit"), 1)
                  ]),
                  _: 1
                }, 8, ["loading", "onClick"])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-[var(--p-text-muted)]"${_scopeId}> Configure opening hours per day. 1=Monday .. 7=Sunday (ISO). Opening time HH:MM (e.g. 08:00). Closing time HH:MM (e.g. 18:00). </p>`);
            if (__props.hours?.length) {
              _push2(`<div class="mt-4 space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(unref(localHours), (h, i) => {
                _push2(`<div class="flex flex-col gap-2 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3 py-2 sm:flex-row sm:items-center"${_scopeId}><span class="w-28 shrink-0 font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(h.weekday_display ?? dayLabel(h.weekday))}</span>`);
                if (unref(editing) && __props.editable) {
                  _push2(`<!--[-->`);
                  _push2(ssrRenderComponent(_component_UFormField, {
                    label: "",
                    help: "Opening time (HH:MM format, e.g. 08:00)"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(localHours)[i].from_hour,
                          "onUpdate:modelValue": ($event) => unref(localHours)[i].from_hour = $event,
                          type: "time",
                          size: "sm",
                          disabled: unref(localHours)[i].is_closed,
                          class: "max-w-32"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(localHours)[i].from_hour,
                            "onUpdate:modelValue": ($event) => unref(localHours)[i].from_hour = $event,
                            type: "time",
                            size: "sm",
                            disabled: unref(localHours)[i].is_closed,
                            class: "max-w-32"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(ssrRenderComponent(_component_UFormField, {
                    label: "",
                    help: "Closing time (HH:MM format, e.g. 18:00)"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(localHours)[i].to_hour,
                          "onUpdate:modelValue": ($event) => unref(localHours)[i].to_hour = $event,
                          type: "time",
                          size: "sm",
                          disabled: unref(localHours)[i].is_closed,
                          class: "max-w-32"
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(localHours)[i].to_hour,
                            "onUpdate:modelValue": ($event) => unref(localHours)[i].to_hour = $event,
                            type: "time",
                            size: "sm",
                            disabled: unref(localHours)[i].is_closed,
                            class: "max-w-32"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`<label class="flex items-center gap-2 shrink-0"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_UCheckbox, {
                    modelValue: unref(localHours)[i].is_closed,
                    "onUpdate:modelValue": ($event) => unref(localHours)[i].is_closed = $event
                  }, null, _parent2, _scopeId));
                  _push2(`<span class="text-sm text-[var(--p-text-dim)]"${_scopeId}>Closed</span></label><!--]-->`);
                } else {
                  _push2(`<span class="text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(h.is_closed ? "Closed" : `${formatTime(h.from_hour)} – ${formatTime(h.to_hour)}`)}</span>`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              createVNode("p", { class: "text-sm text-[var(--p-text-muted)]" }, " Configure opening hours per day. 1=Monday .. 7=Sunday (ISO). Opening time HH:MM (e.g. 08:00). Closing time HH:MM (e.g. 18:00). "),
              __props.hours?.length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mt-4 space-y-2"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(localHours), (h, i) => {
                  return openBlock(), createBlock("div", {
                    key: h.id ?? h.weekday,
                    class: "flex flex-col gap-2 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3 py-2 sm:flex-row sm:items-center"
                  }, [
                    createVNode("span", { class: "w-28 shrink-0 font-medium text-[var(--p-text)]" }, toDisplayString(h.weekday_display ?? dayLabel(h.weekday)), 1),
                    unref(editing) && __props.editable ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createVNode(_component_UFormField, {
                        label: "",
                        help: "Opening time (HH:MM format, e.g. 08:00)"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(localHours)[i].from_hour,
                            "onUpdate:modelValue": ($event) => unref(localHours)[i].from_hour = $event,
                            type: "time",
                            size: "sm",
                            disabled: unref(localHours)[i].is_closed,
                            class: "max-w-32"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_component_UFormField, {
                        label: "",
                        help: "Closing time (HH:MM format, e.g. 18:00)"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(localHours)[i].to_hour,
                            "onUpdate:modelValue": ($event) => unref(localHours)[i].to_hour = $event,
                            type: "time",
                            size: "sm",
                            disabled: unref(localHours)[i].is_closed,
                            class: "max-w-32"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ]),
                        _: 2
                      }, 1024),
                      createVNode("label", { class: "flex items-center gap-2 shrink-0" }, [
                        createVNode(_component_UCheckbox, {
                          modelValue: unref(localHours)[i].is_closed,
                          "onUpdate:modelValue": ($event) => unref(localHours)[i].is_closed = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode("span", { class: "text-sm text-[var(--p-text-dim)]" }, "Closed")
                      ])
                    ], 64)) : (openBlock(), createBlock("span", {
                      key: 1,
                      class: "text-sm text-[var(--p-text-muted)]"
                    }, toDisplayString(h.is_closed ? "Closed" : `${formatTime(h.from_hour)} – ${formatTime(h.to_hour)}`), 1))
                  ]);
                }), 128))
              ])) : createCommentVNode("", true),
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shops/ShopHours.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$1, { __name: "ShopsShopHours" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "hours",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const shopStore = useShopStore$1();
    const { refreshAndNavigate } = useSetupStatus();
    const slug = computed(() => route.params.slug);
    const loading = ref(true);
    async function handleSaved() {
      await shopStore.fetchShopHoursList(slug.value);
      await refreshAndNavigate({
        shopSlug: slug.value,
        fallbackUrl: `/dashboard/shops/${slug.value}`,
        onlyWhenNextUrlChanges: true
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_ShopsShopHours = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Business hours",
        subtitle: unref(slug)
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}`,
              variant: "soft",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back`);
                } else {
                  return [
                    createTextVNode("Back")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}`,
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back")
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent));
      } else {
        _push(`<div class="col-span-12">`);
        _push(ssrRenderComponent(_component_ShopsShopHours, {
          hours: unref(shopStore).shopHours,
          editable: true,
          "shop-slug": unref(slug),
          onSaved: handleSaved
        }, null, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/hours.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=hours-BpM01v4B.mjs.map
