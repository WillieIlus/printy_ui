import { _ as __nuxt_component_0 } from './DashboardPageHeader-C_rdBHa1.mjs';
import { e as useRoute, c as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_1 } from './IncomingRequestStatusBadge-Dm8qqS5N.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { defineComponent, computed, ref, resolveComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, createCommentVNode, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { f as formatCurrency } from './formatters-D5StX5za.mjs';
import { u as useNotification } from './useNotification-Dn_AzVKG.mjs';
import { a as useIncomingRequests, u as useSentQuotes } from './useIncomingRequests-Dkoz_Xi6.mjs';
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
import 'tailwindcss/colors';
import '@iconify/vue';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './Badge-BGajth1Y.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slug = computed(() => route.params.slug);
    const id = computed(() => parseInt(route.params.id, 10));
    const notification = useNotification();
    const incoming = useIncomingRequests(slug);
    const sentQuotes = useSentQuotes();
    const request = ref(null);
    const loading = ref(true);
    const sending = ref(false);
    const revising = ref(false);
    const markingViewed = ref(false);
    const declining = ref(false);
    const showSendForm = ref(false);
    const showReviseForm = ref(false);
    const latestQuote = computed(() => {
      const sq = request.value?.sent_quotes;
      if (!sq?.length) return null;
      return sq[sq.length - 1];
    });
    const hasSentQuote = computed(
      () => request.value?.sent_quotes?.some(
        (sq) => ["sent", "revised", "accepted"].includes(sq.status)
      ) ?? false
    );
    const canSendQuote = computed(
      () => request.value && ["submitted", "viewed"].includes(request.value.status) && !hasSentQuote.value
    );
    const canRevise = computed(
      () => request.value && ["quoted", "accepted"].includes(request.value.status) && latestQuote.value && ["sent", "revised"].includes(latestQuote.value.status)
    );
    const canMarkViewed = computed(
      () => request.value?.status === "submitted"
    );
    const canDecline = computed(
      () => request.value && ["submitted", "viewed"].includes(request.value.status)
    );
    async function fetchRequest() {
      if (Number.isNaN(id.value)) {
        loading.value = false;
        return;
      }
      loading.value = true;
      try {
        request.value = await incoming.get(id.value);
      } catch {
        request.value = null;
      } finally {
        loading.value = false;
      }
    }
    async function onSendQuote(payload) {
      if (!request.value || sending.value) return;
      sending.value = true;
      try {
        request.value = await incoming.sendQuote(id.value, payload);
        showSendForm.value = false;
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
        notification.success("Quote revised");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to revise quote");
      } finally {
        revising.value = false;
      }
    }
    async function onMarkViewed() {
      if (!request.value || markingViewed.value) return;
      markingViewed.value = true;
      try {
        request.value = await incoming.markViewed(id.value);
        notification.success("Marked as viewed");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to mark viewed");
      } finally {
        markingViewed.value = false;
      }
    }
    async function onDecline() {
      if (!request.value || declining.value) return;
      if (!confirm("Decline this request? The customer will be notified.")) return;
      declining.value = true;
      try {
        request.value = await incoming.decline(id.value);
        notification.success("Request declined");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to decline");
      } finally {
        declining.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_IncomingRequestStatusBadge = __nuxt_component_1;
      const _component_SectionCard = resolveComponent("SectionCard");
      const _component_SendQuoteForm = resolveComponent("SendQuoteForm");
      const _component_ReviseQuoteForm = resolveComponent("ReviseQuoteForm");
      const _component_DashboardEmptyState = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: `Request #${unref(id)}`,
        subtitle: unref(request)?.customer_name || "Incoming request"
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}/incoming-requests`,
              variant: "soft",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-left",
                    class: "w-4 h-4 mr-2"
                  }, null, _parent3, _scopeId2));
                  _push3(` Back `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-left",
                      class: "w-4 h-4 mr-2"
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
                to: `/dashboard/shops/${unref(slug)}/incoming-requests`,
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-arrow-left",
                    class: "w-4 h-4 mr-2"
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
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_IncomingRequestStatusBadge, {
          status: unref(request).status
        }, null, _parent));
        _push(`<div class="grid gap-6 lg:grid-cols-3"><div class="lg:col-span-2 space-y-6">`);
        _push(ssrRenderComponent(_component_SectionCard, { title: "Customer" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-2 text-sm"${_scopeId}><p${_scopeId}><span class="text-[var(--p-text-muted)]"${_scopeId}>Name:</span> ${ssrInterpolate(unref(request).customer_name || "—")}</p><p${_scopeId}><span class="text-[var(--p-text-muted)]"${_scopeId}>Email:</span> ${ssrInterpolate(unref(request).customer_email || "—")}</p><p${_scopeId}><span class="text-[var(--p-text-muted)]"${_scopeId}>Phone:</span> ${ssrInterpolate(unref(request).customer_phone || "—")}</p>`);
              if (unref(request).delivery_preference) {
                _push2(`<p${_scopeId}><span class="text-[var(--p-text-muted)]"${_scopeId}>Delivery:</span> ${ssrInterpolate(unref(request).delivery_preference === "pickup" ? "Pickup" : "Delivery")} `);
                if (unref(request).delivery_address) {
                  _push2(`<!--[--> · ${ssrInterpolate(unref(request).delivery_address)}<!--]-->`);
                } else if (unref(request).delivery_location_name) {
                  _push2(`<!--[--> · ${ssrInterpolate(unref(request).delivery_location_name)}<!--]-->`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</p>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(request).notes) {
                _push2(`<p class="pt-2 border-t border-[var(--p-border)]"${_scopeId}><span class="text-[var(--p-text-muted)]"${_scopeId}>Notes:</span> ${ssrInterpolate(unref(request).notes)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-2 text-sm" }, [
                  createVNode("p", null, [
                    createVNode("span", { class: "text-[var(--p-text-muted)]" }, "Name:"),
                    createTextVNode(" " + toDisplayString(unref(request).customer_name || "—"), 1)
                  ]),
                  createVNode("p", null, [
                    createVNode("span", { class: "text-[var(--p-text-muted)]" }, "Email:"),
                    createTextVNode(" " + toDisplayString(unref(request).customer_email || "—"), 1)
                  ]),
                  createVNode("p", null, [
                    createVNode("span", { class: "text-[var(--p-text-muted)]" }, "Phone:"),
                    createTextVNode(" " + toDisplayString(unref(request).customer_phone || "—"), 1)
                  ]),
                  unref(request).delivery_preference ? (openBlock(), createBlock("p", { key: 0 }, [
                    createVNode("span", { class: "text-[var(--p-text-muted)]" }, "Delivery:"),
                    createTextVNode(" " + toDisplayString(unref(request).delivery_preference === "pickup" ? "Pickup" : "Delivery") + " ", 1),
                    unref(request).delivery_address ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createTextVNode(" · " + toDisplayString(unref(request).delivery_address), 1)
                    ], 64)) : unref(request).delivery_location_name ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createTextVNode(" · " + toDisplayString(unref(request).delivery_location_name), 1)
                    ], 64)) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  unref(request).notes ? (openBlock(), createBlock("p", {
                    key: 1,
                    class: "pt-2 border-t border-[var(--p-border)]"
                  }, [
                    createVNode("span", { class: "text-[var(--p-text-muted)]" }, "Notes:"),
                    createTextVNode(" " + toDisplayString(unref(request).notes), 1)
                  ])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_SectionCard, { title: "Job specification" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<ul class="divide-y divide-[var(--p-border)]"${_scopeId}><!--[-->`);
              ssrRenderList(unref(request).items, (item) => {
                _push2(`<li class="flex items-start justify-between gap-4 py-3 first:pt-0"${_scopeId}><div class="min-w-0 flex-1"${_scopeId}><p class="font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.title ?? item.product_name ?? "Product")}</p><p class="text-sm text-[var(--p-text-muted)]"${_scopeId}> Qty: ${ssrInterpolate(item.quantity)} `);
                if (item.spec_text || item.chosen_width_mm && item.chosen_height_mm) {
                  _push2(`<!--[--> · ${ssrInterpolate(item.spec_text || `${item.chosen_width_mm}×${item.chosen_height_mm}mm`)}<!--]-->`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</p></div>`);
                if (item.line_total) {
                  _push2(`<div class="shrink-0 text-sm font-medium tabular-nums text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(item.line_total, unref(request).shop_currency))}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul>`);
              if (unref(latestQuote)?.total) {
                _push2(`<div class="mt-4 pt-4 border-t border-[var(--p-border)] flex justify-between font-semibold text-[var(--p-text)]"${_scopeId}><span${_scopeId}>Total</span><span class="tabular-nums"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(unref(latestQuote).total, unref(request).shop_currency))}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode("ul", { class: "divide-y divide-[var(--p-border)]" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(request).items, (item) => {
                    return openBlock(), createBlock("li", {
                      key: item.id,
                      class: "flex items-start justify-between gap-4 py-3 first:pt-0"
                    }, [
                      createVNode("div", { class: "min-w-0 flex-1" }, [
                        createVNode("p", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(item.title ?? item.product_name ?? "Product"), 1),
                        createVNode("p", { class: "text-sm text-[var(--p-text-muted)]" }, [
                          createTextVNode(" Qty: " + toDisplayString(item.quantity) + " ", 1),
                          item.spec_text || item.chosen_width_mm && item.chosen_height_mm ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                            createTextVNode(" · " + toDisplayString(item.spec_text || `${item.chosen_width_mm}×${item.chosen_height_mm}mm`), 1)
                          ], 64)) : createCommentVNode("", true)
                        ])
                      ]),
                      item.line_total ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "shrink-0 text-sm font-medium tabular-nums text-[var(--p-text)]"
                      }, toDisplayString(unref(formatCurrency)(item.line_total, unref(request).shop_currency)), 1)) : createCommentVNode("", true)
                    ]);
                  }), 128))
                ]),
                unref(latestQuote)?.total ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mt-4 pt-4 border-t border-[var(--p-border)] flex justify-between font-semibold text-[var(--p-text)]"
                }, [
                  createVNode("span", null, "Total"),
                  createVNode("span", { class: "tabular-nums" }, toDisplayString(unref(formatCurrency)(unref(latestQuote).total, unref(request).shop_currency)), 1)
                ])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(request).attachments?.length) {
          _push(ssrRenderComponent(_component_SectionCard, { title: "Attachments" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<ul class="space-y-2"${_scopeId}><!--[-->`);
                ssrRenderList(unref(request).attachments, (att) => {
                  _push2(`<li${_scopeId}><a${ssrRenderAttr("href", att.file)} target="_blank" rel="noopener noreferrer" class="text-sm text-flamingo-600 dark:text-flamingo-400 hover:underline"${_scopeId}>${ssrInterpolate(att.name || "Attachment")}</a></li>`);
                });
                _push2(`<!--]--></ul>`);
              } else {
                return [
                  createVNode("ul", { class: "space-y-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(request).attachments, (att) => {
                      return openBlock(), createBlock("li", {
                        key: att.id
                      }, [
                        createVNode("a", {
                          href: att.file,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          class: "text-sm text-flamingo-600 dark:text-flamingo-400 hover:underline"
                        }, toDisplayString(att.name || "Attachment"), 9, ["href"])
                      ]);
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
        _push(`</div><div class="lg:col-span-1">`);
        _push(ssrRenderComponent(_component_SectionCard, { title: "Actions" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-4"${_scopeId}>`);
              if (unref(canSendQuote)) {
                _push2(`<!--[-->`);
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
                          class: "w-4 h-4 mr-2"
                        }, null, _parent3, _scopeId2));
                        _push3(` Send quote `);
                      } else {
                        return [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-send",
                            class: "w-4 h-4 mr-2"
                          }),
                          createTextVNode(" Send quote ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                }
                _push2(`<!--]-->`);
              } else if (unref(canRevise)) {
                _push2(`<!--[-->`);
                if (unref(showReviseForm)) {
                  _push2(ssrRenderComponent(_component_ReviseQuoteForm, {
                    loading: unref(revising),
                    "initial-total": unref(latestQuote)?.total,
                    "initial-note": unref(latestQuote)?.note ?? "",
                    "initial-turnaround": unref(latestQuote)?.turnaround_days,
                    onSubmit: onReviseQuote,
                    onCancel: ($event) => showReviseForm.value = false
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(_component_UButton, {
                    variant: "soft",
                    block: "",
                    onClick: ($event) => showReviseForm.value = true
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(_component_UIcon, {
                          name: "i-lucide-refresh-cw",
                          class: "w-4 h-4 mr-2"
                        }, null, _parent3, _scopeId2));
                        _push3(` Revise quote `);
                      } else {
                        return [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-refresh-cw",
                            class: "w-4 h-4 mr-2"
                          }),
                          createTextVNode(" Revise quote ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                }
                _push2(`<!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(canMarkViewed)) {
                _push2(ssrRenderComponent(_component_UButton, {
                  variant: "soft",
                  color: "neutral",
                  block: "",
                  loading: unref(markingViewed),
                  onClick: onMarkViewed
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UIcon, {
                        name: "i-lucide-eye",
                        class: "w-4 h-4 mr-2"
                      }, null, _parent3, _scopeId2));
                      _push3(` Mark viewed `);
                    } else {
                      return [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-eye",
                          class: "w-4 h-4 mr-2"
                        }),
                        createTextVNode(" Mark viewed ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (unref(canDecline)) {
                _push2(ssrRenderComponent(_component_UButton, {
                  variant: "soft",
                  color: "error",
                  block: "",
                  loading: unref(declining),
                  onClick: onDecline
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UIcon, {
                        name: "i-lucide-x",
                        class: "w-4 h-4 mr-2"
                      }, null, _parent3, _scopeId2));
                      _push3(` Decline `);
                    } else {
                      return [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-x",
                          class: "w-4 h-4 mr-2"
                        }),
                        createTextVNode(" Decline ")
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
              return [
                createVNode("div", { class: "space-y-4" }, [
                  unref(canSendQuote) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
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
                          class: "w-4 h-4 mr-2"
                        }),
                        createTextVNode(" Send quote ")
                      ]),
                      _: 1
                    }, 8, ["onClick"]))
                  ], 64)) : unref(canRevise) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                    unref(showReviseForm) ? (openBlock(), createBlock(_component_ReviseQuoteForm, {
                      key: 0,
                      loading: unref(revising),
                      "initial-total": unref(latestQuote)?.total,
                      "initial-note": unref(latestQuote)?.note ?? "",
                      "initial-turnaround": unref(latestQuote)?.turnaround_days,
                      onSubmit: onReviseQuote,
                      onCancel: ($event) => showReviseForm.value = false
                    }, null, 8, ["loading", "initial-total", "initial-note", "initial-turnaround", "onCancel"])) : (openBlock(), createBlock(_component_UButton, {
                      key: 1,
                      variant: "soft",
                      block: "",
                      onClick: ($event) => showReviseForm.value = true
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-refresh-cw",
                          class: "w-4 h-4 mr-2"
                        }),
                        createTextVNode(" Revise quote ")
                      ]),
                      _: 1
                    }, 8, ["onClick"]))
                  ], 64)) : createCommentVNode("", true),
                  unref(canMarkViewed) ? (openBlock(), createBlock(_component_UButton, {
                    key: 2,
                    variant: "soft",
                    color: "neutral",
                    block: "",
                    loading: unref(markingViewed),
                    onClick: onMarkViewed
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-eye",
                        class: "w-4 h-4 mr-2"
                      }),
                      createTextVNode(" Mark viewed ")
                    ]),
                    _: 1
                  }, 8, ["loading"])) : createCommentVNode("", true),
                  unref(canDecline) ? (openBlock(), createBlock(_component_UButton, {
                    key: 3,
                    variant: "soft",
                    color: "error",
                    block: "",
                    loading: unref(declining),
                    onClick: onDecline
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-x",
                        class: "w-4 h-4 mr-2"
                      }),
                      createTextVNode(" Decline ")
                    ]),
                    _: 1
                  }, 8, ["loading"])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(request).whatsapp_summary) {
          _push(ssrRenderComponent(_component_SectionCard, {
            title: "Shareable summary",
            class: "mt-4"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<p class="text-sm text-[var(--p-text)] whitespace-pre-wrap font-mono"${_scopeId}>${ssrInterpolate(unref(request).whatsapp_summary)}</p>`);
              } else {
                return [
                  createVNode("p", { class: "text-sm text-[var(--p-text)] whitespace-pre-wrap font-mono" }, toDisplayString(unref(request).whatsapp_summary), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
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
//# sourceMappingURL=_id_-DUymcCZy.mjs.map
