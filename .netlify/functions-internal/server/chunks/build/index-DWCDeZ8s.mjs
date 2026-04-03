import { d as useAuthStore, b as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as _sfc_main$1 } from './Alert-BQjQ5uNh.mjs';
import { _ as __nuxt_component_2 } from './FormSection-CG38mMf8.mjs';
import { _ as __nuxt_component_11 } from './InfoCard-D-56bxET.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { u as useProfileStore } from './profile-v5Kfn5BI.mjs';
import { u as useMediaUrl } from './media-sdQXCpZi.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const PLATFORM_ICONS = {
      facebook: "i-simple-icons-facebook",
      twitter: "i-simple-icons-x",
      instagram: "i-simple-icons-instagram",
      linkedin: "i-simple-icons-linkedin",
      youtube: "i-simple-icons-youtube",
      tiktok: "i-simple-icons-tiktok",
      pinterest: "i-simple-icons-pinterest",
      website: "i-lucide-globe"
    };
    const loadError = ref("");
    const profile = computed(() => profileStore.profile);
    const getMediaUrl = useMediaUrl();
    const displayName = computed(() => {
      const fullName = [authStore.user?.first_name, authStore.user?.last_name].filter(Boolean).join(" ").trim();
      return fullName || authStore.user?.name?.trim() || "Printy User";
    });
    const initials = computed(() => displayName.value.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "PU");
    const avatarSrc = computed(() => getMediaUrl(profile.value?.avatar ?? authStore.user?.avatar ?? null));
    const preferredLanguageLabel = computed(() => authStore.user?.preferred_language === "sw" ? "Swahili" : "English");
    const roleLabel = computed(() => authStore.normalizedRole === "client" ? "Client" : authStore.normalizedRole);
    const editDisabled = computed(() => !authStore.user && !!loadError.value);
    const showDashboardCta = computed(() => authStore.isShopOwner || authStore.isStaffRole);
    const introCopy = computed(() => {
      if (showDashboardCta.value) {
        return "Manage your contact details here, then use the shop dashboard for pricing, quotes, production setup, and shop operations.";
      }
      return "Manage your contact details, profile image, and public-facing links from the client workspace.";
    });
    const addressLines = computed(() => {
      const firstLine = profile.value?.address?.trim() || "No address saved yet.";
      const secondLineParts = [
        profile.value?.city,
        profile.value?.state,
        profile.value?.country,
        profile.value?.postal_code
      ].filter((part) => part?.trim());
      return [firstLine, secondLineParts.join(", ")];
    });
    function formatPlatform(platform) {
      return platform.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    }
    function platformIcon(platform) {
      return PLATFORM_ICONS[platform.toLowerCase()] ?? "i-lucide-link";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_UAlert = _sfc_main$1;
      const _component_DashboardFormSection = __nuxt_component_2;
      const _component_DashboardInfoCard = __nuxt_component_11;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Account</p><h1 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Profile and account details</h1><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(introCopy))}</p></div><div class="flex flex-wrap gap-3">`);
      if (unref(showDashboardCta)) {
        _push(ssrRenderComponent(_component_UButton, {
          variant: "soft",
          to: "/dashboard"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-layout-dashboard",
                class: "mr-2 h-4 w-4"
              }, null, _parent2, _scopeId));
              _push2(` Open Shop Dashboard `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-layout-dashboard",
                  class: "mr-2 h-4 w-4"
                }),
                createTextVNode(" Open Shop Dashboard ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        disabled: unref(editDisabled),
        to: "/account/edit"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-pencil",
              class: "mr-2 h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` Edit Profile `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-pencil",
                class: "mr-2 h-4 w-4"
              }),
              createTextVNode(" Edit Profile ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(loadError)) {
        _push(ssrRenderComponent(_component_UAlert, {
          class: "mt-6",
          color: "warning",
          variant: "soft",
          title: "Profile data is partially unavailable",
          description: unref(loadError),
          icon: "i-lucide-alert-triangle"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.2fr]">`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Account Summary",
        description: "A clear profile overview for the details the current API reads and saves reliably."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-start gap-4 rounded-[26px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"${_scopeId}><div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] text-xl font-semibold text-orange-700 dark:border-orange-400/25 dark:bg-orange-500/12 dark:text-orange-100"${_scopeId}>`);
            if (unref(avatarSrc)) {
              _push2(`<img${ssrRenderAttr("src", unref(avatarSrc))}${ssrRenderAttr("alt", unref(displayName))} class="h-full w-full object-cover"${_scopeId}>`);
            } else {
              _push2(`<span class="inline-flex h-full w-full items-center justify-center bg-orange-50 dark:bg-orange-500/12"${_scopeId}>${ssrInterpolate(unref(initials))}</span>`);
            }
            _push2(`</div><div class="min-w-0"${_scopeId}><p class="text-xl font-semibold text-[var(--p-text)] dark:text-white"${_scopeId}>${ssrInterpolate(unref(displayName))}</p><p class="mt-1 text-sm text-[var(--p-text-muted)] dark:text-slate-300"${_scopeId}>${ssrInterpolate(unref(authStore).user?.email ?? "No email available")}</p><p class="mt-3 text-sm leading-6 text-[var(--p-text-dim)] dark:text-slate-300"${_scopeId}>${ssrInterpolate(unref(profile)?.bio || "Add a short bio so shops can quickly understand who is requesting the quote.")}</p></div></div><div class="grid gap-3 md:grid-cols-2"${_scopeId}><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500"${_scopeId}>Full Name</p><p class="mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white"${_scopeId}>${ssrInterpolate(unref(displayName))}</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500"${_scopeId}>Preferred Language</p><p class="mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white"${_scopeId}>${ssrInterpolate(unref(preferredLanguageLabel))}</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500"${_scopeId}>Phone</p><p class="mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white"${_scopeId}>${ssrInterpolate(unref(profile)?.phone || "Not provided yet")}</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500"${_scopeId}>Business Role</p><p class="mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white"${_scopeId}>${ssrInterpolate(unref(roleLabel))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-start gap-4 rounded-[26px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5" }, [
                createVNode("div", { class: "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] text-xl font-semibold text-orange-700 dark:border-orange-400/25 dark:bg-orange-500/12 dark:text-orange-100" }, [
                  unref(avatarSrc) ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: unref(avatarSrc),
                    alt: unref(displayName),
                    class: "h-full w-full object-cover"
                  }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("span", {
                    key: 1,
                    class: "inline-flex h-full w-full items-center justify-center bg-orange-50 dark:bg-orange-500/12"
                  }, toDisplayString(unref(initials)), 1))
                ]),
                createVNode("div", { class: "min-w-0" }, [
                  createVNode("p", { class: "text-xl font-semibold text-[var(--p-text)] dark:text-white" }, toDisplayString(unref(displayName)), 1),
                  createVNode("p", { class: "mt-1 text-sm text-[var(--p-text-muted)] dark:text-slate-300" }, toDisplayString(unref(authStore).user?.email ?? "No email available"), 1),
                  createVNode("p", { class: "mt-3 text-sm leading-6 text-[var(--p-text-dim)] dark:text-slate-300" }, toDisplayString(unref(profile)?.bio || "Add a short bio so shops can quickly understand who is requesting the quote."), 1)
                ])
              ]),
              createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                createVNode("div", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                  createVNode("p", { class: "text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500" }, "Full Name"),
                  createVNode("p", { class: "mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white" }, toDisplayString(unref(displayName)), 1)
                ]),
                createVNode("div", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                  createVNode("p", { class: "text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500" }, "Preferred Language"),
                  createVNode("p", { class: "mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white" }, toDisplayString(unref(preferredLanguageLabel)), 1)
                ]),
                createVNode("div", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                  createVNode("p", { class: "text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500" }, "Phone"),
                  createVNode("p", { class: "mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white" }, toDisplayString(unref(profile)?.phone || "Not provided yet"), 1)
                ]),
                createVNode("div", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                  createVNode("p", { class: "text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500" }, "Business Role"),
                  createVNode("p", { class: "mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white" }, toDisplayString(unref(roleLabel)), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Supported Now",
        description: "These sections are connected to the live backend and stay in sync with the edit form."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-4 md:grid-cols-2"${_scopeId}><div class="space-y-2 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 md:col-span-2"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500"${_scopeId}>Address</p><p class="text-sm font-medium text-[var(--p-text)] dark:text-white"${_scopeId}>${ssrInterpolate(unref(addressLines)[0])}</p>`);
            if (unref(addressLines)[1]) {
              _push2(`<p class="text-sm text-[var(--p-text-dim)] dark:text-slate-300"${_scopeId}>${ssrInterpolate(unref(addressLines)[1])}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="space-y-2 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 md:col-span-2"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500"${_scopeId}>Social Links</p>`);
            if (unref(profile)?.social_links?.length) {
              _push2(`<div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(unref(profile).social_links, (link) => {
                _push2(`<a${ssrRenderAttr("href", link.url)} target="_blank" rel="noreferrer" class="inline-flex items-center gap-2 rounded-full border border-flamingo-200 bg-flamingo-50 px-3 py-1.5 text-sm font-medium text-flamingo-700 transition hover:border-flamingo-300 hover:bg-flamingo-100 dark:border-flamingo-400/25 dark:bg-flamingo-500/10 dark:text-flamingo-100 dark:hover:border-flamingo-300/40 dark:hover:bg-flamingo-500/15"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: platformIcon(link.platform),
                  class: "h-4 w-4"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(formatPlatform(link.platform))}</a>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<p class="text-sm text-[var(--p-text-dim)] dark:text-slate-300"${_scopeId}>No social links added yet.</p>`);
            }
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_component_DashboardInfoCard, {
              title: "Available On Edit",
              description: "Profile image uploads and social/account details are now editable. Password change and richer account preferences still need dedicated backend endpoints.",
              icon: "i-lucide-image-up",
              tone: "flamingo"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                createVNode("div", { class: "space-y-2 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 md:col-span-2" }, [
                  createVNode("p", { class: "text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500" }, "Address"),
                  createVNode("p", { class: "text-sm font-medium text-[var(--p-text)] dark:text-white" }, toDisplayString(unref(addressLines)[0]), 1),
                  unref(addressLines)[1] ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-sm text-[var(--p-text-dim)] dark:text-slate-300"
                  }, toDisplayString(unref(addressLines)[1]), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "space-y-2 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 md:col-span-2" }, [
                  createVNode("p", { class: "text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500" }, "Social Links"),
                  unref(profile)?.social_links?.length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex flex-wrap gap-2"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(profile).social_links, (link) => {
                      return openBlock(), createBlock("a", {
                        key: link.id,
                        href: link.url,
                        target: "_blank",
                        rel: "noreferrer",
                        class: "inline-flex items-center gap-2 rounded-full border border-flamingo-200 bg-flamingo-50 px-3 py-1.5 text-sm font-medium text-flamingo-700 transition hover:border-flamingo-300 hover:bg-flamingo-100 dark:border-flamingo-400/25 dark:bg-flamingo-500/10 dark:text-flamingo-100 dark:hover:border-flamingo-300/40 dark:hover:bg-flamingo-500/15"
                      }, [
                        createVNode(_component_UIcon, {
                          name: platformIcon(link.platform),
                          class: "h-4 w-4"
                        }, null, 8, ["name"]),
                        createTextVNode(" " + toDisplayString(formatPlatform(link.platform)), 1)
                      ], 8, ["href"]);
                    }), 128))
                  ])) : (openBlock(), createBlock("p", {
                    key: 1,
                    class: "text-sm text-[var(--p-text-dim)] dark:text-slate-300"
                  }, "No social links added yet."))
                ])
              ]),
              createVNode(_component_DashboardInfoCard, {
                title: "Available On Edit",
                description: "Profile image uploads and social/account details are now editable. Password change and richer account preferences still need dedicated backend endpoints.",
                icon: "i-lucide-image-up",
                tone: "flamingo"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/account/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DWCDeZ8s.mjs.map
