import { _ as __nuxt_component_0 } from './DashboardPageHeader-5_E3NIzR.mjs';
import { d as _sfc_main$9, a as _sfc_main$f, _ as __nuxt_component_3$1 } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$1 } from './Badge-xP9ZTQag.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { defineComponent, ref, watch, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { b as formatKES } from './formatters-C39vX7Ji.mjs';
import { u as useStaffQuotes } from './useStaffQuotes-BAf1ImNc.mjs';
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
    const staffQuotes = useStaffQuotes();
    const quotes = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const statusFilter = ref(null);
    const statusOptions = [
      { value: null, label: "All" },
      { value: "DRAFT", label: "Draft" },
      { value: "SENT", label: "Sent" },
      { value: "ACCEPTED", label: "Accepted" },
      { value: "EXPIRED", label: "Expired" }
    ];
    function staffQuoteStatusLabel(s) {
      const m = {
        DRAFT: "Draft",
        SENT: "Sent",
        ACCEPTED: "Accepted",
        EXPIRED: "Expired",
        SUBMITTED: "Submitted",
        PRICED: "Priced",
        REJECTED: "Rejected"
      };
      return m[s] ?? s;
    }
    function statusColor(s) {
      const m = {
        DRAFT: "neutral",
        SENT: "warning",
        ACCEPTED: "success",
        EXPIRED: "error",
        SUBMITTED: "warning",
        PRICED: "warning",
        REJECTED: "error"
      };
      return m[s] ?? "neutral";
    }
    async function fetchQuotes() {
      loading.value = true;
      error.value = null;
      try {
        const res = await staffQuotes.list(
          statusFilter.value ? { status: statusFilter.value } : void 0
        );
        quotes.value = res.results;
      } catch (e) {
        error.value = e instanceof Error ? e.message : "Failed to load quotes";
        quotes.value = [];
      } finally {
        loading.value = false;
      }
    }
    watch(statusFilter, () => fetchQuotes());
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
        title: "Staff Quotes",
        subtitle: "Create and manage print quotes. Staff only."
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
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-2"
                  }, null, _parent3, _scopeId2));
                  _push3(` New Quote `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" New Quote ")
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
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-2"
                  }),
                  createTextVNode(" New Quote ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex flex-wrap items-center gap-2"><!--[-->`);
      ssrRenderList(statusOptions, (opt) => {
        _push(ssrRenderComponent(_component_UButton, {
          key: opt.value,
          variant: unref(statusFilter) === opt.value ? "solid" : "soft",
          color: unref(statusFilter) === opt.value ? "primary" : "neutral",
          size: "sm",
          onClick: ($event) => statusFilter.value = opt.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(opt.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(opt.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4"><p class="text-sm text-red-700 dark:text-red-300">${ssrInterpolate(unref(error))}</p><p class="text-xs text-red-600 dark:text-red-400 mt-1">Ensure you have staff access.</p></div>`);
      } else if (unref(quotes).length) {
        _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(quotes), (q) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: q.id,
            to: `/dashboard/quotes/${q.id}`,
            class: "block rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:bg-flamingo-50/30 dark:hover:bg-flamingo-900/10"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex justify-between items-start"${_scopeId}><h3 class="font-semibold text-[var(--p-text)]"${_scopeId}>#${ssrInterpolate(q.id)} ${ssrInterpolate(q.customer_name || "No name")}</h3>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: statusColor(q.status),
                  variant: "soft",
                  size: "xs"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(staffQuoteStatusLabel(q.status))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(staffQuoteStatusLabel(q.status)), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div><p class="text-sm text-[var(--p-text-muted)] mt-0.5"${_scopeId}>${ssrInterpolate(q.shop_name)}</p><p class="text-lg font-bold text-[var(--p-text)] mt-2"${_scopeId}>${ssrInterpolate(q.total ? unref(formatKES)(q.total) : "—")}</p>`);
              } else {
                return [
                  createVNode("div", { class: "flex justify-between items-start" }, [
                    createVNode("h3", { class: "font-semibold text-[var(--p-text)]" }, "#" + toDisplayString(q.id) + " " + toDisplayString(q.customer_name || "No name"), 1),
                    createVNode(_component_UBadge, {
                      color: statusColor(q.status),
                      variant: "soft",
                      size: "xs"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(staffQuoteStatusLabel(q.status)), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ]),
                  createVNode("p", { class: "text-sm text-[var(--p-text-muted)] mt-0.5" }, toDisplayString(q.shop_name), 1),
                  createVNode("p", { class: "text-lg font-bold text-[var(--p-text)] mt-2" }, toDisplayString(q.total ? unref(formatKES)(q.total) : "—"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: "No quotes yet",
          description: "Create your first quote or start by calculating your first print job. Send prices to clients in seconds.",
          icon: "i-lucide-file-text"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                to: "/dashboard/quotes/create",
                color: "primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`New Quote`);
                  } else {
                    return [
                      createTextVNode("New Quote")
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
                    createTextVNode("New Quote")
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
//# sourceMappingURL=index-BzlkZKy-.mjs.map
