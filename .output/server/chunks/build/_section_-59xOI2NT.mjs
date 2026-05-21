import { defineComponent, withAsyncContext, computed, ref, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { B as BaseAlert } from './BaseAlert-BEu0SLA6.mjs';
import { m as useAuthStore, n as navigateTo, q as useRoute, a as BaseButton, k as normalizeApiList, j as getApiErrorMessage } from './server.mjs';
import { D as DashboardEmptyState } from './DashboardEmptyState-h4BGOSgm.mjs';
import { R as RoleDashboardFrame, D as DashboardSection } from './RoleDashboardFrame-z5_-ER2G.mjs';
import { u as useDashboardApi } from './dashboard-CEbEdesF.mjs';
import { b as fetchClientQuoteRequests } from './quotes-EN5Tna8-.mjs';
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
import './design-HtHvYN8j.mjs';
import './DashboardTopbar-CBNaUx0B.mjs';
import './PrintyLogo-bSA8QTQF.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[section]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const auth = useAuthStore();
    const { fetchDashboardSection } = useDashboardApi();
    if (!auth.canAccessClientDashboard) {
      [__temp, __restore] = withAsyncContext(() => navigateTo(auth.homeRoute)), await __temp, __restore();
    }
    const route = useRoute();
    const section = computed(() => String(route.params.section || "quotes"));
    const quoteTab = ref("waiting");
    const displayName = computed(() => auth.user?.name || auth.user?.email || "Client");
    const initials = computed(() => displayName.value.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "CL");
    const loading = ref(true);
    const pageError = ref("");
    const quotes = ref([]);
    const jobs = ref([]);
    const payments = ref([]);
    const sectionTitleMap = {
      quotes: "Client Quotes",
      jobs: "Client Jobs",
      payments: "Client Payments",
      reorders: "Client Reorders"
    };
    const sectionTitle = computed(() => sectionTitleMap[section.value] || "Client Section");
    async function loadSection() {
      loading.value = true;
      pageError.value = "";
      try {
        if (section.value === "quotes") {
          quotes.value = normalizeApiList(await fetchClientQuoteRequests());
          jobs.value = [];
          payments.value = [];
        } else if (section.value === "jobs") {
          const payload = await fetchDashboardSection("client", "jobs");
          jobs.value = normalizeApiList(payload?.results || []);
          quotes.value = [];
          payments.value = [];
        } else if (section.value === "payments") {
          const payload = await fetchDashboardSection("client", "payments");
          payments.value = normalizeApiList(payload?.results || []);
          quotes.value = [];
          jobs.value = [];
        } else {
          quotes.value = [];
          jobs.value = [];
          payments.value = [];
        }
      } catch (error) {
        pageError.value = getApiErrorMessage(error, "Client dashboard section is unavailable right now.");
      } finally {
        loading.value = false;
      }
    }
    [__temp, __restore] = withAsyncContext(() => loadSection()), await __temp, __restore();
    watch(section, async () => {
      quoteTab.value = "waiting";
      await loadSection();
    });
    const waitingQuotes = computed(() => quotes.value.filter((quote) => !hasResponse(quote)));
    const respondedQuotes = computed(() => quotes.value.filter((quote) => hasResponse(quote)));
    const filteredQuotes = computed(() => quoteTab.value === "responded" ? respondedQuotes.value : waitingQuotes.value);
    const navItems = computed(() => [
      { label: "Overview", to: "/dashboard/client" },
      { label: "Quotes", to: "/dashboard/client/quotes", active: section.value === "quotes" },
      { label: "Jobs", to: "/dashboard/client/jobs", active: section.value === "jobs" },
      { label: "Payments", to: "/dashboard/client/payments", active: section.value === "payments" },
      { label: "Reorders", to: "/dashboard/client/reorders", active: section.value === "reorders" }
    ]);
    function hasResponse(quote) {
      return Boolean(quote.latest_response?.id || quote.latest_response?.total || String(quote.status || "").toLowerCase().includes("respond"));
    }
    function quoteStatusLabel(quote) {
      return quote.latest_response?.status_label || startCase(quote.status || "pending");
    }
    function quotePriceLabel(quote) {
      return formatKes(quote.latest_response?.total);
    }
    function quoteTurnaroundLabel(quote) {
      return quote.latest_response?.turnaround_label || `Requested ${formatDate(quote.created_at)}`;
    }
    function quoteCardTitle(quote) {
      const snapshot = normalizeRequestSnapshot(quote.request_snapshot);
      const product = snapshot.product_label || snapshot.product_type || snapshot.product_type_label || "Print quote";
      const quantity = snapshot.quantity ? `${Number(snapshot.quantity).toLocaleString("en-KE")} pcs` : "";
      return [startCase(product), quantity].filter(Boolean).join(" - ");
    }
    function quoteCardMeta(quote) {
      const snapshot = normalizeRequestSnapshot(quote.request_snapshot);
      const parts = [
        snapshot.finished_size || snapshot.size_label || snapshot.size,
        snapshot.paper_label || snapshot.paper_stock,
        `Requested ${formatDate(quote.created_at)}`
      ].filter(Boolean);
      return parts.join(" • ");
    }
    function isPaymentReady(job) {
      return ["pending", "initiated", "unpaid"].includes(String(job.payment_status || "").toLowerCase());
    }
    function formatDate(value) {
      if (!value) {
        return "recently";
      }
      const date = new Date(String(value));
      if (Number.isNaN(date.getTime())) {
        return "recently";
      }
      return new Intl.DateTimeFormat("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }).format(date);
    }
    function formatKes(value) {
      const amount = Number(value);
      if (!Number.isFinite(amount) || amount <= 0) {
        return "Final price pending";
      }
      return `KES ${amount.toLocaleString("en-KE", { maximumFractionDigits: 2 })}`;
    }
    function startCase(value) {
      return String(value || "pending").replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    }
    function normalizeRequestSnapshot(snapshot) {
      if (!snapshot || typeof snapshot !== "object") {
        return {};
      }
      const value = snapshot;
      return value.request_snapshot && typeof value.request_snapshot === "object" ? value.request_snapshot : value;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(RoleDashboardFrame, mergeProps({
        title: "Client Workspace",
        badge: "Client",
        name: unref(displayName),
        initials: unref(initials),
        subtitle: "Quotes, jobs, payments, and reorder handoff",
        "breadcrumb-root": "Dashboard",
        "nav-items": unref(navItems),
        "support-title": "Client workspace",
        "support-copy": "Only client-safe quote, job, and payment data appears here.",
        "support-action": "Overview",
        "support-to": "/dashboard/client",
        onLogout: ($event) => unref(auth).logout()
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(pageError)) {
              _push2(ssrRenderComponent(BaseAlert, {
                variant: "error",
                title: "Client workspace could not load.",
                message: unref(pageError)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(section) === "quotes") {
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Client Quotes",
                subtitle: "Track waiting quotes, view responses, and continue to payment."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="mb-5 flex flex-wrap items-center justify-between gap-3"${_scopeId2}><div class="inline-flex rounded-2xl border border-[#e4e7ec] bg-white p-1"${_scopeId2}><button type="button" class="${ssrRenderClass([unref(quoteTab) === "waiting" ? "bg-[#101828] text-white" : "text-[#667085] hover:text-[#101828]", "rounded-xl px-4 py-2 text-sm font-semibold transition-colors"])}"${_scopeId2}> Waiting (${ssrInterpolate(unref(waitingQuotes).length)}) </button><button type="button" class="${ssrRenderClass([unref(quoteTab) === "responded" ? "bg-[#101828] text-white" : "text-[#667085] hover:text-[#101828]", "rounded-xl px-4 py-2 text-sm font-semibold transition-colors"])}"${_scopeId2}> Responded (${ssrInterpolate(unref(respondedQuotes).length)}) </button></div>`);
                    _push3(ssrRenderComponent(BaseButton, {
                      to: "/dashboard/client?pendingQuote=1",
                      variant: "primary",
                      size: "sm"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Open Calculator`);
                        } else {
                          return [
                            createTextVNode("Open Calculator")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                    if (unref(loading)) {
                      _push3(`<div class="grid gap-4"${_scopeId2}><!--[-->`);
                      ssrRenderList(3, (index) => {
                        _push3(`<div class="h-32 animate-pulse rounded-2xl border border-[#e4e7ec] bg-[#f9fafb]"${_scopeId2}></div>`);
                      });
                      _push3(`<!--]--></div>`);
                    } else if (!unref(filteredQuotes).length) {
                      _push3(ssrRenderComponent(DashboardEmptyState, {
                        title: "No quote requests yet",
                        description: "Your quotes will appear here after you request pricing.",
                        "action-label": "Use the calculator",
                        "action-to": "/dashboard/client?pendingQuote=1"
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<div class="grid gap-4"${_scopeId2}><!--[-->`);
                      ssrRenderList(unref(filteredQuotes), (quote) => {
                        _push3(`<article class="rounded-2xl border border-[#e4e7ec] bg-white p-5"${_scopeId2}><div class="flex flex-wrap items-start justify-between gap-4"${_scopeId2}><div${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]"${_scopeId2}>${ssrInterpolate(quote.request_reference || quote.reference || `Quote ${quote.id}`)}</p><h3 class="mt-2 text-lg font-semibold text-[#101828]"${_scopeId2}>${ssrInterpolate(quoteCardTitle(quote))}</h3><p class="mt-1 text-sm text-[#667085]"${_scopeId2}>${ssrInterpolate(quoteCardMeta(quote))}</p></div><div class="text-right"${_scopeId2}><span class="inline-flex rounded-full border border-[#fda497] bg-[#fff8f7] px-3 py-1 text-xs font-semibold text-[#c92f13]"${_scopeId2}>${ssrInterpolate(quoteStatusLabel(quote))}</span><p class="mt-3 text-sm font-semibold text-[#101828]"${_scopeId2}>${ssrInterpolate(quotePriceLabel(quote))}</p><p class="mt-1 text-xs text-[#667085]"${_scopeId2}>${ssrInterpolate(quoteTurnaroundLabel(quote))}</p></div></div><div class="mt-4 flex flex-wrap gap-3"${_scopeId2}>`);
                        _push3(ssrRenderComponent(BaseButton, {
                          to: `/dashboard/client/quotes/${quote.id}`,
                          variant: "primary",
                          size: "sm"
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${ssrInterpolate(hasResponse(quote) ? "View quote" : "Continue quote")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(hasResponse(quote) ? "View quote" : "Continue quote"), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div></article>`);
                      });
                      _push3(`<!--]--></div>`);
                    }
                  } else {
                    return [
                      createVNode("div", { class: "mb-5 flex flex-wrap items-center justify-between gap-3" }, [
                        createVNode("div", { class: "inline-flex rounded-2xl border border-[#e4e7ec] bg-white p-1" }, [
                          createVNode("button", {
                            type: "button",
                            class: ["rounded-xl px-4 py-2 text-sm font-semibold transition-colors", unref(quoteTab) === "waiting" ? "bg-[#101828] text-white" : "text-[#667085] hover:text-[#101828]"],
                            onClick: ($event) => quoteTab.value = "waiting"
                          }, " Waiting (" + toDisplayString(unref(waitingQuotes).length) + ") ", 11, ["onClick"]),
                          createVNode("button", {
                            type: "button",
                            class: ["rounded-xl px-4 py-2 text-sm font-semibold transition-colors", unref(quoteTab) === "responded" ? "bg-[#101828] text-white" : "text-[#667085] hover:text-[#101828]"],
                            onClick: ($event) => quoteTab.value = "responded"
                          }, " Responded (" + toDisplayString(unref(respondedQuotes).length) + ") ", 11, ["onClick"])
                        ]),
                        createVNode(BaseButton, {
                          to: "/dashboard/client?pendingQuote=1",
                          variant: "primary",
                          size: "sm"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Open Calculator")
                          ]),
                          _: 1
                        })
                      ]),
                      unref(loading) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "grid gap-4"
                      }, [
                        (openBlock(), createBlock(Fragment, null, renderList(3, (index) => {
                          return createVNode("div", {
                            key: index,
                            class: "h-32 animate-pulse rounded-2xl border border-[#e4e7ec] bg-[#f9fafb]"
                          });
                        }), 64))
                      ])) : !unref(filteredQuotes).length ? (openBlock(), createBlock(DashboardEmptyState, {
                        key: 1,
                        title: "No quote requests yet",
                        description: "Your quotes will appear here after you request pricing.",
                        "action-label": "Use the calculator",
                        "action-to": "/dashboard/client?pendingQuote=1"
                      })) : (openBlock(), createBlock("div", {
                        key: 2,
                        class: "grid gap-4"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredQuotes), (quote) => {
                          return openBlock(), createBlock("article", {
                            key: quote.id,
                            class: "rounded-2xl border border-[#e4e7ec] bg-white p-5"
                          }, [
                            createVNode("div", { class: "flex flex-wrap items-start justify-between gap-4" }, [
                              createVNode("div", null, [
                                createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]" }, toDisplayString(quote.request_reference || quote.reference || `Quote ${quote.id}`), 1),
                                createVNode("h3", { class: "mt-2 text-lg font-semibold text-[#101828]" }, toDisplayString(quoteCardTitle(quote)), 1),
                                createVNode("p", { class: "mt-1 text-sm text-[#667085]" }, toDisplayString(quoteCardMeta(quote)), 1)
                              ]),
                              createVNode("div", { class: "text-right" }, [
                                createVNode("span", { class: "inline-flex rounded-full border border-[#fda497] bg-[#fff8f7] px-3 py-1 text-xs font-semibold text-[#c92f13]" }, toDisplayString(quoteStatusLabel(quote)), 1),
                                createVNode("p", { class: "mt-3 text-sm font-semibold text-[#101828]" }, toDisplayString(quotePriceLabel(quote)), 1),
                                createVNode("p", { class: "mt-1 text-xs text-[#667085]" }, toDisplayString(quoteTurnaroundLabel(quote)), 1)
                              ])
                            ]),
                            createVNode("div", { class: "mt-4 flex flex-wrap gap-3" }, [
                              createVNode(BaseButton, {
                                to: `/dashboard/client/quotes/${quote.id}`,
                                variant: "primary",
                                size: "sm"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(hasResponse(quote) ? "View quote" : "Continue quote"), 1)
                                ]),
                                _: 2
                              }, 1032, ["to"])
                            ])
                          ]);
                        }), 128))
                      ]))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else if (unref(section) === "jobs") {
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Client Jobs",
                subtitle: "Follow progress, pay when due, and reopen specs for a fresh quote."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (unref(loading)) {
                      _push3(`<div class="grid gap-4"${_scopeId2}><!--[-->`);
                      ssrRenderList(3, (index) => {
                        _push3(`<div class="h-32 animate-pulse rounded-2xl border border-[#e4e7ec] bg-[#f9fafb]"${_scopeId2}></div>`);
                      });
                      _push3(`<!--]--></div>`);
                    } else if (!unref(jobs).length) {
                      _push3(ssrRenderComponent(DashboardEmptyState, {
                        title: "No jobs yet",
                        description: "Accepted quotes and paid jobs will appear here.",
                        "action-label": "View quotes",
                        "action-to": "/dashboard/client/quotes"
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<div class="grid gap-4"${_scopeId2}><!--[-->`);
                      ssrRenderList(unref(jobs), (job) => {
                        _push3(`<article class="rounded-2xl border border-[#e4e7ec] bg-white p-5"${_scopeId2}><div class="flex flex-wrap items-start justify-between gap-4"${_scopeId2}><div${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]"${_scopeId2}>${ssrInterpolate(job.reference || `Job ${job.id}`)}</p><h3 class="mt-2 text-lg font-semibold text-[#101828]"${_scopeId2}>${ssrInterpolate(job.title || "Managed print job")}</h3><p class="mt-1 text-sm text-[#667085]"${_scopeId2}>Updated ${ssrInterpolate(formatDate(job.updated_at))}</p></div><div class="text-right"${_scopeId2}><p class="text-sm font-semibold text-[#101828]"${_scopeId2}>${ssrInterpolate(formatKes(job.pricing?.client_total))}</p><p class="mt-1 text-xs text-[#667085]"${_scopeId2}>Payment: ${ssrInterpolate(startCase(job.payment_status || "pending"))}</p><p class="mt-1 text-xs text-[#667085]"${_scopeId2}>Status: ${ssrInterpolate(startCase(job.status || "pending"))}</p></div></div><div class="mt-4 flex flex-wrap gap-3"${_scopeId2}>`);
                        _push3(ssrRenderComponent(BaseButton, {
                          to: `/dashboard/client/jobs/${job.id}`,
                          variant: "primary",
                          size: "sm"
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`View job`);
                            } else {
                              return [
                                createTextVNode("View job")
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(ssrRenderComponent(BaseButton, {
                          to: `/dashboard/client/jobs/${job.id}`,
                          variant: "secondary",
                          size: "sm"
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${ssrInterpolate(isPaymentReady(job) ? "Pay now" : "Track status")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(isPaymentReady(job) ? "Pay now" : "Track status"), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div></article>`);
                      });
                      _push3(`<!--]--></div>`);
                    }
                  } else {
                    return [
                      unref(loading) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "grid gap-4"
                      }, [
                        (openBlock(), createBlock(Fragment, null, renderList(3, (index) => {
                          return createVNode("div", {
                            key: index,
                            class: "h-32 animate-pulse rounded-2xl border border-[#e4e7ec] bg-[#f9fafb]"
                          });
                        }), 64))
                      ])) : !unref(jobs).length ? (openBlock(), createBlock(DashboardEmptyState, {
                        key: 1,
                        title: "No jobs yet",
                        description: "Accepted quotes and paid jobs will appear here.",
                        "action-label": "View quotes",
                        "action-to": "/dashboard/client/quotes"
                      })) : (openBlock(), createBlock("div", {
                        key: 2,
                        class: "grid gap-4"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(jobs), (job) => {
                          return openBlock(), createBlock("article", {
                            key: job.id,
                            class: "rounded-2xl border border-[#e4e7ec] bg-white p-5"
                          }, [
                            createVNode("div", { class: "flex flex-wrap items-start justify-between gap-4" }, [
                              createVNode("div", null, [
                                createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]" }, toDisplayString(job.reference || `Job ${job.id}`), 1),
                                createVNode("h3", { class: "mt-2 text-lg font-semibold text-[#101828]" }, toDisplayString(job.title || "Managed print job"), 1),
                                createVNode("p", { class: "mt-1 text-sm text-[#667085]" }, "Updated " + toDisplayString(formatDate(job.updated_at)), 1)
                              ]),
                              createVNode("div", { class: "text-right" }, [
                                createVNode("p", { class: "text-sm font-semibold text-[#101828]" }, toDisplayString(formatKes(job.pricing?.client_total)), 1),
                                createVNode("p", { class: "mt-1 text-xs text-[#667085]" }, "Payment: " + toDisplayString(startCase(job.payment_status || "pending")), 1),
                                createVNode("p", { class: "mt-1 text-xs text-[#667085]" }, "Status: " + toDisplayString(startCase(job.status || "pending")), 1)
                              ])
                            ]),
                            createVNode("div", { class: "mt-4 flex flex-wrap gap-3" }, [
                              createVNode(BaseButton, {
                                to: `/dashboard/client/jobs/${job.id}`,
                                variant: "primary",
                                size: "sm"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("View job")
                                ]),
                                _: 1
                              }, 8, ["to"]),
                              createVNode(BaseButton, {
                                to: `/dashboard/client/jobs/${job.id}`,
                                variant: "secondary",
                                size: "sm"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(isPaymentReady(job) ? "Pay now" : "Track status"), 1)
                                ]),
                                _: 2
                              }, 1032, ["to"])
                            ])
                          ]);
                        }), 128))
                      ]))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else if (unref(section) === "payments") {
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Payments",
                subtitle: "Client payment prompts and M-Pesa status updates."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (unref(loading)) {
                      _push3(`<div class="grid gap-4"${_scopeId2}><!--[-->`);
                      ssrRenderList(3, (index) => {
                        _push3(`<div class="h-28 animate-pulse rounded-2xl border border-[#e4e7ec] bg-[#f9fafb]"${_scopeId2}></div>`);
                      });
                      _push3(`<!--]--></div>`);
                    } else if (!unref(payments).length) {
                      _push3(ssrRenderComponent(DashboardEmptyState, {
                        title: "No payment prompts yet",
                        description: "Payment requests will appear here when a managed job is ready for M-Pesa.",
                        "action-label": "Open quotes",
                        "action-to": "/dashboard/client/quotes"
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<div class="grid gap-4"${_scopeId2}><!--[-->`);
                      ssrRenderList(unref(payments), (payment) => {
                        _push3(`<article class="rounded-2xl border border-[#e4e7ec] bg-white p-5"${_scopeId2}><div class="flex flex-wrap items-start justify-between gap-4"${_scopeId2}><div${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]"${_scopeId2}>${ssrInterpolate(payment.reference || `Payment ${payment.id}`)}</p><h3 class="mt-2 text-lg font-semibold text-[#101828]"${_scopeId2}>${ssrInterpolate(formatKes(payment.amount))}</h3><p class="mt-1 text-sm text-[#667085]"${_scopeId2}>${ssrInterpolate(startCase(payment.channel || "M-Pesa"))}</p></div><div class="text-right"${_scopeId2}><span class="inline-flex rounded-full border border-[#d0d5dd] bg-[#f9fafb] px-3 py-1 text-xs font-semibold text-[#344054]"${_scopeId2}>${ssrInterpolate(startCase(payment.payment_status || "pending"))}</span></div></div><div class="mt-4 flex flex-wrap gap-3"${_scopeId2}>`);
                        if (payment.managed_job_id) {
                          _push3(ssrRenderComponent(BaseButton, {
                            to: `/dashboard/client/jobs/${payment.managed_job_id}`,
                            variant: "primary",
                            size: "sm"
                          }, {
                            default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                              if (_push4) {
                                _push4(`Open job`);
                              } else {
                                return [
                                  createTextVNode("Open job")
                                ];
                              }
                            }),
                            _: 2
                          }, _parent3, _scopeId2));
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</div></article>`);
                      });
                      _push3(`<!--]--></div>`);
                    }
                  } else {
                    return [
                      unref(loading) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "grid gap-4"
                      }, [
                        (openBlock(), createBlock(Fragment, null, renderList(3, (index) => {
                          return createVNode("div", {
                            key: index,
                            class: "h-28 animate-pulse rounded-2xl border border-[#e4e7ec] bg-[#f9fafb]"
                          });
                        }), 64))
                      ])) : !unref(payments).length ? (openBlock(), createBlock(DashboardEmptyState, {
                        key: 1,
                        title: "No payment prompts yet",
                        description: "Payment requests will appear here when a managed job is ready for M-Pesa.",
                        "action-label": "Open quotes",
                        "action-to": "/dashboard/client/quotes"
                      })) : (openBlock(), createBlock("div", {
                        key: 2,
                        class: "grid gap-4"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(payments), (payment) => {
                          return openBlock(), createBlock("article", {
                            key: payment.id,
                            class: "rounded-2xl border border-[#e4e7ec] bg-white p-5"
                          }, [
                            createVNode("div", { class: "flex flex-wrap items-start justify-between gap-4" }, [
                              createVNode("div", null, [
                                createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]" }, toDisplayString(payment.reference || `Payment ${payment.id}`), 1),
                                createVNode("h3", { class: "mt-2 text-lg font-semibold text-[#101828]" }, toDisplayString(formatKes(payment.amount)), 1),
                                createVNode("p", { class: "mt-1 text-sm text-[#667085]" }, toDisplayString(startCase(payment.channel || "M-Pesa")), 1)
                              ]),
                              createVNode("div", { class: "text-right" }, [
                                createVNode("span", { class: "inline-flex rounded-full border border-[#d0d5dd] bg-[#f9fafb] px-3 py-1 text-xs font-semibold text-[#344054]" }, toDisplayString(startCase(payment.payment_status || "pending")), 1)
                              ])
                            ]),
                            createVNode("div", { class: "mt-4 flex flex-wrap gap-3" }, [
                              payment.managed_job_id ? (openBlock(), createBlock(BaseButton, {
                                key: 0,
                                to: `/dashboard/client/jobs/${payment.managed_job_id}`,
                                variant: "primary",
                                size: "sm"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Open job")
                                ]),
                                _: 1
                              }, 8, ["to"])) : createCommentVNode("", true)
                            ])
                          ]);
                        }), 128))
                      ]))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else if (unref(section) === "reorders") {
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Reorders",
                subtitle: "Fresh quotes only. Previous payments and managed jobs are never reused."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(DashboardEmptyState, {
                      title: "Reorder is coming soon",
                      description: "Use a completed job or quote detail to copy specs back into the calculator when those specs are available.",
                      "action-label": "Open jobs",
                      "action-to": "/dashboard/client/jobs"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(DashboardEmptyState, {
                        title: "Reorder is coming soon",
                        description: "Use a completed job or quote detail to copy specs back into the calculator when those specs are available.",
                        "action-label": "Open jobs",
                        "action-to": "/dashboard/client/jobs"
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(DashboardSection, {
                title: unref(sectionTitle),
                subtitle: "Client dashboard section"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(DashboardEmptyState, {
                      title: "Section unavailable",
                      description: "This client route does not have a dedicated view yet.",
                      "action-label": "Back to client dashboard",
                      "action-to": "/dashboard/client"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(DashboardEmptyState, {
                        title: "Section unavailable",
                        description: "This client route does not have a dedicated view yet.",
                        "action-label": "Back to client dashboard",
                        "action-to": "/dashboard/client"
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
          } else {
            return [
              unref(pageError) ? (openBlock(), createBlock(BaseAlert, {
                key: 0,
                variant: "error",
                title: "Client workspace could not load.",
                message: unref(pageError)
              }, null, 8, ["message"])) : createCommentVNode("", true),
              unref(section) === "quotes" ? (openBlock(), createBlock(DashboardSection, {
                key: 1,
                title: "Client Quotes",
                subtitle: "Track waiting quotes, view responses, and continue to payment."
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "mb-5 flex flex-wrap items-center justify-between gap-3" }, [
                    createVNode("div", { class: "inline-flex rounded-2xl border border-[#e4e7ec] bg-white p-1" }, [
                      createVNode("button", {
                        type: "button",
                        class: ["rounded-xl px-4 py-2 text-sm font-semibold transition-colors", unref(quoteTab) === "waiting" ? "bg-[#101828] text-white" : "text-[#667085] hover:text-[#101828]"],
                        onClick: ($event) => quoteTab.value = "waiting"
                      }, " Waiting (" + toDisplayString(unref(waitingQuotes).length) + ") ", 11, ["onClick"]),
                      createVNode("button", {
                        type: "button",
                        class: ["rounded-xl px-4 py-2 text-sm font-semibold transition-colors", unref(quoteTab) === "responded" ? "bg-[#101828] text-white" : "text-[#667085] hover:text-[#101828]"],
                        onClick: ($event) => quoteTab.value = "responded"
                      }, " Responded (" + toDisplayString(unref(respondedQuotes).length) + ") ", 11, ["onClick"])
                    ]),
                    createVNode(BaseButton, {
                      to: "/dashboard/client?pendingQuote=1",
                      variant: "primary",
                      size: "sm"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Open Calculator")
                      ]),
                      _: 1
                    })
                  ]),
                  unref(loading) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "grid gap-4"
                  }, [
                    (openBlock(), createBlock(Fragment, null, renderList(3, (index) => {
                      return createVNode("div", {
                        key: index,
                        class: "h-32 animate-pulse rounded-2xl border border-[#e4e7ec] bg-[#f9fafb]"
                      });
                    }), 64))
                  ])) : !unref(filteredQuotes).length ? (openBlock(), createBlock(DashboardEmptyState, {
                    key: 1,
                    title: "No quote requests yet",
                    description: "Your quotes will appear here after you request pricing.",
                    "action-label": "Use the calculator",
                    "action-to": "/dashboard/client?pendingQuote=1"
                  })) : (openBlock(), createBlock("div", {
                    key: 2,
                    class: "grid gap-4"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredQuotes), (quote) => {
                      return openBlock(), createBlock("article", {
                        key: quote.id,
                        class: "rounded-2xl border border-[#e4e7ec] bg-white p-5"
                      }, [
                        createVNode("div", { class: "flex flex-wrap items-start justify-between gap-4" }, [
                          createVNode("div", null, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]" }, toDisplayString(quote.request_reference || quote.reference || `Quote ${quote.id}`), 1),
                            createVNode("h3", { class: "mt-2 text-lg font-semibold text-[#101828]" }, toDisplayString(quoteCardTitle(quote)), 1),
                            createVNode("p", { class: "mt-1 text-sm text-[#667085]" }, toDisplayString(quoteCardMeta(quote)), 1)
                          ]),
                          createVNode("div", { class: "text-right" }, [
                            createVNode("span", { class: "inline-flex rounded-full border border-[#fda497] bg-[#fff8f7] px-3 py-1 text-xs font-semibold text-[#c92f13]" }, toDisplayString(quoteStatusLabel(quote)), 1),
                            createVNode("p", { class: "mt-3 text-sm font-semibold text-[#101828]" }, toDisplayString(quotePriceLabel(quote)), 1),
                            createVNode("p", { class: "mt-1 text-xs text-[#667085]" }, toDisplayString(quoteTurnaroundLabel(quote)), 1)
                          ])
                        ]),
                        createVNode("div", { class: "mt-4 flex flex-wrap gap-3" }, [
                          createVNode(BaseButton, {
                            to: `/dashboard/client/quotes/${quote.id}`,
                            variant: "primary",
                            size: "sm"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(hasResponse(quote) ? "View quote" : "Continue quote"), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])
                        ])
                      ]);
                    }), 128))
                  ]))
                ]),
                _: 1
              })) : unref(section) === "jobs" ? (openBlock(), createBlock(DashboardSection, {
                key: 2,
                title: "Client Jobs",
                subtitle: "Follow progress, pay when due, and reopen specs for a fresh quote."
              }, {
                default: withCtx(() => [
                  unref(loading) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "grid gap-4"
                  }, [
                    (openBlock(), createBlock(Fragment, null, renderList(3, (index) => {
                      return createVNode("div", {
                        key: index,
                        class: "h-32 animate-pulse rounded-2xl border border-[#e4e7ec] bg-[#f9fafb]"
                      });
                    }), 64))
                  ])) : !unref(jobs).length ? (openBlock(), createBlock(DashboardEmptyState, {
                    key: 1,
                    title: "No jobs yet",
                    description: "Accepted quotes and paid jobs will appear here.",
                    "action-label": "View quotes",
                    "action-to": "/dashboard/client/quotes"
                  })) : (openBlock(), createBlock("div", {
                    key: 2,
                    class: "grid gap-4"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(jobs), (job) => {
                      return openBlock(), createBlock("article", {
                        key: job.id,
                        class: "rounded-2xl border border-[#e4e7ec] bg-white p-5"
                      }, [
                        createVNode("div", { class: "flex flex-wrap items-start justify-between gap-4" }, [
                          createVNode("div", null, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]" }, toDisplayString(job.reference || `Job ${job.id}`), 1),
                            createVNode("h3", { class: "mt-2 text-lg font-semibold text-[#101828]" }, toDisplayString(job.title || "Managed print job"), 1),
                            createVNode("p", { class: "mt-1 text-sm text-[#667085]" }, "Updated " + toDisplayString(formatDate(job.updated_at)), 1)
                          ]),
                          createVNode("div", { class: "text-right" }, [
                            createVNode("p", { class: "text-sm font-semibold text-[#101828]" }, toDisplayString(formatKes(job.pricing?.client_total)), 1),
                            createVNode("p", { class: "mt-1 text-xs text-[#667085]" }, "Payment: " + toDisplayString(startCase(job.payment_status || "pending")), 1),
                            createVNode("p", { class: "mt-1 text-xs text-[#667085]" }, "Status: " + toDisplayString(startCase(job.status || "pending")), 1)
                          ])
                        ]),
                        createVNode("div", { class: "mt-4 flex flex-wrap gap-3" }, [
                          createVNode(BaseButton, {
                            to: `/dashboard/client/jobs/${job.id}`,
                            variant: "primary",
                            size: "sm"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("View job")
                            ]),
                            _: 1
                          }, 8, ["to"]),
                          createVNode(BaseButton, {
                            to: `/dashboard/client/jobs/${job.id}`,
                            variant: "secondary",
                            size: "sm"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(isPaymentReady(job) ? "Pay now" : "Track status"), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])
                        ])
                      ]);
                    }), 128))
                  ]))
                ]),
                _: 1
              })) : unref(section) === "payments" ? (openBlock(), createBlock(DashboardSection, {
                key: 3,
                title: "Payments",
                subtitle: "Client payment prompts and M-Pesa status updates."
              }, {
                default: withCtx(() => [
                  unref(loading) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "grid gap-4"
                  }, [
                    (openBlock(), createBlock(Fragment, null, renderList(3, (index) => {
                      return createVNode("div", {
                        key: index,
                        class: "h-28 animate-pulse rounded-2xl border border-[#e4e7ec] bg-[#f9fafb]"
                      });
                    }), 64))
                  ])) : !unref(payments).length ? (openBlock(), createBlock(DashboardEmptyState, {
                    key: 1,
                    title: "No payment prompts yet",
                    description: "Payment requests will appear here when a managed job is ready for M-Pesa.",
                    "action-label": "Open quotes",
                    "action-to": "/dashboard/client/quotes"
                  })) : (openBlock(), createBlock("div", {
                    key: 2,
                    class: "grid gap-4"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(payments), (payment) => {
                      return openBlock(), createBlock("article", {
                        key: payment.id,
                        class: "rounded-2xl border border-[#e4e7ec] bg-white p-5"
                      }, [
                        createVNode("div", { class: "flex flex-wrap items-start justify-between gap-4" }, [
                          createVNode("div", null, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]" }, toDisplayString(payment.reference || `Payment ${payment.id}`), 1),
                            createVNode("h3", { class: "mt-2 text-lg font-semibold text-[#101828]" }, toDisplayString(formatKes(payment.amount)), 1),
                            createVNode("p", { class: "mt-1 text-sm text-[#667085]" }, toDisplayString(startCase(payment.channel || "M-Pesa")), 1)
                          ]),
                          createVNode("div", { class: "text-right" }, [
                            createVNode("span", { class: "inline-flex rounded-full border border-[#d0d5dd] bg-[#f9fafb] px-3 py-1 text-xs font-semibold text-[#344054]" }, toDisplayString(startCase(payment.payment_status || "pending")), 1)
                          ])
                        ]),
                        createVNode("div", { class: "mt-4 flex flex-wrap gap-3" }, [
                          payment.managed_job_id ? (openBlock(), createBlock(BaseButton, {
                            key: 0,
                            to: `/dashboard/client/jobs/${payment.managed_job_id}`,
                            variant: "primary",
                            size: "sm"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Open job")
                            ]),
                            _: 1
                          }, 8, ["to"])) : createCommentVNode("", true)
                        ])
                      ]);
                    }), 128))
                  ]))
                ]),
                _: 1
              })) : unref(section) === "reorders" ? (openBlock(), createBlock(DashboardSection, {
                key: 4,
                title: "Reorders",
                subtitle: "Fresh quotes only. Previous payments and managed jobs are never reused."
              }, {
                default: withCtx(() => [
                  createVNode(DashboardEmptyState, {
                    title: "Reorder is coming soon",
                    description: "Use a completed job or quote detail to copy specs back into the calculator when those specs are available.",
                    "action-label": "Open jobs",
                    "action-to": "/dashboard/client/jobs"
                  })
                ]),
                _: 1
              })) : (openBlock(), createBlock(DashboardSection, {
                key: 5,
                title: unref(sectionTitle),
                subtitle: "Client dashboard section"
              }, {
                default: withCtx(() => [
                  createVNode(DashboardEmptyState, {
                    title: "Section unavailable",
                    description: "This client route does not have a dedicated view yet.",
                    "action-label": "Back to client dashboard",
                    "action-to": "/dashboard/client"
                  })
                ]),
                _: 1
              }, 8, ["title"]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/client/[section].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_section_-59xOI2NT.mjs.map
