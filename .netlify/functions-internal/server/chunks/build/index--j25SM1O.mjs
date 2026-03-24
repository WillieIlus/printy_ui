import { _ as __nuxt_component_0 } from './DashboardPageHeader-5_E3NIzR.mjs';
import { _ as _sfc_main$1 } from './Badge-xP9ZTQag.mjs';
import { a as _sfc_main$f, d as _sfc_main$9, _ as __nuxt_component_3$1 } from './server.mjs';
import { defineComponent, computed, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { u as useSetupStatus } from './useSetupStatus-ioR4SSE7.mjs';
import { u as useAdminWorkspace, a as useSetupChecklist } from './useAdminWorkspace-CXLeD_Ju.mjs';
import 'reka-ui';
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
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './seller-D7njK1DD.mjs';
import './seller-0ju7O3tf.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { status: setupStatus } = useSetupStatus();
    const { selectedShop } = useAdminWorkspace();
    const {
      items: checklistItems,
      summary,
      progressPercent,
      nextRequiredItem
    } = useSetupChecklist();
    const metrics = computed(() => [
      {
        label: "Shop",
        value: selectedShop.value ? "1 active" : "0",
        note: selectedShop.value ? "You are working inside one shop workspace at a time." : "Create a shop to begin setup.",
        icon: "i-lucide-store"
      },
      {
        label: "Machines",
        value: setupStatus.value?.has_machines ? "Ready" : "Missing",
        note: "Machine setup controls equipment-aware pricing and product routing.",
        icon: "i-lucide-printer"
      },
      {
        label: "Pricing",
        value: setupStatus.value?.has_pricing ? "Ready" : "Missing",
        note: "Pricing lives in its own section instead of being repeated elsewhere.",
        icon: "i-lucide-banknote"
      },
      {
        label: "Products",
        value: setupStatus.value?.has_published_products ? "Ready" : "Missing",
        note: "Products remain contextual to the product page and publish flow.",
        icon: "i-lucide-package"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UBadge = _sfc_main$1;
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      const _component_NuxtLink = __nuxt_component_3$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Overview",
        subtitle: "A calmer admin workspace. Pick a section from the left and work there."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mt-2 flex flex-wrap gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              color: "neutral",
              variant: "soft"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(selectedShop) ? unref(selectedShop).name : "No shop selected")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(selectedShop) ? unref(selectedShop).name : "No shop selected"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UBadge, {
              color: unref(setupStatus)?.next_step === "done" ? "success" : "warning",
              variant: "soft"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(setupStatus)?.next_step === "done" ? "Setup complete" : "Setup in progress")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(setupStatus)?.next_step === "done" ? "Setup complete" : "Setup in progress"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mt-2 flex flex-wrap gap-2" }, [
                createVNode(_component_UBadge, {
                  color: "neutral",
                  variant: "soft"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(selectedShop) ? unref(selectedShop).name : "No shop selected"), 1)
                  ]),
                  _: 1
                }),
                createVNode(_component_UBadge, {
                  color: unref(setupStatus)?.next_step === "done" ? "success" : "warning",
                  variant: "soft"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(setupStatus)?.next_step === "done" ? "Setup complete" : "Setup in progress"), 1)
                  ]),
                  _: 1
                }, 8, ["color"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
      ssrRenderList(unref(metrics), (metric) => {
        _push(`<article class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"><div class="flex items-center justify-between gap-3"><div><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">${ssrInterpolate(metric.label)}</p><p class="mt-3 text-3xl font-semibold text-[var(--p-text)]">${ssrInterpolate(metric.value)}</p></div><span class="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: metric.icon,
          class: "h-5 w-5"
        }, null, _parent));
        _push(`</span></div><p class="mt-3 text-sm leading-6 text-[var(--p-text-muted)]">${ssrInterpolate(metric.note)}</p></article>`);
      });
      _push(`<!--]--></div><div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Next Up</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Setup Guide</h2><p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--p-text-muted)]"> Essential setup is centralized here so you no longer need to hunt across cards, shortcuts, and modal entry points. </p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/dashboard/setup-guide",
        color: "primary",
        variant: "soft"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Open guide `);
          } else {
            return [
              createTextVNode(" Open guide ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-6 space-y-3"><!--[-->`);
      ssrRenderList(unref(checklistItems), (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.label,
          to: item.to,
          class: "flex items-center justify-between gap-4 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-4 transition hover:border-orange-300 dark:hover:border-orange-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex min-w-0 items-start gap-3"${_scopeId}><span class="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: item.icon,
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
              _push2(`</span><div class="min-w-0"${_scopeId}><p class="text-sm font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.label)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(item.description)}</p></div></div>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: item.state === "complete" ? "success" : item.state === "required" ? "warning" : "neutral",
                variant: "soft"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(item.state === "complete" ? "Complete" : item.state === "required" ? "Required" : "Missing")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item.state === "complete" ? "Complete" : item.state === "required" ? "Required" : "Missing"), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode("div", { class: "flex min-w-0 items-start gap-3" }, [
                  createVNode("span", { class: "mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]" }, [
                    createVNode(_component_UIcon, {
                      name: item.icon,
                      class: "h-4 w-4"
                    }, null, 8, ["name"])
                  ]),
                  createVNode("div", { class: "min-w-0" }, [
                    createVNode("p", { class: "text-sm font-medium text-[var(--p-text)]" }, toDisplayString(item.label), 1),
                    createVNode("p", { class: "mt-1 text-sm text-[var(--p-text-muted)]" }, toDisplayString(item.description), 1)
                  ])
                ]),
                createVNode(_component_UBadge, {
                  color: item.state === "complete" ? "success" : item.state === "required" ? "warning" : "neutral",
                  variant: "soft"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(item.state === "complete" ? "Complete" : item.state === "required" ? "Required" : "Missing"), 1)
                  ]),
                  _: 2
                }, 1032, ["color"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></section><section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Readiness</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Setup Progress</h2><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">${ssrInterpolate(unref(summary))}</p><div class="mt-5"><div class="h-2 overflow-hidden rounded-full bg-[var(--p-surface-sunken)]"><div class="h-full rounded-full bg-orange-500 transition-all" style="${ssrRenderStyle({ width: `${unref(progressPercent)}%` })}"></div></div></div><div class="mt-5 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(unref(nextRequiredItem) ? `${unref(nextRequiredItem).label} is the next required setup step.` : "Core setup is complete.")}</p><p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">${ssrInterpolate(unref(nextRequiredItem) ? unref(nextRequiredItem).description : "You can now manage day-to-day admin work without essential setup gaps.")}</p>`);
      if (unref(nextRequiredItem)) {
        _push(ssrRenderComponent(_component_UButton, {
          to: unref(nextRequiredItem).to,
          color: "primary",
          variant: "soft",
          class: "mt-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Open next step `);
            } else {
              return [
                createTextVNode(" Open next step ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-6 grid gap-3"><!--[-->`);
      ssrRenderList(unref(checklistItems), (item) => {
        _push(`<div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-4"><div class="flex items-start justify-between gap-3"><div class="flex items-start gap-3"><span class="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: item.icon,
          class: "h-4 w-4"
        }, null, _parent));
        _push(`</span><div><p class="text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(item.label)}</p><p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">${ssrInterpolate(item.description)}</p></div></div>`);
        _push(ssrRenderComponent(_component_UBadge, {
          color: item.state === "complete" ? "success" : item.state === "required" ? "warning" : "neutral",
          variant: "soft",
          size: "xs"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.state === "complete" ? "Complete" : item.state === "required" ? "Required" : "Missing")}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.state === "complete" ? "Complete" : item.state === "required" ? "Required" : "Missing"), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div><div class="mt-3">`);
        if (item.state !== "complete") {
          _push(ssrRenderComponent(_component_UButton, {
            to: item.to,
            variant: "soft",
            color: "primary",
            size: "sm"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Open section `);
              } else {
                return [
                  createTextVNode(" Open section ")
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div></section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index--j25SM1O.mjs.map
