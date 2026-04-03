import { _ as __nuxt_component_0 } from './DashboardPageHeader-Cmi_LCe-.mjs';
import { f as useRoute, b as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$2 } from './Badge-Dn_IFHF_.mjs';
import { defineComponent, computed, ref, reactive, watch, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderStyle, ssrRenderClass } from 'vue/server-renderer';
import { f as formatCurrency } from './formatters-FW8HHCjc.mjs';
import { updateQuoteDraftFile, downloadQuoteDraftFilePdf, previewQuoteDraftFileWhatsapp, downloadQuoteDraftPdf, requestQuote, getQuoteDraftFile, previewPrice } from './quoteDraft-5mvcgeM-.mjs';
import { u as useApi } from './useApi-Cs2GTEbX.mjs';
import { s as setInterval } from './interval-DiSDr_Za.mjs';
import { _ as __nuxt_component_5$1 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { g as getWhatsAppShareUrl } from './quoteMessage-Bmp83pcs.mjs';
import { u as useNotification } from './useNotification-DxMfmZhF.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "QuotePreviewPrice",
  __ssrInlineRender: true,
  props: {
    draftId: {},
    hasItems: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const api = useApi();
    const result = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const revealedLines = ref([]);
    const showTotal = ref(false);
    const calculatingText = ref("Tuna-calculate…");
    const messages = ["Tuna-calculate…", "Calculating quote…"];
    let messageInterval = null;
    function startCalculatingMessages() {
      calculatingText.value = messages[0];
      messageInterval = setInterval();
    }
    function stopCalculatingMessages() {
      if (messageInterval) {
        clearInterval(messageInterval);
        messageInterval = null;
      }
    }
    async function revealLinesProgressive(lines) {
      revealedLines.value = [];
      showTotal.value = false;
      for (let i = 0; i < lines.length; i++) {
        await new Promise((r) => setTimeout(r, 100));
        revealedLines.value = [...lines.slice(0, i + 1)];
      }
      await new Promise((r) => setTimeout(r, 200));
      showTotal.value = true;
    }
    async function calculate() {
      if (!props.draftId || !props.hasItems) return;
      loading.value = true;
      error.value = null;
      result.value = null;
      revealedLines.value = [];
      showTotal.value = false;
      const minDelay = 3e3 + Math.random() * 3e3;
      startCalculatingMessages();
      const apiPromise = previewPrice(props.draftId, api);
      const delayPromise = new Promise((r) => setTimeout(r, minDelay));
      try {
        const [apiResult] = await Promise.all([apiPromise, delayPromise]);
        result.value = apiResult;
        stopCalculatingMessages();
        await revealLinesProgressive(apiResult.lines);
      } catch (err) {
        stopCalculatingMessages();
        error.value = err instanceof Error ? err.message : "Failed to calculate";
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-stone-900 overflow-hidden" }, _attrs))}><div class="px-6 py-4 border-b border-amber-200/60 dark:border-amber-800/40"><h3 class="font-semibold text-stone-800 dark:text-stone-100">Price preview</h3>`);
      if (!unref(result) && !unref(error)) {
        _push(`<p class="text-sm text-stone-500 dark:text-stone-400"> Get an estimate for your draft </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="p-6">`);
      if (unref(loading)) {
        _push(`<!--[--><p class="text-amber-600 dark:text-amber-400 font-medium mb-4">${ssrInterpolate(unref(calculatingText))}</p><div class="space-y-3"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="h-5 rounded bg-amber-100/80 dark:bg-amber-900/30 animate-pulse" style="${ssrRenderStyle({ width: `${60 + i % 3 * 15}%` })}"></div>`);
        });
        _push(`<!--]--></div><!--]-->`);
      } else if (unref(error)) {
        _push(`<p class="text-red-600 dark:text-red-400 text-sm">${ssrInterpolate(unref(error))}</p>`);
      } else if (unref(result)) {
        _push(`<!--[--><div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(revealedLines), (line, idx) => {
          _push(`<div class="${ssrRenderClass([{ "pl-3": line.amount && idx > 0 }, "flex justify-between text-sm"])}"><span class="text-stone-600 dark:text-stone-400">${ssrInterpolate(line.label)}</span>`);
          if (line.amount) {
            _push(`<span class="font-medium text-stone-800 dark:text-stone-100 tabular-nums">${ssrInterpolate(unref(formatCurrency)(line.amount, unref(result).currency))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
        if (!unref(result).can_calculate && unref(result).reason) {
          _push(`<div class="mt-4 pt-4 border-t border-amber-200/60 dark:border-amber-800/40"><p class="text-sm font-medium text-red-600 dark:text-red-400">${ssrInterpolate(unref(result).reason)}</p>`);
          if (unref(result).suggestions?.[0]?.message) {
            _push(`<p class="mt-1 text-xs text-stone-600 dark:text-stone-400">${ssrInterpolate(unref(result).suggestions[0].message)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else if (unref(showTotal)) {
          _push(`<div class="mt-4 pt-4 border-t border-amber-200/60 dark:border-amber-800/40 flex justify-between font-semibold text-stone-800 dark:text-stone-100"><span>Total</span><span class="tabular-nums">${ssrInterpolate(unref(formatCurrency)(unref(result).total, unref(result).currency))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(result).hasNegotiable) {
          _push(`<p class="mt-2 text-xs text-stone-500 dark:text-stone-400"> Some charges are negotiable. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(loading) && (!unref(result) || __props.hasItems)) {
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          class: "mt-4",
          disabled: !__props.draftId || !__props.hasItems,
          onClick: calculate
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-calculator",
                class: "mr-2 h-4 w-4"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(result) ? "Recalculate" : "Calculate")}`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-calculator",
                  class: "mr-2 h-4 w-4"
                }),
                createTextVNode(" " + toDisplayString(unref(result) ? "Recalculate" : "Calculate"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/QuotePreviewPrice.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$1, { __name: "QuotesQuotePreviewPrice" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const api = useApi();
    const notification = useNotification();
    const fileId = computed(() => Number(route.params.id));
    const activeFile = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const savingFile = ref(false);
    const loadingShare = ref(false);
    const submittingDraftId = ref(null);
    const downloadingFilePdf = ref(false);
    const downloadingDraftId = ref(null);
    const fileForm = reactive({
      company_name: "",
      contact_name: "",
      contact_email: "",
      contact_phone: ""
    });
    watch(activeFile, (file) => {
      fileForm.company_name = file?.company_name ?? "";
      fileForm.contact_name = file?.contact_name ?? "";
      fileForm.contact_email = file?.contact_email ?? "";
      fileForm.contact_phone = file?.contact_phone ?? "";
    }, { immediate: true });
    function statusLabel(status) {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }
    function statusColor(status) {
      if (status === "accepted") return "success";
      if (status === "quoted" || status === "submitted" || status === "viewed") return "warning";
      if (status === "cancelled" || status === "closed") return "error";
      return "neutral";
    }
    async function loadFile() {
      if (!Number.isFinite(fileId.value)) return;
      loading.value = true;
      error.value = null;
      try {
        activeFile.value = await getQuoteDraftFile(fileId.value, api, "dashboard");
      } catch (err) {
        error.value = err instanceof Error ? err.message : "Failed to load quote file";
        activeFile.value = null;
      } finally {
        loading.value = false;
      }
    }
    async function saveFile() {
      if (!activeFile.value) return;
      savingFile.value = true;
      try {
        activeFile.value = await updateQuoteDraftFile(activeFile.value.id, {
          company_name: fileForm.company_name,
          contact_name: fileForm.contact_name,
          contact_email: fileForm.contact_email,
          contact_phone: fileForm.contact_phone
        }, api);
        await loadFile();
        notification.success("Quote file updated");
      } catch (err) {
        notification.error(err instanceof Error ? err.message : "Could not save quote file");
      } finally {
        savingFile.value = false;
      }
    }
    async function downloadPdf() {
      if (!activeFile.value) return;
      downloadingFilePdf.value = true;
      try {
        const blob = await downloadQuoteDraftFilePdf(activeFile.value.id, api, "dashboard");
        triggerBlobDownload(blob, `quote-file-${activeFile.value.id}.pdf`);
      } catch (err) {
        notification.error(err instanceof Error ? err.message : "Could not download PDF");
      } finally {
        downloadingFilePdf.value = false;
      }
    }
    async function shareOnWhatsApp() {
      if (!activeFile.value) return;
      loadingShare.value = true;
      try {
        const { message } = await previewQuoteDraftFileWhatsapp(activeFile.value.id, api);
        (void 0).open(getWhatsAppShareUrl(message, activeFile.value.contact_phone), "_blank", "noopener,noreferrer");
      } catch (err) {
        notification.error(err instanceof Error ? err.message : "Could not prepare WhatsApp message");
      } finally {
        loadingShare.value = false;
      }
    }
    async function submitGroup(group) {
      submittingDraftId.value = group.draft_id;
      try {
        await requestQuote(group.draft_id, api);
        await loadFile();
        notification.success(`${group.shop_name} draft submitted`);
      } catch (err) {
        notification.error(err instanceof Error ? err.message : "Could not submit shop draft");
      } finally {
        submittingDraftId.value = null;
      }
    }
    async function downloadShopPdf(group) {
      downloadingDraftId.value = group.draft_id;
      try {
        const blob = await downloadQuoteDraftPdf(group.draft_id);
        triggerBlobDownload(blob, `${group.shop_slug}-quote-section.pdf`);
      } catch (err) {
        notification.error(err instanceof Error ? err.message : "Could not download shop PDF");
      } finally {
        downloadingDraftId.value = null;
      }
    }
    function triggerBlobDownload(blob, filename) {
      const url = URL.createObjectURL(blob);
      const anchor = (void 0).createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_UIcon = _sfc_main$f;
      const _component_UBadge = _sfc_main$2;
      const _component_QuotesQuotePreviewPrice = __nuxt_component_5;
      const _component_DashboardEmptyState = __nuxt_component_5$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: unref(activeFile)?.customer_name || unref(activeFile)?.company_name || `Quote File #${unref(fileId)}`,
        subtitle: "One customer/company file with shop-specific quote sections."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              size: "sm",
              to: "/dashboard/quotes"
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
                variant: "soft",
                size: "sm",
                to: "/dashboard/quotes"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(loading) && !unref(activeFile)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"><p class="text-sm text-red-700 dark:text-red-300">${ssrInterpolate(unref(error))}</p></div>`);
      } else if (unref(activeFile)) {
        _push(`<!--[--><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6"><div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div class="grid flex-1 gap-4 md:grid-cols-2"><label class="block"><span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Company / customer</span><input${ssrRenderAttr("value", unref(fileForm).company_name)} type="text" class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-3 text-[var(--p-text)] outline-none transition focus:border-[var(--p-primary)] focus:ring-2 focus:ring-[var(--p-primary)]/15"></label><label class="block"><span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Contact name</span><input${ssrRenderAttr("value", unref(fileForm).contact_name)} type="text" class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-3 text-[var(--p-text)] outline-none transition focus:border-[var(--p-primary)] focus:ring-2 focus:ring-[var(--p-primary)]/15"></label><label class="block"><span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Email</span><input${ssrRenderAttr("value", unref(fileForm).contact_email)} type="email" class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-3 text-[var(--p-text)] outline-none transition focus:border-[var(--p-primary)] focus:ring-2 focus:ring-[var(--p-primary)]/15"></label><label class="block"><span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Phone</span><input${ssrRenderAttr("value", unref(fileForm).contact_phone)} type="text" class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-3 text-[var(--p-text)] outline-none transition focus:border-[var(--p-primary)] focus:ring-2 focus:ring-[var(--p-primary)]/15"></label></div><div class="flex flex-wrap gap-3">`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          loading: unref(savingFile),
          onClick: saveFile
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Save`);
            } else {
              return [
                createTextVNode("Save")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          variant: "soft",
          color: "neutral",
          loading: unref(downloadingFilePdf),
          onClick: downloadPdf
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: unref(downloadingFilePdf) ? "i-lucide-loader-circle" : "i-lucide-download",
                class: ["mr-2 h-4 w-4", { "animate-spin": unref(downloadingFilePdf) }]
              }, null, _parent2, _scopeId));
              _push2(` Download PDF `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: unref(downloadingFilePdf) ? "i-lucide-loader-circle" : "i-lucide-download",
                  class: ["mr-2 h-4 w-4", { "animate-spin": unref(downloadingFilePdf) }]
                }, null, 8, ["name", "class"]),
                createTextVNode(" Download PDF ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          variant: "soft",
          color: "neutral",
          loading: unref(loadingShare),
          onClick: shareOnWhatsApp
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: unref(loadingShare) ? "i-lucide-loader-circle" : "i-lucide-message-circle",
                class: ["mr-2 h-4 w-4", { "animate-spin": unref(loadingShare) }]
              }, null, _parent2, _scopeId));
              _push2(` Share on WhatsApp `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: unref(loadingShare) ? "i-lucide-loader-circle" : "i-lucide-message-circle",
                  class: ["mr-2 h-4 w-4", { "animate-spin": unref(loadingShare) }]
                }, null, 8, ["name", "class"]),
                createTextVNode(" Share on WhatsApp ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
        if (unref(activeFile).shop_groups.length) {
          _push(`<div class="space-y-6"><!--[-->`);
          ssrRenderList(unref(activeFile).shop_groups, (group) => {
            _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6"><div class="flex flex-col gap-4 border-b border-[var(--p-border)] pb-5 lg:flex-row lg:items-start lg:justify-between"><div><div class="flex flex-wrap items-center gap-3"><h2 class="text-2xl font-semibold text-[var(--p-text)]">${ssrInterpolate(group.shop_name)}</h2>`);
            _push(ssrRenderComponent(_component_UBadge, {
              color: statusColor(group.status),
              variant: "soft"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(statusLabel(group.status))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(statusLabel(group.status)), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(group.item_count)} item${ssrInterpolate(group.item_count === 1 ? "" : "s")} in this shop section. </p>`);
            if (group.latest_sent_quote?.turnaround_hours || group.latest_sent_quote?.human_ready_text) {
              _push(`<p class="mt-1 text-sm text-[var(--p-text-muted)]"> Turnaround: ${ssrInterpolate(group.latest_sent_quote?.human_ready_text || `${group.latest_sent_quote?.turnaround_hours} working hour(s)`)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="flex flex-wrap gap-3">`);
            _push(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              color: "neutral",
              loading: unref(downloadingDraftId) === group.draft_id,
              onClick: ($event) => downloadShopPdf(group)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: unref(downloadingDraftId) === group.draft_id ? "i-lucide-loader-circle" : "i-lucide-download",
                    class: ["mr-2 h-4 w-4", { "animate-spin": unref(downloadingDraftId) === group.draft_id }]
                  }, null, _parent2, _scopeId));
                  _push2(` Shop PDF `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: unref(downloadingDraftId) === group.draft_id ? "i-lucide-loader-circle" : "i-lucide-download",
                      class: ["mr-2 h-4 w-4", { "animate-spin": unref(downloadingDraftId) === group.draft_id }]
                    }, null, 8, ["name", "class"]),
                    createTextVNode(" Shop PDF ")
                  ];
                }
              }),
              _: 2
            }, _parent));
            if (group.can_submit) {
              _push(ssrRenderComponent(_component_UButton, {
                color: "primary",
                loading: unref(submittingDraftId) === group.draft_id,
                onClick: ($event) => submitGroup(group)
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-send",
                      class: "mr-2 h-4 w-4"
                    }, null, _parent2, _scopeId));
                    _push2(` Submit `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-send",
                        class: "mr-2 h-4 w-4"
                      }),
                      createTextVNode(" Submit ")
                    ];
                  }
                }),
                _: 2
              }, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div><div class="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]"><div class="space-y-4"><!--[-->`);
            ssrRenderList(group.items, (item) => {
              _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-4"><div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div class="min-w-0"><h3 class="text-base font-semibold text-[var(--p-text)]">${ssrInterpolate(item.product_name || item.title || "Quote item")}</h3><p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">${ssrInterpolate(item.spec_text || item.special_instructions || "Saved configuration for this shop section.")}</p></div><div class="text-left md:text-right"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Line total</p><p class="mt-1 text-lg font-bold text-[var(--p-text)]">${ssrInterpolate(item.line_total ? unref(formatCurrency)(item.line_total, group.shop_currency) : "Pending")}</p></div></div></article>`);
            });
            _push(`<!--]--></div><div class="space-y-4"><article class="rounded-2xl bg-[var(--p-surface-container-low)] p-5"><h3 class="text-base font-semibold text-[var(--p-text)]">Shop total</h3><p class="mt-3 text-2xl font-extrabold text-[var(--p-text)]">${ssrInterpolate(unref(formatCurrency)(group.latest_sent_quote?.total || group.total || group.subtotal, group.shop_currency))}</p><p class="mt-2 text-sm text-[var(--p-text-muted)]"> Recalculation stays scoped to ${ssrInterpolate(group.shop_name)}. </p></article>`);
            if (group.can_recalculate) {
              _push(ssrRenderComponent(_component_QuotesQuotePreviewPrice, {
                "draft-id": group.draft_id,
                "has-items": group.item_count > 0
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></article>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(ssrRenderComponent(_component_DashboardEmptyState, {
            title: "No shop sections yet",
            description: "Attach a shop to this quote file to start adding shop-specific quote items.",
            icon: "i-lucide-store"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UButton, {
                  to: "/shops",
                  color: "primary"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Browse shops`);
                    } else {
                      return [
                        createTextVNode("Browse shops")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UButton, {
                    to: "/shops",
                    color: "primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Browse shops")
                    ]),
                    _: 1
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
        }
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/quotes/files/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-D7flBA9c.mjs.map
