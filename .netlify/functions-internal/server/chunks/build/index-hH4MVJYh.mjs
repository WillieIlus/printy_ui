import { _ as __nuxt_component_0 } from './DashboardPageHeader-DY_0uFAc.mjs';
import { d as useAuthStore, e as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_2, a as __nuxt_component_11 } from './InfoCard-K1X9VF5P.mjs';
import { _ as _sfc_main$1 } from './Alert-RLPfncBZ.mjs';
import { _ as _sfc_main$2 } from './Input-DA2ySSK8.mjs';
import { _ as __nuxt_component_6 } from './FieldHint-ZRUlwJL3.mjs';
import { _ as _sfc_main$3 } from './SelectMenu-DTjoEp_W.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-CZOYt8xS.mjs';
import { defineComponent, ref, computed, watch, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, isRef, openBlock, createBlock, createCommentVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useNotification } from './useNotification-DukejKDK.mjs';
import { u as useUserStore } from './user-D3RfXDnA.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const notification = useNotification();
    const authStore = useAuthStore();
    const userStore = useUserStore();
    const saving = ref(false);
    const saveError = ref("");
    const editableName = ref("");
    const preferredLanguage = ref("en");
    const languageOptions = [
      { label: "English", value: "en" },
      { label: "Swahili", value: "sw" }
    ];
    const displayName = computed(() => authStore.user?.name?.trim() || "Printy User");
    const initials = computed(() => displayName.value.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "PU");
    const preferredLanguageLabel = computed(() => preferredLanguage.value === "sw" ? "Swahili" : "English");
    watch(() => authStore.user, (user) => {
      editableName.value = user?.name?.trim() || "";
      preferredLanguage.value = user?.preferred_language || "en";
    }, { immediate: true });
    async function saveProfile() {
      saveError.value = "";
      saving.value = true;
      try {
        const result = await userStore.updateMe({
          name: editableName.value.trim(),
          preferred_language: preferredLanguage.value
        });
        if (!result.success) {
          saveError.value = result.error ?? "Profile update failed.";
          return;
        }
        await authStore.fetchMe();
        notification.success("Profile updated successfully.");
      } catch (error) {
        saveError.value = error instanceof Error ? error.message : "Profile update failed.";
      } finally {
        saving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_DashboardFormSection = __nuxt_component_2;
      const _component_UAlert = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_DashboardFieldHint = __nuxt_component_6;
      const _component_USelectMenu = _sfc_main$3;
      const _component_DashboardInfoCard = __nuxt_component_11;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Profile",
        subtitle: "Manage the account details Printy can save today, and see which richer profile fields still need backend support."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/dashboard/profile/edit",
              variant: "soft"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-pencil",
                    class: "mr-2 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` Edit Profile `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-pencil",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Edit Profile ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: "/dashboard/profile/edit",
                variant: "soft"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-pencil",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Edit Profile ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid gap-6 xl:grid-cols-[0.95fr_1.2fr]">`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Account Summary",
        description: "A cleaner profile surface for daily dashboard use."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-start gap-4 rounded-[26px] border border-white/10 bg-white/5 p-5"${_scopeId}><div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-orange-400/25 bg-orange-500/12 text-xl font-semibold text-orange-100"${_scopeId}>${ssrInterpolate(unref(initials))}</div><div class="min-w-0"${_scopeId}><p class="text-xl font-semibold text-white"${_scopeId}>${ssrInterpolate(unref(displayName))}</p><p class="mt-1 text-sm text-slate-300"${_scopeId}>${ssrInterpolate(unref(authStore).user?.email ?? "No email available")}</p><p class="mt-3 text-sm leading-6 text-slate-300"${_scopeId}> Use this page for the account details the current API supports reliably today. </p></div></div><div class="grid gap-3 md:grid-cols-2"${_scopeId}><div class="rounded-2xl border border-white/10 bg-white/5 p-4"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-slate-500"${_scopeId}>Full Name</p><p class="mt-2 text-sm font-semibold text-white"${_scopeId}>${ssrInterpolate(unref(displayName))}</p></div><div class="rounded-2xl border border-white/10 bg-white/5 p-4"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-slate-500"${_scopeId}>Preferred Language</p><p class="mt-2 text-sm font-semibold text-white"${_scopeId}>${ssrInterpolate(unref(preferredLanguageLabel))}</p></div><div class="rounded-2xl border border-white/10 bg-white/5 p-4"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-slate-500"${_scopeId}>Phone</p><p class="mt-2 text-sm font-semibold text-slate-300"${_scopeId}>Backend support still needed</p></div><div class="rounded-2xl border border-white/10 bg-white/5 p-4"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-slate-500"${_scopeId}>Business Role</p><p class="mt-2 text-sm font-semibold text-slate-300"${_scopeId}>Backend support still needed</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-start gap-4 rounded-[26px] border border-white/10 bg-white/5 p-5" }, [
                createVNode("div", { class: "flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-orange-400/25 bg-orange-500/12 text-xl font-semibold text-orange-100" }, toDisplayString(unref(initials)), 1),
                createVNode("div", { class: "min-w-0" }, [
                  createVNode("p", { class: "text-xl font-semibold text-white" }, toDisplayString(unref(displayName)), 1),
                  createVNode("p", { class: "mt-1 text-sm text-slate-300" }, toDisplayString(unref(authStore).user?.email ?? "No email available"), 1),
                  createVNode("p", { class: "mt-3 text-sm leading-6 text-slate-300" }, " Use this page for the account details the current API supports reliably today. ")
                ])
              ]),
              createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                createVNode("div", { class: "rounded-2xl border border-white/10 bg-white/5 p-4" }, [
                  createVNode("p", { class: "text-xs uppercase tracking-[0.24em] text-slate-500" }, "Full Name"),
                  createVNode("p", { class: "mt-2 text-sm font-semibold text-white" }, toDisplayString(unref(displayName)), 1)
                ]),
                createVNode("div", { class: "rounded-2xl border border-white/10 bg-white/5 p-4" }, [
                  createVNode("p", { class: "text-xs uppercase tracking-[0.24em] text-slate-500" }, "Preferred Language"),
                  createVNode("p", { class: "mt-2 text-sm font-semibold text-white" }, toDisplayString(unref(preferredLanguageLabel)), 1)
                ]),
                createVNode("div", { class: "rounded-2xl border border-white/10 bg-white/5 p-4" }, [
                  createVNode("p", { class: "text-xs uppercase tracking-[0.24em] text-slate-500" }, "Phone"),
                  createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-300" }, "Backend support still needed")
                ]),
                createVNode("div", { class: "rounded-2xl border border-white/10 bg-white/5 p-4" }, [
                  createVNode("p", { class: "text-xs uppercase tracking-[0.24em] text-slate-500" }, "Business Role"),
                  createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-300" }, "Backend support still needed")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Quick Edit",
        description: "Save what the current API supports, with clear feedback instead of silent failures."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
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
            _push2(`<form class="space-y-5"${_scopeId}><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Full Name</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(editableName),
              "onUpdate:modelValue": ($event) => isRef(editableName) ? editableName.value = $event : null,
              placeholder: "Amina Otieno",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "This is persisted through the current `users/me` API as a single full-name field." }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Email</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              "model-value": unref(authStore).user?.email ?? "",
              readonly: "",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Preferred Language</label>`);
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(preferredLanguage),
              "onUpdate:modelValue": ($event) => isRef(preferredLanguage) ? preferredLanguage.value = $event : null,
              items: languageOptions,
              "value-key": "value",
              "label-key": "label",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_DashboardInfoCard, {
              title: "Profile persistence today",
              description: "Phone, address, social links, and business role are still not persisted by the current backend profile endpoints. They remain visible here so the gap is explicit, not hidden.",
              icon: "i-lucide-server"
            }, null, _parent2, _scopeId));
            _push2(`<div class="grid gap-4 md:grid-cols-2"${_scopeId}><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Phone Number</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              "model-value": "",
              placeholder: "Awaiting backend support",
              readonly: "",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Business Role</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              "model-value": "",
              placeholder: "Awaiting backend support",
              readonly: "",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_DashboardLoadingButton, {
              type: "submit",
              color: "primary",
              loading: unref(saving)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Save Profile `);
                } else {
                  return [
                    createTextVNode(" Save Profile ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              unref(saveError) ? (openBlock(), createBlock(_component_UAlert, {
                key: 0,
                color: "error",
                variant: "soft",
                title: "Profile update failed",
                description: unref(saveError),
                icon: "i-lucide-alert-circle"
              }, null, 8, ["description"])) : createCommentVNode("", true),
              createVNode("form", {
                class: "space-y-5",
                onSubmit: withModifiers(saveProfile, ["prevent"])
              }, [
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Full Name"),
                  createVNode(_component_UInput, {
                    modelValue: unref(editableName),
                    "onUpdate:modelValue": ($event) => isRef(editableName) ? editableName.value = $event : null,
                    placeholder: "Amina Otieno",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "This is persisted through the current `users/me` API as a single full-name field." })
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Email"),
                  createVNode(_component_UInput, {
                    "model-value": unref(authStore).user?.email ?? "",
                    readonly: "",
                    size: "xl"
                  }, null, 8, ["model-value"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Preferred Language"),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(preferredLanguage),
                    "onUpdate:modelValue": ($event) => isRef(preferredLanguage) ? preferredLanguage.value = $event : null,
                    items: languageOptions,
                    "value-key": "value",
                    "label-key": "label",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode(_component_DashboardInfoCard, {
                  title: "Profile persistence today",
                  description: "Phone, address, social links, and business role are still not persisted by the current backend profile endpoints. They remain visible here so the gap is explicit, not hidden.",
                  icon: "i-lucide-server"
                }),
                createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                  createVNode("div", { class: "space-y-2" }, [
                    createVNode("label", { class: "block text-sm font-medium text-white" }, "Phone Number"),
                    createVNode(_component_UInput, {
                      "model-value": "",
                      placeholder: "Awaiting backend support",
                      readonly: "",
                      size: "xl"
                    })
                  ]),
                  createVNode("div", { class: "space-y-2" }, [
                    createVNode("label", { class: "block text-sm font-medium text-white" }, "Business Role"),
                    createVNode(_component_UInput, {
                      "model-value": "",
                      placeholder: "Awaiting backend support",
                      readonly: "",
                      size: "xl"
                    })
                  ])
                ]),
                createVNode("div", { class: "flex justify-end" }, [
                  createVNode(_component_DashboardLoadingButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(saving)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Save Profile ")
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/profile/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-hH4MVJYh.mjs.map
