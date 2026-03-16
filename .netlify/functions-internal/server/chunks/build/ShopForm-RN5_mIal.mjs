import { F as Form, _ as __nuxt_component_1, u as useForm } from './FormInput-DJBpPoj7.mjs';
import { _ as _sfc_main$4 } from './Alert-R7u0l-O4.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, createTextVNode, reactive, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttrs, ssrRenderSlot, ssrRenderAttr } from 'vue/server-renderer';
import { c as _sfc_main$9, d as useRuntimeConfig } from './server.mjs';
import { _ as __nuxt_component_2$1 } from './FormRichText-COppTzi2.mjs';
import { object, string } from 'yup';
import { h as hasRichTextContent } from './richText-DycefbI5.mjs';

function slugify(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "SectionCard",
  __ssrInlineRender: true,
  props: {
    title: { default: void 0 },
    description: { default: void 0 }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm" }, _attrs))}>`);
      if (__props.title || _ctx.$slots.header) {
        _push(`<div class="border-b border-[var(--p-border-dim)] px-4 py-4 sm:px-6">`);
        ssrRenderSlot(_ctx.$slots, "header", {}, () => {
          if (__props.title) {
            _push(`<h2 class="text-base font-semibold text-[var(--p-text)]">${ssrInterpolate(__props.title)}</h2>`);
          } else {
            _push(`<!---->`);
          }
          if (__props.description) {
            _push(`<p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(__props.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
        }, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="p-4 sm:p-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/SectionCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$3, { __name: "CommonSectionCard" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "LocationPicker",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: () => ({}) }
  },
  emits: ["change", "update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    ref(null);
    ref(null);
    const searchValue = ref("");
    const config = useRuntimeConfig();
    const apiKey = config.public.googleMapsApiKey || "";
    const form = reactive({
      address_line: props.modelValue?.address_line ?? "",
      city: props.modelValue?.city ?? "",
      state: props.modelValue?.state ?? "",
      country: props.modelValue?.country ?? "",
      zip_code: props.modelValue?.zip_code ?? "",
      latitude: props.modelValue?.latitude ?? "",
      longitude: props.modelValue?.longitude ?? "",
      google_place_id: props.modelValue?.google_place_id ?? ""
    });
    watch(
      () => props.modelValue,
      (val) => {
        if (val) {
          form.address_line = val.address_line ?? "";
          form.city = val.city ?? "";
          form.state = val.state ?? "";
          form.country = val.country ?? "";
          form.zip_code = val.zip_code ?? "";
          form.latitude = val.latitude ?? "";
          form.longitude = val.longitude ?? "";
          form.google_place_id = val.google_place_id ?? "";
        }
      },
      { deep: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Search location</label><input type="text"${ssrRenderAttr("value", unref(searchValue))} placeholder="Search Westlands, Nairobi" class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)] placeholder:text-[var(--p-text-muted)] focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"><p class="mt-1 text-xs text-[var(--p-text-muted)]"> Search for an area, estate, town, or address. Google will suggest places. </p></div>`);
      if (unref(apiKey)) {
        _push(`<div class="h-64 w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]"></div>`);
      } else {
        _push(`<div class="rounded-xl border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/30 dark:bg-amber-900/10 p-4"><p class="text-sm text-amber-700 dark:text-amber-300"> Add <code class="rounded bg-amber-200/50 px-1 py-0.5 dark:bg-amber-800/50">NUXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable map search. </p></div>`);
      }
      _push(`<div class="grid grid-cols-1 gap-4 md:grid-cols-2"><div><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Address</label><input${ssrRenderAttr("value", unref(form).address_line)} class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"></div><div><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">City</label><input${ssrRenderAttr("value", unref(form).city)} class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"></div><div><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">State / County</label><input${ssrRenderAttr("value", unref(form).state)} class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"></div><div><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Country</label><input${ssrRenderAttr("value", unref(form).country)} class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"></div><div><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Latitude</label><input${ssrRenderAttr("value", unref(form).latitude)} class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"></div><div><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Longitude</label><input${ssrRenderAttr("value", unref(form).longitude)} class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"></div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/LocationPicker.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "AdminLocationPicker" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FormLocationPicker",
  __ssrInlineRender: true,
  props: {
    modelValue: {}
  },
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const form = useForm();
    function onChange(value) {
      emit("change", value);
      if (form?.setFieldValue) {
        form.setFieldValue("address_line", value.address_line);
        form.setFieldValue("city", value.city);
        form.setFieldValue("state", value.state);
        form.setFieldValue("country", value.country);
        form.setFieldValue("zip_code", value.zip_code ?? "");
        form.setFieldValue("latitude", value.latitude);
        form.setFieldValue("longitude", value.longitude);
        form.setFieldValue("google_place_id", value.google_place_id);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdminLocationPicker = __nuxt_component_0;
      _push(ssrRenderComponent(_component_AdminLocationPicker, mergeProps({
        "model-value": __props.modelValue,
        onChange
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/FormLocationPicker.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$1, { __name: "AdminFormLocationPicker" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ShopForm",
  __ssrInlineRender: true,
  props: {
    shop: {},
    loading: { type: Boolean },
    error: {}
  },
  emits: ["submit", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isEdit = computed(() => !!props.shop);
    const slugPreview = ref("");
    const slugManuallyEdited = ref(false);
    const initialValues = computed(() => {
      const s = props.shop;
      if (!s) return { name: "", description: "", business_email: "", phone_number: "", address_line: "", city: "", state: "", country: "", zip_code: "", latitude: "", longitude: "", google_place_id: "" };
      return {
        name: s.name ?? "",
        description: s.description ?? "",
        business_email: s.business_email ?? s.email ?? "",
        phone_number: s.phone_number ?? s.phone ?? "",
        address_line: s.address_line ?? s.address ?? "",
        city: s.city ?? "",
        state: s.state ?? "",
        country: s.country ?? "",
        zip_code: s.zip_code ?? s.postal_code ?? "",
        latitude: s.latitude != null ? String(s.latitude) : "",
        longitude: s.longitude != null ? String(s.longitude) : "",
        google_place_id: s.google_place_id ?? ""
      };
    });
    const locationModel = computed(() => ({
      address_line: initialValues.value.address_line,
      city: initialValues.value.city,
      state: initialValues.value.state,
      country: initialValues.value.country,
      zip_code: initialValues.value.zip_code,
      latitude: initialValues.value.latitude,
      longitude: initialValues.value.longitude,
      google_place_id: initialValues.value.google_place_id
    }));
    function onLocationChange(_value) {
    }
    watch(() => props.shop?.slug, (slug) => {
      if (slug) slugPreview.value = slug;
    }, { immediate: true });
    const shopSchema = object({
      name: string().required("Shop name is required"),
      description: string().nullable(),
      business_email: string().email("Invalid email").required("Email is required"),
      phone_number: string().nullable(),
      address_line: string().required("Address is required"),
      city: string().required("City is required"),
      state: string().required("State is required"),
      country: string().required("Country is required"),
      zip_code: string().required("Postal code is required"),
      latitude: string().nullable(),
      longitude: string().nullable(),
      google_place_id: string().nullable(),
      opening_time: string().nullable(),
      closing_time: string().nullable(),
      closing_soon_minutes: string().nullable()
    });
    function onNameInput(e) {
      if (slugManuallyEdited.value) return;
      const target = e.target;
      if (target?.value != null) {
        slugPreview.value = slugify(target.value);
      }
    }
    function regenerateSlug() {
      slugManuallyEdited.value = false;
      slugPreview.value = slugify(initialValues.value.name);
    }
    function cleanPayload(values) {
      const cleaned = {};
      const keepEmptyKeys = ["description", "google_place_id"];
      for (const [key, value] of Object.entries(values)) {
        if (value === void 0) {
          cleaned[key] = null;
        } else if (value === "" && !keepEmptyKeys.includes(key)) {
          cleaned[key] = null;
        } else {
          cleaned[key] = value;
        }
      }
      const desc = values.description;
      if (typeof desc === "string" && hasRichTextContent(desc)) {
        cleaned.description = desc.trim();
      } else if (desc === null || desc === void 0 || desc === "") {
        cleaned.description = "";
      } else if (typeof desc === "string") {
        cleaned.description = desc.trim() || "";
      }
      return cleaned;
    }
    function onSubmit(values) {
      const cleaned = cleanPayload(values);
      emit("submit", cleaned);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_UAlert = _sfc_main$4;
      const _component_CommonSectionCard = __nuxt_component_2;
      const _component_FormsFormInput = __nuxt_component_1;
      const _component_UButton = _sfc_main$9;
      const _component_FormsFormRichText = __nuxt_component_2$1;
      const _component_AdminFormLocationPicker = __nuxt_component_6;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(shopSchema),
        "initial-values": unref(initialValues),
        onSubmit
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}>`);
            if (__props.error) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "soft",
                title: __props.error,
                icon: "i-lucide-alert-circle",
                class: "mb-4"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_CommonSectionCard, { title: "Basic Information" }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_FormsFormInput, {
                    name: "name",
                    label: "Shop Name",
                    placeholder: "Enter shop name",
                    required: "",
                    onInput: onNameInput
                  }, null, _parent3, _scopeId2));
                  _push3(`<div${_scopeId2}><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]"${_scopeId2}>Slug</label><div class="flex gap-2 items-center"${_scopeId2}><div class="flex-1 flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text-muted)]"${_scopeId2}><span class="shrink-0 text-[var(--p-text-muted)]"${_scopeId2}>/</span><span${_scopeId2}>${ssrInterpolate(unref(slugPreview) || "auto-generated")}</span></div>`);
                  if (unref(isEdit)) {
                    _push3(ssrRenderComponent(_component_UButton, {
                      variant: "soft",
                      color: "neutral",
                      size: "sm",
                      icon: "i-lucide-refresh-cw",
                      "aria-label": "Regenerate slug",
                      onClick: regenerateSlug
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><p class="mt-1 text-xs text-[var(--p-text-muted)]"${_scopeId2}> URL-friendly identifier. Auto-generated from name. </p></div>`);
                  _push3(ssrRenderComponent(_component_FormsFormRichText, {
                    name: "description",
                    label: "Description",
                    placeholder: "Business description for the shop."
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="grid md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_FormsFormInput, {
                    name: "business_email",
                    label: "Email",
                    type: "email",
                    placeholder: "shop@example.com",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormsFormInput, {
                    name: "phone_number",
                    label: "Phone",
                    placeholder: "+254 700 000 000"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "name",
                        label: "Shop Name",
                        placeholder: "Enter shop name",
                        required: "",
                        onInput: onNameInput
                      }),
                      createVNode("div", null, [
                        createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Slug"),
                        createVNode("div", { class: "flex gap-2 items-center" }, [
                          createVNode("div", { class: "flex-1 flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text-muted)]" }, [
                            createVNode("span", { class: "shrink-0 text-[var(--p-text-muted)]" }, "/"),
                            createVNode("span", null, toDisplayString(unref(slugPreview) || "auto-generated"), 1)
                          ]),
                          unref(isEdit) ? (openBlock(), createBlock(_component_UButton, {
                            key: 0,
                            variant: "soft",
                            color: "neutral",
                            size: "sm",
                            icon: "i-lucide-refresh-cw",
                            "aria-label": "Regenerate slug",
                            onClick: regenerateSlug
                          })) : createCommentVNode("", true)
                        ]),
                        createVNode("p", { class: "mt-1 text-xs text-[var(--p-text-muted)]" }, " URL-friendly identifier. Auto-generated from name. ")
                      ]),
                      createVNode(_component_FormsFormRichText, {
                        name: "description",
                        label: "Description",
                        placeholder: "Business description for the shop."
                      }),
                      createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "business_email",
                          label: "Email",
                          type: "email",
                          placeholder: "shop@example.com",
                          required: ""
                        }),
                        createVNode(_component_FormsFormInput, {
                          name: "phone_number",
                          label: "Phone",
                          placeholder: "+254 700 000 000"
                        })
                      ])
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            if (unref(isEdit)) {
              _push2(ssrRenderComponent(_component_CommonSectionCard, { title: "Business hours defaults" }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p class="text-sm text-[var(--p-text-muted)] mb-4"${_scopeId2}> Default opening/closing times. Per-day hours are set under Business hours. </p><div class="grid md:grid-cols-3 gap-4"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_FormsFormInput, {
                      name: "opening_time",
                      label: "Opening time",
                      type: "time",
                      placeholder: "08:00",
                      helper: "Default opening time (e.g. 08:00). Used when no per-day override in OpeningHours."
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_FormsFormInput, {
                      name: "closing_time",
                      label: "Closing time",
                      type: "time",
                      placeholder: "18:00",
                      helper: "Default closing time (e.g. 18:00). Used when no per-day override in OpeningHours."
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_FormsFormInput, {
                      name: "closing_soon_minutes",
                      label: "Closing soon (minutes)",
                      type: "number",
                      min: "1",
                      max: "120",
                      placeholder: "30",
                      helper: "Minutes before closing to show 'Closing soon' status (e.g. 30)."
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("p", { class: "text-sm text-[var(--p-text-muted)] mb-4" }, " Default opening/closing times. Per-day hours are set under Business hours. "),
                      createVNode("div", { class: "grid md:grid-cols-3 gap-4" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "opening_time",
                          label: "Opening time",
                          type: "time",
                          placeholder: "08:00",
                          helper: "Default opening time (e.g. 08:00). Used when no per-day override in OpeningHours."
                        }),
                        createVNode(_component_FormsFormInput, {
                          name: "closing_time",
                          label: "Closing time",
                          type: "time",
                          placeholder: "18:00",
                          helper: "Default closing time (e.g. 18:00). Used when no per-day override in OpeningHours."
                        }),
                        createVNode(_component_FormsFormInput, {
                          name: "closing_soon_minutes",
                          label: "Closing soon (minutes)",
                          type: "number",
                          min: "1",
                          max: "120",
                          placeholder: "30",
                          helper: "Minutes before closing to show 'Closing soon' status (e.g. 30)."
                        })
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_CommonSectionCard, { title: "Location" }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p class="text-sm text-[var(--p-text-muted)] mb-4"${_scopeId2}> Search for a place to auto-fill address, city, and coordinates. You can edit fields manually. </p>`);
                  _push3(ssrRenderComponent(_component_AdminFormLocationPicker, {
                    "model-value": unref(locationModel),
                    onChange: onLocationChange
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="mt-4 grid md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_FormsFormInput, {
                    name: "zip_code",
                    label: "Postal Code",
                    placeholder: "12345",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("p", { class: "text-sm text-[var(--p-text-muted)] mb-4" }, " Search for a place to auto-fill address, city, and coordinates. You can edit fields manually. "),
                    createVNode(_component_AdminFormLocationPicker, {
                      "model-value": unref(locationModel),
                      onChange: onLocationChange
                    }, null, 8, ["model-value"]),
                    createVNode("div", { class: "mt-4 grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "zip_code",
                        label: "Postal Code",
                        placeholder: "12345",
                        required: ""
                      })
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`<div class="flex justify-end gap-3 pt-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "ghost",
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
                  _push3(`${ssrInterpolate(unref(isEdit) ? "Update Shop" : "Create Shop")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(isEdit) ? "Update Shop" : "Create Shop"), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                __props.error ? (openBlock(), createBlock(_component_UAlert, {
                  key: 0,
                  color: "error",
                  variant: "soft",
                  title: __props.error,
                  icon: "i-lucide-alert-circle",
                  class: "mb-4"
                }, null, 8, ["title"])) : createCommentVNode("", true),
                createVNode(_component_CommonSectionCard, { title: "Basic Information" }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "name",
                        label: "Shop Name",
                        placeholder: "Enter shop name",
                        required: "",
                        onInput: onNameInput
                      }),
                      createVNode("div", null, [
                        createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Slug"),
                        createVNode("div", { class: "flex gap-2 items-center" }, [
                          createVNode("div", { class: "flex-1 flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text-muted)]" }, [
                            createVNode("span", { class: "shrink-0 text-[var(--p-text-muted)]" }, "/"),
                            createVNode("span", null, toDisplayString(unref(slugPreview) || "auto-generated"), 1)
                          ]),
                          unref(isEdit) ? (openBlock(), createBlock(_component_UButton, {
                            key: 0,
                            variant: "soft",
                            color: "neutral",
                            size: "sm",
                            icon: "i-lucide-refresh-cw",
                            "aria-label": "Regenerate slug",
                            onClick: regenerateSlug
                          })) : createCommentVNode("", true)
                        ]),
                        createVNode("p", { class: "mt-1 text-xs text-[var(--p-text-muted)]" }, " URL-friendly identifier. Auto-generated from name. ")
                      ]),
                      createVNode(_component_FormsFormRichText, {
                        name: "description",
                        label: "Description",
                        placeholder: "Business description for the shop."
                      }),
                      createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "business_email",
                          label: "Email",
                          type: "email",
                          placeholder: "shop@example.com",
                          required: ""
                        }),
                        createVNode(_component_FormsFormInput, {
                          name: "phone_number",
                          label: "Phone",
                          placeholder: "+254 700 000 000"
                        })
                      ])
                    ])
                  ]),
                  _: 1
                }),
                unref(isEdit) ? (openBlock(), createBlock(_component_CommonSectionCard, {
                  key: 1,
                  title: "Business hours defaults"
                }, {
                  default: withCtx(() => [
                    createVNode("p", { class: "text-sm text-[var(--p-text-muted)] mb-4" }, " Default opening/closing times. Per-day hours are set under Business hours. "),
                    createVNode("div", { class: "grid md:grid-cols-3 gap-4" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "opening_time",
                        label: "Opening time",
                        type: "time",
                        placeholder: "08:00",
                        helper: "Default opening time (e.g. 08:00). Used when no per-day override in OpeningHours."
                      }),
                      createVNode(_component_FormsFormInput, {
                        name: "closing_time",
                        label: "Closing time",
                        type: "time",
                        placeholder: "18:00",
                        helper: "Default closing time (e.g. 18:00). Used when no per-day override in OpeningHours."
                      }),
                      createVNode(_component_FormsFormInput, {
                        name: "closing_soon_minutes",
                        label: "Closing soon (minutes)",
                        type: "number",
                        min: "1",
                        max: "120",
                        placeholder: "30",
                        helper: "Minutes before closing to show 'Closing soon' status (e.g. 30)."
                      })
                    ])
                  ]),
                  _: 1
                })) : createCommentVNode("", true),
                createVNode(_component_CommonSectionCard, { title: "Location" }, {
                  default: withCtx(() => [
                    createVNode("p", { class: "text-sm text-[var(--p-text-muted)] mb-4" }, " Search for a place to auto-fill address, city, and coordinates. You can edit fields manually. "),
                    createVNode(_component_AdminFormLocationPicker, {
                      "model-value": unref(locationModel),
                      onChange: onLocationChange
                    }, null, 8, ["model-value"]),
                    createVNode("div", { class: "mt-4 grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "zip_code",
                        label: "Postal Code",
                        placeholder: "12345",
                        required: ""
                      })
                    ])
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "flex justify-end gap-3 pt-2" }, [
                  createVNode(_component_UButton, {
                    variant: "ghost",
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
                      createTextVNode(toDisplayString(unref(isEdit) ? "Update Shop" : "Create Shop"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shops/ShopForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "ShopsShopForm" });

export { __nuxt_component_3 as _ };
//# sourceMappingURL=ShopForm-RN5_mIal.mjs.map
