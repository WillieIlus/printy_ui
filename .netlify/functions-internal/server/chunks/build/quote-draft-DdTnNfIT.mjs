import { _ as __nuxt_component_1 } from './BackendQuoteCalculator-DwoilVbe.mjs';
import { c as useAuthStore, e as useToast, n as navigateTo, d as _sfc_main$9 } from './server.mjs';
import { _ as _sfc_main$1 } from './Badge-C1UUP90f.mjs';
import { defineComponent, ref, watchEffect, computed, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useQuoteInboxStore, Q as QuotesShopSelectionChips } from './quoteInbox-CT7a8yeE.mjs';
import { u as useQuoteRequestBlast } from './useQuoteRequestBlast-BX_QZhbB.mjs';
import { l as listShops } from './public-Dys9UREH.mjs';
import { g as getPostLoginRedirectPath } from './useAuth-DnD-pi_T.mjs';
import { e as extractProductionDetails } from './productionDetails-ByImjBQh.mjs';
import './Input-DZEAnFef.mjs';
import 'reka-ui';
import '@vueuse/core';
import './SelectMenu-DDFAjir1.mjs';
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
import './Textarea-BGCp2SzO.mjs';
import 'pinia';
import './machine-CsyB89Gp.mjs';
import './shop-DfXxeXDQ.mjs';
import './browser-storage-CN-SIF_V.mjs';
import './payload-B_6emhZU.mjs';
import './useCurrencyFormatter-BbngrNPq.mjs';
import './formatters-Cc_7PG6h.mjs';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'vue-i18n';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './profile-BFvViN4V.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "quote-draft",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const quoteInboxStore = useQuoteInboxStore();
    const { sendSavedDraft } = useQuoteRequestBlast();
    const toast = useToast();
    const statusFilter = ref("pending");
    const availableShops = ref([]);
    const selectedDraftShopSlugs = ref({});
    const sendingDraftId = ref(null);
    watchEffect(() => {
      if (!authStore.isClient && authStore.isAuthenticated) {
        navigateTo(getPostLoginRedirectPath(authStore.user, false));
      }
    });
    async function refreshWorkspace() {
      if (!authStore.isClient) return;
      await Promise.all([
        loadAvailableShops(),
        quoteInboxStore.fetchDrafts(),
        quoteInboxStore.fetchClientRequests()
      ]);
    }
    async function loadAvailableShops() {
      const shops = await listShops();
      availableShops.value = shops.map((shop) => ({ id: shop.id, name: shop.name, slug: shop.slug }));
    }
    const statusTabs = computed(() => [
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
    function draftBadgeColor(status) {
      if (status === "accepted") return "success";
      if (status === "rejected") return "error";
      if (status === "modified") return "warning";
      return "neutral";
    }
    function requestBadgeColor(status) {
      if (status === "accepted") return "success";
      if (status === "rejected") return "error";
      if (status === "modified") return "warning";
      return "neutral";
    }
    function draftProduction(draft) {
      return extractProductionDetails(draft.pricing_snapshot);
    }
    function defaultDraftShopSlugs(draft) {
      const snapshot = draft.request_details_snapshot ?? {};
      const fromSnapshot = Array.isArray(snapshot.selected_shop_slugs) ? snapshot.selected_shop_slugs.filter((value) => typeof value === "string") : [];
      if (fromSnapshot.length) return fromSnapshot;
      if (draft.shop_slug) return [draft.shop_slug];
      const fallbackShop = availableShops.value.find((shop) => shop.id === draft.shop);
      return fallbackShop ? [fallbackShop.slug] : [];
    }
    watch(
      () => [quoteInboxStore.drafts, availableShops.value],
      () => {
        const nextState = { ...selectedDraftShopSlugs.value };
        for (const draft of quoteInboxStore.drafts) {
          if (!nextState[draft.id]?.length) {
            nextState[draft.id] = defaultDraftShopSlugs(draft);
          }
        }
        selectedDraftShopSlugs.value = nextState;
      },
      { immediate: true, deep: true }
    );
    function toggleDraftShop(draftId, slug) {
      const current = selectedDraftShopSlugs.value[draftId] ?? [];
      selectedDraftShopSlugs.value = {
        ...selectedDraftShopSlugs.value,
        [draftId]: current.includes(slug) ? current.filter((value) => value !== slug) : [...current, slug]
      };
    }
    function selectedDraftShopIds(draft) {
      return (selectedDraftShopSlugs.value[draft.id] ?? []).map((slug) => availableShops.value.find((shop) => shop.slug === slug)?.id ?? null).filter((value) => typeof value === "number");
    }
    async function sendSavedDraftRequest(draft) {
      if (draft.status !== "draft") return;
      const shopIds = selectedDraftShopIds(draft);
      if (!shopIds.length) return;
      sendingDraftId.value = draft.id;
      try {
        const requests = await sendSavedDraft(
          draft.id,
          shopIds,
          {
            ...draft.request_details_snapshot ?? {},
            selected_shop_slugs: selectedDraftShopSlugs.value[draft.id] ?? [],
            selected_shop_ids: shopIds
          }
        );
        if (requests?.length) {
          toast.add({ title: "Request sent", description: requests.length === 1 ? "The selected shop received this draft." : `${requests.length} shops received this draft.`, color: "success" });
          await refreshWorkspace();
        }
      } catch (error) {
        toast.add({ title: "Error", description: error instanceof Error ? error.message : "Could not send this draft.", color: "error" });
      } finally {
        sendingDraftId.value = null;
      }
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
      const _component_QuotesBackendQuoteCalculator = __nuxt_component_1;
      const _component_UButton = _sfc_main$9;
      const _component_UBadge = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-surface)]" }, _attrs))}><main class="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">`);
      _push(ssrRenderComponent(_component_QuotesBackendQuoteCalculator, {
        title: "Prepare a quote draft",
        description: "This uses the backend preview path directly. Save drafts, send them to selected shops, and keep pricing logic out of the browser.",
        eyebrow: "Client Drafts",
        mode: "client",
        onDraftSaved: refreshWorkspace,
        onDraftSent: refreshWorkspace
      }, null, _parent));
      _push(`<section class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Saved Drafts</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Draft history</h2><p class="mt-2 text-sm text-[var(--p-text-muted)]">Saved draft records come from the backend calculator draft endpoints.</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        loading: unref(quoteInboxStore).loading,
        onClick: refreshWorkspace
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
      _push(`</div>`);
      if (unref(quoteInboxStore).loading && !unref(quoteInboxStore).drafts.length) {
        _push(`<div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
        ssrRenderList(3, (index) => {
          _push(`<div class="h-36 animate-pulse rounded-2xl bg-[var(--p-surface-sunken)]"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(quoteInboxStore).drafts.length) {
        _push(`<div class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]"> No drafts yet. Save a draft from the calculator above. </div>`);
      } else {
        _push(`<div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(quoteInboxStore).drafts, (draft) => {
          _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"><div class="flex items-start justify-between gap-3"><div><p class="text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(draft.title || draft.draft_reference || `Draft #${draft.id}`)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(draft.request_details_snapshot?.customer_name || "No customer name yet")}</p></div>`);
          _push(ssrRenderComponent(_component_UBadge, {
            variant: "soft",
            color: draftBadgeColor(draft.status)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(draft.status)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(draft.status), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><div class="mt-4 grid gap-3 sm:grid-cols-2"><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Shop</p><p class="mt-2 text-sm text-[var(--p-text)]">${ssrInterpolate(draft.shop_name || draft.shop_slug || "Unassigned")}</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Preview total</p><p class="mt-2 text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(draft.pricing_snapshot?.totals?.grand_total || "Awaiting preview")}</p></div></div>`);
          if (draftProduction(draft).piecesPerSheet || draftProduction(draft).sheetsNeeded) {
            _push(`<div class="mt-4 grid gap-3 sm:grid-cols-2"><div class="rounded-2xl border border-flamingo-200 bg-[var(--p-surface)] p-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Pcs per sheet</p><p class="mt-2 text-lg font-extrabold text-[var(--p-text)]">${ssrInterpolate(draftProduction(draft).piecesPerSheet)}</p></div><div class="rounded-2xl border border-flamingo-200 bg-[var(--p-surface)] p-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Sheets needed</p><p class="mt-2 text-lg font-extrabold text-flamingo-600">${ssrInterpolate(draftProduction(draft).sheetsNeeded)}</p></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(availableShops).length) {
            _push(`<div class="mt-4 space-y-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Selected shops</p>`);
            _push(ssrRenderComponent(QuotesShopSelectionChips, {
              shops: unref(availableShops).map((shop) => ({ slug: shop.slug, label: shop.name })),
              "selected-slugs": unref(selectedDraftShopSlugs)[draft.id] ?? [],
              onToggle: ($event) => toggleDraftShop(draft.id, $event)
            }, null, _parent));
            _push(ssrRenderComponent(_component_UButton, {
              size: "sm",
              color: "primary",
              loading: unref(sendingDraftId) === draft.id,
              disabled: draft.status !== "draft" || !selectedDraftShopIds(draft).length,
              onClick: ($event) => sendSavedDraftRequest(draft)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(draft.status === "draft" ? "Send request to selected shops" : "Request already sent")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(draft.status === "draft" ? "Send request to selected shops" : "Request already sent"), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</article>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</section><section class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Sent Requests</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Shop responses</h2><p class="mt-2 text-sm text-[var(--p-text-muted)]"> Statuses below are derived from backend quote request and quote response endpoints. </p></div><div class="flex flex-wrap gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        to: "/quotes"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Open full requests`);
          } else {
            return [
              createTextVNode("Open full requests")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        loading: unref(quoteInboxStore).loading,
        onClick: refreshWorkspace
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
      ssrRenderList(unref(statusTabs), (tab) => {
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
          _push(`<div class="h-40 animate-pulse rounded-2xl bg-[var(--p-surface-sunken)]"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(filteredRequests).length) {
        _push(`<div class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]"> No requests in this status yet. </div>`);
      } else {
        _push(`<div class="mt-6 grid gap-4 md:grid-cols-2"><!--[-->`);
        ssrRenderList(unref(filteredRequests), (request) => {
          _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><p class="text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(request.shop_name)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(request.customer_name || "No customer name")}</p></div>`);
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
          _push(`</div><div class="mt-4 grid gap-3 sm:grid-cols-2"><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Latest total</p><p class="mt-2 text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(request.latest_response?.total || request.latest_sent_quote?.total || "Awaiting shop response")}</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Turnaround</p><p class="mt-2 text-sm text-[var(--p-text)]">${ssrInterpolate(request.latest_sent_quote?.turnaround_days ? `${request.latest_sent_quote.turnaround_days} day(s)` : "On request")}</p></div></div><div class="mt-4 flex items-center justify-between gap-3"><p class="text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]">${ssrInterpolate(formatRequestDate(request.updated_at || request.created_at))}</p>`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            to: `/quotes/${request.id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Open request`);
              } else {
                return [
                  createTextVNode("Open request")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></article>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</section></main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quote-draft.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=quote-draft-DdTnNfIT.mjs.map
