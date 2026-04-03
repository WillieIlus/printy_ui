import { a as Field } from './FormInput-Ci9MIR6u.mjs';
import { a as _sfc_main$f } from './server.mjs';
import { defineComponent, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderAttrs } from 'vue/server-renderer';
import { f as formLabelClass, h as nativeTextareaClass, b as formHelperClass, c as formErrorClass } from './formUi-NbOzRwMW.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormTextarea",
  __ssrInlineRender: true,
  props: {
    name: {},
    label: {},
    placeholder: { default: "" },
    rows: { default: 4 },
    disabled: { type: Boolean },
    required: { type: Boolean },
    helper: { default: void 0 }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeField = Field;
      const _component_UIcon = _sfc_main$f;
      let _temp0;
      _push(ssrRenderComponent(_component_VeeField, mergeProps({
        name: __props.name,
        label: __props.label
      }, _attrs), {
        default: withCtx(({ field, errors }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><label${ssrRenderAttr("for", __props.name)} class="${ssrRenderClass(unref(formLabelClass))}"${_scopeId}>${ssrInterpolate(__props.label)} `);
            if (__props.required) {
              _push2(`<span class="text-flamingo-500"${_scopeId}>*</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</label><textarea${ssrRenderAttrs(_temp0 = mergeProps(field, {
              id: __props.name,
              placeholder: __props.placeholder,
              rows: __props.rows,
              disabled: __props.disabled,
              "aria-invalid": errors.length ? "true" : "false",
              class: [unref(nativeTextareaClass), errors.length ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""]
            }), "textarea")}${_scopeId}>${ssrInterpolate("value" in _temp0 ? _temp0.value : "")}</textarea>`);
            if (__props.helper && !errors.length) {
              _push2(`<p class="${ssrRenderClass(unref(formHelperClass))}"${_scopeId}>${ssrInterpolate(__props.helper)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-1 min-h-[1.25rem]"${_scopeId}>`);
            if (errors.length) {
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
                createVNode("label", {
                  for: __props.name,
                  class: unref(formLabelClass)
                }, [
                  createTextVNode(toDisplayString(__props.label) + " ", 1),
                  __props.required ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "text-flamingo-500"
                  }, "*")) : createCommentVNode("", true)
                ], 10, ["for"]),
                createVNode("textarea", mergeProps(field, {
                  id: __props.name,
                  placeholder: __props.placeholder,
                  rows: __props.rows,
                  disabled: __props.disabled,
                  "aria-invalid": errors.length ? "true" : "false",
                  class: [unref(nativeTextareaClass), errors.length ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""]
                }), null, 16, ["id", "placeholder", "rows", "disabled", "aria-invalid"]),
                __props.helper && !errors.length ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: unref(formHelperClass)
                }, toDisplayString(__props.helper), 3)) : createCommentVNode("", true),
                createVNode("div", { class: "mt-1 min-h-[1.25rem]" }, [
                  errors.length ? (openBlock(), createBlock("p", {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/forms/FormTextarea.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main, { __name: "FormsFormTextarea" });

export { __nuxt_component_5 as _ };
//# sourceMappingURL=FormTextarea-CvR62LkK.mjs.map
