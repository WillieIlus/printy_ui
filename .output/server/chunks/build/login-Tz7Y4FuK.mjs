import { p as useHead, m as useAuthStore, q as useRoute, _ as __nuxt_component_0$2, b as BaseCard, a as BaseButton, n as navigateTo, i as getApiErrorDetail, j as getApiErrorMessage } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, unref, createTextVNode, isRef, createVNode, openBlock, createBlock, toDisplayString, withModifiers, createCommentVNode, withDirectives, vModelCheckbox, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderList } from 'vue/server-renderer';
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
const lockIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>';
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Printy - Sign In"
    });
    const auth = useAuthStore();
    const route = useRoute();
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const email = ref("");
    const password = ref("");
    const rememberMe = ref(false);
    const loading = ref(false);
    const showPassword = ref(false);
    const errorMessage = ref("");
    const fieldErrors = ref({});
    const nextRoute = computed(() => typeof route.query.next === "string" ? route.query.next : "");
    const redirectRoute = computed(() => typeof route.query.redirect === "string" ? route.query.redirect : "");
    const pendingQuoteFlag = computed(() => route.query.pendingQuote === "1");
    function buildRegisterLink(role) {
      const params = new URLSearchParams();
      if (role) {
        params.set("role", role);
      }
      if (nextRoute.value) {
        params.set("next", nextRoute.value);
      }
      if (pendingQuoteFlag.value) {
        params.set("pendingQuote", "1");
      }
      const query = params.toString();
      return query ? `/auth/register?${query}` : "/auth/register";
    }
    const clientRegisterLink = computed(() => buildRegisterLink());
    const partnerRegisterLink = computed(() => buildRegisterLink("partner"));
    const shopRegisterLink = computed(() => buildRegisterLink("production"));
    const features = [
      {
        title: "Instant estimates",
        copy: "Imposition-based pricing with market-calibrated ranges",
        icon: '<svg class="w-4 h-4 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>'
      },
      {
        title: "Payment-confirmed jobs",
        copy: "Production only starts after secure payment is cleared",
        icon: '<svg class="w-4 h-4 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>'
      },
      {
        title: "Artwork and proof tracking",
        copy: "Submit, review, and approve files directly in-platform",
        icon: '<svg class="w-4 h-4 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
      },
      {
        title: "Tracked fulfilment",
        copy: "From quote approval to delivery, every status stays in one place",
        icon: '<svg class="w-4 h-4 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>'
      }
    ];
    async function submit() {
      loading.value = true;
      errorMessage.value = "";
      fieldErrors.value = {};
      if (!email.value.trim()) {
        fieldErrors.value.email = "Email address is required.";
      }
      if (!password.value) {
        fieldErrors.value.password = "Password is required.";
      }
      if (Object.keys(fieldErrors.value).length > 0) {
        loading.value = false;
        return;
      }
      try {
        await auth.login({ email: email.value.trim(), password: password.value }, { rememberMe: rememberMe.value });
        await navigateTo(nextRoute.value || redirectRoute.value || auth.homeRoute);
      } catch (error) {
        const data = typeof error === "object" && error && "data" in error ? error.data : void 0;
        fieldErrors.value = normalizeApiFieldErrors(data);
        errorMessage.value = resolveLoginErrorMessage(error);
      } finally {
        loading.value = false;
      }
    }
    function resolveLoginErrorMessage(error) {
      const detail = String(getApiErrorDetail(error) || "").toLowerCase();
      if (detail.includes("not verified")) {
        return "Please verify your email before signing in. Resend verification?";
      }
      if (detail.includes("no active account") || detail.includes("incorrect")) {
        return "The email or password is incorrect.";
      }
      return getApiErrorMessage(error, "Printy could not log you in.");
    }
    function normalizeApiFieldErrors(data) {
      if (!data) {
        return {};
      }
      const next = {};
      for (const [key, value] of Object.entries(data)) {
        if (key === "email" || key === "password") {
          if (Array.isArray(value)) {
            next[key] = value.map((item) => String(item)).join(" ");
          } else if (typeof value === "string") {
            next[key] = value;
          }
        }
      }
      return next;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(ssrRenderComponent(AuthShell, mergeProps({ mode: "login" }, _attrs), {
        side: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="inline-flex items-center gap-2 bg-[#1d2939] border border-[#2d3f55] rounded-full px-3.5 py-1.5 mb-8"${_scopeId}><span class="w-1.5 h-1.5 rounded-full bg-[#e13515]"${_scopeId}></span><span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#667085]"${_scopeId}>Kenya&#39;s Print Operating System</span></div><h1 class="text-[2.6rem] xl:text-[3rem] font-extrabold text-white leading-[1.15] tracking-tight mb-5"${_scopeId}> Manage print jobs<br${_scopeId}> from quote<br${_scopeId}><span class="text-[#e13515]"${_scopeId}>to delivery.</span></h1><p class="text-[#98a2b3] text-[15px] leading-relaxed mb-10 max-w-sm"${_scopeId}> Sign in to track jobs, manage quotes, and keep every print order organized - all in one place. </p><ul class="space-y-4"${_scopeId}><!--[-->`);
            ssrRenderList(features, (feature) => {
              _push2(`<li class="flex items-center gap-4"${_scopeId}><div class="w-9 h-9 rounded-xl bg-[#1d2939] border border-[#2d3f55] flex items-center justify-center shrink-0"${_scopeId}>${feature.icon ?? ""}</div><div${_scopeId}><p class="text-[14px] font-semibold text-white"${_scopeId}>${ssrInterpolate(feature.title)}</p><p class="text-[12px] text-[#667085] mt-0.5"${_scopeId}>${ssrInterpolate(feature.copy)}</p></div></li>`);
            });
            _push2(`<!--]--></ul>`);
          } else {
            return [
              createVNode("div", { class: "inline-flex items-center gap-2 bg-[#1d2939] border border-[#2d3f55] rounded-full px-3.5 py-1.5 mb-8" }, [
                createVNode("span", { class: "w-1.5 h-1.5 rounded-full bg-[#e13515]" }),
                createVNode("span", { class: "text-[11px] font-semibold uppercase tracking-[0.12em] text-[#667085]" }, "Kenya's Print Operating System")
              ]),
              createVNode("h1", { class: "text-[2.6rem] xl:text-[3rem] font-extrabold text-white leading-[1.15] tracking-tight mb-5" }, [
                createTextVNode(" Manage print jobs"),
                createVNode("br"),
                createTextVNode(" from quote"),
                createVNode("br"),
                createVNode("span", { class: "text-[#e13515]" }, "to delivery.")
              ]),
              createVNode("p", { class: "text-[#98a2b3] text-[15px] leading-relaxed mb-10 max-w-sm" }, " Sign in to track jobs, manage quotes, and keep every print order organized - all in one place. "),
              createVNode("ul", { class: "space-y-4" }, [
                (openBlock(), createBlock(Fragment, null, renderList(features, (feature) => {
                  return createVNode("li", {
                    key: feature.title,
                    class: "flex items-center gap-4"
                  }, [
                    createVNode("div", {
                      class: "w-9 h-9 rounded-xl bg-[#1d2939] border border-[#2d3f55] flex items-center justify-center shrink-0",
                      innerHTML: feature.icon
                    }, null, 8, ["innerHTML"]),
                    createVNode("div", null, [
                      createVNode("p", { class: "text-[14px] font-semibold text-white" }, toDisplayString(feature.title), 1),
                      createVNode("p", { class: "text-[12px] text-[#667085] mt-0.5" }, toDisplayString(feature.copy), 1)
                    ])
                  ]);
                }), 64))
              ])
            ];
          }
        }),
        sideFooter: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="border-t border-[#1d2939] pt-7"${_scopeId}><div class="flex items-start gap-4"${_scopeId}><div class="shrink-0"${_scopeId}><div class="flex -space-x-2"${_scopeId}><div class="w-8 h-8 rounded-full bg-[#e13515] border-2 border-[#101828] flex items-center justify-center"${_scopeId}><span class="text-[10px] font-bold text-white"${_scopeId}>MK</span></div><div class="w-8 h-8 rounded-full bg-[#344054] border-2 border-[#101828] flex items-center justify-center"${_scopeId}><span class="text-[10px] font-bold text-white"${_scopeId}>JN</span></div><div class="w-8 h-8 rounded-full bg-[#1d2939] border-2 border-[#101828] flex items-center justify-center"${_scopeId}><span class="text-[10px] font-bold text-[#98a2b3]"${_scopeId}>+4</span></div></div></div><div${_scopeId}><p class="text-[13px] text-[#98a2b3] leading-snug"${_scopeId}> Trusted by clients, partner teams, and production shops across Nairobi. </p><div class="flex items-center gap-1 mt-1.5"${_scopeId}><!--[-->`);
            ssrRenderList(5, (star) => {
              _push2(`<svg class="w-3.5 h-3.5 text-[#e13515]" viewBox="0 0 24 24" fill="currentColor"${_scopeId}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"${_scopeId}></path></svg>`);
            });
            _push2(`<!--]--><span class="text-[11px] text-[#475467] ml-1"${_scopeId}>Verified platform</span></div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "border-t border-[#1d2939] pt-7" }, [
                createVNode("div", { class: "flex items-start gap-4" }, [
                  createVNode("div", { class: "shrink-0" }, [
                    createVNode("div", { class: "flex -space-x-2" }, [
                      createVNode("div", { class: "w-8 h-8 rounded-full bg-[#e13515] border-2 border-[#101828] flex items-center justify-center" }, [
                        createVNode("span", { class: "text-[10px] font-bold text-white" }, "MK")
                      ]),
                      createVNode("div", { class: "w-8 h-8 rounded-full bg-[#344054] border-2 border-[#101828] flex items-center justify-center" }, [
                        createVNode("span", { class: "text-[10px] font-bold text-white" }, "JN")
                      ]),
                      createVNode("div", { class: "w-8 h-8 rounded-full bg-[#1d2939] border-2 border-[#101828] flex items-center justify-center" }, [
                        createVNode("span", { class: "text-[10px] font-bold text-[#98a2b3]" }, "+4")
                      ])
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-[13px] text-[#98a2b3] leading-snug" }, " Trusted by clients, partner teams, and production shops across Nairobi. "),
                    createVNode("div", { class: "flex items-center gap-1 mt-1.5" }, [
                      (openBlock(), createBlock(Fragment, null, renderList(5, (star) => {
                        return createVNode("svg", {
                          key: star,
                          class: "w-3.5 h-3.5 text-[#e13515]",
                          viewBox: "0 0 24 24",
                          fill: "currentColor"
                        }, [
                          createVNode("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" })
                        ]);
                      }), 64)),
                      createVNode("span", { class: "text-[11px] text-[#475467] ml-1" }, "Verified platform")
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="hidden lg:flex absolute top-7 right-8 items-center gap-2"${_scopeId}><span class="text-sm text-[#667085]"${_scopeId}>New to Printy?</span>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: unref(clientRegisterLink),
              class: "text-sm font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors underline underline-offset-2"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Create an account`);
                } else {
                  return [
                    createTextVNode("Create an account")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="w-full max-w-[440px]"${_scopeId}><div class="flex items-center gap-2 mb-8 lg:hidden"${_scopeId}>`);
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
                  _push3(`<div class="mb-7"${_scopeId2}><h2 class="text-[1.65rem] font-extrabold text-[#101828] tracking-tight mb-1.5"${_scopeId2}>Welcome back</h2><p class="text-[14px] text-[#667085]"${_scopeId2}>Sign in to continue to your workspace.</p></div><form class="space-y-5"${_scopeId2}>`);
                  if (unref(errorMessage)) {
                    _push3(`<div class="rounded-lg border border-[#fda29b] bg-[#fef3f2] px-4 py-3"${_scopeId2}><p class="text-[12px] font-semibold text-[#b42318] mb-1"${_scopeId2}>Sign in failed</p><p class="text-[12px] text-[#b42318] leading-snug"${_scopeId2}>${ssrInterpolate(unref(errorMessage))}</p></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
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
                  _push3(`<div${_scopeId2}><div class="flex items-center justify-between mb-1.5"${_scopeId2}><label class="block text-[13px] font-semibold text-[#344054]"${_scopeId2}>Password</label>`);
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: "/auth/forgot-password",
                    class: "text-[12px] font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Forgot password?`);
                      } else {
                        return [
                          createTextVNode("Forgot password?")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(BaseInput, {
                    modelValue: unref(password),
                    "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
                    type: unref(showPassword) ? "text" : "password",
                    placeholder: "Enter your password",
                    autocomplete: "current-password",
                    disabled: unref(loading),
                    error: unref(fieldErrors).password,
                    variant: "auth",
                    "icon-left": lockIcon
                  }, {
                    right: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<button type="button" class="text-[#98a2b3] hover:text-[#667085] cursor-pointer transition-colors"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}${_scopeId3}><svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${_scopeId3}><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId3}></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"${_scopeId3}></path></svg></button>`);
                      } else {
                        return [
                          createVNode("button", {
                            type: "button",
                            class: "text-[#98a2b3] hover:text-[#667085] cursor-pointer transition-colors",
                            disabled: unref(loading),
                            onClick: ($event) => showPassword.value = !unref(showPassword)
                          }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-[18px] h-[18px]",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              "stroke-width": "2"
                            }, [
                              createVNode("path", { d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
                              createVNode("path", { d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })
                            ]))
                          ], 8, ["disabled", "onClick"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="flex items-center gap-2.5 pt-0.5"${_scopeId2}><input id="remember"${ssrIncludeBooleanAttr(Array.isArray(unref(rememberMe)) ? ssrLooseContain(unref(rememberMe), null) : unref(rememberMe)) ? " checked" : ""} type="checkbox" name="remember"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="w-4 h-4 rounded border border-[#d0d5dd] text-[#e13515] accent-[#e13515] cursor-pointer"${_scopeId2}><label for="remember" class="text-[13px] text-[#344054] cursor-pointer select-none"${_scopeId2}>Keep me signed in for 30 days</label></div>`);
                  _push3(ssrRenderComponent(BaseButton, {
                    type: "submit",
                    variant: "primary",
                    size: "xl",
                    block: "",
                    disabled: unref(loading),
                    loading: unref(loading)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(loading) ? "Signing in" : "Sign in")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(loading) ? "Signing in" : "Sign in"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</form><div class="my-6 flex items-center gap-3"${_scopeId2}><div class="flex-1 h-px bg-[#f2f4f7]"${_scopeId2}></div><span class="text-[12px] text-[#98a2b3] font-medium whitespace-nowrap"${_scopeId2}>New to Printy?</span><div class="flex-1 h-px bg-[#f2f4f7]"${_scopeId2}></div></div><div class="grid grid-cols-3 gap-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: unref(clientRegisterLink),
                    class: "group flex flex-col items-center gap-2 bg-[#f9fafb] hover:bg-[#fef3f2] border border-[#e4e7ec] hover:border-[#fda497] rounded-xl px-3 py-4 transition-all"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="w-8 h-8 rounded-lg bg-white group-hover:bg-[#fef3f2] border border-[#e4e7ec] group-hover:border-[#fda497] flex items-center justify-center transition-colors shadow-sm"${_scopeId3}><svg class="w-4 h-4 text-[#667085] group-hover:text-[#e13515] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${_scopeId3}><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"${_scopeId3}></path></svg></div><div class="text-center"${_scopeId3}><p class="text-[12px] font-bold text-[#344054] group-hover:text-[#e13515] transition-colors leading-tight"${_scopeId3}>Client</p><p class="text-[10px] text-[#98a2b3] mt-0.5 leading-tight"${_scopeId3}>Order &amp; track jobs</p></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "w-8 h-8 rounded-lg bg-white group-hover:bg-[#fef3f2] border border-[#e4e7ec] group-hover:border-[#fda497] flex items-center justify-center transition-colors shadow-sm" }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-4 h-4 text-[#667085] group-hover:text-[#e13515] transition-colors",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              "stroke-width": "2"
                            }, [
                              createVNode("path", { d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" })
                            ]))
                          ]),
                          createVNode("div", { class: "text-center" }, [
                            createVNode("p", { class: "text-[12px] font-bold text-[#344054] group-hover:text-[#e13515] transition-colors leading-tight" }, "Client"),
                            createVNode("p", { class: "text-[10px] text-[#98a2b3] mt-0.5 leading-tight" }, "Order & track jobs")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: unref(partnerRegisterLink),
                    class: "group flex flex-col items-center gap-2 bg-[#f9fafb] hover:bg-[#fef3f2] border border-[#e4e7ec] hover:border-[#fda497] rounded-xl px-3 py-4 transition-all"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="w-8 h-8 rounded-lg bg-white group-hover:bg-[#fef3f2] border border-[#e4e7ec] group-hover:border-[#fda497] flex items-center justify-center transition-colors shadow-sm"${_scopeId3}><svg class="w-4 h-4 text-[#667085] group-hover:text-[#e13515] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${_scopeId3}><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId3}></path></svg></div><div class="text-center"${_scopeId3}><p class="text-[12px] font-bold text-[#344054] group-hover:text-[#e13515] transition-colors leading-tight"${_scopeId3}>Partner</p><p class="text-[10px] text-[#98a2b3] mt-0.5 leading-tight"${_scopeId3}>Manage &amp; quote</p></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "w-8 h-8 rounded-lg bg-white group-hover:bg-[#fef3f2] border border-[#e4e7ec] group-hover:border-[#fda497] flex items-center justify-center transition-colors shadow-sm" }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-4 h-4 text-[#667085] group-hover:text-[#e13515] transition-colors",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              "stroke-width": "2"
                            }, [
                              createVNode("path", { d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" })
                            ]))
                          ]),
                          createVNode("div", { class: "text-center" }, [
                            createVNode("p", { class: "text-[12px] font-bold text-[#344054] group-hover:text-[#e13515] transition-colors leading-tight" }, "Partner"),
                            createVNode("p", { class: "text-[10px] text-[#98a2b3] mt-0.5 leading-tight" }, "Manage & quote")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: unref(shopRegisterLink),
                    class: "group flex flex-col items-center gap-2 bg-[#f9fafb] hover:bg-[#fef3f2] border border-[#e4e7ec] hover:border-[#fda497] rounded-xl px-3 py-4 transition-all"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="w-8 h-8 rounded-lg bg-white group-hover:bg-[#fef3f2] border border-[#e4e7ec] group-hover:border-[#fda497] flex items-center justify-center transition-colors shadow-sm"${_scopeId3}><svg class="w-4 h-4 text-[#667085] group-hover:text-[#e13515] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${_scopeId3}><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"${_scopeId3}></path></svg></div><div class="text-center"${_scopeId3}><p class="text-[12px] font-bold text-[#344054] group-hover:text-[#e13515] transition-colors leading-tight"${_scopeId3}>Print Shop</p><p class="text-[10px] text-[#98a2b3] mt-0.5 leading-tight"${_scopeId3}>Run production</p></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "w-8 h-8 rounded-lg bg-white group-hover:bg-[#fef3f2] border border-[#e4e7ec] group-hover:border-[#fda497] flex items-center justify-center transition-colors shadow-sm" }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-4 h-4 text-[#667085] group-hover:text-[#e13515] transition-colors",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              "stroke-width": "2"
                            }, [
                              createVNode("path", { d: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" })
                            ]))
                          ]),
                          createVNode("div", { class: "text-center" }, [
                            createVNode("p", { class: "text-[12px] font-bold text-[#344054] group-hover:text-[#e13515] transition-colors leading-tight" }, "Print Shop"),
                            createVNode("p", { class: "text-[10px] text-[#98a2b3] mt-0.5 leading-tight" }, "Run production")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="mt-6 flex items-center gap-2.5 bg-[#f9fafb] border border-[#e4e7ec] rounded-lg px-4 py-3"${_scopeId2}><svg class="w-4 h-4 text-[#667085] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${_scopeId2}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"${_scopeId2}></path></svg><p class="text-[12px] text-[#667085] leading-snug"${_scopeId2}> Your workspace is protected with <span class="font-semibold text-[#344054]"${_scopeId2}>secure authentication.</span></p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "mb-7" }, [
                      createVNode("h2", { class: "text-[1.65rem] font-extrabold text-[#101828] tracking-tight mb-1.5" }, "Welcome back"),
                      createVNode("p", { class: "text-[14px] text-[#667085]" }, "Sign in to continue to your workspace.")
                    ]),
                    createVNode("form", {
                      class: "space-y-5",
                      onSubmit: withModifiers(submit, ["prevent"])
                    }, [
                      unref(errorMessage) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "rounded-lg border border-[#fda29b] bg-[#fef3f2] px-4 py-3"
                      }, [
                        createVNode("p", { class: "text-[12px] font-semibold text-[#b42318] mb-1" }, "Sign in failed"),
                        createVNode("p", { class: "text-[12px] text-[#b42318] leading-snug" }, toDisplayString(unref(errorMessage)), 1)
                      ])) : createCommentVNode("", true),
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
                      createVNode("div", null, [
                        createVNode("div", { class: "flex items-center justify-between mb-1.5" }, [
                          createVNode("label", { class: "block text-[13px] font-semibold text-[#344054]" }, "Password"),
                          createVNode(_component_NuxtLink, {
                            to: "/auth/forgot-password",
                            class: "text-[12px] font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Forgot password?")
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode(BaseInput, {
                          modelValue: unref(password),
                          "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
                          type: unref(showPassword) ? "text" : "password",
                          placeholder: "Enter your password",
                          autocomplete: "current-password",
                          disabled: unref(loading),
                          error: unref(fieldErrors).password,
                          variant: "auth",
                          "icon-left": lockIcon
                        }, {
                          right: withCtx(() => [
                            createVNode("button", {
                              type: "button",
                              class: "text-[#98a2b3] hover:text-[#667085] cursor-pointer transition-colors",
                              disabled: unref(loading),
                              onClick: ($event) => showPassword.value = !unref(showPassword)
                            }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-[18px] h-[18px]",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                "stroke-width": "2"
                              }, [
                                createVNode("path", { d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
                                createVNode("path", { d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })
                              ]))
                            ], 8, ["disabled", "onClick"])
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue", "type", "disabled", "error"])
                      ]),
                      createVNode("div", { class: "flex items-center gap-2.5 pt-0.5" }, [
                        withDirectives(createVNode("input", {
                          id: "remember",
                          "onUpdate:modelValue": ($event) => isRef(rememberMe) ? rememberMe.value = $event : null,
                          type: "checkbox",
                          name: "remember",
                          disabled: unref(loading),
                          class: "w-4 h-4 rounded border border-[#d0d5dd] text-[#e13515] accent-[#e13515] cursor-pointer"
                        }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                          [vModelCheckbox, unref(rememberMe)]
                        ]),
                        createVNode("label", {
                          for: "remember",
                          class: "text-[13px] text-[#344054] cursor-pointer select-none"
                        }, "Keep me signed in for 30 days")
                      ]),
                      createVNode(BaseButton, {
                        type: "submit",
                        variant: "primary",
                        size: "xl",
                        block: "",
                        disabled: unref(loading),
                        loading: unref(loading)
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(loading) ? "Signing in" : "Sign in"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"])
                    ], 32),
                    createVNode("div", { class: "my-6 flex items-center gap-3" }, [
                      createVNode("div", { class: "flex-1 h-px bg-[#f2f4f7]" }),
                      createVNode("span", { class: "text-[12px] text-[#98a2b3] font-medium whitespace-nowrap" }, "New to Printy?"),
                      createVNode("div", { class: "flex-1 h-px bg-[#f2f4f7]" })
                    ]),
                    createVNode("div", { class: "grid grid-cols-3 gap-3" }, [
                      createVNode(_component_NuxtLink, {
                        to: unref(clientRegisterLink),
                        class: "group flex flex-col items-center gap-2 bg-[#f9fafb] hover:bg-[#fef3f2] border border-[#e4e7ec] hover:border-[#fda497] rounded-xl px-3 py-4 transition-all"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "w-8 h-8 rounded-lg bg-white group-hover:bg-[#fef3f2] border border-[#e4e7ec] group-hover:border-[#fda497] flex items-center justify-center transition-colors shadow-sm" }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-4 h-4 text-[#667085] group-hover:text-[#e13515] transition-colors",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              "stroke-width": "2"
                            }, [
                              createVNode("path", { d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" })
                            ]))
                          ]),
                          createVNode("div", { class: "text-center" }, [
                            createVNode("p", { class: "text-[12px] font-bold text-[#344054] group-hover:text-[#e13515] transition-colors leading-tight" }, "Client"),
                            createVNode("p", { class: "text-[10px] text-[#98a2b3] mt-0.5 leading-tight" }, "Order & track jobs")
                          ])
                        ]),
                        _: 1
                      }, 8, ["to"]),
                      createVNode(_component_NuxtLink, {
                        to: unref(partnerRegisterLink),
                        class: "group flex flex-col items-center gap-2 bg-[#f9fafb] hover:bg-[#fef3f2] border border-[#e4e7ec] hover:border-[#fda497] rounded-xl px-3 py-4 transition-all"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "w-8 h-8 rounded-lg bg-white group-hover:bg-[#fef3f2] border border-[#e4e7ec] group-hover:border-[#fda497] flex items-center justify-center transition-colors shadow-sm" }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-4 h-4 text-[#667085] group-hover:text-[#e13515] transition-colors",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              "stroke-width": "2"
                            }, [
                              createVNode("path", { d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" })
                            ]))
                          ]),
                          createVNode("div", { class: "text-center" }, [
                            createVNode("p", { class: "text-[12px] font-bold text-[#344054] group-hover:text-[#e13515] transition-colors leading-tight" }, "Partner"),
                            createVNode("p", { class: "text-[10px] text-[#98a2b3] mt-0.5 leading-tight" }, "Manage & quote")
                          ])
                        ]),
                        _: 1
                      }, 8, ["to"]),
                      createVNode(_component_NuxtLink, {
                        to: unref(shopRegisterLink),
                        class: "group flex flex-col items-center gap-2 bg-[#f9fafb] hover:bg-[#fef3f2] border border-[#e4e7ec] hover:border-[#fda497] rounded-xl px-3 py-4 transition-all"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "w-8 h-8 rounded-lg bg-white group-hover:bg-[#fef3f2] border border-[#e4e7ec] group-hover:border-[#fda497] flex items-center justify-center transition-colors shadow-sm" }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-4 h-4 text-[#667085] group-hover:text-[#e13515] transition-colors",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              "stroke-width": "2"
                            }, [
                              createVNode("path", { d: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" })
                            ]))
                          ]),
                          createVNode("div", { class: "text-center" }, [
                            createVNode("p", { class: "text-[12px] font-bold text-[#344054] group-hover:text-[#e13515] transition-colors leading-tight" }, "Print Shop"),
                            createVNode("p", { class: "text-[10px] text-[#98a2b3] mt-0.5 leading-tight" }, "Run production")
                          ])
                        ]),
                        _: 1
                      }, 8, ["to"])
                    ]),
                    createVNode("div", { class: "mt-6 flex items-center gap-2.5 bg-[#f9fafb] border border-[#e4e7ec] rounded-lg px-4 py-3" }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4 text-[#667085] shrink-0",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2"
                      }, [
                        createVNode("path", { d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" })
                      ])),
                      createVNode("p", { class: "text-[12px] text-[#667085] leading-snug" }, [
                        createTextVNode(" Your workspace is protected with "),
                        createVNode("span", { class: "font-semibold text-[#344054]" }, "secure authentication.")
                      ])
                    ])
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
              to: "/auth/forgot-password",
              class: "text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Help`);
                } else {
                  return [
                    createTextVNode("Help")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<span class="text-[#d0d5dd]"${_scopeId}>·</span><span class="text-[12px] text-[#98a2b3]"${_scopeId}>© ${ssrInterpolate(unref(currentYear))} Printy</span></div></div>`);
          } else {
            return [
              createVNode("div", { class: "hidden lg:flex absolute top-7 right-8 items-center gap-2" }, [
                createVNode("span", { class: "text-sm text-[#667085]" }, "New to Printy?"),
                createVNode(_component_NuxtLink, {
                  to: unref(clientRegisterLink),
                  class: "text-sm font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors underline underline-offset-2"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Create an account")
                  ]),
                  _: 1
                }, 8, ["to"])
              ]),
              createVNode("div", { class: "w-full max-w-[440px]" }, [
                createVNode("div", { class: "flex items-center gap-2 mb-8 lg:hidden" }, [
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
                      createVNode("h2", { class: "text-[1.65rem] font-extrabold text-[#101828] tracking-tight mb-1.5" }, "Welcome back"),
                      createVNode("p", { class: "text-[14px] text-[#667085]" }, "Sign in to continue to your workspace.")
                    ]),
                    createVNode("form", {
                      class: "space-y-5",
                      onSubmit: withModifiers(submit, ["prevent"])
                    }, [
                      unref(errorMessage) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "rounded-lg border border-[#fda29b] bg-[#fef3f2] px-4 py-3"
                      }, [
                        createVNode("p", { class: "text-[12px] font-semibold text-[#b42318] mb-1" }, "Sign in failed"),
                        createVNode("p", { class: "text-[12px] text-[#b42318] leading-snug" }, toDisplayString(unref(errorMessage)), 1)
                      ])) : createCommentVNode("", true),
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
                      createVNode("div", null, [
                        createVNode("div", { class: "flex items-center justify-between mb-1.5" }, [
                          createVNode("label", { class: "block text-[13px] font-semibold text-[#344054]" }, "Password"),
                          createVNode(_component_NuxtLink, {
                            to: "/auth/forgot-password",
                            class: "text-[12px] font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Forgot password?")
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode(BaseInput, {
                          modelValue: unref(password),
                          "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
                          type: unref(showPassword) ? "text" : "password",
                          placeholder: "Enter your password",
                          autocomplete: "current-password",
                          disabled: unref(loading),
                          error: unref(fieldErrors).password,
                          variant: "auth",
                          "icon-left": lockIcon
                        }, {
                          right: withCtx(() => [
                            createVNode("button", {
                              type: "button",
                              class: "text-[#98a2b3] hover:text-[#667085] cursor-pointer transition-colors",
                              disabled: unref(loading),
                              onClick: ($event) => showPassword.value = !unref(showPassword)
                            }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-[18px] h-[18px]",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                "stroke-width": "2"
                              }, [
                                createVNode("path", { d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
                                createVNode("path", { d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })
                              ]))
                            ], 8, ["disabled", "onClick"])
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue", "type", "disabled", "error"])
                      ]),
                      createVNode("div", { class: "flex items-center gap-2.5 pt-0.5" }, [
                        withDirectives(createVNode("input", {
                          id: "remember",
                          "onUpdate:modelValue": ($event) => isRef(rememberMe) ? rememberMe.value = $event : null,
                          type: "checkbox",
                          name: "remember",
                          disabled: unref(loading),
                          class: "w-4 h-4 rounded border border-[#d0d5dd] text-[#e13515] accent-[#e13515] cursor-pointer"
                        }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                          [vModelCheckbox, unref(rememberMe)]
                        ]),
                        createVNode("label", {
                          for: "remember",
                          class: "text-[13px] text-[#344054] cursor-pointer select-none"
                        }, "Keep me signed in for 30 days")
                      ]),
                      createVNode(BaseButton, {
                        type: "submit",
                        variant: "primary",
                        size: "xl",
                        block: "",
                        disabled: unref(loading),
                        loading: unref(loading)
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(loading) ? "Signing in" : "Sign in"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"])
                    ], 32),
                    createVNode("div", { class: "my-6 flex items-center gap-3" }, [
                      createVNode("div", { class: "flex-1 h-px bg-[#f2f4f7]" }),
                      createVNode("span", { class: "text-[12px] text-[#98a2b3] font-medium whitespace-nowrap" }, "New to Printy?"),
                      createVNode("div", { class: "flex-1 h-px bg-[#f2f4f7]" })
                    ]),
                    createVNode("div", { class: "grid grid-cols-3 gap-3" }, [
                      createVNode(_component_NuxtLink, {
                        to: unref(clientRegisterLink),
                        class: "group flex flex-col items-center gap-2 bg-[#f9fafb] hover:bg-[#fef3f2] border border-[#e4e7ec] hover:border-[#fda497] rounded-xl px-3 py-4 transition-all"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "w-8 h-8 rounded-lg bg-white group-hover:bg-[#fef3f2] border border-[#e4e7ec] group-hover:border-[#fda497] flex items-center justify-center transition-colors shadow-sm" }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-4 h-4 text-[#667085] group-hover:text-[#e13515] transition-colors",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              "stroke-width": "2"
                            }, [
                              createVNode("path", { d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" })
                            ]))
                          ]),
                          createVNode("div", { class: "text-center" }, [
                            createVNode("p", { class: "text-[12px] font-bold text-[#344054] group-hover:text-[#e13515] transition-colors leading-tight" }, "Client"),
                            createVNode("p", { class: "text-[10px] text-[#98a2b3] mt-0.5 leading-tight" }, "Order & track jobs")
                          ])
                        ]),
                        _: 1
                      }, 8, ["to"]),
                      createVNode(_component_NuxtLink, {
                        to: unref(partnerRegisterLink),
                        class: "group flex flex-col items-center gap-2 bg-[#f9fafb] hover:bg-[#fef3f2] border border-[#e4e7ec] hover:border-[#fda497] rounded-xl px-3 py-4 transition-all"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "w-8 h-8 rounded-lg bg-white group-hover:bg-[#fef3f2] border border-[#e4e7ec] group-hover:border-[#fda497] flex items-center justify-center transition-colors shadow-sm" }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-4 h-4 text-[#667085] group-hover:text-[#e13515] transition-colors",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              "stroke-width": "2"
                            }, [
                              createVNode("path", { d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" })
                            ]))
                          ]),
                          createVNode("div", { class: "text-center" }, [
                            createVNode("p", { class: "text-[12px] font-bold text-[#344054] group-hover:text-[#e13515] transition-colors leading-tight" }, "Partner"),
                            createVNode("p", { class: "text-[10px] text-[#98a2b3] mt-0.5 leading-tight" }, "Manage & quote")
                          ])
                        ]),
                        _: 1
                      }, 8, ["to"]),
                      createVNode(_component_NuxtLink, {
                        to: unref(shopRegisterLink),
                        class: "group flex flex-col items-center gap-2 bg-[#f9fafb] hover:bg-[#fef3f2] border border-[#e4e7ec] hover:border-[#fda497] rounded-xl px-3 py-4 transition-all"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "w-8 h-8 rounded-lg bg-white group-hover:bg-[#fef3f2] border border-[#e4e7ec] group-hover:border-[#fda497] flex items-center justify-center transition-colors shadow-sm" }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-4 h-4 text-[#667085] group-hover:text-[#e13515] transition-colors",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              "stroke-width": "2"
                            }, [
                              createVNode("path", { d: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" })
                            ]))
                          ]),
                          createVNode("div", { class: "text-center" }, [
                            createVNode("p", { class: "text-[12px] font-bold text-[#344054] group-hover:text-[#e13515] transition-colors leading-tight" }, "Print Shop"),
                            createVNode("p", { class: "text-[10px] text-[#98a2b3] mt-0.5 leading-tight" }, "Run production")
                          ])
                        ]),
                        _: 1
                      }, 8, ["to"])
                    ]),
                    createVNode("div", { class: "mt-6 flex items-center gap-2.5 bg-[#f9fafb] border border-[#e4e7ec] rounded-lg px-4 py-3" }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4 text-[#667085] shrink-0",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2"
                      }, [
                        createVNode("path", { d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" })
                      ])),
                      createVNode("p", { class: "text-[12px] text-[#667085] leading-snug" }, [
                        createTextVNode(" Your workspace is protected with "),
                        createVNode("span", { class: "font-semibold text-[#344054]" }, "secure authentication.")
                      ])
                    ])
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
                    to: "/auth/forgot-password",
                    class: "text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Help")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-Tz7Y4FuK.mjs.map
