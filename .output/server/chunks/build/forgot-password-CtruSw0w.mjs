import { p as useHead, m as useAuthStore, b as BaseCard, a as BaseButton, n as navigateTo, _ as __nuxt_component_0$2, i as getApiErrorDetail, j as getApiErrorMessage } from './server.mjs';
import { defineComponent, ref, mergeProps, withCtx, unref, isRef, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, withModifiers, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { A as AuthShell } from './AuthShell-BP3gSrVK.mjs';
import { B as BaseInput } from './BaseInput-BGy7Y2Dg.mjs';
import { P as PrintyLogo } from './PrintyLogo-bSA8QTQF.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@vue/shared';
import './BasePage-6cyv7-ti.mjs';

const emailIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>';
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "forgot-password",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Printy - Forgot Password"
    });
    const auth = useAuthStore();
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const email = ref("");
    const loading = ref(false);
    const status = ref("success");
    const statusMessage = ref("");
    const fieldErrors = ref({});
    const checklist = [
      "Uses the same secure auth shell as sign in",
      "Does not reveal whether an account exists",
      "Sends you to the frontend reset page from the email"
    ];
    async function submit() {
      loading.value = true;
      statusMessage.value = "";
      fieldErrors.value = {};
      if (!email.value.trim()) {
        fieldErrors.value.email = "Email address is required.";
        loading.value = false;
        return;
      }
      try {
        await auth.forgotPassword(email.value.trim());
        status.value = "success";
        statusMessage.value = "If an account exists for this email, we've sent password reset instructions.";
      } catch (error) {
        status.value = "error";
        fieldErrors.value = normalizeApiFieldErrors(error);
        statusMessage.value = resolveForgotPasswordErrorMessage(error);
      } finally {
        loading.value = false;
      }
    }
    function resolveForgotPasswordErrorMessage(error) {
      const detail = String(getApiErrorDetail(error) || "").toLowerCase();
      if (detail.includes("server")) {
        return "We could not reach Printy's server. Please check that the API is running and try again.";
      }
      return getApiErrorMessage(error, "Printy could not send reset instructions.");
    }
    function normalizeApiFieldErrors(error) {
      const data = typeof error === "object" && error && "data" in error ? error.data : void 0;
      if (!data) {
        return {};
      }
      const next = {};
      const emailError = data.email;
      if (Array.isArray(emailError)) {
        next.email = emailError.map((item) => String(item)).join(" ");
      } else if (typeof emailError === "string") {
        next.email = emailError;
      }
      return next;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(ssrRenderComponent(AuthShell, mergeProps({ mode: "reset" }, _attrs), {
        side: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="inline-flex items-center gap-2 bg-[#1d2939] border border-[#2d3f55] rounded-full px-3.5 py-1.5 mb-8"${_scopeId}><span class="w-1.5 h-1.5 rounded-full bg-[#e13515]"${_scopeId}></span><span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#667085]"${_scopeId}>Password recovery</span></div><h1 class="text-[2.4rem] xl:text-[2.75rem] font-extrabold text-white leading-[1.15] tracking-tight mb-5"${_scopeId}> Recover access<br${_scopeId}> without losing<br${_scopeId}><span class="text-[#e13515]"${_scopeId}>your workflow.</span></h1><p class="text-[#98a2b3] text-[15px] leading-relaxed mb-10 max-w-sm"${_scopeId}> Request a secure reset link to get back to quotes, artwork reviews, payment tracking, and delivery updates. </p><ul class="space-y-3.5"${_scopeId}><!--[-->`);
            ssrRenderList(checklist, (item) => {
              _push2(`<li class="flex items-center gap-3.5"${_scopeId}><div class="w-5 h-5 rounded-full bg-[#e13515] flex items-center justify-center shrink-0"${_scopeId}><svg class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"${_scopeId}><path d="M5 13l4 4L19 7"${_scopeId}></path></svg></div><span class="text-[14px] text-[#d0d5dd]"${_scopeId}>${ssrInterpolate(item)}</span></li>`);
            });
            _push2(`<!--]--></ul>`);
          } else {
            return [
              createVNode("div", { class: "inline-flex items-center gap-2 bg-[#1d2939] border border-[#2d3f55] rounded-full px-3.5 py-1.5 mb-8" }, [
                createVNode("span", { class: "w-1.5 h-1.5 rounded-full bg-[#e13515]" }),
                createVNode("span", { class: "text-[11px] font-semibold uppercase tracking-[0.12em] text-[#667085]" }, "Password recovery")
              ]),
              createVNode("h1", { class: "text-[2.4rem] xl:text-[2.75rem] font-extrabold text-white leading-[1.15] tracking-tight mb-5" }, [
                createTextVNode(" Recover access"),
                createVNode("br"),
                createTextVNode(" without losing"),
                createVNode("br"),
                createVNode("span", { class: "text-[#e13515]" }, "your workflow.")
              ]),
              createVNode("p", { class: "text-[#98a2b3] text-[15px] leading-relaxed mb-10 max-w-sm" }, " Request a secure reset link to get back to quotes, artwork reviews, payment tracking, and delivery updates. "),
              createVNode("ul", { class: "space-y-3.5" }, [
                (openBlock(), createBlock(Fragment, null, renderList(checklist, (item) => {
                  return createVNode("li", {
                    key: item,
                    class: "flex items-center gap-3.5"
                  }, [
                    createVNode("div", { class: "w-5 h-5 rounded-full bg-[#e13515] flex items-center justify-center shrink-0" }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-2.5 h-2.5 text-white",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "3.5"
                      }, [
                        createVNode("path", { d: "M5 13l4 4L19 7" })
                      ]))
                    ]),
                    createVNode("span", { class: "text-[14px] text-[#d0d5dd]" }, toDisplayString(item), 1)
                  ]);
                }), 64))
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-full max-w-[520px]"${_scopeId}><div class="flex items-center gap-2 mb-7 lg:hidden"${_scopeId}>`);
            _push2(ssrRenderComponent(PrintyLogo, {
              variant: "full",
              size: "md",
              to: "/"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(BaseCard, {
              variant: "elevated",
              padding: "xl",
              radius: "xl"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="mb-7"${_scopeId2}><h2 class="text-[1.55rem] font-extrabold text-[#101828] tracking-tight mb-1.5"${_scopeId2}>Forgot your password?</h2><p class="text-[14px] text-[#667085]"${_scopeId2}>Enter your email and we&#39;ll send reset instructions if the account exists.</p></div>`);
                  if (unref(statusMessage)) {
                    _push3(`<div class="${ssrRenderClass([unref(status) === "success" ? "border-[#abefc6] bg-[#ecfdf3]" : "border-[#fda29b] bg-[#fef3f2]", "rounded-lg border px-4 py-3 mb-5"])}"${_scopeId2}><p class="${ssrRenderClass([unref(status) === "success" ? "text-[#067647]" : "text-[#b42318]", "text-[12px] font-semibold mb-1"])}"${_scopeId2}>${ssrInterpolate(unref(status) === "success" ? "Reset email sent" : "Reset request failed")}</p><p class="${ssrRenderClass([unref(status) === "success" ? "text-[#067647]" : "text-[#b42318]", "text-[12px] leading-snug"])}"${_scopeId2}>${ssrInterpolate(unref(statusMessage))}</p></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<form class="space-y-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(BaseInput, {
                    modelValue: unref(email),
                    "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                    type: "email",
                    label: "Email address",
                    placeholder: "you@company.com",
                    autocomplete: "email",
                    disabled: unref(loading),
                    error: unref(fieldErrors).email,
                    variant: "auth",
                    "icon-left": emailIcon
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="flex flex-col sm:flex-row gap-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(BaseButton, {
                    type: "submit",
                    variant: "primary",
                    size: "lg",
                    disabled: unref(loading),
                    loading: unref(loading)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(loading) ? "Sending instructions" : "Send reset instructions")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(loading) ? "Sending instructions" : "Send reset instructions"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(BaseButton, {
                    type: "button",
                    variant: "secondary",
                    size: "lg",
                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/auth/login")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Back to sign in `);
                      } else {
                        return [
                          createTextVNode(" Back to sign in ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("div", { class: "mb-7" }, [
                      createVNode("h2", { class: "text-[1.55rem] font-extrabold text-[#101828] tracking-tight mb-1.5" }, "Forgot your password?"),
                      createVNode("p", { class: "text-[14px] text-[#667085]" }, "Enter your email and we'll send reset instructions if the account exists.")
                    ]),
                    unref(statusMessage) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: ["rounded-lg border px-4 py-3 mb-5", unref(status) === "success" ? "border-[#abefc6] bg-[#ecfdf3]" : "border-[#fda29b] bg-[#fef3f2]"]
                    }, [
                      createVNode("p", {
                        class: ["text-[12px] font-semibold mb-1", unref(status) === "success" ? "text-[#067647]" : "text-[#b42318]"]
                      }, toDisplayString(unref(status) === "success" ? "Reset email sent" : "Reset request failed"), 3),
                      createVNode("p", {
                        class: ["text-[12px] leading-snug", unref(status) === "success" ? "text-[#067647]" : "text-[#b42318]"]
                      }, toDisplayString(unref(statusMessage)), 3)
                    ], 2)) : createCommentVNode("", true),
                    createVNode("form", {
                      class: "space-y-4",
                      onSubmit: withModifiers(submit, ["prevent"])
                    }, [
                      createVNode(BaseInput, {
                        modelValue: unref(email),
                        "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                        type: "email",
                        label: "Email address",
                        placeholder: "you@company.com",
                        autocomplete: "email",
                        disabled: unref(loading),
                        error: unref(fieldErrors).email,
                        variant: "auth",
                        "icon-left": emailIcon
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "error"]),
                      createVNode("div", { class: "flex flex-col sm:flex-row gap-3" }, [
                        createVNode(BaseButton, {
                          type: "submit",
                          variant: "primary",
                          size: "lg",
                          disabled: unref(loading),
                          loading: unref(loading)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(loading) ? "Sending instructions" : "Send reset instructions"), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled", "loading"]),
                        createVNode(BaseButton, {
                          type: "button",
                          variant: "secondary",
                          size: "lg",
                          onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/auth/login")
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Back to sign in ")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ])
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="mt-6 flex items-center justify-center gap-5"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/",
              class: "text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Privacy`);
                } else {
                  return [
                    createTextVNode("Privacy")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<span class="text-[#d0d5dd]"${_scopeId}>·</span>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/",
              class: "text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Terms`);
                } else {
                  return [
                    createTextVNode("Terms")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<span class="text-[#d0d5dd]"${_scopeId}>·</span>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/login",
              class: "text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors"
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
            _push2(`<span class="text-[#d0d5dd]"${_scopeId}>·</span><span class="text-[12px] text-[#98a2b3]"${_scopeId}>© ${ssrInterpolate(unref(currentYear))} Printy</span></div></div>`);
          } else {
            return [
              createVNode("div", { class: "w-full max-w-[520px]" }, [
                createVNode("div", { class: "flex items-center gap-2 mb-7 lg:hidden" }, [
                  createVNode(PrintyLogo, {
                    variant: "full",
                    size: "md",
                    to: "/"
                  })
                ]),
                createVNode(BaseCard, {
                  variant: "elevated",
                  padding: "xl",
                  radius: "xl"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "mb-7" }, [
                      createVNode("h2", { class: "text-[1.55rem] font-extrabold text-[#101828] tracking-tight mb-1.5" }, "Forgot your password?"),
                      createVNode("p", { class: "text-[14px] text-[#667085]" }, "Enter your email and we'll send reset instructions if the account exists.")
                    ]),
                    unref(statusMessage) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: ["rounded-lg border px-4 py-3 mb-5", unref(status) === "success" ? "border-[#abefc6] bg-[#ecfdf3]" : "border-[#fda29b] bg-[#fef3f2]"]
                    }, [
                      createVNode("p", {
                        class: ["text-[12px] font-semibold mb-1", unref(status) === "success" ? "text-[#067647]" : "text-[#b42318]"]
                      }, toDisplayString(unref(status) === "success" ? "Reset email sent" : "Reset request failed"), 3),
                      createVNode("p", {
                        class: ["text-[12px] leading-snug", unref(status) === "success" ? "text-[#067647]" : "text-[#b42318]"]
                      }, toDisplayString(unref(statusMessage)), 3)
                    ], 2)) : createCommentVNode("", true),
                    createVNode("form", {
                      class: "space-y-4",
                      onSubmit: withModifiers(submit, ["prevent"])
                    }, [
                      createVNode(BaseInput, {
                        modelValue: unref(email),
                        "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                        type: "email",
                        label: "Email address",
                        placeholder: "you@company.com",
                        autocomplete: "email",
                        disabled: unref(loading),
                        error: unref(fieldErrors).email,
                        variant: "auth",
                        "icon-left": emailIcon
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "error"]),
                      createVNode("div", { class: "flex flex-col sm:flex-row gap-3" }, [
                        createVNode(BaseButton, {
                          type: "submit",
                          variant: "primary",
                          size: "lg",
                          disabled: unref(loading),
                          loading: unref(loading)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(loading) ? "Sending instructions" : "Send reset instructions"), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled", "loading"]),
                        createVNode(BaseButton, {
                          type: "button",
                          variant: "secondary",
                          size: "lg",
                          onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/auth/login")
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Back to sign in ")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ])
                    ], 32)
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "mt-6 flex items-center justify-center gap-5" }, [
                  createVNode(_component_NuxtLink, {
                    to: "/",
                    class: "text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Privacy")
                    ]),
                    _: 1
                  }),
                  createVNode("span", { class: "text-[#d0d5dd]" }, "·"),
                  createVNode(_component_NuxtLink, {
                    to: "/",
                    class: "text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Terms")
                    ]),
                    _: 1
                  }),
                  createVNode("span", { class: "text-[#d0d5dd]" }, "·"),
                  createVNode(_component_NuxtLink, {
                    to: "/auth/login",
                    class: "text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Sign in")
                    ]),
                    _: 1
                  }),
                  createVNode("span", { class: "text-[#d0d5dd]" }, "·"),
                  createVNode("span", { class: "text-[12px] text-[#98a2b3]" }, "© " + toDisplayString(unref(currentYear)) + " Printy", 1)
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/forgot-password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=forgot-password-CtruSw0w.mjs.map
