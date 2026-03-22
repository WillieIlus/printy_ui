import { _ as __nuxt_component_0 } from './DashboardPageHeader-DY_0uFAc.mjs';
import { d as useAuthStore, e as _sfc_main$9, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_2, a as __nuxt_component_11 } from './InfoCard-K1X9VF5P.mjs';
import { _ as _sfc_main$1 } from './Alert-RLPfncBZ.mjs';
import { _ as _sfc_main$2 } from './Input-DA2ySSK8.mjs';
import { _ as _sfc_main$3 } from './SelectMenu-DTjoEp_W.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-CZOYt8xS.mjs';
import { defineComponent, ref, watch, mergeProps, withCtx, createTextVNode, createVNode, unref, isRef, openBlock, createBlock, createCommentVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "edit",
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
        await navigateTo("/dashboard/profile");
      } catch (error) {
        saveError.value = error instanceof Error ? error.message : "Profile update failed.";
      } finally {
        saving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardFormSection = __nuxt_component_2;
      const _component_UAlert = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_USelectMenu = _sfc_main$3;
      const _component_DashboardInfoCard = __nuxt_component_11;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Edit Profile",
        subtitle: "Update the account fields the current API supports cleanly, and keep unsupported profile fields visible with an explicit backend note."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/dashboard/profile",
              variant: "soft"
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
                to: "/dashboard/profile",
                variant: "soft"
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
        title: "Editable Account Fields",
        description: "This route no longer relies on the broken split between first/last name and the profile compatibility shell."
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
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Email Address</label>`);
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
              title: "Unsupported fields",
              description: "Phone number, business role, address, password change flow, and social links still need backend persistence before this screen can save them reliably.",
              icon: "i-lucide-server",
              tone: "orange"
            }, null, _parent2, _scopeId));
            _push2(`<div class="grid gap-4 md:grid-cols-2"${_scopeId}><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Phone Number</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              "model-value": "",
              placeholder: "Backend support still needed",
              readonly: "",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Business Role</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              "model-value": "",
              placeholder: "Backend support still needed",
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
                  _push3(` Save Changes `);
                } else {
                  return [
                    createTextVNode(" Save Changes ")
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
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Email Address"),
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
                  title: "Unsupported fields",
                  description: "Phone number, business role, address, password change flow, and social links still need backend persistence before this screen can save them reliably.",
                  icon: "i-lucide-server",
                  tone: "orange"
                }),
                createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                  createVNode("div", { class: "space-y-2" }, [
                    createVNode("label", { class: "block text-sm font-medium text-white" }, "Phone Number"),
                    createVNode(_component_UInput, {
                      "model-value": "",
                      placeholder: "Backend support still needed",
                      readonly: "",
                      size: "xl"
                    })
                  ]),
                  createVNode("div", { class: "space-y-2" }, [
                    createVNode("label", { class: "block text-sm font-medium text-white" }, "Business Role"),
                    createVNode(_component_UInput, {
                      "model-value": "",
                      placeholder: "Backend support still needed",
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
                      createTextVNode(" Save Changes ")
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
      _push(`<div class="space-y-6">`);
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "What was fixed",
        description: "The save action now uses the actual editable account API shape instead of sending first and last name fields the backend does not recognize.",
        icon: "i-lucide-wrench",
        tone: "blue"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "What still needs backend work",
        description: "If you want full profile editing here, the API needs real fields for phone, role, address, password updates, and social links.",
        icon: "i-lucide-database"
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
//# sourceMappingURL=edit-CNnPMf7b.mjs.map
