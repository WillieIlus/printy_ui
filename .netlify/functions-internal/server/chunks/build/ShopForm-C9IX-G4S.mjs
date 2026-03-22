import { a as __nuxt_component_11, _ as __nuxt_component_2 } from './InfoCard-K1X9VF5P.mjs';
import { _ as _sfc_main$2 } from './Alert-RLPfncBZ.mjs';
import { _ as _sfc_main$3 } from './Input-DA2ySSK8.mjs';
import { _ as __nuxt_component_6 } from './FieldHint-ZRUlwJL3.mjs';
import { _ as __nuxt_component_4 } from './InlineError-DcBNAnP_.mjs';
import { _ as _sfc_main$4 } from './Textarea-D4hEpwmG.mjs';
import { defineComponent, computed, reactive, watch, mergeProps, withCtx, createVNode, unref, openBlock, createBlock, createTextVNode, toDisplayString, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { e as _sfc_main$9, f as useRuntimeConfig } from './server.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-CZOYt8xS.mjs';

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
    error: {}
  },
  emits: ["submit", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const config = useRuntimeConfig();
    const isEdit = computed(() => Boolean(props.shop));
    const hasGoogleMaps = computed(() => Boolean(config.public.googleMapsApiKey));
    const form = reactive({
      name: props.shop?.name ?? "",
      contact_person: "",
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
      contact_person: false,
      business_email: false,
      phone_number: false,
      state: false,
      city: false,
      address_line: false
    });
    const validations = computed(() => ({
      name: form.name.trim() ? null : "Shop name is required.",
      contact_person: null,
      business_email: !form.business_email.trim() ? "Email is required." : /\S+@\S+\.\S+/.test(form.business_email) ? null : "Enter a valid business email address.",
      phone_number: form.phone_number.trim() ? null : "Phone number is required.",
      state: form.state.trim() ? null : "County is required.",
      city: form.city.trim() ? null : "Town, area, or estate is required.",
      address_line: form.address_line.trim() ? null : "Street or building is required."
    }));
    const canSubmit = computed(() => Object.values(validations.value).every((value) => !value));
    const submitReason = computed(() => {
      if (props.loading) return isEdit.value ? "Saving shop details..." : "Creating the shop and preparing the next setup step...";
      const firstIssue = Object.values(validations.value).find(Boolean);
      if (firstIssue) return `Submit is disabled because: ${firstIssue}`;
      return isEdit.value ? "Everything required is filled in. Saving will update this shop without changing its route." : "Everything required is filled in. After creation, Printy will guide you to the next setup step.";
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
    function fieldError(field) {
      if (!touched[field]) return null;
      return validations.value[field];
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
    }
    watch(form, () => {
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
        title: "Why shop details matter",
        description: "Accurate shop details improve customer trust, delivery coordination, and how your business appears when buyers search by area.",
        icon: "i-lucide-map-pinned",
        tone: "orange"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm leading-6 text-slate-200/90"${_scopeId}> Use your real county, town, estate, and landmark so Printy can support walk-ins, dispatch planning, and clearer production ownership. </p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm leading-6 text-slate-200/90" }, " Use your real county, town, estate, and landmark so Printy can support walk-ins, dispatch planning, and clearer production ownership. ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.error) {
        _push(ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "soft",
          title: "We could not save this shop yet.",
          description: __props.error,
          icon: "i-lucide-alert-circle"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Shop Basics",
        description: "Start with the business details customers and staff rely on every day."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-5 md:grid-cols-2"${_scopeId}><div class="space-y-2 md:col-span-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Shop Name</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).name,
              "onUpdate:modelValue": ($event) => unref(form).name = $event,
              placeholder: "Kaskazini Solutions",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Use the name customers already know on invoices, signage, or WhatsApp." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("name")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Contact Person</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).contact_person,
              "onUpdate:modelValue": ($event) => unref(form).contact_person = $event,
              placeholder: "Amina Otieno",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Optional for now. Add the main contact your team uses for customer follow-up." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("contact_person")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Phone Number</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).phone_number,
              "onUpdate:modelValue": ($event) => unref(form).phone_number = $event,
              placeholder: "+254 712 345 678",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Use the number customers call for quotes or order follow-up." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("phone_number")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Email</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).business_email,
              "onUpdate:modelValue": ($event) => unref(form).business_email = $event,
              type: "email",
              placeholder: "hello@kaskazinisolutions.co.ke",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "A business inbox works best for quote approvals and order history." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("business_email")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>County</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).state,
              "onUpdate:modelValue": ($event) => unref(form).state = $event,
              placeholder: "Nairobi County",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "County is the clearest regional label for Kenya. It maps to the existing backend state field." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("state")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2 md:col-span-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>About This Shop</label>`);
            _push2(ssrRenderComponent(_component_UTextarea, {
              modelValue: unref(form).description,
              "onUpdate:modelValue": ($event) => unref(form).description = $event,
              rows: 4,
              placeholder: "Commercial print shop handling flyers, brochures, branded stationery, and rush digital jobs for Nairobi CBD clients."
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "A short description helps your team remember what this branch specializes in." }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-5 md:grid-cols-2" }, [
                createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Shop Name"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).name,
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    placeholder: "Kaskazini Solutions",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Use the name customers already know on invoices, signage, or WhatsApp." }),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("name")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Contact Person"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).contact_person,
                    "onUpdate:modelValue": ($event) => unref(form).contact_person = $event,
                    placeholder: "Amina Otieno",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Optional for now. Add the main contact your team uses for customer follow-up." }),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("contact_person")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Phone Number"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).phone_number,
                    "onUpdate:modelValue": ($event) => unref(form).phone_number = $event,
                    placeholder: "+254 712 345 678",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Use the number customers call for quotes or order follow-up." }),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("phone_number")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Email"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).business_email,
                    "onUpdate:modelValue": ($event) => unref(form).business_email = $event,
                    type: "email",
                    placeholder: "hello@kaskazinisolutions.co.ke",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "A business inbox works best for quote approvals and order history." }),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("business_email")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "County"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).state,
                    "onUpdate:modelValue": ($event) => unref(form).state = $event,
                    placeholder: "Nairobi County",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "County is the clearest regional label for Kenya. It maps to the existing backend state field." }),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("state")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "About This Shop"),
                  createVNode(_component_UTextarea, {
                    modelValue: unref(form).description,
                    "onUpdate:modelValue": ($event) => unref(form).description = $event,
                    rows: 4,
                    placeholder: "Commercial print shop handling flyers, brochures, branded stationery, and rush digital jobs for Nairobi CBD clients."
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "A short description helps your team remember what this branch specializes in." })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Address for Kenya",
        description: "Use county, area, and landmark language that matches how customers actually find your shop."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(hasGoogleMaps)) {
              _push2(ssrRenderComponent(_component_DashboardInfoCard, {
                title: "Optional map search",
                description: "Search for a place to fill in the address faster, then review the details before saving.",
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
            } else {
              _push2(ssrRenderComponent(_component_DashboardInfoCard, {
                title: "Map search is optional for now",
                description: "Map search is unavailable right now, but manual address entry still works. You can still create the shop and continue with setup.",
                icon: "i-lucide-map"
              }, null, _parent2, _scopeId));
            }
            _push2(`<div class="grid gap-5 md:grid-cols-2"${_scopeId}><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Town / Area / Estate</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).city,
              "onUpdate:modelValue": ($event) => unref(form).city = $event,
              placeholder: "Westlands, Kisumu CBD, Nyali, Eldoret Town",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Enter the town, estate, or area customers would mention first." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("city")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Street / Building</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).address_line,
              "onUpdate:modelValue": ($event) => unref(form).address_line = $event,
              placeholder: "Muthithi Road, Madonna House 2nd Floor",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Add the road, building, or floor that helps someone arrive without extra calls." }, null, _parent2, _scopeId));
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
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Optional, but useful for delivery riders and first-time walk-in customers." }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Postal Code</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).zip_code,
              "onUpdate:modelValue": ($event) => unref(form).zip_code = $event,
              placeholder: "00100",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Optional. Leave blank if you do not use postal codes in daily operations." }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              unref(hasGoogleMaps) ? (openBlock(), createBlock(_component_DashboardInfoCard, {
                key: 0,
                title: "Optional map search",
                description: "Search for a place to fill in the address faster, then review the details before saving.",
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
              })) : (openBlock(), createBlock(_component_DashboardInfoCard, {
                key: 1,
                title: "Map search is optional for now",
                description: "Map search is unavailable right now, but manual address entry still works. You can still create the shop and continue with setup.",
                icon: "i-lucide-map"
              })),
              createVNode("div", { class: "grid gap-5 md:grid-cols-2" }, [
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Town / Area / Estate"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).city,
                    "onUpdate:modelValue": ($event) => unref(form).city = $event,
                    placeholder: "Westlands, Kisumu CBD, Nyali, Eldoret Town",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Enter the town, estate, or area customers would mention first." }),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("city")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Street / Building"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).address_line,
                    "onUpdate:modelValue": ($event) => unref(form).address_line = $event,
                    placeholder: "Muthithi Road, Madonna House 2nd Floor",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Add the road, building, or floor that helps someone arrive without extra calls." }),
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
                  createVNode(_component_DashboardFieldHint, { text: "Optional, but useful for delivery riders and first-time walk-in customers." })
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Postal Code"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).zip_code,
                    "onUpdate:modelValue": ($event) => unref(form).zip_code = $event,
                    placeholder: "00100",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Optional. Leave blank if you do not use postal codes in daily operations." })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Submission Status",
        description: "Before you save, Printy checks the minimum details needed to create a reliable shop workspace."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="rounded-2xl border border-white/10 bg-slate-950/45 p-4"${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>Ready to save?</p><p class="mt-2 text-sm leading-6 text-slate-300"${_scopeId}>${ssrInterpolate(unref(submitReason))}</p></div><div class="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end"${_scopeId}>`);
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
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "rounded-2xl border border-white/10 bg-slate-950/45 p-4" }, [
                createVNode("p", { class: "text-sm font-semibold text-white" }, "Ready to save?"),
                createVNode("p", { class: "mt-2 text-sm leading-6 text-slate-300" }, toDisplayString(unref(submitReason)), 1)
              ]),
              createVNode("div", { class: "flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end" }, [
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
//# sourceMappingURL=ShopForm-C9IX-G4S.mjs.map
