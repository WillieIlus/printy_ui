import { defineComponent, withAsyncContext, computed, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { B as BaseAlert } from './BaseAlert-BEu0SLA6.mjs';
import { m as useAuthStore, n as navigateTo, q as useRoute, a as BaseButton, j as getApiErrorMessage } from './server.mjs';
import { D as DashboardPageHeader } from './DashboardPageHeader-C891xTIs.mjs';
import { R as RoleDashboardFrame, D as DashboardSection } from './RoleDashboardFrame-z5_-ER2G.mjs';
import { g as getPartnerQuoteDetail, d as dispatchPartnerJob } from './partner-CVYG73qe.mjs';
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
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const auth = useAuthStore();
    if (!auth.canAccessPartnerDashboard) {
      [__temp, __restore] = withAsyncContext(() => navigateTo(auth.homeRoute)), await __temp, __restore();
    }
    const route = useRoute();
    const section = computed(() => String(route.params.section || "quotes"));
    const id = computed(() => String(route.params.id || ""));
    const displayName = computed(() => auth.user?.name || auth.user?.email || "Partner");
    const initials = computed(() => displayName.value.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "PT");
    const navItems = computed(() => [
      { label: "Quotes", to: "/dashboard/partner/quotes", active: section.value === "quotes" },
      { label: "Jobs", to: "/dashboard/partner/jobs", active: section.value === "jobs" }
    ]);
    const pageError = ref("");
    const dispatchLoading = ref(false);
    const noticeMessage = ref("");
    const noticeVariant = ref("success");
    const quoteDetail = ref(null);
    async function loadDetail() {
      pageError.value = "";
      try {
        const payload = await getPartnerQuoteDetail(id.value);
        quoteDetail.value = payload?.quote || null;
      } catch (error) {
        pageError.value = getApiErrorMessage(error, "Partner detail is unavailable right now.");
      }
    }
    [__temp, __restore] = withAsyncContext(() => loadDetail()), await __temp, __restore();
    const latestResponse = computed(() => quoteDetail.value?.latest_response || {});
    const pricing = computed(() => latestResponse.value?.response_snapshot?.customer_pricing || {});
    const requestSnapshot = computed(() => quoteDetail.value?.request_snapshot || {});
    const managedJob = computed(() => quoteDetail.value?.managed_job || null);
    const paymentStatus = computed(() => String(managedJob.value?.payment_status || "").toLowerCase());
    const assignmentStatus = computed(() => String(managedJob.value?.assignment_status || "").toLowerCase());
    const jobStatus = computed(() => String(managedJob.value?.status || "").toLowerCase());
    const isPaid = computed(() => ["confirmed", "release_ready", "paid"].includes(paymentStatus.value));
    const isDispatched = computed(() => Boolean(managedJob.value?.dispatched_at) || ["assignment_pending", "assigned", "accepted"].includes(assignmentStatus.value));
    const isComplete = computed(() => ["completed", "delivered"].includes(jobStatus.value));
    const heroTitle = computed(() => quoteDetail.value?.reference || quoteDetail.value?.request_reference || `Quote ${id.value}`);
    const heroSubtitle = computed(() => latestResponse.value?.shop_name || "Partner-managed quote detail");
    const clientName = computed(() => quoteDetail.value?.client_name || quoteDetail.value?.customer_name || "Client");
    const clientEmail = computed(() => quoteDetail.value?.client_email || "");
    const clientPhone = computed(() => quoteDetail.value?.client_phone || "");
    const sentDateLabel = computed(() => formatDate(quoteDetail.value?.latest_response?.sent_at || quoteDetail.value?.created_at));
    const productLabel = computed(() => requestSnapshot.value?.product_label || requestSnapshot.value?.product_type || "Partner quote");
    const quantitySizeLabel = computed(() => {
      const quantity = requestSnapshot.value?.quantity ? `${Number(requestSnapshot.value.quantity).toLocaleString("en-KE")} qty` : "Qty pending";
      const size = requestSnapshot.value?.finished_size || requestSnapshot.value?.size_label || "Size pending";
      return `${quantity} · ${size}`;
    });
    const specsLabel = computed(() => {
      const parts = [
        requestSnapshot.value?.print_sides || requestSnapshot.value?.print_sides_label,
        requestSnapshot.value?.color_mode || requestSnapshot.value?.color_mode_label,
        requestSnapshot.value?.paper_stock || requestSnapshot.value?.paper_label,
        requestSnapshot.value?.lamination || requestSnapshot.value?.lamination_label
      ].filter(Boolean);
      return parts.length ? parts.join(" · ") : "Specs pending";
    });
    const turnaroundLabel = computed(() => latestResponse.value?.turnaround_label || "Turnaround not provided");
    const productionCostLabel = computed(() => formatMoney(pricing.value?.production_base_price || latestResponse.value?.total || 0));
    const brokerMarginLabel = computed(() => formatMoney(pricing.value?.broker_margin_amount || 0));
    const platformFeeLabel = computed(() => formatMoney(pricing.value?.platform_service_amount || 0));
    const clientTotalLabel = computed(() => formatMoney(pricing.value?.final_client_price || latestResponse.value?.total || 0));
    const timelineSteps = computed(() => [
      { label: "Quote sent", copy: sentDateLabel.value, done: Boolean(latestResponse.value?.sent_at) },
      { label: "Client accepted", copy: managedJob.value?.id ? "Quote converted into a managed job." : "Waiting for client acceptance.", done: Boolean(managedJob.value?.id) },
      { label: "Payment received", copy: isPaid.value ? "Client payment is confirmed." : "Payment not confirmed yet.", done: isPaid.value },
      { label: "Dispatched to production", copy: isDispatched.value ? "Production assignment is underway." : "Dispatch available after payment.", done: isDispatched.value },
      { label: "Complete", copy: isComplete.value ? "Production marked the job complete." : "Still in progress.", done: isComplete.value }
    ]);
    const showDispatchButton = computed(() => Boolean(managedJob.value?.id) && isPaid.value && !isDispatched.value);
    const actionBoxClass = computed(() => {
      if (isComplete.value) return "border-teal-200 bg-teal-50 text-teal-800";
      if (isDispatched.value) return "border-blue-200 bg-blue-50 text-blue-800";
      if (isPaid.value) return "border-green-200 bg-green-50 text-green-800";
      if (managedJob.value?.id) return "border-amber-200 bg-amber-50 text-amber-800";
      return "border-slate-200 bg-slate-50 text-slate-700";
    });
    const actionTitle = computed(() => {
      if (isComplete.value) return "Job complete";
      if (isDispatched.value) return "Job is being printed";
      if (isPaid.value) return `Client has paid ${clientTotalLabel.value}`;
      if (managedJob.value?.id) return "Client accepted - awaiting payment";
      return "Waiting for client to accept";
    });
    const actionCopy = computed(() => {
      if (isComplete.value) return "Your earnings will settle after completion confirmation.";
      if (isDispatched.value) return "Production has the assignment and can continue fulfillment.";
      if (isPaid.value) return "Dispatch is available now.";
      if (managedJob.value?.id) return "Dispatch available after client payment.";
      return "No production action is available yet.";
    });
    async function dispatchQuoteJob() {
      if (!managedJob.value?.id) {
        return;
      }
      dispatchLoading.value = true;
      try {
        await dispatchPartnerJob(managedJob.value.id);
        noticeVariant.value = "success";
        noticeMessage.value = "Job sent to production. You'll be notified when it's ready.";
        await loadDetail();
      } catch (error) {
        noticeVariant.value = "error";
        noticeMessage.value = getApiErrorMessage(error, "Dispatch failed.");
      } finally {
        dispatchLoading.value = false;
      }
    }
    function formatMoney(value) {
      const amount = Number(value || 0);
      if (!Number.isFinite(amount) || amount <= 0) {
        return "KES 0.00";
      }
      return `KES ${amount.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    function formatDate(value) {
      if (!value) {
        return "Not sent yet";
      }
      const date = new Date(String(value));
      if (Number.isNaN(date.getTime())) {
        return "Not sent yet";
      }
      return new Intl.DateTimeFormat("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }).format(date);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(RoleDashboardFrame, mergeProps({
        title: "Partner Detail",
        badge: "Partner",
        name: unref(displayName),
        initials: unref(initials),
        subtitle: "Markup, client payment, and production dispatch",
        "breadcrumb-root": "Dashboard",
        "nav-items": unref(navItems),
        "support-title": "Partner detail",
        "support-copy": "Production base price stays visible here and hidden from the client route.",
        "support-action": "Back",
        "support-to": `/dashboard/partner/${unref(section)}`,
        onLogout: ($event) => unref(auth).logout()
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(pageError)) {
              _push2(ssrRenderComponent(BaseAlert, {
                variant: "error",
                title: "Partner detail could not load.",
                message: unref(pageError)
              }, null, _parent2, _scopeId));
            } else if (unref(noticeMessage)) {
              _push2(ssrRenderComponent(BaseAlert, {
                class: "mb-6",
                variant: unref(noticeVariant),
                message: unref(noticeMessage)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (!unref(pageError)) {
              _push2(`<div class="space-y-6"${_scopeId}>`);
              _push2(ssrRenderComponent(DashboardPageHeader, {
                eyebrow: "Partner Quote",
                title: unref(heroTitle),
                subtitle: unref(heroSubtitle)
              }, null, _parent2, _scopeId));
              _push2(`<div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]"${_scopeId}>`);
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Client + Job info",
                subtitle: "Who this quote is for and what was requested."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="grid gap-4 p-6 md:grid-cols-2"${_scopeId2}><div class="rounded-2xl border border-slate-200 bg-white p-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"${_scopeId2}>Client</p><p class="mt-2 text-sm font-semibold text-slate-900"${_scopeId2}>${ssrInterpolate(unref(clientName))}</p><p class="mt-1 text-sm text-slate-500"${_scopeId2}>${ssrInterpolate(unref(clientPhone) || unref(clientEmail) || "No contact visible")}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"${_scopeId2}>Date sent</p><p class="mt-2 text-sm font-semibold text-slate-900"${_scopeId2}>${ssrInterpolate(unref(sentDateLabel))}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"${_scopeId2}>Product</p><p class="mt-2 text-sm font-semibold text-slate-900"${_scopeId2}>${ssrInterpolate(unref(productLabel))}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"${_scopeId2}>Quantity + size</p><p class="mt-2 text-sm font-semibold text-slate-900"${_scopeId2}>${ssrInterpolate(unref(quantitySizeLabel))}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"${_scopeId2}>Specs</p><p class="mt-2 text-sm font-semibold text-slate-900"${_scopeId2}>${ssrInterpolate(unref(specsLabel))}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"${_scopeId2}>Turnaround</p><p class="mt-2 text-sm font-semibold text-slate-900"${_scopeId2}>${ssrInterpolate(unref(turnaroundLabel))}</p></div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "grid gap-4 p-6 md:grid-cols-2" }, [
                        createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Client"),
                          createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(unref(clientName)), 1),
                          createVNode("p", { class: "mt-1 text-sm text-slate-500" }, toDisplayString(unref(clientPhone) || unref(clientEmail) || "No contact visible"), 1)
                        ]),
                        createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Date sent"),
                          createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(unref(sentDateLabel)), 1)
                        ]),
                        createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Product"),
                          createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(unref(productLabel)), 1)
                        ]),
                        createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Quantity + size"),
                          createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(unref(quantitySizeLabel)), 1)
                        ]),
                        createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Specs"),
                          createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(unref(specsLabel)), 1)
                        ]),
                        createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Turnaround"),
                          createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(unref(turnaroundLabel)), 1)
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Financials + actions",
                subtitle: "Visible to partner only."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="space-y-5 p-6"${_scopeId2}><div class="rounded-3xl border border-slate-200 bg-slate-50 p-5"${_scopeId2}><div class="space-y-3 rounded-2xl border border-slate-200 bg-white p-5"${_scopeId2}><div class="flex items-center justify-between text-sm"${_scopeId2}><span class="text-slate-500"${_scopeId2}>Production cost</span><span class="font-semibold text-slate-900"${_scopeId2}>${ssrInterpolate(unref(productionCostLabel))}</span></div><div class="flex items-center justify-between text-sm"${_scopeId2}><span class="text-slate-500"${_scopeId2}>Your markup</span><span class="font-semibold text-slate-900"${_scopeId2}>${ssrInterpolate(unref(brokerMarginLabel))}</span></div><div class="flex items-center justify-between text-sm"${_scopeId2}><span class="text-slate-500"${_scopeId2}>Printy fee</span><span class="font-semibold text-slate-900"${_scopeId2}>${ssrInterpolate(unref(platformFeeLabel))}</span></div><div class="border-t border-slate-200 pt-3"${_scopeId2}><div class="flex items-center justify-between text-base font-bold text-slate-950"${_scopeId2}><span${_scopeId2}>Client total</span><span${_scopeId2}>${ssrInterpolate(unref(clientTotalLabel))}</span></div></div></div></div><div class="space-y-3"${_scopeId2}><!--[-->`);
                    ssrRenderList(unref(timelineSteps), (step) => {
                      _push3(`<div class="flex items-center gap-3"${_scopeId2}><div class="${ssrRenderClass([step.done ? "border-[#12b76a] bg-[#ecfdf3] text-[#027a48]" : "border-slate-200 bg-white text-slate-400", "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold"])}"${_scopeId2}>${ssrInterpolate(step.done ? "✓" : "○")}</div><div${_scopeId2}><p class="text-sm font-semibold text-slate-900"${_scopeId2}>${ssrInterpolate(step.label)}</p><p class="text-sm text-slate-500"${_scopeId2}>${ssrInterpolate(step.copy)}</p></div></div>`);
                    });
                    _push3(`<!--]--></div><div class="${ssrRenderClass([unref(actionBoxClass), "rounded-2xl border p-4"])}"${_scopeId2}><p class="text-sm font-semibold"${_scopeId2}>${ssrInterpolate(unref(actionTitle))}</p><p class="mt-1 text-sm"${_scopeId2}>${ssrInterpolate(unref(actionCopy))}</p>`);
                    if (unref(showDispatchButton)) {
                      _push3(ssrRenderComponent(BaseButton, {
                        class: "mt-4",
                        variant: "primary",
                        size: "sm",
                        loading: unref(dispatchLoading),
                        onClick: dispatchQuoteJob
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(` Dispatch to production `);
                          } else {
                            return [
                              createTextVNode(" Dispatch to production ")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                    if (unref(isComplete)) {
                      _push3(`<div class="rounded-2xl border border-teal-200 bg-teal-50 p-4"${_scopeId2}><p class="text-sm font-semibold text-teal-800"${_scopeId2}>Your earnings: ${ssrInterpolate(unref(brokerMarginLabel))} will be settled within 24hrs</p></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "space-y-5 p-6" }, [
                        createVNode("div", { class: "rounded-3xl border border-slate-200 bg-slate-50 p-5" }, [
                          createVNode("div", { class: "space-y-3 rounded-2xl border border-slate-200 bg-white p-5" }, [
                            createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                              createVNode("span", { class: "text-slate-500" }, "Production cost"),
                              createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(productionCostLabel)), 1)
                            ]),
                            createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                              createVNode("span", { class: "text-slate-500" }, "Your markup"),
                              createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(brokerMarginLabel)), 1)
                            ]),
                            createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                              createVNode("span", { class: "text-slate-500" }, "Printy fee"),
                              createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(platformFeeLabel)), 1)
                            ]),
                            createVNode("div", { class: "border-t border-slate-200 pt-3" }, [
                              createVNode("div", { class: "flex items-center justify-between text-base font-bold text-slate-950" }, [
                                createVNode("span", null, "Client total"),
                                createVNode("span", null, toDisplayString(unref(clientTotalLabel)), 1)
                              ])
                            ])
                          ])
                        ]),
                        createVNode("div", { class: "space-y-3" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(timelineSteps), (step) => {
                            return openBlock(), createBlock("div", {
                              class: "flex items-center gap-3",
                              key: step.label
                            }, [
                              createVNode("div", {
                                class: ["flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold", step.done ? "border-[#12b76a] bg-[#ecfdf3] text-[#027a48]" : "border-slate-200 bg-white text-slate-400"]
                              }, toDisplayString(step.done ? "✓" : "○"), 3),
                              createVNode("div", null, [
                                createVNode("p", { class: "text-sm font-semibold text-slate-900" }, toDisplayString(step.label), 1),
                                createVNode("p", { class: "text-sm text-slate-500" }, toDisplayString(step.copy), 1)
                              ])
                            ]);
                          }), 128))
                        ]),
                        createVNode("div", {
                          class: ["rounded-2xl border p-4", unref(actionBoxClass)]
                        }, [
                          createVNode("p", { class: "text-sm font-semibold" }, toDisplayString(unref(actionTitle)), 1),
                          createVNode("p", { class: "mt-1 text-sm" }, toDisplayString(unref(actionCopy)), 1),
                          unref(showDispatchButton) ? (openBlock(), createBlock(BaseButton, {
                            key: 0,
                            class: "mt-4",
                            variant: "primary",
                            size: "sm",
                            loading: unref(dispatchLoading),
                            onClick: dispatchQuoteJob
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Dispatch to production ")
                            ]),
                            _: 1
                          }, 8, ["loading"])) : createCommentVNode("", true)
                        ], 2),
                        unref(isComplete) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "rounded-2xl border border-teal-200 bg-teal-50 p-4"
                        }, [
                          createVNode("p", { class: "text-sm font-semibold text-teal-800" }, "Your earnings: " + toDisplayString(unref(brokerMarginLabel)) + " will be settled within 24hrs", 1)
                        ])) : createCommentVNode("", true)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(pageError) ? (openBlock(), createBlock(BaseAlert, {
                key: 0,
                variant: "error",
                title: "Partner detail could not load.",
                message: unref(pageError)
              }, null, 8, ["message"])) : unref(noticeMessage) ? (openBlock(), createBlock(BaseAlert, {
                key: 1,
                class: "mb-6",
                variant: unref(noticeVariant),
                message: unref(noticeMessage)
              }, null, 8, ["variant", "message"])) : createCommentVNode("", true),
              !unref(pageError) ? (openBlock(), createBlock("div", {
                key: 2,
                class: "space-y-6"
              }, [
                createVNode(DashboardPageHeader, {
                  eyebrow: "Partner Quote",
                  title: unref(heroTitle),
                  subtitle: unref(heroSubtitle)
                }, null, 8, ["title", "subtitle"]),
                createVNode("div", { class: "grid gap-6 xl:grid-cols-[1.05fr_0.95fr]" }, [
                  createVNode(DashboardSection, {
                    title: "Client + Job info",
                    subtitle: "Who this quote is for and what was requested."
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "grid gap-4 p-6 md:grid-cols-2" }, [
                        createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Client"),
                          createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(unref(clientName)), 1),
                          createVNode("p", { class: "mt-1 text-sm text-slate-500" }, toDisplayString(unref(clientPhone) || unref(clientEmail) || "No contact visible"), 1)
                        ]),
                        createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Date sent"),
                          createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(unref(sentDateLabel)), 1)
                        ]),
                        createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Product"),
                          createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(unref(productLabel)), 1)
                        ]),
                        createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Quantity + size"),
                          createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(unref(quantitySizeLabel)), 1)
                        ]),
                        createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Specs"),
                          createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(unref(specsLabel)), 1)
                        ]),
                        createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Turnaround"),
                          createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(unref(turnaroundLabel)), 1)
                        ])
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(DashboardSection, {
                    title: "Financials + actions",
                    subtitle: "Visible to partner only."
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "space-y-5 p-6" }, [
                        createVNode("div", { class: "rounded-3xl border border-slate-200 bg-slate-50 p-5" }, [
                          createVNode("div", { class: "space-y-3 rounded-2xl border border-slate-200 bg-white p-5" }, [
                            createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                              createVNode("span", { class: "text-slate-500" }, "Production cost"),
                              createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(productionCostLabel)), 1)
                            ]),
                            createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                              createVNode("span", { class: "text-slate-500" }, "Your markup"),
                              createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(brokerMarginLabel)), 1)
                            ]),
                            createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                              createVNode("span", { class: "text-slate-500" }, "Printy fee"),
                              createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(platformFeeLabel)), 1)
                            ]),
                            createVNode("div", { class: "border-t border-slate-200 pt-3" }, [
                              createVNode("div", { class: "flex items-center justify-between text-base font-bold text-slate-950" }, [
                                createVNode("span", null, "Client total"),
                                createVNode("span", null, toDisplayString(unref(clientTotalLabel)), 1)
                              ])
                            ])
                          ])
                        ]),
                        createVNode("div", { class: "space-y-3" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(timelineSteps), (step) => {
                            return openBlock(), createBlock("div", {
                              class: "flex items-center gap-3",
                              key: step.label
                            }, [
                              createVNode("div", {
                                class: ["flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold", step.done ? "border-[#12b76a] bg-[#ecfdf3] text-[#027a48]" : "border-slate-200 bg-white text-slate-400"]
                              }, toDisplayString(step.done ? "✓" : "○"), 3),
                              createVNode("div", null, [
                                createVNode("p", { class: "text-sm font-semibold text-slate-900" }, toDisplayString(step.label), 1),
                                createVNode("p", { class: "text-sm text-slate-500" }, toDisplayString(step.copy), 1)
                              ])
                            ]);
                          }), 128))
                        ]),
                        createVNode("div", {
                          class: ["rounded-2xl border p-4", unref(actionBoxClass)]
                        }, [
                          createVNode("p", { class: "text-sm font-semibold" }, toDisplayString(unref(actionTitle)), 1),
                          createVNode("p", { class: "mt-1 text-sm" }, toDisplayString(unref(actionCopy)), 1),
                          unref(showDispatchButton) ? (openBlock(), createBlock(BaseButton, {
                            key: 0,
                            class: "mt-4",
                            variant: "primary",
                            size: "sm",
                            loading: unref(dispatchLoading),
                            onClick: dispatchQuoteJob
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Dispatch to production ")
                            ]),
                            _: 1
                          }, 8, ["loading"])) : createCommentVNode("", true)
                        ], 2),
                        unref(isComplete) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "rounded-2xl border border-teal-200 bg-teal-50 p-4"
                        }, [
                          createVNode("p", { class: "text-sm font-semibold text-teal-800" }, "Your earnings: " + toDisplayString(unref(brokerMarginLabel)) + " will be settled within 24hrs", 1)
                        ])) : createCommentVNode("", true)
                      ])
                    ]),
                    _: 1
                  })
                ])
              ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/partner/[section]/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BSOw355_.mjs.map
