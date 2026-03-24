import { _ as __nuxt_component_11, a as __nuxt_component_2 } from './FormSection-BF6FM0xo.mjs';
import { _ as _sfc_main$2 } from './Alert-CRX5veBl.mjs';
import { _ as _sfc_main$3 } from './Input-C16lzpZD.mjs';
import { _ as __nuxt_component_6 } from './FieldHint-ZRUlwJL3.mjs';
import { _ as __nuxt_component_4 } from './InlineError-CDgd_EMb.mjs';
import { _ as _sfc_main$4 } from './Textarea-CeohXmxE.mjs';
import { defineComponent, computed, reactive, watch, ref, mergeProps, withCtx, createVNode, unref, openBlock, createBlock, Fragment, renderList, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { d as _sfc_main$9, e as useRuntimeConfig } from './server.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-CX_axkrT.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/LocationPicker.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$1, { __name: "AdminLocationPicker" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ShopForm",
  __ssrInlineRender: true,
  props: {
    shop: {},
    loading: { type: Boolean },
    error: {},
    fieldErrors: {}
  },
  emits: ["submit", "cancel"],
  setup(__props, { emit: __emit }) {
    const KENYA_COUNTIES = [
      "Baringo",
      "Bomet",
      "Bungoma",
      "Busia",
      "Elgeyo-Marakwet",
      "Embu",
      "Garissa",
      "Homa Bay",
      "Isiolo",
      "Kajiado",
      "Kakamega",
      "Kericho",
      "Kiambu",
      "Kilifi",
      "Kirinyaga",
      "Kisii",
      "Kisumu",
      "Kitui",
      "Kwale",
      "Laikipia",
      "Lamu",
      "Machakos",
      "Makueni",
      "Mandera",
      "Marsabit",
      "Meru",
      "Migori",
      "Mombasa",
      "Murang’a",
      "Nairobi",
      "Nakuru",
      "Nandi",
      "Narok",
      "Nyamira",
      "Nyandarua",
      "Nyeri",
      "Samburu",
      "Siaya",
      "Taita-Taveta",
      "Tana River",
      "Tharaka-Nithi",
      "Trans Nzoia",
      "Turkana",
      "Uasin Gishu",
      "Vihiga",
      "Wajir",
      "West Pokot"
    ];
    const props = __props;
    const config = useRuntimeConfig();
    const isEdit = computed(() => Boolean(props.shop));
    const hasGoogleMaps = computed(() => Boolean(config.public.googleMapsApiKey));
    const form = reactive({
      name: props.shop?.name ?? "",
      description: props.shop?.description ?? "",
      business_email: props.shop?.business_email ?? "",
      phone_number: props.shop?.phone_number ?? "",
      state: props.shop?.state ?? "",
      city: props.shop?.city ?? "",
      address_line: props.shop?.address_line ?? "",
      landmark: "",
      zip_code: props.shop?.zip_code ?? "",
      country: props.shop?.country ?? "Kenya",
      latitude: props.shop?.latitude != null ? String(props.shop.latitude) : "",
      longitude: props.shop?.longitude != null ? String(props.shop.longitude) : "",
      google_place_id: ""
    });
    watch(() => props.shop, (shop) => {
      if (!shop) return;
      form.name = shop.name ?? "";
      form.description = shop.description ?? "";
      form.business_email = shop.business_email ?? "";
      form.phone_number = shop.phone_number ?? "";
      form.state = shop.state ?? "";
      form.city = shop.city ?? "";
      form.address_line = shop.address_line ?? "";
      form.zip_code = shop.zip_code ?? "";
      form.country = shop.country ?? "Kenya";
      form.latitude = shop.latitude != null ? String(shop.latitude) : "";
      form.longitude = shop.longitude != null ? String(shop.longitude) : "";
    }, { immediate: true });
    const touched = reactive({
      name: false,
      business_email: false,
      phone_number: false,
      state: false,
      city: false,
      address_line: false,
      zip_code: false
    });
    const submitAttempted = ref(false);
    const validations = computed(() => ({
      name: normalizedName.value ? null : "Enter the shop name.",
      business_email: !normalizedBusinessEmail.value ? "Enter a business email address." : /^\S+@\S+\.\S+$/.test(normalizedBusinessEmail.value) ? null : "Enter a valid email address.",
      phone_number: normalizedPhone.value ? null : "Enter a phone or WhatsApp number.",
      state: normalizedCounty.value ? null : "Enter the county.",
      city: normalizedArea.value ? null : "Enter the town, area, or estate.",
      address_line: normalizedStreet.value ? null : "Enter the street, building, or floor.",
      zip_code: normalizedPostalCode.value && !/^[A-Za-z0-9 -]{3,10}$/.test(normalizedPostalCode.value) ? "Postal code should be 3 to 10 letters, numbers, spaces, or hyphens." : null
    }));
    const missingFields = computed(() => {
      const items = [
        ["name", "Shop name"],
        ["business_email", "Business email"],
        ["phone_number", "Phone / WhatsApp"],
        ["state", "County"],
        ["city", "Town / Area"],
        ["address_line", "Street / Building"]
      ];
      return items.filter(([field]) => Boolean(validations.value[field])).map(([, label]) => label);
    });
    const canSubmit = computed(() => Object.values(validations.value).every((value) => !value));
    const submitReason = computed(() => {
      if (props.loading) return isEdit.value ? "Saving the shop details now." : "Creating the shop workspace now.";
      if (missingFields.value.length) return `Submit is disabled until these are valid: ${missingFields.value.join(", ")}.`;
      return isEdit.value ? "All required fields are valid. Saving will update this shop." : "All required fields are valid. Creating the shop will continue to setup.";
    });
    const submitMessage = computed(() => {
      if (!submitAttempted.value) return null;
      if (canSubmit.value) {
        return {
          color: "success",
          title: "Form is ready",
          description: isEdit.value ? "Required fields are valid. You can save the shop details now." : "Required fields are valid. You can create the shop now.",
          icon: "i-lucide-check-circle"
        };
      }
      return {
        color: "warning",
        title: "Some required fields still need attention",
        description: `Check: ${missingFields.value.join(", ")}.`,
        icon: "i-lucide-alert-triangle"
      };
    });
    const locationModel = computed(() => ({
      address_line: form.address_line,
      city: form.city,
      state: form.state,
      country: form.country,
      zip_code: form.zip_code,
      latitude: form.latitude,
      longitude: form.longitude,
      google_place_id: form.google_place_id
    }));
    const normalizedName = computed(() => form.name.trim());
    const normalizedBusinessEmail = computed(() => form.business_email.trim());
    const normalizedPhone = computed(() => form.phone_number.trim());
    const normalizedCounty = computed(() => form.state.trim());
    const normalizedArea = computed(() => form.city.trim());
    const normalizedStreet = computed(() => form.address_line.trim());
    computed(() => form.landmark.trim());
    const normalizedPostalCode = computed(() => form.zip_code.trim());
    function touchField(field) {
      touched[field] = true;
    }
    function fieldError(field) {
      const localError = !touched[field] && !submitAttempted.value ? null : validations.value[field];
      return localError || props.fieldErrors?.[field] || null;
    }
    function syncFromLocationPicker(value) {
      form.address_line = value.address_line;
      form.city = value.city;
      form.state = value.state;
      form.country = value.country || "Kenya";
      form.zip_code = value.zip_code ?? "";
      form.latitude = value.latitude;
      form.longitude = value.longitude;
      form.google_place_id = value.google_place_id;
      touchField("state");
      touchField("city");
      touchField("address_line");
      touchField("zip_code");
    }
    watch(form, () => {
      if (!submitAttempted.value) return;
      for (const key of Object.keys(touched)) {
        if (!touched[key]) continue;
        touched[key] = true;
      }
    }, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardInfoCard = __nuxt_component_11;
      const _component_UAlert = _sfc_main$2;
      const _component_DashboardFormSection = __nuxt_component_2;
      const _component_UInput = _sfc_main$3;
      const _component_DashboardFieldHint = __nuxt_component_6;
      const _component_DashboardInlineError = __nuxt_component_4;
      const _component_UTextarea = _sfc_main$4;
      const _component_AdminLocationPicker = __nuxt_component_7;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "Create a real Kenyan shop address",
        description: "Use the same county, area, street, and landmark language your customers, riders, and staff already use day to day.",
        icon: "i-lucide-map-pinned",
        tone: "orange"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm leading-6 text-slate-200/90"${_scopeId}> The shop form now only blocks submit on visible required fields. Postal code is optional and manual address entry always works. </p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm leading-6 text-slate-200/90" }, " The shop form now only blocks submit on visible required fields. Postal code is optional and manual address entry always works. ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(submitMessage)) {
        _push(ssrRenderComponent(_component_UAlert, {
          color: unref(submitMessage).color,
          variant: "soft",
          title: unref(submitMessage).title,
          description: unref(submitMessage).description,
          icon: unref(submitMessage).icon
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (__props.error) {
        _push(ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "soft",
          title: "We could not save this shop yet",
          description: __props.error,
          icon: "i-lucide-alert-circle"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Shop Basics",
        description: "Capture the business details customers actually use when they call, message, or visit the shop."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-5 md:grid-cols-2"${_scopeId}><div class="space-y-2 md:col-span-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Shop Name</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).name,
              "onUpdate:modelValue": ($event) => unref(form).name = $event,
              placeholder: "Print Hub Westlands",
              size: "xl",
              onBlur: ($event) => touchField("name")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Use the name already seen on signage, invoices, or WhatsApp." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("name")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Business Email</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).business_email,
              "onUpdate:modelValue": ($event) => unref(form).business_email = $event,
              type: "email",
              placeholder: "hello@printhub.co.ke",
              size: "xl",
              onBlur: ($event) => touchField("business_email")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Required for quote follow-up, order history, and admin ownership." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("business_email")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Phone / WhatsApp Number</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).phone_number,
              "onUpdate:modelValue": ($event) => unref(form).phone_number = $event,
              placeholder: "+254 712 345 678",
              size: "xl",
              onBlur: ($event) => touchField("phone_number")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Use the line customers actually call or WhatsApp for print jobs." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("phone_number")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2 md:col-span-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>About This Shop</label>`);
            _push2(ssrRenderComponent(_component_UTextarea, {
              modelValue: unref(form).description,
              "onUpdate:modelValue": ($event) => unref(form).description = $event,
              rows: 4,
              placeholder: "Commercial print shop handling flyers, brochures, branded stationery, and rush digital jobs for Nairobi clients."
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Optional. A short description helps your team identify what this branch focuses on." }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-5 md:grid-cols-2" }, [
                createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Shop Name"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).name,
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    placeholder: "Print Hub Westlands",
                    size: "xl",
                    onBlur: ($event) => touchField("name")
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                  createVNode(_component_DashboardFieldHint, { text: "Use the name already seen on signage, invoices, or WhatsApp." }),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("name")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Business Email"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).business_email,
                    "onUpdate:modelValue": ($event) => unref(form).business_email = $event,
                    type: "email",
                    placeholder: "hello@printhub.co.ke",
                    size: "xl",
                    onBlur: ($event) => touchField("business_email")
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                  createVNode(_component_DashboardFieldHint, { text: "Required for quote follow-up, order history, and admin ownership." }),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("business_email")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Phone / WhatsApp Number"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).phone_number,
                    "onUpdate:modelValue": ($event) => unref(form).phone_number = $event,
                    placeholder: "+254 712 345 678",
                    size: "xl",
                    onBlur: ($event) => touchField("phone_number")
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                  createVNode(_component_DashboardFieldHint, { text: "Use the line customers actually call or WhatsApp for print jobs." }),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("phone_number")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "About This Shop"),
                  createVNode(_component_UTextarea, {
                    modelValue: unref(form).description,
                    "onUpdate:modelValue": ($event) => unref(form).description = $event,
                    rows: 4,
                    placeholder: "Commercial print shop handling flyers, brochures, branded stationery, and rush digital jobs for Nairobi clients."
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Optional. A short description helps your team identify what this branch focuses on." })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Kenyan Address",
        description: "These fields use Kenyan address patterns and map to the existing backend address model."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(hasGoogleMaps)) {
              _push2(`<div class="space-y-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_DashboardInfoCard, {
                title: "Optional map search",
                description: "Search for a place to prefill the address, then review the fields before saving.",
                icon: "i-lucide-search",
                tone: "blue"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_AdminLocationPicker, {
                      "model-value": unref(locationModel),
                      "onUpdate:modelValue": syncFromLocationPicker
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_AdminLocationPicker, {
                        "model-value": unref(locationModel),
                        "onUpdate:modelValue": syncFromLocationPicker
                      }, null, 8, ["model-value"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(ssrRenderComponent(_component_DashboardInfoCard, {
                title: "Manual address mode is active",
                description: "Google Maps search is unavailable because NUXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing. Manual entry below is fully supported.",
                icon: "i-lucide-map"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p class="text-sm leading-6 text-slate-200/90"${_scopeId2}> You can still create the shop now. Add county, area, street/building, and an optional landmark or postal code. </p>`);
                  } else {
                    return [
                      createVNode("p", { class: "text-sm leading-6 text-slate-200/90" }, " You can still create the shop now. Add county, area, street/building, and an optional landmark or postal code. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(`<div class="grid gap-5 md:grid-cols-2"${_scopeId}><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>County</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).state,
              "onUpdate:modelValue": ($event) => unref(form).state = $event,
              list: "kenya-counties",
              placeholder: "Nairobi",
              size: "xl",
              onBlur: ($event) => touchField("state")
            }, null, _parent2, _scopeId));
            _push2(`<datalist id="kenya-counties"${_scopeId}><!--[-->`);
            ssrRenderList(KENYA_COUNTIES, (county) => {
              _push2(`<option${ssrRenderAttr("value", county)}${_scopeId}></option>`);
            });
            _push2(`<!--]--></datalist>`);
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "This is stored in the existing backend state field." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("state")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Town / Area / Estate</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).city,
              "onUpdate:modelValue": ($event) => unref(form).city = $event,
              placeholder: "Westlands, CBD, Nyali, Eldoret Town",
              size: "xl",
              onBlur: ($event) => touchField("city")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Enter the location wording a customer would say first." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("city")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2 md:col-span-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Street / Building / Floor</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).address_line,
              "onUpdate:modelValue": ($event) => unref(form).address_line = $event,
              placeholder: "Muthithi Road, Madonna House, 2nd Floor",
              size: "xl",
              onBlur: ($event) => touchField("address_line")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Required. Add the road, building, or floor that gets a first-time visitor there." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("address_line")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Landmark</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).landmark,
              "onUpdate:modelValue": ($event) => unref(form).landmark = $event,
              placeholder: "Opposite Sarit Centre parking entrance",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Optional, but useful for riders, drivers, and walk-ins." }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Postal Code</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).zip_code,
              "onUpdate:modelValue": ($event) => unref(form).zip_code = $event,
              placeholder: "00100",
              size: "xl",
              onBlur: ($event) => touchField("zip_code")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Optional. Leave blank if you do not use postal codes operationally." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("zip_code")
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              unref(hasGoogleMaps) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-4"
              }, [
                createVNode(_component_DashboardInfoCard, {
                  title: "Optional map search",
                  description: "Search for a place to prefill the address, then review the fields before saving.",
                  icon: "i-lucide-search",
                  tone: "blue"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_AdminLocationPicker, {
                      "model-value": unref(locationModel),
                      "onUpdate:modelValue": syncFromLocationPicker
                    }, null, 8, ["model-value"])
                  ]),
                  _: 1
                })
              ])) : (openBlock(), createBlock(_component_DashboardInfoCard, {
                key: 1,
                title: "Manual address mode is active",
                description: "Google Maps search is unavailable because NUXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing. Manual entry below is fully supported.",
                icon: "i-lucide-map"
              }, {
                default: withCtx(() => [
                  createVNode("p", { class: "text-sm leading-6 text-slate-200/90" }, " You can still create the shop now. Add county, area, street/building, and an optional landmark or postal code. ")
                ]),
                _: 1
              })),
              createVNode("div", { class: "grid gap-5 md:grid-cols-2" }, [
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "County"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).state,
                    "onUpdate:modelValue": ($event) => unref(form).state = $event,
                    list: "kenya-counties",
                    placeholder: "Nairobi",
                    size: "xl",
                    onBlur: ($event) => touchField("state")
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                  createVNode("datalist", { id: "kenya-counties" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(KENYA_COUNTIES, (county) => {
                      return createVNode("option", {
                        key: county,
                        value: county
                      }, null, 8, ["value"]);
                    }), 64))
                  ]),
                  createVNode(_component_DashboardFieldHint, { text: "This is stored in the existing backend state field." }),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("state")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Town / Area / Estate"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).city,
                    "onUpdate:modelValue": ($event) => unref(form).city = $event,
                    placeholder: "Westlands, CBD, Nyali, Eldoret Town",
                    size: "xl",
                    onBlur: ($event) => touchField("city")
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                  createVNode(_component_DashboardFieldHint, { text: "Enter the location wording a customer would say first." }),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("city")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Street / Building / Floor"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).address_line,
                    "onUpdate:modelValue": ($event) => unref(form).address_line = $event,
                    placeholder: "Muthithi Road, Madonna House, 2nd Floor",
                    size: "xl",
                    onBlur: ($event) => touchField("address_line")
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                  createVNode(_component_DashboardFieldHint, { text: "Required. Add the road, building, or floor that gets a first-time visitor there." }),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("address_line")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Landmark"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).landmark,
                    "onUpdate:modelValue": ($event) => unref(form).landmark = $event,
                    placeholder: "Opposite Sarit Centre parking entrance",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Optional, but useful for riders, drivers, and walk-ins." })
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Postal Code"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).zip_code,
                    "onUpdate:modelValue": ($event) => unref(form).zip_code = $event,
                    placeholder: "00100",
                    size: "xl",
                    onBlur: ($event) => touchField("zip_code")
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                  createVNode(_component_DashboardFieldHint, { text: "Optional. Leave blank if you do not use postal codes operationally." }),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("zip_code")
                  }, null, 8, ["message"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Ready To Submit",
        description: "The button only disables for required fields with validation issues."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"${_scopeId}><div class="rounded-[24px] border border-white/10 bg-slate-950/45 p-4"${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>Current form status</p><p class="mt-2 text-sm leading-6 text-slate-300"${_scopeId}>${ssrInterpolate(unref(submitReason))}</p></div><div class="${ssrRenderClass([unref(missingFields).length ? "border-orange-400/20 bg-orange-500/8" : "border-emerald-400/20 bg-emerald-500/8", "rounded-[24px] border p-4"])}"${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>${ssrInterpolate(unref(missingFields).length ? "Needs attention" : "Ready to create")}</p>`);
            if (unref(missingFields).length) {
              _push2(`<div class="mt-2 flex flex-wrap gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(unref(missingFields), (item) => {
                _push2(`<span class="inline-flex rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-100"${_scopeId}>${ssrInterpolate(item)}</span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<p class="mt-2 text-sm leading-6 text-emerald-100/90"${_scopeId}> Required fields are valid. Submit will create the shop workspace and continue to setup. </p>`);
            }
            _push2(`</div></div><div class="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between"${_scopeId}><p class="text-sm text-slate-400"${_scopeId}>${ssrInterpolate(unref(hasGoogleMaps) ? "Map search is optional." : "Manual address entry mode is active.")}</p><div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "ghost",
              color: "neutral",
              onClick: ($event) => _ctx.$emit("cancel")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardLoadingButton, {
              type: "submit",
              color: "primary",
              loading: __props.loading,
              disabled: !unref(canSubmit)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(isEdit) ? "Save Shop Details" : "Create Shop")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(isEdit) ? "Save Shop Details" : "Create Shop"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-4 lg:grid-cols-[1.2fr_0.8fr]" }, [
                createVNode("div", { class: "rounded-[24px] border border-white/10 bg-slate-950/45 p-4" }, [
                  createVNode("p", { class: "text-sm font-semibold text-white" }, "Current form status"),
                  createVNode("p", { class: "mt-2 text-sm leading-6 text-slate-300" }, toDisplayString(unref(submitReason)), 1)
                ]),
                createVNode("div", {
                  class: ["rounded-[24px] border p-4", unref(missingFields).length ? "border-orange-400/20 bg-orange-500/8" : "border-emerald-400/20 bg-emerald-500/8"]
                }, [
                  createVNode("p", { class: "text-sm font-semibold text-white" }, toDisplayString(unref(missingFields).length ? "Needs attention" : "Ready to create"), 1),
                  unref(missingFields).length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-2 flex flex-wrap gap-2"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(missingFields), (item) => {
                      return openBlock(), createBlock("span", {
                        key: item,
                        class: "inline-flex rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-100"
                      }, toDisplayString(item), 1);
                    }), 128))
                  ])) : (openBlock(), createBlock("p", {
                    key: 1,
                    class: "mt-2 text-sm leading-6 text-emerald-100/90"
                  }, " Required fields are valid. Submit will create the shop workspace and continue to setup. "))
                ], 2)
              ]),
              createVNode("div", { class: "flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between" }, [
                createVNode("p", { class: "text-sm text-slate-400" }, toDisplayString(unref(hasGoogleMaps) ? "Map search is optional." : "Manual address entry mode is active."), 1),
                createVNode("div", { class: "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end" }, [
                  createVNode(_component_UButton, {
                    variant: "ghost",
                    color: "neutral",
                    onClick: ($event) => _ctx.$emit("cancel")
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Cancel ")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_DashboardLoadingButton, {
                    type: "submit",
                    color: "primary",
                    loading: __props.loading,
                    disabled: !unref(canSubmit)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(isEdit) ? "Save Shop Details" : "Create Shop"), 1)
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
      _push(`</form>`);
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
//# sourceMappingURL=ShopForm-Cc9JKo7G.mjs.map
