import { defineComponent, withAsyncContext, ref, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { B as BaseAlert } from './BaseAlert-BEu0SLA6.mjs';
import { p as useHead, m as useAuthStore, n as navigateTo, j as getApiErrorMessage, a as BaseButton } from './server.mjs';
import { D as DashboardCardGrid, B as BaseStatCard } from './DashboardCardGrid-99XTVGgo.mjs';
import { B as BaseTable } from './BaseTable-CqvfAMbq.mjs';
import { D as DashboardPageHeader } from './DashboardPageHeader-C891xTIs.mjs';
import { R as RoleDashboardFrame, D as DashboardSection } from './RoleDashboardFrame-z5_-ER2G.mjs';
import { u as useDashboardApi } from './dashboard-CEbEdesF.mjs';
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
      title: "Printy - Partner Dashboard"
    });
    const auth = useAuthStore();
    const { fetchDashboardHome } = useDashboardApi();
    if (!auth.canAccessPartnerDashboard) {
      [__temp, __restore] = withAsyncContext(() => navigateTo(auth.homeRoute)), await __temp, __restore();
    }
    const loading = ref(true);
    const pageError = ref("");
    const payload = ref({});
    try {
      payload.value = ([__temp, __restore] = withAsyncContext(() => fetchDashboardHome("partner")), __temp = await __temp, __restore(), __temp);
    } catch (error) {
      pageError.value = getApiErrorMessage(error, "Partner dashboard data is unavailable right now.");
    } finally {
      loading.value = false;
    }
    const displayName = computed(() => auth.user?.name || auth.user?.email || "Partner");
    const firstName = computed(() => displayName.value.split(" ")[0] || "there");
    const initials = computed(() => displayName.value.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "PT");
    const stats = computed(() => payload.value.stats || {});
    const jobs = computed(() => Array.isArray(payload.value.recent_jobs) ? payload.value.recent_jobs : []);
    const quoteRequests = computed(() => Array.isArray(payload.value.quote_requests) ? payload.value.quote_requests : []);
    const navItems = computed(() => [
      { label: "Partner Dashboard", to: "/dashboard/partner", active: true },
      { label: "Quotes", to: "/dashboard/partner/quotes" },
      { label: "Rate Card", to: "/dashboard/partner/rate-card" },
      { label: "Messages", to: "/dashboard/partner/messages" }
    ]);
    const statCards = computed(() => [
      {
        label: "Active Clients",
        value: stats.value.active_clients ?? 0,
        meta: "Distinct client portfolio",
        accent: "orange",
        icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2m10 2v-2M12 12a5 5 0 100-10 5 5 0 000 10z" /></svg>'
      },
      {
        label: "Managed Jobs",
        value: stats.value.managed_jobs ?? 0,
        meta: "Partner-owned commercial jobs",
        accent: "blue",
        icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h10" /></svg>'
      },
      {
        label: "Awaiting Client Payment",
        value: stats.value.awaiting_client_payment ?? 0,
        meta: "Read-only payment follow-up",
        accent: "amber",
        icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-2.21 0-4 1.343-4 3s1.79 3 4 3 4 1.343 4 3-1.79 3-4 3m0-12V5m0 14v-2" /></svg>'
      }
    ]);
    const jobColumns = [
      { key: "reference", label: "Reference" },
      { key: "client_name", label: "Client" },
      { key: "client_total", label: "Client Total" },
      { key: "payment_status", label: "Payment" },
      { key: "assigned_shop_name", label: "Assigned Shop" }
    ];
    const quoteColumns = [
      { key: "reference", label: "Reference" },
      { key: "customer_name", label: "Client" },
      { key: "shop_name", label: "Shop" },
      { key: "status", label: "Status" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(RoleDashboardFrame, mergeProps({
        title: "Partner Dashboard",
        badge: "Partner",
        name: unref(displayName),
        initials: unref(initials),
        subtitle: "Client portfolio and quoting",
        "breadcrumb-root": "Dashboard",
        "nav-items": unref(navItems),
        "support-title": "Need printer pricing?",
        "support-copy": "This workspace exposes client-facing totals, quoting lanes, and managed client jobs. Production execution remains separate.",
        "support-action": "Open Rate Card",
        "support-to": "/dashboard/partner/rate-card",
        onLogout: ($event) => unref(auth).logout()
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(pageError)) {
              _push2(ssrRenderComponent(BaseAlert, {
                variant: "error",
                title: "Partner dashboard could not load.",
                message: unref(pageError)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(DashboardPageHeader, {
              eyebrow: "Partner Workspace",
              title: `Partner pipeline for ${unref(firstName)}`,
              subtitle: "This workspace can manage clients and see client-facing totals, but it cannot trigger production-only assignment actions."
            }, {
              actions: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(BaseButton, {
                    to: "/dashboard/partner/quotes",
                    variant: "primary",
                    size: "md"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Create Quote`);
                      } else {
                        return [
                          createTextVNode("Create Quote")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(BaseButton, {
                    to: "/dashboard/partner/rate-card",
                    variant: "secondary",
                    size: "md"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Margin Setup`);
                      } else {
                        return [
                          createTextVNode("Margin Setup")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(BaseButton, {
                      to: "/dashboard/partner/quotes",
                      variant: "primary",
                      size: "md"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Create Quote")
                      ]),
                      _: 1
                    }),
                    createVNode(BaseButton, {
                      to: "/dashboard/partner/rate-card",
                      variant: "secondary",
                      size: "md"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Margin Setup")
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
            _push2(`<div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"${_scopeId}>`);
            _push2(ssrRenderComponent(DashboardSection, {
              title: "Managed Client Jobs",
              subtitle: "Partner-visible jobs with client-facing totals."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(BaseTable, {
                    columns: jobColumns,
                    rows: unref(jobs),
                    loading: unref(loading),
                    "empty-text": "No managed partner jobs yet.",
                    variant: "dashboard"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(BaseTable, {
                      columns: jobColumns,
                      rows: unref(jobs),
                      loading: unref(loading),
                      "empty-text": "No managed partner jobs yet.",
                      variant: "dashboard"
                    }, null, 8, ["rows", "loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(DashboardSection, {
              title: "Quote Requests",
              subtitle: "Commercial intake owned by the partner workspace."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(BaseTable, {
                    columns: quoteColumns,
                    rows: unref(quoteRequests),
                    loading: unref(loading),
                    "empty-text": "No partner quote requests yet.",
                    variant: "dashboard"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(BaseTable, {
                      columns: quoteColumns,
                      rows: unref(quoteRequests),
                      loading: unref(loading),
                      "empty-text": "No partner quote requests yet.",
                      variant: "dashboard"
                    }, null, 8, ["rows", "loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(DashboardSection, {
              title: "Pricing Visibility",
              subtitle: "Partner sees client totals; production does not."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="p-6"${_scopeId2}>`);
                  _push3(ssrRenderComponent(BaseAlert, {
                    variant: "default",
                    message: "Client-facing totals and payment state are visible here for quoting and coordination. Raw production assignment actions are intentionally not exposed on this route."
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "p-6" }, [
                      createVNode(BaseAlert, {
                        variant: "default",
                        message: "Client-facing totals and payment state are visible here for quoting and coordination. Raw production assignment actions are intentionally not exposed on this route."
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              unref(pageError) ? (openBlock(), createBlock(BaseAlert, {
                key: 0,
                variant: "error",
                title: "Partner dashboard could not load.",
                message: unref(pageError)
              }, null, 8, ["message"])) : createCommentVNode("", true),
              createVNode(DashboardPageHeader, {
                eyebrow: "Partner Workspace",
                title: `Partner pipeline for ${unref(firstName)}`,
                subtitle: "This workspace can manage clients and see client-facing totals, but it cannot trigger production-only assignment actions."
              }, {
                actions: withCtx(() => [
                  createVNode(BaseButton, {
                    to: "/dashboard/partner/quotes",
                    variant: "primary",
                    size: "md"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Create Quote")
                    ]),
                    _: 1
                  }),
                  createVNode(BaseButton, {
                    to: "/dashboard/partner/rate-card",
                    variant: "secondary",
                    size: "md"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Margin Setup")
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
              createVNode("div", { class: "grid gap-6 xl:grid-cols-[1.1fr_0.9fr]" }, [
                createVNode(DashboardSection, {
                  title: "Managed Client Jobs",
                  subtitle: "Partner-visible jobs with client-facing totals."
                }, {
                  default: withCtx(() => [
                    createVNode(BaseTable, {
                      columns: jobColumns,
                      rows: unref(jobs),
                      loading: unref(loading),
                      "empty-text": "No managed partner jobs yet.",
                      variant: "dashboard"
                    }, null, 8, ["rows", "loading"])
                  ]),
                  _: 1
                }),
                createVNode(DashboardSection, {
                  title: "Quote Requests",
                  subtitle: "Commercial intake owned by the partner workspace."
                }, {
                  default: withCtx(() => [
                    createVNode(BaseTable, {
                      columns: quoteColumns,
                      rows: unref(quoteRequests),
                      loading: unref(loading),
                      "empty-text": "No partner quote requests yet.",
                      variant: "dashboard"
                    }, null, 8, ["rows", "loading"])
                  ]),
                  _: 1
                })
              ]),
              createVNode(DashboardSection, {
                title: "Pricing Visibility",
                subtitle: "Partner sees client totals; production does not."
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "p-6" }, [
                    createVNode(BaseAlert, {
                      variant: "default",
                      message: "Client-facing totals and payment state are visible here for quoting and coordination. Raw production assignment actions are intentionally not exposed on this route."
                    })
                  ])
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/partner/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D34WzOEf.mjs.map
