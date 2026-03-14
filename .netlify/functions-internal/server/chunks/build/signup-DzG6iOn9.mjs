import { d as __nuxt_component_0, _ as __nuxt_component_2, e as useAuthStore, c as _sfc_main$9 } from './server.mjs';
import { F as Form, _ as __nuxt_component_1$1 } from './FormInput-BwqVsjAz.mjs';
import { _ as _sfc_main$2 } from './Alert-Dt8CKxt0.mjs';
import { _ as _sfc_main$3 } from './Checkbox-BX22gW7J.mjs';
import { defineComponent, withCtx, createVNode, createTextVNode, ref, mergeProps, unref, isRef, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { object, string, ref as ref$1 } from 'yup';
import { u as useAuth } from './useAuth-CuIEby6D.mjs';
import { u as useNotification } from './useNotification-Dn_AzVKG.mjs';
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
import 'tailwindcss/colors';
import '@iconify/vue';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './profile-CEiUsRUc.mjs';
import './api-error-D1IYk86E.mjs';
import './shop-0Cyw6rqQ.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SignupForm",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const { signup, loading } = useAuth();
    const notification = useNotification();
    const agreeTerms = ref(false);
    const signupSchema = object({
      first_name: string().required("First name is required"),
      last_name: string().required("Last name is required"),
      email: string().email("Invalid email").required("Email is required"),
      password: string().min(8, "Password must be at least 8 characters").matches(/[A-Z]/, "Password must contain an uppercase letter").matches(/[0-9]/, "Password must contain a number").required("Password is required"),
      password_confirm: string().oneOf([ref$1("password")], "Passwords must match").required("Please confirm your password")
    });
    async function onSubmit(values) {
      const result = await signup(values);
      if (!result.success) {
        notification.error(result.error || "Signup failed");
      } else {
        notification.success(
          result.message ?? "Account created. Please check your email to confirm."
        );
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_UAlert = _sfc_main$2;
      const _component_FormsFormInput = __nuxt_component_1$1;
      const _component_UCheckbox = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_2;
      const _component_UButton = _sfc_main$9;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(signupSchema),
        onSubmit
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
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
            _push2(`<div class="grid grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "first_name",
              label: "First Name",
              placeholder: "John",
              icon: "i-lucide-user",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "last_name",
              label: "Last Name",
              placeholder: "Doe",
              icon: "i-lucide-user",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "email",
              label: "Email",
              type: "email",
              placeholder: "john@example.com",
              icon: "i-lucide-mail",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "password",
              label: "Password",
              type: "password",
              placeholder: "Create a password",
              icon: "i-lucide-lock",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "password_confirm",
              label: "Confirm Password",
              type: "password",
              placeholder: "Confirm your password",
              icon: "i-lucide-lock",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`<label class="flex items-start gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(agreeTerms),
              "onUpdate:modelValue": ($event) => isRef(agreeTerms) ? agreeTerms.value = $event : null,
              class: "mt-1"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}> I agree to the `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/terms",
              class: "text-[#e13515] hover:underline dark:text-primary-400"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Terms of Service`);
                } else {
                  return [
                    createTextVNode("Terms of Service")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(` and `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/privacy",
              class: "text-[#e13515] hover:underline dark:text-primary-400"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Privacy Policy`);
                } else {
                  return [
                    createTextVNode("Privacy Policy")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</span></label>`);
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              block: "",
              class: "bg-flamingo-500 hover:bg-flamingo-600 text-white rounded-xl",
              loading: unref(loading),
              disabled: !meta.valid || !unref(agreeTerms)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Create Account `);
                } else {
                  return [
                    createTextVNode(" Create Account ")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`<p class="text-center text-sm text-gray-600 dark:text-gray-400"${_scopeId}> Already have an account? `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/login",
              class: "text-primary-600 hover:underline font-medium dark:text-primary-400"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Sign in`);
                } else {
                  return [
                    createTextVNode("Sign in")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</p></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                unref(authStore).error ? (openBlock(), createBlock(_component_UAlert, {
                  key: 0,
                  color: "error",
                  icon: "i-lucide-alert-circle",
                  title: unref(authStore).error,
                  class: "rounded-lg",
                  close: "",
                  "onUpdate:open": (open) => {
                    if (!open) unref(authStore).error = null;
                  }
                }, null, 8, ["title", "onUpdate:open"])) : createCommentVNode("", true),
                createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                  createVNode(_component_FormsFormInput, {
                    name: "first_name",
                    label: "First Name",
                    placeholder: "John",
                    icon: "i-lucide-user",
                    required: ""
                  }),
                  createVNode(_component_FormsFormInput, {
                    name: "last_name",
                    label: "Last Name",
                    placeholder: "Doe",
                    icon: "i-lucide-user",
                    required: ""
                  })
                ]),
                createVNode(_component_FormsFormInput, {
                  name: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "john@example.com",
                  icon: "i-lucide-mail",
                  required: ""
                }),
                createVNode(_component_FormsFormInput, {
                  name: "password",
                  label: "Password",
                  type: "password",
                  placeholder: "Create a password",
                  icon: "i-lucide-lock",
                  required: ""
                }),
                createVNode(_component_FormsFormInput, {
                  name: "password_confirm",
                  label: "Confirm Password",
                  type: "password",
                  placeholder: "Confirm your password",
                  icon: "i-lucide-lock",
                  required: ""
                }),
                createVNode("label", { class: "flex items-start gap-2" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(agreeTerms),
                    "onUpdate:modelValue": ($event) => isRef(agreeTerms) ? agreeTerms.value = $event : null,
                    class: "mt-1"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("span", { class: "text-sm text-gray-600 dark:text-gray-400" }, [
                    createTextVNode(" I agree to the "),
                    createVNode(_component_NuxtLink, {
                      to: "/terms",
                      class: "text-[#e13515] hover:underline dark:text-primary-400"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Terms of Service")
                      ]),
                      _: 1
                    }),
                    createTextVNode(" and "),
                    createVNode(_component_NuxtLink, {
                      to: "/privacy",
                      class: "text-[#e13515] hover:underline dark:text-primary-400"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Privacy Policy")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                createVNode(_component_UButton, {
                  type: "submit",
                  color: "primary",
                  block: "",
                  class: "bg-flamingo-500 hover:bg-flamingo-600 text-white rounded-xl",
                  loading: unref(loading),
                  disabled: !meta.valid || !unref(agreeTerms)
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Create Account ")
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"]),
                createVNode("p", { class: "text-center text-sm text-gray-600 dark:text-gray-400" }, [
                  createTextVNode(" Already have an account? "),
                  createVNode(_component_NuxtLink, {
                    to: "/auth/login",
                    class: "text-primary-600 hover:underline font-medium dark:text-primary-400"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Sign in")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/SignupForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "AuthSignupForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "signup",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_AuthSignupForm = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_NuxtLayout, {
        name: "auth",
        title: "Create your account",
        subtitle: "Start your journey with Printy today."
      }, {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}> Already have an account? `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/login",
              class: "text-primary-600 hover:underline font-medium dark:text-primary-400"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Sign in`);
                } else {
                  return [
                    createTextVNode("Sign in")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, [
                createTextVNode(" Already have an account? "),
                createVNode(_component_NuxtLink, {
                  to: "/auth/login",
                  class: "text-primary-600 hover:underline font-medium dark:text-primary-400"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Sign in")
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_AuthSignupForm, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_AuthSignupForm)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/signup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=signup-DzG6iOn9.mjs.map
