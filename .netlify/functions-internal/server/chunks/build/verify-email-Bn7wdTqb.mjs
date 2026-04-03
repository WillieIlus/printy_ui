import { f as useRoute, I as useRouter, L as __nuxt_component_0, a as _sfc_main$f, b as _sfc_main$9, _ as __nuxt_component_1, m as useNuxtApp, A as API, p as parseApiError } from './server.mjs';
import { F as Form, _ as __nuxt_component_2, a as Field } from './FormInput-Ci9MIR6u.mjs';
import { _ as _sfc_main$1 } from './Alert-BQjQ5uNh.mjs';
import { defineComponent, computed, ref, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, Fragment, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { object, string } from 'yup';
import { u as useNotification } from './useNotification-DxMfmZhF.mjs';
import { s as setInterval } from './interval-DiSDr_Za.mjs';
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

async function verifyEmail(payload) {
  try {
    const { $api } = useNuxtApp();
    await $api(API.auth.verifyEmail, {
      method: "POST",
      body: {
        email: payload.email,
        code: payload.code
      }
    });
    return { success: true };
  } catch (err) {
    const message = parseApiError(err, "Verification failed");
    return { success: false, error: message };
  }
}
async function resendVerification(payload) {
  try {
    const { $api } = useNuxtApp();
    await $api(API.auth.resendVerification, {
      method: "POST",
      body: {
        email: payload.email
      }
    });
    return { success: true };
  } catch (err) {
    const message = parseApiError(err, "Failed to resend verification code");
    return { success: false, error: message };
  }
}
const RESEND_COOLDOWN_SEC = 30;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "verify-email",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const notification = useNotification();
    const email = computed(() => {
      const e = route.query.email;
      return typeof e === "string" ? e : "";
    });
    const loading = ref(false);
    const error = ref(null);
    const success = ref(false);
    const resendCooldown = ref(0);
    let cooldownInterval = null;
    const verifySchema = object({
      email: string().email("Invalid email").required("Email is required"),
      code: string().length(6, "Code must be 6 digits").matches(/^\d{6}$/, "Code must be 6 digits").required("Verification code is required")
    });
    function startResendCooldown() {
      resendCooldown.value = RESEND_COOLDOWN_SEC;
      if (cooldownInterval) clearInterval(cooldownInterval);
      cooldownInterval = setInterval();
    }
    async function onSubmit(values) {
      const e = values.email || email.value;
      const code = values.code;
      if (!e) {
        error.value = "Email is required";
        return;
      }
      loading.value = true;
      error.value = null;
      try {
        const result = await verifyEmail({ email: e, code });
        if (result.success) {
          success.value = true;
          notification.success("Email verified! You can now sign in.");
          await router.push({ path: "/auth/login", query: { verified: "1", email: e } });
        } else {
          error.value = result.error ?? "Verification failed";
          notification.error(result.error ?? "Verification failed");
        }
      } finally {
        loading.value = false;
      }
    }
    async function onResend() {
      if (!email.value || resendCooldown.value > 0) return;
      loading.value = true;
      error.value = null;
      try {
        const result = await resendVerification({ email: email.value });
        if (result.success) {
          notification.success("Verification code sent! Check your email.");
          startResendCooldown();
        } else {
          error.value = result.error ?? "Failed to resend";
          notification.error(result.error ?? "Failed to resend verification code");
        }
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_VeeForm = Form;
      const _component_UAlert = _sfc_main$1;
      const _component_FormsFormInput = __nuxt_component_2;
      const _component_VeeField = Field;
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      const _component_NuxtLink = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_NuxtLayout, {
        name: "auth",
        title: "Verify your email",
        subtitle: "We sent a 6-digit code to your email. Enter it below.",
        "back-to": "/auth/login"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_VeeForm, {
              "validation-schema": unref(verifySchema),
              onSubmit
            }, {
              default: withCtx(({ meta }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-4"${_scopeId2}>`);
                  if (unref(error)) {
                    _push3(ssrRenderComponent(_component_UAlert, {
                      color: "error",
                      icon: "i-lucide-alert-circle",
                      title: unref(error),
                      class: "rounded-lg",
                      close: "",
                      "onUpdate:open": (open) => {
                        if (!open) error.value = null;
                      }
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(success)) {
                    _push3(ssrRenderComponent(_component_UAlert, {
                      color: "success",
                      icon: "i-lucide-check-circle",
                      title: "Email verified! Redirecting to login...",
                      class: "rounded-lg"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (!unref(email)) {
                    _push3(ssrRenderComponent(_component_FormsFormInput, {
                      name: "email",
                      label: "Email",
                      type: "email",
                      placeholder: "you@example.com",
                      icon: "i-lucide-mail"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!--[-->`);
                    _push3(ssrRenderComponent(_component_VeeField, {
                      name: "email",
                      "model-value": unref(email),
                      type: "hidden"
                    }, null, _parent3, _scopeId2));
                    _push3(`<div class="space-y-1"${_scopeId2}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300"${_scopeId2}>Email</label><div class="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-600 dark:text-gray-400"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-mail",
                      class: "h-4 w-4 shrink-0"
                    }, null, _parent3, _scopeId2));
                    _push3(` ${ssrInterpolate(unref(email))}</div></div><!--]-->`);
                  }
                  _push3(ssrRenderComponent(_component_FormsFormInput, {
                    name: "code",
                    label: "Verification code",
                    type: "text",
                    placeholder: "000000",
                    icon: "i-lucide-key-round",
                    maxlength: "6",
                    inputmode: "numeric",
                    autocomplete: "one-time-code",
                    class: "font-mono text-lg tracking-widest"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    block: "",
                    loading: unref(loading),
                    disabled: !meta.valid || unref(loading) || !!unref(success)
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Verify Email `);
                      } else {
                        return [
                          createTextVNode(" Verify Email ")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`<div class="flex items-center justify-center gap-2"${_scopeId2}><span class="text-sm text-gray-600 dark:text-gray-400"${_scopeId2}>Didn&#39;t receive the code?</span>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    variant: "link",
                    size: "sm",
                    disabled: unref(resendCooldown) > 0,
                    onClick: onResend
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(resendCooldown) > 0 ? `Resend in ${unref(resendCooldown)}s` : "Resend code")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(resendCooldown) > 0 ? `Resend in ${unref(resendCooldown)}s` : "Resend code"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`</div><p class="text-center text-sm text-gray-600 dark:text-gray-400"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: "/auth/login",
                    class: "text-primary-600 hover:underline font-medium dark:text-primary-400"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Back to sign in `);
                      } else {
                        return [
                          createTextVNode(" Back to sign in ")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-4" }, [
                      unref(error) ? (openBlock(), createBlock(_component_UAlert, {
                        key: 0,
                        color: "error",
                        icon: "i-lucide-alert-circle",
                        title: unref(error),
                        class: "rounded-lg",
                        close: "",
                        "onUpdate:open": (open) => {
                          if (!open) error.value = null;
                        }
                      }, null, 8, ["title", "onUpdate:open"])) : createCommentVNode("", true),
                      unref(success) ? (openBlock(), createBlock(_component_UAlert, {
                        key: 1,
                        color: "success",
                        icon: "i-lucide-check-circle",
                        title: "Email verified! Redirecting to login...",
                        class: "rounded-lg"
                      })) : createCommentVNode("", true),
                      !unref(email) ? (openBlock(), createBlock(_component_FormsFormInput, {
                        key: 2,
                        name: "email",
                        label: "Email",
                        type: "email",
                        placeholder: "you@example.com",
                        icon: "i-lucide-mail"
                      })) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                        createVNode(_component_VeeField, {
                          name: "email",
                          "model-value": unref(email),
                          type: "hidden"
                        }, null, 8, ["model-value"]),
                        createVNode("div", { class: "space-y-1" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Email"),
                          createVNode("div", { class: "flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-600 dark:text-gray-400" }, [
                            createVNode(_component_UIcon, {
                              name: "i-lucide-mail",
                              class: "h-4 w-4 shrink-0"
                            }),
                            createTextVNode(" " + toDisplayString(unref(email)), 1)
                          ])
                        ])
                      ], 64)),
                      createVNode(_component_FormsFormInput, {
                        name: "code",
                        label: "Verification code",
                        type: "text",
                        placeholder: "000000",
                        icon: "i-lucide-key-round",
                        maxlength: "6",
                        inputmode: "numeric",
                        autocomplete: "one-time-code",
                        class: "font-mono text-lg tracking-widest"
                      }),
                      createVNode(_component_UButton, {
                        type: "submit",
                        color: "primary",
                        block: "",
                        loading: unref(loading),
                        disabled: !meta.valid || unref(loading) || !!unref(success)
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Verify Email ")
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled"]),
                      createVNode("div", { class: "flex items-center justify-center gap-2" }, [
                        createVNode("span", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Didn't receive the code?"),
                        createVNode(_component_UButton, {
                          variant: "link",
                          size: "sm",
                          disabled: unref(resendCooldown) > 0,
                          onClick: onResend
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(resendCooldown) > 0 ? `Resend in ${unref(resendCooldown)}s` : "Resend code"), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ]),
                      createVNode("p", { class: "text-center text-sm text-gray-600 dark:text-gray-400" }, [
                        createVNode(_component_NuxtLink, {
                          to: "/auth/login",
                          class: "text-primary-600 hover:underline font-medium dark:text-primary-400"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Back to sign in ")
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_VeeForm, {
                "validation-schema": unref(verifySchema),
                onSubmit
              }, {
                default: withCtx(({ meta }) => [
                  createVNode("div", { class: "space-y-4" }, [
                    unref(error) ? (openBlock(), createBlock(_component_UAlert, {
                      key: 0,
                      color: "error",
                      icon: "i-lucide-alert-circle",
                      title: unref(error),
                      class: "rounded-lg",
                      close: "",
                      "onUpdate:open": (open) => {
                        if (!open) error.value = null;
                      }
                    }, null, 8, ["title", "onUpdate:open"])) : createCommentVNode("", true),
                    unref(success) ? (openBlock(), createBlock(_component_UAlert, {
                      key: 1,
                      color: "success",
                      icon: "i-lucide-check-circle",
                      title: "Email verified! Redirecting to login...",
                      class: "rounded-lg"
                    })) : createCommentVNode("", true),
                    !unref(email) ? (openBlock(), createBlock(_component_FormsFormInput, {
                      key: 2,
                      name: "email",
                      label: "Email",
                      type: "email",
                      placeholder: "you@example.com",
                      icon: "i-lucide-mail"
                    })) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                      createVNode(_component_VeeField, {
                        name: "email",
                        "model-value": unref(email),
                        type: "hidden"
                      }, null, 8, ["model-value"]),
                      createVNode("div", { class: "space-y-1" }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Email"),
                        createVNode("div", { class: "flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-600 dark:text-gray-400" }, [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-mail",
                            class: "h-4 w-4 shrink-0"
                          }),
                          createTextVNode(" " + toDisplayString(unref(email)), 1)
                        ])
                      ])
                    ], 64)),
                    createVNode(_component_FormsFormInput, {
                      name: "code",
                      label: "Verification code",
                      type: "text",
                      placeholder: "000000",
                      icon: "i-lucide-key-round",
                      maxlength: "6",
                      inputmode: "numeric",
                      autocomplete: "one-time-code",
                      class: "font-mono text-lg tracking-widest"
                    }),
                    createVNode(_component_UButton, {
                      type: "submit",
                      color: "primary",
                      block: "",
                      loading: unref(loading),
                      disabled: !meta.valid || unref(loading) || !!unref(success)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Verify Email ")
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled"]),
                    createVNode("div", { class: "flex items-center justify-center gap-2" }, [
                      createVNode("span", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Didn't receive the code?"),
                      createVNode(_component_UButton, {
                        variant: "link",
                        size: "sm",
                        disabled: unref(resendCooldown) > 0,
                        onClick: onResend
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(resendCooldown) > 0 ? `Resend in ${unref(resendCooldown)}s` : "Resend code"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    createVNode("p", { class: "text-center text-sm text-gray-600 dark:text-gray-400" }, [
                      createVNode(_component_NuxtLink, {
                        to: "/auth/login",
                        class: "text-primary-600 hover:underline font-medium dark:text-primary-400"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Back to sign in ")
                        ]),
                        _: 1
                      })
                    ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/verify-email.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=verify-email-Bn7wdTqb.mjs.map
