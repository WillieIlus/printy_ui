import { F as Form, _ as __nuxt_component_2$2, a as Field } from './FormInput-opqohhBW.mjs';
import { d as _sfc_main$9, a as _sfc_main$f, Q as _export_sfc, b as __nuxt_component_2$3 } from './server.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { useEditor } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { object, string } from 'yup';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
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
      },
      onBlur: ({ editor: editor2 }) => {
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
      const _component_ClientOnly = __nuxt_component_2$3;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-full min-h-[120px] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3" data-v-04953545${_scopeId}><div class="min-h-[80px] text-gray-400 dark:text-gray-500 text-sm" data-v-04953545${_scopeId}>${ssrInterpolate(__props.placeholder || "Loading editor...")}</div></div>`);
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/editor/RichTextEditor.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-04953545"]]), { __name: "EditorRichTextEditor" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
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
            _push2(`<div${_scopeId}><label${ssrRenderAttr("for", __props.name)} class="mb-1.5 block text-[0.95rem] font-semibold leading-6 text-[var(--p-text-dim)]"${_scopeId}>${ssrInterpolate(__props.label)} `);
            if (__props.required) {
              _push2(`<span class="text-flamingo-500"${_scopeId}>*</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</label><div class="${ssrRenderClass([errors.length ? "border-red-500 bg-red-50 dark:bg-red-950/30 ring-2 ring-red-500/30" : "border-[var(--p-border)]", "rounded-xl border-2 bg-[var(--p-surface)] transition-all"])}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_EditorRichTextEditor, {
              "model-value": field.value ?? "",
              placeholder: __props.placeholder,
              disabled: __props.disabled,
              "onUpdate:modelValue": field.handleChange
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mt-1 h-5"${_scopeId}>`);
            if (errors.length) {
              _push2(`<p class="flex items-center gap-1 text-[0.8125rem] leading-5 text-red-500"${_scopeId}>`);
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
                  class: "mb-1.5 block text-[0.95rem] font-semibold leading-6 text-[var(--p-text-dim)]"
                }, [
                  createTextVNode(toDisplayString(__props.label) + " ", 1),
                  __props.required ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "text-flamingo-500"
                  }, "*")) : createCommentVNode("", true)
                ], 8, ["for"]),
                createVNode("div", {
                  class: ["rounded-xl border-2 bg-[var(--p-surface)] transition-all", errors.length ? "border-red-500 bg-red-50 dark:bg-red-950/30 ring-2 ring-red-500/30" : "border-[var(--p-border)]"]
                }, [
                  createVNode(_component_EditorRichTextEditor, {
                    "model-value": field.value ?? "",
                    placeholder: __props.placeholder,
                    disabled: __props.disabled,
                    "onUpdate:modelValue": field.handleChange
                  }, null, 8, ["model-value", "placeholder", "disabled", "onUpdate:modelValue"])
                ], 2),
                createVNode("div", { class: "mt-1 h-5" }, [
                  errors.length ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "flex items-center gap-1 text-[0.8125rem] leading-5 text-red-500"
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/forms/FormRichText.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2$1 = Object.assign(_sfc_main$1, { __name: "FormsFormRichText" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "QuoteForm",
  __ssrInlineRender: true,
  props: {
    quote: {},
    loading: { type: Boolean },
    slug: {},
    rateCard: {},
    submitLabel: { default: "Submit Request" }
  },
  emits: ["submit", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const schema = object({
      customer_name: string().required("Name is required"),
      customer_email: string().email("Invalid email").required("Email is required"),
      customer_phone: string(),
      notes: string()
    });
    const initialValues = computed(() => ({
      customer_name: props.quote?.customer_name ?? "",
      customer_email: props.quote?.customer_email ?? "",
      customer_phone: props.quote?.customer_phone ?? "",
      notes: props.quote?.notes ?? ""
    }));
    const sheetSize = ref("A3");
    const gsm = ref(150);
    const quantity = ref(100);
    const sides = ref(1);
    const paperType = ref("GLOSS");
    const selectedFinishing = ref([]);
    computed(() => {
      if (!props.rateCard?.paper) return [80, 100, 130, 150, 170, 200, 250, 300];
      const gsms = [...new Set(props.rateCard.paper.map((p) => p.gsm))];
      return gsms.sort((a, b) => a - b);
    });
    const pricingStore = usePricingStore();
    const pricingResult = ref(null);
    let debounceTimer;
    async function calculatePrice() {
      if (!props.slug || !props.rateCard) return;
      try {
        const input = {
          sheet_size: sheetSize.value,
          gsm: gsm.value,
          quantity: quantity.value,
          sides: sides.value,
          paper_type: paperType.value,
          finishing_ids: selectedFinishing.value
        };
        pricingResult.value = await pricingStore.calculatePrice(props.slug, input);
      } catch {
        pricingResult.value = null;
      }
    }
    watch([sheetSize, gsm, quantity, sides, paperType, selectedFinishing], () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(calculatePrice, 400);
    }, { immediate: false });
    watch([() => props.slug, () => props.rateCard], () => {
      if (props.slug && props.rateCard) {
        calculatePrice();
      } else {
        pricingResult.value = null;
      }
    }, { immediate: true });
    function onSubmit(values) {
      const payload = {
        customer_name: values.customer_name ?? "",
        customer_email: values.customer_email ?? "",
        customer_phone: values.customer_phone || null,
        notes: values.notes || null
      };
      if (props.slug && props.rateCard) {
        payload.sheet_size = sheetSize.value;
        payload.gsm = gsm.value;
        payload.quantity = quantity.value;
        payload.sides = sides.value;
        payload.paper_type = paperType.value;
        payload.finishing_ids = selectedFinishing.value;
      }
      emit("submit", payload);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_FormsFormInput = __nuxt_component_2$2;
      const _component_FormsFormRichText = __nuxt_component_2$1;
      const _component_UButton = _sfc_main$9;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(schema),
        "initial-values": unref(initialValues),
        onSubmit
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "customer_name",
              label: "Customer name",
              placeholder: "Name",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "customer_email",
              label: "Customer email",
              type: "email",
              placeholder: "email@example.com",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "customer_phone",
              label: "Customer phone",
              placeholder: "+1 555 000 0000"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormRichText, {
              name: "notes",
              label: "Notes",
              placeholder: "Notes..."
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "outline",
              onClick: ($event) => _ctx.$emit("cancel")
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Cancel`);
                } else {
                  return [
                    createTextVNode("Cancel")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              loading: __props.loading,
              disabled: !meta.valid
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Save`);
                } else {
                  return [
                    createTextVNode("Save")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode(_component_FormsFormInput, {
                  name: "customer_name",
                  label: "Customer name",
                  placeholder: "Name",
                  required: ""
                }),
                createVNode(_component_FormsFormInput, {
                  name: "customer_email",
                  label: "Customer email",
                  type: "email",
                  placeholder: "email@example.com",
                  required: ""
                }),
                createVNode(_component_FormsFormInput, {
                  name: "customer_phone",
                  label: "Customer phone",
                  placeholder: "+1 555 000 0000"
                }),
                createVNode(_component_FormsFormRichText, {
                  name: "notes",
                  label: "Notes",
                  placeholder: "Notes..."
                }),
                createVNode("div", { class: "flex justify-end gap-2" }, [
                  createVNode(_component_UButton, {
                    variant: "outline",
                    onClick: ($event) => _ctx.$emit("cancel")
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Cancel")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: __props.loading,
                    disabled: !meta.valid
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Save")
                    ]),
                    _: 1
                  }, 8, ["loading", "disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/QuoteForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "QuotesQuoteForm" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=QuoteForm-BJ5zWcN4.mjs.map
