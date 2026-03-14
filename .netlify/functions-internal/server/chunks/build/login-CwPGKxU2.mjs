import { d as __nuxt_component_0, _ as __nuxt_component_2, e as useAuthStore, c as _sfc_main$9, b as __nuxt_component_3$1 } from './server.mjs';
import { F as Form, _ as __nuxt_component_1$1 } from './FormInput-BwqVsjAz.mjs';
import { _ as _sfc_main$2 } from './Alert-Dt8CKxt0.mjs';
import { _ as _sfc_main$3 } from './Checkbox-BX22gW7J.mjs';
import { defineComponent, withCtx, createVNode, createTextVNode, ref, computed, mergeProps, unref, isRef, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { object, string } from 'yup';
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
  __name: "LoginForm",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const { login, loading } = useAuth();
    const notification = useNotification();
    const rememberMe = ref(true);
    const now = ref(Date.now());
    const isRateLimited = computed(() => authStore.rateLimitUntil > now.value);
    const loginSchema = object({
      email: string().email("Invalid email").required("Email is required"),
      password: string().min(8, "Password must be at least 8 characters").required("Password is required")
    });
    const emailNotVerified = ref(false);
    const unverifiedEmail = ref("");
    const verifyEmailLink = computed(() => {
      if (!unverifiedEmail.value) return "/auth/verify-email";
      return { path: "/auth/verify-email", query: { email: unverifiedEmail.value } };
    });
    async function onSubmit(values) {
      const { email, password } = values;
      emailNotVerified.value = false;
      unverifiedEmail.value = "";
      const result = await login(email, password, rememberMe.value);
      if (!result.success) {
        const r = result;
        if (r.code === "email_not_verified") {
          emailNotVerified.value = true;
          unverifiedEmail.value = r.email ?? email;
        } else {
          notification.error(result.error || "Login failed");
        }
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_UAlert = _sfc_main$2;
      const _component_UButton = _sfc_main$9;
      const _component_FormsFormInput = __nuxt_component_1$1;
      const _component_UCheckbox = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_2;
      const _component_ClientOnly = __nuxt_component_3$1;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(loginSchema),
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
            if (unref(emailNotVerified)) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "warning",
                icon: "i-lucide-mail-question",
                title: "Please verify your email before signing in.",
                description: "We sent a verification code to your email. Enter it to activate your account.",
                class: "rounded-lg"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(emailNotVerified)) {
              _push2(`<div class="flex justify-center"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                size: "sm",
                color: "primary",
                class: "bg-flamingo-500 hover:bg-flamingo-600 text-white rounded-xl",
                to: unref(verifyEmailLink)
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Verify email `);
                  } else {
                    return [
                      createTextVNode(" Verify email ")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div>`);
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
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "password",
              label: "Password",
              type: "password",
              placeholder: "Enter your password",
              icon: "i-lucide-lock",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex items-center justify-between"${_scopeId}><label class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(rememberMe),
              "onUpdate:modelValue": ($event) => isRef(rememberMe) ? rememberMe.value = $event : null
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Remember me</span></label>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/forgot-password",
              class: "text-sm text-primary-600 hover:underline dark:text-primary-400"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Forgot password? `);
                } else {
                  return [
                    createTextVNode(" Forgot password? ")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              block: "",
              class: "bg-flamingo-500 hover:bg-flamingo-600 text-white rounded-xl",
              loading: unref(loading),
              disabled: !meta.valid || unref(loading) || unref(isRateLimited)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_ClientOnly, null, {
                    fallback: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Sign In`);
                      } else {
                        return [
                          createTextVNode("Sign In")
                        ];
                      }
                    })
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_ClientOnly, null, {
                      fallback: withCtx(() => [
                        createTextVNode("Sign In")
                      ]),
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(isRateLimited) ? `Please wait ${Math.ceil((unref(authStore).rateLimitUntil - unref(now)) / 1e3)}s...` : "Sign In") + " ", 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`<p class="text-center text-sm text-gray-600 dark:text-gray-400"${_scopeId}> Don&#39;t have an account? `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/signup",
              class: "text-primary-600 hover:underline font-medium dark:text-primary-400"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Sign up`);
                } else {
                  return [
                    createTextVNode("Sign up")
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
                unref(emailNotVerified) ? (openBlock(), createBlock(_component_UAlert, {
                  key: 1,
                  color: "warning",
                  icon: "i-lucide-mail-question",
                  title: "Please verify your email before signing in.",
                  description: "We sent a verification code to your email. Enter it to activate your account.",
                  class: "rounded-lg"
                })) : createCommentVNode("", true),
                unref(emailNotVerified) ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "flex justify-center"
                }, [
                  createVNode(_component_UButton, {
                    size: "sm",
                    color: "primary",
                    class: "bg-flamingo-500 hover:bg-flamingo-600 text-white rounded-xl",
                    to: unref(verifyEmailLink)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Verify email ")
                    ]),
                    _: 1
                  }, 8, ["to"])
                ])) : createCommentVNode("", true),
                createVNode(_component_FormsFormInput, {
                  name: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "Enter your email",
                  icon: "i-lucide-mail",
                  required: ""
                }),
                createVNode(_component_FormsFormInput, {
                  name: "password",
                  label: "Password",
                  type: "password",
                  placeholder: "Enter your password",
                  icon: "i-lucide-lock",
                  required: ""
                }),
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("label", { class: "flex items-center gap-2" }, [
                    createVNode(_component_UCheckbox, {
                      modelValue: unref(rememberMe),
                      "onUpdate:modelValue": ($event) => isRef(rememberMe) ? rememberMe.value = $event : null
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode("span", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Remember me")
                  ]),
                  createVNode(_component_NuxtLink, {
                    to: "/auth/forgot-password",
                    class: "text-sm text-primary-600 hover:underline dark:text-primary-400"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Forgot password? ")
                    ]),
                    _: 1
                  })
                ]),
                createVNode(_component_UButton, {
                  type: "submit",
                  color: "primary",
                  block: "",
                  class: "bg-flamingo-500 hover:bg-flamingo-600 text-white rounded-xl",
                  loading: unref(loading),
                  disabled: !meta.valid || unref(loading) || unref(isRateLimited)
                }, {
                  default: withCtx(() => [
                    createVNode(_component_ClientOnly, null, {
                      fallback: withCtx(() => [
                        createTextVNode("Sign In")
                      ]),
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(isRateLimited) ? `Please wait ${Math.ceil((unref(authStore).rateLimitUntil - unref(now)) / 1e3)}s...` : "Sign In") + " ", 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"]),
                createVNode("p", { class: "text-center text-sm text-gray-600 dark:text-gray-400" }, [
                  createTextVNode(" Don't have an account? "),
                  createVNode(_component_NuxtLink, {
                    to: "/auth/signup",
                    class: "text-primary-600 hover:underline font-medium dark:text-primary-400"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Sign up")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/LoginForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "AuthLoginForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_AuthLoginForm = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_NuxtLayout, {
        name: "auth",
        title: "Sign in to your account",
        subtitle: "Welcome back! Please enter your details."
      }, {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}> Don&#39;t have an account? `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/signup",
              class: "text-primary-600 hover:underline font-medium dark:text-primary-400"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Sign up `);
                } else {
                  return [
                    createTextVNode(" Sign up ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, [
                createTextVNode(" Don't have an account? "),
                createVNode(_component_NuxtLink, {
                  to: "/auth/signup",
                  class: "text-primary-600 hover:underline font-medium dark:text-primary-400"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Sign up ")
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_AuthLoginForm, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_AuthLoginForm)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-CwPGKxU2.mjs.map
