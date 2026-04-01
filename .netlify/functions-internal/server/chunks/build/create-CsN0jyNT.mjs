import { _ as __nuxt_component_0 } from './DashboardPageHeader-By409uiV.mjs';
import { d as _sfc_main$9 } from './server.mjs';
import { _ as _sfc_main$1 } from './FormField-ChkzAQqB.mjs';
import { _ as _sfc_main$2 } from './Input-DZEAnFef.mjs';
import { defineComponent, ref, reactive, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { useI18n } from 'vue-i18n';
import { a as useJobRequests } from './useJobRequests-BRamYsxq.mjs';
import { u as useNotification } from './useNotification-DxMfmZhF.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useJobRequests();
    useNotification();
    const title = ref("");
    const location = ref("");
    const deadline = ref("");
    const form = reactive({
      product: "",
      size: "",
      quantity: "",
      paper: "",
      finishing: ""
    });
    const loading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UFormField = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: unref(t)("jobs.createTitle"),
        subtitle: unref(t)("jobs.createSubtitle")
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              size: "sm",
              to: "/dashboard/jobs"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("common.back"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("common.back")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                variant: "soft",
                size: "sm",
                to: "/dashboard/jobs"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(t)("common.back")), 1)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<form class="max-w-xl space-y-4">`);
      _push(ssrRenderComponent(_component_UFormField, {
        label: unref(t)("jobs.fields.title"),
        required: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(title),
              "onUpdate:modelValue": ($event) => isRef(title) ? title.value = $event : null,
              placeholder: unref(t)("jobs.placeholders.title")
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(title),
                "onUpdate:modelValue": ($event) => isRef(title) ? title.value = $event : null,
                placeholder: unref(t)("jobs.placeholders.title")
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormField, {
        label: unref(t)("jobs.fields.productCategory")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).product,
              "onUpdate:modelValue": ($event) => unref(form).product = $event,
              placeholder: unref(t)("jobs.placeholders.productCategory")
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(form).product,
                "onUpdate:modelValue": ($event) => unref(form).product = $event,
                placeholder: unref(t)("jobs.placeholders.productCategory")
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid grid-cols-2 gap-4">`);
      _push(ssrRenderComponent(_component_UFormField, {
        label: unref(t)("jobs.fields.size")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).size,
              "onUpdate:modelValue": ($event) => unref(form).size = $event,
              placeholder: unref(t)("jobs.placeholders.size")
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(form).size,
                "onUpdate:modelValue": ($event) => unref(form).size = $event,
                placeholder: unref(t)("jobs.placeholders.size")
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormField, {
        label: unref(t)("jobs.fields.quantity")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).quantity,
              "onUpdate:modelValue": ($event) => unref(form).quantity = $event,
              modelModifiers: { number: true },
              type: "number",
              placeholder: unref(t)("jobs.placeholders.quantity")
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(form).quantity,
                "onUpdate:modelValue": ($event) => unref(form).quantity = $event,
                modelModifiers: { number: true },
                type: "number",
                placeholder: unref(t)("jobs.placeholders.quantity")
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-2 gap-4">`);
      _push(ssrRenderComponent(_component_UFormField, {
        label: unref(t)("jobs.fields.paper")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).paper,
              "onUpdate:modelValue": ($event) => unref(form).paper = $event,
              placeholder: unref(t)("jobs.placeholders.paper")
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(form).paper,
                "onUpdate:modelValue": ($event) => unref(form).paper = $event,
                placeholder: unref(t)("jobs.placeholders.paper")
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormField, {
        label: unref(t)("jobs.fields.finishing")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).finishing,
              "onUpdate:modelValue": ($event) => unref(form).finishing = $event,
              placeholder: unref(t)("jobs.placeholders.finishing")
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(form).finishing,
                "onUpdate:modelValue": ($event) => unref(form).finishing = $event,
                placeholder: unref(t)("jobs.placeholders.finishing")
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UFormField, {
        label: unref(t)("common.location")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(location),
              "onUpdate:modelValue": ($event) => isRef(location) ? location.value = $event : null,
              placeholder: unref(t)("jobs.placeholders.location")
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(location),
                "onUpdate:modelValue": ($event) => isRef(location) ? location.value = $event : null,
                placeholder: unref(t)("jobs.placeholders.location")
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormField, {
        label: unref(t)("common.deadline")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(deadline),
              "onUpdate:modelValue": ($event) => isRef(deadline) ? deadline.value = $event : null,
              type: "datetime-local"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(deadline),
                "onUpdate:modelValue": ($event) => isRef(deadline) ? deadline.value = $event : null,
                type: "datetime-local"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        type: "submit",
        color: "primary",
        loading: unref(loading)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("common.create"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("common.create")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        to: "/dashboard/jobs"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("common.cancel"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("common.cancel")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/jobs/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-CsN0jyNT.mjs.map
