import { g as useRoute, c as useAuthStore, N as __nuxt_component_0, n as navigateTo } from './server.mjs';
import { F as Form, _ as __nuxt_component_2 } from './FormInput-9hgb7rOA.mjs';
import { _ as _sfc_main$1 } from './Alert-nALN31Ul.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-CX_axkrT.mjs';
import { defineComponent, ref, computed, withCtx, unref, createTextVNode, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { object, string, ref as ref$1 } from 'yup';
import { u as useSubmissionFeedback } from './useSubmissionFeedback-DEV14iGN.mjs';
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
import './useNotification-DukejKDK.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "reset-password",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const authStore = useAuthStore();
    const feedback = useSubmissionFeedback();
    const loading = ref(false);
    const token = computed(() => route.query.token ?? "");
    const uid = computed(() => route.query.uid ?? "");
    const schema = object({
      new_password: string().required("Password is required").min(8, "At least 8 characters"),
      new_password_confirm: string().required("Confirm password").oneOf([ref$1("new_password")], "Passwords must match")
    });
    async function handleSubmit(values) {
      const newPassword = values.new_password;
      const newPasswordConfirm = values.new_password_confirm;
      if (!uid.value || !token.value) {
        feedback.setError("Invalid or missing reset link. Request a new one.");
        return;
      }
      loading.value = true;
      feedback.reset();
      try {
        const result = await authStore.resetPassword(
          uid.value,
          token.value,
          newPassword,
          newPasswordConfirm
        );
        if (result.success) {
          feedback.setSuccess("Password updated. You can sign in now.");
          await navigateTo("/auth/login");
        } else {
          feedback.setError(result.error ?? "We could not reset your password right now.");
        }
      } catch {
        feedback.setError("Something went wrong.");
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_VeeForm = Form;
      const _component_UAlert = _sfc_main$1;
      const _component_FormsFormInput = __nuxt_component_2;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_NuxtLayout, {
        name: "auth",
        title: "Reset password",
        subtitle: "Enter your new password.",
        "back-to": "/auth/login"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_VeeForm, {
              "validation-schema": unref(schema),
              onSubmit: handleSubmit
            }, {
              default: withCtx(({ meta }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-4"${_scopeId2}>`);
                  if (unref(feedback).errorMessage) {
                    _push3(ssrRenderComponent(_component_UAlert, {
                      color: "error",
                      icon: "i-lucide-alert-circle",
                      title: "Could not reset password",
                      description: unref(feedback).errorMessage,
                      class: "rounded-lg"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(feedback).successMessage) {
                    _push3(ssrRenderComponent(_component_UAlert, {
                      color: "success",
                      icon: "i-lucide-check-circle",
                      title: "Password updated",
                      description: unref(feedback).successMessage,
                      class: "rounded-lg"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_component_FormsFormInput, {
                    name: "new_password",
                    label: "New password",
                    type: "password",
                    placeholder: "••••••••",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormsFormInput, {
                    name: "new_password_confirm",
                    label: "Confirm password",
                    type: "password",
                    placeholder: "••••••••",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardLoadingButton, {
                    type: "submit",
                    color: "primary",
                    block: "",
                    loading: unref(loading),
                    disabled: !meta.valid
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Reset password `);
                      } else {
                        return [
                          createTextVNode(" Reset password ")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-4" }, [
                      unref(feedback).errorMessage ? (openBlock(), createBlock(_component_UAlert, {
                        key: 0,
                        color: "error",
                        icon: "i-lucide-alert-circle",
                        title: "Could not reset password",
                        description: unref(feedback).errorMessage,
                        class: "rounded-lg"
                      }, null, 8, ["description"])) : createCommentVNode("", true),
                      unref(feedback).successMessage ? (openBlock(), createBlock(_component_UAlert, {
                        key: 1,
                        color: "success",
                        icon: "i-lucide-check-circle",
                        title: "Password updated",
                        description: unref(feedback).successMessage,
                        class: "rounded-lg"
                      }, null, 8, ["description"])) : createCommentVNode("", true),
                      createVNode(_component_FormsFormInput, {
                        name: "new_password",
                        label: "New password",
                        type: "password",
                        placeholder: "••••••••",
                        required: ""
                      }),
                      createVNode(_component_FormsFormInput, {
                        name: "new_password_confirm",
                        label: "Confirm password",
                        type: "password",
                        placeholder: "••••••••",
                        required: ""
                      }),
                      createVNode(_component_DashboardLoadingButton, {
                        type: "submit",
                        color: "primary",
                        block: "",
                        loading: unref(loading),
                        disabled: !meta.valid
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Reset password ")
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_VeeForm, {
                "validation-schema": unref(schema),
                onSubmit: handleSubmit
              }, {
                default: withCtx(({ meta }) => [
                  createVNode("div", { class: "space-y-4" }, [
                    unref(feedback).errorMessage ? (openBlock(), createBlock(_component_UAlert, {
                      key: 0,
                      color: "error",
                      icon: "i-lucide-alert-circle",
                      title: "Could not reset password",
                      description: unref(feedback).errorMessage,
                      class: "rounded-lg"
                    }, null, 8, ["description"])) : createCommentVNode("", true),
                    unref(feedback).successMessage ? (openBlock(), createBlock(_component_UAlert, {
                      key: 1,
                      color: "success",
                      icon: "i-lucide-check-circle",
                      title: "Password updated",
                      description: unref(feedback).successMessage,
                      class: "rounded-lg"
                    }, null, 8, ["description"])) : createCommentVNode("", true),
                    createVNode(_component_FormsFormInput, {
                      name: "new_password",
                      label: "New password",
                      type: "password",
                      placeholder: "••••••••",
                      required: ""
                    }),
                    createVNode(_component_FormsFormInput, {
                      name: "new_password_confirm",
                      label: "Confirm password",
                      type: "password",
                      placeholder: "••••••••",
                      required: ""
                    }),
                    createVNode(_component_DashboardLoadingButton, {
                      type: "submit",
                      color: "primary",
                      block: "",
                      loading: unref(loading),
                      disabled: !meta.valid
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Reset password ")
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled"])
                  ])
                ]),
                _: 1
              }, 8, ["validation-schema"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/reset-password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=reset-password-Dyv2P4yI.mjs.map
