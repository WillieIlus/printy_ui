import { N as __nuxt_component_0, c as useAuthStore, _ as __nuxt_component_3$1 } from './server.mjs';
import { F as Form, _ as __nuxt_component_2 } from './FormInput-9hgb7rOA.mjs';
import { _ as _sfc_main$2 } from './Alert-nALN31Ul.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-CX_axkrT.mjs';
import { defineComponent, withCtx, createVNode, ref, mergeProps, unref, createTextVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { object, string } from 'yup';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ForgotPasswordForm",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(false);
    const feedback = useSubmissionFeedback();
    const schema = object({
      email: string().email("Invalid email").required("Email is required")
    });
    const authStore = useAuthStore();
    async function onSubmit(values) {
      const { email } = values;
      loading.value = true;
      feedback.reset();
      try {
        const result = await authStore.requestPasswordReset(email);
        if (result.success) {
          feedback.setSuccess("If an account exists, you will receive a reset link.");
        } else {
          feedback.setError(result.error ?? "We could not send the reset link right now.");
        }
      } catch {
        feedback.setError("Something went wrong. Try again.");
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_UAlert = _sfc_main$2;
      const _component_FormsFormInput = __nuxt_component_2;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      const _component_NuxtLink = __nuxt_component_3$1;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(schema),
        onSubmit
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            if (unref(feedback).errorMessage) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "error",
                icon: "i-lucide-alert-circle",
                title: "Could not send reset link",
                description: unref(feedback).errorMessage,
                class: "rounded-lg"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(feedback).successMessage) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "success",
                icon: "i-lucide-check-circle",
                title: "Reset email sent",
                description: unref(feedback).successMessage,
                class: "rounded-lg"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(authStore).error) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "error",
                icon: "i-lucide-alert-circle",
                title: unref(authStore).error,
                class: "rounded-lg",
                close: "",
                "onUpdate:open": (open) => {
                  if (!open) unref(authStore).error = null;
                }
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "email",
              label: "Email",
              type: "email",
              placeholder: "Enter your email",
              icon: "i-lucide-mail",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardLoadingButton, {
              type: "submit",
              color: "primary",
              block: "",
              class: "bg-flamingo-500 hover:bg-flamingo-600 text-white rounded-xl",
              loading: unref(loading),
              disabled: !meta.valid
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Send reset link `);
                } else {
                  return [
                    createTextVNode(" Send reset link ")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`<p class="text-center text-sm text-slate-600 dark:text-slate-400"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/login",
              class: "text-primary-600 hover:underline font-medium dark:text-primary-400"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back to sign in`);
                } else {
                  return [
                    createTextVNode("Back to sign in")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</p></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                unref(feedback).errorMessage ? (openBlock(), createBlock(_component_UAlert, {
                  key: 0,
                  color: "error",
                  icon: "i-lucide-alert-circle",
                  title: "Could not send reset link",
                  description: unref(feedback).errorMessage,
                  class: "rounded-lg"
                }, null, 8, ["description"])) : createCommentVNode("", true),
                unref(feedback).successMessage ? (openBlock(), createBlock(_component_UAlert, {
                  key: 1,
                  color: "success",
                  icon: "i-lucide-check-circle",
                  title: "Reset email sent",
                  description: unref(feedback).successMessage,
                  class: "rounded-lg"
                }, null, 8, ["description"])) : createCommentVNode("", true),
                unref(authStore).error ? (openBlock(), createBlock(_component_UAlert, {
                  key: 2,
                  color: "error",
                  icon: "i-lucide-alert-circle",
                  title: unref(authStore).error,
                  class: "rounded-lg",
                  close: "",
                  "onUpdate:open": (open) => {
                    if (!open) unref(authStore).error = null;
                  }
                }, null, 8, ["title", "onUpdate:open"])) : createCommentVNode("", true),
                createVNode(_component_FormsFormInput, {
                  name: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "Enter your email",
                  icon: "i-lucide-mail",
                  required: ""
                }),
                createVNode(_component_DashboardLoadingButton, {
                  type: "submit",
                  color: "primary",
                  block: "",
                  class: "bg-flamingo-500 hover:bg-flamingo-600 text-white rounded-xl",
                  loading: unref(loading),
                  disabled: !meta.valid
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Send reset link ")
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"]),
                createVNode("p", { class: "text-center text-sm text-slate-600 dark:text-slate-400" }, [
                  createVNode(_component_NuxtLink, {
                    to: "/auth/login",
                    class: "text-primary-600 hover:underline font-medium dark:text-primary-400"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Back to sign in")
                    ]),
                    _: 1
                  })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/ForgotPasswordForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "AuthForgotPasswordForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "forgot-password",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_AuthForgotPasswordForm = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_NuxtLayout, {
        name: "auth",
        title: "Forgot password?",
        subtitle: "Enter your email and we'll send a reset link.",
        "back-to": "/auth/login"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_AuthForgotPasswordForm, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_AuthForgotPasswordForm)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/forgot-password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=forgot-password-jnvgnH7E.mjs.map
