import { c as useAuthStore, a as _sfc_main$f, _ as __nuxt_component_3$1, d as _sfc_main$9 } from './server.mjs';
import { _ as __nuxt_component_2 } from './FormSection-yFTKkshO.mjs';
import { _ as _sfc_main$1 } from './Badge-DzyqaO77.mjs';
import { _ as __nuxt_component_6 } from './EmptyStateCard-sOlbx_Wq.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useSetupStatus } from './useSetupStatus-DKTSnPaL.mjs';
import { u as useSellerStore } from './seller-Bmym44up.mjs';
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
import './seller-B-6aM_bM.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const sellerStore = useSellerStore();
    useSetupStatus();
    const machines = ref([]);
    const papers = ref([]);
    const products = ref([]);
    const materials = ref([]);
    const finishingRates = ref([]);
    const activeShop = computed(() => sellerStore.shops[0] ?? null);
    const firstName = computed(() => authStore.user?.name?.trim()?.split(" ")[0] ?? "");
    const activeMachineCount = computed(() => machines.value.filter((machine) => machine.is_active !== false).length);
    const inStockPaperCount = computed(() => papers.value.filter((paper) => (paper.quantity_in_stock ?? 0) > 0).length);
    const lowStockPaperCount = computed(() => papers.value.filter((paper) => {
      if (paper.quantity_in_stock == null || paper.reorder_level == null) return false;
      return paper.quantity_in_stock <= paper.reorder_level;
    }).length);
    const publishedProductCount = computed(() => products.value.filter((product) => product.status === "published" || product.is_active).length);
    const activeFinishingCount = computed(() => finishingRates.value.filter((rate) => rate.is_active !== false).length);
    const activeMaterialCount = computed(() => materials.value.filter((material) => material.is_active !== false).length);
    const welcomeTitle = computed(() => {
      if (firstName.value && activeShop.value) return `Welcome back, ${firstName.value}. ${activeShop.value.name} is your production desk today.`;
      if (firstName.value) return `Welcome back, ${firstName.value}. Let's get your print operation production-ready.`;
      if (activeShop.value) return `${activeShop.value.name} is your production desk today.`;
      return "Build a print operation dashboard that feels ready for live work.";
    });
    const helperSubtitle = computed(() => {
      if (!sellerStore.shops.length) {
        return "Start by registering your print business, then connect machines, parent sheets, products, and pricing so every quote has real operational logic behind it.";
      }
      if (!activeMachineCount.value || !products.value.length) {
        return "This dashboard should answer a practical question immediately: can this shop quote and route real jobs today? Finish the missing setup blocks below to get there.";
      }
      return "Track the basics that matter most for a working print shop: equipment readiness, stock coverage, product availability, and the next setup gaps likely to slow down quoting.";
    });
    const readinessChecks = computed(() => [
      sellerStore.shops.length > 0,
      activeMachineCount.value > 0,
      papers.value.length > 0,
      products.value.length > 0,
      activeMaterialCount.value > 0,
      activeFinishingCount.value > 0
    ]);
    const readinessScore = computed(() => Math.round(readinessChecks.value.filter(Boolean).length / readinessChecks.value.length * 100));
    const readinessLabel = computed(() => {
      if (readinessScore.value >= 84) return "Strong production base";
      if (readinessScore.value >= 50) return "Usable, but setup gaps remain";
      return "Early setup stage";
    });
    const nextStepRoute = computed(() => {
      if (!sellerStore.shops.length) return "/dashboard/shops/create";
      if (!activeMachineCount.value) return activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/machines` : "/dashboard/machines";
      if (!papers.value.length) return "/dashboard/papers";
      if (!products.value.length) return activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/products/create` : "/dashboard/products";
      if (!activeMaterialCount.value) return activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/materials` : "/dashboard/materials";
      if (!activeFinishingCount.value) return "/dashboard/finishing";
      return "/dashboard/pricing";
    });
    const nextStepLabel = computed(() => {
      if (!sellerStore.shops.length) return "Register your first shop";
      if (!activeMachineCount.value) return "Add at least one machine";
      if (!papers.value.length) return "Define parent sheet stock";
      if (!products.value.length) return "Create your first product";
      if (!activeMaterialCount.value) return "Add billable materials";
      if (!activeFinishingCount.value) return "Configure finishing services";
      return "Tighten pricing coverage";
    });
    const nextStepDescription = computed(() => {
      if (!sellerStore.shops.length) return "Nothing else matters until the workspace exists.";
      if (!activeMachineCount.value) return "Machines unlock realistic sheet limits, costing, and routing.";
      if (!papers.value.length) return "Paper setup gives quoting a real parent sheet to work from.";
      if (!products.value.length) return "Products turn raw setup into sellable print jobs.";
      if (!activeMaterialCount.value) return "Materials help capture extras like lamination, vinyl, or adhesive costs.";
      if (!activeFinishingCount.value) return "Finishing rates make post-press costs operational instead of manual.";
      return "Your core setup exists. Refine pricing before you scale product coverage.";
    });
    const nextStepAction = computed(() => {
      if (!sellerStore.shops.length) return "Register shop";
      if (!activeMachineCount.value) return "Add machine";
      if (!papers.value.length) return "Add papers";
      if (!products.value.length) return "Create product";
      if (!activeMaterialCount.value) return "Add materials";
      if (!activeFinishingCount.value) return "Add finishing";
      return "Review pricing";
    });
    const operationalSignal = computed(() => {
      if (!sellerStore.shops.length) {
        return {
          title: "Workspace not opened yet",
          description: "Create the first shop so Printy can attach stock, machines, products, and pricing to a real business."
        };
      }
      if (readinessScore.value < 50) {
        return {
          title: "Setup is still blocking live quoting",
          description: "The basics are not fully connected yet, so pricing and routing will still require too many manual checks."
        };
      }
      if (lowStockPaperCount.value > 0) {
        return {
          title: `${lowStockPaperCount.value} paper line${lowStockPaperCount.value === 1 ? "" : "s"} need stock attention`,
          description: "Low stock does not stop setup, but it can break fulfillment confidence once orders start landing."
        };
      }
      return {
        title: "Core production logic looks usable",
        description: "The shop has enough structure to support believable quotes and product setup without feeling like a placeholder workspace."
      };
    });
    const heroActions = computed(() => {
      const machineRoute = activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/machines` : "/dashboard/machines";
      const productRoute = activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/products/create` : "/dashboard/products";
      return [
        { label: "Register shop", description: "Create or add another print location with its own setup.", to: "/dashboard/shops/create", icon: "i-lucide-store", emphasis: !sellerStore.shops.length },
        { label: "Add machine", description: "Capture real equipment before pricing more jobs.", to: machineRoute, icon: "i-lucide-printer", emphasis: !activeMachineCount.value },
        { label: "Create product", description: "Turn production rules into something your team can sell.", to: productRoute, icon: "i-lucide-package", emphasis: !products.value.length },
        { label: "Review pricing", description: "Check paper, finishing, and rate coverage for quoting.", to: "/dashboard/pricing", icon: "i-lucide-wallet", emphasis: false }
      ];
    });
    const kpiCards = computed(() => [
      {
        label: "Live Shops",
        value: sellerStore.shops.length,
        icon: "i-lucide-store",
        iconClass: "text-orange-200",
        description: sellerStore.shops.length ? `${sellerStore.shops.length} workspace${sellerStore.shops.length === 1 ? "" : "s"} connected to your seller account.` : "No shop workspace exists yet."
      },
      {
        label: "Active Machines",
        value: activeMachineCount.value,
        icon: "i-lucide-printer",
        iconClass: "text-sky-200",
        description: activeMachineCount.value ? "Equipment is available for routing and production planning." : "Add at least one machine to anchor real production limits."
      },
      {
        label: "Product Catalog",
        value: publishedProductCount.value,
        icon: "i-lucide-package",
        iconClass: "text-emerald-200",
        description: publishedProductCount.value ? "Products are available to structure quoting around real outputs." : "No usable products exist yet."
      },
      {
        label: "Stock Papers",
        value: inStockPaperCount.value,
        icon: "i-lucide-file-stack",
        iconClass: "text-amber-200",
        description: papers.value.length ? `${lowStockPaperCount.value} low-stock paper line${lowStockPaperCount.value === 1 ? "" : "s"} flagged.` : "No parent sheet stock has been added yet."
      }
    ]);
    const checklist = computed(() => {
      const machineRoute = activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/machines` : "/dashboard/machines";
      const productRoute = activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/products/create` : "/dashboard/products";
      const materialRoute = activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/materials` : "/dashboard/materials";
      return [
        {
          label: "Register a shop workspace",
          description: "A shop is the operational container for pricing, stock, products, and customer-facing setup.",
          done: sellerStore.shops.length > 0,
          to: "/dashboard/shops/create",
          action: "Create shop",
          icon: "i-lucide-store",
          completeNote: `${sellerStore.shops.length} shop workspace${sellerStore.shops.length === 1 ? "" : "s"} connected.`
        },
        {
          label: "Connect production machines",
          description: "Machines define what sheet sizes, runs, and production plans are realistic.",
          done: activeMachineCount.value > 0,
          to: machineRoute,
          action: "Add machine",
          icon: "i-lucide-printer",
          completeNote: `${activeMachineCount.value} active machine${activeMachineCount.value === 1 ? "" : "s"} configured.`
        },
        {
          label: "Define parent sheet stock",
          description: "Stock papers such as SRA3 or A3 help products estimate fit count and sheet usage more reliably.",
          done: papers.value.length > 0,
          to: "/dashboard/papers",
          action: "Add papers",
          icon: "i-lucide-file-stack",
          completeNote: `${papers.value.length} paper line${papers.value.length === 1 ? "" : "s"} available.`
        },
        {
          label: "Create sellable products",
          description: "Products tie sizes, sides, stock rules, and machine assumptions into repeatable job setups.",
          done: products.value.length > 0,
          to: productRoute,
          action: "Create product",
          icon: "i-lucide-package",
          completeNote: `${products.value.length} product${products.value.length === 1 ? "" : "s"} configured.`
        },
        {
          label: "Attach materials and finishing",
          description: "Materials and finishing rates move extras like lamination, eyelets, cutting, or binding out of guesswork.",
          done: activeMaterialCount.value > 0 || activeFinishingCount.value > 0,
          to: materialRoute,
          action: "Add materials",
          icon: "i-lucide-layers",
          completeNote: `${activeMaterialCount.value + activeFinishingCount.value} material/finishing line${activeMaterialCount.value + activeFinishingCount.value === 1 ? "" : "s"} configured.`
        }
      ];
    });
    const quickActions = computed(() => {
      const shopSlug = activeShop.value?.slug;
      return [
        { label: "Open shop setup", description: "Review business details, hours, and workspace settings for the active shop.", to: shopSlug ? `/dashboard/shops/${shopSlug}` : "/dashboard/shops", icon: "i-lucide-store" },
        { label: "Add another paper stock", description: "Useful when you need a new parent sheet, GSM range, or supplier line.", to: "/dashboard/papers", icon: "i-lucide-plus-circle" },
        { label: "Review machine coverage", description: "Check whether the current machine list matches the jobs you want to quote.", to: shopSlug ? `/dashboard/shops/${shopSlug}/machines` : "/dashboard/machines", icon: "i-lucide-settings-2" },
        { label: "Expand product range", description: "Add another repeatable product instead of calculating the next job from scratch.", to: shopSlug ? `/dashboard/shops/${shopSlug}/products/create` : "/dashboard/products", icon: "i-lucide-package" }
      ];
    });
    const recentItems = computed(() => {
      const latestShops = [...sellerStore.shops].slice(-1).reverse().map((shop) => ({
        type: "shop",
        id: shop.id,
        title: shop.name,
        caption: "Shop workspace",
        description: "Business workspace is available for machines, stock, pricing, and customer-facing setup.",
        icon: "i-lucide-store"
      }));
      const latestMachines = [...machines.value].slice(-2).reverse().map((machine) => ({
        type: "machine",
        id: machine.id,
        title: machine.name,
        caption: "Machine",
        description: `${machine.machine_type || "Production machine"} is now part of routing and capability planning.`,
        icon: "i-lucide-printer"
      }));
      const latestProducts = [...products.value].slice(-2).reverse().map((product) => ({
        type: "product",
        id: product.id,
        title: product.name,
        caption: "Product",
        description: product.default_sheet_size ? `Defaults to ${product.default_sheet_size} for parent-sheet planning and faster quote setup.` : "Ready for final paper, size, and finishing refinement.",
        icon: "i-lucide-package"
      }));
      const latestPapers = [...papers.value].slice(-1).reverse().map((paper) => ({
        type: "paper",
        id: paper.id,
        title: `${paper.sheet_size} ${paper.gsm}gsm`,
        caption: "Paper stock",
        description: paper.paper_type ? `${paper.paper_type} is available for costing and stock planning.` : "Paper stock is connected to the active shop.",
        icon: "i-lucide-file-stack"
      }));
      return [...latestShops, ...latestMachines, ...latestProducts, ...latestPapers].slice(0, 5);
    });
    const attentionCards = computed(() => {
      const cards = [];
      const shopSlug = activeShop.value?.slug;
      if (!sellerStore.shops.length) {
        cards.push({
          title: "No shop workspace exists",
          description: "Create the first shop before you spend time on pricing or products. It is the anchor for the rest of the dashboard.",
          action: "Create shop",
          to: "/dashboard/shops/create",
          icon: "i-lucide-store"
        });
      }
      if (sellerStore.shops.length && !activeMachineCount.value) {
        cards.push({
          title: "No production machine is active",
          description: "Without a machine, your products and pricing cannot reflect real capacity, maximum sheet size, or routing logic.",
          action: "Add machine",
          to: shopSlug ? `/dashboard/shops/${shopSlug}/machines` : "/dashboard/machines",
          icon: "i-lucide-printer"
        });
      }
      if (sellerStore.shops.length && !papers.value.length) {
        cards.push({
          title: "No parent sheets are recorded",
          description: "Quoting stays vague when the shop has no real stock paper sizes to estimate from.",
          action: "Add papers",
          to: "/dashboard/papers",
          icon: "i-lucide-file-stack"
        });
      }
      if (sellerStore.shops.length && !products.value.length) {
        cards.push({
          title: "Nothing sellable is configured",
          description: "Create one or two high-frequency products so the dashboard feels operational instead of empty.",
          action: "Create product",
          to: shopSlug ? `/dashboard/shops/${shopSlug}/products/create` : "/dashboard/products",
          icon: "i-lucide-package"
        });
      }
      if (lowStockPaperCount.value > 0) {
        cards.push({
          title: "Low stock paper needs a decision",
          description: `${lowStockPaperCount.value} paper line${lowStockPaperCount.value === 1 ? "" : "s"} are at or below reorder level. Review quantities before they quietly become quoting problems.`,
          action: "Review papers",
          to: "/dashboard/papers",
          icon: "i-lucide-triangle-alert"
        });
      }
      return cards.slice(0, 3);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_DashboardFormSection = __nuxt_component_2;
      const _component_UButton = _sfc_main$9;
      const _component_UBadge = _sfc_main$1;
      const _component_DashboardEmptyStateCard = __nuxt_component_6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6 pb-2" }, _attrs))}><section class="relative overflow-hidden rounded-[34px] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm sm:p-7 lg:p-8 dark:border-white/12 dark:bg-[linear-gradient(145deg,rgba(15,23,42,0.92),rgba(10,15,26,0.82))] dark:shadow-[0_22px_80px_rgba(0,0,0,0.35)] dark:backdrop-blur-2xl"><div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(240,82,36,0.12),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(65,115,182,0.1),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,24,40,0.06),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.18),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.5),transparent_30%)]"></div><div class="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between"><div class="max-w-4xl space-y-4"><div class="flex flex-wrap items-center gap-2"><span class="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-200"><span class="h-2 w-2 rounded-full bg-orange-300"></span> Print Operations Hub </span><span class="inline-flex items-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-3 py-1 text-xs text-[var(--p-text-muted)] dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">${ssrInterpolate(unref(activeShop) ? `Active shop: ${unref(activeShop).name}` : "No active shop yet")}</span></div><div class="space-y-3"><h1 class="max-w-3xl text-3xl font-semibold tracking-tight text-[var(--p-text)] sm:text-4xl dark:text-white">${ssrInterpolate(unref(welcomeTitle))}</h1><p class="max-w-3xl text-sm leading-7 text-[var(--p-text-muted)] sm:text-base dark:text-slate-300">${ssrInterpolate(unref(helperSubtitle))}</p></div><div class="grid gap-3 sm:grid-cols-3"><div class="rounded-[24px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 dark:border-white/10 dark:bg-white/[0.07] dark:backdrop-blur-xl"><p class="text-[11px] uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500">Readiness</p><div class="mt-3 flex items-end justify-between gap-3"><div><p class="text-3xl font-semibold text-[var(--p-text)] dark:text-white">${ssrInterpolate(unref(readinessScore))}%</p><p class="mt-1 text-sm text-[var(--p-text-muted)] dark:text-slate-300">${ssrInterpolate(unref(readinessLabel))}</p></div>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-gauge",
        class: "h-5 w-5 text-orange-300"
      }, null, _parent));
      _push(`</div></div><div class="rounded-[24px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 dark:border-white/10 dark:bg-white/[0.07] dark:backdrop-blur-xl"><p class="text-[11px] uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500">Next best step</p><p class="mt-3 text-base font-semibold text-[var(--p-text)] dark:text-white">${ssrInterpolate(unref(nextStepLabel))}</p><p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)] dark:text-slate-300">${ssrInterpolate(unref(nextStepDescription))}</p></div><div class="rounded-[24px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 dark:border-white/10 dark:bg-white/[0.07] dark:backdrop-blur-xl"><p class="text-[11px] uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500">Operational signal</p><p class="mt-3 text-base font-semibold text-[var(--p-text)] dark:text-white">${ssrInterpolate(unref(operationalSignal).title)}</p><p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)] dark:text-slate-300">${ssrInterpolate(unref(operationalSignal).description)}</p></div></div></div><div class="grid gap-3 sm:grid-cols-2 xl:w-[26rem]"><!--[-->`);
      ssrRenderList(unref(heroActions), (action) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: action.label,
          to: action.to,
          class: ["rounded-[26px] border p-4 transition duration-200", action.emphasis ? "border-orange-400/30 bg-orange-500/[0.12] hover:bg-orange-500/[0.16]" : "border-white/10 bg-white/[0.06] hover:border-white/15 hover:bg-white/[0.09]"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-start gap-3"${_scopeId}><div class="${ssrRenderClass([action.emphasis ? "border-orange-300/25 bg-orange-500/15 text-orange-100" : "border-white/10 bg-white/10 text-slate-100", "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border"])}"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: action.icon,
                class: "h-5 w-5"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="min-w-0"${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>${ssrInterpolate(action.label)}</p><p class="mt-1 text-sm leading-6 text-slate-300"${_scopeId}>${ssrInterpolate(action.description)}</p></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-start gap-3" }, [
                  createVNode("div", {
                    class: ["flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border", action.emphasis ? "border-orange-300/25 bg-orange-500/15 text-orange-100" : "border-white/10 bg-white/10 text-slate-100"]
                  }, [
                    createVNode(_component_UIcon, {
                      name: action.icon,
                      class: "h-5 w-5"
                    }, null, 8, ["name"])
                  ], 2),
                  createVNode("div", { class: "min-w-0" }, [
                    createVNode("p", { class: "text-sm font-semibold text-white" }, toDisplayString(action.label), 1),
                    createVNode("p", { class: "mt-1 text-sm leading-6 text-slate-300" }, toDisplayString(action.description), 1)
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></section><section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
      ssrRenderList(unref(kpiCards), (metric) => {
        _push(`<article class="rounded-[28px] border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[0_16px_50px_rgba(0,0,0,0.18)] dark:backdrop-blur-xl"><div class="flex items-start justify-between gap-3"><div class="space-y-1"><p class="text-[11px] uppercase tracking-[0.26em] text-[var(--p-text-muted)] dark:text-slate-500">${ssrInterpolate(metric.label)}</p><p class="text-3xl font-semibold text-[var(--p-text)] dark:text-white">${ssrInterpolate(metric.value)}</p></div><div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] dark:border-white/10 dark:bg-white/10">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: metric.icon,
          class: ["h-5 w-5", metric.iconClass]
        }, null, _parent));
        _push(`</div></div><p class="mt-4 text-sm leading-6 text-[var(--p-text-muted)] dark:text-slate-300">${ssrInterpolate(metric.description)}</p></article>`);
      });
      _push(`<!--]--></section><div class="grid gap-6 xl:grid-cols-[1.45fr_1fr]"><div class="space-y-6">`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Setup Checklist",
        description: "Finish the core setup once so quoting, stock decisions, and routing reflect what your print shop can actually produce."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: unref(nextStepRoute),
              color: "primary",
              variant: "soft",
              class: "justify-center"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-up-right",
                    class: "mr-2 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` Continue setup `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-up-right",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Continue setup ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: unref(nextStepRoute),
                color: "primary",
                variant: "soft",
                class: "justify-center"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-arrow-up-right",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Continue setup ")
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(checklist), (item) => {
              _push2(`<div class="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-4 backdrop-blur-xl"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><div class="${ssrRenderClass([item.done ? "border-emerald-400/25 bg-emerald-500/12 text-emerald-200" : "border-orange-400/20 bg-orange-500/10 text-orange-200", "mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border"])}"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: item.done ? "i-lucide-check" : item.icon,
                class: "h-5 w-5"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><div class="flex flex-wrap items-center justify-between gap-3"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>${ssrInterpolate(item.label)}</p><p class="mt-1 text-sm leading-6 text-slate-300"${_scopeId}>${ssrInterpolate(item.description)}</p></div>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: item.done ? "success" : "warning",
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(item.done ? "Complete" : "Pending")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item.done ? "Complete" : "Pending"), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div><div class="mt-3 flex flex-wrap items-center gap-3"${_scopeId}>`);
              if (!item.done) {
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  to: item.to,
                  class: "inline-flex items-center gap-2 text-sm font-medium text-orange-200 transition hover:text-orange-100"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(item.action)} `);
                      _push3(ssrRenderComponent(_component_UIcon, {
                        name: "i-lucide-arrow-right",
                        class: "h-4 w-4"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createTextVNode(toDisplayString(item.action) + " ", 1),
                        createVNode(_component_UIcon, {
                          name: "i-lucide-arrow-right",
                          class: "h-4 w-4"
                        })
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<span class="text-sm text-emerald-200/90"${_scopeId}>${ssrInterpolate(item.completeNote)}</span>`);
              }
              _push2(`</div></div></div></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(checklist), (item) => {
                  return openBlock(), createBlock("div", {
                    key: item.label,
                    class: "rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-4 backdrop-blur-xl"
                  }, [
                    createVNode("div", { class: "flex items-start gap-3" }, [
                      createVNode("div", {
                        class: ["mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border", item.done ? "border-emerald-400/25 bg-emerald-500/12 text-emerald-200" : "border-orange-400/20 bg-orange-500/10 text-orange-200"]
                      }, [
                        createVNode(_component_UIcon, {
                          name: item.done ? "i-lucide-check" : item.icon,
                          class: "h-5 w-5"
                        }, null, 8, ["name"])
                      ], 2),
                      createVNode("div", { class: "min-w-0 flex-1" }, [
                        createVNode("div", { class: "flex flex-wrap items-center justify-between gap-3" }, [
                          createVNode("div", null, [
                            createVNode("p", { class: "text-sm font-semibold text-white" }, toDisplayString(item.label), 1),
                            createVNode("p", { class: "mt-1 text-sm leading-6 text-slate-300" }, toDisplayString(item.description), 1)
                          ]),
                          createVNode(_component_UBadge, {
                            color: item.done ? "success" : "warning",
                            variant: "soft",
                            size: "sm"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(item.done ? "Complete" : "Pending"), 1)
                            ]),
                            _: 2
                          }, 1032, ["color"])
                        ]),
                        createVNode("div", { class: "mt-3 flex flex-wrap items-center gap-3" }, [
                          !item.done ? (openBlock(), createBlock(_component_NuxtLink, {
                            key: 0,
                            to: item.to,
                            class: "inline-flex items-center gap-2 text-sm font-medium text-orange-200 transition hover:text-orange-100"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(item.action) + " ", 1),
                              createVNode(_component_UIcon, {
                                name: "i-lucide-arrow-right",
                                class: "h-4 w-4"
                              })
                            ]),
                            _: 2
                          }, 1032, ["to"])) : (openBlock(), createBlock("span", {
                            key: 1,
                            class: "text-sm text-emerald-200/90"
                          }, toDisplayString(item.completeNote), 1))
                        ])
                      ])
                    ])
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Quick Actions",
        description: "Operational shortcuts for the next few minutes, not generic admin links."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-3 sm:grid-cols-2"${_scopeId}><!--[-->`);
            ssrRenderList(unref(quickActions), (action) => {
              _push2(ssrRenderComponent(_component_NuxtLink, {
                key: action.label,
                to: action.to,
                class: "rounded-[24px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 transition hover:border-orange-300 hover:bg-orange-50 dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-orange-300/30 dark:hover:bg-orange-500/10"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex items-start gap-3"${_scopeId2}><div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: action.icon,
                      class: "h-5 w-5 text-orange-500 dark:text-orange-200"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div class="min-w-0"${_scopeId2}><p class="text-sm font-semibold text-[var(--p-text)] dark:text-white"${_scopeId2}>${ssrInterpolate(action.label)}</p><p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)] dark:text-slate-300"${_scopeId2}>${ssrInterpolate(action.description)}</p></div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex items-start gap-3" }, [
                        createVNode("div", { class: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10" }, [
                          createVNode(_component_UIcon, {
                            name: action.icon,
                            class: "h-5 w-5 text-orange-500 dark:text-orange-200"
                          }, null, 8, ["name"])
                        ]),
                        createVNode("div", { class: "min-w-0" }, [
                          createVNode("p", { class: "text-sm font-semibold text-[var(--p-text)] dark:text-white" }, toDisplayString(action.label), 1),
                          createVNode("p", { class: "mt-1 text-sm leading-6 text-[var(--p-text-muted)] dark:text-slate-300" }, toDisplayString(action.description), 1)
                        ])
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-3 sm:grid-cols-2" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(quickActions), (action) => {
                  return openBlock(), createBlock(_component_NuxtLink, {
                    key: action.label,
                    to: action.to,
                    class: "rounded-[24px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 transition hover:border-orange-300 hover:bg-orange-50 dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-orange-300/30 dark:hover:bg-orange-500/10"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex items-start gap-3" }, [
                        createVNode("div", { class: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10" }, [
                          createVNode(_component_UIcon, {
                            name: action.icon,
                            class: "h-5 w-5 text-orange-500 dark:text-orange-200"
                          }, null, 8, ["name"])
                        ]),
                        createVNode("div", { class: "min-w-0" }, [
                          createVNode("p", { class: "text-sm font-semibold text-[var(--p-text)] dark:text-white" }, toDisplayString(action.label), 1),
                          createVNode("p", { class: "mt-1 text-sm leading-6 text-[var(--p-text-muted)] dark:text-slate-300" }, toDisplayString(action.description), 1)
                        ])
                      ])
                    ]),
                    _: 2
                  }, 1032, ["to"]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="space-y-6">`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Recent Activity",
        description: "Latest visible records in the active shop so you can confirm setup is moving in the right direction."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(recentItems).length) {
              _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(unref(recentItems), (item) => {
                _push2(`<article class="rounded-[24px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 dark:border-white/10 dark:bg-white/[0.06] dark:backdrop-blur-xl"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold text-[var(--p-text)] dark:text-white"${_scopeId}>${ssrInterpolate(item.title)}</p><p class="mt-1 text-[11px] uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500"${_scopeId}>${ssrInterpolate(item.caption)}</p></div><div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] dark:border-white/10 dark:bg-white/10"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: item.icon,
                  class: "h-4 w-4 text-orange-500 dark:text-orange-200"
                }, null, _parent2, _scopeId));
                _push2(`</div></div><p class="mt-3 text-sm leading-6 text-[var(--p-text-muted)] dark:text-slate-300"${_scopeId}>${ssrInterpolate(item.description)}</p></article>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(ssrRenderComponent(_component_DashboardEmptyStateCard, {
                title: "Nothing has moved through this workspace yet",
                description: "Start with a shop, then add one machine and one product. Once setup records exist, this panel becomes a fast sanity check before you quote live jobs.",
                icon: "i-lucide-activity"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UButton, {
                      to: unref(nextStepRoute),
                      color: "primary",
                      class: "justify-center"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(nextStepAction))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(nextStepAction)), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UButton, {
                        to: unref(nextStepRoute),
                        color: "primary",
                        class: "justify-center"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(nextStepAction)), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
          } else {
            return [
              unref(recentItems).length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-3"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(recentItems), (item) => {
                  return openBlock(), createBlock("article", {
                    key: `${item.type}-${item.id}`,
                    class: "rounded-[24px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 dark:border-white/10 dark:bg-white/[0.06] dark:backdrop-blur-xl"
                  }, [
                    createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm font-semibold text-[var(--p-text)] dark:text-white" }, toDisplayString(item.title), 1),
                        createVNode("p", { class: "mt-1 text-[11px] uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500" }, toDisplayString(item.caption), 1)
                      ]),
                      createVNode("div", { class: "flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] dark:border-white/10 dark:bg-white/10" }, [
                        createVNode(_component_UIcon, {
                          name: item.icon,
                          class: "h-4 w-4 text-orange-500 dark:text-orange-200"
                        }, null, 8, ["name"])
                      ])
                    ]),
                    createVNode("p", { class: "mt-3 text-sm leading-6 text-[var(--p-text-muted)] dark:text-slate-300" }, toDisplayString(item.description), 1)
                  ]);
                }), 128))
              ])) : (openBlock(), createBlock(_component_DashboardEmptyStateCard, {
                key: 1,
                title: "Nothing has moved through this workspace yet",
                description: "Start with a shop, then add one machine and one product. Once setup records exist, this panel becomes a fast sanity check before you quote live jobs.",
                icon: "i-lucide-activity"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UButton, {
                    to: unref(nextStepRoute),
                    color: "primary",
                    class: "justify-center"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(nextStepAction)), 1)
                    ]),
                    _: 1
                  }, 8, ["to"])
                ]),
                _: 1
              }))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Attention Needed",
        description: "A short list of the setup gaps most likely to block live quoting."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(attentionCards).length) {
              _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(unref(attentionCards), (card) => {
                _push2(`<div class="rounded-[24px] border border-orange-200 bg-orange-50 p-4 dark:border-orange-400/20 dark:bg-orange-500/[0.08] dark:backdrop-blur-xl"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/12"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: card.icon,
                  class: "h-4 w-4 text-orange-500 dark:text-orange-200"
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><p class="text-sm font-semibold text-[var(--p-text)] dark:text-white"${_scopeId}>${ssrInterpolate(card.title)}</p><p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)] dark:text-slate-300"${_scopeId}>${ssrInterpolate(card.description)}</p>`);
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  to: card.to,
                  class: "mt-3 inline-flex items-center gap-2 text-sm font-medium text-orange-700 hover:text-orange-800 dark:text-orange-200 dark:hover:text-orange-100"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(card.action)} `);
                      _push3(ssrRenderComponent(_component_UIcon, {
                        name: "i-lucide-arrow-right",
                        class: "h-4 w-4"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createTextVNode(toDisplayString(card.action) + " ", 1),
                        createVNode(_component_UIcon, {
                          name: "i-lucide-arrow-right",
                          class: "h-4 w-4"
                        })
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(ssrRenderComponent(_component_DashboardEmptyStateCard, {
                title: "Core setup is in place",
                description: "This workspace has the basics covered. The next useful move is refining price coverage, publishing more products, or tightening stock controls.",
                icon: "i-lucide-badge-check"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UButton, {
                      to: "/dashboard/pricing",
                      color: "primary",
                      variant: "soft",
                      class: "justify-center"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Review pricing`);
                        } else {
                          return [
                            createTextVNode("Review pricing")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UButton, {
                        to: "/dashboard/pricing",
                        color: "primary",
                        variant: "soft",
                        class: "justify-center"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Review pricing")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
          } else {
            return [
              unref(attentionCards).length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-3"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(attentionCards), (card) => {
                  return openBlock(), createBlock("div", {
                    key: card.title,
                    class: "rounded-[24px] border border-orange-200 bg-orange-50 p-4 dark:border-orange-400/20 dark:bg-orange-500/[0.08] dark:backdrop-blur-xl"
                  }, [
                    createVNode("div", { class: "flex items-start gap-3" }, [
                      createVNode("div", { class: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/12" }, [
                        createVNode(_component_UIcon, {
                          name: card.icon,
                          class: "h-4 w-4 text-orange-500 dark:text-orange-200"
                        }, null, 8, ["name"])
                      ]),
                      createVNode("div", { class: "min-w-0 flex-1" }, [
                        createVNode("p", { class: "text-sm font-semibold text-[var(--p-text)] dark:text-white" }, toDisplayString(card.title), 1),
                        createVNode("p", { class: "mt-1 text-sm leading-6 text-[var(--p-text-muted)] dark:text-slate-300" }, toDisplayString(card.description), 1),
                        createVNode(_component_NuxtLink, {
                          to: card.to,
                          class: "mt-3 inline-flex items-center gap-2 text-sm font-medium text-orange-700 hover:text-orange-800 dark:text-orange-200 dark:hover:text-orange-100"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(card.action) + " ", 1),
                            createVNode(_component_UIcon, {
                              name: "i-lucide-arrow-right",
                              class: "h-4 w-4"
                            })
                          ]),
                          _: 2
                        }, 1032, ["to"])
                      ])
                    ])
                  ]);
                }), 128))
              ])) : (openBlock(), createBlock(_component_DashboardEmptyStateCard, {
                key: 1,
                title: "Core setup is in place",
                description: "This workspace has the basics covered. The next useful move is refining price coverage, publishing more products, or tightening stock controls.",
                icon: "i-lucide-badge-check"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UButton, {
                    to: "/dashboard/pricing",
                    color: "primary",
                    variant: "soft",
                    class: "justify-center"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Review pricing")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
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
//# sourceMappingURL=index-B0qeZnyL.mjs.map
