import { _ as __nuxt_component_0 } from './DashboardPageHeader-DY_0uFAc.mjs';
import { g as useRoute, e as _sfc_main$9, a as _sfc_main$f, _ as __nuxt_component_3$1 } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_1 } from './IncomingRequestStatusBadge-JxiipfjK.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { b as formatDate } from './formatters-D5StX5za.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { u as useIncomingRequests } from './useIncomingRequests-Bb7QTcAK.mjs';
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
import './Badge-CHxS7t2J.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "IncomingRequestCard",
  __ssrInlineRender: true,
  props: {
    request: {},
    shopSlug: {}
  },
  setup(__props) {
    const props = __props;
    const deliveryLabel = computed(() => {
      const pref = props.request.delivery_preference;
      if (pref === "pickup") return "Pickup";
      if (pref === "delivery") return "Delivery";
      return pref ?? "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_IncomingRequestStatusBadge = __nuxt_component_1;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/dashboard/shops/${__props.shopSlug}/incoming-requests/${__props.request.id}`,
        class: "block rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:bg-flamingo-50/30 dark:hover:bg-flamingo-900/10"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-start gap-3"${_scopeId}><div class="min-w-0 flex-1"${_scopeId}><h3 class="font-semibold text-[var(--p-text)] truncate"${_scopeId}>${ssrInterpolate(__props.request.customer_name || "No name")}</h3><p class="text-sm text-[var(--p-text-muted)] mt-0.5"${_scopeId}>${ssrInterpolate(__props.request.items_count)} item${ssrInterpolate(__props.request.items_count !== 1 ? "s" : "")} `);
            if (__props.request.delivery_preference) {
              _push2(`<!--[--> · ${ssrInterpolate(unref(deliveryLabel))}<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</p></div>`);
            _push2(ssrRenderComponent(_component_IncomingRequestStatusBadge, {
              status: __props.request.status,
              class: "shrink-0"
            }, null, _parent2, _scopeId));
            _push2(`</div><p class="text-xs text-[var(--p-text-muted)] mt-2"${_scopeId}>${ssrInterpolate(unref(formatDate)(__props.request.created_at))}</p>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-start gap-3" }, [
                createVNode("div", { class: "min-w-0 flex-1" }, [
                  createVNode("h3", { class: "font-semibold text-[var(--p-text)] truncate" }, toDisplayString(__props.request.customer_name || "No name"), 1),
                  createVNode("p", { class: "text-sm text-[var(--p-text-muted)] mt-0.5" }, [
                    createTextVNode(toDisplayString(__props.request.items_count) + " item" + toDisplayString(__props.request.items_count !== 1 ? "s" : "") + " ", 1),
                    __props.request.delivery_preference ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createTextVNode(" · " + toDisplayString(unref(deliveryLabel)), 1)
                    ], 64)) : createCommentVNode("", true)
                  ])
                ]),
                createVNode(_component_IncomingRequestStatusBadge, {
                  status: __props.request.status,
                  class: "shrink-0"
                }, null, 8, ["status"])
              ]),
              createVNode("p", { class: "text-xs text-[var(--p-text-muted)] mt-2" }, toDisplayString(unref(formatDate)(__props.request.created_at)), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/incoming/IncomingRequestCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$1, { __name: "IncomingRequestCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slugRef = computed(() => route.params.slug);
    const slug = slugRef;
    const incoming = useIncomingRequests(slugRef);
    const requests = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const statusFilter = ref("all");
    const statusTabs = [
      { value: "all", label: "All" },
      { value: "new", label: "New" },
      { value: "viewed", label: "Viewed" },
      { value: "quoted", label: "Quoted" },
      { value: "closed", label: "Closed" }
    ];
    const filteredRequests = computed(() => {
      const list = requests.value;
      if (statusFilter.value === "all") return list;
      if (statusFilter.value === "new") {
        return list.filter((r) => r.status === "submitted");
      }
      if (statusFilter.value === "viewed") {
        return list.filter((r) => r.status === "viewed");
      }
      if (statusFilter.value === "quoted") {
        return list.filter((r) => r.status === "quoted" || r.status === "accepted");
      }
      if (statusFilter.value === "closed") {
        return list.filter((r) => r.status === "closed" || r.status === "cancelled");
      }
      return list;
    });
    const emptyTitle = computed(() => {
      if (statusFilter.value === "all" && !requests.value.length) {
        return "No incoming requests";
      }
      if (statusFilter.value === "new") return "No new requests";
      if (statusFilter.value === "viewed") return "No viewed requests";
      if (statusFilter.value === "quoted") return "No quoted requests";
      if (statusFilter.value === "closed") return "No closed requests";
      return "No requests in this status";
    });
    const emptyDescription = computed(() => {
      if (statusFilter.value === "all" && !requests.value.length) {
        return "New quote requests will appear here when customers submit.";
      }
      return "Try another status filter.";
    });
    async function fetchRequests() {
      loading.value = true;
      error.value = null;
      try {
        requests.value = await incoming.list();
      } catch (e) {
        error.value = e instanceof Error ? e.message : "Failed to load incoming requests";
        requests.value = [];
      } finally {
        loading.value = false;
      }
    }
    watch(slugRef, () => fetchRequests(), { immediate: false });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_IncomingRequestCard = __nuxt_component_4;
      const _component_DashboardEmptyState = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Incoming Requests",
        subtitle: "Quote requests from customers. Send a quote, revise, or decline."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
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
        _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(filteredRequests), (req) => {
          _push(ssrRenderComponent(_component_IncomingRequestCard, {
            key: req.id,
            request: req,
            "shop-slug": unref(slug)
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: unref(emptyTitle),
          description: unref(emptyDescription),
          icon: "i-lucide-file-search"
        }, null, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/incoming-requests/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B8GOMHG_.mjs.map
