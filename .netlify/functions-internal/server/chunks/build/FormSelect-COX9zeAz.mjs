import { u as useField, a as Field } from './FormInput-BwqVsjAz.mjs';
import { _ as _sfc_main$1 } from './SelectMenu-Cud-scqw.mjs';
import { a as _sfc_main$f } from './server.mjs';
import { defineComponent, computed, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, createTextVNode, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormSelect",
  __ssrInlineRender: true,
  props: {
    name: {},
    label: {},
    options: {},
    placeholder: {},
    disabled: { type: Boolean },
    required: { type: Boolean },
    hideLabel: { type: Boolean },
    helper: {},
    portal: { type: [String, Boolean], default: true },
    createItem: { type: [Boolean, String, Object], default: false },
    formatCreateValue: {}
  },
  emits: ["create"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { setValue } = useField(() => props.name);
    function onCreate(v) {
      const val = props.formatCreateValue ? props.formatCreateValue(v) : v;
      if (val !== "" && val != null) setValue(val);
      emit("create", v);
    }
    const contentProps = computed(
      () => props.portal ? { class: "z-[100000]" } : {}
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeField = Field;
      const _component_USelectMenu = _sfc_main$1;
      const _component_UIcon = _sfc_main$f;
      _push(ssrRenderComponent(_component_VeeField, mergeProps({ name: __props.name }, _attrs), {
        default: withCtx(({ value, errors }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}>`);
            if (!__props.hideLabel) {
              _push2(`<label${ssrRenderAttr("for", __props.name)} class="mb-1.5 block text-sm font-medium text-gray-700"${_scopeId}>${ssrInterpolate(__props.label)} `);
              if (__props.required) {
                _push2(`<span class="text-flamingo-500"${_scopeId}>*</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</label>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_USelectMenu, {
              "model-value": value,
              items: __props.options,
              placeholder: __props.placeholder,
              disabled: __props.disabled,
              "value-key": "value",
              color: errors?.length ? "error" : void 0,
              portal: __props.portal,
              content: unref(contentProps),
              "create-item": __props.createItem,
              name: __props.name,
              class: "w-full",
              ui: {
                base: errors?.length ? "w-full rounded-xl border border-red-300 bg-gray-50 py-3 text-sm text-gray-900 transition-all focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50" : "w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm text-gray-900 transition-all focus:border-flamingo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-flamingo-500/20 disabled:cursor-not-allowed disabled:opacity-50",
                rounded: "rounded-xl",
                padding: "px-4"
              },
              "onUpdate:modelValue": _ctx.onUpdate,
              onCreate
            }, null, _parent2, _scopeId));
            _push2(`<div class="mt-1 h-5"${_scopeId}>`);
            if (errors?.length) {
              _push2(`<p class="flex items-center gap-1 text-xs text-red-500"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-alert-circle",
                class: "h-3.5 w-3.5 flex-shrink-0"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(errors[0])}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", null, [
                !__props.hideLabel ? (openBlock(), createBlock("label", {
                  key: 0,
                  for: __props.name,
                  class: "mb-1.5 block text-sm font-medium text-gray-700"
                }, [
                  createTextVNode(toDisplayString(__props.label) + " ", 1),
                  __props.required ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "text-flamingo-500"
                  }, "*")) : createCommentVNode("", true)
                ], 8, ["for"])) : createCommentVNode("", true),
                createVNode(_component_USelectMenu, {
                  "model-value": value,
                  items: __props.options,
                  placeholder: __props.placeholder,
                  disabled: __props.disabled,
                  "value-key": "value",
                  color: errors?.length ? "error" : void 0,
                  portal: __props.portal,
                  content: unref(contentProps),
                  "create-item": __props.createItem,
                  name: __props.name,
                  class: "w-full",
                  ui: {
                    base: errors?.length ? "w-full rounded-xl border border-red-300 bg-gray-50 py-3 text-sm text-gray-900 transition-all focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50" : "w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm text-gray-900 transition-all focus:border-flamingo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-flamingo-500/20 disabled:cursor-not-allowed disabled:opacity-50",
                    rounded: "rounded-xl",
                    padding: "px-4"
                  },
                  "onUpdate:modelValue": _ctx.onUpdate,
                  onCreate
                }, null, 8, ["model-value", "items", "placeholder", "disabled", "color", "portal", "content", "create-item", "name", "ui", "onUpdate:modelValue"]),
                createVNode("div", { class: "mt-1 h-5" }, [
                  errors?.length ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "flex items-center gap-1 text-xs text-red-500"
                  }, [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-alert-circle",
                      class: "h-3.5 w-3.5 flex-shrink-0"
                    }),
                    createTextVNode(" " + toDisplayString(errors[0]), 1)
                  ])) : createCommentVNode("", true)
                ])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/forms/FormSelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "FormsFormSelect" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=FormSelect-COX9zeAz.mjs.map
