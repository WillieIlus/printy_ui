import { _ as __nuxt_component_3$1, a as _sfc_main$f, c as useAuthStore, d as _sfc_main$9, b as __nuxt_component_2$2 } from './server.mjs';
import { _ as __nuxt_component_4 } from './ThemeCycleButton-DG1zEPnp.mjs';
import { _ as __nuxt_component_1, a as __nuxt_component_2 } from './PrintyWordmark-BCsi7_hR.mjs';
import { F as Form, _ as __nuxt_component_2$1 } from './FormInput-opqohhBW.mjs';
import { _ as _sfc_main$2 } from './Alert-CI_a20A7.mjs';
import { _ as _sfc_main$3 } from './Checkbox-S5HrhTVg.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-CX_axkrT.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, ref, computed, unref, isRef, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { object, string } from 'yup';
import { u as useAuth } from './useAuth-DIzIZi2i.mjs';
import { u as useSubmissionFeedback } from './useSubmissionFeedback-D47JMU2e.mjs';
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
import './formUi-UcrM_3uE.mjs';
import './profile-BrbBxAQk.mjs';
import './shop-COPLd96Y.mjs';
import './useNotification-B7Z2gs_7.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "LoginForm",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const { login, loading } = useAuth();
    const feedback = useSubmissionFeedback();
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
      feedback.reset();
      emailNotVerified.value = false;
      unverifiedEmail.value = "";
      const result = await login(email, password, rememberMe.value);
      if (!result.success) {
        const r = result;
        if (r.code === "email_not_verified") {
          emailNotVerified.value = true;
          unverifiedEmail.value = r.email ?? email;
        } else {
          feedback.setError(result.error || "We could not sign you in right now.");
        }
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_UAlert = _sfc_main$2;
      const _component_UButton = _sfc_main$9;
      const _component_FormsFormInput = __nuxt_component_2$1;
      const _component_UCheckbox = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      const _component_ClientOnly = __nuxt_component_2$2;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(loginSchema),
        onSubmit
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            if (unref(feedback).errorMessage) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "error",
                icon: "i-lucide-alert-circle",
                title: "Could not sign you in",
                description: unref(feedback).errorMessage,
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
              autocomplete: "email",
              placeholder: "Enter your email",
              icon: "i-lucide-mail",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "password",
              label: "Password",
              type: "password",
              autocomplete: "current-password",
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
            _push2(ssrRenderComponent(_component_DashboardLoadingButton, {
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
                        _push4(`Open my workspace`);
                      } else {
                        return [
                          createTextVNode("Open my workspace")
                        ];
                      }
                    })
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_ClientOnly, null, {
                      fallback: withCtx(() => [
                        createTextVNode("Open my workspace")
                      ]),
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(isRateLimited) ? `Please wait ${Math.ceil((unref(authStore).rateLimitUntil - unref(now)) / 1e3)}s...` : "Open my workspace") + " ", 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                unref(feedback).errorMessage ? (openBlock(), createBlock(_component_UAlert, {
                  key: 0,
                  color: "error",
                  icon: "i-lucide-alert-circle",
                  title: "Could not sign you in",
                  description: unref(feedback).errorMessage,
                  class: "rounded-lg"
                }, null, 8, ["description"])) : createCommentVNode("", true),
                unref(authStore).error ? (openBlock(), createBlock(_component_UAlert, {
                  key: 1,
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
                  key: 2,
                  color: "warning",
                  icon: "i-lucide-mail-question",
                  title: "Please verify your email before signing in.",
                  description: "We sent a verification code to your email. Enter it to activate your account.",
                  class: "rounded-lg"
                })) : createCommentVNode("", true),
                unref(emailNotVerified) ? (openBlock(), createBlock("div", {
                  key: 3,
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
                  autocomplete: "email",
                  placeholder: "Enter your email",
                  icon: "i-lucide-mail",
                  required: ""
                }),
                createVNode(_component_FormsFormInput, {
                  name: "password",
                  label: "Password",
                  type: "password",
                  autocomplete: "current-password",
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
                createVNode(_component_DashboardLoadingButton, {
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
                        createTextVNode("Open my workspace")
                      ]),
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(isRateLimited) ? `Please wait ${Math.ceil((unref(authStore).rateLimitUntil - unref(now)) / 1e3)}s...` : "Open my workspace") + " ", 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
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
const __nuxt_component_5 = Object.assign(_sfc_main$1, { __name: "AuthLoginForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      const _component_ThemeCycleButton = __nuxt_component_4;
      const _component_CommonPrintyLogoMark = __nuxt_component_1;
      const _component_CommonPrintyWordmark = __nuxt_component_2;
      const _component_AuthLoginForm = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col bg-[var(--p-bg)] text-[var(--p-text)]" }, _attrs))}><div class="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--p-border)] bg-[var(--p-surface)]">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)] transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-left",
              class: "w-4 h-4"
            }, null, _parent2, _scopeId));
            _push2(` Back `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "w-4 h-4"
              }),
              createTextVNode(" Back ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_ThemeCycleButton, null, null, _parent));
      _push(`</div><div class="flex-1 flex flex-col lg:flex-row lg:min-h-0"><div class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 lg:w-1/2 lg:min-w-0"><div class="w-full max-w-md"><div class="text-center mb-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex items-center gap-3 group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="grid h-12 w-12 place-items-center rounded-xl shadow-lg transition-transform group-hover:scale-105 overflow-hidden shrink-0" style="${ssrRenderStyle({ "background": "#e13515" })}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CommonPrintyLogoMark, { "img-class": "h-7 w-7" }, null, _parent2, _scopeId));
            _push2(`</span>`);
            _push2(ssrRenderComponent(_component_CommonPrintyWordmark, { "img-class": "h-6 w-auto max-w-[100px]" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", {
                class: "grid h-12 w-12 place-items-center rounded-xl shadow-lg transition-transform group-hover:scale-105 overflow-hidden shrink-0",
                style: { "background": "#e13515" }
              }, [
                createVNode(_component_CommonPrintyLogoMark, { "img-class": "h-7 w-7" })
              ]),
              createVNode(_component_CommonPrintyWordmark, { "img-class": "h-6 w-auto max-w-[100px]" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="text-center mb-8"><h1 class="text-2xl font-bold text-[var(--p-text)] sm:text-3xl"> Welcome back to your print workspace </h1><p class="mt-2 text-sm text-[var(--p-text-muted)]"> Continue pricing jobs, sending quotes, and managing your print shop. </p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm p-6 sm:p-8">`);
      _push(ssrRenderComponent(_component_AuthLoginForm, null, null, _parent));
      _push(`</div><p class="mt-6 text-center text-sm text-[var(--p-text-muted)]"> Don&#39;t have an account? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/signup",
        class: "text-flamingo-600 hover:underline font-medium dark:text-flamingo-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Create your workspace`);
          } else {
            return [
              createTextVNode("Create your workspace")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div><aside class="hidden lg:flex lg:w-1/2 lg:min-w-0 shrink-0 flex-col justify-center bg-[#1e3a5f] text-white p-8 xl:p-12"><h2 class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-8"> Back to your print shop </h2><p class="text-lg text-white/80 mb-10 leading-relaxed"> Pick up where you left off—your quote requests, pricing, and jobs are waiting. </p><ul class="space-y-6"><li class="flex gap-4"><div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-calculator",
        class: "w-6 h-6"
      }, null, _parent));
      _push(`</div><div><p class="text-lg font-bold">Faster quoting</p><p class="text-base text-white/80 mt-0.5">Price jobs in seconds, not back-and-forth.</p></div></li><li class="flex gap-4"><div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-receipt",
        class: "w-6 h-6"
      }, null, _parent));
      _push(`</div><div><p class="text-lg font-bold">Clear pricing</p><p class="text-base text-white/80 mt-0.5">Material, print, finishing—all itemized.</p></div></li><li class="flex gap-4"><div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-clipboard-list",
        class: "w-6 h-6"
      }, null, _parent));
      _push(`</div><div><p class="text-lg font-bold">Quote management</p><p class="text-base text-white/80 mt-0.5">Track requests and respond from one place.</p></div></li><li class="flex gap-4"><div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-store",
        class: "w-6 h-6"
      }, null, _parent));
      _push(`</div><div><p class="text-lg font-bold">Your public shop page</p><p class="text-base text-white/80 mt-0.5">Where customers find you and request quotes.</p></div></li></ul></aside></div></div>`);
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
//# sourceMappingURL=login-CsiCRN85.mjs.map
