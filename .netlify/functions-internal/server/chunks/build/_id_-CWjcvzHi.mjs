import { _ as __nuxt_component_0 } from './DashboardPageHeader-Cmi_LCe-.mjs';
import { f as useRoute, b as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_1 } from './IncomingRequestStatusBadge-Cy3uXAqB.mjs';
import { _ as _sfc_main$1 } from './Badge-Dn_IFHF_.mjs';
import { _ as _sfc_main$2 } from './Textarea-DUPwu95P.mjs';
import { _ as __nuxt_component_7 } from './ShareActionsBar-DdjU3rhd.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { defineComponent, computed, ref, resolveComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, isRef, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { u as useActivityBadgesStore } from './activityBadges-B_bMwbEc.mjs';
import { f as formatCurrency, a as formatDate } from './formatters-FW8HHCjc.mjs';
import { u as useNotification } from './useNotification-DxMfmZhF.mjs';
import { u as useIncomingRequests, a as useSentQuotes } from './useIncomingRequests-Dj9ppvKn.mjs';
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
import './quoteMessage-Bmp83pcs.mjs';
import './useNotifications-BB49WIYK.mjs';
import './interval-DiSDr_Za.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slug = computed(() => route.params.slug);
    const id = computed(() => parseInt(route.params.id, 10));
    const notification = useNotification();
    const activityBadgesStore = useActivityBadgesStore();
    const incoming = useIncomingRequests(slug);
    const sentQuotes = useSentQuotes();
    const request = ref(null);
    const loading = ref(true);
    const sending = ref(false);
    const revising = ref(false);
    const accepting = ref(false);
    const askingQuestion = ref(false);
    const rejecting = ref(false);
    const showSendForm = ref(false);
    const showReviseForm = ref(false);
    const showQuestionForm = ref(false);
    const showRejectForm = ref(false);
    const questionBody = ref("");
    const rejectReason = ref("");
    const latestQuote = computed(() => {
      const sq = request.value?.sent_quotes;
      if (!sq?.length) return null;
      return [...sq].sort((a, b) => {
        const da = a.sent_at || a.created_at;
        const db = b.sent_at || b.created_at;
        return new Date(db).getTime() - new Date(da).getTime();
      })[0] ?? null;
    });
    const totalUnits = computed(
      () => request.value?.items.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0
    );
    const latestQuoteDisplay = computed(
      () => latestQuote.value?.total ? formatCurrency(latestQuote.value.total, request.value?.shop_currency) : "No quote sent yet"
    );
    const turnaroundDisplay = computed(
      () => latestQuote.value?.turnaround_hours != null ? `${latestQuote.value.turnaround_hours} working hour${latestQuote.value.turnaround_hours === 1 ? "" : "s"}` : latestQuote.value?.human_ready_text || "Not set"
    );
    const revisionCount = computed(() => request.value?.sent_quotes?.length ?? 0);
    const draftFileRoute = computed(
      () => request.value?.quote_draft_file_id ? `/dashboard/quotes/files/${request.value.quote_draft_file_id}` : null
    );
    const canAcceptRequest = computed(
      () => request.value != null && ["submitted", "viewed", "awaiting_shop_action"].includes(request.value.status) && !latestQuote.value
    );
    const canTweakAndQuote = computed(() => Boolean(request.value?.items.length));
    const canAskQuestion = computed(
      () => request.value != null && !["quoted", "rejected", "expired", "cancelled", "closed"].includes(request.value.status)
    );
    const canReject = computed(
      () => request.value != null && !["quoted", "rejected", "expired", "cancelled", "closed"].includes(request.value.status)
    );
    const canSendQuote = computed(
      () => request.value != null && !latestQuote.value && ["submitted", "viewed", "accepted", "awaiting_shop_action"].includes(request.value.status)
    );
    const canRevise = computed(
      () => request.value != null && latestQuote.value != null && ["sent", "revised"].includes(latestQuote.value.status)
    );
    const hasQuoteActions = computed(() => Boolean(latestQuote.value));
    const requesterDetails = computed(() => [
      { label: "Client name", value: request.value?.customer_name || "Not provided" },
      { label: "Email", value: request.value?.customer_email || "Not provided" },
      { label: "Phone", value: request.value?.customer_phone || "Not provided" },
      { label: "Request ID", value: request.value ? `#${request.value.id}` : "-" }
    ]);
    const summaryStats = computed(() => [
      {
        label: "Request status",
        value: request.value ? statusLabel(request.value.status) : "Pending",
        helper: request.value ? `Updated ${formatDate(request.value.updated_at || request.value.created_at)}` : ""
      },
      {
        label: "Submitted",
        value: request.value ? formatDate(request.value.created_at) : "Recently",
        helper: request.value ? `Request #${request.value.id}` : ""
      },
      {
        label: "Items",
        value: request.value ? `${request.value.items.length} line${request.value.items.length === 1 ? "" : "s"}` : "0 lines",
        helper: `${totalUnits.value} total units`
      },
      {
        label: "Quote state",
        value: latestQuote.value ? sentQuoteStatusLabel(latestQuote.value.status) : "Not sent",
        helper: latestQuote.value ? `Revision ${latestQuote.value.revision_number}` : nextStepCopy.value
      }
    ]);
    const primaryActionTitle = computed(() => {
      if (canSendQuote.value) return "Prepare and send the quote";
      if (canAcceptRequest.value) return "Take ownership of this request";
      if (request.value?.status === "awaiting_client_reply") return "Wait for the client reply";
      if (canRevise.value) return "Review the sent quote and revise if needed";
      if (draftFileRoute.value) return "Continue from the draft workspace";
      if (request.value?.status === "rejected") return "Request closed as rejected";
      return "Review the request history";
    });
    const primaryAction = computed(() => {
      if (canSendQuote.value) {
        return {
          label: "Send quote now",
          icon: "i-lucide-send",
          color: "primary",
          variant: "solid",
          to: void 0,
          disabled: false,
          loading: false,
          onClick: () => {
            showSendForm.value = true;
          }
        };
      }
      if (canAcceptRequest.value) {
        return {
          label: "Accept request",
          icon: "i-lucide-check",
          color: "primary",
          variant: "solid",
          to: void 0,
          disabled: false,
          loading: accepting.value,
          onClick: () => {
            void onAcceptRequest();
          }
        };
      }
      if (canRevise.value && latestQuote.value) {
        return {
          label: "Open sent quote",
          icon: "i-lucide-folder-open",
          color: "primary",
          variant: "solid",
          to: `/dashboard/shops/${slug.value}/sent-quotes/${latestQuote.value.id}`,
          disabled: false,
          loading: false,
          onClick: void 0
        };
      }
      if (draftFileRoute.value) {
        return {
          label: "Open draft workspace",
          icon: "i-lucide-files",
          color: "primary",
          variant: "solid",
          to: draftFileRoute.value,
          disabled: false,
          loading: false,
          onClick: void 0
        };
      }
      return null;
    });
    const deliverySummary = computed(() => {
      if (!request.value?.delivery_preference) return "Delivery preference not specified.";
      const mode = request.value.delivery_preference === "pickup" ? "Pickup" : "Delivery";
      const location = request.value.delivery_address || request.value.delivery_location_name;
      return location ? `${mode} / ${location}` : mode;
    });
    const timelineMessages = computed(() => {
      const messages = request.value?.messages ?? [];
      if (messages.length) return messages;
      if (!request.value) return [];
      return [{
        id: -1,
        sender_role: "system",
        message_kind: "status",
        body: "Request received from client.",
        created_at: request.value.created_at,
        updated_at: request.value.created_at
      }];
    });
    const nextStepCopy = computed(() => {
      const status = request.value?.status;
      if (!status) return "Load request";
      if (status === "submitted") return "Accept this request if the shop is ready to work on it, or ask a question before quoting.";
      if (status === "viewed") return "The request has been opened. Move it into an active decision so the client sees progress.";
      if (status === "accepted" || status === "awaiting_shop_action") return "Use the workbench or send the quote directly so the client gets a priced response.";
      if (status === "awaiting_client_reply") return "The next move is on the client. Leave the request visible and watch the timeline for their reply.";
      if (status === "quoted") return "The quote is with the client. Keep the sent quote visible in case they ask for a revision.";
      if (status === "rejected") return "The client can now see the rejection reason and this request is closed.";
      if (status === "cancelled") return "The client cancelled this request. No further shop action is needed.";
      if (status === "closed" || status === "expired") return "This request is no longer active.";
      return statusLabel(status);
    });
    const clientOutcome = computed(() => {
      const status = request.value?.status;
      if (latestQuote.value?.status === "accepted") {
        return {
          title: "Client accepted the quote.",
          description: "The client can treat this quote as approved and move forward with the order.",
          helper: `Latest visible quote: revision ${latestQuote.value.revision_number}.`
        };
      }
      if (status === "quoted") {
        return {
          title: "Client can review the quote now.",
          description: "They can see the latest total, note, turnaround, and any files or summary shared with the quote.",
          helper: latestQuote.value ? `Latest visible quote: revision ${latestQuote.value.revision_number}.` : void 0
        };
      }
      if (status === "rejected") {
        return {
          title: "Client sees the rejection reason.",
          description: "The request is marked rejected on their timeline, together with the reason you provided.",
          helper: "No quote can be sent from this state."
        };
      }
      if (status === "awaiting_client_reply") {
        return {
          title: "Client has been asked to respond.",
          description: "They can see your clarification message and the request is paused until they reply.",
          helper: "The timeline is now waiting on the client."
        };
      }
      if (status === "accepted" || status === "awaiting_shop_action") {
        return {
          title: "Client sees that the shop is working on it.",
          description: "The request shows progress, but the client is still waiting for the actual quote.",
          helper: "Best next move: send the quote."
        };
      }
      return {
        title: "Client is waiting for the shop decision.",
        description: "They can see the request exists, but they do not yet have a final shop response.",
        helper: "Accept, ask a question, or reject."
      };
    });
    const tweakQuoteRoute = computed(() => ({
      path: `/dashboard/shops/${slug.value}`,
      query: { requestId: String(id.value) }
    }));
    async function fetchRequest() {
      if (Number.isNaN(id.value)) {
        loading.value = false;
        return;
      }
      loading.value = true;
      try {
        const loadedRequest = await incoming.get(id.value);
        request.value = loadedRequest;
        if (loadedRequest.status === "submitted") {
          request.value = await incoming.markViewed(id.value);
        }
        await activityBadgesStore.fetchSummary(slug.value);
      } catch {
        request.value = null;
      } finally {
        loading.value = false;
      }
    }
    async function onAcceptRequest() {
      if (!request.value || accepting.value || !canAcceptRequest.value) return;
      accepting.value = true;
      try {
        request.value = await incoming.acceptRequest(id.value);
        await activityBadgesStore.fetchSummary(slug.value);
        notification.success("Request accepted");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to accept request");
      } finally {
        accepting.value = false;
      }
    }
    async function onAskQuestion() {
      if (!request.value || askingQuestion.value) return;
      if (!questionBody.value.trim()) {
        notification.error("Add a question for the client");
        return;
      }
      askingQuestion.value = true;
      try {
        request.value = await incoming.askQuestion(id.value, { body: questionBody.value.trim() });
        questionBody.value = "";
        showQuestionForm.value = false;
        await activityBadgesStore.fetchSummary(slug.value);
        notification.success("Question sent to client");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to send question");
      } finally {
        askingQuestion.value = false;
      }
    }
    async function onRejectRequest() {
      if (!request.value || rejecting.value) return;
      if (!rejectReason.value.trim()) {
        notification.error("Add a rejection reason");
        return;
      }
      rejecting.value = true;
      try {
        request.value = await incoming.rejectRequest(id.value, { reason: rejectReason.value.trim() });
        rejectReason.value = "";
        showRejectForm.value = false;
        await activityBadgesStore.fetchSummary(slug.value);
        notification.success("Request rejected");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to reject request");
      } finally {
        rejecting.value = false;
      }
    }
    async function onSendQuote(payload) {
      if (!request.value || sending.value) return;
      sending.value = true;
      try {
        request.value = await incoming.sendQuote(id.value, payload);
        showSendForm.value = false;
        await activityBadgesStore.fetchSummary(slug.value);
        notification.success("Quote sent");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to send quote");
      } finally {
        sending.value = false;
      }
    }
    async function onReviseQuote(payload) {
      const sq = latestQuote.value;
      if (!sq || revising.value) return;
      revising.value = true;
      try {
        await sentQuotes.revise(sq.id, payload);
        await fetchRequest();
        showReviseForm.value = false;
        await activityBadgesStore.fetchSummary(slug.value);
        notification.success("Quote revised");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to revise quote");
      } finally {
        revising.value = false;
      }
    }
    function downloadQuotePdf() {
      if (!latestQuote.value) return;
      (void 0).open(`/dashboard/shops/${slug.value}/sent-quotes/${latestQuote.value.id}?print=1`, "_blank", "noopener");
    }
    function statusLabel(status) {
      const labels = {
        draft: "Draft",
        submitted: "Submitted",
        awaiting_shop_action: "Awaiting shop action",
        awaiting_client_reply: "Awaiting client reply",
        viewed: "Viewed",
        quoted: "Quoted",
        accepted: "Accepted by shop",
        rejected: "Rejected",
        expired: "Expired",
        closed: "Closed",
        cancelled: "Cancelled"
      };
      return labels[status] ?? status;
    }
    function sentQuoteStatusLabel(status) {
      const labels = {
        sent: "Sent quote",
        revised: "Revised quote",
        accepted: "Accepted by client"
      };
      return labels[status] ?? status;
    }
    function timelineTitle(message) {
      const labels = {
        status: "Status update",
        question: "Question sent",
        reply: "Client reply",
        rejection: "Request rejected",
        quote: "Quote update",
        note: "Note"
      };
      return labels[message.message_kind] ?? "Update";
    }
    function timelineMeta(message) {
      const role = message.sender_role === "shop" ? "Shop" : message.sender_role === "client" ? "Client" : "System";
      const sender = message.sender_name ? ` / ${message.sender_name}` : "";
      return `${role}${sender}`;
    }
    function timelineDotClass(message) {
      if (message.message_kind === "rejection") return "bg-red-500";
      if (message.message_kind === "quote") return "bg-primary-500";
      if (message.message_kind === "question") return "bg-amber-500";
      if (message.message_kind === "reply") return "bg-emerald-500";
      return "bg-[var(--p-text-muted)]";
    }
    function itemSizeLine(item) {
      if (item.chosen_width_mm && item.chosen_height_mm) return `${item.chosen_width_mm} x ${item.chosen_height_mm} mm`;
      if (item.spec_text) return item.spec_text;
      return "Not specified";
    }
    function itemPaperLine(item) {
      if (item.paper) return `Paper #${item.paper}`;
      if (item.material) return `Material #${item.material}`;
      return "Stock not specified";
    }
    function itemFinishingLine(item) {
      const labels = item.finishings?.map((finishing) => finishing.finishing_rate_name).filter(Boolean) ?? [];
      return labels.length ? labels.join(", ") : "None";
    }
    function itemModeLine(item) {
      const parts = [];
      if (item.pricing_mode) parts.push(item.pricing_mode === "LARGE_FORMAT" ? "Large format" : "Sheet pricing");
      if (item.sides) parts.push(item.sides === "DUPLEX" ? "Duplex" : "Simplex");
      if (item.color_mode) parts.push(item.color_mode === "BW" ? "B&W" : "Colour");
      return parts.join(" / ");
    }
    function itemTotalDisplay(item) {
      return item.line_total ? formatCurrency(item.line_total, request.value?.shop_currency) : "—";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_IncomingRequestStatusBadge = __nuxt_component_1;
      const _component_UBadge = _sfc_main$1;
      const _component_SectionCard = resolveComponent("SectionCard");
      const _component_UTextarea = _sfc_main$2;
      const _component_SendQuoteForm = resolveComponent("SendQuoteForm");
      const _component_ReviseQuoteForm = resolveComponent("ReviseQuoteForm");
      const _component_ShareActionsBar = __nuxt_component_7;
      const _component_DashboardEmptyState = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: `Request #${unref(id)}`,
        subtitle: unref(request)?.customer_name || "Incoming request"
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
                    name: "i-lucide-calculator",
                    class: "mr-2 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` Shop workspace `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-calculator",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Shop workspace ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}/incoming-requests`,
              variant: "soft",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-left",
                    class: "mr-2 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` Back `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-left",
                      class: "mr-2 h-4 w-4"
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
                    name: "i-lucide-calculator",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Shop workspace ")
                ]),
                _: 1
              }, 8, ["to"]),
              createVNode(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/incoming-requests`,
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-arrow-left",
                    class: "mr-2 h-4 w-4"
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
      if (unref(loading) && !unref(request)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(request)) {
        _push(`<!--[--><div class="flex flex-wrap items-center gap-3">`);
        _push(ssrRenderComponent(_component_IncomingRequestStatusBadge, {
          status: unref(request).status
        }, null, _parent));
        if (unref(latestQuote)) {
          _push(ssrRenderComponent(_component_UBadge, {
            color: unref(latestQuote).status === "accepted" ? "success" : "warning",
            variant: "soft",
            size: "sm"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(sentQuoteStatusLabel(unref(latestQuote).status))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(sentQuoteStatusLabel(unref(latestQuote).status)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        _push(ssrRenderComponent(_component_SectionCard, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col gap-5"${_scopeId}><div class="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(21rem,0.85fr)]"${_scopeId}><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId}> Next action </p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(unref(primaryActionTitle))}</h2><p class="mt-2 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(unref(nextStepCopy))}</p><div class="mt-4 flex flex-wrap gap-2"${_scopeId}>`);
              if (unref(primaryAction)) {
                _push2(ssrRenderComponent(_component_UButton, {
                  to: unref(primaryAction).to,
                  color: unref(primaryAction).color,
                  variant: unref(primaryAction).variant,
                  disabled: unref(primaryAction).disabled,
                  loading: unref(primaryAction).loading,
                  onClick: ($event) => unref(primaryAction).onClick?.()
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UIcon, {
                        name: unref(primaryAction).icon,
                        class: "mr-2 h-4 w-4"
                      }, null, _parent3, _scopeId2));
                      _push3(` ${ssrInterpolate(unref(primaryAction).label)}`);
                    } else {
                      return [
                        createVNode(_component_UIcon, {
                          name: unref(primaryAction).icon,
                          class: "mr-2 h-4 w-4"
                        }, null, 8, ["name"]),
                        createTextVNode(" " + toDisplayString(unref(primaryAction).label), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (unref(draftFileRoute)) {
                _push2(ssrRenderComponent(_component_UButton, {
                  to: unref(draftFileRoute),
                  variant: "soft",
                  color: "neutral"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UIcon, {
                        name: "i-lucide-files",
                        class: "mr-2 h-4 w-4"
                      }, null, _parent3, _scopeId2));
                      _push3(` Open quote draft file `);
                    } else {
                      return [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-files",
                          class: "mr-2 h-4 w-4"
                        }),
                        createTextVNode(" Open quote draft file ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId}> Client-facing outcome </p><p class="mt-2 text-base font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(unref(clientOutcome).title)}</p><p class="mt-2 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(unref(clientOutcome).description)}</p>`);
              if (unref(clientOutcome).helper) {
                _push2(`<p class="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(unref(clientOutcome).helper)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId}> Primary action group </p><div class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                color: "primary",
                class: "justify-center",
                disabled: !unref(canAcceptRequest),
                loading: unref(accepting),
                onClick: onAcceptRequest
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-check",
                      class: "mr-2 h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(` Accept `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-check",
                        class: "mr-2 h-4 w-4"
                      }),
                      createTextVNode(" Accept ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "soft",
                color: "neutral",
                class: "justify-center",
                to: unref(tweakQuoteRoute),
                disabled: !unref(canTweakAndQuote)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-pencil-ruler",
                      class: "mr-2 h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(` Tweak &amp; Quote `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-pencil-ruler",
                        class: "mr-2 h-4 w-4"
                      }),
                      createTextVNode(" Tweak & Quote ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "soft",
                color: "warning",
                class: "justify-center",
                disabled: !unref(canAskQuestion),
                onClick: ($event) => showQuestionForm.value = !unref(showQuestionForm)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-message-square-more",
                      class: "mr-2 h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(` Ask Question `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-message-square-more",
                        class: "mr-2 h-4 w-4"
                      }),
                      createTextVNode(" Ask Question ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "soft",
                color: "error",
                class: "justify-center",
                disabled: !unref(canReject),
                onClick: ($event) => showRejectForm.value = !unref(showRejectForm)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-x",
                      class: "mr-2 h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(` Reject `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-x",
                        class: "mr-2 h-4 w-4"
                      }),
                      createTextVNode(" Reject ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
              if (unref(request).items.length > 1) {
                _push2(`<div class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3 text-sm text-[var(--p-text-muted)]"${_scopeId}> Tweak &amp; Quote preloads the first request line into the existing workbench. Multi-line requests still need a manual review before you send the final quote. </div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(showQuestionForm) && unref(canAskQuestion)) {
                _push2(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-sm font-semibold text-[var(--p-text)]"${_scopeId}>Clarification for the client</p><p class="mt-1 text-sm text-[var(--p-text-muted)]"${_scopeId}> This moves the request to <span class="font-medium"${_scopeId}>awaiting client reply</span>. </p>`);
                _push2(ssrRenderComponent(_component_UTextarea, {
                  modelValue: unref(questionBody),
                  "onUpdate:modelValue": ($event) => isRef(questionBody) ? questionBody.value = $event : null,
                  class: "mt-3",
                  rows: 4,
                  placeholder: "Ask for missing artwork, confirm size, stock, quantity, or delivery details."
                }, null, _parent2, _scopeId));
                _push2(`<div class="mt-3 flex flex-wrap gap-2"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "warning",
                  loading: unref(askingQuestion),
                  onClick: onAskQuestion
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Send question `);
                    } else {
                      return [
                        createTextVNode(" Send question ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UButton, {
                  variant: "ghost",
                  color: "neutral",
                  onClick: ($event) => showQuestionForm.value = false
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Cancel `);
                    } else {
                      return [
                        createTextVNode(" Cancel ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(showRejectForm) && unref(canReject)) {
                _push2(`<div class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-950 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-100"${_scopeId}><p class="text-sm font-semibold"${_scopeId}>Reason for rejection</p><p class="mt-1 text-sm opacity-80"${_scopeId}> The client will see this reason on their request timeline. </p>`);
                _push2(ssrRenderComponent(_component_UTextarea, {
                  modelValue: unref(rejectReason),
                  "onUpdate:modelValue": ($event) => isRef(rejectReason) ? rejectReason.value = $event : null,
                  class: "mt-3",
                  rows: 4,
                  placeholder: "Explain what cannot be produced or what needs to change."
                }, null, _parent2, _scopeId));
                _push2(`<div class="mt-3 flex flex-wrap gap-2"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "error",
                  loading: unref(rejecting),
                  onClick: onRejectRequest
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Reject request `);
                    } else {
                      return [
                        createTextVNode(" Reject request ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UButton, {
                  variant: "ghost",
                  color: "neutral",
                  onClick: ($event) => showRejectForm.value = false
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Cancel `);
                    } else {
                      return [
                        createTextVNode(" Cancel ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-col gap-5" }, [
                  createVNode("div", { class: "grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(21rem,0.85fr)]" }, [
                    createVNode("div", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5" }, [
                      createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, " Next action "),
                      createVNode("h2", { class: "mt-2 text-2xl font-semibold text-[var(--p-text)]" }, toDisplayString(unref(primaryActionTitle)), 1),
                      createVNode("p", { class: "mt-2 text-sm text-[var(--p-text-muted)]" }, toDisplayString(unref(nextStepCopy)), 1),
                      createVNode("div", { class: "mt-4 flex flex-wrap gap-2" }, [
                        unref(primaryAction) ? (openBlock(), createBlock(_component_UButton, {
                          key: 0,
                          to: unref(primaryAction).to,
                          color: unref(primaryAction).color,
                          variant: unref(primaryAction).variant,
                          disabled: unref(primaryAction).disabled,
                          loading: unref(primaryAction).loading,
                          onClick: ($event) => unref(primaryAction).onClick?.()
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UIcon, {
                              name: unref(primaryAction).icon,
                              class: "mr-2 h-4 w-4"
                            }, null, 8, ["name"]),
                            createTextVNode(" " + toDisplayString(unref(primaryAction).label), 1)
                          ]),
                          _: 1
                        }, 8, ["to", "color", "variant", "disabled", "loading", "onClick"])) : createCommentVNode("", true),
                        unref(draftFileRoute) ? (openBlock(), createBlock(_component_UButton, {
                          key: 1,
                          to: unref(draftFileRoute),
                          variant: "soft",
                          color: "neutral"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UIcon, {
                              name: "i-lucide-files",
                              class: "mr-2 h-4 w-4"
                            }),
                            createTextVNode(" Open quote draft file ")
                          ]),
                          _: 1
                        }, 8, ["to"])) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5" }, [
                      createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, " Client-facing outcome "),
                      createVNode("p", { class: "mt-2 text-base font-semibold text-[var(--p-text)]" }, toDisplayString(unref(clientOutcome).title), 1),
                      createVNode("p", { class: "mt-2 text-sm text-[var(--p-text-muted)]" }, toDisplayString(unref(clientOutcome).description), 1),
                      unref(clientOutcome).helper ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--p-text-muted)]"
                      }, toDisplayString(unref(clientOutcome).helper), 1)) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, " Primary action group "),
                    createVNode("div", { class: "mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4" }, [
                      createVNode(_component_UButton, {
                        color: "primary",
                        class: "justify-center",
                        disabled: !unref(canAcceptRequest),
                        loading: unref(accepting),
                        onClick: onAcceptRequest
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-check",
                            class: "mr-2 h-4 w-4"
                          }),
                          createTextVNode(" Accept ")
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"]),
                      createVNode(_component_UButton, {
                        variant: "soft",
                        color: "neutral",
                        class: "justify-center",
                        to: unref(tweakQuoteRoute),
                        disabled: !unref(canTweakAndQuote)
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-pencil-ruler",
                            class: "mr-2 h-4 w-4"
                          }),
                          createTextVNode(" Tweak & Quote ")
                        ]),
                        _: 1
                      }, 8, ["to", "disabled"]),
                      createVNode(_component_UButton, {
                        variant: "soft",
                        color: "warning",
                        class: "justify-center",
                        disabled: !unref(canAskQuestion),
                        onClick: ($event) => showQuestionForm.value = !unref(showQuestionForm)
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-message-square-more",
                            class: "mr-2 h-4 w-4"
                          }),
                          createTextVNode(" Ask Question ")
                        ]),
                        _: 1
                      }, 8, ["disabled", "onClick"]),
                      createVNode(_component_UButton, {
                        variant: "soft",
                        color: "error",
                        class: "justify-center",
                        disabled: !unref(canReject),
                        onClick: ($event) => showRejectForm.value = !unref(showRejectForm)
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-x",
                            class: "mr-2 h-4 w-4"
                          }),
                          createTextVNode(" Reject ")
                        ]),
                        _: 1
                      }, 8, ["disabled", "onClick"])
                    ])
                  ]),
                  unref(request).items.length > 1 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3 text-sm text-[var(--p-text-muted)]"
                  }, " Tweak & Quote preloads the first request line into the existing workbench. Multi-line requests still need a manual review before you send the final quote. ")) : createCommentVNode("", true),
                  unref(showQuestionForm) && unref(canAskQuestion) ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
                  }, [
                    createVNode("p", { class: "text-sm font-semibold text-[var(--p-text)]" }, "Clarification for the client"),
                    createVNode("p", { class: "mt-1 text-sm text-[var(--p-text-muted)]" }, [
                      createTextVNode(" This moves the request to "),
                      createVNode("span", { class: "font-medium" }, "awaiting client reply"),
                      createTextVNode(". ")
                    ]),
                    createVNode(_component_UTextarea, {
                      modelValue: unref(questionBody),
                      "onUpdate:modelValue": ($event) => isRef(questionBody) ? questionBody.value = $event : null,
                      class: "mt-3",
                      rows: 4,
                      placeholder: "Ask for missing artwork, confirm size, stock, quantity, or delivery details."
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode("div", { class: "mt-3 flex flex-wrap gap-2" }, [
                      createVNode(_component_UButton, {
                        color: "warning",
                        loading: unref(askingQuestion),
                        onClick: onAskQuestion
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Send question ")
                        ]),
                        _: 1
                      }, 8, ["loading"]),
                      createVNode(_component_UButton, {
                        variant: "ghost",
                        color: "neutral",
                        onClick: ($event) => showQuestionForm.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Cancel ")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ])
                  ])) : createCommentVNode("", true),
                  unref(showRejectForm) && unref(canReject) ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "rounded-xl border border-red-200 bg-red-50 p-4 text-red-950 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-100"
                  }, [
                    createVNode("p", { class: "text-sm font-semibold" }, "Reason for rejection"),
                    createVNode("p", { class: "mt-1 text-sm opacity-80" }, " The client will see this reason on their request timeline. "),
                    createVNode(_component_UTextarea, {
                      modelValue: unref(rejectReason),
                      "onUpdate:modelValue": ($event) => isRef(rejectReason) ? rejectReason.value = $event : null,
                      class: "mt-3",
                      rows: 4,
                      placeholder: "Explain what cannot be produced or what needs to change."
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode("div", { class: "mt-3 flex flex-wrap gap-2" }, [
                      createVNode(_component_UButton, {
                        color: "error",
                        loading: unref(rejecting),
                        onClick: onRejectRequest
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Reject request ")
                        ]),
                        _: 1
                      }, 8, ["loading"]),
                      createVNode(_component_UButton, {
                        variant: "ghost",
                        color: "neutral",
                        onClick: ($event) => showRejectForm.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Cancel ")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ])
                  ])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(21rem,0.95fr)]"><div class="space-y-6">`);
        _push(ssrRenderComponent(_component_SectionCard, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"${_scopeId}><!--[-->`);
              ssrRenderList(unref(summaryStats), (stat) => {
                _push2(`<article class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(stat.label)}</p><p class="mt-2 text-base font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(stat.value)}</p>`);
                if (stat.helper) {
                  _push2(`<p class="mt-1 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(stat.helper)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</article>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(summaryStats), (stat) => {
                    return openBlock(), createBlock("article", {
                      key: stat.label,
                      class: "rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
                    }, [
                      createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, toDisplayString(stat.label), 1),
                      createVNode("p", { class: "mt-2 text-base font-semibold text-[var(--p-text)]" }, toDisplayString(stat.value), 1),
                      stat.helper ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-sm text-[var(--p-text-muted)]"
                      }, toDisplayString(stat.helper), 1)) : createCommentVNode("", true)
                    ]);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_SectionCard, null, {
          "card-header": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div${_scopeId}><p class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]"${_scopeId}> Request details </p><p class="mt-1 text-sm text-[var(--p-text-muted)]"${_scopeId}> Customer, delivery, and quoted production context. </p></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("p", { class: "text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]" }, " Request details "),
                  createVNode("p", { class: "mt-1 text-sm text-[var(--p-text-muted)]" }, " Customer, delivery, and quoted production context. ")
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]"${_scopeId}><div class="grid gap-3 sm:grid-cols-2"${_scopeId}><!--[-->`);
              ssrRenderList(unref(requesterDetails), (detail) => {
                _push2(`<article class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(detail.label)}</p><p class="mt-2 break-words text-sm font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(detail.value)}</p></article>`);
              });
              _push2(`<!--]--></div><div class="space-y-3"${_scopeId}><article class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId}> Delivery </p><p class="mt-2 text-sm font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(unref(deliverySummary))}</p></article><article class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId}> Client notes </p><p class="mt-2 whitespace-pre-wrap text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(unref(request).notes || "No additional request notes provided.")}</p></article></div></div>`);
            } else {
              return [
                createVNode("div", { class: "grid gap-4 lg:grid-cols-[1.1fr_0.9fr]" }, [
                  createVNode("div", { class: "grid gap-3 sm:grid-cols-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(requesterDetails), (detail) => {
                      return openBlock(), createBlock("article", {
                        key: detail.label,
                        class: "rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
                      }, [
                        createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, toDisplayString(detail.label), 1),
                        createVNode("p", { class: "mt-2 break-words text-sm font-medium text-[var(--p-text)]" }, toDisplayString(detail.value), 1)
                      ]);
                    }), 128))
                  ]),
                  createVNode("div", { class: "space-y-3" }, [
                    createVNode("article", { class: "rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                      createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, " Delivery "),
                      createVNode("p", { class: "mt-2 text-sm font-medium text-[var(--p-text)]" }, toDisplayString(unref(deliverySummary)), 1)
                    ]),
                    createVNode("article", { class: "rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                      createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, " Client notes "),
                      createVNode("p", { class: "mt-2 whitespace-pre-wrap text-sm text-[var(--p-text)]" }, toDisplayString(unref(request).notes || "No additional request notes provided."), 1)
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_SectionCard, null, {
          "card-header": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]"${_scopeId}> Requested items </p><p class="mt-1 text-sm text-[var(--p-text-muted)]"${_scopeId}> Review each line before sending or revising the quote. </p></div><div class="rounded-full border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(unref(request).items.length)} item${ssrInterpolate(unref(request).items.length === 1 ? "" : "s")}</div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]" }, " Requested items "),
                    createVNode("p", { class: "mt-1 text-sm text-[var(--p-text-muted)]" }, " Review each line before sending or revising the quote. ")
                  ]),
                  createVNode("div", { class: "rounded-full border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, toDisplayString(unref(request).items.length) + " item" + toDisplayString(unref(request).items.length === 1 ? "" : "s"), 1)
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(unref(request).items, (item) => {
                _push2(`<article class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><div class="flex flex-wrap items-start justify-between gap-4"${_scopeId}><div class="min-w-0"${_scopeId}><p class="font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.title ?? item.product_name ?? "Product")}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(item.item_type === "CUSTOM" ? "Custom request" : "Catalog product")}</p></div><div class="text-right"${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId}> Qty </p><p class="mt-1 text-sm font-semibold tabular-nums text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.quantity)}</p></div></div><div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"${_scopeId}><div${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId}>Size</p><p class="mt-1 text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(itemSizeLine(item))}</p></div><div${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId}>Stock / paper</p><p class="mt-1 text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(itemPaperLine(item))}</p></div><div${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId}>Finishing</p><p class="mt-1 text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(itemFinishingLine(item))}</p></div><div${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId}>Configuration</p><p class="mt-1 text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(itemModeLine(item) || "Not specified")}</p></div></div><div class="mt-4 flex items-center justify-between border-t border-[var(--p-border)] pt-3"${_scopeId}><span class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId}> Line total </span><span class="text-sm font-semibold tabular-nums text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(itemTotalDisplay(item))}</span></div></article>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-3" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(request).items, (item) => {
                    return openBlock(), createBlock("article", {
                      key: item.id,
                      class: "rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
                    }, [
                      createVNode("div", { class: "flex flex-wrap items-start justify-between gap-4" }, [
                        createVNode("div", { class: "min-w-0" }, [
                          createVNode("p", { class: "font-semibold text-[var(--p-text)]" }, toDisplayString(item.title ?? item.product_name ?? "Product"), 1),
                          createVNode("p", { class: "mt-1 text-sm text-[var(--p-text-muted)]" }, toDisplayString(item.item_type === "CUSTOM" ? "Custom request" : "Catalog product"), 1)
                        ]),
                        createVNode("div", { class: "text-right" }, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, " Qty "),
                          createVNode("p", { class: "mt-1 text-sm font-semibold tabular-nums text-[var(--p-text)]" }, toDisplayString(item.quantity), 1)
                        ])
                      ]),
                      createVNode("div", { class: "mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Size"),
                          createVNode("p", { class: "mt-1 text-sm text-[var(--p-text)]" }, toDisplayString(itemSizeLine(item)), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Stock / paper"),
                          createVNode("p", { class: "mt-1 text-sm text-[var(--p-text)]" }, toDisplayString(itemPaperLine(item)), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Finishing"),
                          createVNode("p", { class: "mt-1 text-sm text-[var(--p-text)]" }, toDisplayString(itemFinishingLine(item)), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Configuration"),
                          createVNode("p", { class: "mt-1 text-sm text-[var(--p-text)]" }, toDisplayString(itemModeLine(item) || "Not specified"), 1)
                        ])
                      ]),
                      createVNode("div", { class: "mt-4 flex items-center justify-between border-t border-[var(--p-border)] pt-3" }, [
                        createVNode("span", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, " Line total "),
                        createVNode("span", { class: "text-sm font-semibold tabular-nums text-[var(--p-text)]" }, toDisplayString(itemTotalDisplay(item)), 1)
                      ])
                    ]);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(request).attachments?.length) {
          _push(ssrRenderComponent(_component_SectionCard, null, {
            "card-header": withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div${_scopeId}><p class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]"${_scopeId}> Attachments </p><p class="mt-1 text-sm text-[var(--p-text-muted)]"${_scopeId}> Files supplied with the request. </p></div>`);
              } else {
                return [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]" }, " Attachments "),
                    createVNode("p", { class: "mt-1 text-sm text-[var(--p-text-muted)]" }, " Files supplied with the request. ")
                  ])
                ];
              }
            }),
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="grid gap-3 md:grid-cols-2"${_scopeId}><!--[-->`);
                ssrRenderList(unref(request).attachments, (att) => {
                  _push2(`<a${ssrRenderAttr("href", att.file)} target="_blank" rel="noopener noreferrer" class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 transition-colors hover:border-flamingo-300"${_scopeId}><p class="text-sm font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(att.name || "Attachment")}</p><p class="mt-1 text-xs text-[var(--p-text-muted)]"${_scopeId}> Added ${ssrInterpolate(unref(formatDate)(att.created_at))}</p></a>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                return [
                  createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(request).attachments, (att) => {
                      return openBlock(), createBlock("a", {
                        key: att.id,
                        href: att.file,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        class: "rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 transition-colors hover:border-flamingo-300"
                      }, [
                        createVNode("p", { class: "text-sm font-semibold text-[var(--p-text)]" }, toDisplayString(att.name || "Attachment"), 1),
                        createVNode("p", { class: "mt-1 text-xs text-[var(--p-text-muted)]" }, " Added " + toDisplayString(unref(formatDate)(att.created_at)), 1)
                      ], 8, ["href"]);
                    }), 128))
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-6">`);
        _push(ssrRenderComponent(_component_SectionCard, null, {
          "card-header": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div${_scopeId}><p class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]"${_scopeId}> Quote workspace </p><p class="mt-1 text-sm text-[var(--p-text-muted)]"${_scopeId}> Keep the request visible while you revise, send, and share the quote. </p></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("p", { class: "text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]" }, " Quote workspace "),
                  createVNode("p", { class: "mt-1 text-sm text-[var(--p-text-muted)]" }, " Keep the request visible while you revise, send, and share the quote. ")
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-4"${_scopeId}><div class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><dl class="space-y-2 text-sm"${_scopeId}><div class="flex items-start justify-between gap-4"${_scopeId}><dt class="text-[var(--p-text-muted)]"${_scopeId}>Request status</dt><dd class="font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(statusLabel(unref(request).status))}</dd></div><div class="flex items-start justify-between gap-4"${_scopeId}><dt class="text-[var(--p-text-muted)]"${_scopeId}>Latest quote</dt><dd class="font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(unref(latestQuoteDisplay))}</dd></div><div class="flex items-start justify-between gap-4"${_scopeId}><dt class="text-[var(--p-text-muted)]"${_scopeId}>Turnaround</dt><dd class="font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(unref(turnaroundDisplay))}</dd></div><div class="flex items-start justify-between gap-4"${_scopeId}><dt class="text-[var(--p-text-muted)]"${_scopeId}>Revisions</dt><dd class="font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(unref(revisionCount))}</dd></div></dl></div>`);
              if (unref(draftFileRoute)) {
                _push2(`<div class="rounded-lg border border-primary-200 bg-primary-50 p-4 text-primary-900 dark:border-primary-900/70 dark:bg-primary-950/20 dark:text-primary-100"${_scopeId}><div class="flex flex-wrap items-center justify-between gap-3"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold"${_scopeId}>Quote draft file linked</p><p class="mt-1 text-sm opacity-80"${_scopeId}> Open the grouped draft workspace for this client before revising or sending. </p></div>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  to: unref(draftFileRoute),
                  color: "primary",
                  variant: "soft"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UIcon, {
                        name: "i-lucide-files",
                        class: "mr-2 h-4 w-4"
                      }, null, _parent3, _scopeId2));
                      _push3(` Open draft file `);
                    } else {
                      return [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-files",
                          class: "mr-2 h-4 w-4"
                        }),
                        createTextVNode(" Open draft file ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(canSendQuote)) {
                _push2(`<div${_scopeId}>`);
                if (unref(showSendForm)) {
                  _push2(ssrRenderComponent(_component_SendQuoteForm, {
                    loading: unref(sending),
                    onSubmit: onSendQuote,
                    onCancel: ($event) => showSendForm.value = false
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(_component_UButton, {
                    color: "primary",
                    block: "",
                    onClick: ($event) => showSendForm.value = true
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(_component_UIcon, {
                          name: "i-lucide-send",
                          class: "mr-2 h-4 w-4"
                        }, null, _parent3, _scopeId2));
                        _push3(` Send Quote `);
                      } else {
                        return [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-send",
                            class: "mr-2 h-4 w-4"
                          }),
                          createTextVNode(" Send Quote ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(hasQuoteActions)) {
                _push2(`<div class="grid gap-2"${_scopeId}>`);
                if (unref(latestQuote)) {
                  _push2(ssrRenderComponent(_component_UButton, {
                    to: `/dashboard/shops/${unref(slug)}/sent-quotes/${unref(latestQuote).id}`,
                    variant: "soft",
                    block: ""
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(_component_UIcon, {
                          name: "i-lucide-folder-open",
                          class: "mr-2 h-4 w-4"
                        }, null, _parent3, _scopeId2));
                        _push3(` Open Draft `);
                      } else {
                        return [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-folder-open",
                            class: "mr-2 h-4 w-4"
                          }),
                          createTextVNode(" Open Draft ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                if (unref(showReviseForm) && unref(canRevise)) {
                  _push2(ssrRenderComponent(_component_ReviseQuoteForm, {
                    loading: unref(revising),
                    "initial-total": unref(latestQuote)?.total,
                    "initial-note": unref(latestQuote)?.note ?? "",
                    "initial-turnaround": unref(latestQuote)?.turnaround_hours ?? unref(latestQuote)?.turnaround_days ?? null,
                    onSubmit: onReviseQuote,
                    onCancel: ($event) => showReviseForm.value = false
                  }, null, _parent2, _scopeId));
                } else if (unref(canRevise)) {
                  _push2(ssrRenderComponent(_component_UButton, {
                    variant: "soft",
                    block: "",
                    onClick: ($event) => showReviseForm.value = true
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(_component_UIcon, {
                          name: "i-lucide-refresh-cw",
                          class: "mr-2 h-4 w-4"
                        }, null, _parent3, _scopeId2));
                        _push3(` Revise Quote `);
                      } else {
                        return [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-refresh-cw",
                            class: "mr-2 h-4 w-4"
                          }),
                          createTextVNode(" Revise Quote ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                if (unref(latestQuote)) {
                  _push2(ssrRenderComponent(_component_UButton, {
                    to: `/dashboard/shops/${unref(slug)}/sent-quotes/${unref(latestQuote).id}`,
                    variant: "soft",
                    block: ""
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(_component_UIcon, {
                          name: "i-lucide-send",
                          class: "mr-2 h-4 w-4"
                        }, null, _parent3, _scopeId2));
                        _push3(` Send Quote `);
                      } else {
                        return [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-send",
                            class: "mr-2 h-4 w-4"
                          }),
                          createTextVNode(" Send Quote ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                if (unref(request).whatsapp_summary) {
                  _push2(ssrRenderComponent(_component_ShareActionsBar, {
                    "summary-text": unref(request).whatsapp_summary,
                    "copy-label": "Copy Summary",
                    attachments: unref(request).attachments
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                if (unref(latestQuote)) {
                  _push2(ssrRenderComponent(_component_UButton, {
                    variant: "soft",
                    block: "",
                    onClick: downloadQuotePdf
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(_component_UIcon, {
                          name: "i-lucide-download",
                          class: "mr-2 h-4 w-4"
                        }, null, _parent3, _scopeId2));
                        _push3(` Download PDF `);
                      } else {
                        return [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-download",
                            class: "mr-2 h-4 w-4"
                          }),
                          createTextVNode(" Download PDF ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("div", { class: "rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                    createVNode("dl", { class: "space-y-2 text-sm" }, [
                      createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                        createVNode("dt", { class: "text-[var(--p-text-muted)]" }, "Request status"),
                        createVNode("dd", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(statusLabel(unref(request).status)), 1)
                      ]),
                      createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                        createVNode("dt", { class: "text-[var(--p-text-muted)]" }, "Latest quote"),
                        createVNode("dd", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(unref(latestQuoteDisplay)), 1)
                      ]),
                      createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                        createVNode("dt", { class: "text-[var(--p-text-muted)]" }, "Turnaround"),
                        createVNode("dd", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(unref(turnaroundDisplay)), 1)
                      ]),
                      createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                        createVNode("dt", { class: "text-[var(--p-text-muted)]" }, "Revisions"),
                        createVNode("dd", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(unref(revisionCount)), 1)
                      ])
                    ])
                  ]),
                  unref(draftFileRoute) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "rounded-lg border border-primary-200 bg-primary-50 p-4 text-primary-900 dark:border-primary-900/70 dark:bg-primary-950/20 dark:text-primary-100"
                  }, [
                    createVNode("div", { class: "flex flex-wrap items-center justify-between gap-3" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm font-semibold" }, "Quote draft file linked"),
                        createVNode("p", { class: "mt-1 text-sm opacity-80" }, " Open the grouped draft workspace for this client before revising or sending. ")
                      ]),
                      createVNode(_component_UButton, {
                        to: unref(draftFileRoute),
                        color: "primary",
                        variant: "soft"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-files",
                            class: "mr-2 h-4 w-4"
                          }),
                          createTextVNode(" Open draft file ")
                        ]),
                        _: 1
                      }, 8, ["to"])
                    ])
                  ])) : createCommentVNode("", true),
                  unref(canSendQuote) ? (openBlock(), createBlock("div", { key: 1 }, [
                    unref(showSendForm) ? (openBlock(), createBlock(_component_SendQuoteForm, {
                      key: 0,
                      loading: unref(sending),
                      onSubmit: onSendQuote,
                      onCancel: ($event) => showSendForm.value = false
                    }, null, 8, ["loading", "onCancel"])) : (openBlock(), createBlock(_component_UButton, {
                      key: 1,
                      color: "primary",
                      block: "",
                      onClick: ($event) => showSendForm.value = true
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-send",
                          class: "mr-2 h-4 w-4"
                        }),
                        createTextVNode(" Send Quote ")
                      ]),
                      _: 1
                    }, 8, ["onClick"]))
                  ])) : createCommentVNode("", true),
                  unref(hasQuoteActions) ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "grid gap-2"
                  }, [
                    unref(latestQuote) ? (openBlock(), createBlock(_component_UButton, {
                      key: 0,
                      to: `/dashboard/shops/${unref(slug)}/sent-quotes/${unref(latestQuote).id}`,
                      variant: "soft",
                      block: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-folder-open",
                          class: "mr-2 h-4 w-4"
                        }),
                        createTextVNode(" Open Draft ")
                      ]),
                      _: 1
                    }, 8, ["to"])) : createCommentVNode("", true),
                    unref(showReviseForm) && unref(canRevise) ? (openBlock(), createBlock(_component_ReviseQuoteForm, {
                      key: 1,
                      loading: unref(revising),
                      "initial-total": unref(latestQuote)?.total,
                      "initial-note": unref(latestQuote)?.note ?? "",
                      "initial-turnaround": unref(latestQuote)?.turnaround_hours ?? unref(latestQuote)?.turnaround_days ?? null,
                      onSubmit: onReviseQuote,
                      onCancel: ($event) => showReviseForm.value = false
                    }, null, 8, ["loading", "initial-total", "initial-note", "initial-turnaround", "onCancel"])) : unref(canRevise) ? (openBlock(), createBlock(_component_UButton, {
                      key: 2,
                      variant: "soft",
                      block: "",
                      onClick: ($event) => showReviseForm.value = true
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-refresh-cw",
                          class: "mr-2 h-4 w-4"
                        }),
                        createTextVNode(" Revise Quote ")
                      ]),
                      _: 1
                    }, 8, ["onClick"])) : createCommentVNode("", true),
                    unref(latestQuote) ? (openBlock(), createBlock(_component_UButton, {
                      key: 3,
                      to: `/dashboard/shops/${unref(slug)}/sent-quotes/${unref(latestQuote).id}`,
                      variant: "soft",
                      block: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-send",
                          class: "mr-2 h-4 w-4"
                        }),
                        createTextVNode(" Send Quote ")
                      ]),
                      _: 1
                    }, 8, ["to"])) : createCommentVNode("", true),
                    unref(request).whatsapp_summary ? (openBlock(), createBlock(_component_ShareActionsBar, {
                      key: 4,
                      "summary-text": unref(request).whatsapp_summary,
                      "copy-label": "Copy Summary",
                      attachments: unref(request).attachments
                    }, null, 8, ["summary-text", "attachments"])) : createCommentVNode("", true),
                    unref(latestQuote) ? (openBlock(), createBlock(_component_UButton, {
                      key: 5,
                      variant: "soft",
                      block: "",
                      onClick: downloadQuotePdf
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-download",
                          class: "mr-2 h-4 w-4"
                        }),
                        createTextVNode(" Download PDF ")
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_SectionCard, null, {
          "card-header": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div${_scopeId}><p class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]"${_scopeId}> Timeline &amp; history </p><p class="mt-1 text-sm text-[var(--p-text-muted)]"${_scopeId}> This is what the client can track from their side. </p></div>`);
            } else {
              return [
                createVNode("div", null, [
                  createVNode("p", { class: "text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]" }, " Timeline & history "),
                  createVNode("p", { class: "mt-1 text-sm text-[var(--p-text-muted)]" }, " This is what the client can track from their side. ")
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(unref(timelineMessages), (message) => {
                _push2(`<article class="relative rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 pl-6"${_scopeId}><span class="${ssrRenderClass([timelineDotClass(message), "absolute left-3 top-5 h-2.5 w-2.5 rounded-full"])}"${_scopeId}></span><div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(timelineTitle(message))}</p><p class="text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(timelineMeta(message))}</p></div><span class="text-xs text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(unref(formatDate)(message.created_at))}</span></div>`);
                if (message.body) {
                  _push2(`<p class="mt-3 whitespace-pre-wrap text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(message.body)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</article>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-3" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(timelineMessages), (message) => {
                    return openBlock(), createBlock("article", {
                      key: message.id,
                      class: "relative rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 pl-6"
                    }, [
                      createVNode("span", {
                        class: ["absolute left-3 top-5 h-2.5 w-2.5 rounded-full", timelineDotClass(message)]
                      }, null, 2),
                      createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "text-sm font-semibold text-[var(--p-text)]" }, toDisplayString(timelineTitle(message)), 1),
                          createVNode("p", { class: "text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, toDisplayString(timelineMeta(message)), 1)
                        ]),
                        createVNode("span", { class: "text-xs text-[var(--p-text-muted)]" }, toDisplayString(unref(formatDate)(message.created_at)), 1)
                      ]),
                      message.body ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-3 whitespace-pre-wrap text-sm text-[var(--p-text)]"
                      }, toDisplayString(message.body), 1)) : createCommentVNode("", true)
                    ]);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><!--]-->`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: "Request not found",
          description: "This incoming request may have been removed or you don't have access.",
          icon: "i-lucide-file-question"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/incoming-requests`
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Incoming Requests`);
                  } else {
                    return [
                      createTextVNode("Incoming Requests")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  to: `/dashboard/shops/${unref(slug)}/incoming-requests`
                }, {
                  default: withCtx(() => [
                    createTextVNode("Incoming Requests")
                  ]),
                  _: 1
                }, 8, ["to"])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/incoming-requests/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CWjcvzHi.mjs.map
