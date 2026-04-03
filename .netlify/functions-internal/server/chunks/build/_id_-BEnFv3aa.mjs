import { _ as __nuxt_component_0 } from './DashboardPageHeader-Cmi_LCe-.mjs';
import { f as useRoute, b as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_1 } from './SentQuoteStatusBadge-Dq1ROnd-.mjs';
import { _ as __nuxt_component_7 } from './ShareActionsBar-DdjU3rhd.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { defineComponent, computed, ref, watch, nextTick, resolveComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { a as formatDate, f as formatCurrency } from './formatters-FW8HHCjc.mjs';
import { u as useNotification } from './useNotification-DxMfmZhF.mjs';
import { a as useSentQuotes, u as useIncomingRequests } from './useIncomingRequests-Dj9ppvKn.mjs';
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
import './Badge-Dn_IFHF_.mjs';
import './quoteMessage-Bmp83pcs.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slug = computed(() => route.params.slug);
    const id = computed(() => parseInt(route.params.id, 10));
    const notification = useNotification();
    const sentQuotes = useSentQuotes();
    const incoming = useIncomingRequests(slug);
    const quote = ref(null);
    const incomingRequest = ref(null);
    const loading = ref(true);
    const revising = ref(false);
    const showReviseForm = ref(false);
    const revisionHistory = computed(() => {
      const sq = incomingRequest.value?.sent_quotes;
      if (!sq?.length) return [];
      return [...sq].sort((a, b) => {
        const da = a.sent_at || a.created_at;
        const db = b.sent_at || b.created_at;
        return new Date(db).getTime() - new Date(da).getTime();
      });
    });
    const canRevise = computed(
      () => quote.value && ["sent", "revised"].includes(quote.value.status)
    );
    const requestStatusLabels = {
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
    function requestStatusLabel(s) {
      return s ? requestStatusLabels[s] ?? s : "";
    }
    async function onRevise(payload) {
      if (!quote.value || revising.value) return;
      revising.value = true;
      try {
        quote.value = await sentQuotes.revise(id.value, payload);
        if (quote.value?.quote_request) {
          incomingRequest.value = await incoming.get(quote.value.quote_request);
        }
        showReviseForm.value = false;
        notification.success("Quote revised");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to revise quote");
      } finally {
        revising.value = false;
      }
    }
    watch(quote, async (value) => {
      if (!value) return;
      if (route.query.print !== "1") return;
      await nextTick();
      (void 0).print();
    }, { flush: "post" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_SectionCard = resolveComponent("SectionCard");
      const _component_SentQuoteStatusBadge = __nuxt_component_1;
      const _component_ReviseQuoteForm = resolveComponent("ReviseQuoteForm");
      const _component_ShareActionsBar = __nuxt_component_7;
      const _component_DashboardEmptyState = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: `Quote #${unref(id)}`,
        subtitle: unref(quote)?.quote_request_summary?.customer_name || "Sent quote"
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}/incoming-requests/${unref(quote)?.quote_request}`,
              variant: "soft",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-inbox",
                    class: "w-4 h-4 mr-2"
                  }, null, _parent3, _scopeId2));
                  _push3(` View request `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-inbox",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" View request ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}/sent-quotes`,
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
                to: `/dashboard/shops/${unref(slug)}/incoming-requests/${unref(quote)?.quote_request}`,
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-inbox",
                    class: "w-4 h-4 mr-2"
                  }),
                  createTextVNode(" View request ")
                ]),
                _: 1
              }, 8, ["to"]),
              createVNode(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/sent-quotes`,
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
      if (unref(loading) && !unref(quote)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(quote)) {
        _push(`<div class="grid gap-6 lg:grid-cols-3"><div class="lg:col-span-2 space-y-6">`);
        _push(ssrRenderComponent(_component_SectionCard, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-wrap items-center gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_SentQuoteStatusBadge, {
                status: unref(quote).status
              }, null, _parent2, _scopeId));
              if (unref(quote).revision_number > 1) {
                _push2(`<span class="text-sm text-[var(--p-text-muted)]"${_scopeId}> Revision ${ssrInterpolate(unref(quote).revision_number)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span class="text-sm text-[var(--p-text-muted)]"${_scopeId}> Sent ${ssrInterpolate(unref(formatDate)(unref(quote).sent_at))} `);
              if (unref(quote).updated_at && unref(quote).sent_at && unref(quote).updated_at !== unref(quote).sent_at) {
                _push2(`<!--[--> · Revised ${ssrInterpolate(unref(formatDate)(unref(quote).updated_at))}<!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</span></div><div class="mt-4 grid gap-4 sm:grid-cols-2"${_scopeId}><div${_scopeId}><p class="text-xs font-medium text-[var(--p-text-muted)]"${_scopeId}>Total</p><p class="text-xl font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(unref(quote).total, unref(quote).shop_currency))}</p></div>`);
              if (unref(quote).turnaround_hours != null || unref(quote).human_ready_text) {
                _push2(`<div${_scopeId}><p class="text-xs font-medium text-[var(--p-text-muted)]"${_scopeId}>Turnaround</p><p class="text-lg font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(unref(quote).human_ready_text || `${unref(quote).turnaround_hours} working hour${unref(quote).turnaround_hours !== 1 ? "s" : ""}`)}</p></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-wrap items-center gap-3" }, [
                  createVNode(_component_SentQuoteStatusBadge, {
                    status: unref(quote).status
                  }, null, 8, ["status"]),
                  unref(quote).revision_number > 1 ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "text-sm text-[var(--p-text-muted)]"
                  }, " Revision " + toDisplayString(unref(quote).revision_number), 1)) : createCommentVNode("", true),
                  createVNode("span", { class: "text-sm text-[var(--p-text-muted)]" }, [
                    createTextVNode(" Sent " + toDisplayString(unref(formatDate)(unref(quote).sent_at)) + " ", 1),
                    unref(quote).updated_at && unref(quote).sent_at && unref(quote).updated_at !== unref(quote).sent_at ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createTextVNode(" · Revised " + toDisplayString(unref(formatDate)(unref(quote).updated_at)), 1)
                    ], 64)) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("div", { class: "mt-4 grid gap-4 sm:grid-cols-2" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-xs font-medium text-[var(--p-text-muted)]" }, "Total"),
                    createVNode("p", { class: "text-xl font-semibold text-[var(--p-text)]" }, toDisplayString(unref(formatCurrency)(unref(quote).total, unref(quote).shop_currency)), 1)
                  ]),
                  unref(quote).turnaround_hours != null || unref(quote).human_ready_text ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("p", { class: "text-xs font-medium text-[var(--p-text-muted)]" }, "Turnaround"),
                    createVNode("p", { class: "text-lg font-medium text-[var(--p-text)]" }, toDisplayString(unref(quote).human_ready_text || `${unref(quote).turnaround_hours} working hour${unref(quote).turnaround_hours !== 1 ? "s" : ""}`), 1)
                  ])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_SectionCard, { title: "Customer" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-2 text-sm"${_scopeId}><p${_scopeId}><span class="text-[var(--p-text-muted)]"${_scopeId}>Name:</span> ${ssrInterpolate(unref(quote).quote_request_summary?.customer_name || "—")}</p><p${_scopeId}><span class="text-[var(--p-text-muted)]"${_scopeId}>Email:</span> ${ssrInterpolate(unref(quote).quote_request_summary?.customer_email || "—")}</p><p${_scopeId}><span class="text-[var(--p-text-muted)]"${_scopeId}>Phone:</span> ${ssrInterpolate(unref(quote).quote_request_summary?.customer_phone || "—")}</p><p${_scopeId}><span class="text-[var(--p-text-muted)]"${_scopeId}>Request status:</span> ${ssrInterpolate(requestStatusLabel(unref(quote).quote_request_summary?.status) || "—")}</p></div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-2 text-sm" }, [
                  createVNode("p", null, [
                    createVNode("span", { class: "text-[var(--p-text-muted)]" }, "Name:"),
                    createTextVNode(" " + toDisplayString(unref(quote).quote_request_summary?.customer_name || "—"), 1)
                  ]),
                  createVNode("p", null, [
                    createVNode("span", { class: "text-[var(--p-text-muted)]" }, "Email:"),
                    createTextVNode(" " + toDisplayString(unref(quote).quote_request_summary?.customer_email || "—"), 1)
                  ]),
                  createVNode("p", null, [
                    createVNode("span", { class: "text-[var(--p-text-muted)]" }, "Phone:"),
                    createTextVNode(" " + toDisplayString(unref(quote).quote_request_summary?.customer_phone || "—"), 1)
                  ]),
                  createVNode("p", null, [
                    createVNode("span", { class: "text-[var(--p-text-muted)]" }, "Request status:"),
                    createTextVNode(" " + toDisplayString(requestStatusLabel(unref(quote).quote_request_summary?.status) || "—"), 1)
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_SectionCard, { title: "Items" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<ul class="divide-y divide-[var(--p-border)]"${_scopeId}><!--[-->`);
              ssrRenderList(unref(quote).items, (item) => {
                _push2(`<li class="flex items-start justify-between gap-4 py-3 first:pt-0"${_scopeId}><div class="min-w-0 flex-1"${_scopeId}><p class="font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.title ?? item.product_name ?? "Product")}</p><p class="text-sm text-[var(--p-text-muted)]"${_scopeId}> Qty: ${ssrInterpolate(item.quantity)} `);
                if (item.spec_text) {
                  _push2(`<!--[--> · ${ssrInterpolate(item.spec_text)}<!--]-->`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</p></div>`);
                if (item.line_total) {
                  _push2(`<div class="shrink-0 text-sm font-medium tabular-nums text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(item.line_total, unref(quote).shop_currency))}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul><div class="mt-4 pt-4 border-t border-[var(--p-border)] flex justify-between font-semibold text-[var(--p-text)]"${_scopeId}><span${_scopeId}>Total</span><span class="tabular-nums"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(unref(quote).total, unref(quote).shop_currency))}</span></div>`);
            } else {
              return [
                createVNode("ul", { class: "divide-y divide-[var(--p-border)]" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(quote).items, (item) => {
                    return openBlock(), createBlock("li", {
                      key: item.id,
                      class: "flex items-start justify-between gap-4 py-3 first:pt-0"
                    }, [
                      createVNode("div", { class: "min-w-0 flex-1" }, [
                        createVNode("p", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(item.title ?? item.product_name ?? "Product"), 1),
                        createVNode("p", { class: "text-sm text-[var(--p-text-muted)]" }, [
                          createTextVNode(" Qty: " + toDisplayString(item.quantity) + " ", 1),
                          item.spec_text ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                            createTextVNode(" · " + toDisplayString(item.spec_text), 1)
                          ], 64)) : createCommentVNode("", true)
                        ])
                      ]),
                      item.line_total ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "shrink-0 text-sm font-medium tabular-nums text-[var(--p-text)]"
                      }, toDisplayString(unref(formatCurrency)(item.line_total, unref(quote).shop_currency)), 1)) : createCommentVNode("", true)
                    ]);
                  }), 128))
                ]),
                createVNode("div", { class: "mt-4 pt-4 border-t border-[var(--p-border)] flex justify-between font-semibold text-[var(--p-text)]" }, [
                  createVNode("span", null, "Total"),
                  createVNode("span", { class: "tabular-nums" }, toDisplayString(unref(formatCurrency)(unref(quote).total, unref(quote).shop_currency)), 1)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(quote).note) {
          _push(ssrRenderComponent(_component_SectionCard, { title: "Note to customer" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<p class="text-sm text-[var(--p-text)] whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(unref(quote).note)}</p>`);
              } else {
                return [
                  createVNode("p", { class: "text-sm text-[var(--p-text)] whitespace-pre-wrap" }, toDisplayString(unref(quote).note), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-6">`);
        if (unref(revisionHistory).length) {
          _push(ssrRenderComponent(_component_SectionCard, { title: "Revision history" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<ul class="space-y-2"${_scopeId}><!--[-->`);
                ssrRenderList(unref(revisionHistory), (rev) => {
                  _push2(`<li class="${ssrRenderClass([rev.id === unref(quote).id ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-[var(--p-surface-sunken)] dark:bg-[var(--p-surface-raised)]", "flex items-center justify-between gap-2 rounded-lg px-3 py-2"])}"${_scopeId}><span class="text-sm"${_scopeId}>`);
                  if (rev.id === unref(quote).id) {
                    _push2(`<span class="font-medium"${_scopeId}>Current</span>`);
                  } else {
                    _push2(`<span${_scopeId}>Rev ${ssrInterpolate(rev.revision_number)}</span>`);
                  }
                  _push2(` · ${ssrInterpolate(unref(formatCurrency)(rev.total))}</span><span class="text-xs text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(unref(formatDate)(rev.sent_at || rev.created_at))}</span></li>`);
                });
                _push2(`<!--]--></ul>`);
              } else {
                return [
                  createVNode("ul", { class: "space-y-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(revisionHistory), (rev) => {
                      return openBlock(), createBlock("li", {
                        key: rev.id,
                        class: ["flex items-center justify-between gap-2 rounded-lg px-3 py-2", rev.id === unref(quote).id ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-[var(--p-surface-sunken)] dark:bg-[var(--p-surface-raised)]"]
                      }, [
                        createVNode("span", { class: "text-sm" }, [
                          rev.id === unref(quote).id ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "font-medium"
                          }, "Current")) : (openBlock(), createBlock("span", { key: 1 }, "Rev " + toDisplayString(rev.revision_number), 1)),
                          createTextVNode(" · " + toDisplayString(unref(formatCurrency)(rev.total)), 1)
                        ]),
                        createVNode("span", { class: "text-xs text-[var(--p-text-muted)]" }, toDisplayString(unref(formatDate)(rev.sent_at || rev.created_at)), 1)
                      ], 2);
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
        _push(ssrRenderComponent(_component_SectionCard, { title: "Actions" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/incoming-requests/${unref(quote).quote_request}`,
                block: "",
                variant: "soft"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-external-link",
                      class: "w-4 h-4 mr-2"
                    }, null, _parent3, _scopeId2));
                    _push3(` Open incoming request `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-external-link",
                        class: "w-4 h-4 mr-2"
                      }),
                      createTextVNode(" Open incoming request ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (unref(canRevise)) {
                _push2(ssrRenderComponent(_component_UButton, {
                  block: "",
                  variant: "soft",
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
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-2" }, [
                  createVNode(_component_UButton, {
                    to: `/dashboard/shops/${unref(slug)}/incoming-requests/${unref(quote).quote_request}`,
                    block: "",
                    variant: "soft"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-external-link",
                        class: "w-4 h-4 mr-2"
                      }),
                      createTextVNode(" Open incoming request ")
                    ]),
                    _: 1
                  }, 8, ["to"]),
                  unref(canRevise) ? (openBlock(), createBlock(_component_UButton, {
                    key: 0,
                    block: "",
                    variant: "soft",
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
                  }, 8, ["onClick"])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(showReviseForm)) {
          _push(ssrRenderComponent(_component_SectionCard, { title: "Revise quote" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_ReviseQuoteForm, {
                  loading: unref(revising),
                  "initial-total": unref(quote).total,
                  "initial-note": unref(quote).note ?? "",
                  "initial-turnaround": unref(quote).turnaround_hours ?? unref(quote).turnaround_days ?? null,
                  onSubmit: onRevise,
                  onCancel: ($event) => showReviseForm.value = false
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_ReviseQuoteForm, {
                    loading: unref(revising),
                    "initial-total": unref(quote).total,
                    "initial-note": unref(quote).note ?? "",
                    "initial-turnaround": unref(quote).turnaround_hours ?? unref(quote).turnaround_days ?? null,
                    onSubmit: onRevise,
                    onCancel: ($event) => showReviseForm.value = false
                  }, null, 8, ["loading", "initial-total", "initial-note", "initial-turnaround", "onCancel"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(quote).whatsapp_summary) {
          _push(ssrRenderComponent(_component_SectionCard, { title: "Share quote" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<p class="text-sm text-[var(--p-text)] whitespace-pre-wrap font-mono mb-3"${_scopeId}>${ssrInterpolate(unref(quote).whatsapp_summary)}</p>`);
                _push2(ssrRenderComponent(_component_ShareActionsBar, {
                  "summary-text": unref(quote).whatsapp_summary,
                  "copy-label": "Copy summary",
                  attachments: unref(quote).attachments
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode("p", { class: "text-sm text-[var(--p-text)] whitespace-pre-wrap font-mono mb-3" }, toDisplayString(unref(quote).whatsapp_summary), 1),
                  createVNode(_component_ShareActionsBar, {
                    "summary-text": unref(quote).whatsapp_summary,
                    "copy-label": "Copy summary",
                    attachments: unref(quote).attachments
                  }, null, 8, ["summary-text", "attachments"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: "Quote not found",
          description: "This sent quote may have been removed or you don't have access.",
          icon: "i-lucide-file-question"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/sent-quotes`
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Sent Quotes`);
                  } else {
                    return [
                      createTextVNode("Sent Quotes")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  to: `/dashboard/shops/${unref(slug)}/sent-quotes`
                }, {
                  default: withCtx(() => [
                    createTextVNode("Sent Quotes")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/sent-quotes/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BEnFv3aa.mjs.map
