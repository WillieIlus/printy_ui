import { a as Field } from './FormInput-BwqVsjAz.mjs';
import { a as _sfc_main$f, J as _export_sfc, b as __nuxt_component_3$1 } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, watch, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { useEditor } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "RichTextEditor",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: "" },
    placeholder: { default: "" },
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const editor = useEditor({
      content: props.modelValue || "",
      editable: !props.disabled,
      extensions: [
        StarterKit,
        Placeholder.configure({ placeholder: props.placeholder })
      ],
      editorProps: {
        attributes: {
          class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[80px]"
        }
      },
      onUpdate: ({ editor: editor2 }) => {
        emit("update:modelValue", editor2.getHTML());
      }
    });
    watch(
      () => props.modelValue,
      (val) => {
        if (editor.value && editor.value.getHTML() !== (val || "")) {
          editor.value.commands.setContent(val || "", false);
        }
      }
    );
    watch(
      () => props.disabled,
      (val) => {
        editor.value?.setEditable(!val);
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_3$1;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-full min-h-[120px] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3" data-v-f4f2824e${_scopeId}><div class="min-h-[80px] text-gray-400 dark:text-gray-500 text-sm" data-v-f4f2824e${_scopeId}>${ssrInterpolate(__props.placeholder || "Loading editor...")}</div></div>`);
          } else {
            return [
              createVNode("div", { class: "w-full min-h-[120px] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3" }, [
                createVNode("div", { class: "min-h-[80px] text-gray-400 dark:text-gray-500 text-sm" }, toDisplayString(__props.placeholder || "Loading editor..."), 1)
              ])
            ];
          }
        })
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/editor/RichTextEditor.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-f4f2824e"]]), { __name: "EditorRichTextEditor" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormRichText",
  __ssrInlineRender: true,
  props: {
    name: {},
    label: {},
    placeholder: { default: "" },
    disabled: { type: Boolean },
    required: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeField = Field;
      const _component_EditorRichTextEditor = __nuxt_component_1;
      const _component_UIcon = _sfc_main$f;
      _push(ssrRenderComponent(_component_VeeField, mergeProps({
        name: __props.name,
        label: __props.label
      }, _attrs), {
        default: withCtx(({ field, errors }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><label${ssrRenderAttr("for", __props.name)} class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"${_scopeId}>${ssrInterpolate(__props.label)} `);
            if (__props.required) {
              _push2(`<span class="text-flamingo-500"${_scopeId}>*</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</label>`);
            _push2(ssrRenderComponent(_component_EditorRichTextEditor, {
              "model-value": field.value,
              placeholder: __props.placeholder,
              disabled: __props.disabled,
              "onUpdate:modelValue": field.handleChange
            }, null, _parent2, _scopeId));
            _push2(`<div class="mt-1 h-5"${_scopeId}>`);
            if (errors.length) {
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
                createVNode("label", {
                  for: __props.name,
                  class: "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                }, [
                  createTextVNode(toDisplayString(__props.label) + " ", 1),
                  __props.required ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "text-flamingo-500"
                  }, "*")) : createCommentVNode("", true)
                ], 8, ["for"]),
                createVNode(_component_EditorRichTextEditor, {
                  "model-value": field.value,
                  placeholder: __props.placeholder,
                  disabled: __props.disabled,
                  "onUpdate:modelValue": field.handleChange
                }, null, 8, ["model-value", "placeholder", "disabled", "onUpdate:modelValue"]),
                createVNode("div", { class: "mt-1 h-5" }, [
                  errors.length ? (openBlock(), createBlock("p", {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/forms/FormRichText.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "FormsFormRichText" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=FormRichText-CJOuStKS.mjs.map
