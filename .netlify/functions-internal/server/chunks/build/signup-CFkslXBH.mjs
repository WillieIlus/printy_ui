import { _ as __nuxt_component_1, a as _sfc_main$f, d as useAuthStore } from './server.mjs';
import { _ as __nuxt_component_4 } from './ThemeCycleButton-CrGRBFNy.mjs';
import { _ as __nuxt_component_2, a as __nuxt_component_3 } from './PrintyWordmark-BeHmGDED.mjs';
import { F as Form, _ as __nuxt_component_2$1 } from './FormInput-Ci9MIR6u.mjs';
import { _ as _sfc_main$2 } from './Alert-BQjQ5uNh.mjs';
import { _ as _sfc_main$3 } from './Checkbox-COEi3vth.mjs';
import { _ as __nuxt_component_4$1 } from './InlineError-CDgd_EMb.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-DEusGFiB.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, ref, unref, isRef, openBlock, createBlock, createCommentVNode, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { object, string, ref as ref$1 } from 'yup';
import { u as useAuth } from './useAuth-D74NSkk_.mjs';
import { u as useSubmissionFeedback } from './useSubmissionFeedback-B916DqgM.mjs';
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
import 'vue-i18n';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './formUi-NbOzRwMW.mjs';
import './profile-v5Kfn5BI.mjs';
import './shop-DqJLBw0V.mjs';
import './browser-storage-CN-SIF_V.mjs';
import './useNotification-DxMfmZhF.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SignupForm",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const { signup, loading } = useAuth();
    const feedback = useSubmissionFeedback();
    const agreeTerms = ref(false);
    const submitAttempted = ref(false);
    const selectedStartKey = ref("client");
    const startOptions = [
      {
        key: "client",
        role: "client",
        label: "Continue as client",
        description: "Create an account to send requests, track shop replies, and receive quotes without creating a shop."
      },
      {
        key: "staff",
        role: "staff",
        label: "Continue as staff",
        description: "Create a staff account for an allowed workspace without starting shop setup here."
      },
      {
        key: "shop_owner",
        role: "shop_owner",
        label: "Create as shop owner",
        description: "Create your account first, then continue into shop setup after sign-in."
      },
      {
        key: "create_shop_later",
        role: "client",
        label: "I'll create my shop later",
        description: "Start with an account only and upgrade into shop setup when you are ready."
      }
    ];
    const signupSchema = object({
      first_name: string().required("First name is required"),
      last_name: string().required("Last name is required"),
      email: string().email("Invalid email").required("Email is required"),
      password: string().min(8, "Password must be at least 8 characters").matches(/[A-Z]/, "Password must contain an uppercase letter").matches(/[0-9]/, "Password must contain a number").required("Password is required"),
      password_confirm: string().oneOf([ref$1("password")], "Passwords must match").required("Please confirm your password")
    });
    async function onSubmit(values) {
      submitAttempted.value = true;
      feedback.reset();
      if (!agreeTerms.value) {
        feedback.setError("You must accept the terms to continue.", "Validation", false);
        return;
      }
      const selectedRole = startOptions.find((option) => option.key === selectedStartKey.value)?.role ?? "client";
      const result = await signup({
        ...values,
        role: selectedRole
      });
      if (!result.success) {
        feedback.setError(result.error || "We could not create your account right now.");
      } else {
        feedback.setSuccess(result.message ?? "Account created. Please check your email to confirm.");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_UAlert = _sfc_main$2;
      const _component_UIcon = _sfc_main$f;
      const _component_FormsFormInput = __nuxt_component_2$1;
      const _component_UCheckbox = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_1;
      const _component_DashboardInlineError = __nuxt_component_4$1;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(signupSchema),
        onSubmit
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            if (unref(feedback).errorMessage) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "error",
                icon: "i-lucide-alert-circle",
                title: "Could not create account",
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
                title: "Account created",
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
            _push2(`<div class="space-y-3"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold text-[var(--p-text)]"${_scopeId}>How will you use Printy?</p><p class="mt-1 text-sm text-[var(--p-text-muted)]"${_scopeId}> You can create an account without a shop. Shop setup starts later only if you choose the shop owner path. </p></div><div class="grid gap-3"${_scopeId}><!--[-->`);
            ssrRenderList(startOptions, (option) => {
              _push2(`<button type="button" class="${ssrRenderClass([unref(selectedStartKey) === option.key ? "border-flamingo-400 bg-flamingo-50/70 dark:border-flamingo-500 dark:bg-flamingo-950/30" : "border-[var(--p-border)] bg-[var(--p-surface-sunken)] hover:border-flamingo-300/60", "rounded-xl border px-4 py-3 text-left transition-colors"])}"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(option.label)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(option.description)}</p></div>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: unref(selectedStartKey) === option.key ? "i-lucide-check-circle-2" : "i-lucide-circle",
                class: ["mt-0.5 h-5 w-5 shrink-0", unref(selectedStartKey) === option.key ? "text-flamingo-500" : "text-[var(--p-text-muted)]"]
              }, null, _parent2, _scopeId));
              _push2(`</div></button>`);
            });
            _push2(`<!--]--></div></div><div class="grid grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "first_name",
              label: "First Name",
              autocomplete: "given-name",
              placeholder: "John",
              icon: "i-lucide-user",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "last_name",
              label: "Last Name",
              autocomplete: "family-name",
              placeholder: "Doe",
              icon: "i-lucide-user",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "email",
              label: "Email",
              type: "email",
              autocomplete: "email",
              placeholder: "john@example.com",
              icon: "i-lucide-mail",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "password",
              label: "Password",
              type: "password",
              autocomplete: "new-password",
              placeholder: "Create a password",
              icon: "i-lucide-lock",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "password_confirm",
              label: "Confirm Password",
              type: "password",
              autocomplete: "new-password",
              placeholder: "Confirm your password",
              icon: "i-lucide-lock",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`<label class="${ssrRenderClass([unref(agreeTerms) ? "border-flamingo-500 bg-flamingo-50 dark:bg-flamingo-950/30 dark:border-flamingo-500" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500", "flex items-start gap-3 rounded-xl border-2 px-4 py-3 transition-all cursor-pointer select-none"])}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(agreeTerms),
              "onUpdate:modelValue": ($event) => isRef(agreeTerms) ? agreeTerms.value = $event : null,
              color: "primary",
              class: "mt-0.5 shrink-0 size-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm text-gray-700 dark:text-gray-300"${_scopeId}> I agree to the `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/terms",
              class: "text-flamingo-600 hover:underline dark:text-flamingo-400 font-medium"
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
              class: "text-flamingo-600 hover:underline dark:text-flamingo-400 font-medium"
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
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: unref(submitAttempted) && !unref(agreeTerms) ? "You must accept the terms to continue." : null
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardLoadingButton, {
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
                unref(feedback).errorMessage ? (openBlock(), createBlock(_component_UAlert, {
                  key: 0,
                  color: "error",
                  icon: "i-lucide-alert-circle",
                  title: "Could not create account",
                  description: unref(feedback).errorMessage,
                  class: "rounded-lg"
                }, null, 8, ["description"])) : createCommentVNode("", true),
                unref(feedback).successMessage ? (openBlock(), createBlock(_component_UAlert, {
                  key: 1,
                  color: "success",
                  icon: "i-lucide-check-circle",
                  title: "Account created",
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
                createVNode("div", { class: "space-y-3" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-semibold text-[var(--p-text)]" }, "How will you use Printy?"),
                    createVNode("p", { class: "mt-1 text-sm text-[var(--p-text-muted)]" }, " You can create an account without a shop. Shop setup starts later only if you choose the shop owner path. ")
                  ]),
                  createVNode("div", { class: "grid gap-3" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(startOptions, (option) => {
                      return createVNode("button", {
                        key: option.key,
                        type: "button",
                        class: ["rounded-xl border px-4 py-3 text-left transition-colors", unref(selectedStartKey) === option.key ? "border-flamingo-400 bg-flamingo-50/70 dark:border-flamingo-500 dark:bg-flamingo-950/30" : "border-[var(--p-border)] bg-[var(--p-surface-sunken)] hover:border-flamingo-300/60"],
                        onClick: ($event) => selectedStartKey.value = option.key
                      }, [
                        createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                          createVNode("div", null, [
                            createVNode("p", { class: "text-sm font-semibold text-[var(--p-text)]" }, toDisplayString(option.label), 1),
                            createVNode("p", { class: "mt-1 text-sm text-[var(--p-text-muted)]" }, toDisplayString(option.description), 1)
                          ]),
                          createVNode(_component_UIcon, {
                            name: unref(selectedStartKey) === option.key ? "i-lucide-check-circle-2" : "i-lucide-circle",
                            class: ["mt-0.5 h-5 w-5 shrink-0", unref(selectedStartKey) === option.key ? "text-flamingo-500" : "text-[var(--p-text-muted)]"]
                          }, null, 8, ["name", "class"])
                        ])
                      ], 10, ["onClick"]);
                    }), 64))
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                  createVNode(_component_FormsFormInput, {
                    name: "first_name",
                    label: "First Name",
                    autocomplete: "given-name",
                    placeholder: "John",
                    icon: "i-lucide-user",
                    required: ""
                  }),
                  createVNode(_component_FormsFormInput, {
                    name: "last_name",
                    label: "Last Name",
                    autocomplete: "family-name",
                    placeholder: "Doe",
                    icon: "i-lucide-user",
                    required: ""
                  })
                ]),
                createVNode(_component_FormsFormInput, {
                  name: "email",
                  label: "Email",
                  type: "email",
                  autocomplete: "email",
                  placeholder: "john@example.com",
                  icon: "i-lucide-mail",
                  required: ""
                }),
                createVNode(_component_FormsFormInput, {
                  name: "password",
                  label: "Password",
                  type: "password",
                  autocomplete: "new-password",
                  placeholder: "Create a password",
                  icon: "i-lucide-lock",
                  required: ""
                }),
                createVNode(_component_FormsFormInput, {
                  name: "password_confirm",
                  label: "Confirm Password",
                  type: "password",
                  autocomplete: "new-password",
                  placeholder: "Confirm your password",
                  icon: "i-lucide-lock",
                  required: ""
                }),
                createVNode("label", {
                  class: ["flex items-start gap-3 rounded-xl border-2 px-4 py-3 transition-all cursor-pointer select-none", unref(agreeTerms) ? "border-flamingo-500 bg-flamingo-50 dark:bg-flamingo-950/30 dark:border-flamingo-500" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500"]
                }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(agreeTerms),
                    "onUpdate:modelValue": ($event) => isRef(agreeTerms) ? agreeTerms.value = $event : null,
                    color: "primary",
                    class: "mt-0.5 shrink-0 size-5"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("span", { class: "text-sm text-gray-700 dark:text-gray-300" }, [
                    createTextVNode(" I agree to the "),
                    createVNode(_component_NuxtLink, {
                      to: "/terms",
                      class: "text-flamingo-600 hover:underline dark:text-flamingo-400 font-medium"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Terms of Service")
                      ]),
                      _: 1
                    }),
                    createTextVNode(" and "),
                    createVNode(_component_NuxtLink, {
                      to: "/privacy",
                      class: "text-flamingo-600 hover:underline dark:text-flamingo-400 font-medium"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Privacy Policy")
                      ]),
                      _: 1
                    })
                  ])
                ], 2),
                createVNode(_component_DashboardInlineError, {
                  message: unref(submitAttempted) && !unref(agreeTerms) ? "You must accept the terms to continue." : null
                }, null, 8, ["message"]),
                createVNode(_component_DashboardLoadingButton, {
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
const __nuxt_component_5 = Object.assign(_sfc_main$1, { __name: "AuthSignupForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "signup",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      const _component_UIcon = _sfc_main$f;
      const _component_ThemeCycleButton = __nuxt_component_4;
      const _component_CommonPrintyLogoMark = __nuxt_component_2;
      const _component_CommonPrintyWordmark = __nuxt_component_3;
      const _component_AuthSignupForm = __nuxt_component_5;
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
            _push2(`<span class="grid h-12 w-12 place-items-center rounded-xl shadow-lg transition-transform group-hover:scale-105 overflow-hidden shrink-0" style="${ssrRenderStyle({ "background": "var(--color-primary-600)" })}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CommonPrintyLogoMark, { "img-class": "h-7 w-7" }, null, _parent2, _scopeId));
            _push2(`</span>`);
            _push2(ssrRenderComponent(_component_CommonPrintyWordmark, { "img-class": "h-6 w-auto max-w-[100px]" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", {
                class: "grid h-12 w-12 place-items-center rounded-xl shadow-lg transition-transform group-hover:scale-105 overflow-hidden shrink-0",
                style: { "background": "var(--color-primary-600)" }
              }, [
                createVNode(_component_CommonPrintyLogoMark, { "img-class": "h-7 w-7" })
              ]),
              createVNode(_component_CommonPrintyWordmark, { "img-class": "h-6 w-auto max-w-[100px]" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="text-center mb-8"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Create account</p><h1 class="mt-2 text-2xl font-bold text-[var(--p-text)] sm:text-3xl"> Choose how to use Printy </h1><p class="mt-2 text-sm text-[var(--p-text-muted)]"> Create an account as a client, staff member, shop owner, or start now and create your shop later. </p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm p-6 sm:p-8">`);
      _push(ssrRenderComponent(_component_AuthSignupForm, null, null, _parent));
      _push(`</div><p class="mt-6 text-center text-sm text-[var(--p-text-muted)]"> Already have an account? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/login",
        class: "text-flamingo-600 hover:underline font-medium dark:text-flamingo-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Sign in`);
          } else {
            return [
              createTextVNode("Sign in")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div><aside class="hidden lg:flex lg:w-1/2 lg:min-w-0 shrink-0 flex-col justify-center bg-[var(--p-surface-sunken)] text-[var(--p-text)] p-8 xl:p-12"><h2 class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-8"> What you get with Printy </h2><ul class="space-y-8"><li class="flex gap-5"><div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--p-text)]/10 text-[var(--p-text)]">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-zap",
        class: "w-7 h-7"
      }, null, _parent));
      _push(`</div><div><p class="text-xl font-bold sm:text-2xl">Faster print calculations</p><p class="text-lg text-[var(--p-text-muted)] mt-1 leading-relaxed">See estimated prices as you configure—no manual math.</p></div></li><li class="flex gap-5"><div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--p-text)]/10 text-[var(--p-text)]">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-shield-check",
        class: "w-7 h-7"
      }, null, _parent));
      _push(`</div><div><p class="text-xl font-bold sm:text-2xl">Fewer pricing mistakes</p><p class="text-lg text-[var(--p-text-muted)] mt-1 leading-relaxed">Structured quotes reduce errors and rework.</p></div></li><li class="flex gap-5"><div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--p-text)]/10 text-[var(--p-text)]">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-clipboard-list",
        class: "w-7 h-7"
      }, null, _parent));
      _push(`</div><div><p class="text-xl font-bold sm:text-2xl">Organized quote workflow</p><p class="text-lg text-[var(--p-text-muted)] mt-1 leading-relaxed">Track requests and respond from one place.</p></div></li><li class="flex gap-5"><div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--p-text)]/10 text-[var(--p-text)]">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-store",
        class: "w-7 h-7"
      }, null, _parent));
      _push(`</div><div><p class="text-xl font-bold sm:text-2xl">Professional public shop presence</p><p class="text-lg text-[var(--p-text-muted)] mt-1 leading-relaxed">A clean page where customers find you and request quotes.</p></div></li></ul></aside></div></div>`);
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
//# sourceMappingURL=signup-CFkslXBH.mjs.map
