import { defineComponent, withAsyncContext, ref, reactive, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { B as BaseAlert } from './BaseAlert-BEu0SLA6.mjs';
import { p as useHead, m as useAuthStore, r as useRouter, n as navigateTo, j as getApiErrorMessage, b as BaseCard, a as BaseButton } from './server.mjs';
import { D as DashboardCardGrid, B as BaseStatCard } from './DashboardCardGrid-99XTVGgo.mjs';
import { B as BaseTable } from './BaseTable-CqvfAMbq.mjs';
import { D as DashboardPageHeader } from './DashboardPageHeader-C891xTIs.mjs';
import { R as RoleDashboardFrame, D as DashboardSection } from './RoleDashboardFrame-z5_-ER2G.mjs';
import { u as useDashboardApi } from './dashboard-CEbEdesF.mjs';
import { u as useShopsApi } from './shops-BCgoELKm.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@vue/shared';
import './DashboardTopbar-CBNaUx0B.mjs';
import './design-HtHvYN8j.mjs';
import './PrintyLogo-bSA8QTQF.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "Printy - Production Dashboard"
    });
    const auth = useAuthStore();
    const router = useRouter();
    const { fetchDashboardHome } = useDashboardApi();
    const { fetchMyShops, fetchShopRateCardSetup, listShopPapers } = useShopsApi();
    if (!auth.canAccessProductionDashboard) {
      [__temp, __restore] = withAsyncContext(() => navigateTo(auth.homeRoute)), await __temp, __restore();
    }
    const loading = ref(true);
    const pageError = ref("");
    const payload = ref({});
    const setupStatus = reactive({
      hasShop: false,
      hasPapers: false,
      hasPricing: false,
      completed: false
    });
    const currentShopSlug = ref("");
    function hasActivePricingRows(setup) {
      const paperRows = Array.isArray(setup?.paper_rows) ? setup.paper_rows : [];
      const summary = setup?.summary;
      return paperRows.some((row) => Boolean(row?.active)) || Number(summary?.paper_rows_added ?? 0) > 0 || Number(summary?.pricing_items_added ?? 0) > 0 || Number(summary?.products_unlocked ?? 0) > 0;
    }
    try {
      const shops = ([__temp, __restore] = withAsyncContext(() => fetchMyShops()), __temp = await __temp, __restore(), __temp);
      const currentShop = shops.find((shop) => shop?.is_active !== false) || shops[0] || null;
      currentShopSlug.value = currentShop?.slug || "";
      if (currentShopSlug.value) {
        const [setup, papers] = ([__temp, __restore] = withAsyncContext(() => Promise.all([
          fetchShopRateCardSetup(currentShopSlug.value),
          listShopPapers(currentShopSlug.value)
        ])), __temp = await __temp, __restore(), __temp);
        setupStatus.hasShop = true;
        setupStatus.hasPapers = papers.some((item) => item.is_active !== false);
        setupStatus.hasPricing = hasActivePricingRows(setup);
        setupStatus.completed = Boolean(setup.completed);
      }
      if (!(!setupStatus.completed && (!setupStatus.hasShop || !setupStatus.hasPapers || !setupStatus.hasPricing))) {
        payload.value = ([__temp, __restore] = withAsyncContext(() => fetchDashboardHome("production")), __temp = await __temp, __restore(), __temp);
      }
    } catch (error) {
      pageError.value = getApiErrorMessage(error, "Production dashboard data is unavailable right now.");
    } finally {
      loading.value = false;
    }
    const displayName = computed(() => auth.user?.name || auth.user?.email || "Production");
    const firstName = computed(() => displayName.value.split(" ")[0] || "there");
    const initials = computed(() => displayName.value.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "PD");
    const stats = computed(() => payload.value.stats || {});
    const assignments = computed(() => Array.isArray(payload.value.assignments) ? payload.value.assignments : []);
    const queue = computed(() => Array.isArray(payload.value.queue) ? payload.value.queue : []);
    const showSetupPrompt = computed(() => !setupStatus.completed && (!setupStatus.hasShop || !setupStatus.hasPapers || !setupStatus.hasPricing));
    const setupPromptTitle = computed(() => {
      if (!setupStatus.hasShop) return "Your print shop is not set up yet.";
      if (!setupStatus.hasPapers) return "Add your first paper stock.";
      if (!setupStatus.hasPricing) return "Add your printing prices.";
      return "Your setup is still incomplete.";
    });
    const setupPromptCopy = computed(() => {
      if (!setupStatus.hasShop) return "Create your shop profile first so Printy can attach stock, pricing, and finishing rules to a real production account.";
      if (!setupStatus.hasPapers) return "Paper stock is still empty. Add at least one active stock row so Printy knows what your shop can physically produce.";
      if (!setupStatus.hasPricing) return "Production pricing is still missing. Add your raw shop prices so Printy can calculate downstream market/client totals.";
      return "Finish your setup to unlock capability preview and job readiness.";
    });
    const setupShortcutRoute = computed(() => {
      if (!setupStatus.hasShop) return "/dashboard/production/onboarding?step=shop";
      if (!setupStatus.hasPapers) return "/dashboard/production/onboarding?step=paper-stock";
      if (!setupStatus.hasPricing) return "/dashboard/production/onboarding?step=pricing";
      return "/dashboard/production/onboarding";
    });
    const navItems = computed(() => [
      { label: "Production Dashboard", to: "/dashboard/production", active: true },
      { label: "Onboarding", to: "/dashboard/production/onboarding" },
      { label: "Assignments", to: "/dashboard/production/jobs" },
      { label: "Paper", to: "/dashboard/production/paper-stock" },
      { label: "Pricing", to: "/dashboard/production/pricing" },
      { label: "Finishings", to: "/dashboard/production/finishings" },
      { label: "Messages", to: "/dashboard/production/messages" }
    ]);
    const statCards = computed(() => [
      {
        label: "Incoming Assignments",
        value: stats.value.incoming_assignments ?? 0,
        meta: "Need acceptance or review",
        accent: "orange",
        icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10m-12 9h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" /></svg>'
      },
      {
        label: "In Production",
        value: stats.value.in_production ?? 0,
        meta: "Active print floor work",
        accent: "green",
        icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6v-7z" /></svg>'
      },
      {
        label: "Payment Holds",
        value: stats.value.payment_holds ?? 0,
        meta: "Work blocked until payment clears",
        accent: "amber",
        icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 4h.01M10.29 3.86l-7.17 12.42A2 2 0 004.83 19h14.34a2 2 0 001.71-2.72L13.71 3.86a2 2 0 00-3.42 0z" /></svg>'
      }
    ]);
    const assignmentColumns = [
      { key: "reference", label: "Reference" },
      { key: "status", label: "Assignment" },
      { key: "managed_job_status", label: "Job Status" },
      { key: "payment_status", label: "Payment" },
      { key: "priority", label: "Priority" }
    ];
    const queueColumns = [
      { key: "reference", label: "Reference" },
      { key: "title", label: "Job" },
      { key: "status", label: "Status" },
      { key: "payment_status", label: "Payment" },
      { key: "assignment_status", label: "Assignment" }
    ];
    function openAssignment(row) {
      const managedJobId = row.managed_job_id || row.id;
      if (!managedJobId) {
        return;
      }
      router.push(`/dashboard/production/jobs/${managedJobId}`);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(RoleDashboardFrame, mergeProps({
        title: "Production Dashboard",
        badge: "Production",
        name: unref(displayName),
        initials: unref(initials),
        subtitle: "Assignments and print queue",
        "breadcrumb-root": "Dashboard",
        "nav-items": unref(navItems),
        "support-title": "Production rules",
        "support-copy": "This workspace is for assignment intake, queue visibility, and payment holds. Client totals and partner margin tools stay off this route.",
        "support-action": "Open Jobs",
        "support-to": "/dashboard/production/jobs",
        onLogout: ($event) => unref(auth).logout()
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(pageError)) {
              _push2(ssrRenderComponent(BaseAlert, {
                variant: "error",
                title: "Production dashboard could not load.",
                message: unref(pageError)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(showSetupPrompt)) {
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Welcome to Printy - let's set up your shop",
                subtitle: "It takes about 5 minutes. You'll be ready to receive jobs once done."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="p-6"${_scopeId2}>`);
                    _push3(ssrRenderComponent(BaseCard, {
                      variant: "soft",
                      padding: "xl",
                      radius: "xl",
                      class: "space-y-5"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div${_scopeId3}><p class="text-sm font-bold text-slate-950"${_scopeId3}>${ssrInterpolate(unref(setupPromptTitle))}</p><p class="mt-2 text-sm text-slate-600"${_scopeId3}>${ssrInterpolate(unref(setupPromptCopy))}</p></div><div class="grid gap-3 md:grid-cols-3"${_scopeId3}><div class="rounded-2xl border border-slate-200 bg-white px-4 py-4"${_scopeId3}><p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"${_scopeId3}>Shop</p><p class="mt-2 text-sm font-bold text-slate-900"${_scopeId3}>${ssrInterpolate(unref(setupStatus).hasShop ? "Created" : "Missing")}</p></div><div class="rounded-2xl border border-slate-200 bg-white px-4 py-4"${_scopeId3}><p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"${_scopeId3}>Papers</p><p class="mt-2 text-sm font-bold text-slate-900"${_scopeId3}>${ssrInterpolate(unref(setupStatus).hasPapers ? "Added" : "Missing")}</p></div><div class="rounded-2xl border border-slate-200 bg-white px-4 py-4"${_scopeId3}><p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"${_scopeId3}>Pricing</p><p class="mt-2 text-sm font-bold text-slate-900"${_scopeId3}>${ssrInterpolate(unref(setupStatus).hasPricing ? "Added" : "Missing")}</p></div></div><div class="flex flex-wrap gap-3"${_scopeId3}>`);
                          _push4(ssrRenderComponent(BaseButton, {
                            to: "/dashboard/production/onboarding",
                            size: "lg"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Set up my shop`);
                              } else {
                                return [
                                  createTextVNode("Set up my shop")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          if (unref(currentShopSlug)) {
                            _push4(ssrRenderComponent(BaseButton, {
                              to: unref(setupShortcutRoute),
                              variant: "secondary",
                              size: "lg"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`Continue from current gap`);
                                } else {
                                  return [
                                    createTextVNode("Continue from current gap")
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                        } else {
                          return [
                            createVNode("div", null, [
                              createVNode("p", { class: "text-sm font-bold text-slate-950" }, toDisplayString(unref(setupPromptTitle)), 1),
                              createVNode("p", { class: "mt-2 text-sm text-slate-600" }, toDisplayString(unref(setupPromptCopy)), 1)
                            ]),
                            createVNode("div", { class: "grid gap-3 md:grid-cols-3" }, [
                              createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white px-4 py-4" }, [
                                createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-400" }, "Shop"),
                                createVNode("p", { class: "mt-2 text-sm font-bold text-slate-900" }, toDisplayString(unref(setupStatus).hasShop ? "Created" : "Missing"), 1)
                              ]),
                              createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white px-4 py-4" }, [
                                createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-400" }, "Papers"),
                                createVNode("p", { class: "mt-2 text-sm font-bold text-slate-900" }, toDisplayString(unref(setupStatus).hasPapers ? "Added" : "Missing"), 1)
                              ]),
                              createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white px-4 py-4" }, [
                                createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-400" }, "Pricing"),
                                createVNode("p", { class: "mt-2 text-sm font-bold text-slate-900" }, toDisplayString(unref(setupStatus).hasPricing ? "Added" : "Missing"), 1)
                              ])
                            ]),
                            createVNode("div", { class: "flex flex-wrap gap-3" }, [
                              createVNode(BaseButton, {
                                to: "/dashboard/production/onboarding",
                                size: "lg"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Set up my shop")
                                ]),
                                _: 1
                              }),
                              unref(currentShopSlug) ? (openBlock(), createBlock(BaseButton, {
                                key: 0,
                                to: unref(setupShortcutRoute),
                                variant: "secondary",
                                size: "lg"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Continue from current gap")
                                ]),
                                _: 1
                              }, 8, ["to"])) : createCommentVNode("", true)
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "p-6" }, [
                        createVNode(BaseCard, {
                          variant: "soft",
                          padding: "xl",
                          radius: "xl",
                          class: "space-y-5"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", null, [
                              createVNode("p", { class: "text-sm font-bold text-slate-950" }, toDisplayString(unref(setupPromptTitle)), 1),
                              createVNode("p", { class: "mt-2 text-sm text-slate-600" }, toDisplayString(unref(setupPromptCopy)), 1)
                            ]),
                            createVNode("div", { class: "grid gap-3 md:grid-cols-3" }, [
                              createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white px-4 py-4" }, [
                                createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-400" }, "Shop"),
                                createVNode("p", { class: "mt-2 text-sm font-bold text-slate-900" }, toDisplayString(unref(setupStatus).hasShop ? "Created" : "Missing"), 1)
                              ]),
                              createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white px-4 py-4" }, [
                                createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-400" }, "Papers"),
                                createVNode("p", { class: "mt-2 text-sm font-bold text-slate-900" }, toDisplayString(unref(setupStatus).hasPapers ? "Added" : "Missing"), 1)
                              ]),
                              createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white px-4 py-4" }, [
                                createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-400" }, "Pricing"),
                                createVNode("p", { class: "mt-2 text-sm font-bold text-slate-900" }, toDisplayString(unref(setupStatus).hasPricing ? "Added" : "Missing"), 1)
                              ])
                            ]),
                            createVNode("div", { class: "flex flex-wrap gap-3" }, [
                              createVNode(BaseButton, {
                                to: "/dashboard/production/onboarding",
                                size: "lg"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Set up my shop")
                                ]),
                                _: 1
                              }),
                              unref(currentShopSlug) ? (openBlock(), createBlock(BaseButton, {
                                key: 0,
                                to: unref(setupShortcutRoute),
                                variant: "secondary",
                                size: "lg"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Continue from current gap")
                                ]),
                                _: 1
                              }, 8, ["to"])) : createCommentVNode("", true)
                            ])
                          ]),
                          _: 1
                        })
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(DashboardPageHeader, {
                eyebrow: "Production Workspace",
                title: `Production queue for ${unref(firstName)}`,
                subtitle: "Assignments, payment holds, and production state are isolated here. Partner pricing tools are removed from this route."
              }, {
                actions: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(BaseButton, {
                      to: "/dashboard/production/jobs",
                      variant: "primary",
                      size: "md"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Open Assignment Flow`);
                        } else {
                          return [
                            createTextVNode("Open Assignment Flow")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(BaseButton, {
                      to: "/dashboard/production/onboarding",
                      variant: "secondary",
                      size: "md"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Update Setup`);
                        } else {
                          return [
                            createTextVNode("Update Setup")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(BaseButton, {
                      to: "/dashboard/production/messages",
                      variant: "secondary",
                      size: "md"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Messages`);
                        } else {
                          return [
                            createTextVNode("Messages")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(BaseButton, {
                        to: "/dashboard/production/jobs",
                        variant: "primary",
                        size: "md"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Open Assignment Flow")
                        ]),
                        _: 1
                      }),
                      createVNode(BaseButton, {
                        to: "/dashboard/production/onboarding",
                        variant: "secondary",
                        size: "md"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Update Setup")
                        ]),
                        _: 1
                      }),
                      createVNode(BaseButton, {
                        to: "/dashboard/production/messages",
                        variant: "secondary",
                        size: "md"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Messages")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(DashboardCardGrid, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(unref(statCards), (card) => {
                      _push3(ssrRenderComponent(BaseStatCard, {
                        key: card.label,
                        label: card.label,
                        value: card.value,
                        meta: card.meta,
                        accent: card.accent,
                        icon: card.icon
                      }, null, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                  } else {
                    return [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(statCards), (card) => {
                        return openBlock(), createBlock(BaseStatCard, {
                          key: card.label,
                          label: card.label,
                          value: card.value,
                          meta: card.meta,
                          accent: card.accent,
                          icon: card.icon
                        }, null, 8, ["label", "value", "meta", "accent", "icon"]);
                      }), 128))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]"${_scopeId}>`);
              _push2(ssrRenderComponent(DashboardSection, {
                id: "assignments",
                title: "Incoming Assignments",
                subtitle: "Production-only queue actions."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(BaseTable, {
                      columns: assignmentColumns,
                      rows: unref(assignments),
                      loading: unref(loading),
                      "empty-text": "No production assignments yet.",
                      variant: "dashboard",
                      "row-action": openAssignment
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(BaseTable, {
                        columns: assignmentColumns,
                        rows: unref(assignments),
                        loading: unref(loading),
                        "empty-text": "No production assignments yet.",
                        variant: "dashboard",
                        "row-action": openAssignment
                      }, null, 8, ["rows", "loading"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Managed Queue",
                subtitle: "Operational status without partner pricing exposure."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(BaseTable, {
                      columns: queueColumns,
                      rows: unref(queue),
                      loading: unref(loading),
                      "empty-text": "No queued managed jobs yet.",
                      variant: "dashboard"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(BaseTable, {
                        columns: queueColumns,
                        rows: unref(queue),
                        loading: unref(loading),
                        "empty-text": "No queued managed jobs yet.",
                        variant: "dashboard"
                      }, null, 8, ["rows", "loading"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Payment Holds",
                subtitle: "Production sees readiness, not client checkout actions."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="p-6"${_scopeId2}>`);
                    _push3(ssrRenderComponent(BaseAlert, {
                      variant: "warning",
                      message: "Production can see whether payment is cleared before work starts, but MPESA initiation and client collection actions remain outside this route."
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "p-6" }, [
                        createVNode(BaseAlert, {
                          variant: "warning",
                          message: "Production can see whether payment is cleared before work starts, but MPESA initiation and client collection actions remain outside this route."
                        })
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            }
          } else {
            return [
              unref(pageError) ? (openBlock(), createBlock(BaseAlert, {
                key: 0,
                variant: "error",
                title: "Production dashboard could not load.",
                message: unref(pageError)
              }, null, 8, ["message"])) : createCommentVNode("", true),
              unref(showSetupPrompt) ? (openBlock(), createBlock(DashboardSection, {
                key: 1,
                title: "Welcome to Printy - let's set up your shop",
                subtitle: "It takes about 5 minutes. You'll be ready to receive jobs once done."
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "p-6" }, [
                    createVNode(BaseCard, {
                      variant: "soft",
                      padding: "xl",
                      radius: "xl",
                      class: "space-y-5"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", null, [
                          createVNode("p", { class: "text-sm font-bold text-slate-950" }, toDisplayString(unref(setupPromptTitle)), 1),
                          createVNode("p", { class: "mt-2 text-sm text-slate-600" }, toDisplayString(unref(setupPromptCopy)), 1)
                        ]),
                        createVNode("div", { class: "grid gap-3 md:grid-cols-3" }, [
                          createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white px-4 py-4" }, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-400" }, "Shop"),
                            createVNode("p", { class: "mt-2 text-sm font-bold text-slate-900" }, toDisplayString(unref(setupStatus).hasShop ? "Created" : "Missing"), 1)
                          ]),
                          createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white px-4 py-4" }, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-400" }, "Papers"),
                            createVNode("p", { class: "mt-2 text-sm font-bold text-slate-900" }, toDisplayString(unref(setupStatus).hasPapers ? "Added" : "Missing"), 1)
                          ]),
                          createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white px-4 py-4" }, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-400" }, "Pricing"),
                            createVNode("p", { class: "mt-2 text-sm font-bold text-slate-900" }, toDisplayString(unref(setupStatus).hasPricing ? "Added" : "Missing"), 1)
                          ])
                        ]),
                        createVNode("div", { class: "flex flex-wrap gap-3" }, [
                          createVNode(BaseButton, {
                            to: "/dashboard/production/onboarding",
                            size: "lg"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Set up my shop")
                            ]),
                            _: 1
                          }),
                          unref(currentShopSlug) ? (openBlock(), createBlock(BaseButton, {
                            key: 0,
                            to: unref(setupShortcutRoute),
                            variant: "secondary",
                            size: "lg"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Continue from current gap")
                            ]),
                            _: 1
                          }, 8, ["to"])) : createCommentVNode("", true)
                        ])
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 1
              })) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                createVNode(DashboardPageHeader, {
                  eyebrow: "Production Workspace",
                  title: `Production queue for ${unref(firstName)}`,
                  subtitle: "Assignments, payment holds, and production state are isolated here. Partner pricing tools are removed from this route."
                }, {
                  actions: withCtx(() => [
                    createVNode(BaseButton, {
                      to: "/dashboard/production/jobs",
                      variant: "primary",
                      size: "md"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Open Assignment Flow")
                      ]),
                      _: 1
                    }),
                    createVNode(BaseButton, {
                      to: "/dashboard/production/onboarding",
                      variant: "secondary",
                      size: "md"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Update Setup")
                      ]),
                      _: 1
                    }),
                    createVNode(BaseButton, {
                      to: "/dashboard/production/messages",
                      variant: "secondary",
                      size: "md"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Messages")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["title"]),
                createVNode(DashboardCardGrid, null, {
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(statCards), (card) => {
                      return openBlock(), createBlock(BaseStatCard, {
                        key: card.label,
                        label: card.label,
                        value: card.value,
                        meta: card.meta,
                        accent: card.accent,
                        icon: card.icon
                      }, null, 8, ["label", "value", "meta", "accent", "icon"]);
                    }), 128))
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "grid gap-6 xl:grid-cols-[1.05fr_0.95fr]" }, [
                  createVNode(DashboardSection, {
                    id: "assignments",
                    title: "Incoming Assignments",
                    subtitle: "Production-only queue actions."
                  }, {
                    default: withCtx(() => [
                      createVNode(BaseTable, {
                        columns: assignmentColumns,
                        rows: unref(assignments),
                        loading: unref(loading),
                        "empty-text": "No production assignments yet.",
                        variant: "dashboard",
                        "row-action": openAssignment
                      }, null, 8, ["rows", "loading"])
                    ]),
                    _: 1
                  }),
                  createVNode(DashboardSection, {
                    title: "Managed Queue",
                    subtitle: "Operational status without partner pricing exposure."
                  }, {
                    default: withCtx(() => [
                      createVNode(BaseTable, {
                        columns: queueColumns,
                        rows: unref(queue),
                        loading: unref(loading),
                        "empty-text": "No queued managed jobs yet.",
                        variant: "dashboard"
                      }, null, 8, ["rows", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode(DashboardSection, {
                  title: "Payment Holds",
                  subtitle: "Production sees readiness, not client checkout actions."
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "p-6" }, [
                      createVNode(BaseAlert, {
                        variant: "warning",
                        message: "Production can see whether payment is cleared before work starts, but MPESA initiation and client collection actions remain outside this route."
                      })
                    ])
                  ]),
                  _: 1
                })
              ], 64))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/production/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BBsKZc0Y.mjs.map
