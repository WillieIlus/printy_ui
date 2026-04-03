import { _ as __nuxt_component_0 } from './DashboardPageHeader-Cmi_LCe-.mjs';
import { _ as __nuxt_component_1 } from './pricingBreakdown-CT3rnr7b.mjs';
import { _ as __nuxt_component_2 } from './BackendQuoteCalculator-LNtZ4F8P.mjs';
import { _ as __nuxt_component_3 } from './BookletCalculator-CV4rstZN.mjs';
import { _ as __nuxt_component_4 } from './LargeFormatCalculator-B6MJg4wd.mjs';
import { d as useAuthStore, n as navigateTo, b as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_4$1 } from './SkeletonState-BhcHA7h3.mjs';
import { _ as _sfc_main$1 } from './Badge-Dn_IFHF_.mjs';
import { defineComponent, ref, watchEffect, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { g as getPostLoginRedirectPath } from './useAuth-D74NSkk_.mjs';
import { u as useQuoteInboxStore } from './quoteInbox-BZeZ2Gtb.mjs';
import { u as useSetupStatusStore } from './setupStatus-BIGAzyB1.mjs';
import { u as useShopStore } from './shop-DqJLBw0V.mjs';
import './calculationResult-SiwRgRTu.mjs';
import './SelectMenu-D3Bra_sq.mjs';
import 'reka-ui';
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
import '@vueuse/core';
import './Input-Hudv-7BP.mjs';
import './Textarea-DUPwu95P.mjs';
import './activityBadges-B_bMwbEc.mjs';
import 'pinia';
import './useNotifications-BB49WIYK.mjs';
import './interval-DiSDr_Za.mjs';
import './machine-DD004_8d.mjs';
import './payload-B_6emhZU.mjs';
import './useCurrencyFormatter-tIWAo1tq.mjs';
import './formatters-FW8HHCjc.mjs';
import './public-BVuVnl0E.mjs';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'vue-i18n';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './profile-v5Kfn5BI.mjs';
import './quoteDraft-5mvcgeM-.mjs';
import './useApi-Cs2GTEbX.mjs';
import './browser-storage-CN-SIF_V.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const quoteInboxStore = useQuoteInboxStore();
    const setupStore = useSetupStatusStore();
    const shopStore = useShopStore();
    const activeTab = ref("pending");
    watchEffect(() => {
      if (authStore.isClient) {
        navigateTo(getPostLoginRedirectPath(authStore.user, false));
      }
    });
    async function refreshDashboard() {
      await Promise.all([
        quoteInboxStore.fetchDashboard(),
        setupStore.fetchStatus(shopStore.selectedShopSlug)
      ]);
    }
    const metrics = computed(() => [
      {
        label: "Received requests",
        value: quoteInboxStore.dashboard?.received_quote_requests ?? 0,
        note: "Backend request count for the active shop."
      },
      {
        label: "Pending",
        value: quoteInboxStore.dashboard?.status_counts?.pending ?? 0,
        note: "Waiting for the next shop action."
      },
      {
        label: "Modified",
        value: quoteInboxStore.dashboard?.status_counts?.modified ?? 0,
        note: "Replied with a revised quote."
      },
      {
        label: "Next setup",
        value: setupStore.status?.next_step ?? "complete",
        note: setupStore.status?.next_url ?? "Setup complete."
      }
    ]);
    const tabs = computed(() => [
      { label: "Pending", value: "pending", count: quoteInboxStore.dashboard?.status_counts?.pending ?? 0 },
      { label: "Modified", value: "modified", count: quoteInboxStore.dashboard?.status_counts?.modified ?? 0 },
      { label: "Accepted", value: "accepted", count: quoteInboxStore.dashboard?.status_counts?.accepted ?? 0 },
      { label: "Rejected", value: "rejected", count: quoteInboxStore.dashboard?.status_counts?.rejected ?? 0 },
      { label: "All", value: "all", count: quoteInboxStore.dashboard?.received_quote_requests ?? 0 }
    ]);
    const filteredRequests = computed(() => {
      const requests = quoteInboxStore.dashboard?.recent_requests ?? [];
      if (activeTab.value === "all") return requests;
      return requests.filter((request) => (request.latest_response?.status || "pending") === activeTab.value);
    });
    const styledRequests = computed(() => filteredRequests.value.map((request) => {
      const state = deriveRequestVisualState(request);
      const contactLabel = request.customer_phone || request.customer_email || "No contact provided";
      const contactMeta = request.customer_phone && request.customer_email ? request.customer_email : "";
      const totalLabel = request.latest_response?.total || (state.kind === "quoted" ? "Quote total pending sync" : "Awaiting quote");
      const sourceLabel = request.source_draft_reference ? "Source draft" : "Source";
      const sourceValue = request.source_draft_reference || "Direct request";
      const updatedValue = request.updated_at || request.created_at;
      return {
        ...request,
        ...state,
        contactLabel,
        contactMeta,
        totalLabel,
        totalMeta: state.totalMeta,
        updatedLabel: formatDashboardDate(updatedValue),
        updatedRelative: formatRelativeTime(updatedValue),
        timeToneLabel: formatTimeTone(updatedValue, state.kind),
        sourceLabel,
        sourceValue,
        sourceMeta: request.request_reference ? `Request ${request.request_reference}` : "No custom request reference",
        summaryLine: state.summaryLine,
        summaryMeta: state.summaryMeta
      };
    }));
    function deriveRequestVisualState(request) {
      const requestStatus = request.status || "submitted";
      const responseStatus = request.latest_response?.status || null;
      if (responseStatus === "accepted") {
        return {
          kind: "accepted",
          badgeLabel: "Accepted",
          badgeColor: "success",
          helperText: "Customer accepted the latest quote.",
          summaryLine: "Approved request ready for production follow-through.",
          summaryMeta: "Latest customer decision is final unless the request changes again.",
          totalMeta: "Accepted quote total",
          cardClass: "border-emerald-200/80 bg-[color:color-mix(in_oklab,var(--p-surface)_82%,rgb(16_185_129)_8%)] dark:border-emerald-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface)_88%,rgb(16_185_129)_10%)]",
          accentClass: "bg-emerald-500/80 dark:bg-emerald-500/70",
          panelClass: "border-emerald-200/70 bg-[color:color-mix(in_oklab,var(--p-surface)_90%,rgb(16_185_129)_4%)] dark:border-emerald-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_88%,rgb(16_185_129)_8%)]",
          summaryPanelClass: "border-emerald-300/80 bg-[color:color-mix(in_oklab,var(--p-surface)_86%,rgb(16_185_129)_8%)] dark:border-emerald-800/80 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_84%,rgb(16_185_129)_12%)]",
          metaPillClass: "border border-emerald-200/80 bg-emerald-50/80 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300",
          dotClass: "bg-emerald-500",
          dotGlow: "rgb(16 185 129)",
          showUnreadDot: false,
          badgeIcon: "i-lucide-badge-check",
          primaryActionLabel: "View quote",
          primaryActionIcon: "i-lucide-file-check-2",
          primaryActionVariant: "soft",
          primaryActionColor: "success"
        };
      }
      if (responseStatus === "rejected") {
        return {
          kind: "rejected",
          badgeLabel: "Rejected",
          badgeColor: "error",
          helperText: "Customer declined the last quote response.",
          summaryLine: "Closed out for now after the latest quote was declined.",
          summaryMeta: "Keep the brief available in case the customer asks to reopen it.",
          totalMeta: "Last quoted amount",
          cardClass: "border-rose-200/80 bg-[color:color-mix(in_oklab,var(--p-surface)_84%,rgb(244_63_94)_7%)] dark:border-rose-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface)_88%,rgb(244_63_94)_10%)]",
          accentClass: "bg-rose-500/75 dark:bg-rose-500/70",
          panelClass: "border-rose-200/70 bg-[color:color-mix(in_oklab,var(--p-surface)_90%,rgb(244_63_94)_3%)] dark:border-rose-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_88%,rgb(244_63_94)_7%)]",
          summaryPanelClass: "border-rose-300/80 bg-[color:color-mix(in_oklab,var(--p-surface)_86%,rgb(244_63_94)_7%)] dark:border-rose-800/80 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_84%,rgb(244_63_94)_11%)]",
          metaPillClass: "border border-rose-200/80 bg-rose-50/80 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300",
          dotClass: "bg-rose-500",
          dotGlow: "rgb(244 63 94)",
          showUnreadDot: false,
          badgeIcon: "i-lucide-circle-x",
          primaryActionLabel: "View request",
          primaryActionIcon: "i-lucide-file-search",
          primaryActionVariant: "soft",
          primaryActionColor: "error"
        };
      }
      if (responseStatus === "modified") {
        return {
          kind: "modified",
          badgeLabel: "Modified",
          badgeColor: "warning",
          helperText: "Changes need review before the next action.",
          summaryLine: "Customer feedback changed the brief after your last response.",
          summaryMeta: "Re-check pricing, specs, and delivery assumptions before replying again.",
          totalMeta: "Last revision amount",
          cardClass: "border-amber-200/80 bg-[color:color-mix(in_oklab,var(--p-surface)_80%,rgb(245_158_11)_10%)] dark:border-amber-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface)_86%,rgb(245_158_11)_12%)]",
          accentClass: "bg-amber-500/85 dark:bg-amber-500/75",
          panelClass: "border-amber-200/70 bg-[color:color-mix(in_oklab,var(--p-surface)_90%,rgb(245_158_11)_4%)] dark:border-amber-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_88%,rgb(245_158_11)_8%)]",
          summaryPanelClass: "border-amber-300/80 bg-[color:color-mix(in_oklab,var(--p-surface)_84%,rgb(245_158_11)_10%)] dark:border-amber-800/80 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_82%,rgb(245_158_11)_14%)]",
          metaPillClass: "border border-amber-200/80 bg-amber-50/80 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300",
          dotClass: "bg-amber-500",
          dotGlow: "rgb(245 158 11)",
          showUnreadDot: true,
          badgeIcon: "i-lucide-file-warning",
          primaryActionLabel: "Review changes",
          primaryActionIcon: "i-lucide-refresh-cw",
          primaryActionVariant: "solid",
          primaryActionColor: "warning"
        };
      }
      if (requestStatus === "quoted" || responseStatus === "pending") {
        return {
          kind: "quoted",
          badgeLabel: "Quote sent",
          badgeColor: "primary",
          helperText: "Quote sent and waiting for customer response.",
          summaryLine: "Latest quote is out with the customer for review.",
          summaryMeta: "Track response timing and be ready if they ask for a revision.",
          totalMeta: "Most recent quoted total",
          cardClass: "border-[color:color-mix(in_oklab,var(--p-border)_88%,rgb(240_82_36)_12%)] bg-[color:color-mix(in_oklab,var(--p-surface)_92%,rgb(240_82_36)_8%)] dark:border-[color:color-mix(in_oklab,var(--p-border)_84%,rgb(243_115_68)_16%)] dark:bg-[color:color-mix(in_oklab,var(--p-surface)_90%,rgb(243_115_68)_10%)]",
          accentClass: "bg-flamingo-500/80 dark:bg-flamingo-400/75",
          panelClass: "border-[color:color-mix(in_oklab,var(--p-border)_88%,rgb(240_82_36)_12%)] bg-[color:color-mix(in_oklab,var(--p-surface)_95%,rgb(240_82_36)_5%)] dark:border-[color:color-mix(in_oklab,var(--p-border)_84%,rgb(243_115_68)_16%)] dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_92%,rgb(243_115_68)_8%)]",
          summaryPanelClass: "border-flamingo-200/80 bg-[color:color-mix(in_oklab,var(--p-surface)_90%,rgb(240_82_36)_10%)] dark:border-flamingo-800/70 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_86%,rgb(243_115_68)_14%)]",
          metaPillClass: "border border-flamingo-200/80 bg-flamingo-50/80 text-flamingo-700 dark:border-flamingo-900/70 dark:bg-flamingo-950/40 dark:text-flamingo-300",
          dotClass: "bg-flamingo-500",
          dotGlow: "rgb(240 82 36)",
          showUnreadDot: false,
          badgeIcon: "i-lucide-send",
          primaryActionLabel: "View quote",
          primaryActionIcon: "i-lucide-arrow-up-right",
          primaryActionVariant: "soft",
          primaryActionColor: "primary"
        };
      }
      if (requestStatus === "viewed") {
        return {
          kind: "opened",
          badgeLabel: "Opened",
          badgeColor: "neutral",
          helperText: "Opened by the shop and awaiting a quote.",
          summaryLine: "Already reviewed once, but no quote has been sent yet.",
          summaryMeta: "Continue from the existing brief instead of starting over.",
          totalMeta: "Quote not sent yet",
          cardClass: "border-[color:color-mix(in_oklab,var(--p-border)_92%,transparent)] bg-[color:color-mix(in_oklab,var(--p-surface)_92%,var(--p-surface-sunken)_8%)]",
          accentClass: "bg-slate-400/70 dark:bg-slate-500/70",
          panelClass: "border-[color:color-mix(in_oklab,var(--p-border)_88%,transparent)] bg-[color:color-mix(in_oklab,var(--p-surface)_94%,var(--p-surface-sunken)_6%)]",
          summaryPanelClass: "border-[color:color-mix(in_oklab,var(--p-border)_94%,transparent)] bg-[color:color-mix(in_oklab,var(--p-surface-sunken)_88%,transparent)]",
          metaPillClass: "border border-[color:color-mix(in_oklab,var(--p-border)_86%,transparent)] bg-[var(--p-surface)] text-[var(--p-text-muted)]",
          dotClass: "bg-slate-400",
          dotGlow: "rgb(148 163 184)",
          showUnreadDot: false,
          badgeIcon: "i-lucide-eye",
          primaryActionLabel: "Continue",
          primaryActionIcon: "i-lucide-arrow-right",
          primaryActionVariant: "soft",
          primaryActionColor: "neutral"
        };
      }
      return {
        kind: "new",
        badgeLabel: "New",
        badgeColor: "warning",
        helperText: "Unseen request awaiting your first review.",
        summaryLine: "Fresh request at the top of the inbox flow.",
        summaryMeta: "Open quickly to capture urgency and respond while the brief is fresh.",
        totalMeta: "No quote sent yet",
        cardClass: "border-flamingo-200/80 bg-[color:color-mix(in_oklab,var(--p-surface)_78%,rgb(251_113_133)_10%)] dark:border-flamingo-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface)_84%,rgb(251_113_133)_12%)]",
        accentClass: "bg-flamingo-500/85 dark:bg-flamingo-500/75",
        panelClass: "border-flamingo-200/70 bg-[color:color-mix(in_oklab,var(--p-surface)_89%,rgb(251_113_133)_4%)] dark:border-flamingo-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_88%,rgb(251_113_133)_8%)]",
        summaryPanelClass: "border-flamingo-300/80 bg-[color:color-mix(in_oklab,var(--p-surface)_82%,rgb(251_113_133)_12%)] dark:border-flamingo-800/80 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_80%,rgb(251_113_133)_15%)]",
        metaPillClass: "border border-flamingo-200/80 bg-flamingo-50/80 text-flamingo-700 dark:border-flamingo-900/70 dark:bg-flamingo-950/40 dark:text-flamingo-300",
        dotClass: "bg-flamingo-500",
        dotGlow: "rgb(251 113 133)",
        showUnreadDot: true,
        badgeIcon: "i-lucide-bell-dot",
        primaryActionLabel: "Review now",
        primaryActionIcon: "i-lucide-scan-search",
        primaryActionVariant: "solid",
        primaryActionColor: "primary"
      };
    }
    function formatDashboardDate(value) {
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
    function formatRelativeTime(value) {
      if (!value) return "";
      const date = new Date(value);
      const diffMs = Date.now() - date.getTime();
      if (!Number.isFinite(diffMs)) return "";
      const minutes = Math.round(diffMs / 6e4);
      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes} min ago`;
      const hours = Math.round(minutes / 60);
      if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
      const days = Math.round(hours / 24);
      if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
      return "";
    }
    function formatTimeTone(value, kind) {
      if (!value) return kind === "new" ? "New arrival" : "In queue";
      const date = new Date(value);
      const diffMs = Date.now() - date.getTime();
      if (!Number.isFinite(diffMs)) return kind === "new" ? "Needs review" : "In queue";
      const minutes = diffMs / 6e4;
      if (kind === "new") {
        if (minutes < 15) return "Just arrived";
        if (minutes < 180) return "New today";
        return "Awaiting first review";
      }
      if (kind === "modified") {
        if (minutes < 60) return "Recently changed";
        return "Revision waiting";
      }
      if (kind === "quoted") return "Waiting on customer";
      if (kind === "accepted") return "Approved";
      if (kind === "rejected") return "Closed outcome";
      return "Opened";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_QuotesCalculatorHub = __nuxt_component_1;
      const _component_QuotesBackendQuoteCalculator = __nuxt_component_2;
      const _component_QuotesBookletCalculator = __nuxt_component_3;
      const _component_QuotesLargeFormatCalculator = __nuxt_component_4;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardSkeletonState = __nuxt_component_4$1;
      const _component_UBadge = _sfc_main$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Quote Workspace",
        subtitle: "Use backend pricing preview at the top, then work the received request queue below."
      }, null, _parent));
      _push(`<section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
      ssrRenderList(unref(metrics), (metric) => {
        _push(`<article class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">${ssrInterpolate(metric.label)}</p><p class="mt-3 text-3xl font-semibold text-[var(--p-text)]">${ssrInterpolate(metric.value)}</p><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(metric.note)}</p></article>`);
      });
      _push(`<!--]--></section>`);
      if (unref(shopStore).selectedShopSlug) {
        _push(ssrRenderComponent(_component_QuotesCalculatorHub, null, {
          flat: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_QuotesBackendQuoteCalculator, {
                "fixed-shop-slug": unref(shopStore).selectedShopSlug,
                eyebrow: "Admin Page Calculator",
                title: "Admin Page Calculator",
                description: "Capture the enquirer, product or custom brief, quantity, size, stock, finishing, and turnaround in one premium workspace. Backend preview remains the pricing source of truth.",
                mode: "shop",
                "anchor-id": "dashboard-quote-workspace"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_QuotesBackendQuoteCalculator, {
                  "fixed-shop-slug": unref(shopStore).selectedShopSlug,
                  eyebrow: "Admin Page Calculator",
                  title: "Admin Page Calculator",
                  description: "Capture the enquirer, product or custom brief, quantity, size, stock, finishing, and turnaround in one premium workspace. Backend preview remains the pricing source of truth.",
                  mode: "shop",
                  "anchor-id": "dashboard-quote-workspace"
                }, null, 8, ["fixed-shop-slug"])
              ];
            }
          }),
          booklet: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_QuotesBookletCalculator, {
                "fixed-shop-slug": unref(shopStore).selectedShopSlug,
                "fixed-shop-name": unref(shopStore).currentShop?.name || unref(shopStore).selectedShopSlug,
                eyebrow: "Admin Page Booklet Calculator",
                title: "Admin Page Booklet Calculator",
                description: "Capture booklet jobs with cover, inserts, binding, and turnaround while keeping backend pricing as the source of truth.",
                "anchor-id": "dashboard-quote-workspace"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_QuotesBookletCalculator, {
                  "fixed-shop-slug": unref(shopStore).selectedShopSlug,
                  "fixed-shop-name": unref(shopStore).currentShop?.name || unref(shopStore).selectedShopSlug,
                  eyebrow: "Admin Page Booklet Calculator",
                  title: "Admin Page Booklet Calculator",
                  description: "Capture booklet jobs with cover, inserts, binding, and turnaround while keeping backend pricing as the source of truth.",
                  "anchor-id": "dashboard-quote-workspace"
                }, null, 8, ["fixed-shop-slug", "fixed-shop-name"])
              ];
            }
          }),
          large_format: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_QuotesLargeFormatCalculator, {
                "fixed-shop-slug": unref(shopStore).selectedShopSlug,
                "fixed-shop-name": unref(shopStore).currentShop?.name || unref(shopStore).selectedShopSlug,
                eyebrow: "Admin Page Large Format Calculator",
                title: "Admin Page Large Format Calculator",
                description: "Capture banners, posters, stickers, roll-up banners, and boards while keeping backend pricing as the source of truth.",
                "anchor-id": "dashboard-quote-workspace"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_QuotesLargeFormatCalculator, {
                  "fixed-shop-slug": unref(shopStore).selectedShopSlug,
                  "fixed-shop-name": unref(shopStore).currentShop?.name || unref(shopStore).selectedShopSlug,
                  eyebrow: "Admin Page Large Format Calculator",
                  title: "Admin Page Large Format Calculator",
                  description: "Capture banners, posters, stickers, roll-up banners, and boards while keeping backend pricing as the source of truth.",
                  "anchor-id": "dashboard-quote-workspace"
                }, null, 8, ["fixed-shop-slug", "fixed-shop-name"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Received Quotes</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Main request queue</h2><p class="mt-2 text-sm text-[var(--p-text-muted)]"> Tabs and counts come from the backend dashboard summary endpoint for the active shop. </p></div><div class="flex flex-wrap gap-2">`);
      if (unref(shopStore).selectedShopSlug) {
        _push(ssrRenderComponent(_component_UButton, {
          variant: "soft",
          to: `/dashboard/shops/${unref(shopStore).selectedShopSlug}/incoming-requests`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Open full inbox `);
            } else {
              return [
                createTextVNode(" Open full inbox ")
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
        loading: unref(quoteInboxStore).loading,
        onClick: refreshDashboard
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
          variant: unref(activeTab) === tab.value ? "solid" : "soft",
          color: unref(activeTab) === tab.value ? "primary" : "neutral",
          onClick: ($event) => activeTab.value = tab.value
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
      if (unref(quoteInboxStore).loading && !unref(quoteInboxStore).dashboard) {
        _push(`<div class="mt-6">`);
        _push(ssrRenderComponent(_component_DashboardSkeletonState, {
          variant: "cards",
          "card-count": 3,
          "show-header": false
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(filteredRequests).length) {
        _push(`<div class="mt-6 grid gap-4"><!--[-->`);
        ssrRenderList(unref(styledRequests), (request) => {
          _push(`<article class="${ssrRenderClass([request.cardClass, "overflow-hidden rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md"])}"><div class="flex"><div class="${ssrRenderClass([request.accentClass, "w-1.5 shrink-0"])}"></div><div class="flex min-w-0 flex-1 flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between"><div class="min-w-0 flex-1"><div class="flex flex-wrap items-start justify-between gap-4"><div class="min-w-0"><div class="flex flex-wrap items-center gap-3">`);
          if (request.showUnreadDot) {
            _push(`<span class="${ssrRenderClass([request.dotClass, "h-2.5 w-2.5 rounded-full shadow-[0_0_0_4px_color-mix(in_oklab,var(--dot-glow)_15%,transparent)]"])}" style="${ssrRenderStyle({ "--dot-glow": request.dotGlow })}"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<p class="truncate text-base font-semibold text-[var(--p-text)]">${ssrInterpolate(request.customer_name || "Enquirer")}</p>`);
          _push(ssrRenderComponent(_component_UBadge, {
            variant: "soft",
            color: request.badgeColor,
            class: "rounded-md px-2.5 py-1"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: request.badgeIcon,
                  class: "mr-1.5 h-3.5 w-3.5"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(request.badgeLabel)}`);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: request.badgeIcon,
                    class: "mr-1.5 h-3.5 w-3.5"
                  }, null, 8, ["name"]),
                  createTextVNode(" " + toDisplayString(request.badgeLabel), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          if (request.request_reference) {
            _push(`<span class="rounded-md border border-[color:color-mix(in_oklab,var(--p-border)_82%,transparent)] bg-[color:color-mix(in_oklab,var(--p-surface)_84%,transparent)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">${ssrInterpolate(request.request_reference)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (request.helperText) {
            _push(`<p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(request.helperText)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--p-text-muted)]"><span class="${ssrRenderClass([request.metaPillClass, "rounded-md px-2 py-1"])}">${ssrInterpolate(request.timeToneLabel)}</span>`);
          if (request.updatedRelative) {
            _push(`<span>${ssrInterpolate(request.updatedRelative)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (request.updatedRelative && request.updatedLabel) {
            _push(`<span aria-hidden="true">·</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span>${ssrInterpolate(request.updatedLabel)}</span></div></div><div class="flex shrink-0 flex-wrap gap-2">`);
          if (unref(shopStore).selectedShopSlug) {
            _push(ssrRenderComponent(_component_UButton, {
              variant: request.primaryActionVariant,
              color: request.primaryActionColor,
              class: "rounded-md",
              to: `/dashboard/shops/${unref(shopStore).selectedShopSlug}/incoming-requests/${request.id}`
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: request.primaryActionIcon,
                    class: "mr-2 h-4 w-4"
                  }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(request.primaryActionLabel)}`);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: request.primaryActionIcon,
                      class: "mr-2 h-4 w-4"
                    }, null, 8, ["name"]),
                    createTextVNode(" " + toDisplayString(request.primaryActionLabel), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)_minmax(0,0.8fr)_minmax(0,0.9fr)]"><div class="${ssrRenderClass([request.panelClass, "rounded-md border p-3"])}"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Contact</p><p class="mt-2 text-sm text-[var(--p-text)]">${ssrInterpolate(request.contactLabel)}</p>`);
          if (request.contactMeta) {
            _push(`<p class="mt-1 text-xs text-[var(--p-text-muted)]">${ssrInterpolate(request.contactMeta)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="${ssrRenderClass([request.panelClass, "rounded-md border p-3"])}"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Latest total</p><p class="mt-2 text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(request.totalLabel)}</p>`);
          if (request.totalMeta) {
            _push(`<p class="mt-1 text-xs text-[var(--p-text-muted)]">${ssrInterpolate(request.totalMeta)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="${ssrRenderClass([request.panelClass, "rounded-md border p-3"])}"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">${ssrInterpolate(request.sourceLabel)}</p><p class="mt-2 text-sm text-[var(--p-text)]">${ssrInterpolate(request.sourceValue)}</p>`);
          if (request.sourceMeta) {
            _push(`<p class="mt-1 text-xs text-[var(--p-text-muted)]">${ssrInterpolate(request.sourceMeta)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="${ssrRenderClass([request.summaryPanelClass, "rounded-md border p-3"])}"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Workspace summary</p><p class="mt-2 text-sm text-[var(--p-text)]">${ssrInterpolate(request.summaryLine)}</p>`);
          if (request.summaryMeta) {
            _push(`<p class="mt-1 text-xs text-[var(--p-text-muted)]">${ssrInterpolate(request.summaryMeta)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div></div></div></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"><p class="text-sm font-medium text-[var(--p-text)]">No requests in this tab yet</p><p class="mt-2 text-sm text-[var(--p-text-muted)]">Try another status filter or open the full inbox.</p></div>`);
      }
      _push(`</section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-cFu9MWkj.mjs.map
