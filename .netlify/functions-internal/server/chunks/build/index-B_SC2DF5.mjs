import { _ as __nuxt_component_0 } from './DashboardPageHeader-2WLhb5mv.mjs';
import { d as _sfc_main$9, a as _sfc_main$f, _ as __nuxt_component_3$1 } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$1 } from './Badge-DRRvJchD.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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
    const files = ref([]);
    const loading = ref(false);
    const error = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UBadge = _sfc_main$1;
      const _component_DashboardEmptyState = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Quote Files",
        subtitle: "Grouped by customer or company, with shop-specific sections inside each file."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              to: "/dashboard/quotes/create"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-folder-plus",
                    class: "mr-2 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` New Quote File `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-folder-plus",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" New Quote File ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                color: "primary",
                to: "/dashboard/quotes/create"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-folder-plus",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" New Quote File ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"><p class="text-sm text-red-700 dark:text-red-300">${ssrInterpolate(unref(error))}</p></div>`);
      } else if (unref(files).length) {
        _push(`<div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(files), (file) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: file.id,
            to: `/dashboard/quotes/files/${file.id}`,
            class: "block rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 transition-colors hover:border-flamingo-300 hover:bg-flamingo-50/30 dark:hover:border-flamingo-700 dark:hover:bg-flamingo-900/10"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-start justify-between gap-3"${_scopeId}><div class="min-w-0"${_scopeId}><h2 class="truncate text-xl font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(file.customer_name || file.company_name)}</h2><p class="mt-1 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(file.shop_count)} shop${ssrInterpolate(file.shop_count === 1 ? "" : "s")} · ${ssrInterpolate(file.item_count)} item${ssrInterpolate(file.item_count === 1 ? "" : "s")}</p></div>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: file.has_draft ? "warning" : "neutral",
                  variant: "soft",
                  size: "xs"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(file.has_draft ? "Open Drafts" : "Grouped")}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(file.has_draft ? "Open Drafts" : "Grouped"), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div><div class="mt-4 space-y-2"${_scopeId}><p class="text-sm text-[var(--p-text-dim)]"${_scopeId}><span class="font-medium text-[var(--p-text)]"${_scopeId}>Contact:</span> ${ssrInterpolate(file.contact_name || "Not set")}</p><p class="text-sm text-[var(--p-text-dim)]"${_scopeId}><span class="font-medium text-[var(--p-text)]"${_scopeId}>Email:</span> ${ssrInterpolate(file.contact_email || "Not set")}</p></div><div class="mt-5 flex items-center justify-between border-t border-[var(--p-border)] pt-4"${_scopeId}><div${_scopeId}><p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId}>Totals</p><p class="mt-1 text-sm font-medium text-[var(--p-text)]"${_scopeId}>Kept inside each shop section</p></div><span class="text-sm font-semibold text-flamingo-600 dark:text-flamingo-400"${_scopeId}>Open file</span></div>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "min-w-0" }, [
                      createVNode("h2", { class: "truncate text-xl font-semibold text-[var(--p-text)]" }, toDisplayString(file.customer_name || file.company_name), 1),
                      createVNode("p", { class: "mt-1 text-sm text-[var(--p-text-muted)]" }, toDisplayString(file.shop_count) + " shop" + toDisplayString(file.shop_count === 1 ? "" : "s") + " · " + toDisplayString(file.item_count) + " item" + toDisplayString(file.item_count === 1 ? "" : "s"), 1)
                    ]),
                    createVNode(_component_UBadge, {
                      color: file.has_draft ? "warning" : "neutral",
                      variant: "soft",
                      size: "xs"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(file.has_draft ? "Open Drafts" : "Grouped"), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ]),
                  createVNode("div", { class: "mt-4 space-y-2" }, [
                    createVNode("p", { class: "text-sm text-[var(--p-text-dim)]" }, [
                      createVNode("span", { class: "font-medium text-[var(--p-text)]" }, "Contact:"),
                      createTextVNode(" " + toDisplayString(file.contact_name || "Not set"), 1)
                    ]),
                    createVNode("p", { class: "text-sm text-[var(--p-text-dim)]" }, [
                      createVNode("span", { class: "font-medium text-[var(--p-text)]" }, "Email:"),
                      createTextVNode(" " + toDisplayString(file.contact_email || "Not set"), 1)
                    ])
                  ]),
                  createVNode("div", { class: "mt-5 flex items-center justify-between border-t border-[var(--p-border)] pt-4" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Totals"),
                      createVNode("p", { class: "mt-1 text-sm font-medium text-[var(--p-text)]" }, "Kept inside each shop section")
                    ]),
                    createVNode("span", { class: "text-sm font-semibold text-flamingo-600 dark:text-flamingo-400" }, "Open file")
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: "No quote files yet",
          description: "Start a grouped quote file for a customer or company, then attach shop-specific quote sections inside it.",
          icon: "i-lucide-folder-open"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                to: "/dashboard/quotes/create",
                color: "primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`New Quote File`);
                  } else {
                    return [
                      createTextVNode("New Quote File")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  to: "/dashboard/quotes/create",
                  color: "primary"
                }, {
                  default: withCtx(() => [
                    createTextVNode("New Quote File")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/quotes/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B_SC2DF5.mjs.map
