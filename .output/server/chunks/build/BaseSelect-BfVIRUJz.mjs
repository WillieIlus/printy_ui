import { defineComponent, useAttrs, computed, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { F as FormField } from './BaseInput-BGy7Y2Dg.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    options: {},
    label: {},
    placeholder: {},
    error: {},
    help: {},
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    variant: { default: "default" },
    size: { default: "md" }
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const attrs = useAttrs();
    const normalizedOptions = computed(() => props.options.map((option) => typeof option === "string" ? { label: option, value: option } : option));
    const sizeMap = {
      sm: "py-2 text-[13px]",
      md: "py-2.5 text-[13.5px]",
      lg: "py-3 text-[14px]"
    };
    const variantMap = {
      default: "bg-white border border-[#d0d5dd] text-[#101828]",
      dark: "bg-[#1d2939] border border-[#344054] text-white",
      calculator: "bg-white border border-[#d0d5dd] text-[#101828]",
      dashboard: "bg-slate-50 border border-slate-200 text-slate-700",
      auth: "bg-white border border-[#d0d5dd] text-[#101828]"
    };
    const selectClass = computed(() => ["w-full rounded-lg px-3.5 shadow-sm outline-none focus:ring-2 focus:ring-[#e13515] focus:border-[#e13515]", sizeMap[props.size], variantMap[props.variant]]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(FormField, mergeProps({
        label: __props.label,
        error: __props.error,
        help: __props.help,
        required: __props.required
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<select${ssrRenderAttrs(mergeProps(unref(attrs), {
              value: __props.modelValue ?? "",
              disabled: __props.disabled,
              class: unref(selectClass)
            }))}${_scopeId}>`);
            if (__props.placeholder) {
              _push2(`<option value=""${_scopeId}>${ssrInterpolate(__props.placeholder)}</option>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(unref(normalizedOptions), (option) => {
              _push2(`<option${ssrRenderAttr("value", option.value)}${_scopeId}>${ssrInterpolate(option.label)}</option>`);
            });
            _push2(`<!--]--></select>`);
          } else {
            return [
              createVNode("select", mergeProps(unref(attrs), {
                value: __props.modelValue ?? "",
                disabled: __props.disabled,
                class: unref(selectClass),
                onChange: ($event) => _ctx.$emit("update:modelValue", $event.target.value)
              }), [
                __props.placeholder ? (openBlock(), createBlock("option", {
                  key: 0,
                  value: ""
                }, toDisplayString(__props.placeholder), 1)) : createCommentVNode("", true),
                (openBlock(true), createBlock(Fragment, null, renderList(unref(normalizedOptions), (option) => {
                  return openBlock(), createBlock("option", {
                    key: option.value,
                    value: option.value
                  }, toDisplayString(option.label), 9, ["value"]);
                }), 128))
              ], 16, ["value", "disabled", "onChange"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/BaseSelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BaseSelect = Object.assign(_sfc_main, { __name: "BaseSelect" });

export { BaseSelect as B };
//# sourceMappingURL=BaseSelect-BfVIRUJz.mjs.map
