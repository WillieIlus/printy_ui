import { f as useRoute, _ as __nuxt_component_1, a as _sfc_main$f, b as _sfc_main$9 } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$1 } from './Badge-Dn_IFHF_.mjs';
import { defineComponent, computed, ref, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { useI18n } from 'vue-i18n';
import { a as formatDate } from './formatters-FW8HHCjc.mjs';
import { u as usePublicJob } from './useJobRequests-DiMv7taT.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[token]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    computed(() => String(route.params.token));
    usePublicJob();
    const job = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const { t } = useI18n();
    const loginUrl = computed(() => `/auth/login?redirect=${encodeURIComponent(route.fullPath)}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_UBadge = _sfc_main$1;
      const _component_UButton = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)] p-4 sm:p-6" }, _attrs))}><div class="max-w-xl mx-auto">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex items-center gap-2 text-sm text-[var(--p-text-muted)] hover:text-[var(--p-text)] mb-6"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-left",
              class: "w-4 h-4"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("jobs.actions.backToPrinty"))}`);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "w-4 h-4"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("jobs.actions.backToPrinty")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(loading) && !unref(job)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6"><p class="text-sm text-red-700 dark:text-red-300">${ssrInterpolate(unref(error))}</p></div>`);
      } else if (unref(job)) {
        _push(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 space-y-6"><div><h1 class="text-xl font-bold text-[var(--p-text)]">${ssrInterpolate(unref(job).title)}</h1>`);
        if (unref(job).status) {
          _push(ssrRenderComponent(_component_UBadge, {
            color: unref(job).status === "OPEN" ? "success" : "neutral",
            variant: "soft",
            class: "mt-2"
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
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(job).location) {
          _push(`<div class="text-sm"><span class="text-[var(--p-text-muted)]">${ssrInterpolate(unref(t)("common.location"))}:</span><span class="text-[var(--p-text)] ml-2">${ssrInterpolate(unref(job).location)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(job).deadline) {
          _push(`<div class="text-sm"><span class="text-[var(--p-text-muted)]">${ssrInterpolate(unref(t)("common.deadline"))}:</span><span class="text-[var(--p-text)] ml-2">${ssrInterpolate(unref(formatDate)(unref(job).deadline))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (Object.keys(unref(job).specs || {}).length) {
          _push(`<div class="space-y-2"><p class="text-sm font-medium text-[var(--p-text-muted)]">${ssrInterpolate(unref(t)("common.specs"))}</p><ul class="space-y-1 text-sm"><!--[-->`);
          ssrRenderList(unref(job).specs, (v, k) => {
            _push(`<li class="flex gap-2"><span class="text-[var(--p-text-dim)] capitalize">${ssrInterpolate(k)}:</span><span class="text-[var(--p-text)]">${ssrInterpolate(v)}</span></li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="pt-4 border-t border-[var(--p-border)]"><p class="text-sm text-[var(--p-text-muted)] mb-3">${ssrInterpolate(unref(t)("jobs.actions.claimThisJob"))}</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          to: unref(loginUrl)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-log-in",
                class: "w-4 h-4 mr-2"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(t)("jobs.actions.signInToClaim"))}`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-log-in",
                  class: "w-4 h-4 mr-2"
                }),
                createTextVNode(" " + toDisplayString(unref(t)("jobs.actions.signInToClaim")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/public/job/[token].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_token_-iFjjfCoV.mjs.map
