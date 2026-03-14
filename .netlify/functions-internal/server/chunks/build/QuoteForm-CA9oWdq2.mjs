import { F as Form, _ as __nuxt_component_1 } from './FormInput-BwqVsjAz.mjs';
import { _ as __nuxt_component_2$1 } from './FormRichText-CJOuStKS.mjs';
import { c as _sfc_main$9 } from './server.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { object, string } from 'yup';

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
      const _component_FormsFormInput = __nuxt_component_1;
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
//# sourceMappingURL=QuoteForm-CA9oWdq2.mjs.map
