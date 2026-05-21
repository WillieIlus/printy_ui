import { p as useHead, m as useAuthStore, q as useRoute, _ as __nuxt_component_0$2, b as BaseCard, a as BaseButton, n as navigateTo, i as getApiErrorDetail, j as getApiErrorMessage } from './server.mjs';
import { defineComponent, ref, computed, watch, mergeProps, withCtx, unref, createTextVNode, isRef, createVNode, openBlock, createBlock, toDisplayString, Fragment, renderList, withDirectives, vModelRadio, withModifiers, createCommentVNode, vModelCheckbox, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderAttr, ssrInterpolate, ssrLooseContain } from 'vue/server-renderer';
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

const userIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>';
const emailIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>';
const phoneIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>';
const lockIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>';
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Printy - Create Account"
    });
    const auth = useAuthStore();
    const route = useRoute();
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const name = ref("");
    const email = ref("");
    const phone = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const acceptedTerms = ref(true);
    const loading = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const fieldErrors = ref({});
    const nextRoute = computed(() => typeof route.query.next === "string" ? route.query.next : "");
    const pendingQuoteFlag = computed(() => route.query.pendingQuote === "1");
    const loginLink = computed(() => {
      const params = new URLSearchParams();
      if (nextRoute.value) {
        params.set("next", nextRoute.value);
      }
      if (pendingQuoteFlag.value) {
        params.set("pendingQuote", "1");
      }
      const query = params.toString();
      return query ? `/auth/login?${query}` : "/auth/login";
    });
    const normalizedRoleQuery = computed(() => {
      const role = typeof route.query.role === "string" ? route.query.role : "";
      if (role === "shop_owner" || role === "production" || role === "printer") {
        return "shop";
      }
      if (role === "partner" || role === "broker") {
        return "partner";
      }
      return "client";
    });
    const accountType = ref(normalizedRoleQuery.value);
    watch(normalizedRoleQuery, (value) => {
      accountType.value = value;
    });
    const accountTypeOptions = [
      {
        value: "client",
        title: "Client",
        quote: '"I need print work done"',
        copy: "For requesting quotes, uploading artwork, tracking jobs, and reordering.",
        cardClass: "type-card-client",
        icon: '<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>'
      },
      {
        value: "partner",
        title: "Partner",
        quote: '"I manage print jobs for clients"',
        copy: "For designers, agents, resellers, and print consultants.",
        cardClass: "type-card-partner",
        icon: '<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
      },
      {
        value: "shop",
        title: "Production Shop",
        quote: '"I fulfil print assignments"',
        copy: "For verified printers and shop production teams.",
        cardClass: "type-card-shop",
        icon: '<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>'
      }
    ];
    const features = [
      "Managed print estimates",
      "Payment-confirmed jobs",
      "Artwork and proof tracking",
      "Production-ready tracking",
      "Partner quoting tools"
    ];
    const workspaceTypes = [
      {
        title: "Client",
        copy: "Order and track print jobs",
        icon: '<svg class="w-3.5 h-3.5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>'
      },
      {
        title: "Partner",
        copy: "Quote and manage clients",
        icon: '<svg class="w-3.5 h-3.5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
      },
      {
        title: "Production Shop",
        copy: "Fulfil assignments",
        icon: '<svg class="w-3.5 h-3.5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>'
      }
    ];
    const selectedAccountTypeDescription = computed(() => {
      if (accountType.value === "partner") {
        return {
          title: "Partners",
          copy: "can create quotes, manage clients, and track managed jobs through Printy."
        };
      }
      if (accountType.value === "shop") {
        return {
          title: "Production shops",
          copy: "are reviewed before they can receive assignments and run the production workspace."
        };
      }
      return {
        title: "Clients",
        copy: "can request quotes, upload artwork, track jobs, and reorder from one dashboard."
      };
    });
    const passwordStrength = computed(() => {
      let score = 0;
      if (password.value.length >= 8) score += 1;
      if (/[A-Z]/.test(password.value) && /[a-z]/.test(password.value)) score += 1;
      if (/\d/.test(password.value)) score += 1;
      if (/[^A-Za-z0-9]/.test(password.value)) score += 1;
      return score;
    });
    const passwordStrengthLabel = computed(() => {
      if (password.value.length === 0) return "Too weak";
      if (passwordStrength.value <= 1) return "Weak";
      if (passwordStrength.value <= 3) return "Moderate";
      return "Strong";
    });
    const passwordStrengthLabelClass = computed(() => {
      if (passwordStrength.value <= 1) return "text-[#b42318]";
      if (passwordStrength.value <= 3) return "text-[#667085]";
      return "text-[#067647]";
    });
    const passwordStrengthBars = computed(() => {
      const filled = passwordStrength.value;
      return Array.from({ length: 4 }, (_, index) => {
        if (index >= filled) {
          return "bg-[#e4e7ec]";
        }
        if (filled >= 4) {
          return "bg-[#12b76a]";
        }
        return index < 2 ? "bg-[#e13515]" : "bg-[#f97316]";
      });
    });
    async function submit() {
      loading.value = true;
      errorMessage.value = "";
      successMessage.value = "";
      fieldErrors.value = {};
      if (!name.value.trim()) fieldErrors.value.name = "Full name is required.";
      if (!email.value.trim()) fieldErrors.value.email = "Email address is required.";
      if (!password.value) fieldErrors.value.password = "Password is required.";
      if (password.value && password.value.length < 8) fieldErrors.value.password = "Password must be at least 8 characters.";
      if (!confirmPassword.value) fieldErrors.value.confirmPassword = "Confirm your password.";
      if (password.value && confirmPassword.value && password.value !== confirmPassword.value) fieldErrors.value.confirmPassword = "Passwords do not match.";
      if (!acceptedTerms.value) fieldErrors.value.terms = "You must agree to the terms and privacy policy.";
      if (Object.keys(fieldErrors.value).length > 0) {
        loading.value = false;
        return;
      }
      try {
        await auth.register({
          name: name.value.trim(),
          email: email.value.trim(),
          password: password.value,
          role: accountType.value === "shop" ? "production" : accountType.value === "partner" ? "partner" : "client",
          partner_profile_enabled: accountType.value === "partner"
        });
        successMessage.value = "Account created. Check your email for the verification link.";
        const params = new URLSearchParams({ email: email.value.trim() });
        if (nextRoute.value) {
          params.set("next", nextRoute.value);
        }
        if (pendingQuoteFlag.value) {
          params.set("pendingQuote", "1");
        }
        await navigateTo(`/auth/confirm-email?${params.toString()}`);
      } catch (error) {
        const apiData = typeof error === "object" && error && "data" in error ? error.data : void 0;
        fieldErrors.value = normalizeApiFieldErrors(apiData);
        errorMessage.value = resolveRegisterErrorMessage(error);
      } finally {
        loading.value = false;
      }
    }
    function resolveRegisterErrorMessage(error) {
      const detail = String(getApiErrorDetail(error) || "").toLowerCase();
      if (detail.includes("already") && detail.includes("email")) {
        return "That email is already registered. Try signing in instead.";
      }
      return getApiErrorMessage(error, "Printy could not create this account.");
    }
    function normalizeApiFieldErrors(data) {
      if (!data) {
        return {};
      }
      const next = {};
      const mappings = {
        email: "email",
        password: "password",
        name: "name",
        full_name: "name",
        non_field_errors: "form",
        detail: "form"
      };
      for (const [key, value] of Object.entries(data)) {
        const target = mappings[key];
        if (!target) continue;
        if (Array.isArray(value)) {
          next[target] = value.map((item) => String(item)).join(" ");
          continue;
        }
        if (typeof value === "string") {
          next[target] = value;
        }
      }
      if (next.form && !errorMessage.value) {
        errorMessage.value = next.form;
      }
      return next;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(ssrRenderComponent(AuthShell, mergeProps({ mode: "signup" }, _attrs), {
        side: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="inline-flex items-center gap-2 bg-[#1d2939] border border-[#2d3f55] rounded-full px-3.5 py-1.5 mb-8"${_scopeId}><span class="w-1.5 h-1.5 rounded-full bg-[#e13515]"${_scopeId}></span><span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#667085]"${_scopeId}>Kenya&#39;s Print Operating System</span></div><h1 class="text-[2.4rem] xl:text-[2.75rem] font-extrabold text-white leading-[1.15] tracking-tight mb-5"${_scopeId}> Start managing<br${_scopeId}> print jobs the<br${_scopeId}><span class="text-[#e13515]"${_scopeId}>professional way.</span></h1><p class="text-[#98a2b3] text-[15px] leading-relaxed mb-10 max-w-sm"${_scopeId}> Create quotes, upload artwork, track production, and manage every print order from one workspace - built for how print actually works. </p><ul class="space-y-3.5"${_scopeId}><!--[-->`);
            ssrRenderList(features, (feature) => {
              _push2(`<li class="flex items-center gap-3.5"${_scopeId}><div class="w-5 h-5 rounded-full bg-[#e13515] flex items-center justify-center shrink-0"${_scopeId}><svg class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"${_scopeId}><path d="M5 13l4 4L19 7"${_scopeId}></path></svg></div><span class="text-[14px] text-[#d0d5dd]"${_scopeId}>${ssrInterpolate(feature)}</span></li>`);
            });
            _push2(`<!--]--></ul>`);
          } else {
            return [
              createVNode("div", { class: "inline-flex items-center gap-2 bg-[#1d2939] border border-[#2d3f55] rounded-full px-3.5 py-1.5 mb-8" }, [
                createVNode("span", { class: "w-1.5 h-1.5 rounded-full bg-[#e13515]" }),
                createVNode("span", { class: "text-[11px] font-semibold uppercase tracking-[0.12em] text-[#667085]" }, "Kenya's Print Operating System")
              ]),
              createVNode("h1", { class: "text-[2.4rem] xl:text-[2.75rem] font-extrabold text-white leading-[1.15] tracking-tight mb-5" }, [
                createTextVNode(" Start managing"),
                createVNode("br"),
                createTextVNode(" print jobs the"),
                createVNode("br"),
                createVNode("span", { class: "text-[#e13515]" }, "professional way.")
              ]),
              createVNode("p", { class: "text-[#98a2b3] text-[15px] leading-relaxed mb-10 max-w-sm" }, " Create quotes, upload artwork, track production, and manage every print order from one workspace - built for how print actually works. "),
              createVNode("ul", { class: "space-y-3.5" }, [
                (openBlock(), createBlock(Fragment, null, renderList(features, (feature) => {
                  return createVNode("li", {
                    key: feature,
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
                    createVNode("span", { class: "text-[14px] text-[#d0d5dd]" }, toDisplayString(feature), 1)
                  ]);
                }), 64))
              ])
            ];
          }
        }),
        sideFooter: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="border-t border-[#1d2939] pt-7"${_scopeId}><p class="text-[11px] font-semibold uppercase tracking-widest text-[#475467] mb-4"${_scopeId}>Three workspace types</p><div class="flex flex-col gap-2.5"${_scopeId}><!--[-->`);
            ssrRenderList(workspaceTypes, (type) => {
              _push2(`<div class="flex items-center gap-3"${_scopeId}><div class="w-7 h-7 rounded-lg bg-[#1d2939] border border-[#2d3f55] flex items-center justify-center shrink-0"${_scopeId}>${type.icon ?? ""}</div><div${_scopeId}><span class="text-[13px] font-semibold text-[#d0d5dd]"${_scopeId}>${ssrInterpolate(type.title)}</span><span class="text-[12px] text-[#667085] ml-1.5"${_scopeId}>- ${ssrInterpolate(type.copy)}</span></div></div>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            return [
              createVNode("div", { class: "border-t border-[#1d2939] pt-7" }, [
                createVNode("p", { class: "text-[11px] font-semibold uppercase tracking-widest text-[#475467] mb-4" }, "Three workspace types"),
                createVNode("div", { class: "flex flex-col gap-2.5" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(workspaceTypes, (type) => {
                    return createVNode("div", {
                      key: type.title,
                      class: "flex items-center gap-3"
                    }, [
                      createVNode("div", {
                        class: "w-7 h-7 rounded-lg bg-[#1d2939] border border-[#2d3f55] flex items-center justify-center shrink-0",
                        innerHTML: type.icon
                      }, null, 8, ["innerHTML"]),
                      createVNode("div", null, [
                        createVNode("span", { class: "text-[13px] font-semibold text-[#d0d5dd]" }, toDisplayString(type.title), 1),
                        createVNode("span", { class: "text-[12px] text-[#667085] ml-1.5" }, "- " + toDisplayString(type.copy), 1)
                      ])
                    ]);
                  }), 64))
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="hidden lg:flex w-full max-w-[580px] justify-end mb-5"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><span class="text-[13px] text-[#667085]"${_scopeId}>Already have an account?</span>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: unref(loginLink),
              class: "text-[13px] font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors underline underline-offset-2"
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
            _push2(`</div></div><div class="w-full max-w-[580px]"${_scopeId}><div class="flex items-center gap-2 mb-7 lg:hidden"${_scopeId}>`);
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
                  _push3(`<div class="mb-7"${_scopeId2}><h2 class="text-[1.55rem] font-extrabold text-[#101828] tracking-tight mb-1.5"${_scopeId2}>Create your Printy account</h2><p class="text-[14px] text-[#667085]"${_scopeId2}>Choose how you want to use Printy.</p></div><fieldset class="mb-6"${_scopeId2}><legend class="text-[13px] font-semibold text-[#344054] mb-3"${_scopeId2}>Account type</legend><div class="grid grid-cols-1 sm:grid-cols-3 gap-3"${_scopeId2}><!--[-->`);
                  ssrRenderList(accountTypeOptions, (option) => {
                    _push3(`<label class="${ssrRenderClass([option.cardClass, "relative flex flex-col gap-3 border-2 border-[#e4e7ec] bg-[#f9fafb] rounded-xl p-4 cursor-pointer transition-all hover:border-[#fda497] hover:bg-[#fff8f7]"])}"${_scopeId2}><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(accountType), option.value)) ? " checked" : ""} type="radio" name="account_type"${ssrRenderAttr("value", option.value)} class="sr-only"${_scopeId2}><div class="flex items-start justify-between"${_scopeId2}><div class="type-icon w-9 h-9 rounded-lg bg-[#f2f4f7] border border-[#e4e7ec] flex items-center justify-center text-[#667085] transition-all shrink-0"${_scopeId2}>${option.icon ?? ""}</div><div class="type-radio-ring w-[18px] h-[18px] rounded-full border-2 border-[#d0d5dd] flex items-center justify-center transition-all shrink-0 mt-0.5"${_scopeId2}><div class="type-radio-dot hidden w-2 h-2 rounded-full bg-[#e13515]"${_scopeId2}></div></div></div><div${_scopeId2}><p class="type-label text-[13px] font-bold text-[#344054] transition-colors leading-tight mb-1"${_scopeId2}>${ssrInterpolate(option.title)}</p><p class="text-[11px] font-semibold text-[#667085] mb-2 leading-tight"${_scopeId2}>${ssrInterpolate(option.quote)}</p><p class="text-[11px] text-[#98a2b3] leading-snug"${_scopeId2}>${ssrInterpolate(option.copy)}</p></div></label>`);
                  });
                  _push3(`<!--]--></div><div class="mt-3 flex items-start gap-2.5 bg-[#f9fafb] border border-[#e4e7ec] rounded-lg px-4 py-3"${_scopeId2}><svg class="w-4 h-4 text-[#667085] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${_scopeId2}><circle cx="12" cy="12" r="10"${_scopeId2}></circle><path d="M12 16v-4M12 8h.01"${_scopeId2}></path></svg><p class="text-[12px] text-[#667085] leading-snug"${_scopeId2}><span class="font-semibold text-[#344054]"${_scopeId2}>${ssrInterpolate(unref(selectedAccountTypeDescription).title)}</span> ${ssrInterpolate(unref(selectedAccountTypeDescription).copy)}</p></div></fieldset><div class="mb-6 flex items-center gap-3"${_scopeId2}><div class="flex-1 h-px bg-[#f2f4f7]"${_scopeId2}></div><span class="text-[11px] font-semibold uppercase tracking-widest text-[#98a2b3]"${_scopeId2}>Your details</span><div class="flex-1 h-px bg-[#f2f4f7]"${_scopeId2}></div></div><form class="space-y-4"${_scopeId2}>`);
                  if (unref(errorMessage)) {
                    _push3(`<div class="rounded-lg border border-[#fda29b] bg-[#fef3f2] px-4 py-3"${_scopeId2}><p class="text-[12px] font-semibold text-[#b42318] mb-1"${_scopeId2}>Registration failed</p><p class="text-[12px] text-[#b42318] leading-snug"${_scopeId2}>${ssrInterpolate(unref(errorMessage))}</p></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(successMessage)) {
                    _push3(`<div class="rounded-lg border border-[#abefc6] bg-[#ecfdf3] px-4 py-3"${_scopeId2}><p class="text-[12px] font-semibold text-[#067647] mb-1"${_scopeId2}>Account created</p><p class="text-[12px] text-[#067647] leading-snug"${_scopeId2}>${ssrInterpolate(unref(successMessage))}</p></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(BaseInput, {
                    modelValue: unref(name),
                    "onUpdate:modelValue": ($event) => isRef(name) ? name.value = $event : null,
                    label: "Full name",
                    placeholder: "Jane Wanjiku",
                    autocomplete: "name",
                    disabled: unref(loading),
                    error: unref(fieldErrors).name,
                    variant: "auth",
                    "icon-left": userIcon
                  }, null, _parent3, _scopeId2));
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
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(BaseInput, {
                    modelValue: unref(phone),
                    "onUpdate:modelValue": ($event) => isRef(phone) ? phone.value = $event : null,
                    type: "tel",
                    label: "Phone number",
                    placeholder: "7xx xxx xxx",
                    autocomplete: "tel",
                    disabled: unref(loading),
                    error: unref(fieldErrors).phone,
                    variant: "auth",
                    "icon-left": phoneIcon
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId2}><div${_scopeId2}>`);
                  _push3(ssrRenderComponent(BaseInput, {
                    modelValue: unref(password),
                    "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
                    type: unref(showPassword) ? "text" : "password",
                    label: "Password",
                    placeholder: "Min. 8 characters",
                    autocomplete: "new-password",
                    disabled: unref(loading),
                    error: unref(fieldErrors).password,
                    variant: "auth",
                    "icon-left": lockIcon
                  }, {
                    right: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<button type="button" class="text-[#98a2b3] hover:text-[#667085] transition-colors"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}${_scopeId3}><svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${_scopeId3}><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId3}></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"${_scopeId3}></path></svg></button>`);
                      } else {
                        return [
                          createVNode("button", {
                            type: "button",
                            class: "text-[#98a2b3] hover:text-[#667085] transition-colors",
                            disabled: unref(loading),
                            onClick: ($event) => showPassword.value = !unref(showPassword)
                          }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-[17px] h-[17px]",
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
                  _push3(`</div><div${_scopeId2}>`);
                  _push3(ssrRenderComponent(BaseInput, {
                    modelValue: unref(confirmPassword),
                    "onUpdate:modelValue": ($event) => isRef(confirmPassword) ? confirmPassword.value = $event : null,
                    type: unref(showConfirmPassword) ? "text" : "password",
                    label: "Confirm password",
                    placeholder: "Repeat password",
                    autocomplete: "new-password",
                    disabled: unref(loading),
                    error: unref(fieldErrors).confirmPassword,
                    variant: "auth",
                    "icon-left": lockIcon
                  }, {
                    right: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<button type="button" class="text-[#98a2b3] hover:text-[#667085] transition-colors"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}${_scopeId3}><svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${_scopeId3}><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId3}></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"${_scopeId3}></path></svg></button>`);
                      } else {
                        return [
                          createVNode("button", {
                            type: "button",
                            class: "text-[#98a2b3] hover:text-[#667085] transition-colors",
                            disabled: unref(loading),
                            onClick: ($event) => showConfirmPassword.value = !unref(showConfirmPassword)
                          }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-[17px] h-[17px]",
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
                  _push3(`</div></div><div${_scopeId2}><div class="flex items-center justify-between mb-1.5"${_scopeId2}><span class="text-[11px] text-[#98a2b3]"${_scopeId2}>Password strength</span><span class="${ssrRenderClass([unref(passwordStrengthLabelClass), "text-[11px] font-semibold"])}"${_scopeId2}>${ssrInterpolate(unref(passwordStrengthLabel))}</span></div><div class="flex gap-1"${_scopeId2}><!--[-->`);
                  ssrRenderList(unref(passwordStrengthBars), (bar, index) => {
                    _push3(`<div class="${ssrRenderClass([bar, "h-1 flex-1 rounded-full"])}"${_scopeId2}></div>`);
                  });
                  _push3(`<!--]--></div></div><div class="pt-1"${_scopeId2}><label class="flex items-start gap-3 cursor-pointer"${_scopeId2}><div class="mt-0.5 shrink-0"${_scopeId2}><input${ssrIncludeBooleanAttr(Array.isArray(unref(acceptedTerms)) ? ssrLooseContain(unref(acceptedTerms), null) : unref(acceptedTerms)) ? " checked" : ""} type="checkbox" name="terms"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="w-4 h-4 rounded border border-[#d0d5dd] accent-[#e13515] cursor-pointer"${_scopeId2}></div><p class="text-[13px] text-[#344054] leading-relaxed"${_scopeId2}> I agree to Printy&#39;s `);
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: "/",
                    class: "font-semibold text-[#e13515] hover:text-[#b82c10] underline underline-offset-2 transition-colors"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Terms of Service`);
                      } else {
                        return [
                          createTextVNode("Terms of Service")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(` and `);
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: "/",
                    class: "font-semibold text-[#e13515] hover:text-[#b82c10] underline underline-offset-2 transition-colors"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Privacy Policy`);
                      } else {
                        return [
                          createTextVNode("Privacy Policy")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`. I understand how my data is used within the platform. </p></label>`);
                  if (unref(fieldErrors).terms) {
                    _push3(`<p class="mt-1.5 text-[12px] text-[#b42318]"${_scopeId2}>${ssrInterpolate(unref(fieldErrors).terms)}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
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
                        _push4(`${ssrInterpolate(unref(loading) ? "Creating account" : "Create account")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(loading) ? "Creating account" : "Create account"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<p class="text-center text-[13px] text-[#667085] pt-1"${_scopeId2}> Already have an account? `);
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: unref(loginLink),
                    class: "font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors underline underline-offset-2"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Sign in`);
                      } else {
                        return [
                          createTextVNode("Sign in")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</p></form><div class="mt-6 flex items-center gap-2.5 bg-[#f9fafb] border border-[#e4e7ec] rounded-lg px-4 py-3"${_scopeId2}><svg class="w-4 h-4 text-[#667085] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${_scopeId2}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"${_scopeId2}></path></svg><p class="text-[12px] text-[#667085] leading-snug"${_scopeId2}> Your account is protected with <span class="font-semibold text-[#344054]"${_scopeId2}>secure authentication.</span></p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "mb-7" }, [
                      createVNode("h2", { class: "text-[1.55rem] font-extrabold text-[#101828] tracking-tight mb-1.5" }, "Create your Printy account"),
                      createVNode("p", { class: "text-[14px] text-[#667085]" }, "Choose how you want to use Printy.")
                    ]),
                    createVNode("fieldset", { class: "mb-6" }, [
                      createVNode("legend", { class: "text-[13px] font-semibold text-[#344054] mb-3" }, "Account type"),
                      createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-3" }, [
                        (openBlock(), createBlock(Fragment, null, renderList(accountTypeOptions, (option) => {
                          return createVNode("label", {
                            key: option.value,
                            class: [option.cardClass, "relative flex flex-col gap-3 border-2 border-[#e4e7ec] bg-[#f9fafb] rounded-xl p-4 cursor-pointer transition-all hover:border-[#fda497] hover:bg-[#fff8f7]"]
                          }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => isRef(accountType) ? accountType.value = $event : null,
                              type: "radio",
                              name: "account_type",
                              value: option.value,
                              class: "sr-only"
                            }, null, 8, ["onUpdate:modelValue", "value"]), [
                              [vModelRadio, unref(accountType)]
                            ]),
                            createVNode("div", { class: "flex items-start justify-between" }, [
                              createVNode("div", {
                                class: "type-icon w-9 h-9 rounded-lg bg-[#f2f4f7] border border-[#e4e7ec] flex items-center justify-center text-[#667085] transition-all shrink-0",
                                innerHTML: option.icon
                              }, null, 8, ["innerHTML"]),
                              createVNode("div", { class: "type-radio-ring w-[18px] h-[18px] rounded-full border-2 border-[#d0d5dd] flex items-center justify-center transition-all shrink-0 mt-0.5" }, [
                                createVNode("div", { class: "type-radio-dot hidden w-2 h-2 rounded-full bg-[#e13515]" })
                              ])
                            ]),
                            createVNode("div", null, [
                              createVNode("p", { class: "type-label text-[13px] font-bold text-[#344054] transition-colors leading-tight mb-1" }, toDisplayString(option.title), 1),
                              createVNode("p", { class: "text-[11px] font-semibold text-[#667085] mb-2 leading-tight" }, toDisplayString(option.quote), 1),
                              createVNode("p", { class: "text-[11px] text-[#98a2b3] leading-snug" }, toDisplayString(option.copy), 1)
                            ])
                          ], 2);
                        }), 64))
                      ]),
                      createVNode("div", { class: "mt-3 flex items-start gap-2.5 bg-[#f9fafb] border border-[#e4e7ec] rounded-lg px-4 py-3" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4 text-[#667085] shrink-0 mt-0.5",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2"
                        }, [
                          createVNode("circle", {
                            cx: "12",
                            cy: "12",
                            r: "10"
                          }),
                          createVNode("path", { d: "M12 16v-4M12 8h.01" })
                        ])),
                        createVNode("p", { class: "text-[12px] text-[#667085] leading-snug" }, [
                          createVNode("span", { class: "font-semibold text-[#344054]" }, toDisplayString(unref(selectedAccountTypeDescription).title), 1),
                          createTextVNode(" " + toDisplayString(unref(selectedAccountTypeDescription).copy), 1)
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "mb-6 flex items-center gap-3" }, [
                      createVNode("div", { class: "flex-1 h-px bg-[#f2f4f7]" }),
                      createVNode("span", { class: "text-[11px] font-semibold uppercase tracking-widest text-[#98a2b3]" }, "Your details"),
                      createVNode("div", { class: "flex-1 h-px bg-[#f2f4f7]" })
                    ]),
                    createVNode("form", {
                      class: "space-y-4",
                      onSubmit: withModifiers(submit, ["prevent"])
                    }, [
                      unref(errorMessage) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "rounded-lg border border-[#fda29b] bg-[#fef3f2] px-4 py-3"
                      }, [
                        createVNode("p", { class: "text-[12px] font-semibold text-[#b42318] mb-1" }, "Registration failed"),
                        createVNode("p", { class: "text-[12px] text-[#b42318] leading-snug" }, toDisplayString(unref(errorMessage)), 1)
                      ])) : createCommentVNode("", true),
                      unref(successMessage) ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "rounded-lg border border-[#abefc6] bg-[#ecfdf3] px-4 py-3"
                      }, [
                        createVNode("p", { class: "text-[12px] font-semibold text-[#067647] mb-1" }, "Account created"),
                        createVNode("p", { class: "text-[12px] text-[#067647] leading-snug" }, toDisplayString(unref(successMessage)), 1)
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                        createVNode(BaseInput, {
                          modelValue: unref(name),
                          "onUpdate:modelValue": ($event) => isRef(name) ? name.value = $event : null,
                          label: "Full name",
                          placeholder: "Jane Wanjiku",
                          autocomplete: "name",
                          disabled: unref(loading),
                          error: unref(fieldErrors).name,
                          variant: "auth",
                          "icon-left": userIcon
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "error"]),
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
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "error"])
                      ]),
                      createVNode(BaseInput, {
                        modelValue: unref(phone),
                        "onUpdate:modelValue": ($event) => isRef(phone) ? phone.value = $event : null,
                        type: "tel",
                        label: "Phone number",
                        placeholder: "7xx xxx xxx",
                        autocomplete: "tel",
                        disabled: unref(loading),
                        error: unref(fieldErrors).phone,
                        variant: "auth",
                        "icon-left": phoneIcon
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "error"]),
                      createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                        createVNode("div", null, [
                          createVNode(BaseInput, {
                            modelValue: unref(password),
                            "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
                            type: unref(showPassword) ? "text" : "password",
                            label: "Password",
                            placeholder: "Min. 8 characters",
                            autocomplete: "new-password",
                            disabled: unref(loading),
                            error: unref(fieldErrors).password,
                            variant: "auth",
                            "icon-left": lockIcon
                          }, {
                            right: withCtx(() => [
                              createVNode("button", {
                                type: "button",
                                class: "text-[#98a2b3] hover:text-[#667085] transition-colors",
                                disabled: unref(loading),
                                onClick: ($event) => showPassword.value = !unref(showPassword)
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-[17px] h-[17px]",
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
                        createVNode("div", null, [
                          createVNode(BaseInput, {
                            modelValue: unref(confirmPassword),
                            "onUpdate:modelValue": ($event) => isRef(confirmPassword) ? confirmPassword.value = $event : null,
                            type: unref(showConfirmPassword) ? "text" : "password",
                            label: "Confirm password",
                            placeholder: "Repeat password",
                            autocomplete: "new-password",
                            disabled: unref(loading),
                            error: unref(fieldErrors).confirmPassword,
                            variant: "auth",
                            "icon-left": lockIcon
                          }, {
                            right: withCtx(() => [
                              createVNode("button", {
                                type: "button",
                                class: "text-[#98a2b3] hover:text-[#667085] transition-colors",
                                disabled: unref(loading),
                                onClick: ($event) => showConfirmPassword.value = !unref(showConfirmPassword)
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-[17px] h-[17px]",
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
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("div", { class: "flex items-center justify-between mb-1.5" }, [
                          createVNode("span", { class: "text-[11px] text-[#98a2b3]" }, "Password strength"),
                          createVNode("span", {
                            class: ["text-[11px] font-semibold", unref(passwordStrengthLabelClass)]
                          }, toDisplayString(unref(passwordStrengthLabel)), 3)
                        ]),
                        createVNode("div", { class: "flex gap-1" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(passwordStrengthBars), (bar, index) => {
                            return openBlock(), createBlock("div", {
                              key: index,
                              class: ["h-1 flex-1 rounded-full", bar]
                            }, null, 2);
                          }), 128))
                        ])
                      ]),
                      createVNode("div", { class: "pt-1" }, [
                        createVNode("label", { class: "flex items-start gap-3 cursor-pointer" }, [
                          createVNode("div", { class: "mt-0.5 shrink-0" }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => isRef(acceptedTerms) ? acceptedTerms.value = $event : null,
                              type: "checkbox",
                              name: "terms",
                              disabled: unref(loading),
                              class: "w-4 h-4 rounded border border-[#d0d5dd] accent-[#e13515] cursor-pointer"
                            }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                              [vModelCheckbox, unref(acceptedTerms)]
                            ])
                          ]),
                          createVNode("p", { class: "text-[13px] text-[#344054] leading-relaxed" }, [
                            createTextVNode(" I agree to Printy's "),
                            createVNode(_component_NuxtLink, {
                              to: "/",
                              class: "font-semibold text-[#e13515] hover:text-[#b82c10] underline underline-offset-2 transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Terms of Service")
                              ]),
                              _: 1
                            }),
                            createTextVNode(" and "),
                            createVNode(_component_NuxtLink, {
                              to: "/",
                              class: "font-semibold text-[#e13515] hover:text-[#b82c10] underline underline-offset-2 transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Privacy Policy")
                              ]),
                              _: 1
                            }),
                            createTextVNode(". I understand how my data is used within the platform. ")
                          ])
                        ]),
                        unref(fieldErrors).terms ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1.5 text-[12px] text-[#b42318]"
                        }, toDisplayString(unref(fieldErrors).terms), 1)) : createCommentVNode("", true)
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
                          createTextVNode(toDisplayString(unref(loading) ? "Creating account" : "Create account"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"]),
                      createVNode("p", { class: "text-center text-[13px] text-[#667085] pt-1" }, [
                        createTextVNode(" Already have an account? "),
                        createVNode(_component_NuxtLink, {
                          to: unref(loginLink),
                          class: "font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors underline underline-offset-2"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Sign in")
                          ]),
                          _: 1
                        }, 8, ["to"])
                      ])
                    ], 32),
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
                        createTextVNode(" Your account is protected with "),
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
              createVNode("div", { class: "hidden lg:flex w-full max-w-[580px] justify-end mb-5" }, [
                createVNode("div", { class: "flex items-center gap-2" }, [
                  createVNode("span", { class: "text-[13px] text-[#667085]" }, "Already have an account?"),
                  createVNode(_component_NuxtLink, {
                    to: unref(loginLink),
                    class: "text-[13px] font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors underline underline-offset-2"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Sign in")
                    ]),
                    _: 1
                  }, 8, ["to"])
                ])
              ]),
              createVNode("div", { class: "w-full max-w-[580px]" }, [
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
                      createVNode("h2", { class: "text-[1.55rem] font-extrabold text-[#101828] tracking-tight mb-1.5" }, "Create your Printy account"),
                      createVNode("p", { class: "text-[14px] text-[#667085]" }, "Choose how you want to use Printy.")
                    ]),
                    createVNode("fieldset", { class: "mb-6" }, [
                      createVNode("legend", { class: "text-[13px] font-semibold text-[#344054] mb-3" }, "Account type"),
                      createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-3" }, [
                        (openBlock(), createBlock(Fragment, null, renderList(accountTypeOptions, (option) => {
                          return createVNode("label", {
                            key: option.value,
                            class: [option.cardClass, "relative flex flex-col gap-3 border-2 border-[#e4e7ec] bg-[#f9fafb] rounded-xl p-4 cursor-pointer transition-all hover:border-[#fda497] hover:bg-[#fff8f7]"]
                          }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => isRef(accountType) ? accountType.value = $event : null,
                              type: "radio",
                              name: "account_type",
                              value: option.value,
                              class: "sr-only"
                            }, null, 8, ["onUpdate:modelValue", "value"]), [
                              [vModelRadio, unref(accountType)]
                            ]),
                            createVNode("div", { class: "flex items-start justify-between" }, [
                              createVNode("div", {
                                class: "type-icon w-9 h-9 rounded-lg bg-[#f2f4f7] border border-[#e4e7ec] flex items-center justify-center text-[#667085] transition-all shrink-0",
                                innerHTML: option.icon
                              }, null, 8, ["innerHTML"]),
                              createVNode("div", { class: "type-radio-ring w-[18px] h-[18px] rounded-full border-2 border-[#d0d5dd] flex items-center justify-center transition-all shrink-0 mt-0.5" }, [
                                createVNode("div", { class: "type-radio-dot hidden w-2 h-2 rounded-full bg-[#e13515]" })
                              ])
                            ]),
                            createVNode("div", null, [
                              createVNode("p", { class: "type-label text-[13px] font-bold text-[#344054] transition-colors leading-tight mb-1" }, toDisplayString(option.title), 1),
                              createVNode("p", { class: "text-[11px] font-semibold text-[#667085] mb-2 leading-tight" }, toDisplayString(option.quote), 1),
                              createVNode("p", { class: "text-[11px] text-[#98a2b3] leading-snug" }, toDisplayString(option.copy), 1)
                            ])
                          ], 2);
                        }), 64))
                      ]),
                      createVNode("div", { class: "mt-3 flex items-start gap-2.5 bg-[#f9fafb] border border-[#e4e7ec] rounded-lg px-4 py-3" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4 text-[#667085] shrink-0 mt-0.5",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2"
                        }, [
                          createVNode("circle", {
                            cx: "12",
                            cy: "12",
                            r: "10"
                          }),
                          createVNode("path", { d: "M12 16v-4M12 8h.01" })
                        ])),
                        createVNode("p", { class: "text-[12px] text-[#667085] leading-snug" }, [
                          createVNode("span", { class: "font-semibold text-[#344054]" }, toDisplayString(unref(selectedAccountTypeDescription).title), 1),
                          createTextVNode(" " + toDisplayString(unref(selectedAccountTypeDescription).copy), 1)
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "mb-6 flex items-center gap-3" }, [
                      createVNode("div", { class: "flex-1 h-px bg-[#f2f4f7]" }),
                      createVNode("span", { class: "text-[11px] font-semibold uppercase tracking-widest text-[#98a2b3]" }, "Your details"),
                      createVNode("div", { class: "flex-1 h-px bg-[#f2f4f7]" })
                    ]),
                    createVNode("form", {
                      class: "space-y-4",
                      onSubmit: withModifiers(submit, ["prevent"])
                    }, [
                      unref(errorMessage) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "rounded-lg border border-[#fda29b] bg-[#fef3f2] px-4 py-3"
                      }, [
                        createVNode("p", { class: "text-[12px] font-semibold text-[#b42318] mb-1" }, "Registration failed"),
                        createVNode("p", { class: "text-[12px] text-[#b42318] leading-snug" }, toDisplayString(unref(errorMessage)), 1)
                      ])) : createCommentVNode("", true),
                      unref(successMessage) ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "rounded-lg border border-[#abefc6] bg-[#ecfdf3] px-4 py-3"
                      }, [
                        createVNode("p", { class: "text-[12px] font-semibold text-[#067647] mb-1" }, "Account created"),
                        createVNode("p", { class: "text-[12px] text-[#067647] leading-snug" }, toDisplayString(unref(successMessage)), 1)
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                        createVNode(BaseInput, {
                          modelValue: unref(name),
                          "onUpdate:modelValue": ($event) => isRef(name) ? name.value = $event : null,
                          label: "Full name",
                          placeholder: "Jane Wanjiku",
                          autocomplete: "name",
                          disabled: unref(loading),
                          error: unref(fieldErrors).name,
                          variant: "auth",
                          "icon-left": userIcon
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "error"]),
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
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "error"])
                      ]),
                      createVNode(BaseInput, {
                        modelValue: unref(phone),
                        "onUpdate:modelValue": ($event) => isRef(phone) ? phone.value = $event : null,
                        type: "tel",
                        label: "Phone number",
                        placeholder: "7xx xxx xxx",
                        autocomplete: "tel",
                        disabled: unref(loading),
                        error: unref(fieldErrors).phone,
                        variant: "auth",
                        "icon-left": phoneIcon
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "error"]),
                      createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                        createVNode("div", null, [
                          createVNode(BaseInput, {
                            modelValue: unref(password),
                            "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
                            type: unref(showPassword) ? "text" : "password",
                            label: "Password",
                            placeholder: "Min. 8 characters",
                            autocomplete: "new-password",
                            disabled: unref(loading),
                            error: unref(fieldErrors).password,
                            variant: "auth",
                            "icon-left": lockIcon
                          }, {
                            right: withCtx(() => [
                              createVNode("button", {
                                type: "button",
                                class: "text-[#98a2b3] hover:text-[#667085] transition-colors",
                                disabled: unref(loading),
                                onClick: ($event) => showPassword.value = !unref(showPassword)
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-[17px] h-[17px]",
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
                        createVNode("div", null, [
                          createVNode(BaseInput, {
                            modelValue: unref(confirmPassword),
                            "onUpdate:modelValue": ($event) => isRef(confirmPassword) ? confirmPassword.value = $event : null,
                            type: unref(showConfirmPassword) ? "text" : "password",
                            label: "Confirm password",
                            placeholder: "Repeat password",
                            autocomplete: "new-password",
                            disabled: unref(loading),
                            error: unref(fieldErrors).confirmPassword,
                            variant: "auth",
                            "icon-left": lockIcon
                          }, {
                            right: withCtx(() => [
                              createVNode("button", {
                                type: "button",
                                class: "text-[#98a2b3] hover:text-[#667085] transition-colors",
                                disabled: unref(loading),
                                onClick: ($event) => showConfirmPassword.value = !unref(showConfirmPassword)
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-[17px] h-[17px]",
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
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("div", { class: "flex items-center justify-between mb-1.5" }, [
                          createVNode("span", { class: "text-[11px] text-[#98a2b3]" }, "Password strength"),
                          createVNode("span", {
                            class: ["text-[11px] font-semibold", unref(passwordStrengthLabelClass)]
                          }, toDisplayString(unref(passwordStrengthLabel)), 3)
                        ]),
                        createVNode("div", { class: "flex gap-1" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(passwordStrengthBars), (bar, index) => {
                            return openBlock(), createBlock("div", {
                              key: index,
                              class: ["h-1 flex-1 rounded-full", bar]
                            }, null, 2);
                          }), 128))
                        ])
                      ]),
                      createVNode("div", { class: "pt-1" }, [
                        createVNode("label", { class: "flex items-start gap-3 cursor-pointer" }, [
                          createVNode("div", { class: "mt-0.5 shrink-0" }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => isRef(acceptedTerms) ? acceptedTerms.value = $event : null,
                              type: "checkbox",
                              name: "terms",
                              disabled: unref(loading),
                              class: "w-4 h-4 rounded border border-[#d0d5dd] accent-[#e13515] cursor-pointer"
                            }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                              [vModelCheckbox, unref(acceptedTerms)]
                            ])
                          ]),
                          createVNode("p", { class: "text-[13px] text-[#344054] leading-relaxed" }, [
                            createTextVNode(" I agree to Printy's "),
                            createVNode(_component_NuxtLink, {
                              to: "/",
                              class: "font-semibold text-[#e13515] hover:text-[#b82c10] underline underline-offset-2 transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Terms of Service")
                              ]),
                              _: 1
                            }),
                            createTextVNode(" and "),
                            createVNode(_component_NuxtLink, {
                              to: "/",
                              class: "font-semibold text-[#e13515] hover:text-[#b82c10] underline underline-offset-2 transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Privacy Policy")
                              ]),
                              _: 1
                            }),
                            createTextVNode(". I understand how my data is used within the platform. ")
                          ])
                        ]),
                        unref(fieldErrors).terms ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1.5 text-[12px] text-[#b42318]"
                        }, toDisplayString(unref(fieldErrors).terms), 1)) : createCommentVNode("", true)
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
                          createTextVNode(toDisplayString(unref(loading) ? "Creating account" : "Create account"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"]),
                      createVNode("p", { class: "text-center text-[13px] text-[#667085] pt-1" }, [
                        createTextVNode(" Already have an account? "),
                        createVNode(_component_NuxtLink, {
                          to: unref(loginLink),
                          class: "font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors underline underline-offset-2"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Sign in")
                          ]),
                          _: 1
                        }, 8, ["to"])
                      ])
                    ], 32),
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
                        createTextVNode(" Your account is protected with "),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-CC1Tt3eE.mjs.map
