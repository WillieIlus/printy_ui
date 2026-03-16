import { _ as __nuxt_component_3$1, a as _sfc_main$f, u as useAuthStore, c as _sfc_main$9, d as useRuntimeConfig, n as navigateTo, A as API } from './server.mjs';
import { _ as __nuxt_component_4 } from './ThemeCycleButton-BpHNMUQI.mjs';
import { _ as __nuxt_component_1, a as __nuxt_component_2 } from './PrintyWordmark-D2LPDI6W.mjs';
import { _ as _sfc_main$2 } from './Alert-R7u0l-O4.mjs';
import { F as Form, _ as __nuxt_component_1$1 } from './FormInput-DJBpPoj7.mjs';
import { _ as _sfc_main$3 } from './Checkbox-Z6u0Cf0E.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, unref, isRef, useModel, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { object, string, ref as ref$1 } from 'yup';
import { u as useShopStore } from './shop-D6P1awrr.mjs';
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
import './api-error-D1IYk86E.mjs';

function useSlugAvailability() {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  const checking = ref(false);
  const lastSlug = ref(null);
  const lastResult = ref(null);
  async function checkAvailability(slug) {
    const trimmed = slug.trim().toLowerCase();
    if (!trimmed) {
      lastResult.value = null;
      return false;
    }
    if (lastSlug.value === trimmed && lastResult.value !== null) {
      return lastResult.value;
    }
    checking.value = true;
    lastSlug.value = trimmed;
    try {
      await $fetch(`${apiBase}/${API.publicShopBySlug(trimmed)}`, {
        method: "GET",
        retry: 0
      });
      lastResult.value = false;
      return false;
    } catch (err) {
      const status = err?.statusCode ?? err?.status;
      if (status === 404) {
        lastResult.value = true;
        return true;
      }
      lastResult.value = null;
      return false;
    } finally {
      checking.value = false;
    }
  }
  function reset() {
    lastSlug.value = null;
    lastResult.value = null;
  }
  return {
    checkAvailability,
    checking,
    lastResult,
    reset
  };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SignupWorkspaceForm",
  __ssrInlineRender: true,
  props: {
    "step": { default: 1 },
    "stepModifiers": {}
  },
  emits: ["update:step"],
  setup(__props) {
    const authStore = useAuthStore();
    const shopStore = useShopStore();
    const config = useRuntimeConfig();
    const siteUrl = config.public.siteUrl || "https://printy.ke";
    const step = useModel(__props, "step");
    const shopName = ref("");
    const slugPreview = ref("");
    const slugAvailable = ref(false);
    const agreeTerms = ref(false);
    const loading = ref(false);
    const { checking: slugChecking } = useSlugAvailability();
    const shopNameError = computed(() => {
      const name = shopName.value.trim();
      if (!name) return "";
      if (name.length < 2) return "Shop name must be at least 2 characters";
      return "";
    });
    const canContinueStep1 = computed(() => {
      const name = shopName.value.trim();
      return name.length >= 2 && slugPreview.value && slugAvailable.value && !slugChecking.value;
    });
    const step2Schema = object({
      name: string().required("Your name is required"),
      email: string().email("Invalid email").required("Email is required"),
      password: string().min(8, "Password must be at least 8 characters").matches(/[A-Z]/, "Password must contain an uppercase letter").matches(/[0-9]/, "Password must contain a number").required("Password is required"),
      password_confirm: string().oneOf([ref$1("password")], "Passwords must match").required("Please confirm your password")
    });
    async function onSubmit(values) {
      const name = values.name?.trim() || "";
      const email = values.email?.trim() || "";
      const password = values.password;
      loading.value = true;
      authStore.error = null;
      try {
        const signupResult = await authStore.signup({
          email,
          password,
          password_confirm: password,
          first_name: name.split(" ")[0] || name,
          last_name: name.split(" ").slice(1).join(" ") || ""
        });
        if (!signupResult.success) {
          loading.value = false;
          return;
        }
        const loginResult = await authStore.login(email, password, true);
        if (loginResult.success) {
          const shopResult = await shopStore.createShop({
            name: shopName.value.trim(),
            description: "",
            business_email: email,
            phone_number: "",
            address_line: "",
            city: "Nairobi",
            state: "Nairobi",
            country: "Kenya",
            zip_code: ""
          });
          if (shopResult.success && shopResult.shop) {
            await navigateTo(`/dashboard/shops/${shopResult.shop.slug}/setup`);
            return;
          }
        }
        sessionStorage.setItem("pending_printy_shop_name", shopName.value.trim());
        await navigateTo({ path: "/auth/verify-email", query: { email } });
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = _sfc_main$2;
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      const _component_VeeForm = Form;
      const _component_FormsFormInput = __nuxt_component_1$1;
      const _component_UCheckbox = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_3$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      if (unref(authStore).error) {
        _push(ssrRenderComponent(_component_UAlert, {
          color: "error",
          icon: "i-lucide-alert-circle",
          title: unref(authStore).error,
          class: "rounded-lg",
          close: "",
          "onUpdate:open": (open) => {
            if (!open) unref(authStore).error = null;
          }
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (step.value === 1) {
        _push(`<!--[--><div><label class="block text-sm font-medium text-[var(--p-text)] mb-1.5">Print shop name</label><input${ssrRenderAttr("value", unref(shopName))} type="text" placeholder="e.g. Kaskazini Solutions" class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3 text-[var(--p-text)] placeholder:text-[var(--p-text-muted)] focus:border-flamingo-500 focus:ring-1 focus:ring-flamingo-500 transition-colors">`);
        if (unref(shopNameError)) {
          _push(`<p class="mt-1.5 text-sm text-red-600 dark:text-red-400">${ssrInterpolate(unref(shopNameError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(slugPreview)) {
          _push(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3"><p class="text-xs font-medium text-[var(--p-text-muted)] mb-1">Your public URL</p><p class="text-sm font-mono text-[var(--p-text)]">${ssrInterpolate(unref(siteUrl))}/shops/${ssrInterpolate(unref(slugPreview))}</p><div class="mt-2 flex items-center gap-2">`);
          if (unref(slugPreview) && !unref(slugChecking)) {
            _push(`<span class="${ssrRenderClass([unref(slugAvailable) ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400", "inline-flex items-center gap-1.5 text-xs font-medium"])}">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: unref(slugAvailable) ? "i-lucide-check-circle" : "i-lucide-alert-circle",
              class: "w-3.5 h-3.5"
            }, null, _parent));
            _push(` ${ssrInterpolate(unref(slugAvailable) ? "Available" : "Already taken")}</span>`);
          } else if (unref(slugChecking)) {
            _push(`<span class="inline-flex items-center gap-1.5 text-xs text-[var(--p-text-muted)]">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-loader-2",
              class: "w-3.5 h-3.5 animate-spin"
            }, null, _parent));
            _push(` Checking... </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_UButton, {
          type: "button",
          color: "primary",
          block: "",
          class: "rounded-xl",
          disabled: !unref(canContinueStep1),
          onClick: ($event) => step.value = 2
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Continue `);
            } else {
              return [
                createTextVNode(" Continue ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!--[--><div class="flex items-center gap-2 mb-4"><button type="button" class="text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)] flex items-center gap-1">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-arrow-left",
          class: "w-4 h-4"
        }, null, _parent));
        _push(` Back </button></div><div class="rounded-xl border border-flamingo-200 dark:border-flamingo-800 bg-flamingo-50 dark:bg-flamingo-950/30 px-4 py-3 mb-4"><p class="text-sm font-medium text-flamingo-800 dark:text-flamingo-200">${ssrInterpolate(unref(shopName))}</p><p class="text-xs text-flamingo-600 dark:text-flamingo-400 mt-0.5">printy.ke/shops/${ssrInterpolate(unref(slugPreview))}</p></div>`);
        _push(ssrRenderComponent(_component_VeeForm, {
          "validation-schema": unref(step2Schema),
          onSubmit
        }, {
          default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_FormsFormInput, {
                name: "name",
                label: "Your name",
                placeholder: "John Kamau",
                icon: "i-lucide-user",
                required: ""
              }, null, _parent2, _scopeId));
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
                label: "Confirm password",
                type: "password",
                placeholder: "Confirm your password",
                icon: "i-lucide-lock",
                required: ""
              }, null, _parent2, _scopeId));
              _push2(`<label class="${ssrRenderClass([unref(agreeTerms) ? "border-flamingo-500 bg-flamingo-50 dark:bg-flamingo-950/30 dark:border-flamingo-500" : "border-[var(--p-border)] bg-[var(--p-surface)] hover:border-[var(--p-border)]", "flex items-start gap-3 rounded-xl border-2 px-4 py-3 transition-all cursor-pointer select-none"])}"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UCheckbox, {
                modelValue: unref(agreeTerms),
                "onUpdate:modelValue": ($event) => isRef(agreeTerms) ? agreeTerms.value = $event : null,
                color: "primary",
                class: "mt-0.5 shrink-0 size-5"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-sm text-[var(--p-text-muted)]"${_scopeId}> I agree to the `);
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
              _push2(ssrRenderComponent(_component_UButton, {
                type: "submit",
                color: "primary",
                block: "",
                class: "rounded-xl",
                loading: unref(loading),
                disabled: !meta.valid || !unref(agreeTerms)
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Create workspace `);
                  } else {
                    return [
                      createTextVNode(" Create workspace ")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-4" }, [
                  createVNode(_component_FormsFormInput, {
                    name: "name",
                    label: "Your name",
                    placeholder: "John Kamau",
                    icon: "i-lucide-user",
                    required: ""
                  }),
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
                    label: "Confirm password",
                    type: "password",
                    placeholder: "Confirm your password",
                    icon: "i-lucide-lock",
                    required: ""
                  }),
                  createVNode("label", {
                    class: ["flex items-start gap-3 rounded-xl border-2 px-4 py-3 transition-all cursor-pointer select-none", unref(agreeTerms) ? "border-flamingo-500 bg-flamingo-50 dark:bg-flamingo-950/30 dark:border-flamingo-500" : "border-[var(--p-border)] bg-[var(--p-surface)] hover:border-[var(--p-border)]"]
                  }, [
                    createVNode(_component_UCheckbox, {
                      modelValue: unref(agreeTerms),
                      "onUpdate:modelValue": ($event) => isRef(agreeTerms) ? agreeTerms.value = $event : null,
                      color: "primary",
                      class: "mt-0.5 shrink-0 size-5"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode("span", { class: "text-sm text-[var(--p-text-muted)]" }, [
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
                  createVNode(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    block: "",
                    class: "rounded-xl",
                    loading: unref(loading),
                    disabled: !meta.valid || !unref(agreeTerms)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Create workspace ")
                    ]),
                    _: 1
                  }, 8, ["loading", "disabled"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/SignupWorkspaceForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$1, { __name: "AuthSignupWorkspaceForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "signup",
  __ssrInlineRender: true,
  setup(__props) {
    const step = ref(1);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      const _component_ThemeCycleButton = __nuxt_component_4;
      const _component_CommonPrintyLogoMark = __nuxt_component_1;
      const _component_CommonPrintyWordmark = __nuxt_component_2;
      const _component_AuthSignupWorkspaceForm = __nuxt_component_5;
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
      _push(`</div><div class="text-center mb-8"><h1 class="text-2xl font-bold text-[var(--p-text)]">${ssrInterpolate(unref(step) === 1 ? "Create your print workspace" : "Your details")}</h1><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(step) === 1 ? "Start with your print shop name. Your public page will be ready in seconds." : "Add your name, email, and password to create your workspace.")}</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm p-6 sm:p-8">`);
      _push(ssrRenderComponent(_component_AuthSignupWorkspaceForm, {
        step: unref(step),
        "onUpdate:step": ($event) => isRef(step) ? step.value = $event : null
      }, null, _parent));
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
      _push(`</p></div></div><aside class="hidden lg:flex lg:w-1/2 lg:min-w-0 shrink-0 flex-col justify-center bg-[#1e3a5f] text-white p-8 xl:p-12"><h2 class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-8"> What you get with Printy </h2><ul class="space-y-8"><li class="flex gap-5"><div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-zap",
        class: "w-7 h-7"
      }, null, _parent));
      _push(`</div><div><p class="text-xl font-bold sm:text-2xl">Faster print calculations</p><p class="text-lg text-white/80 mt-1 leading-relaxed">See estimated prices as you configure—no manual math.</p></div></li><li class="flex gap-5"><div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-shield-check",
        class: "w-7 h-7"
      }, null, _parent));
      _push(`</div><div><p class="text-xl font-bold sm:text-2xl">Fewer pricing mistakes</p><p class="text-lg text-white/80 mt-1 leading-relaxed">Structured quotes reduce errors and rework.</p></div></li><li class="flex gap-5"><div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-clipboard-list",
        class: "w-7 h-7"
      }, null, _parent));
      _push(`</div><div><p class="text-xl font-bold sm:text-2xl">Organized quote workflow</p><p class="text-lg text-white/80 mt-1 leading-relaxed">Track requests and respond from one place.</p></div></li><li class="flex gap-5"><div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-store",
        class: "w-7 h-7"
      }, null, _parent));
      _push(`</div><div><p class="text-xl font-bold sm:text-2xl">Professional public shop presence</p><p class="text-lg text-white/80 mt-1 leading-relaxed">A clean page where customers find you and request quotes.</p></div></li></ul></aside></div></div>`);
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
//# sourceMappingURL=signup-BYCPg-sO.mjs.map
