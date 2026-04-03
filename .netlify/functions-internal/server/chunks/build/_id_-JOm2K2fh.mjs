import { f as useRoute, b as _sfc_main$9, a as _sfc_main$f, _ as __nuxt_component_1, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$1 } from './Alert-BQjQ5uNh.mjs';
import { _ as _sfc_main$2 } from './Badge-Dn_IFHF_.mjs';
import { _ as _sfc_main$3 } from './Textarea-DUPwu95P.mjs';
import { _ as __nuxt_component_7 } from './ShareActionsBar-DdjU3rhd.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as useActivityBadgesStore } from './activityBadges-B_bMwbEc.mjs';
import { u as useQuoteDraftStore } from './quoteDraft-DCmPR0Tc.mjs';
import { a as formatDate } from './formatters-FW8HHCjc.mjs';
import { u as useQuoteRequests } from './useQuoteRequests-DE2LlyRK.mjs';
import { u as useNotifications } from './useNotifications-BB49WIYK.mjs';
import { u as useNotification } from './useNotification-DxMfmZhF.mjs';
import { u as useCurrencyFormatter } from './useCurrencyFormatter-tIWAo1tq.mjs';
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
import './interval-DiSDr_Za.mjs';
import './useApi-Cs2GTEbX.mjs';
import './quoteDraft-5mvcgeM-.mjs';
import './browser-storage-CN-SIF_V.mjs';
import './quoteInbox-BZeZ2Gtb.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const id = computed(() => parseInt(route.params.id, 10));
    const quoteRequests = useQuoteRequests();
    const quoteDraftStore = useQuoteDraftStore();
    useNotifications();
    const activityBadgesStore = useActivityBadgesStore();
    const notification = useNotification();
    const request = ref(null);
    const loading = ref(true);
    const accepting = ref(false);
    const cancelling = ref(false);
    const submitting = ref(false);
    const replying = ref(false);
    const replyBody = ref("");
    const { formatMoney } = useCurrencyFormatter(computed(() => request.value?.shop_currency ?? null));
    function goToDraft() {
      if (request.value?.shop_slug) {
        quoteDraftStore.setShop(request.value.shop_slug);
        navigateTo(`/quote-draft?shop=${request.value.shop_slug}`);
      }
    }
    const statusLabels = {
      draft: "Draft",
      submitted: "Submitted",
      awaiting_shop_action: "Shop preparing quote",
      awaiting_client_reply: "Awaiting your reply",
      viewed: "Viewed",
      quoted: "Quote received",
      accepted: "Accepted by shop",
      rejected: "Rejected",
      expired: "Expired",
      closed: "Closed",
      cancelled: "Cancelled"
    };
    const statusLabel = computed(
      () => request.value ? statusLabels[request.value.status] ?? request.value.status : ""
    );
    const statusBadgeColor = computed(() => {
      const s = request.value?.status;
      if (s === "quoted" || s === "awaiting_client_reply") return "warning";
      if (s === "accepted" || s === "awaiting_shop_action") return "primary";
      if (s === "rejected" || s === "expired" || s === "cancelled" || s === "closed") return "error";
      return "neutral";
    });
    const latestQuote = computed(() => request.value?.latest_sent_quote ?? null);
    const quoteAcceptedByClient = computed(() => latestQuote.value?.status === "accepted");
    const canAccept = computed(
      () => request.value?.status === "quoted" && request.value.latest_sent_quote && ["sent", "revised"].includes(request.value.latest_sent_quote.status)
    );
    const canReply = computed(() => request.value?.status === "awaiting_client_reply");
    const canCancel = computed(
      () => request.value != null && !quoteAcceptedByClient.value && ["draft", "submitted", "viewed", "accepted", "awaiting_shop_action", "awaiting_client_reply", "quoted"].includes(request.value.status)
    );
    const canSubmit = computed(() => request.value?.status === "draft");
    const timelineMessages = computed(() => request.value?.messages ?? []);
    const statusAlert = computed(() => {
      if (!request.value) {
        return {
          color: "neutral",
          icon: "i-lucide-file-search",
          title: "Request",
          description: ""
        };
      }
      if (quoteAcceptedByClient.value) {
        return {
          color: "success",
          icon: "i-lucide-check-circle",
          title: "Quote accepted",
          description: "You accepted the latest quote. The shop can now continue with production planning."
        };
      }
      switch (request.value.status) {
        case "draft":
          return {
            color: "neutral",
            icon: "i-lucide-edit",
            title: "Draft request",
            description: "Complete your request and submit it to the shop."
          };
        case "submitted":
        case "viewed":
          return {
            color: "primary",
            icon: "i-lucide-clock",
            title: "Submitted to shop",
            description: "The shop has your request and has not finished a quote yet."
          };
        case "accepted":
        case "awaiting_shop_action":
          return {
            color: "primary",
            icon: "i-lucide-loader-circle",
            title: "Shop is preparing your quote",
            description: "The shop accepted the request and is working on the pricing details."
          };
        case "awaiting_client_reply":
          return {
            color: "warning",
            icon: "i-lucide-message-circle-question",
            title: "Reply needed",
            description: "The shop asked a question before it can finish the quote."
          };
        case "quoted":
          return {
            color: "success",
            icon: "i-lucide-badge-dollar-sign",
            title: "Quote received",
            description: "Review the latest quote, turnaround, and notes from the shop."
          };
        case "rejected":
          return {
            color: "error",
            icon: "i-lucide-x-circle",
            title: "Request rejected",
            description: "The shop rejected the request. Check the timeline for the reason."
          };
        case "cancelled":
          return {
            color: "neutral",
            icon: "i-lucide-ban",
            title: "Request cancelled",
            description: "You cancelled this request."
          };
        default:
          return {
            color: "neutral",
            icon: "i-lucide-file-search",
            title: statusLabel.value,
            description: "Review the latest timeline entry for details."
          };
      }
    });
    async function onAccept() {
      const sq = request.value?.latest_sent_quote;
      if (!sq || accepting.value) return;
      accepting.value = true;
      try {
        request.value = await quoteRequests.accept(id.value, sq.id);
        await activityBadgesStore.fetchSummary();
        notification.success("Quote accepted");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to accept quote");
      } finally {
        accepting.value = false;
      }
    }
    async function onReply() {
      if (!request.value || replying.value) return;
      if (!replyBody.value.trim()) {
        notification.error("Add your reply before sending");
        return;
      }
      replying.value = true;
      try {
        request.value = await quoteRequests.reply(id.value, { body: replyBody.value.trim() });
        replyBody.value = "";
        await activityBadgesStore.fetchSummary();
        notification.success("Reply sent to shop");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to send reply");
      } finally {
        replying.value = false;
      }
    }
    async function onSubmit() {
      if (!request.value || submitting.value) return;
      submitting.value = true;
      try {
        request.value = await quoteRequests.submit(id.value);
        await activityBadgesStore.fetchSummary();
        notification.success("Request sent to the shop");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to submit");
      } finally {
        submitting.value = false;
      }
    }
    async function onCancel() {
      if (!request.value || cancelling.value) return;
      if (!confirm("Cancel this request?")) return;
      cancelling.value = true;
      try {
        request.value = await quoteRequests.cancel(id.value);
        await activityBadgesStore.fetchSummary();
        notification.success("Request cancelled");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to cancel");
      } finally {
        cancelling.value = false;
      }
    }
    function quoteStatusLabel(status) {
      const labels = {
        sent: "Quote sent",
        revised: "Quote revised",
        accepted: "You accepted this quote"
      };
      return labels[status] ?? status;
    }
    function timelineTitle(message) {
      const labels = {
        status: "Status update",
        question: "Question from shop",
        reply: "Your reply",
        rejection: "Request rejected",
        quote: "Quote update",
        note: "Note"
      };
      return labels[message.message_kind] ?? "Update";
    }
    function timelineMeta(message) {
      const role = message.sender_role === "shop" ? "Shop" : message.sender_role === "client" ? "You" : "System";
      const sender = message.sender_name ? ` / ${message.sender_name}` : "";
      return `${role}${sender}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_UAlert = _sfc_main$1;
      const _component_UBadge = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_1;
      const _component_UTextarea = _sfc_main$3;
      const _component_ShareActionsBar = __nuxt_component_7;
      const _component_DashboardEmptyState = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)]" }, _attrs))}><div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"><div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl font-bold text-[var(--p-text)]"> Request #${ssrInterpolate(unref(id))}</h1>`);
      if (unref(request)) {
        _push(`<p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(request).shop_name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/quotes",
        variant: "outline",
        color: "neutral"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-left",
              class: "mr-2 h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` My Requests `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "mr-2 h-4 w-4"
              }),
              createTextVNode(" My Requests ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loading) && !unref(request)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(request)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_UAlert, {
          color: unref(statusAlert).color,
          variant: "soft",
          icon: unref(statusAlert).icon,
          title: unref(statusAlert).title,
          description: unref(statusAlert).description,
          class: "mb-6"
        }, null, _parent));
        _push(`<div class="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.9fr)]"><div class="space-y-6"><div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] overflow-hidden"><div class="border-b border-[var(--p-border)] px-6 py-4"><div class="flex flex-wrap items-start justify-between gap-4"><div><h2 class="font-semibold text-[var(--p-text)]">${ssrInterpolate(unref(request).shop_name)}</h2><div class="mt-2 flex flex-wrap items-center gap-2">`);
        _push(ssrRenderComponent(_component_UBadge, {
          color: unref(statusBadgeColor),
          variant: "soft",
          size: "sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(statusLabel))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(statusLabel)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(latestQuote)) {
          _push(ssrRenderComponent(_component_UBadge, {
            color: unref(latestQuote).status === "accepted" ? "success" : "warning",
            variant: "soft",
            size: "sm"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(quoteStatusLabel(unref(latestQuote).status))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(quoteStatusLabel(unref(latestQuote).status)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (unref(request).shop_slug) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/shops/${unref(request).shop_slug}`,
            class: "text-sm font-medium text-flamingo-600 hover:underline dark:text-flamingo-400"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View shop `);
              } else {
                return [
                  createTextVNode(" View shop ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><ul class="divide-y divide-[var(--p-border)]"><!--[-->`);
        ssrRenderList(unref(request).items, (item) => {
          _push(`<li class="flex items-center justify-between gap-4 px-6 py-4"><div class="min-w-0 flex-1"><p class="font-medium text-[var(--p-text)]">${ssrInterpolate(item.title ?? item.product_name ?? "Product")}</p><p class="text-sm text-[var(--p-text-muted)]"> Qty: ${ssrInterpolate(item.quantity)} `);
          if (item.spec_text || item.chosen_width_mm && item.chosen_height_mm) {
            _push(`<!--[--> · ${ssrInterpolate(item.spec_text || `${item.chosen_width_mm}×${item.chosen_height_mm}mm`)}<!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p></div>`);
          if (item.line_total) {
            _push(`<div class="shrink-0 text-sm font-medium tabular-nums text-[var(--p-text)]">${ssrInterpolate(unref(formatMoney)(item.line_total, unref(request).shop_currency))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul>`);
        if (unref(latestQuote)?.total) {
          _push(`<div class="border-t border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-6 py-4"><div class="flex justify-between font-semibold text-[var(--p-text)]"><span>Quote total</span><span class="tabular-nums">${ssrInterpolate(unref(formatMoney)(unref(latestQuote).total, unref(request).shop_currency))}</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(latestQuote)) {
          _push(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6"><h3 class="text-sm font-medium text-[var(--p-text-muted)]">Quote from shop</h3><div class="mt-3 space-y-2 text-sm text-[var(--p-text)]"><p class="flex items-center gap-2">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-badge-dollar-sign",
            class: "h-4 w-4 shrink-0"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(latestQuote).total ? unref(formatMoney)(unref(latestQuote).total, unref(request).shop_currency) : "Total pending")}</p>`);
          if (unref(latestQuote).turnaround_hours || unref(latestQuote).human_ready_text) {
            _push(`<p class="flex items-center gap-2">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-clock",
              class: "h-4 w-4 shrink-0"
            }, null, _parent));
            _push(` ${ssrInterpolate(unref(latestQuote).human_ready_text || `${unref(latestQuote).turnaround_hours} working hour${unref(latestQuote).turnaround_hours === 1 ? "" : "s"}`)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(latestQuote).note) {
            _push(`<p class="whitespace-pre-wrap text-[var(--p-text-muted)]">${ssrInterpolate(unref(latestQuote).note)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6"><div class="flex items-center justify-between gap-4"><div><h3 class="text-base font-semibold text-[var(--p-text)]">Timeline</h3><p class="mt-1 text-sm text-[var(--p-text-muted)]"> Follow what the shop has done and what is waiting on you. </p></div></div><div class="mt-4 space-y-3"><!--[-->`);
        ssrRenderList(unref(timelineMessages), (message) => {
          _push(`<article class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><div class="flex items-start justify-between gap-3"><div><p class="text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(timelineTitle(message))}</p><p class="text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]">${ssrInterpolate(timelineMeta(message))}</p></div><span class="text-xs text-[var(--p-text-muted)]">${ssrInterpolate(unref(formatDate)(message.created_at))}</span></div>`);
          if (message.body) {
            _push(`<p class="mt-3 whitespace-pre-wrap text-sm text-[var(--p-text)]">${ssrInterpolate(message.body)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</article>`);
        });
        _push(`<!--]--></div></div></div><div class="space-y-6"><div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6"><h3 class="text-sm font-medium text-[var(--p-text-muted)]">Actions</h3><div class="mt-4 space-y-3">`);
        if (unref(canSubmit)) {
          _push(ssrRenderComponent(_component_UButton, {
            color: "primary",
            block: "",
            loading: unref(submitting),
            onClick: onSubmit
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-send",
                  class: "mr-2 h-4 w-4"
                }, null, _parent2, _scopeId));
                _push2(` Submit request `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-send",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Submit request ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(canAccept)) {
          _push(ssrRenderComponent(_component_UButton, {
            color: "primary",
            block: "",
            loading: unref(accepting),
            onClick: onAccept
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-check",
                  class: "mr-2 h-4 w-4"
                }, null, _parent2, _scopeId));
                _push2(` Accept quote `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-check",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Accept quote ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(request).status === "draft" && unref(request).shop_slug) {
          _push(ssrRenderComponent(_component_UButton, {
            variant: "outline",
            block: "",
            onClick: goToDraft
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-edit",
                  class: "mr-2 h-4 w-4"
                }, null, _parent2, _scopeId));
                _push2(` Open in requests workspace `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-edit",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Open in requests workspace ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(canReply)) {
          _push(`<div class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-sm font-semibold text-[var(--p-text)]">Reply to shop</p><p class="mt-1 text-sm text-[var(--p-text-muted)]"> Your reply moves the request back to the shop. </p>`);
          _push(ssrRenderComponent(_component_UTextarea, {
            modelValue: unref(replyBody),
            "onUpdate:modelValue": ($event) => isRef(replyBody) ? replyBody.value = $event : null,
            class: "mt-3",
            rows: 4,
            placeholder: "Answer the shop's question here."
          }, null, _parent));
          _push(`<div class="mt-3 flex flex-wrap gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            color: "warning",
            loading: unref(replying),
            onClick: onReply
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Send reply `);
              } else {
                return [
                  createTextVNode(" Send reply ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(canCancel)) {
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            color: "error",
            block: "",
            loading: unref(cancelling),
            onClick: onCancel
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-x",
                  class: "mr-2 h-4 w-4"
                }, null, _parent2, _scopeId));
                _push2(` Cancel request `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-x",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Cancel request ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (unref(request).whatsapp_summary) {
          _push(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4"><p class="text-sm font-medium text-[var(--p-text-muted)]">Share request</p><div class="mt-3">`);
          _push(ssrRenderComponent(_component_ShareActionsBar, {
            "summary-text": unref(request).whatsapp_summary,
            "copy-label": "Copy summary",
            attachments: unref(request).attachments
          }, null, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><!--]-->`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: "Request not found",
          description: "This request may have been removed or you don't have access.",
          icon: "i-lucide-file-question"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, { to: "/quotes" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`My Requests`);
                  } else {
                    return [
                      createTextVNode("My Requests")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, { to: "/quotes" }, {
                  default: withCtx(() => [
                    createTextVNode("My Requests")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quotes/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-JOm2K2fh.mjs.map
