import { defineComponent, withAsyncContext, computed, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { B as BaseAlert } from './BaseAlert-BEu0SLA6.mjs';
import { R as RoleDashboardFrame, D as DashboardSection } from './RoleDashboardFrame-z5_-ER2G.mjs';
import { u as useDashboardApi } from './dashboard-CEbEdesF.mjs';
import { b as fetchManagedJobSettlement, c as fetchShopAssignments, f as fetchManagedJobFiles, u as updateAssignmentAction, g as uploadManagedJobProof } from './jobs-AimEXG-e.mjs';
import { m as useAuthStore, n as navigateTo, q as useRoute, j as getApiErrorMessage } from './server.mjs';
import './DashboardTopbar-CBNaUx0B.mjs';
import './design-HtHvYN8j.mjs';
import './PrintyLogo-bSA8QTQF.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const auth = useAuthStore();
    const { fetchDashboardDetail } = useDashboardApi();
    if (!auth.canAccessProductionDashboard) {
      [__temp, __restore] = withAsyncContext(() => navigateTo(auth.homeRoute)), await __temp, __restore();
    }
    const route = useRoute();
    const section = String(route.params.section || "jobs");
    const id = String(route.params.id || "");
    const displayName = computed(() => auth.user?.name || auth.user?.email || "Production");
    const initials = computed(() => displayName.value.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "PD");
    const navItems = computed(() => [{ label: "Jobs", to: "/dashboard/production/jobs", active: true }]);
    const pageError = ref("");
    const actionLoading = ref("");
    const jobDetail = ref(null);
    const settlement = ref(null);
    const assignments = ref([]);
    const files = ref([]);
    const proofFile = ref(null);
    async function loadDetail() {
      pageError.value = "";
      try {
        const payload = await fetchDashboardDetail("production", section, id);
        jobDetail.value = payload?.job || null;
        settlement.value = await fetchManagedJobSettlement(id);
        assignments.value = await fetchShopAssignments();
        files.value = await fetchManagedJobFiles(id);
      } catch (error) {
        pageError.value = getApiErrorMessage(error, "Production detail is unavailable right now.");
      }
    }
    [__temp, __restore] = withAsyncContext(() => loadDetail()), await __temp, __restore();
    const activeAssignment = computed(() => assignments.value.find((item) => String(item.managed_job) === id) || null);
    const assignmentId = computed(() => activeAssignment.value?.id || null);
    const assignmentLabel = computed(() => activeAssignment.value?.status || jobDetail.value?.assignment_status || "Pending dispatch");
    const jobReference = computed(() => jobDetail.value?.reference || `Job ${id}`);
    const jobTitle = computed(() => jobDetail.value?.title || "Production job");
    const productionAmountLabel = computed(() => settlement.value?.production_amount ? `KES ${settlement.value.production_amount}` : "Awaiting dispatch");
    const paymentHoldLabel = computed(() => String(jobDetail.value?.payment_status || "").toLowerCase().includes("hold") ? "On hold" : "Ready / pending confirmation");
    const deadlineLabel = computed(() => jobDetail.value?.requested_deadline ? new Date(jobDetail.value.requested_deadline).toLocaleString() : "No deadline set");
    const workflowLabel = computed(() => jobDetail.value?.workflow_projection?.label || jobDetail.value?.status || "Pending");
    function onProofSelected(event) {
      const input = event.target;
      proofFile.value = input.files?.[0] || null;
    }
    async function runAssignmentAction(action) {
      if (!assignmentId.value) {
        return;
      }
      const note = action === "issue" || action === "reject" ? (void 0).prompt("Add an optional note.") || "" : "";
      try {
        actionLoading.value = action;
        await updateAssignmentAction(assignmentId.value, action, note);
        await loadDetail();
      } catch (error) {
        pageError.value = getApiErrorMessage(error, "Assignment action failed.");
      } finally {
        actionLoading.value = "";
      }
    }
    async function uploadProof() {
      if (!proofFile.value) {
        return;
      }
      try {
        actionLoading.value = "upload-proof";
        await uploadManagedJobProof(id, proofFile.value);
        proofFile.value = null;
        await loadDetail();
      } catch (error) {
        pageError.value = getApiErrorMessage(error, "Proof upload failed.");
      } finally {
        actionLoading.value = "";
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(RoleDashboardFrame, mergeProps({
        title: "Production Detail",
        badge: "Production",
        name: unref(displayName),
        initials: unref(initials),
        subtitle: "Raw specs, proof handling, and assignment actions",
        "breadcrumb-root": "Dashboard",
        "nav-items": unref(navItems),
        "support-title": "Production detail",
        "support-copy": "Client totals and broker economics remain hidden on this route.",
        "support-action": "Back",
        "support-to": `/dashboard/production/${unref(section)}`,
        onLogout: ($event) => unref(auth).logout()
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(pageError)) {
              _push2(ssrRenderComponent(BaseAlert, {
                variant: "error",
                title: "Production detail could not load.",
                message: unref(pageError)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<div class="space-y-6"${_scopeId}>`);
              _push2(ssrRenderComponent(DashboardSection, {
                title: unref(jobReference),
                subtitle: unref(jobTitle)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="grid gap-4 md:grid-cols-4"${_scopeId2}><div class="rounded-2xl border border-[#e4e7ec] bg-white p-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]"${_scopeId2}>Assignment</p><p class="mt-2 text-base font-semibold text-[#101828]"${_scopeId2}>${ssrInterpolate(unref(assignmentLabel))}</p></div><div class="rounded-2xl border border-[#e4e7ec] bg-white p-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]"${_scopeId2}>Production amount</p><p class="mt-2 text-base font-semibold text-[#101828]"${_scopeId2}>${ssrInterpolate(unref(productionAmountLabel))}</p></div><div class="rounded-2xl border border-[#e4e7ec] bg-white p-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]"${_scopeId2}>Payment hold</p><p class="mt-2 text-base font-semibold text-[#101828]"${_scopeId2}>${ssrInterpolate(unref(paymentHoldLabel))}</p></div><div class="rounded-2xl border border-[#e4e7ec] bg-white p-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]"${_scopeId2}>Deadline</p><p class="mt-2 text-base font-semibold text-[#101828]"${_scopeId2}>${ssrInterpolate(unref(deadlineLabel))}</p></div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "grid gap-4 md:grid-cols-4" }, [
                        createVNode("div", { class: "rounded-2xl border border-[#e4e7ec] bg-white p-4" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]" }, "Assignment"),
                          createVNode("p", { class: "mt-2 text-base font-semibold text-[#101828]" }, toDisplayString(unref(assignmentLabel)), 1)
                        ]),
                        createVNode("div", { class: "rounded-2xl border border-[#e4e7ec] bg-white p-4" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]" }, "Production amount"),
                          createVNode("p", { class: "mt-2 text-base font-semibold text-[#101828]" }, toDisplayString(unref(productionAmountLabel)), 1)
                        ]),
                        createVNode("div", { class: "rounded-2xl border border-[#e4e7ec] bg-white p-4" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]" }, "Payment hold"),
                          createVNode("p", { class: "mt-2 text-base font-semibold text-[#101828]" }, toDisplayString(unref(paymentHoldLabel)), 1)
                        ]),
                        createVNode("div", { class: "rounded-2xl border border-[#e4e7ec] bg-white p-4" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]" }, "Deadline"),
                          createVNode("p", { class: "mt-2 text-base font-semibold text-[#101828]" }, toDisplayString(unref(deadlineLabel)), 1)
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Assignment actions",
                subtitle: "Only real backend actions are shown"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex flex-wrap gap-3"${_scopeId2}><button class="rounded-xl border border-[#12b76a] px-4 py-2 text-sm font-semibold text-[#027a48] disabled:opacity-50"${ssrIncludeBooleanAttr(!unref(assignmentId) || unref(actionLoading) === "accept") ? " disabled" : ""}${_scopeId2}>Accept job</button><button class="rounded-xl border border-[#f79009] px-4 py-2 text-sm font-semibold text-[#b54708] disabled:opacity-50"${ssrIncludeBooleanAttr(!unref(assignmentId) || unref(actionLoading) === "reject") ? " disabled" : ""}${_scopeId2}>Reject job</button><button class="rounded-xl border border-[#155eef] px-4 py-2 text-sm font-semibold text-[#155eef] disabled:opacity-50"${ssrIncludeBooleanAttr(!unref(assignmentId) || unref(actionLoading) === "in-production") ? " disabled" : ""}${_scopeId2}>Mark in production</button><button class="rounded-xl border border-[#7a5af8] px-4 py-2 text-sm font-semibold text-[#6941c6] disabled:opacity-50"${ssrIncludeBooleanAttr(!unref(assignmentId) || unref(actionLoading) === "ready") ? " disabled" : ""}${_scopeId2}>Mark ready</button><button class="rounded-xl border border-[#101828] px-4 py-2 text-sm font-semibold text-[#101828] disabled:opacity-50"${ssrIncludeBooleanAttr(!unref(assignmentId) || unref(actionLoading) === "completed") ? " disabled" : ""}${_scopeId2}>Mark completed</button><button class="rounded-xl border border-[#d92d20] px-4 py-2 text-sm font-semibold text-[#b42318] disabled:opacity-50"${ssrIncludeBooleanAttr(!unref(assignmentId) || unref(actionLoading) === "issue") ? " disabled" : ""}${_scopeId2}>Report issue</button></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex flex-wrap gap-3" }, [
                        createVNode("button", {
                          class: "rounded-xl border border-[#12b76a] px-4 py-2 text-sm font-semibold text-[#027a48] disabled:opacity-50",
                          disabled: !unref(assignmentId) || unref(actionLoading) === "accept",
                          onClick: ($event) => runAssignmentAction("accept")
                        }, "Accept job", 8, ["disabled", "onClick"]),
                        createVNode("button", {
                          class: "rounded-xl border border-[#f79009] px-4 py-2 text-sm font-semibold text-[#b54708] disabled:opacity-50",
                          disabled: !unref(assignmentId) || unref(actionLoading) === "reject",
                          onClick: ($event) => runAssignmentAction("reject")
                        }, "Reject job", 8, ["disabled", "onClick"]),
                        createVNode("button", {
                          class: "rounded-xl border border-[#155eef] px-4 py-2 text-sm font-semibold text-[#155eef] disabled:opacity-50",
                          disabled: !unref(assignmentId) || unref(actionLoading) === "in-production",
                          onClick: ($event) => runAssignmentAction("in-production")
                        }, "Mark in production", 8, ["disabled", "onClick"]),
                        createVNode("button", {
                          class: "rounded-xl border border-[#7a5af8] px-4 py-2 text-sm font-semibold text-[#6941c6] disabled:opacity-50",
                          disabled: !unref(assignmentId) || unref(actionLoading) === "ready",
                          onClick: ($event) => runAssignmentAction("ready")
                        }, "Mark ready", 8, ["disabled", "onClick"]),
                        createVNode("button", {
                          class: "rounded-xl border border-[#101828] px-4 py-2 text-sm font-semibold text-[#101828] disabled:opacity-50",
                          disabled: !unref(assignmentId) || unref(actionLoading) === "completed",
                          onClick: ($event) => runAssignmentAction("completed")
                        }, "Mark completed", 8, ["disabled", "onClick"]),
                        createVNode("button", {
                          class: "rounded-xl border border-[#d92d20] px-4 py-2 text-sm font-semibold text-[#b42318] disabled:opacity-50",
                          disabled: !unref(assignmentId) || unref(actionLoading) === "issue",
                          onClick: ($event) => runAssignmentAction("issue")
                        }, "Report issue", 8, ["disabled", "onClick"])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Upload proof",
                subtitle: "Visible without exposing client billing"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex flex-wrap items-center gap-3"${_scopeId2}><input type="file" accept=".pdf,image/*"${_scopeId2}><button class="rounded-xl bg-[#101828] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"${ssrIncludeBooleanAttr(!unref(proofFile) || unref(actionLoading) === "upload-proof") ? " disabled" : ""}${_scopeId2}>${ssrInterpolate(unref(actionLoading) === "upload-proof" ? "Uploading..." : "Upload proof")}</button></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex flex-wrap items-center gap-3" }, [
                        createVNode("input", {
                          type: "file",
                          accept: ".pdf,image/*",
                          onChange: onProofSelected
                        }, null, 32),
                        createVNode("button", {
                          class: "rounded-xl bg-[#101828] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50",
                          disabled: !unref(proofFile) || unref(actionLoading) === "upload-proof",
                          onClick: uploadProof
                        }, toDisplayString(unref(actionLoading) === "upload-proof" ? "Uploading..." : "Upload proof"), 9, ["disabled"])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Files",
                subtitle: "Artwork and proofs for production"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="space-y-3"${_scopeId2}><!--[-->`);
                    ssrRenderList(unref(files), (file) => {
                      _push3(`<div class="rounded-2xl border border-[#e4e7ec] bg-white p-4"${_scopeId2}><p class="text-sm font-semibold text-[#101828]"${_scopeId2}>${ssrInterpolate(file.original_filename || "Job file")}</p><p class="mt-1 text-sm text-[#667085]"${_scopeId2}>${ssrInterpolate(file.file_type)} • ${ssrInterpolate(file.status)}</p></div>`);
                    });
                    _push3(`<!--]-->`);
                    if (!unref(files).length) {
                      _push3(`<p class="text-sm text-[#667085]"${_scopeId2}>No production-visible files yet.</p>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "space-y-3" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(files), (file) => {
                          return openBlock(), createBlock("div", {
                            key: file.id,
                            class: "rounded-2xl border border-[#e4e7ec] bg-white p-4"
                          }, [
                            createVNode("p", { class: "text-sm font-semibold text-[#101828]" }, toDisplayString(file.original_filename || "Job file"), 1),
                            createVNode("p", { class: "mt-1 text-sm text-[#667085]" }, toDisplayString(file.file_type) + " • " + toDisplayString(file.status), 1)
                          ]);
                        }), 128)),
                        !unref(files).length ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-[#667085]"
                        }, "No production-visible files yet.")) : createCommentVNode("", true)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Specs and timeline",
                subtitle: "Raw production-side context only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="grid gap-4 md:grid-cols-2"${_scopeId2}><div class="rounded-2xl border border-[#e4e7ec] bg-white p-4"${_scopeId2}><p class="text-sm font-semibold text-[#101828]"${_scopeId2}>Operational status</p><p class="mt-2 text-sm text-[#667085]"${_scopeId2}>${ssrInterpolate(unref(workflowLabel))}</p></div><div class="rounded-2xl border border-[#e4e7ec] bg-white p-4"${_scopeId2}><p class="text-sm font-semibold text-[#101828]"${_scopeId2}>Payout state</p><p class="mt-2 text-sm text-[#667085]"${_scopeId2}>${ssrInterpolate(unref(paymentHoldLabel))}</p></div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode("div", { class: "rounded-2xl border border-[#e4e7ec] bg-white p-4" }, [
                          createVNode("p", { class: "text-sm font-semibold text-[#101828]" }, "Operational status"),
                          createVNode("p", { class: "mt-2 text-sm text-[#667085]" }, toDisplayString(unref(workflowLabel)), 1)
                        ]),
                        createVNode("div", { class: "rounded-2xl border border-[#e4e7ec] bg-white p-4" }, [
                          createVNode("p", { class: "text-sm font-semibold text-[#101828]" }, "Payout state"),
                          createVNode("p", { class: "mt-2 text-sm text-[#667085]" }, toDisplayString(unref(paymentHoldLabel)), 1)
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            }
          } else {
            return [
              unref(pageError) ? (openBlock(), createBlock(BaseAlert, {
                key: 0,
                variant: "error",
                title: "Production detail could not load.",
                message: unref(pageError)
              }, null, 8, ["message"])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "space-y-6"
              }, [
                createVNode(DashboardSection, {
                  title: unref(jobReference),
                  subtitle: unref(jobTitle)
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "grid gap-4 md:grid-cols-4" }, [
                      createVNode("div", { class: "rounded-2xl border border-[#e4e7ec] bg-white p-4" }, [
                        createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]" }, "Assignment"),
                        createVNode("p", { class: "mt-2 text-base font-semibold text-[#101828]" }, toDisplayString(unref(assignmentLabel)), 1)
                      ]),
                      createVNode("div", { class: "rounded-2xl border border-[#e4e7ec] bg-white p-4" }, [
                        createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]" }, "Production amount"),
                        createVNode("p", { class: "mt-2 text-base font-semibold text-[#101828]" }, toDisplayString(unref(productionAmountLabel)), 1)
                      ]),
                      createVNode("div", { class: "rounded-2xl border border-[#e4e7ec] bg-white p-4" }, [
                        createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]" }, "Payment hold"),
                        createVNode("p", { class: "mt-2 text-base font-semibold text-[#101828]" }, toDisplayString(unref(paymentHoldLabel)), 1)
                      ]),
                      createVNode("div", { class: "rounded-2xl border border-[#e4e7ec] bg-white p-4" }, [
                        createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]" }, "Deadline"),
                        createVNode("p", { class: "mt-2 text-base font-semibold text-[#101828]" }, toDisplayString(unref(deadlineLabel)), 1)
                      ])
                    ])
                  ]),
                  _: 1
                }, 8, ["title", "subtitle"]),
                createVNode(DashboardSection, {
                  title: "Assignment actions",
                  subtitle: "Only real backend actions are shown"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex flex-wrap gap-3" }, [
                      createVNode("button", {
                        class: "rounded-xl border border-[#12b76a] px-4 py-2 text-sm font-semibold text-[#027a48] disabled:opacity-50",
                        disabled: !unref(assignmentId) || unref(actionLoading) === "accept",
                        onClick: ($event) => runAssignmentAction("accept")
                      }, "Accept job", 8, ["disabled", "onClick"]),
                      createVNode("button", {
                        class: "rounded-xl border border-[#f79009] px-4 py-2 text-sm font-semibold text-[#b54708] disabled:opacity-50",
                        disabled: !unref(assignmentId) || unref(actionLoading) === "reject",
                        onClick: ($event) => runAssignmentAction("reject")
                      }, "Reject job", 8, ["disabled", "onClick"]),
                      createVNode("button", {
                        class: "rounded-xl border border-[#155eef] px-4 py-2 text-sm font-semibold text-[#155eef] disabled:opacity-50",
                        disabled: !unref(assignmentId) || unref(actionLoading) === "in-production",
                        onClick: ($event) => runAssignmentAction("in-production")
                      }, "Mark in production", 8, ["disabled", "onClick"]),
                      createVNode("button", {
                        class: "rounded-xl border border-[#7a5af8] px-4 py-2 text-sm font-semibold text-[#6941c6] disabled:opacity-50",
                        disabled: !unref(assignmentId) || unref(actionLoading) === "ready",
                        onClick: ($event) => runAssignmentAction("ready")
                      }, "Mark ready", 8, ["disabled", "onClick"]),
                      createVNode("button", {
                        class: "rounded-xl border border-[#101828] px-4 py-2 text-sm font-semibold text-[#101828] disabled:opacity-50",
                        disabled: !unref(assignmentId) || unref(actionLoading) === "completed",
                        onClick: ($event) => runAssignmentAction("completed")
                      }, "Mark completed", 8, ["disabled", "onClick"]),
                      createVNode("button", {
                        class: "rounded-xl border border-[#d92d20] px-4 py-2 text-sm font-semibold text-[#b42318] disabled:opacity-50",
                        disabled: !unref(assignmentId) || unref(actionLoading) === "issue",
                        onClick: ($event) => runAssignmentAction("issue")
                      }, "Report issue", 8, ["disabled", "onClick"])
                    ])
                  ]),
                  _: 1
                }),
                createVNode(DashboardSection, {
                  title: "Upload proof",
                  subtitle: "Visible without exposing client billing"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex flex-wrap items-center gap-3" }, [
                      createVNode("input", {
                        type: "file",
                        accept: ".pdf,image/*",
                        onChange: onProofSelected
                      }, null, 32),
                      createVNode("button", {
                        class: "rounded-xl bg-[#101828] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50",
                        disabled: !unref(proofFile) || unref(actionLoading) === "upload-proof",
                        onClick: uploadProof
                      }, toDisplayString(unref(actionLoading) === "upload-proof" ? "Uploading..." : "Upload proof"), 9, ["disabled"])
                    ])
                  ]),
                  _: 1
                }),
                createVNode(DashboardSection, {
                  title: "Files",
                  subtitle: "Artwork and proofs for production"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "space-y-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(files), (file) => {
                        return openBlock(), createBlock("div", {
                          key: file.id,
                          class: "rounded-2xl border border-[#e4e7ec] bg-white p-4"
                        }, [
                          createVNode("p", { class: "text-sm font-semibold text-[#101828]" }, toDisplayString(file.original_filename || "Job file"), 1),
                          createVNode("p", { class: "mt-1 text-sm text-[#667085]" }, toDisplayString(file.file_type) + " • " + toDisplayString(file.status), 1)
                        ]);
                      }), 128)),
                      !unref(files).length ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-[#667085]"
                      }, "No production-visible files yet.")) : createCommentVNode("", true)
                    ])
                  ]),
                  _: 1
                }),
                createVNode(DashboardSection, {
                  title: "Specs and timeline",
                  subtitle: "Raw production-side context only"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                      createVNode("div", { class: "rounded-2xl border border-[#e4e7ec] bg-white p-4" }, [
                        createVNode("p", { class: "text-sm font-semibold text-[#101828]" }, "Operational status"),
                        createVNode("p", { class: "mt-2 text-sm text-[#667085]" }, toDisplayString(unref(workflowLabel)), 1)
                      ]),
                      createVNode("div", { class: "rounded-2xl border border-[#e4e7ec] bg-white p-4" }, [
                        createVNode("p", { class: "text-sm font-semibold text-[#101828]" }, "Payout state"),
                        createVNode("p", { class: "mt-2 text-sm text-[#667085]" }, toDisplayString(unref(paymentHoldLabel)), 1)
                      ])
                    ])
                  ]),
                  _: 1
                })
              ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/production/[section]/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-B1YfMG8-.mjs.map
