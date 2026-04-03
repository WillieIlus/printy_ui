import { b as _sfc_main$9 } from './server.mjs';
import { _ as _sfc_main$1 } from './Badge-Dn_IFHF_.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as useActivityBadgesStore } from './activityBadges-B_bMwbEc.mjs';
import { u as useQuoteInboxStore } from './quoteInbox-BZeZ2Gtb.mjs';
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
import './useNotifications-BB49WIYK.mjs';
import './interval-DiSDr_Za.mjs';
import './quoteDraft-5mvcgeM-.mjs';
import './useApi-Cs2GTEbX.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "inbox",
  __ssrInlineRender: true,
  setup(__props) {
    const activityBadgesStore = useActivityBadgesStore();
    const quoteInboxStore = useQuoteInboxStore();
    const statusFilter = ref("pending");
    const tabs = computed(() => [
      { label: "Pending", value: "pending", count: quoteInboxStore.clientRequests.filter((request) => request.response_status === "pending").length },
      { label: "Modified", value: "modified", count: quoteInboxStore.clientRequests.filter((request) => request.response_status === "modified").length },
      { label: "Accepted", value: "accepted", count: quoteInboxStore.clientRequests.filter((request) => request.response_status === "accepted").length },
      { label: "Rejected", value: "rejected", count: quoteInboxStore.clientRequests.filter((request) => request.response_status === "rejected").length },
      { label: "All", value: "all", count: quoteInboxStore.clientRequests.length }
    ]);
    const filteredRequests = computed(() => {
      if (statusFilter.value === "all") return quoteInboxStore.clientRequests;
      return quoteInboxStore.clientRequests.filter((request) => request.response_status === statusFilter.value);
    });
    async function refreshInbox() {
      await Promise.all([
        quoteInboxStore.fetchClientRequests(),
        activityBadgesStore.fetchSummary()
      ]);
    }
    function requestBadgeColor(status) {
      if (status === "accepted") return "success";
      if (status === "rejected") return "error";
      if (status === "modified") return "warning";
      return "neutral";
    }
    function formatRequestDate(value) {
      if (!value) return "Recently";
      try {
        return new Intl.DateTimeFormat("en-KE", {
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit"
        }).format(new Date(value));
      } catch {
        return value;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UBadge = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Inbox</p><h1 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Messages and quote updates</h1><p class="mt-2 text-sm text-[var(--p-text-muted)]"> Follow shop replies, fresh quotes, and request changes without entering the shop dashboard flow. </p></div><div class="flex flex-wrap gap-3"><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">New Quotes</p><p class="mt-1 text-xl font-extrabold text-[var(--p-text)]">${ssrInterpolate(unref(activityBadgesStore).summary.client.new_quotes)}</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Replies</p><p class="mt-1 text-xl font-extrabold text-[var(--p-text)]">${ssrInterpolate(unref(activityBadgesStore).summary.client.shop_replies)}</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        loading: unref(quoteInboxStore).loading,
        onClick: refreshInbox
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Refresh`);
          } else {
            return [
              createTextVNode("Refresh")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="mt-5 flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(unref(tabs), (tab) => {
        _push(ssrRenderComponent(_component_UButton, {
          key: tab.value,
          variant: unref(statusFilter) === tab.value ? "solid" : "soft",
          color: unref(statusFilter) === tab.value ? "primary" : "neutral",
          onClick: ($event) => statusFilter.value = tab.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(tab.label)} <span class="ml-1 opacity-75"${_scopeId}>${ssrInterpolate(tab.count)}</span>`);
            } else {
              return [
                createTextVNode(toDisplayString(tab.label) + " ", 1),
                createVNode("span", { class: "ml-1 opacity-75" }, toDisplayString(tab.count), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      if (unref(quoteInboxStore).loading && !unref(quoteInboxStore).clientRequests.length) {
        _push(`<div class="mt-6 grid gap-4 md:grid-cols-2"><!--[-->`);
        ssrRenderList(4, (index) => {
          _push(`<div class="h-36 animate-pulse rounded-2xl bg-[var(--p-surface-sunken)]"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(filteredRequests).length) {
        _push(`<div class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]"> No inbox items in this view yet. </div>`);
      } else {
        _push(`<div class="mt-6 grid gap-4 md:grid-cols-2"><!--[-->`);
        ssrRenderList(unref(filteredRequests), (request) => {
          _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><p class="truncate text-base font-semibold text-[var(--p-text)]">${ssrInterpolate(request.shop_name)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(request.customer_name || "No customer name")}</p></div>`);
          _push(ssrRenderComponent(_component_UBadge, {
            variant: "soft",
            color: requestBadgeColor(request.response_status)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(request.response_status)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(request.response_status), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><div class="mt-4 grid gap-3 sm:grid-cols-2"><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Latest total</p><p class="mt-2 text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(request.latest_response?.total || request.latest_sent_quote?.total || "Awaiting shop response")}</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Turnaround</p><p class="mt-2 text-sm text-[var(--p-text)]">${ssrInterpolate(request.latest_sent_quote?.human_ready_text || (request.latest_sent_quote?.turnaround_hours ? `${request.latest_sent_quote.turnaround_hours} working hour(s)` : "On request"))}</p></div></div><div class="mt-4 flex items-center justify-between gap-3"><p class="text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]">${ssrInterpolate(formatRequestDate(request.updated_at || request.created_at))}</p>`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            to: `/quotes/${request.id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Open thread`);
              } else {
                return [
                  createTextVNode("Open thread")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></article>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/inbox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=inbox-CuZdtXcM.mjs.map
