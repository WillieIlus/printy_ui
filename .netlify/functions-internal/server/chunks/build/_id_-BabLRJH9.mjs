import { _ as __nuxt_component_0 } from './DashboardPageHeader-2WLhb5mv.mjs';
import { f as useRoute, j as useToast, d as _sfc_main$9, a as _sfc_main$f, k as useNuxtApp, A as API } from './server.mjs';
import { _ as __nuxt_component_4 } from './SkeletonState-BhcHA7h3.mjs';
import { _ as __nuxt_component_4$1 } from './SectionCard-CIaG1dLz.mjs';
import { _ as _sfc_main$4 } from './Badge-DRRvJchD.mjs';
import { _ as __nuxt_component_6 } from './RichTextDisplay-CnD11EO8.mjs';
import { _ as _sfc_main$5 } from './Card-D3ia-hWt.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, isRef, Fragment, renderList, renderSlot, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderSlot, ssrRenderTeleport } from 'vue/server-renderer';
import { g as getWhatsAppShareUrl } from './quoteMessage-Bmp83pcs.mjs';
import { u as useQuoteStore } from './quote-BBvP7CpN.mjs';
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

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "QuoteCalculator",
  __ssrInlineRender: true,
  props: {
    totals: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$5;
      _push(ssrRenderComponent(_component_UCard, _attrs, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Quote summary</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Quote summary")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-2"${_scopeId}><div class="flex justify-between text-sm"${_scopeId}><span class="text-gray-600 dark:text-gray-400"${_scopeId}>Subtotal</span><span class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(__props.totals?.subtotal ?? "—")}</span></div><div class="flex justify-between text-sm"${_scopeId}><span class="text-gray-600 dark:text-gray-400"${_scopeId}>Tax</span><span class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(__props.totals?.tax ?? "—")}</span></div><div class="flex justify-between text-lg font-bold border-t dark:border-gray-700 pt-2 mt-2"${_scopeId}><span class="text-gray-900 dark:text-white"${_scopeId}>Total</span><span class="text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(__props.totals?.total ?? "—")}</span></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-2" }, [
                createVNode("div", { class: "flex justify-between text-sm" }, [
                  createVNode("span", { class: "text-gray-600 dark:text-gray-400" }, "Subtotal"),
                  createVNode("span", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(__props.totals?.subtotal ?? "—"), 1)
                ]),
                createVNode("div", { class: "flex justify-between text-sm" }, [
                  createVNode("span", { class: "text-gray-600 dark:text-gray-400" }, "Tax"),
                  createVNode("span", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(__props.totals?.tax ?? "—"), 1)
                ]),
                createVNode("div", { class: "flex justify-between text-lg font-bold border-t dark:border-gray-700 pt-2 mt-2" }, [
                  createVNode("span", { class: "text-gray-900 dark:text-white" }, "Total"),
                  createVNode("span", { class: "text-gray-900 dark:text-white" }, toDisplayString(__props.totals?.total ?? "—"), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/QuoteCalculator.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$3, { __name: "QuotesQuoteCalculator" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "QuoteItemList",
  __ssrInlineRender: true,
  props: {
    items: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$5;
      _push(ssrRenderComponent(_component_UCard, _attrs, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold text-[var(--p-text)]"${_scopeId}>Quote items</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold text-[var(--p-text)]" }, "Quote items")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.items?.length) {
              _push2(`<div class="space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.items, (item) => {
                _push2(`<div class="flex items-center justify-between rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-3"${_scopeId}><div${_scopeId}><p class="font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.name)}</p><p class="text-sm text-[var(--p-text-muted)]"${_scopeId}>Qty ${ssrInterpolate(item.quantity)} × ${ssrInterpolate(item.unit_price)}</p></div><p class="font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.total_price)}</p></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<p class="text-sm text-[var(--p-text-muted)]"${_scopeId}>No items.</p>`);
            }
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              __props.items?.length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-2"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.items, (item) => {
                  return openBlock(), createBlock("div", {
                    key: item.id,
                    class: "flex items-center justify-between rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-3"
                  }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(item.name), 1),
                      createVNode("p", { class: "text-sm text-[var(--p-text-muted)]" }, "Qty " + toDisplayString(item.quantity) + " × " + toDisplayString(item.unit_price), 1)
                    ]),
                    createVNode("p", { class: "font-semibold text-[var(--p-text)]" }, toDisplayString(item.total_price), 1)
                  ]);
                }), 128))
              ])) : (openBlock(), createBlock("p", {
                key: 1,
                class: "text-sm text-[var(--p-text-muted)]"
              }, "No items.")),
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/QuoteItemList.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$2, { __name: "QuotesQuoteItemList" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "QuoteShareModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    shareUrl: {},
    whatsappText: {}
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const toast = useToast();
    const copiedLink = ref(false);
    const copiedMessage = ref(false);
    const copyingLink = ref(false);
    const copyingMessage = ref(false);
    const openingWhatsApp = ref(false);
    let copiedLinkTimer = null;
    let copiedMessageTimer = null;
    function setCopiedState(kind) {
      const stateRef = kind === "link" ? copiedLink : copiedMessage;
      const timerRef = kind === "link" ? copiedLinkTimer : copiedMessageTimer;
      stateRef.value = true;
      if (timerRef) clearTimeout(timerRef);
      const nextTimer = setTimeout(() => {
        stateRef.value = false;
      }, 1800);
      if (kind === "link") copiedLinkTimer = nextTimer;
      else copiedMessageTimer = nextTimer;
    }
    async function copyLink() {
      copyingLink.value = true;
      try {
        await (void 0).clipboard.writeText(props.shareUrl);
        setCopiedState("link");
        toast.add({ title: "Link copied", color: "success" });
      } catch {
        toast.add({ title: "Could not copy link", color: "error" });
      } finally {
        copyingLink.value = false;
      }
    }
    async function copyWhatsApp() {
      copyingMessage.value = true;
      try {
        await (void 0).clipboard.writeText(props.whatsappText);
        setCopiedState("message");
        toast.add({ title: "WhatsApp summary copied", color: "success" });
      } catch {
        toast.add({ title: "Could not copy", color: "error" });
      } finally {
        copyingMessage.value = false;
      }
    }
    async function sendOnWhatsApp() {
      openingWhatsApp.value = true;
      try {
        const url = getWhatsAppShareUrl(props.whatsappText);
        (void 0).open(url, "_blank", "noopener,noreferrer");
      } finally {
        setTimeout(() => {
          openingWhatsApp.value = false;
        }, 600);
      }
    }
    watch(() => props.open, (open) => {
      if (open) (void 0).body.style.overflow = "hidden";
      else (void 0).body.style.overflow = "";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true"><div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden></div><div class="modal-panel relative w-full max-w-md rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-xl z-10"><div class="flex items-center justify-between mb-4"><div><h2 class="text-lg font-semibold text-[var(--p-text)]">Share Quote</h2><p class="mt-0.5 text-sm text-[var(--p-text-muted)]"> Copy the link or WhatsApp summary to share with your customer. </p></div><button type="button" class="rounded-lg p-1.5 text-[var(--p-text-muted)] hover:text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors" aria-label="Close">`);
          _push2(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-x",
            class: "h-5 w-5"
          }, null, _parent));
          _push2(`</button></div><div class="space-y-3">`);
          _push2(ssrRenderComponent(_component_UButton, {
            block: "",
            variant: "outline",
            color: "neutral",
            disabled: !__props.shareUrl,
            loading: unref(copyingLink),
            onClick: copyLink
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(_component_UIcon, {
                  name: unref(copiedLink) ? "i-lucide-check" : "i-lucide-link",
                  class: "h-4 w-4 mr-2"
                }, null, _parent2, _scopeId));
                _push3(` Copy link `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: unref(copiedLink) ? "i-lucide-check" : "i-lucide-link",
                    class: "h-4 w-4 mr-2"
                  }, null, 8, ["name"]),
                  createTextVNode(" Copy link ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(_component_UButton, {
            block: "",
            variant: "outline",
            color: "neutral",
            disabled: !__props.whatsappText,
            loading: unref(copyingMessage),
            onClick: copyWhatsApp
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(_component_UIcon, {
                  name: unref(copiedMessage) ? "i-lucide-check" : "i-lucide-copy",
                  class: "h-4 w-4 mr-2"
                }, null, _parent2, _scopeId));
                _push3(` Copy WhatsApp summary `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: unref(copiedMessage) ? "i-lucide-check" : "i-lucide-copy",
                    class: "h-4 w-4 mr-2"
                  }, null, 8, ["name"]),
                  createTextVNode(" Copy WhatsApp summary ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(_component_UButton, {
            block: "",
            color: "success",
            disabled: !__props.whatsappText,
            loading: unref(openingWhatsApp),
            onClick: sendOnWhatsApp
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(_component_UIcon, {
                  name: unref(openingWhatsApp) ? "i-lucide-loader-circle" : "i-lucide-message-circle",
                  class: ["h-4 w-4 mr-2", { "animate-spin": unref(openingWhatsApp) }]
                }, null, _parent2, _scopeId));
                _push3(` Send on WhatsApp `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: unref(openingWhatsApp) ? "i-lucide-loader-circle" : "i-lucide-message-circle",
                    class: ["h-4 w-4 mr-2", { "animate-spin": unref(openingWhatsApp) }]
                  }, null, 8, ["name", "class"]),
                  createTextVNode(" Send on WhatsApp ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/QuoteShareModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$1, { __name: "QuotesQuoteShareModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const quoteStore = useQuoteStore();
    const slug = computed(() => route.params.slug);
    const id = computed(() => Number(route.params.id));
    const statusColor = computed(() => {
      const m = { draft: "neutral", pending: "warning", approved: "success", rejected: "error", completed: "success" };
      return m[quoteStore.currentQuote?.status ?? ""] ?? "neutral";
    });
    const totals = ref(null);
    const quoteItems = computed(() => quoteStore.currentQuote?.items ?? []);
    const shareLoading = ref(false);
    const shareModalOpen = ref(false);
    const shareResult = ref(null);
    const toast = useToast();
    const conciseWhatsAppText = computed(() => {
      const q = quoteStore.currentQuote;
      const url = shareResult.value?.share_url;
      if (!q || !url) return "";
      const lines = [];
      lines.push(`*Quote for ${q.customer_name}*`);
      lines.push("");
      for (const item of q.items ?? []) {
        const name = item.product_name ?? item.title ?? item.name ?? "Item";
        const spec = item.spec_text || (item.chosen_width_mm && item.chosen_height_mm ? `${item.chosen_width_mm}×${item.chosen_height_mm}mm` : "") || item.pricing_mode || "";
        const qty = item.quantity ?? 1;
        const total = item.line_total ?? "";
        lines.push(`• ${name} × ${qty}${spec ? ` (${spec})` : ""}${total ? ` = ${total}` : ""}`);
      }
      lines.push("");
      if (q.total) lines.push(`*Total: ${q.total}*`);
      lines.push("");
      lines.push(`View: ${url}`);
      return lines.join("\n");
    });
    async function handleShare() {
      if (!id.value) return;
      shareLoading.value = true;
      shareResult.value = null;
      try {
        const { $api } = useNuxtApp();
        const data = await $api(
          API.staffQuoteShare(id.value),
          { method: "POST" }
        );
        shareResult.value = data;
        shareModalOpen.value = true;
      } catch (err) {
        const status = typeof err === "object" && err !== null && "statusCode" in err ? err.statusCode : void 0;
        const msg = err instanceof Error ? err.message : "";
        toast.add({
          title: "Could not create share link",
          description: status === 403 ? "Share requires staff access. Contact your admin." : msg || "Please try again or contact support if the problem persists.",
          color: "error"
        });
      } finally {
        shareLoading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_DashboardSectionCard = __nuxt_component_4$1;
      const _component_UBadge = _sfc_main$4;
      const _component_EditorRichTextDisplay = __nuxt_component_6;
      const _component_QuotesQuoteCalculator = __nuxt_component_7;
      const _component_QuotesQuoteItemList = __nuxt_component_8;
      const _component_QuotesQuoteShareModal = __nuxt_component_9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: `Quote #${unref(id)}`,
        subtitle: unref(slug)
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "outline",
              size: "sm",
              loading: unref(shareLoading),
              disabled: unref(shareLoading),
              onClick: handleShare
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-share-2",
                    class: "w-4 h-4 mr-1"
                  }, null, _parent3, _scopeId2));
                  _push3(` Share `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-share-2",
                      class: "w-4 h-4 mr-1"
                    }),
                    createTextVNode(" Share ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}/quotes`,
              variant: "soft",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back`);
                } else {
                  return [
                    createTextVNode("Back")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                variant: "outline",
                size: "sm",
                loading: unref(shareLoading),
                disabled: unref(shareLoading),
                onClick: handleShare
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-share-2",
                    class: "w-4 h-4 mr-1"
                  }),
                  createTextVNode(" Share ")
                ]),
                _: 1
              }, 8, ["loading", "disabled"]),
              createVNode(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/quotes`,
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back")
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(quoteStore).loading) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent));
      } else if (unref(quoteStore).currentQuote) {
        _push(`<!--[--><div class="col-span-12 grid gap-6 lg:grid-cols-2">`);
        _push(ssrRenderComponent(_component_DashboardSectionCard, { title: "Details" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-2"${_scopeId}><p${_scopeId}><span class="text-gray-500 dark:text-gray-400"${_scopeId}>Customer:</span> ${ssrInterpolate(unref(quoteStore).currentQuote.customer_name)}</p><p${_scopeId}><span class="text-gray-500 dark:text-gray-400"${_scopeId}>Email:</span> ${ssrInterpolate(unref(quoteStore).currentQuote.customer_email)}</p><p${_scopeId}><span class="text-gray-500 dark:text-gray-400"${_scopeId}>Status:</span> `);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: unref(statusColor),
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(quoteStore).currentQuote.status)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(quoteStore).currentQuote.status), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</p><p class="font-semibold text-gray-900 dark:text-white"${_scopeId}>Total: ${ssrInterpolate(unref(quoteStore).currentQuote.total)}</p>`);
              if (unref(quoteStore).currentQuote.notes) {
                _push2(`<div class="pt-2 border-t border-gray-200 dark:border-gray-700"${_scopeId}><p class="text-sm text-gray-500 dark:text-gray-400 mb-1"${_scopeId}>Notes</p>`);
                _push2(ssrRenderComponent(_component_EditorRichTextDisplay, {
                  html: unref(quoteStore).currentQuote.notes
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("p", null, [
                    createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Customer:"),
                    createTextVNode(" " + toDisplayString(unref(quoteStore).currentQuote.customer_name), 1)
                  ]),
                  createVNode("p", null, [
                    createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Email:"),
                    createTextVNode(" " + toDisplayString(unref(quoteStore).currentQuote.customer_email), 1)
                  ]),
                  createVNode("p", null, [
                    createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Status:"),
                    createTextVNode(),
                    createVNode(_component_UBadge, {
                      color: unref(statusColor),
                      variant: "soft",
                      size: "sm"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(quoteStore).currentQuote.status), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])
                  ]),
                  createVNode("p", { class: "font-semibold text-gray-900 dark:text-white" }, "Total: " + toDisplayString(unref(quoteStore).currentQuote.total), 1),
                  unref(quoteStore).currentQuote.notes ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "pt-2 border-t border-gray-200 dark:border-gray-700"
                  }, [
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400 mb-1" }, "Notes"),
                    createVNode(_component_EditorRichTextDisplay, {
                      html: unref(quoteStore).currentQuote.notes
                    }, null, 8, ["html"])
                  ])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_QuotesQuoteCalculator, { totals: unref(totals) }, null, _parent));
        _push(`</div><div class="col-span-12">`);
        _push(ssrRenderComponent(_component_QuotesQuoteItemList, { items: unref(quoteItems) }, null, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(_component_QuotesQuoteShareModal, {
          open: unref(shareModalOpen),
          "onUpdate:open": ($event) => isRef(shareModalOpen) ? shareModalOpen.value = $event : null,
          "share-url": unref(shareResult)?.share_url ?? "",
          "whatsapp-text": unref(conciseWhatsAppText)
        }, null, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/quotes/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BabLRJH9.mjs.map
