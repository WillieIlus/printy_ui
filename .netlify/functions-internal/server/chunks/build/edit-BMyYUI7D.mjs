import { _ as __nuxt_component_0 } from './DashboardPageHeader-2WLhb5mv.mjs';
import { c as useAuthStore, d as _sfc_main$9, n as navigateTo, a as _sfc_main$f } from './server.mjs';
import { a as __nuxt_component_2, _ as __nuxt_component_11 } from './FormSection-BF6FM0xo.mjs';
import { _ as _sfc_main$4 } from './Alert-CI_a20A7.mjs';
import { F as Form, _ as __nuxt_component_2$1, a as Field } from './FormInput-opqohhBW.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, createVNode, unref, openBlock, createBlock, createCommentVNode, reactive, watch, isRef, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _sfc_main$5 } from './SelectMenu-C6Eyp_GI.mjs';
import { f as formLabelClass, e as dashboardSelectUi, h as dashboardMutedPanelClass, g as dashboardInputUi, i as nativeTextareaClass, b as formHelperClass, c as formErrorClass } from './formUi-UcrM_3uE.mjs';
import { _ as _sfc_main$6 } from './Input-C14QBOm-.mjs';
import { object, string } from 'yup';
import { a as normalizeOptionalText } from './payload-B09QCjlG.mjs';
import { u as useNotification } from './useNotification-B7Z2gs_7.mjs';
import { u as useProfileStore } from './profile-BrbBxAQk.mjs';
import { u as useUserStore } from './user-yk0wG_HM.mjs';
import '../_/nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
import 'devalue';
import 'consola';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'vue-bundle-renderer/runtime';
import '@iconify/utils';
import 'node:crypto';
import 'fast-xml-parser';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';
import 'pinia';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

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
const __nuxt_component_1 = Object.assign(_sfc_main$3, { __name: "CommonSectionCard" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/forms/FormTextarea.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_4$1 = Object.assign(_sfc_main$2, { __name: "FormsFormTextarea" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ProfileEditForm",
  __ssrInlineRender: true,
  props: {
    profile: {},
    user: {},
    loading: { type: Boolean }
  },
  emits: ["submit", "cancel"],
  setup(__props, { emit: __emit }) {
    const SOCIAL_PLATFORMS = [
      { value: "facebook", label: "Facebook", icon: "i-simple-icons-facebook" },
      { value: "twitter", label: "X (Twitter)", icon: "i-simple-icons-x" },
      { value: "instagram", label: "Instagram", icon: "i-simple-icons-instagram" },
      { value: "linkedin", label: "LinkedIn", icon: "i-simple-icons-linkedin" },
      { value: "youtube", label: "YouTube", icon: "i-simple-icons-youtube" },
      { value: "tiktok", label: "TikTok", icon: "i-simple-icons-tiktok" },
      { value: "pinterest", label: "Pinterest", icon: "i-simple-icons-pinterest" },
      { value: "website", label: "Website", icon: "i-lucide-globe" }
    ];
    const props = __props;
    const emit = __emit;
    const roleOptions = [
      { label: "Client", value: "client" },
      { label: "Shop owner", value: "shop_owner" },
      { label: "Staff", value: "staff" }
    ];
    const schema = object({
      first_name: string(),
      last_name: string(),
      phone: string(),
      bio: string(),
      address: string(),
      city: string(),
      state: string(),
      country: string(),
      postal_code: string()
    });
    const socialLinks = reactive([]);
    const selectedRole = ref("client");
    const initialValues = computed(() => ({
      first_name: props.user?.first_name ?? "",
      last_name: props.user?.last_name ?? "",
      phone: props.profile?.phone ?? "",
      bio: props.profile?.bio ?? "",
      address: props.profile?.address ?? "",
      city: props.profile?.city ?? "",
      state: props.profile?.state ?? "",
      country: props.profile?.country ?? "",
      postal_code: props.profile?.postal_code ?? ""
    }));
    watch(
      () => props.profile?.social_links,
      (links) => {
        if (links?.length) {
          socialLinks.splice(0, socialLinks.length, ...links.map((l) => ({ platform: l.platform, url: l.url })));
        } else {
          socialLinks.splice(0, socialLinks.length);
        }
      },
      { immediate: true }
    );
    watch(
      () => props.user?.role,
      (role) => {
        if (role === "PRINTER") {
          selectedRole.value = "shop_owner";
          return;
        }
        if (role === "staff") {
          selectedRole.value = "staff";
          return;
        }
        selectedRole.value = role === "shop_owner" ? "shop_owner" : "client";
      },
      { immediate: true }
    );
    function addSocialLink() {
      socialLinks.push({ platform: "website", url: "" });
    }
    function removeSocialLink(index) {
      socialLinks.splice(index, 1);
    }
    function updateSocialLinkPlatform(index, platform) {
      socialLinks[index].platform = platform;
    }
    function updateSocialLinkUrl(index, url) {
      socialLinks[index].url = url;
    }
    function onSubmit(values) {
      const payload = {
        first_name: normalizeOptionalText(values.first_name) ?? "",
        last_name: normalizeOptionalText(values.last_name) ?? "",
        role: selectedRole.value,
        phone: normalizeOptionalText(values.phone) ?? "",
        bio: normalizeOptionalText(values.bio) ?? "",
        address: normalizeOptionalText(values.address) ?? "",
        city: normalizeOptionalText(values.city) ?? "",
        state: normalizeOptionalText(values.state) ?? "",
        country: normalizeOptionalText(values.country) ?? "",
        postal_code: normalizeOptionalText(values.postal_code) ?? "",
        social_links: socialLinks.map((link) => ({ platform: link.platform, url: normalizeOptionalText(link.url) ?? "" })).filter((link) => link.url)
      };
      emit("submit", payload);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_CommonSectionCard = __nuxt_component_1;
      const _component_FormsFormInput = __nuxt_component_2$1;
      const _component_USelectMenu = _sfc_main$5;
      const _component_FormsFormTextarea = __nuxt_component_4$1;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_UInput = _sfc_main$6;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(schema),
        "initial-values": unref(initialValues),
        onSubmit
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CommonSectionCard, {
              title: "Personal Information",
              description: "Your name and contact details."
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-4"${_scopeId2}><div class="grid grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_FormsFormInput, {
                    name: "first_name",
                    label: "First name",
                    placeholder: "First name"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormsFormInput, {
                    name: "last_name",
                    label: "Last name",
                    placeholder: "Last name"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div${_scopeId2}><label class="${ssrRenderClass(unref(formLabelClass))}"${_scopeId2}>Business Role</label>`);
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(selectedRole),
                    "onUpdate:modelValue": ($event) => isRef(selectedRole) ? selectedRole.value = $event : null,
                    items: roleOptions,
                    "value-key": "value",
                    "label-key": "label",
                    class: "w-full",
                    ui: unref(dashboardSelectUi)
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_FormsFormInput, {
                    name: "phone",
                    label: "Phone",
                    placeholder: "+254 700 000 000"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormsFormTextarea, {
                    name: "bio",
                    label: "Bio",
                    placeholder: "Short bio...",
                    rows: 3
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "first_name",
                          label: "First name",
                          placeholder: "First name"
                        }),
                        createVNode(_component_FormsFormInput, {
                          name: "last_name",
                          label: "Last name",
                          placeholder: "Last name"
                        })
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: unref(formLabelClass) }, "Business Role", 2),
                        createVNode(_component_USelectMenu, {
                          modelValue: unref(selectedRole),
                          "onUpdate:modelValue": ($event) => isRef(selectedRole) ? selectedRole.value = $event : null,
                          items: roleOptions,
                          "value-key": "value",
                          "label-key": "label",
                          class: "w-full",
                          ui: unref(dashboardSelectUi)
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                      ]),
                      createVNode(_component_FormsFormInput, {
                        name: "phone",
                        label: "Phone",
                        placeholder: "+254 700 000 000"
                      }),
                      createVNode(_component_FormsFormTextarea, {
                        name: "bio",
                        label: "Bio",
                        placeholder: "Short bio...",
                        rows: 3
                      })
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CommonSectionCard, {
              title: "Address",
              description: "Your postal address."
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_FormsFormInput, {
                    name: "address",
                    label: "Address",
                    placeholder: "Street address"
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="grid grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_FormsFormInput, {
                    name: "city",
                    label: "City",
                    placeholder: "City"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormsFormInput, {
                    name: "state",
                    label: "State",
                    placeholder: "State"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="grid grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_FormsFormInput, {
                    name: "country",
                    label: "Country",
                    placeholder: "Country"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormsFormInput, {
                    name: "postal_code",
                    label: "Postal code",
                    placeholder: "12345"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "address",
                        label: "Address",
                        placeholder: "Street address"
                      }),
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "city",
                          label: "City",
                          placeholder: "City"
                        }),
                        createVNode(_component_FormsFormInput, {
                          name: "state",
                          label: "State",
                          placeholder: "State"
                        })
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "country",
                          label: "Country",
                          placeholder: "Country"
                        }),
                        createVNode(_component_FormsFormInput, {
                          name: "postal_code",
                          label: "Postal code",
                          placeholder: "12345"
                        })
                      ])
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CommonSectionCard, {
              title: "Social Links",
              description: "Add links to your social profiles and website."
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-3"${_scopeId2}><!--[-->`);
                  ssrRenderList(socialLinks, (link, index) => {
                    _push3(`<div class="${ssrRenderClass(`flex flex-col gap-3 p-4 ${unref(dashboardMutedPanelClass)}`)}"${_scopeId2}><div class="flex items-center gap-2"${_scopeId2}><span class="text-sm font-medium text-[var(--p-text-muted)]"${_scopeId2}>Link ${ssrInterpolate(index + 1)}</span>`);
                    if (socialLinks.length > 1) {
                      _push3(ssrRenderComponent(_component_UButton, {
                        type: "button",
                        variant: "soft",
                        color: "error",
                        size: "xs",
                        icon: "i-lucide-trash-2",
                        "aria-label": "Remove link",
                        onClick: ($event) => removeSocialLink(index)
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div><div class="flex flex-wrap gap-3"${_scopeId2}><!--[-->`);
                    ssrRenderList(SOCIAL_PLATFORMS, (platform) => {
                      _push3(`<label class="${ssrRenderClass([link.platform === platform.value ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30" : "border-[var(--p-border)] hover:border-[var(--p-text-muted)]", "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors"])}"${_scopeId2}><input type="radio"${ssrRenderAttr("name", `social-platform-${index}`)}${ssrRenderAttr("value", platform.value)}${ssrIncludeBooleanAttr(link.platform === platform.value) ? " checked" : ""} class="sr-only"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_UIcon, {
                        name: platform.icon,
                        class: "h-5 w-5 text-[var(--p-text-muted)]"
                      }, null, _parent3, _scopeId2));
                      _push3(`<span class="text-sm font-medium text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(platform.label)}</span></label>`);
                    });
                    _push3(`<!--]--></div><div${_scopeId2}><label class="${ssrRenderClass(unref(formLabelClass))}"${_scopeId2}>URL</label>`);
                    _push3(ssrRenderComponent(_component_UInput, {
                      "model-value": link.url,
                      placeholder: "https://...",
                      class: "w-full",
                      ui: unref(dashboardInputUi),
                      "onUpdate:modelValue": (v) => updateSocialLinkUrl(index, v)
                    }, null, _parent3, _scopeId2));
                    _push3(`</div></div>`);
                  });
                  _push3(`<!--]-->`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "button",
                    variant: "soft",
                    color: "neutral",
                    size: "sm",
                    icon: "i-lucide-plus",
                    onClick: addSocialLink
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Add social link `);
                      } else {
                        return [
                          createTextVNode(" Add social link ")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(socialLinks, (link, index) => {
                        return openBlock(), createBlock("div", {
                          key: index,
                          class: `flex flex-col gap-3 p-4 ${unref(dashboardMutedPanelClass)}`
                        }, [
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("span", { class: "text-sm font-medium text-[var(--p-text-muted)]" }, "Link " + toDisplayString(index + 1), 1),
                            socialLinks.length > 1 ? (openBlock(), createBlock(_component_UButton, {
                              key: 0,
                              type: "button",
                              variant: "soft",
                              color: "error",
                              size: "xs",
                              icon: "i-lucide-trash-2",
                              "aria-label": "Remove link",
                              onClick: ($event) => removeSocialLink(index)
                            }, null, 8, ["onClick"])) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "flex flex-wrap gap-3" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(SOCIAL_PLATFORMS, (platform) => {
                              return createVNode("label", {
                                key: platform.value,
                                class: ["flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors", link.platform === platform.value ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30" : "border-[var(--p-border)] hover:border-[var(--p-text-muted)]"]
                              }, [
                                createVNode("input", {
                                  type: "radio",
                                  name: `social-platform-${index}`,
                                  value: platform.value,
                                  checked: link.platform === platform.value,
                                  class: "sr-only",
                                  onChange: ($event) => updateSocialLinkPlatform(index, platform.value)
                                }, null, 40, ["name", "value", "checked", "onChange"]),
                                createVNode(_component_UIcon, {
                                  name: platform.icon,
                                  class: "h-5 w-5 text-[var(--p-text-muted)]"
                                }, null, 8, ["name"]),
                                createVNode("span", { class: "text-sm font-medium text-[var(--p-text)]" }, toDisplayString(platform.label), 1)
                              ], 2);
                            }), 64))
                          ]),
                          createVNode("div", null, [
                            createVNode("label", { class: unref(formLabelClass) }, "URL", 2),
                            createVNode(_component_UInput, {
                              "model-value": link.url,
                              placeholder: "https://...",
                              class: "w-full",
                              ui: unref(dashboardInputUi),
                              "onUpdate:modelValue": (v) => updateSocialLinkUrl(index, v)
                            }, null, 8, ["model-value", "ui", "onUpdate:modelValue"])
                          ])
                        ], 2);
                      }), 128)),
                      createVNode(_component_UButton, {
                        type: "button",
                        variant: "soft",
                        color: "neutral",
                        size: "sm",
                        icon: "i-lucide-plus",
                        onClick: addSocialLink
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Add social link ")
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`<div class="flex justify-end gap-3 pt-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              type: "button",
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
              createVNode("div", { class: "space-y-6" }, [
                createVNode(_component_CommonSectionCard, {
                  title: "Personal Information",
                  description: "Your name and contact details."
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "first_name",
                          label: "First name",
                          placeholder: "First name"
                        }),
                        createVNode(_component_FormsFormInput, {
                          name: "last_name",
                          label: "Last name",
                          placeholder: "Last name"
                        })
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: unref(formLabelClass) }, "Business Role", 2),
                        createVNode(_component_USelectMenu, {
                          modelValue: unref(selectedRole),
                          "onUpdate:modelValue": ($event) => isRef(selectedRole) ? selectedRole.value = $event : null,
                          items: roleOptions,
                          "value-key": "value",
                          "label-key": "label",
                          class: "w-full",
                          ui: unref(dashboardSelectUi)
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                      ]),
                      createVNode(_component_FormsFormInput, {
                        name: "phone",
                        label: "Phone",
                        placeholder: "+254 700 000 000"
                      }),
                      createVNode(_component_FormsFormTextarea, {
                        name: "bio",
                        label: "Bio",
                        placeholder: "Short bio...",
                        rows: 3
                      })
                    ])
                  ]),
                  _: 1
                }),
                createVNode(_component_CommonSectionCard, {
                  title: "Address",
                  description: "Your postal address."
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "address",
                        label: "Address",
                        placeholder: "Street address"
                      }),
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "city",
                          label: "City",
                          placeholder: "City"
                        }),
                        createVNode(_component_FormsFormInput, {
                          name: "state",
                          label: "State",
                          placeholder: "State"
                        })
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "country",
                          label: "Country",
                          placeholder: "Country"
                        }),
                        createVNode(_component_FormsFormInput, {
                          name: "postal_code",
                          label: "Postal code",
                          placeholder: "12345"
                        })
                      ])
                    ])
                  ]),
                  _: 1
                }),
                createVNode(_component_CommonSectionCard, {
                  title: "Social Links",
                  description: "Add links to your social profiles and website."
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "space-y-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(socialLinks, (link, index) => {
                        return openBlock(), createBlock("div", {
                          key: index,
                          class: `flex flex-col gap-3 p-4 ${unref(dashboardMutedPanelClass)}`
                        }, [
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("span", { class: "text-sm font-medium text-[var(--p-text-muted)]" }, "Link " + toDisplayString(index + 1), 1),
                            socialLinks.length > 1 ? (openBlock(), createBlock(_component_UButton, {
                              key: 0,
                              type: "button",
                              variant: "soft",
                              color: "error",
                              size: "xs",
                              icon: "i-lucide-trash-2",
                              "aria-label": "Remove link",
                              onClick: ($event) => removeSocialLink(index)
                            }, null, 8, ["onClick"])) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "flex flex-wrap gap-3" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(SOCIAL_PLATFORMS, (platform) => {
                              return createVNode("label", {
                                key: platform.value,
                                class: ["flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors", link.platform === platform.value ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30" : "border-[var(--p-border)] hover:border-[var(--p-text-muted)]"]
                              }, [
                                createVNode("input", {
                                  type: "radio",
                                  name: `social-platform-${index}`,
                                  value: platform.value,
                                  checked: link.platform === platform.value,
                                  class: "sr-only",
                                  onChange: ($event) => updateSocialLinkPlatform(index, platform.value)
                                }, null, 40, ["name", "value", "checked", "onChange"]),
                                createVNode(_component_UIcon, {
                                  name: platform.icon,
                                  class: "h-5 w-5 text-[var(--p-text-muted)]"
                                }, null, 8, ["name"]),
                                createVNode("span", { class: "text-sm font-medium text-[var(--p-text)]" }, toDisplayString(platform.label), 1)
                              ], 2);
                            }), 64))
                          ]),
                          createVNode("div", null, [
                            createVNode("label", { class: unref(formLabelClass) }, "URL", 2),
                            createVNode(_component_UInput, {
                              "model-value": link.url,
                              placeholder: "https://...",
                              class: "w-full",
                              ui: unref(dashboardInputUi),
                              "onUpdate:modelValue": (v) => updateSocialLinkUrl(index, v)
                            }, null, 8, ["model-value", "ui", "onUpdate:modelValue"])
                          ])
                        ], 2);
                      }), 128)),
                      createVNode(_component_UButton, {
                        type: "button",
                        variant: "soft",
                        color: "neutral",
                        size: "sm",
                        icon: "i-lucide-plus",
                        onClick: addSocialLink
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Add social link ")
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "flex justify-end gap-3 pt-2" }, [
                  createVNode(_component_UButton, {
                    type: "button",
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/ProfileEditForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$1, { __name: "ProfileEditForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const notification = useNotification();
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const userStore = useUserStore();
    const saving = ref(false);
    const saveError = ref("");
    const saveSuccess = ref("");
    const loading = computed(() => !authStore.user || profileStore.loading);
    function buildFullName(payload) {
      if (payload.name?.trim()) return payload.name.trim();
      return [payload.first_name?.trim(), payload.last_name?.trim()].filter(Boolean).join(" ").trim();
    }
    async function saveProfile(payload) {
      saveError.value = "";
      saveSuccess.value = "";
      saving.value = true;
      try {
        const result = await userStore.updateMe({
          ...payload,
          name: buildFullName(payload)
        });
        if (!result.success) {
          saveError.value = result.error ?? "Profile update failed.";
          return;
        }
        await Promise.all([authStore.fetchMe(), profileStore.fetchProfile()]);
        saveSuccess.value = "Your profile details were saved successfully.";
        notification.success("Profile updated successfully.");
        await navigateTo("/dashboard/profile");
      } catch (error) {
        saveError.value = error instanceof Error ? error.message : "Profile update failed.";
      } finally {
        saving.value = false;
      }
    }
    async function goBack() {
      await navigateTo("/dashboard/profile");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardFormSection = __nuxt_component_2;
      const _component_UAlert = _sfc_main$4;
      const _component_ProfileEditForm = __nuxt_component_4;
      const _component_DashboardInfoCard = __nuxt_component_11;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Edit Profile",
        subtitle: "Save only the account fields the current backend supports, with one deliberate form and clear feedback."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              onClick: goBack
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back to Profile`);
                } else {
                  return [
                    createTextVNode("Back to Profile")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                variant: "soft",
                onClick: goBack
              }, {
                default: withCtx(() => [
                  createTextVNode("Back to Profile")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid gap-6 xl:grid-cols-[1.2fr_0.85fr]">`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Profile Details",
        description: "Name, role, language, phone, address, bio, and social links are supported here. Unsupported account features stay clearly out of the save flow."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(saveSuccess)) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "success",
                variant: "soft",
                title: "Profile updated",
                description: unref(saveSuccess),
                icon: "i-lucide-check-circle"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(saveError)) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "soft",
                title: "Profile update failed",
                description: unref(saveError),
                icon: "i-lucide-alert-circle"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_ProfileEditForm, {
              profile: unref(profileStore).profile,
              user: unref(authStore).user,
              loading: unref(saving) || unref(loading),
              onSubmit: saveProfile,
              onCancel: goBack
            }, null, _parent2, _scopeId));
          } else {
            return [
              unref(saveSuccess) ? (openBlock(), createBlock(_component_UAlert, {
                key: 0,
                color: "success",
                variant: "soft",
                title: "Profile updated",
                description: unref(saveSuccess),
                icon: "i-lucide-check-circle"
              }, null, 8, ["description"])) : createCommentVNode("", true),
              unref(saveError) ? (openBlock(), createBlock(_component_UAlert, {
                key: 1,
                color: "error",
                variant: "soft",
                title: "Profile update failed",
                description: unref(saveError),
                icon: "i-lucide-alert-circle"
              }, null, 8, ["description"])) : createCommentVNode("", true),
              createVNode(_component_ProfileEditForm, {
                profile: unref(profileStore).profile,
                user: unref(authStore).user,
                loading: unref(saving) || unref(loading),
                onSubmit: saveProfile,
                onCancel: goBack
              }, null, 8, ["profile", "user", "loading"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="space-y-6">`);
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "Supported On This Screen",
        description: "Full name, language, role, phone, bio, address, and social links are saved through the current user/profile API.",
        icon: "i-lucide-check-check",
        tone: "blue"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "Intentionally Unavailable",
        description: "Avatar upload, password change, and advanced account preferences are not exposed here yet, so this screen does not pretend to save them.",
        icon: "i-lucide-server-off",
        tone: "orange"
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/profile/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit-BMyYUI7D.mjs.map
