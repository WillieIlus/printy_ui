import { _ as __nuxt_component_0 } from './DashboardPageHeader-By409uiV.mjs';
import { f as useRoute, d as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$1 } from './Badge-C1UUP90f.mjs';
import { _ as _sfc_main$2 } from './FormField-ChkzAQqB.mjs';
import { _ as _sfc_main$3 } from './Textarea-BGCp2SzO.mjs';
import { _ as _sfc_main$4 } from './Input-DZEAnFef.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { useI18n } from 'vue-i18n';
import { f as formatDate } from './formatters-Cc_7PG6h.mjs';
import { g as getWhatsAppShareUrl } from './quoteMessage-Bmp83pcs.mjs';
import { a as useJobRequests, b as useJobClaims } from './useJobRequests-BRamYsxq.mjs';
import { u as useAuth } from './useAuth-DnD-pi_T.mjs';
import { u as useNotification } from './useNotification-DxMfmZhF.mjs';
import { u as useCurrencyFormatter } from './useCurrencyFormatter-BbngrNPq.mjs';
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
import './profile-BFvViN4V.mjs';
import './shop-DfXxeXDQ.mjs';
import './browser-storage-CN-SIF_V.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const id = computed(() => Number(route.params.id));
    const jobRequests = useJobRequests();
    const jobClaims = useJobClaims();
    const { user } = useAuth();
    const notification = useNotification();
    const { t } = useI18n();
    const job = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const shareMessage = ref("");
    const shareUrl = ref("");
    const loadingShare = ref(false);
    const showClaimForm = ref(false);
    const claimMessage = ref("");
    const claimPrice = ref("");
    const claiming = ref(false);
    const { formatMoney } = useCurrencyFormatter();
    const isOwner = computed(() => job.value && user.value && job.value.created_by === user.value.id);
    const canClaim = computed(
      () => job.value?.status === "OPEN" && user.value && job.value.created_by !== user.value.id && !job.value.claims?.some((c) => c.claimed_by === user.value?.id)
    );
    function statusColor(s) {
      const m = {
        OPEN: "success",
        CLAIMED: "neutral",
        CLOSED: "error"
      };
      return m[s] ?? "neutral";
    }
    function claimStatusColor(s) {
      const m = {
        PENDING: "neutral",
        ACCEPTED: "success",
        REJECTED: "error"
      };
      return m[s] ?? "neutral";
    }
    async function onAcceptClaim(claimId) {
      try {
        await jobClaims.accept(claimId);
        notification.success(t("jobs.feedback.claimAccepted"));
        await fetchJob();
      } catch (e) {
        notification.error(e instanceof Error ? e.message : t("jobs.feedback.acceptFailed"));
      }
    }
    async function onRejectClaim(claimId) {
      try {
        await jobClaims.reject(claimId);
        notification.success(t("jobs.feedback.claimRejected"));
        await fetchJob();
      } catch (e) {
        notification.error(e instanceof Error ? e.message : t("jobs.feedback.rejectFailed"));
      }
    }
    async function fetchJob() {
      loading.value = true;
      error.value = null;
      try {
        job.value = await jobRequests.get(id.value);
      } catch (e) {
        error.value = e instanceof Error ? e.message : t("jobs.feedback.loadJobFailed");
        job.value = null;
      } finally {
        loading.value = false;
      }
    }
    async function onShare() {
      loadingShare.value = true;
      try {
        const res = await jobRequests.whatsappShare(id.value);
        shareMessage.value = res.message;
        shareUrl.value = res.public_view_url;
        notification.success(t("jobs.feedback.shareLinkReady"));
      } catch (e) {
        notification.error(e instanceof Error ? e.message : t("jobs.feedback.shareFailed"));
      } finally {
        loadingShare.value = false;
      }
    }
    async function onCopy() {
      if (!shareMessage.value) return;
      const text = shareUrl.value ? `${shareMessage.value}

${shareUrl.value}` : shareMessage.value;
      try {
        await (void 0).clipboard.writeText(text);
        notification.success(t("jobs.feedback.copied"));
      } catch {
        notification.error(t("jobs.feedback.copyFailed"));
      }
    }
    function onOpenWhatsApp() {
      if (!shareMessage.value) return;
      const text = shareUrl.value ? `${shareMessage.value}

${shareUrl.value}` : shareMessage.value;
      const url = getWhatsAppShareUrl(text);
      (void 0).open(url, "_blank", "noopener,noreferrer");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_UBadge = _sfc_main$1;
      const _component_UIcon = _sfc_main$f;
      const _component_UFormField = _sfc_main$2;
      const _component_UTextarea = _sfc_main$3;
      const _component_UInput = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: unref(job)?.title ?? unref(t)("jobs.requestFallbackTitle"),
        subtitle: unref(job)?.location || unref(t)("jobs.requestFallbackSubtitle")
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              size: "sm",
              to: "/dashboard/jobs"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("common.back"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("common.back")), 1)
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
                to: "/dashboard/jobs"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(t)("common.back")), 1)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(loading) && !unref(job)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4"><p class="text-sm text-red-700 dark:text-red-300">${ssrInterpolate(unref(error))}</p></div>`);
      } else if (unref(job)) {
        _push(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 space-y-4"><div class="flex justify-between items-start">`);
        _push(ssrRenderComponent(_component_UBadge, {
          color: statusColor(unref(job).status),
          variant: "soft"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)(`jobs.status.${unref(job).status}`))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)(`jobs.status.${unref(job).status}`)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(job).deadline) {
          _push(`<span class="text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(t)("common.deadline"))}: ${ssrInterpolate(unref(formatDate)(unref(job).deadline))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (Object.keys(unref(job).specs || {}).length) {
          _push(`<div class="text-sm"><p class="font-medium text-[var(--p-text-muted)] mb-2">${ssrInterpolate(unref(t)("common.specs"))}</p><ul class="space-y-1"><!--[-->`);
          ssrRenderList(unref(job).specs, (v, k) => {
            _push(`<li class="flex gap-2"><span class="text-[var(--p-text-dim)] capitalize">${ssrInterpolate(k)}:</span><span class="text-[var(--p-text)]">${ssrInterpolate(v)}</span></li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(canClaim)) {
          _push(`<div class="pt-4 border-t border-[var(--p-border)]"><p class="text-sm font-medium text-[var(--p-text-muted)] mb-2">${ssrInterpolate(unref(t)("jobs.actions.claimThisJob"))}</p>`);
          if (!unref(showClaimForm)) {
            _push(`<div class="flex gap-2">`);
            _push(ssrRenderComponent(_component_UButton, {
              color: "primary",
              size: "sm",
              onClick: ($event) => showClaimForm.value = true
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-hand",
                    class: "w-4 h-4 mr-2"
                  }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(unref(t)("jobs.actions.claimThisJob"))}`);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-hand",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("jobs.actions.claimThisJob")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`</div>`);
          } else {
            _push(`<form class="space-y-3 max-w-md">`);
            _push(ssrRenderComponent(_component_UFormField, {
              label: unref(t)("jobs.fields.messageOptional")
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_UTextarea, {
                    modelValue: unref(claimMessage),
                    "onUpdate:modelValue": ($event) => isRef(claimMessage) ? claimMessage.value = $event : null,
                    placeholder: unref(t)("jobs.placeholders.message"),
                    rows: 2
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_UTextarea, {
                      modelValue: unref(claimMessage),
                      "onUpdate:modelValue": ($event) => isRef(claimMessage) ? claimMessage.value = $event : null,
                      placeholder: unref(t)("jobs.placeholders.message"),
                      rows: 2
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(ssrRenderComponent(_component_UFormField, {
              label: unref(t)("jobs.fields.priceOfferOptional")
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(claimPrice),
                    "onUpdate:modelValue": ($event) => isRef(claimPrice) ? claimPrice.value = $event : null,
                    type: "number",
                    placeholder: unref(t)("jobs.placeholders.price")
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(claimPrice),
                      "onUpdate:modelValue": ($event) => isRef(claimPrice) ? claimPrice.value = $event : null,
                      type: "number",
                      placeholder: unref(t)("jobs.placeholders.price")
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`<div class="flex gap-2">`);
            _push(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              size: "sm",
              loading: unref(claiming)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(unref(t)("jobs.actions.submitClaim"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("jobs.actions.submitClaim")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              size: "sm",
              onClick: ($event) => showClaimForm.value = false
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(unref(t)("common.cancel"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("common.cancel")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`</div></form>`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(isOwner) && (unref(job).claims?.length ?? 0) > 0) {
          _push(`<div class="pt-4 border-t border-[var(--p-border)]"><p class="text-sm font-medium text-[var(--p-text-muted)] mb-2">${ssrInterpolate(unref(t)("jobs.labels.claims"))}</p><div class="space-y-2"><!--[-->`);
          ssrRenderList(unref(job).claims, (c) => {
            _push(`<div class="flex items-center justify-between gap-2 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3"><div class="min-w-0"><p class="text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(c.claimed_by_email)}</p>`);
            if (c.message) {
              _push(`<p class="text-xs text-[var(--p-text-muted)] truncate">${ssrInterpolate(c.message)}</p>`);
            } else {
              _push(`<!---->`);
            }
            if (c.price_offered) {
              _push(`<p class="text-xs text-[var(--p-text-dim)]">${ssrInterpolate(unref(formatMoney)(c.price_offered))}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="flex items-center gap-2 shrink-0">`);
            _push(ssrRenderComponent(_component_UBadge, {
              color: claimStatusColor(c.status),
              variant: "soft",
              size: "xs"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(unref(t)(`jobs.claimStatus.${c.status}`))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)(`jobs.claimStatus.${c.status}`)), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            if (c.status === "PENDING") {
              _push(`<!--[-->`);
              _push(ssrRenderComponent(_component_UButton, {
                size: "xs",
                color: "success",
                onClick: ($event) => onAcceptClaim(c.id)
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(unref(t)("jobs.actions.accept"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(t)("jobs.actions.accept")), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
              _push(ssrRenderComponent(_component_UButton, {
                size: "xs",
                variant: "soft",
                color: "error",
                onClick: ($event) => onRejectClaim(c.id)
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(unref(t)("jobs.actions.reject"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(t)("jobs.actions.reject")), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
              _push(`<!--]-->`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="pt-4 border-t border-[var(--p-border)]"><p class="text-sm font-medium text-[var(--p-text-muted)] mb-2">${ssrInterpolate(unref(t)("jobs.labels.share"))}</p>`);
        if (unref(shareMessage)) {
          _push(`<div class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3 mb-3"><p class="text-sm text-[var(--p-text)] whitespace-pre-wrap font-mono">${ssrInterpolate(unref(shareMessage))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-wrap gap-2">`);
        _push(ssrRenderComponent(_component_UButton, {
          variant: "soft",
          size: "sm",
          loading: unref(loadingShare),
          onClick: onShare
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-message-circle",
                class: "w-4 h-4 mr-2"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(shareMessage) ? unref(t)("common.refresh") : unref(t)("jobs.actions.shareOnWhatsApp"))}`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-message-circle",
                  class: "w-4 h-4 mr-2"
                }),
                createTextVNode(" " + toDisplayString(unref(shareMessage) ? unref(t)("common.refresh") : unref(t)("jobs.actions.shareOnWhatsApp")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(shareMessage)) {
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            onClick: onCopy
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-copy",
                  class: "w-4 h-4 mr-2"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(unref(t)("common.copy"))}`);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-copy",
                    class: "w-4 h-4 mr-2"
                  }),
                  createTextVNode(" " + toDisplayString(unref(t)("common.copy")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(shareMessage)) {
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            onClick: onOpenWhatsApp
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-external-link",
                  class: "w-4 h-4 mr-2"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(unref(t)("jobs.actions.openWhatsApp"))}`);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-external-link",
                    class: "w-4 h-4 mr-2"
                  }),
                  createTextVNode(" " + toDisplayString(unref(t)("jobs.actions.openWhatsApp")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/jobs/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BMdcBAZi.mjs.map
