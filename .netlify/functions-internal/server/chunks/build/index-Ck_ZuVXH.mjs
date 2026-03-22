import { d as _sfc_main$9, a as _sfc_main$f, _ as __nuxt_component_3$1$1 } from './server.mjs';
import { _ as __nuxt_component_3$1 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$2 } from './Badge-DzyqaO77.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { a as formatKES } from './formatters-D5StX5za.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { u as useQuoteRequests } from './useQuoteRequests-BPnbXF7Y.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "QuoteRequestCard",
  __ssrInlineRender: true,
  props: {
    request: {}
  },
  setup(__props) {
    const props = __props;
    const statusLabels = {
      draft: "Draft",
      submitted: "Submitted",
      viewed: "Viewed",
      quoted: "Quoted",
      accepted: "Accepted",
      closed: "Closed",
      cancelled: "Cancelled"
    };
    const statusColor = computed(() => {
      const s = props.request.status;
      if (s === "quoted") return "warning";
      if (s === "accepted") return "success";
      if (s === "cancelled" || s === "closed") return "error";
      return "neutral";
    });
    const statusLabel = computed(
      () => statusLabels[props.request.status] ?? props.request.status
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1$1;
      const _component_UBadge = _sfc_main$2;
      const _component_UIcon = _sfc_main$f;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/quotes/${__props.request.id}`,
        class: "block rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:bg-flamingo-50/30 dark:hover:bg-flamingo-900/10"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-start gap-3"${_scopeId}><div class="min-w-0 flex-1"${_scopeId}><h3 class="font-semibold text-[var(--p-text)] truncate"${_scopeId}>${ssrInterpolate(__props.request.shop_name)}</h3><p class="text-sm text-[var(--p-text-muted)] mt-0.5"${_scopeId}> Request #${ssrInterpolate(__props.request.id)} · ${ssrInterpolate(__props.request.items_count ?? __props.request.items?.length ?? 0)} item(s) </p><div class="mt-2 flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              color: unref(statusColor),
              variant: "soft",
              size: "xs"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(statusLabel))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(statusLabel)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (__props.request.latest_sent_quote?.total) {
              _push2(`<span class="text-sm font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(unref(formatKES)(__props.request.latest_sent_quote.total))}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-chevron-right",
              class: "h-5 w-5 text-[var(--p-text-muted)] shrink-0"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-start gap-3" }, [
                createVNode("div", { class: "min-w-0 flex-1" }, [
                  createVNode("h3", { class: "font-semibold text-[var(--p-text)] truncate" }, toDisplayString(__props.request.shop_name), 1),
                  createVNode("p", { class: "text-sm text-[var(--p-text-muted)] mt-0.5" }, " Request #" + toDisplayString(__props.request.id) + " · " + toDisplayString(__props.request.items_count ?? __props.request.items?.length ?? 0) + " item(s) ", 1),
                  createVNode("div", { class: "mt-2 flex items-center gap-2" }, [
                    createVNode(_component_UBadge, {
                      color: unref(statusColor),
                      variant: "soft",
                      size: "xs"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(statusLabel)), 1)
                      ]),
                      _: 1
                    }, 8, ["color"]),
                    __props.request.latest_sent_quote?.total ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "text-sm font-semibold text-[var(--p-text)]"
                    }, toDisplayString(unref(formatKES)(__props.request.latest_sent_quote.total)), 1)) : createCommentVNode("", true)
                  ])
                ]),
                createVNode(_component_UIcon, {
                  name: "i-lucide-chevron-right",
                  class: "h-5 w-5 text-[var(--p-text-muted)] shrink-0"
                })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quoteRequests/QuoteRequestCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$1, { __name: "QuoteRequestsQuoteRequestCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const quoteRequests = useQuoteRequests();
    const requests = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const statusFilter = ref("all");
    const statusTabs = [
      { value: "all", label: "All" },
      { value: "requested", label: "Requested" },
      { value: "quoted", label: "Quoted" },
      { value: "accepted", label: "Accepted" },
      { value: "draft", label: "Draft" },
      { value: "closed", label: "Closed" }
    ];
    const filteredRequests = computed(() => {
      const list = requests.value;
      if (statusFilter.value === "all") return list;
      if (statusFilter.value === "requested") {
        return list.filter((r) => r.status === "submitted" || r.status === "viewed");
      }
      if (statusFilter.value === "closed") {
        return list.filter((r) => r.status === "closed" || r.status === "cancelled");
      }
      return list.filter((r) => r.status === statusFilter.value);
    });
    const emptyTitle = computed(() => {
      if (statusFilter.value === "all" && !requests.value.length) {
        return "No quote requests yet";
      }
      if (statusFilter.value === "requested") return "No requests awaiting shop response";
      if (statusFilter.value === "quoted") return "No quoted requests";
      if (statusFilter.value === "accepted") return "No accepted requests";
      if (statusFilter.value === "draft") return "No drafts";
      if (statusFilter.value === "closed") return "No closed requests";
      return "No requests in this status";
    });
    const emptyDescription = computed(() => {
      if (statusFilter.value === "all" && !requests.value.length) {
        return "Start by creating your first request. Browse a shop, add products to your draft, and submit.";
      }
      return "Try another status filter or create a new request.";
    });
    async function fetchRequests() {
      loading.value = true;
      error.value = null;
      try {
        requests.value = await quoteRequests.list();
      } catch (e) {
        error.value = e instanceof Error ? e.message : "Failed to load quote requests";
        requests.value = [];
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3$1;
      const _component_QuoteRequestsQuoteRequestCard = __nuxt_component_3;
      const _component_DashboardEmptyState = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)]" }, _attrs))}><div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"><div><h1 class="text-2xl font-bold text-[var(--p-text)]">Quote Requests</h1><p class="mt-1 text-sm text-[var(--p-text-muted)]"> Requests you&#39;ve sent to print shops. Track status and accept shop responses. </p></div><div class="flex gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/quotes/create",
        variant: "outline",
        size: "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-plus",
              class: "w-4 h-4 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Request a quote `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-plus",
                class: "w-4 h-4 mr-2"
              }),
              createTextVNode(" Request a quote ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        to: "/shops",
        variant: "outline",
        size: "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-store",
              class: "w-4 h-4 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Browse Shops `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-store",
                class: "w-4 h-4 mr-2"
              }),
              createTextVNode(" Browse Shops ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="flex flex-wrap gap-2 mb-6"><!--[-->`);
      ssrRenderList(statusTabs, (tab) => {
        _push(ssrRenderComponent(_component_UButton, {
          key: tab.value,
          variant: unref(statusFilter) === tab.value ? "solid" : "soft",
          color: unref(statusFilter) === tab.value ? "primary" : "neutral",
          size: "sm",
          onClick: ($event) => statusFilter.value = tab.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(tab.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(tab.label), 1)
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
        _push(`<div class="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4"><p class="text-sm text-red-700 dark:text-red-300">${ssrInterpolate(unref(error))}</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          variant: "soft",
          color: "error",
          size: "sm",
          class: "mt-2",
          onClick: fetchRequests
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Try again `);
            } else {
              return [
                createTextVNode(" Try again ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else if (unref(filteredRequests).length) {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(filteredRequests), (req) => {
          _push(ssrRenderComponent(_component_QuoteRequestsQuoteRequestCard, {
            key: req.id,
            request: req
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: unref(emptyTitle),
          description: unref(emptyDescription),
          icon: "i-lucide-file-search"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                to: "/quotes/create",
                color: "primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "w-4 h-4 mr-2"
                    }, null, _parent3, _scopeId2));
                    _push3(` Create your first request `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-plus",
                        class: "w-4 h-4 mr-2"
                      }),
                      createTextVNode(" Create your first request ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  to: "/quotes/create",
                  color: "primary"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" Create your first request ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quotes/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Ck_ZuVXH.mjs.map
