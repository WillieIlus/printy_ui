import { _ as __nuxt_component_0 } from './DashboardPageHeader-C_rdBHa1.mjs';
import { f as useRoute, c as _sfc_main$9 } from './server.mjs';
import { _ as __nuxt_component_3$1 } from './SkeletonState-CnWAboWg.mjs';
import { _ as _sfc_main$2 } from './Card-DKHttVBV.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, renderSlot, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { u as useShopStore } from './shop-0Cyw6rqQ.mjs';
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
import './api-error-D1IYk86E.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ShopHours",
  __ssrInlineRender: true,
  props: {
    hours: {}
  },
  setup(__props) {
    const WEEKDAYS = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    function dayLabel(weekday) {
      return WEEKDAYS[weekday] ?? `Day ${weekday}`;
    }
    function formatTime(time) {
      if (!time) return "--";
      return time.length > 5 ? time.slice(0, 5) : time;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$2;
      _push(ssrRenderComponent(_component_UCard, _attrs, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Business hours</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Business hours")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Configure opening hours per day. Use the dashboard shop detail page to edit.</p>`);
            if (__props.hours?.length) {
              _push2(`<div class="mt-4 space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.hours, (h) => {
                _push2(`<div class="flex justify-between items-center rounded-lg border dark:border-gray-700 px-3 py-2"${_scopeId}><span class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(h.weekday_display ?? dayLabel(h.weekday))}</span><span class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>${ssrInterpolate(h.is_closed ? "Closed" : `${formatTime(h.from_hour)} – ${formatTime(h.to_hour)}`)}</span></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Configure opening hours per day. Use the dashboard shop detail page to edit."),
              __props.hours?.length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mt-4 space-y-2"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.hours, (h) => {
                  return openBlock(), createBlock("div", {
                    key: h.id,
                    class: "flex justify-between items-center rounded-lg border dark:border-gray-700 px-3 py-2"
                  }, [
                    createVNode("span", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(h.weekday_display ?? dayLabel(h.weekday)), 1),
                    createVNode("span", { class: "text-sm text-gray-600 dark:text-gray-400" }, toDisplayString(h.is_closed ? "Closed" : `${formatTime(h.from_hour)} – ${formatTime(h.to_hour)}`), 1)
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
    const shopStore = useShopStore();
    const slug = computed(() => route.params.slug);
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardSkeletonState = __nuxt_component_3$1;
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
          hours: unref(shopStore).shopHours
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
//# sourceMappingURL=hours-GW6Ej7FE.mjs.map
