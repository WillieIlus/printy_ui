import { _ as __nuxt_component_0 } from './DashboardPageHeader-5_E3NIzR.mjs';
import { c as useAuthStore, d as _sfc_main$9, a as _sfc_main$f, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$1 } from './Alert-CRX5veBl.mjs';
import { a as __nuxt_component_2, _ as __nuxt_component_11 } from './FormSection-BF6FM0xo.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { u as useProfileStore } from './profile-BrbBxAQk.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const loadError = ref("");
    const profile = computed(() => profileStore.profile);
    const displayName = computed(() => {
      const fullName = [authStore.user?.first_name, authStore.user?.last_name].filter(Boolean).join(" ").trim();
      return fullName || authStore.user?.name?.trim() || "Printy User";
    });
    const initials = computed(() => displayName.value.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "PU");
    const preferredLanguageLabel = computed(() => authStore.user?.preferred_language === "sw" ? "Swahili" : "English");
    const roleLabel = computed(() => authStore.user?.role === "PRINTER" ? "Printer" : "Customer");
    const editDisabled = computed(() => !authStore.user && !!loadError.value);
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
    async function openEdit() {
      if (editDisabled.value) return;
      await navigateTo("/dashboard/profile/edit");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_UAlert = _sfc_main$1;
      const _component_DashboardFormSection = __nuxt_component_2;
      const _component_DashboardInfoCard = __nuxt_component_11;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Profile",
        subtitle: "Manage the account details Printy currently supports, and keep unsupported account features explicit instead of broken."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              disabled: unref(editDisabled),
              onClick: openEdit
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-pencil",
                    class: "mr-2 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` Edit Profile `);
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
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                variant: "soft",
                disabled: unref(editDisabled),
                onClick: openEdit
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-pencil",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Edit Profile ")
                ]),
                _: 1
              }, 8, ["disabled"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(loadError)) {
        _push(ssrRenderComponent(_component_UAlert, {
          color: "warning",
          variant: "soft",
          title: "Profile data is partially unavailable",
          description: unref(loadError),
          icon: "i-lucide-alert-triangle"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid gap-6 xl:grid-cols-[0.95fr_1.2fr]">`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Account Summary",
        description: "A clear profile overview with only the details the current API can read and save reliably."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-start gap-4 rounded-[26px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"${_scopeId}><div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-orange-200 bg-orange-50 text-xl font-semibold text-orange-700 dark:border-orange-400/25 dark:bg-orange-500/12 dark:text-orange-100"${_scopeId}>${ssrInterpolate(unref(initials))}</div><div class="min-w-0"${_scopeId}><p class="text-xl font-semibold text-[var(--p-text)] dark:text-white"${_scopeId}>${ssrInterpolate(unref(displayName))}</p><p class="mt-1 text-sm text-[var(--p-text-muted)] dark:text-slate-300"${_scopeId}>${ssrInterpolate(unref(authStore).user?.email ?? "No email available")}</p><p class="mt-3 text-sm leading-6 text-[var(--p-text-dim)] dark:text-slate-300"${_scopeId}>${ssrInterpolate(unref(profile)?.bio || "Add a short bio so collaborators and customers can quickly understand this account.")}</p></div></div><div class="grid gap-3 md:grid-cols-2"${_scopeId}><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500"${_scopeId}>Full Name</p><p class="mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white"${_scopeId}>${ssrInterpolate(unref(displayName))}</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500"${_scopeId}>Preferred Language</p><p class="mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white"${_scopeId}>${ssrInterpolate(unref(preferredLanguageLabel))}</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500"${_scopeId}>Phone</p><p class="mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white"${_scopeId}>${ssrInterpolate(unref(profile)?.phone || "Not provided yet")}</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500"${_scopeId}>Business Role</p><p class="mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white"${_scopeId}>${ssrInterpolate(unref(roleLabel))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-start gap-4 rounded-[26px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5" }, [
                createVNode("div", { class: "flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-orange-200 bg-orange-50 text-xl font-semibold text-orange-700 dark:border-orange-400/25 dark:bg-orange-500/12 dark:text-orange-100" }, toDisplayString(unref(initials)), 1),
                createVNode("div", { class: "min-w-0" }, [
                  createVNode("p", { class: "text-xl font-semibold text-[var(--p-text)] dark:text-white" }, toDisplayString(unref(displayName)), 1),
                  createVNode("p", { class: "mt-1 text-sm text-[var(--p-text-muted)] dark:text-slate-300" }, toDisplayString(unref(authStore).user?.email ?? "No email available"), 1),
                  createVNode("p", { class: "mt-3 text-sm leading-6 text-[var(--p-text-dim)] dark:text-slate-300" }, toDisplayString(unref(profile)?.bio || "Add a short bio so collaborators and customers can quickly understand this account."), 1)
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
        description: "These sections are connected to current backend support and should stay in sync with the edit form."
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
                _push2(`<a${ssrRenderAttr("href", link.url)} target="_blank" rel="noreferrer" class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 dark:border-sky-400/25 dark:bg-sky-500/10 dark:text-sky-100 dark:hover:border-sky-300/40 dark:hover:bg-sky-500/15"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-link",
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
              title: "Not Supported Yet",
              description: "Avatar uploads, password change, and richer account preferences are not exposed on the current dashboard API. They are intentionally not shown as editable settings here.",
              icon: "i-lucide-server-off",
              tone: "orange"
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              disabled: unref(editDisabled),
              onClick: openEdit
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Update Profile `);
                } else {
                  return [
                    createTextVNode(" Update Profile ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
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
                        class: "inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 dark:border-sky-400/25 dark:bg-sky-500/10 dark:text-sky-100 dark:hover:border-sky-300/40 dark:hover:bg-sky-500/15"
                      }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-link",
                          class: "h-4 w-4"
                        }),
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
                title: "Not Supported Yet",
                description: "Avatar uploads, password change, and richer account preferences are not exposed on the current dashboard API. They are intentionally not shown as editable settings here.",
                icon: "i-lucide-server-off",
                tone: "orange"
              }),
              createVNode("div", { class: "flex justify-end" }, [
                createVNode(_component_UButton, {
                  color: "primary",
                  disabled: unref(editDisabled),
                  onClick: openEdit
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Update Profile ")
                  ]),
                  _: 1
                }, 8, ["disabled"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/profile/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B2YLZy6q.mjs.map
