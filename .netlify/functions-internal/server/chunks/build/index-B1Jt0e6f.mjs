import { _ as __nuxt_component_0 } from './DashboardPageHeader-2WLhb5mv.mjs';
import { f as useRoute, d as _sfc_main$9, a as _sfc_main$f, _ as __nuxt_component_3$1 } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_1 } from './SentQuoteStatusBadge-CmLqkd4A.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { b as formatCurrency, f as formatDate } from './formatters-r_qbKRfS.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { u as useShopStore } from './shop-COPLd96Y.mjs';
import { u as useSentQuotes } from './useIncomingRequests-Chmos0Yy.mjs';
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
import './Badge-DRRvJchD.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SentQuoteCard",
  __ssrInlineRender: true,
  props: {
    quote: {},
    shopSlug: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_SentQuoteStatusBadge = __nuxt_component_1;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/dashboard/shops/${__props.shopSlug}/sent-quotes/${__props.quote.id}`,
        class: "block rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 transition-colors hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-start gap-3"${_scopeId}><div class="min-w-0 flex-1"${_scopeId}><h3 class="font-semibold text-[var(--p-text)] truncate"${_scopeId}>${ssrInterpolate(__props.quote.customer_name || `Request #${__props.quote.quote_request_id}`)}</h3><p class="text-sm text-[var(--p-text-muted)] mt-0.5"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(__props.quote.total))} `);
            if (__props.quote.turnaround_days != null) {
              _push2(`<!--[--> · ${ssrInterpolate(__props.quote.turnaround_days)} day${ssrInterpolate(__props.quote.turnaround_days !== 1 ? "s" : "")}<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.quote.revision_number > 1) {
              _push2(`<!--[--> · Rev ${ssrInterpolate(__props.quote.revision_number)}<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</p></div>`);
            _push2(ssrRenderComponent(_component_SentQuoteStatusBadge, {
              status: __props.quote.status,
              class: "shrink-0"
            }, null, _parent2, _scopeId));
            _push2(`</div><p class="text-xs text-[var(--p-text-muted)] mt-2"${_scopeId}>${ssrInterpolate(unref(formatDate)(__props.quote.sent_at || __props.quote.created_at))}</p>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-start gap-3" }, [
                createVNode("div", { class: "min-w-0 flex-1" }, [
                  createVNode("h3", { class: "font-semibold text-[var(--p-text)] truncate" }, toDisplayString(__props.quote.customer_name || `Request #${__props.quote.quote_request_id}`), 1),
                  createVNode("p", { class: "text-sm text-[var(--p-text-muted)] mt-0.5" }, [
                    createTextVNode(toDisplayString(unref(formatCurrency)(__props.quote.total)) + " ", 1),
                    __props.quote.turnaround_days != null ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createTextVNode(" · " + toDisplayString(__props.quote.turnaround_days) + " day" + toDisplayString(__props.quote.turnaround_days !== 1 ? "s" : ""), 1)
                    ], 64)) : createCommentVNode("", true),
                    __props.quote.revision_number > 1 ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createTextVNode(" · Rev " + toDisplayString(__props.quote.revision_number), 1)
                    ], 64)) : createCommentVNode("", true)
                  ])
                ]),
                createVNode(_component_SentQuoteStatusBadge, {
                  status: __props.quote.status,
                  class: "shrink-0"
                }, null, 8, ["status"])
              ]),
              createVNode("p", { class: "text-xs text-[var(--p-text-muted)] mt-2" }, toDisplayString(unref(formatDate)(__props.quote.sent_at || __props.quote.created_at)), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sent/SentQuoteCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$1, { __name: "SentQuoteCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slug = computed(() => route.params.slug);
    const shopStore = useShopStore();
    const sentQuotes = useSentQuotes();
    const quotes = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const statusFilter = ref("all");
    const statusTabs = [
      { value: "all", label: "All" },
      { value: "draft", label: "Draft" },
      { value: "sent", label: "Awaiting response" },
      { value: "accepted", label: "Accepted" }
    ];
    const shopId = computed(() => shopStore.currentShop?.id ?? null);
    const filteredQuotes = computed(() => {
      const list = quotes.value;
      const sid = shopId.value;
      const shopFiltered = sid != null ? list.filter((q) => q.shop === sid) : list;
      if (statusFilter.value === "all") return shopFiltered;
      if (statusFilter.value === "draft") {
        return shopFiltered.filter((q) => String(q.status).toLowerCase() === "draft");
      }
      if (statusFilter.value === "accepted") {
        return shopFiltered.filter((q) => q.status === "accepted");
      }
      return shopFiltered.filter((q) => q.status === "sent" || q.status === "revised");
    });
    const emptyTitle = computed(() => {
      if (statusFilter.value === "all" && !filteredQuotes.value.length) {
        return "No quotes sent yet";
      }
      if (statusFilter.value === "draft") return "No draft quotes";
      if (statusFilter.value === "sent") return "No quotes awaiting response";
      if (statusFilter.value === "accepted") return "No accepted quotes yet";
      return "No quotes in this status";
    });
    const emptyDescription = computed(() => {
      if (statusFilter.value === "all" && !filteredQuotes.value.length) {
        return "Quotes you send to customers will appear here.";
      }
      return "Try another status filter or send a quote from an incoming request.";
    });
    async function fetchQuotes() {
      loading.value = true;
      error.value = null;
      try {
        await shopStore.fetchShopBySlug(slug.value);
        quotes.value = await sentQuotes.list();
      } catch (e) {
        error.value = e instanceof Error ? e.message : "Failed to load sent quotes";
        quotes.value = [];
      } finally {
        loading.value = false;
      }
    }
    watch(
      () => route.query.status,
      (status) => {
        if (status === "draft" || status === "sent" || status === "accepted") {
          statusFilter.value = status;
          return;
        }
        statusFilter.value = "all";
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_SentQuoteCard = __nuxt_component_4;
      const _component_DashboardEmptyState = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Sent Quotes",
        subtitle: "Quotes you've sent to customers. Track status and revisions."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}/incoming-requests`,
              variant: "soft",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-inbox",
                    class: "w-4 h-4 mr-2"
                  }, null, _parent3, _scopeId2));
                  _push3(` Incoming Requests `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-inbox",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" Incoming Requests ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}`,
              variant: "soft",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-left",
                    class: "w-4 h-4 mr-2"
                  }, null, _parent3, _scopeId2));
                  _push3(` Back `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-left",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" Back ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/incoming-requests`,
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-inbox",
                    class: "w-4 h-4 mr-2"
                  }),
                  createTextVNode(" Incoming Requests ")
                ]),
                _: 1
              }, 8, ["to"]),
              createVNode(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}`,
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-arrow-left",
                    class: "w-4 h-4 mr-2"
                  }),
                  createTextVNode(" Back ")
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex flex-wrap gap-2"><!--[-->`);
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
          onClick: fetchQuotes
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
      } else if (unref(filteredQuotes).length) {
        _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(filteredQuotes), (quote) => {
          _push(ssrRenderComponent(_component_SentQuoteCard, {
            key: quote.id,
            quote,
            "shop-slug": unref(slug)
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: unref(emptyTitle),
          description: unref(emptyDescription),
          icon: "i-lucide-send"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/incoming-requests`,
                color: "primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-inbox",
                      class: "w-4 h-4 mr-2"
                    }, null, _parent3, _scopeId2));
                    _push3(` View incoming requests `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-inbox",
                        class: "w-4 h-4 mr-2"
                      }),
                      createTextVNode(" View incoming requests ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  to: `/dashboard/shops/${unref(slug)}/incoming-requests`,
                  color: "primary"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-inbox",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" View incoming requests ")
                  ]),
                  _: 1
                }, 8, ["to"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/sent-quotes/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B1Jt0e6f.mjs.map
