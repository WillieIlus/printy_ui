import { u as useField, a as Field } from './FormInput-CXwkCB6L.mjs';
import { _ as _sfc_main$1 } from './SelectMenu-DDFAjir1.mjs';
import { a as _sfc_main$f } from './server.mjs';
import { defineComponent, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, createTextVNode, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { f as formLabelClass, b as formHelperClass, c as formErrorClass, d as dashboardSelectUi } from './formUi-DTjrawz_.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormSelect",
  __ssrInlineRender: true,
  props: {
    name: {},
    label: {},
    options: {},
    placeholder: { default: "" },
    disabled: { type: Boolean },
    required: { type: Boolean },
    hideLabel: { type: Boolean },
    helper: { default: void 0 },
    portal: { type: [String, Boolean], default: "body" },
    createItem: { type: [Boolean, String, Object], default: false },
    formatCreateValue: { type: Function, default: void 0 }
  },
  emits: ["create"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { setValue } = useField(() => props.name);
    function onUpdate(v) {
      setValue(normalize(v));
    }
    function onCreate(v) {
      const val = props.formatCreateValue ? props.formatCreateValue(v) : v;
      if (val !== "" && val != null) setValue(val);
      emit("create", v);
    }
    function normalize(v) {
      if (v == null) return "";
      if (typeof v === "string" || typeof v === "number") return v;
      if (typeof v === "object" && v !== null && "value" in v) return v.value;
      return String(v);
    }
    function getSelectUi(hasError) {
      return {
        ...dashboardSelectUi,
        base: [
          dashboardSelectUi.base,
          hasError ? "border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20" : "",
          "disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-[var(--p-surface-sunken)]"
        ]
      };
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeField = Field;
      const _component_USelectMenu = _sfc_main$1;
      const _component_UIcon = _sfc_main$f;
      _push(ssrRenderComponent(_component_VeeField, mergeProps({ name: __props.name }, _attrs), {
        default: withCtx(({ value, errors }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}>`);
            if (!__props.hideLabel) {
              _push2(`<label${ssrRenderAttr("for", __props.name)} class="${ssrRenderClass(unref(formLabelClass))}"${_scopeId}>${ssrInterpolate(__props.label)} `);
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
              "create-item": __props.createItem,
              name: __props.name,
              class: "w-full",
              ui: getSelectUi(Boolean(errors?.length)),
              "onUpdate:modelValue": onUpdate,
              onCreate
            }, null, _parent2, _scopeId));
            if (__props.helper && !errors?.length) {
              _push2(`<p class="${ssrRenderClass(unref(formHelperClass))}"${_scopeId}>${ssrInterpolate(__props.helper)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-1 min-h-[1.25rem]"${_scopeId}>`);
            if (errors?.length) {
              _push2(`<p class="${ssrRenderClass(unref(formErrorClass))}"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-alert-circle",
                class: "mt-0.5 h-3.5 w-3.5 shrink-0"
              }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}>${ssrInterpolate(errors[0])}</span></p>`);
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
                  class: unref(formLabelClass)
                }, [
                  createTextVNode(toDisplayString(__props.label) + " ", 1),
                  __props.required ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "text-flamingo-500"
                  }, "*")) : createCommentVNode("", true)
                ], 10, ["for"])) : createCommentVNode("", true),
                createVNode(_component_USelectMenu, {
                  "model-value": value,
                  items: __props.options,
                  placeholder: __props.placeholder,
                  disabled: __props.disabled,
                  "value-key": "value",
                  color: errors?.length ? "error" : void 0,
                  portal: __props.portal,
                  "create-item": __props.createItem,
                  name: __props.name,
                  class: "w-full",
                  ui: getSelectUi(Boolean(errors?.length)),
                  "onUpdate:modelValue": onUpdate,
                  onCreate
                }, null, 8, ["model-value", "items", "placeholder", "disabled", "color", "portal", "create-item", "name", "ui"]),
                __props.helper && !errors?.length ? (openBlock(), createBlock("p", {
                  key: 1,
                  class: unref(formHelperClass)
                }, toDisplayString(__props.helper), 3)) : createCommentVNode("", true),
                createVNode("div", { class: "mt-1 min-h-[1.25rem]" }, [
                  errors?.length ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: unref(formErrorClass)
                  }, [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-alert-circle",
                      class: "mt-0.5 h-3.5 w-3.5 shrink-0"
                    }),
                    createVNode("span", null, toDisplayString(errors[0]), 1)
                  ], 2)) : createCommentVNode("", true)
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
const __nuxt_component_4 = Object.assign(_sfc_main, { __name: "FormsFormSelect" });

export { __nuxt_component_4 as _ };
//# sourceMappingURL=FormSelect-WoeVYZuO.mjs.map
