import { g as useRoute, d as _sfc_main$9, a as _sfc_main$f, _ as __nuxt_component_3$1, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$1 } from './Alert-CRX5veBl.mjs';
import { _ as _sfc_main$2 } from './Badge-xP9ZTQag.mjs';
import { _ as __nuxt_component_5 } from './ShareActionsBar-C5D7J46A.mjs';
import { _ as __nuxt_component_5$1 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { b as formatKES } from './formatters-C39vX7Ji.mjs';
import { u as useQuoteDraftStore } from './quoteDraft-CE4LeCAM.mjs';
import { u as useQuoteRequests } from './useQuoteRequests-vIoF49x0.mjs';
import { u as useNotification } from './useNotification-DukejKDK.mjs';
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
import './quoteMessage-Bmp83pcs.mjs';
import './quoteDraft-BhhNn4oA.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const id = computed(() => parseInt(route.params.id, 10));
    const quoteRequests = useQuoteRequests();
    const quoteDraftStore = useQuoteDraftStore();
    const notification = useNotification();
    function goToDraft() {
      if (request.value?.shop_slug) {
        quoteDraftStore.setShop(request.value.shop_slug);
        navigateTo(`/quote-draft?shop=${request.value.shop_slug}`);
      }
    }
    const request = ref(null);
    const loading = ref(true);
    const accepting = ref(false);
    const cancelling = ref(false);
    const submitting = ref(false);
    const statusLabels = {
      draft: "Draft",
      submitted: "Submitted",
      viewed: "Viewed",
      quoted: "Quoted",
      accepted: "Accepted",
      closed: "Closed",
      cancelled: "Cancelled"
    };
    const statusLabel = computed(
      () => request.value ? statusLabels[request.value.status] ?? request.value.status : ""
    );
    const statusBadgeColor = computed(() => {
      const s = request.value?.status;
      if (s === "quoted") return "warning";
      if (s === "accepted") return "success";
      if (s === "cancelled" || s === "closed") return "error";
      return "neutral";
    });
    const latestQuote = computed(() => request.value?.latest_sent_quote ?? null);
    const canAccept = computed(
      () => request.value?.status === "quoted" && request.value.latest_sent_quote && ["sent", "revised"].includes(request.value.latest_sent_quote.status)
    );
    const canCancel = computed(
      () => request.value && ["draft", "submitted", "viewed", "quoted"].includes(request.value.status)
    );
    const canSubmit = computed(() => request.value?.status === "draft");
    async function onAccept() {
      const sq = request.value?.latest_sent_quote;
      if (!sq || accepting.value) return;
      accepting.value = true;
      try {
        request.value = await quoteRequests.accept(id.value, sq.id);
        notification.success("Quote accepted");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to accept");
      } finally {
        accepting.value = false;
      }
    }
    async function onSubmit() {
      if (!request.value || submitting.value) return;
      submitting.value = true;
      try {
        request.value = await quoteRequests.submit(id.value);
        notification.success("Request sent to the shop");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to submit");
      } finally {
        submitting.value = false;
      }
    }
    async function onCancel() {
      if (!request.value || cancelling.value) return;
      if (!confirm("Cancel this quote request? This cannot be undone.")) return;
      cancelling.value = true;
      try {
        request.value = await quoteRequests.cancel(id.value);
        notification.success("Request cancelled");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to cancel");
      } finally {
        cancelling.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_UAlert = _sfc_main$1;
      const _component_UBadge = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_ShareActionsBar = __nuxt_component_5;
      const _component_DashboardEmptyState = __nuxt_component_5$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)]" }, _attrs))}><div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"><div><h1 class="text-2xl font-bold text-[var(--p-text)]"> Request #${ssrInterpolate(unref(id))}</h1>`);
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
            _push2(` Quote Requests `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "mr-2 h-4 w-4"
              }),
              createTextVNode(" Quote Requests ")
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
        if (unref(request).status === "draft") {
          _push(ssrRenderComponent(_component_UAlert, {
            color: "neutral",
            variant: "soft",
            icon: "i-lucide-edit",
            title: "Draft",
            description: "Complete your request and submit to send it to the shop.",
            class: "mb-6"
          }, null, _parent));
        } else if (unref(request).status === "submitted" || unref(request).status === "viewed") {
          _push(ssrRenderComponent(_component_UAlert, {
            color: "primary",
            variant: "soft",
            icon: "i-lucide-clock",
            title: "Waiting for shop response",
            description: "Your request has been sent. The shop will review and send you a quote.",
            class: "mb-6"
          }, null, _parent));
        } else if (unref(request).status === "quoted") {
          _push(ssrRenderComponent(_component_UAlert, {
            color: "success",
            variant: "soft",
            icon: "i-lucide-check-circle",
            title: "Shop responded",
            description: "The shop has sent a quote. Review the details below and accept if the price works for you.",
            class: "mb-6"
          }, null, _parent));
        } else if (unref(request).status === "accepted") {
          _push(ssrRenderComponent(_component_UAlert, {
            color: "success",
            variant: "soft",
            icon: "i-lucide-check-circle",
            title: "Accepted",
            description: "You've accepted this quote. The shop can now create a job.",
            class: "mb-6"
          }, null, _parent));
        } else if (unref(request).status === "cancelled" || unref(request).status === "closed") {
          _push(ssrRenderComponent(_component_UAlert, {
            color: "neutral",
            variant: "soft",
            icon: "i-lucide-x-circle",
            title: unref(request).status === "cancelled" ? "Cancelled" : "Closed",
            description: unref(request).status === "cancelled" ? "You cancelled this request." : "This request is closed.",
            class: "mb-6"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] overflow-hidden mb-6"><div class="px-6 py-4 border-b border-[var(--p-border)]"><div class="flex justify-between items-start gap-4"><div><h2 class="font-semibold text-[var(--p-text)]">${ssrInterpolate(unref(request).shop_name)}</h2><p class="text-sm text-[var(--p-text-muted)] mt-0.5">`);
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
        _push(`</p></div>`);
        if (unref(request).shop_slug) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/shops/${unref(request).shop_slug}`,
            class: "text-sm font-medium text-flamingo-600 dark:text-flamingo-400 hover:underline shrink-0"
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
            _push(`<div class="shrink-0 text-sm font-medium text-[var(--p-text)] tabular-nums">${ssrInterpolate(unref(formatKES)(item.line_total))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul>`);
        if (unref(latestQuote)?.total) {
          _push(`<div class="px-6 py-4 border-t border-[var(--p-border)] bg-[var(--p-surface-sunken)] dark:bg-[var(--p-surface-raised)]"><div class="flex justify-between font-semibold text-[var(--p-text)]"><span>Total</span><span class="tabular-nums">${ssrInterpolate(unref(formatKES)(unref(latestQuote).total))}</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(latestQuote) && (unref(request).status === "quoted" || unref(request).status === "accepted")) {
          _push(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 mb-6"><h3 class="text-sm font-medium text-[var(--p-text-muted)] mb-3">Shop response</h3><div class="space-y-2 text-sm text-[var(--p-text)]">`);
          if (unref(latestQuote).turnaround_days) {
            _push(`<p class="flex items-center gap-2">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-clock",
              class: "h-4 w-4 shrink-0"
            }, null, _parent));
            _push(` ${ssrInterpolate(unref(latestQuote).turnaround_days)} business day(s) </p>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(latestQuote).note) {
            _push(`<p class="text-[var(--p-text-muted)]">${ssrInterpolate(unref(latestQuote).note)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (unref(request).whatsapp_summary) {
            _push(`<div class="mt-4 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] dark:bg-[var(--p-surface-raised)] p-3"><p class="text-xs text-[var(--p-text-muted)] mb-2">Shareable summary</p><p class="text-sm text-[var(--p-text)] whitespace-pre-wrap font-mono">${ssrInterpolate(unref(request).whatsapp_summary)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-wrap gap-3">`);
        if (unref(canSubmit)) {
          _push(ssrRenderComponent(_component_UButton, {
            color: "primary",
            loading: unref(submitting),
            onClick: onSubmit
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-send",
                  class: "w-4 h-4 mr-2"
                }, null, _parent2, _scopeId));
                _push2(` Submit request `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-send",
                    class: "w-4 h-4 mr-2"
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
            loading: unref(accepting),
            onClick: onAccept
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-check",
                  class: "w-4 h-4 mr-2"
                }, null, _parent2, _scopeId));
                _push2(` Accept quote `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-check",
                    class: "w-4 h-4 mr-2"
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
        if (unref(canCancel)) {
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            color: "error",
            loading: unref(cancelling),
            onClick: onCancel
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-x",
                  class: "w-4 h-4 mr-2"
                }, null, _parent2, _scopeId));
                _push2(` Cancel request `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-x",
                    class: "w-4 h-4 mr-2"
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
        if (unref(request).status === "draft" && unref(request).shop_slug) {
          _push(ssrRenderComponent(_component_UButton, {
            variant: "outline",
            onClick: goToDraft
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-edit",
                  class: "w-4 h-4 mr-2"
                }, null, _parent2, _scopeId));
                _push2(` Edit draft `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-edit",
                    class: "w-4 h-4 mr-2"
                  }),
                  createTextVNode(" Edit draft ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(request).whatsapp_summary) {
          _push(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 mb-6"><p class="text-sm font-medium text-[var(--p-text-muted)] mb-2">Share request</p>`);
          _push(ssrRenderComponent(_component_ShareActionsBar, {
            "summary-text": unref(request).whatsapp_summary,
            "copy-label": "Copy summary",
            attachments: unref(request).attachments
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: "Request not found",
          description: "This quote request may have been removed or you don't have access.",
          icon: "i-lucide-file-question"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, { to: "/quotes" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Quote Requests`);
                  } else {
                    return [
                      createTextVNode("Quote Requests")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, { to: "/quotes" }, {
                  default: withCtx(() => [
                    createTextVNode("Quote Requests")
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
//# sourceMappingURL=_id_-D-ZYyh-h.mjs.map
