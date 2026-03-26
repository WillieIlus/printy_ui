import { d as _sfc_main$9$1, P as __nuxt_component_2$1, a as _sfc_main$f } from './server.mjs';
import { _ as _sfc_main$b } from './Alert-CI_a20A7.mjs';
import { _ as __nuxt_component_4 } from './SkeletonState-BhcHA7h3.mjs';
import { defineComponent, ref, computed, watch, resolveComponent, mergeProps, unref, withCtx, createTextVNode, createVNode, nextTick, toDisplayString, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrRenderClass } from 'vue/server-renderer';
import { _ as __nuxt_component_4$1 } from './SectionCard-CIaG1dLz.mjs';
import { _ as _sfc_main$c } from './Badge-DRRvJchD.mjs';
import { u as useSuperAdminAnalytics } from './useSuperAdminAnalytics-uIzpAP50.mjs';
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

const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "SuperAdminErrorPanel",
  __ssrInlineRender: true,
  props: {
    data: {},
    loading: { type: Boolean },
    error: {}
  },
  emits: ["retry"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const numberFormatter = new Intl.NumberFormat("en-US");
    function formatNumber(value) {
      return numberFormatter.format(value);
    }
    function formatDateTime(value) {
      if (!value) return "Unknown";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return date.toLocaleString();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardSectionCard = __nuxt_component_4$1;
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_UBadge = _sfc_main$c;
      const _component_UButton = _sfc_main$9$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid gap-6 xl:grid-cols-2" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardSectionCard, {
        title: "Latest Errors",
        "col-span": 12
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.loading && !__props.data) {
              _push2(`<div class="space-y-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (__props.data?.latest_errors?.results?.length) {
              _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.data.latest_errors.results, (item) => {
                _push2(`<div class="rounded-xl border border-[var(--p-border-dim)] p-4"${_scopeId}><div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"${_scopeId}><div class="min-w-0"${_scopeId}><p class="truncate text-sm font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.path || "Unknown path")}</p><p class="mt-1 text-xs text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(item.event_type)} | ${ssrInterpolate(item.status_code ?? "unknown")} | ${ssrInterpolate(formatDateTime(item.created_at))}</p></div>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: "error",
                  variant: "soft"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(item.status_code ?? "n/a")}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(item.status_code ?? "n/a"), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div><p class="mt-3 text-sm text-[var(--p-text-dim)]"${_scopeId}>${ssrInterpolate(item.message || "No error message captured.")}</p></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]"${_scopeId}> No recent errors captured. </div>`);
            }
          } else {
            return [
              __props.loading && !__props.data ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-3"
              }, [
                createVNode(_component_DashboardSkeletonState, { variant: "block" })
              ])) : __props.data?.latest_errors?.results?.length ? (openBlock(), createBlock("div", {
                key: 1,
                class: "space-y-3"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.data.latest_errors.results, (item) => {
                  return openBlock(), createBlock("div", {
                    key: item.id,
                    class: "rounded-xl border border-[var(--p-border-dim)] p-4"
                  }, [
                    createVNode("div", { class: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" }, [
                      createVNode("div", { class: "min-w-0" }, [
                        createVNode("p", { class: "truncate text-sm font-medium text-[var(--p-text)]" }, toDisplayString(item.path || "Unknown path"), 1),
                        createVNode("p", { class: "mt-1 text-xs text-[var(--p-text-muted)]" }, toDisplayString(item.event_type) + " | " + toDisplayString(item.status_code ?? "unknown") + " | " + toDisplayString(formatDateTime(item.created_at)), 1)
                      ]),
                      createVNode(_component_UBadge, {
                        color: "error",
                        variant: "soft"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.status_code ?? "n/a"), 1)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    createVNode("p", { class: "mt-3 text-sm text-[var(--p-text-dim)]" }, toDisplayString(item.message || "No error message captured."), 1)
                  ]);
                }), 128))
              ])) : (openBlock(), createBlock("div", {
                key: 2,
                class: "rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]"
              }, " No recent errors captured. "))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardSectionCard, {
        title: "Grouped Error Counts",
        "col-span": 12
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.loading && !__props.data) {
              _push2(`<div class="space-y-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (__props.error && !__props.data) {
              _push2(`<div class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"${_scopeId}><p class="text-sm font-medium text-[var(--p-text)]"${_scopeId}>Error analytics are unavailable.</p><p class="mt-2 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(__props.error)}</p>`);
              _push2(ssrRenderComponent(_component_UButton, {
                class: "mt-4",
                color: "neutral",
                variant: "soft",
                onClick: ($event) => emit("retry")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Retry `);
                  } else {
                    return [
                      createTextVNode(" Retry ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (__props.data) {
              _push2(`<div class="space-y-5"${_scopeId}><div${_scopeId}><p class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId}>By path</p><div class="space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.data.counts_by_path, (item) => {
                _push2(`<div class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3"${_scopeId}><span class="truncate text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.label)}</span><span class="text-sm font-medium text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(formatNumber(item.count))}</span></div>`);
              });
              _push2(`<!--]--></div></div><div class="grid gap-4 md:grid-cols-2"${_scopeId}><div${_scopeId}><p class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId}>By status code</p><div class="space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.data.counts_by_status_code, (item) => {
                _push2(`<div class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3"${_scopeId}><span class="text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.label)}</span><span class="text-sm font-medium text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(formatNumber(item.count))}</span></div>`);
              });
              _push2(`<!--]--></div></div><div${_scopeId}><p class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId}>By event type</p><div class="space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.data.counts_by_event_type, (item) => {
                _push2(`<div class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3"${_scopeId}><span class="text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.label)}</span><span class="text-sm font-medium text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(formatNumber(item.count))}</span></div>`);
              });
              _push2(`<!--]--></div></div></div></div>`);
            } else {
              _push2(`<div class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]"${_scopeId}> No grouped error counts yet. </div>`);
            }
          } else {
            return [
              __props.loading && !__props.data ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-3"
              }, [
                createVNode(_component_DashboardSkeletonState, { variant: "block" })
              ])) : __props.error && !__props.data ? (openBlock(), createBlock("div", {
                key: 1,
                class: "rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"
              }, [
                createVNode("p", { class: "text-sm font-medium text-[var(--p-text)]" }, "Error analytics are unavailable."),
                createVNode("p", { class: "mt-2 text-sm text-[var(--p-text-muted)]" }, toDisplayString(__props.error), 1),
                createVNode(_component_UButton, {
                  class: "mt-4",
                  color: "neutral",
                  variant: "soft",
                  onClick: ($event) => emit("retry")
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Retry ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : __props.data ? (openBlock(), createBlock("div", {
                key: 2,
                class: "space-y-5"
              }, [
                createVNode("div", null, [
                  createVNode("p", { class: "mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "By path"),
                  createVNode("div", { class: "space-y-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.data.counts_by_path, (item) => {
                      return openBlock(), createBlock("div", {
                        key: item.label,
                        class: "flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3"
                      }, [
                        createVNode("span", { class: "truncate text-sm text-[var(--p-text)]" }, toDisplayString(item.label), 1),
                        createVNode("span", { class: "text-sm font-medium text-[var(--p-text-muted)]" }, toDisplayString(formatNumber(item.count)), 1)
                      ]);
                    }), 128))
                  ])
                ]),
                createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "By status code"),
                    createVNode("div", { class: "space-y-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.data.counts_by_status_code, (item) => {
                        return openBlock(), createBlock("div", {
                          key: item.label,
                          class: "flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3"
                        }, [
                          createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(item.label), 1),
                          createVNode("span", { class: "text-sm font-medium text-[var(--p-text-muted)]" }, toDisplayString(formatNumber(item.count)), 1)
                        ]);
                      }), 128))
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("p", { class: "mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "By event type"),
                    createVNode("div", { class: "space-y-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.data.counts_by_event_type, (item) => {
                        return openBlock(), createBlock("div", {
                          key: item.label,
                          class: "flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3"
                        }, [
                          createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(item.label), 1),
                          createVNode("span", { class: "text-sm font-medium text-[var(--p-text-muted)]" }, toDisplayString(formatNumber(item.count)), 1)
                        ]);
                      }), 128))
                    ])
                  ])
                ])
              ])) : (openBlock(), createBlock("div", {
                key: 3,
                class: "rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]"
              }, " No grouped error counts yet. "))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/analytics/SuperAdminErrorPanel.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const SuperAdminErrorPanel = Object.assign(_sfc_main$a, { __name: "AdminAnalyticsSuperAdminErrorPanel" });
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "SuperAdminFunnelSection",
  __ssrInlineRender: true,
  props: {
    data: {},
    loading: { type: Boolean },
    error: {}
  },
  emits: ["retry"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const numberFormatter = new Intl.NumberFormat("en-US");
    const maxCount = computed(() => Math.max(...(props.data?.stages ?? []).map((stage) => stage.count), 1));
    function formatNumber(value) {
      return numberFormatter.format(value);
    }
    function formatPercent(value) {
      return `${value.toFixed(1)}%`;
    }
    function formatRange(value) {
      const labels = {
        today: "Today",
        "7d": "Last 7 days",
        "30d": "Last 30 days",
        "90d": "Last 90 days"
      };
      return labels[value];
    }
    function scaledWidth(value) {
      return Math.max(10, Math.round(value / maxCount.value * 100));
    }
    function badgeColor(value) {
      if (value === null) return "neutral";
      if (value >= 50) return "success";
      if (value >= 20) return "warning";
      return "error";
    }
    function helperText(stage) {
      if (stage.conversion_from_previous === null) {
        return "Top-of-funnel traffic entering the site.";
      }
      return `${formatPercent(stage.conversion_from_previous)} moved from the previous stage.`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardSectionCard = __nuxt_component_4$1;
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_UButton = _sfc_main$9$1;
      const _component_UBadge = _sfc_main$c;
      _push(ssrRenderComponent(_component_DashboardSectionCard, mergeProps({
        title: "Quote Funnel",
        "col-span": 12
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.loading && !__props.data) {
              _push2(`<div class="space-y-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (__props.error && !__props.data) {
              _push2(`<div class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"${_scopeId}><p class="text-sm font-medium text-[var(--p-text)]"${_scopeId}>Funnel analytics are unavailable.</p><p class="mt-2 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(__props.error)}</p>`);
              _push2(ssrRenderComponent(_component_UButton, {
                class: "mt-4",
                color: "neutral",
                variant: "soft",
                onClick: ($event) => emit("retry")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Retry `);
                  } else {
                    return [
                      createTextVNode(" Retry ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (__props.data) {
              _push2(`<div class="space-y-5"${_scopeId}><div class="flex flex-col gap-3 rounded-2xl border border-[var(--p-border-dim)] bg-[var(--p-surface-sunken)] p-4 md:flex-row md:items-center md:justify-between"${_scopeId}><div${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]"${_scopeId}> Overall conversion </p><p class="mt-2 text-2xl font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(formatPercent(__props.data.overall_conversion_rate))}</p></div><div class="grid gap-3 sm:grid-cols-2"${_scopeId}><div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3"${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId}>Range</p><p class="mt-2 text-sm font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(formatRange(__props.data.range))}</p></div><div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3"${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId}>Submits</p><p class="mt-2 text-sm font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(formatNumber(__props.data.quote_submits))}</p></div></div></div><div class="grid gap-3 lg:grid-cols-5"${_scopeId}><!--[-->`);
              ssrRenderList(__props.data.stages, (stage) => {
                _push2(`<div class="rounded-2xl border border-[var(--p-border-dim)] bg-[var(--p-surface)] p-4"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(stage.label)}</p><p class="mt-2 text-2xl font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(formatNumber(stage.count))}</p></div>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: badgeColor(stage.conversion_from_previous),
                  variant: "soft"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(stage.conversion_from_previous === null ? "Start" : formatPercent(stage.conversion_from_previous))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(stage.conversion_from_previous === null ? "Start" : formatPercent(stage.conversion_from_previous)), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div><div class="mt-4 h-2 rounded-full bg-[var(--p-surface-sunken)]"${_scopeId}><div class="h-2 rounded-full bg-sky-500 transition-[width] duration-300" style="${ssrRenderStyle({ width: `${scaledWidth(stage.count)}%` })}"${_scopeId}></div></div><p class="mt-3 text-xs text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(helperText(stage))}</p></div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<div class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]"${_scopeId}> No funnel activity has been recorded yet. </div>`);
            }
          } else {
            return [
              __props.loading && !__props.data ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-3"
              }, [
                createVNode(_component_DashboardSkeletonState, { variant: "block" })
              ])) : __props.error && !__props.data ? (openBlock(), createBlock("div", {
                key: 1,
                class: "rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"
              }, [
                createVNode("p", { class: "text-sm font-medium text-[var(--p-text)]" }, "Funnel analytics are unavailable."),
                createVNode("p", { class: "mt-2 text-sm text-[var(--p-text-muted)]" }, toDisplayString(__props.error), 1),
                createVNode(_component_UButton, {
                  class: "mt-4",
                  color: "neutral",
                  variant: "soft",
                  onClick: ($event) => emit("retry")
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Retry ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : __props.data ? (openBlock(), createBlock("div", {
                key: 2,
                class: "space-y-5"
              }, [
                createVNode("div", { class: "flex flex-col gap-3 rounded-2xl border border-[var(--p-border-dim)] bg-[var(--p-surface-sunken)] p-4 md:flex-row md:items-center md:justify-between" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]" }, " Overall conversion "),
                    createVNode("p", { class: "mt-2 text-2xl font-semibold text-[var(--p-text)]" }, toDisplayString(formatPercent(__props.data.overall_conversion_rate)), 1)
                  ]),
                  createVNode("div", { class: "grid gap-3 sm:grid-cols-2" }, [
                    createVNode("div", { class: "rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3" }, [
                      createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "Range"),
                      createVNode("p", { class: "mt-2 text-sm font-medium text-[var(--p-text)]" }, toDisplayString(formatRange(__props.data.range)), 1)
                    ]),
                    createVNode("div", { class: "rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3" }, [
                      createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "Submits"),
                      createVNode("p", { class: "mt-2 text-sm font-medium text-[var(--p-text)]" }, toDisplayString(formatNumber(__props.data.quote_submits)), 1)
                    ])
                  ])
                ]),
                createVNode("div", { class: "grid gap-3 lg:grid-cols-5" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.data.stages, (stage) => {
                    return openBlock(), createBlock("div", {
                      key: stage.key,
                      class: "rounded-2xl border border-[var(--p-border-dim)] bg-[var(--p-surface)] p-4"
                    }, [
                      createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, toDisplayString(stage.label), 1),
                          createVNode("p", { class: "mt-2 text-2xl font-semibold text-[var(--p-text)]" }, toDisplayString(formatNumber(stage.count)), 1)
                        ]),
                        createVNode(_component_UBadge, {
                          color: badgeColor(stage.conversion_from_previous),
                          variant: "soft"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(stage.conversion_from_previous === null ? "Start" : formatPercent(stage.conversion_from_previous)), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"])
                      ]),
                      createVNode("div", { class: "mt-4 h-2 rounded-full bg-[var(--p-surface-sunken)]" }, [
                        createVNode("div", {
                          class: "h-2 rounded-full bg-sky-500 transition-[width] duration-300",
                          style: { width: `${scaledWidth(stage.count)}%` }
                        }, null, 4)
                      ]),
                      createVNode("p", { class: "mt-3 text-xs text-[var(--p-text-muted)]" }, toDisplayString(helperText(stage)), 1)
                    ]);
                  }), 128))
                ])
              ])) : (openBlock(), createBlock("div", {
                key: 3,
                class: "rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]"
              }, " No funnel activity has been recorded yet. "))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/analytics/SuperAdminFunnelSection.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const SuperAdminFunnelSection = Object.assign(_sfc_main$9, { __name: "AdminAnalyticsSuperAdminFunnelSection" });
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "SuperAdminLocationTable",
  __ssrInlineRender: true,
  props: {
    data: {},
    page: {},
    loading: { type: Boolean },
    error: {}
  },
  emits: ["update:page", "retry"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const numberFormatter = new Intl.NumberFormat("en-US");
    function formatNumber(value) {
      return numberFormatter.format(value);
    }
    function formatDateTime(value) {
      if (!value) return "Unknown";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return date.toLocaleString();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardSectionCard = __nuxt_component_4$1;
      const _component_UButton = _sfc_main$9$1;
      _push(ssrRenderComponent(_component_DashboardSectionCard, mergeProps({
        title: "IP Address Activity",
        "col-span": 12
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.data?.ip_addresses?.results?.length) {
              _push2(`<div class="space-y-4"${_scopeId}><div class="overflow-x-auto"${_scopeId}><table class="min-w-full divide-y divide-[var(--p-border)] text-sm"${_scopeId}><thead${_scopeId}><tr class="text-left text-[var(--p-text-muted)]"${_scopeId}><th class="px-3 py-3 font-medium"${_scopeId}>IP</th><th class="px-3 py-3 font-medium"${_scopeId}>Country</th><th class="px-3 py-3 font-medium"${_scopeId}>City</th><th class="px-3 py-3 font-medium"${_scopeId}>Region</th><th class="px-3 py-3 font-medium"${_scopeId}>Events</th><th class="px-3 py-3 font-medium"${_scopeId}>Last seen</th></tr></thead><tbody class="divide-y divide-[var(--p-border)]"${_scopeId}><!--[-->`);
              ssrRenderList(__props.data.ip_addresses.results, (item) => {
                _push2(`<tr${_scopeId}><td class="px-3 py-3 text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.ip_address || "Unknown")}</td><td class="px-3 py-3 text-[var(--p-text-dim)]"${_scopeId}>${ssrInterpolate(item.country || "Unknown")}</td><td class="px-3 py-3 text-[var(--p-text-dim)]"${_scopeId}>${ssrInterpolate(item.city || "Unknown")}</td><td class="px-3 py-3 text-[var(--p-text-dim)]"${_scopeId}>${ssrInterpolate(item.region || "Unknown")}</td><td class="px-3 py-3 text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(formatNumber(item.count))}</td><td class="px-3 py-3 text-[var(--p-text-dim)]"${_scopeId}>${ssrInterpolate(formatDateTime(item.last_seen_at))}</td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"${_scopeId}><p class="text-sm text-[var(--p-text-muted)]"${_scopeId}> Showing ${ssrInterpolate(__props.data.ip_addresses.results.length)} of ${ssrInterpolate(__props.data.ip_addresses.count)} IP groups. </p><div class="flex gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                color: "neutral",
                variant: "soft",
                disabled: __props.page <= 1 || __props.loading,
                onClick: ($event) => emit("update:page", __props.page - 1)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Previous `);
                  } else {
                    return [
                      createTextVNode(" Previous ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                color: "neutral",
                variant: "soft",
                disabled: !__props.data.ip_addresses.next || __props.loading,
                onClick: ($event) => emit("update:page", __props.page + 1)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Next `);
                  } else {
                    return [
                      createTextVNode(" Next ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div></div>`);
            } else if (__props.error) {
              _push2(`<div class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"${_scopeId}><p class="text-sm font-medium text-[var(--p-text)]"${_scopeId}>Location analytics are unavailable.</p><p class="mt-2 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(__props.error)}</p>`);
              _push2(ssrRenderComponent(_component_UButton, {
                class: "mt-4",
                color: "neutral",
                variant: "soft",
                onClick: ($event) => emit("retry")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Retry `);
                  } else {
                    return [
                      createTextVNode(" Retry ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<div class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-sm text-[var(--p-text-muted)]"${_scopeId}> No IP activity has been grouped yet. </div>`);
            }
          } else {
            return [
              __props.data?.ip_addresses?.results?.length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-4"
              }, [
                createVNode("div", { class: "overflow-x-auto" }, [
                  createVNode("table", { class: "min-w-full divide-y divide-[var(--p-border)] text-sm" }, [
                    createVNode("thead", null, [
                      createVNode("tr", { class: "text-left text-[var(--p-text-muted)]" }, [
                        createVNode("th", { class: "px-3 py-3 font-medium" }, "IP"),
                        createVNode("th", { class: "px-3 py-3 font-medium" }, "Country"),
                        createVNode("th", { class: "px-3 py-3 font-medium" }, "City"),
                        createVNode("th", { class: "px-3 py-3 font-medium" }, "Region"),
                        createVNode("th", { class: "px-3 py-3 font-medium" }, "Events"),
                        createVNode("th", { class: "px-3 py-3 font-medium" }, "Last seen")
                      ])
                    ]),
                    createVNode("tbody", { class: "divide-y divide-[var(--p-border)]" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.data.ip_addresses.results, (item) => {
                        return openBlock(), createBlock("tr", {
                          key: `${item.ip_address}-${item.last_seen_at}`
                        }, [
                          createVNode("td", { class: "px-3 py-3 text-[var(--p-text)]" }, toDisplayString(item.ip_address || "Unknown"), 1),
                          createVNode("td", { class: "px-3 py-3 text-[var(--p-text-dim)]" }, toDisplayString(item.country || "Unknown"), 1),
                          createVNode("td", { class: "px-3 py-3 text-[var(--p-text-dim)]" }, toDisplayString(item.city || "Unknown"), 1),
                          createVNode("td", { class: "px-3 py-3 text-[var(--p-text-dim)]" }, toDisplayString(item.region || "Unknown"), 1),
                          createVNode("td", { class: "px-3 py-3 text-[var(--p-text)]" }, toDisplayString(formatNumber(item.count)), 1),
                          createVNode("td", { class: "px-3 py-3 text-[var(--p-text-dim)]" }, toDisplayString(formatDateTime(item.last_seen_at)), 1)
                        ]);
                      }), 128))
                    ])
                  ])
                ]),
                createVNode("div", { class: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" }, [
                  createVNode("p", { class: "text-sm text-[var(--p-text-muted)]" }, " Showing " + toDisplayString(__props.data.ip_addresses.results.length) + " of " + toDisplayString(__props.data.ip_addresses.count) + " IP groups. ", 1),
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(_component_UButton, {
                      color: "neutral",
                      variant: "soft",
                      disabled: __props.page <= 1 || __props.loading,
                      onClick: ($event) => emit("update:page", __props.page - 1)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Previous ")
                      ]),
                      _: 1
                    }, 8, ["disabled", "onClick"]),
                    createVNode(_component_UButton, {
                      color: "neutral",
                      variant: "soft",
                      disabled: !__props.data.ip_addresses.next || __props.loading,
                      onClick: ($event) => emit("update:page", __props.page + 1)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Next ")
                      ]),
                      _: 1
                    }, 8, ["disabled", "onClick"])
                  ])
                ])
              ])) : __props.error ? (openBlock(), createBlock("div", {
                key: 1,
                class: "rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"
              }, [
                createVNode("p", { class: "text-sm font-medium text-[var(--p-text)]" }, "Location analytics are unavailable."),
                createVNode("p", { class: "mt-2 text-sm text-[var(--p-text-muted)]" }, toDisplayString(__props.error), 1),
                createVNode(_component_UButton, {
                  class: "mt-4",
                  color: "neutral",
                  variant: "soft",
                  onClick: ($event) => emit("retry")
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Retry ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : (openBlock(), createBlock("div", {
                key: 2,
                class: "rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-sm text-[var(--p-text-muted)]"
              }, " No IP activity has been grouped yet. "))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/analytics/SuperAdminLocationTable.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const SuperAdminLocationTable = Object.assign(_sfc_main$8, { __name: "AdminAnalyticsSuperAdminLocationTable" });
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "SuperAdminRangeControls",
  __ssrInlineRender: true,
  props: {
    range: {},
    interval: {}
  },
  emits: ["update:range", "update:interval"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const rangeOptions = [
      { label: "Today", value: "today" },
      { label: "7 days", value: "7d" },
      { label: "30 days", value: "30d" },
      { label: "90 days", value: "90d" }
    ];
    const intervalOptions = [
      { label: "Hour", value: "hour" },
      { label: "Day", value: "day" },
      { label: "Week", value: "week" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardSectionCard = __nuxt_component_4$1;
      const _component_UButton = _sfc_main$9$1;
      _push(ssrRenderComponent(_component_DashboardSectionCard, mergeProps({
        title: "Filters",
        "col-span": 12
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-5 lg:grid-cols-2"${_scopeId}><div${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]"${_scopeId}>Range</p><div class="mt-3 flex flex-wrap gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(rangeOptions, (option) => {
              _push2(ssrRenderComponent(_component_UButton, {
                key: option.value,
                variant: __props.range === option.value ? "solid" : "soft",
                color: __props.range === option.value ? "primary" : "neutral",
                size: "sm",
                onClick: ($event) => emit("update:range", option.value)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(option.label)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(option.label), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div></div><div${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]"${_scopeId}>Interval</p><div class="mt-3 flex flex-wrap gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(intervalOptions, (option) => {
              _push2(ssrRenderComponent(_component_UButton, {
                key: option.value,
                variant: __props.interval === option.value ? "solid" : "soft",
                color: __props.interval === option.value ? "primary" : "neutral",
                size: "sm",
                onClick: ($event) => emit("update:interval", option.value)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(option.label)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(option.label), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-5 lg:grid-cols-2" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]" }, "Range"),
                  createVNode("div", { class: "mt-3 flex flex-wrap gap-2" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(rangeOptions, (option) => {
                      return createVNode(_component_UButton, {
                        key: option.value,
                        variant: __props.range === option.value ? "solid" : "soft",
                        color: __props.range === option.value ? "primary" : "neutral",
                        size: "sm",
                        onClick: ($event) => emit("update:range", option.value)
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(option.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["variant", "color", "onClick"]);
                    }), 64))
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]" }, "Interval"),
                  createVNode("div", { class: "mt-3 flex flex-wrap gap-2" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(intervalOptions, (option) => {
                      return createVNode(_component_UButton, {
                        key: option.value,
                        variant: __props.interval === option.value ? "solid" : "soft",
                        color: __props.interval === option.value ? "primary" : "neutral",
                        size: "sm",
                        onClick: ($event) => emit("update:interval", option.value)
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(option.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["variant", "color", "onClick"]);
                    }), 64))
                  ])
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
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/analytics/SuperAdminRangeControls.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const SuperAdminRangeControls = Object.assign(_sfc_main$7, { __name: "AdminAnalyticsSuperAdminRangeControls" });
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "StatCard",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {},
    icon: { default: "i-lucide-bar-chart-2" },
    delta: {},
    variant: { default: "default" }
  },
  setup(__props) {
    const props = __props;
    const iconBgClass = computed(() => {
      const map = {
        default: "bg-gray-100 dark:bg-gray-700/50",
        flamingo: "bg-flamingo-50 dark:bg-flamingo-900/20",
        green: "bg-green-50 dark:bg-green-900/20",
        blue: "bg-blue-50 dark:bg-blue-900/20",
        purple: "bg-purple-50 dark:bg-purple-900/20",
        orange: "bg-orange-50 dark:bg-orange-900/20"
      };
      return map[props.variant] ?? map.default;
    });
    const iconColorClass = computed(() => {
      const map = {
        default: "text-gray-600 dark:text-gray-400",
        flamingo: "text-flamingo-600 dark:text-flamingo-400",
        green: "text-green-600 dark:text-green-400",
        blue: "text-blue-600 dark:text-blue-400",
        purple: "text-purple-600 dark:text-purple-400",
        orange: "text-orange-600 dark:text-orange-400"
      };
      return map[props.variant] ?? map.default;
    });
    const deltaClass = computed(() => {
      if (props.delta === void 0 || props.delta === null) return "";
      if (props.delta > 0) return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      if (props.delta < 0) return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "group relative overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm transition-all hover:shadow-md" }, _attrs))}><div class="flex items-start justify-between"><div class="${ssrRenderClass([iconBgClass.value, "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"])}">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: __props.icon,
        class: ["h-5 w-5", iconColorClass.value]
      }, null, _parent));
      _push(`</div>`);
      if (__props.delta !== void 0 && __props.delta !== null) {
        _push(`<span class="${ssrRenderClass([deltaClass.value, "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium"])}">`);
        if (__props.delta > 0) {
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-trending-up",
            class: "h-3 w-3"
          }, null, _parent));
        } else if (__props.delta < 0) {
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-trending-down",
            class: "h-3 w-3"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(__props.delta > 0 ? "+" : "")}${ssrInterpolate(__props.delta)}% </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="mt-3 text-3xl font-semibold text-[var(--p-text)]">${ssrInterpolate(__props.value)}</p><p class="mt-0.5 text-sm font-medium text-[var(--p-text-muted)]">${ssrInterpolate(__props.label)}</p></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/StatCard.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$6, { __name: "DashboardStatCard" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "SuperAdminSummaryCards",
  __ssrInlineRender: true,
  props: {
    summary: {},
    loading: { type: Boolean }
  },
  setup(__props) {
    const numberFormatter = new Intl.NumberFormat("en-US");
    function formatNumber(value) {
      return numberFormatter.format(value);
    }
    function formatPercent(value) {
      return `${value.toFixed(1)}%`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_DashboardStatCard = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (__props.loading && !__props.summary) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "kpi" }, null, _parent));
      } else {
        _push(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">`);
        _push(ssrRenderComponent(_component_DashboardStatCard, {
          label: "Visits Today",
          value: formatNumber(__props.summary?.total_visits_today ?? 0),
          icon: "i-lucide-mouse-pointer-click",
          variant: "blue"
        }, null, _parent));
        _push(ssrRenderComponent(_component_DashboardStatCard, {
          label: "Unique Visitors Today",
          value: formatNumber(__props.summary?.unique_visitors_today ?? 0),
          icon: "i-lucide-users",
          variant: "green"
        }, null, _parent));
        _push(ssrRenderComponent(_component_DashboardStatCard, {
          label: "Quote Requests Today",
          value: formatNumber(__props.summary?.quote_requests_today ?? 0),
          icon: "i-lucide-file-text",
          variant: "orange"
        }, null, _parent));
        _push(ssrRenderComponent(_component_DashboardStatCard, {
          label: "Conversion Rate",
          value: formatPercent(__props.summary?.quote_conversion_rate_today ?? 0),
          icon: "i-lucide-badge-percent",
          variant: "default"
        }, null, _parent));
        _push(ssrRenderComponent(_component_DashboardStatCard, {
          label: "Errors Today",
          value: formatNumber(__props.summary?.recent_errors_count ?? 0),
          icon: "i-lucide-triangle-alert",
          variant: "flamingo"
        }, null, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/analytics/SuperAdminSummaryCards.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const SuperAdminSummaryCards = Object.assign(_sfc_main$5, { __name: "AdminAnalyticsSuperAdminSummaryCards" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "SuperAdminTimeSeriesChart",
  __ssrInlineRender: true,
  props: {
    timeSeries: {},
    loading: { type: Boolean },
    error: {},
    rangeLabel: {}
  },
  emits: ["retry"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const numberFormatter = new Intl.NumberFormat("en-US");
    const totalVisits = computed(() => (props.timeSeries?.series ?? []).reduce((sum, point) => sum + point.visits, 0));
    const totalQuoteSubmits = computed(() => (props.timeSeries?.series ?? []).reduce((sum, point) => sum + point.quote_submits, 0));
    function formatNumber(value) {
      return numberFormatter.format(value);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardSectionCard = __nuxt_component_4$1;
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_AdminAnalyticsTrafficChart = __nuxt_component_2$1;
      const _component_UButton = _sfc_main$9$1;
      _push(ssrRenderComponent(_component_DashboardSectionCard, mergeProps({
        title: "Traffic",
        "col-span": 12
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.loading && !__props.timeSeries) {
              _push2(`<div class="space-y-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (__props.timeSeries?.series?.length) {
              _push2(`<div class="space-y-5"${_scopeId}><div class="grid gap-4 sm:grid-cols-3"${_scopeId}><div class="rounded-xl border border-[var(--p-border-dim)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-xs uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId}>Selected range</p><p class="mt-2 text-lg font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(__props.rangeLabel)}</p></div><div class="rounded-xl border border-[var(--p-border-dim)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-xs uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId}>Visits</p><p class="mt-2 text-lg font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(formatNumber(unref(totalVisits)))}</p></div><div class="rounded-xl border border-[var(--p-border-dim)] bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-xs uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId}>Quote submissions</p><p class="mt-2 text-lg font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(formatNumber(unref(totalQuoteSubmits)))}</p></div></div>`);
              _push2(ssrRenderComponent(_component_AdminAnalyticsTrafficChart, {
                points: __props.timeSeries.series,
                interval: __props.timeSeries.interval
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (__props.error) {
              _push2(`<div class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"${_scopeId}><p class="text-sm font-medium text-[var(--p-text)]"${_scopeId}>Traffic data is unavailable.</p><p class="mt-2 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(__props.error)}</p>`);
              _push2(ssrRenderComponent(_component_UButton, {
                class: "mt-4",
                color: "neutral",
                variant: "soft",
                onClick: ($event) => emit("retry")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Retry `);
                  } else {
                    return [
                      createTextVNode(" Retry ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<div class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"${_scopeId}><p class="text-sm font-medium text-[var(--p-text)]"${_scopeId}>No traffic points recorded yet.</p><p class="mt-2 text-sm text-[var(--p-text-muted)]"${_scopeId}>Once events are ingested, visits and quote submissions will appear here.</p></div>`);
            }
          } else {
            return [
              __props.loading && !__props.timeSeries ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-4"
              }, [
                createVNode(_component_DashboardSkeletonState, { variant: "block" })
              ])) : __props.timeSeries?.series?.length ? (openBlock(), createBlock("div", {
                key: 1,
                class: "space-y-5"
              }, [
                createVNode("div", { class: "grid gap-4 sm:grid-cols-3" }, [
                  createVNode("div", { class: "rounded-xl border border-[var(--p-border-dim)] bg-[var(--p-surface-sunken)] p-4" }, [
                    createVNode("p", { class: "text-xs uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "Selected range"),
                    createVNode("p", { class: "mt-2 text-lg font-semibold text-[var(--p-text)]" }, toDisplayString(__props.rangeLabel), 1)
                  ]),
                  createVNode("div", { class: "rounded-xl border border-[var(--p-border-dim)] bg-[var(--p-surface-sunken)] p-4" }, [
                    createVNode("p", { class: "text-xs uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "Visits"),
                    createVNode("p", { class: "mt-2 text-lg font-semibold text-[var(--p-text)]" }, toDisplayString(formatNumber(unref(totalVisits))), 1)
                  ]),
                  createVNode("div", { class: "rounded-xl border border-[var(--p-border-dim)] bg-[var(--p-surface-sunken)] p-4" }, [
                    createVNode("p", { class: "text-xs uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "Quote submissions"),
                    createVNode("p", { class: "mt-2 text-lg font-semibold text-[var(--p-text)]" }, toDisplayString(formatNumber(unref(totalQuoteSubmits))), 1)
                  ])
                ]),
                createVNode(_component_AdminAnalyticsTrafficChart, {
                  points: __props.timeSeries.series,
                  interval: __props.timeSeries.interval
                }, null, 8, ["points", "interval"])
              ])) : __props.error ? (openBlock(), createBlock("div", {
                key: 2,
                class: "rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"
              }, [
                createVNode("p", { class: "text-sm font-medium text-[var(--p-text)]" }, "Traffic data is unavailable."),
                createVNode("p", { class: "mt-2 text-sm text-[var(--p-text-muted)]" }, toDisplayString(__props.error), 1),
                createVNode(_component_UButton, {
                  class: "mt-4",
                  color: "neutral",
                  variant: "soft",
                  onClick: ($event) => emit("retry")
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Retry ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : (openBlock(), createBlock("div", {
                key: 3,
                class: "rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"
              }, [
                createVNode("p", { class: "text-sm font-medium text-[var(--p-text)]" }, "No traffic points recorded yet."),
                createVNode("p", { class: "mt-2 text-sm text-[var(--p-text-muted)]" }, "Once events are ingested, visits and quote submissions will appear here.")
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/analytics/SuperAdminTimeSeriesChart.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const SuperAdminTimeSeriesChart = Object.assign(_sfc_main$4, { __name: "AdminAnalyticsSuperAdminTimeSeriesChart" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "SuperAdminTopProducts",
  __ssrInlineRender: true,
  props: {
    items: {},
    loading: { type: Boolean },
    error: {}
  },
  emits: ["retry"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const numberFormatter = new Intl.NumberFormat("en-US");
    function formatNumber(value) {
      return numberFormatter.format(value);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardSectionCard = __nuxt_component_4$1;
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_UButton = _sfc_main$9$1;
      const _component_UBadge = _sfc_main$c;
      _push(ssrRenderComponent(_component_DashboardSectionCard, mergeProps({
        title: "Top Viewed Products",
        "col-span": 12
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.loading && !__props.items.length) {
              _push2(`<div class="space-y-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (__props.error && !__props.items.length) {
              _push2(`<div class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"${_scopeId}><p class="text-sm font-medium text-[var(--p-text)]"${_scopeId}>Product view analytics are unavailable.</p><p class="mt-2 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(__props.error)}</p>`);
              _push2(ssrRenderComponent(_component_UButton, {
                class: "mt-4",
                color: "neutral",
                variant: "soft",
                onClick: ($event) => emit("retry")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Retry `);
                  } else {
                    return [
                      createTextVNode(" Retry ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (__props.items.length) {
              _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.items, (item) => {
                _push2(`<div class="rounded-xl border border-[var(--p-border-dim)] p-3"${_scopeId}><div class="flex items-center justify-between gap-3"${_scopeId}><div class="min-w-0"${_scopeId}><p class="truncate text-sm font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.label)}</p><p class="truncate text-xs text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(item.path || item.slug || "No path captured")}</p></div>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: "neutral",
                  variant: "soft"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(formatNumber(item.count))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(formatNumber(item.count)), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]"${_scopeId}> No product views recorded yet. </div>`);
            }
          } else {
            return [
              __props.loading && !__props.items.length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-3"
              }, [
                createVNode(_component_DashboardSkeletonState, { variant: "block" })
              ])) : __props.error && !__props.items.length ? (openBlock(), createBlock("div", {
                key: 1,
                class: "rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"
              }, [
                createVNode("p", { class: "text-sm font-medium text-[var(--p-text)]" }, "Product view analytics are unavailable."),
                createVNode("p", { class: "mt-2 text-sm text-[var(--p-text-muted)]" }, toDisplayString(__props.error), 1),
                createVNode(_component_UButton, {
                  class: "mt-4",
                  color: "neutral",
                  variant: "soft",
                  onClick: ($event) => emit("retry")
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Retry ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : __props.items.length ? (openBlock(), createBlock("div", {
                key: 2,
                class: "space-y-3"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.items, (item) => {
                  return openBlock(), createBlock("div", {
                    key: `${item.label}-${item.slug}`,
                    class: "rounded-xl border border-[var(--p-border-dim)] p-3"
                  }, [
                    createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                      createVNode("div", { class: "min-w-0" }, [
                        createVNode("p", { class: "truncate text-sm font-medium text-[var(--p-text)]" }, toDisplayString(item.label), 1),
                        createVNode("p", { class: "truncate text-xs text-[var(--p-text-muted)]" }, toDisplayString(item.path || item.slug || "No path captured"), 1)
                      ]),
                      createVNode(_component_UBadge, {
                        color: "neutral",
                        variant: "soft"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(formatNumber(item.count)), 1)
                        ]),
                        _: 2
                      }, 1024)
                    ])
                  ]);
                }), 128))
              ])) : (openBlock(), createBlock("div", {
                key: 3,
                class: "rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]"
              }, " No product views recorded yet. "))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/analytics/SuperAdminTopProducts.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const SuperAdminTopProducts = Object.assign(_sfc_main$3, { __name: "AdminAnalyticsSuperAdminTopProducts" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SuperAdminTopSearches",
  __ssrInlineRender: true,
  props: {
    items: {},
    loading: { type: Boolean },
    error: {}
  },
  emits: ["retry"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const numberFormatter = new Intl.NumberFormat("en-US");
    const maxCount = computed(() => Math.max(...props.items.map((item) => item.count), 1));
    function formatNumber(value) {
      return numberFormatter.format(value);
    }
    function scaledWidth(value) {
      return Math.max(8, Math.round(value / maxCount.value * 100));
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardSectionCard = __nuxt_component_4$1;
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_UButton = _sfc_main$9$1;
      _push(ssrRenderComponent(_component_DashboardSectionCard, mergeProps({
        title: "Top Searches",
        "col-span": 12
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.loading && !__props.items.length) {
              _push2(`<div class="space-y-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (__props.error && !__props.items.length) {
              _push2(`<div class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"${_scopeId}><p class="text-sm font-medium text-[var(--p-text)]"${_scopeId}>Search analytics are unavailable.</p><p class="mt-2 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(__props.error)}</p>`);
              _push2(ssrRenderComponent(_component_UButton, {
                class: "mt-4",
                color: "neutral",
                variant: "soft",
                onClick: ($event) => emit("retry")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Retry `);
                  } else {
                    return [
                      createTextVNode(" Retry ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (__props.items.length) {
              _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.items, (item) => {
                _push2(`<div class="space-y-1"${_scopeId}><div class="flex items-center justify-between gap-3 text-sm"${_scopeId}><span class="truncate text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.label)}</span><span class="font-medium text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(formatNumber(item.count))}</span></div><div class="h-2 rounded-full bg-[var(--p-surface-sunken)]"${_scopeId}><div class="h-2 rounded-full bg-emerald-500" style="${ssrRenderStyle({ width: `${scaledWidth(item.count)}%` })}"${_scopeId}></div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]"${_scopeId}> No search analytics yet. </div>`);
            }
          } else {
            return [
              __props.loading && !__props.items.length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-3"
              }, [
                createVNode(_component_DashboardSkeletonState, { variant: "block" })
              ])) : __props.error && !__props.items.length ? (openBlock(), createBlock("div", {
                key: 1,
                class: "rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"
              }, [
                createVNode("p", { class: "text-sm font-medium text-[var(--p-text)]" }, "Search analytics are unavailable."),
                createVNode("p", { class: "mt-2 text-sm text-[var(--p-text-muted)]" }, toDisplayString(__props.error), 1),
                createVNode(_component_UButton, {
                  class: "mt-4",
                  color: "neutral",
                  variant: "soft",
                  onClick: ($event) => emit("retry")
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Retry ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : __props.items.length ? (openBlock(), createBlock("div", {
                key: 2,
                class: "space-y-3"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.items, (item) => {
                  return openBlock(), createBlock("div", {
                    key: item.label,
                    class: "space-y-1"
                  }, [
                    createVNode("div", { class: "flex items-center justify-between gap-3 text-sm" }, [
                      createVNode("span", { class: "truncate text-[var(--p-text)]" }, toDisplayString(item.label), 1),
                      createVNode("span", { class: "font-medium text-[var(--p-text-muted)]" }, toDisplayString(formatNumber(item.count)), 1)
                    ]),
                    createVNode("div", { class: "h-2 rounded-full bg-[var(--p-surface-sunken)]" }, [
                      createVNode("div", {
                        class: "h-2 rounded-full bg-emerald-500",
                        style: { width: `${scaledWidth(item.count)}%` }
                      }, null, 4)
                    ])
                  ]);
                }), 128))
              ])) : (openBlock(), createBlock("div", {
                key: 3,
                class: "rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]"
              }, " No search analytics yet. "))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/analytics/SuperAdminTopSearches.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const SuperAdminTopSearches = Object.assign(_sfc_main$2, { __name: "AdminAnalyticsSuperAdminTopSearches" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SuperAdminTopShops",
  __ssrInlineRender: true,
  props: {
    items: {},
    loading: { type: Boolean },
    error: {}
  },
  emits: ["retry"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const numberFormatter = new Intl.NumberFormat("en-US");
    function formatNumber(value) {
      return numberFormatter.format(value);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardSectionCard = __nuxt_component_4$1;
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_UButton = _sfc_main$9$1;
      const _component_UBadge = _sfc_main$c;
      _push(ssrRenderComponent(_component_DashboardSectionCard, mergeProps({
        title: "Top Viewed Shops",
        "col-span": 12
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.loading && !__props.items.length) {
              _push2(`<div class="space-y-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (__props.error && !__props.items.length) {
              _push2(`<div class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"${_scopeId}><p class="text-sm font-medium text-[var(--p-text)]"${_scopeId}>Shop view analytics are unavailable.</p><p class="mt-2 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(__props.error)}</p>`);
              _push2(ssrRenderComponent(_component_UButton, {
                class: "mt-4",
                color: "neutral",
                variant: "soft",
                onClick: ($event) => emit("retry")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Retry `);
                  } else {
                    return [
                      createTextVNode(" Retry ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (__props.items.length) {
              _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.items, (item) => {
                _push2(`<div class="rounded-xl border border-[var(--p-border-dim)] p-3"${_scopeId}><div class="flex items-center justify-between gap-3"${_scopeId}><div class="min-w-0"${_scopeId}><p class="truncate text-sm font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.label)}</p><p class="truncate text-xs text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(item.path || item.slug || "No path captured")}</p></div>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: "neutral",
                  variant: "soft"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(formatNumber(item.count))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(formatNumber(item.count)), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]"${_scopeId}> No shop views recorded yet. </div>`);
            }
          } else {
            return [
              __props.loading && !__props.items.length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-3"
              }, [
                createVNode(_component_DashboardSkeletonState, { variant: "block" })
              ])) : __props.error && !__props.items.length ? (openBlock(), createBlock("div", {
                key: 1,
                class: "rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center"
              }, [
                createVNode("p", { class: "text-sm font-medium text-[var(--p-text)]" }, "Shop view analytics are unavailable."),
                createVNode("p", { class: "mt-2 text-sm text-[var(--p-text-muted)]" }, toDisplayString(__props.error), 1),
                createVNode(_component_UButton, {
                  class: "mt-4",
                  color: "neutral",
                  variant: "soft",
                  onClick: ($event) => emit("retry")
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Retry ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : __props.items.length ? (openBlock(), createBlock("div", {
                key: 2,
                class: "space-y-3"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.items, (item) => {
                  return openBlock(), createBlock("div", {
                    key: `${item.label}-${item.slug}`,
                    class: "rounded-xl border border-[var(--p-border-dim)] p-3"
                  }, [
                    createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                      createVNode("div", { class: "min-w-0" }, [
                        createVNode("p", { class: "truncate text-sm font-medium text-[var(--p-text)]" }, toDisplayString(item.label), 1),
                        createVNode("p", { class: "truncate text-xs text-[var(--p-text-muted)]" }, toDisplayString(item.path || item.slug || "No path captured"), 1)
                      ]),
                      createVNode(_component_UBadge, {
                        color: "neutral",
                        variant: "soft"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(formatNumber(item.count)), 1)
                        ]),
                        _: 2
                      }, 1024)
                    ])
                  ]);
                }), 128))
              ])) : (openBlock(), createBlock("div", {
                key: 3,
                class: "rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]"
              }, " No shop views recorded yet. "))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/analytics/SuperAdminTopShops.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const SuperAdminTopShops = Object.assign(_sfc_main$1, { __name: "AdminAnalyticsSuperAdminTopShops" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "analytics",
  __ssrInlineRender: true,
  setup(__props) {
    const selectedRange = ref("7d");
    const selectedInterval = ref("day");
    const locationPage = ref(1);
    const hasLoaded = ref(false);
    const syncWatchLocked = ref(false);
    const {
      summary,
      timeSeries,
      topMetrics,
      funnel,
      locationBreakdown,
      errorAnalytics,
      loading,
      errors,
      isLoading,
      error,
      getSummary,
      getTimeSeries,
      getTopMetrics,
      getFunnel,
      getLocationBreakdown,
      getErrorAnalytics
    } = useSuperAdminAnalytics();
    const isInitialLoading = computed(() => !hasLoaded.value && isLoading.value);
    const hasBlockingError = computed(() => !isInitialLoading.value && !hasAnyData.value && Boolean(error.value));
    const hasAnyData = computed(() => Boolean(
      summary.value || timeSeries.value || topMetrics.value || funnel.value || locationBreakdown.value || errorAnalytics.value
    ));
    const currentRangeLabel = computed(() => {
      const labels = {
        today: "Today",
        "7d": "7 days",
        "30d": "30 days",
        "90d": "90 days"
      };
      return labels[selectedRange.value];
    });
    async function loadOverview() {
      await Promise.all([
        getSummary(),
        getTimeSeries({ range: selectedRange.value, interval: selectedInterval.value }),
        getTopMetrics(),
        getFunnel({ range: selectedRange.value }),
        getErrorAnalytics()
      ]);
      if (timeSeries.value?.interval && timeSeries.value.interval !== selectedInterval.value) {
        syncWatchLocked.value = true;
        selectedInterval.value = timeSeries.value.interval;
        await nextTick();
        syncWatchLocked.value = false;
      }
    }
    async function loadLocations() {
      await getLocationBreakdown({ page: locationPage.value, page_size: 25 });
    }
    async function reloadAll() {
      await Promise.all([
        loadOverview(),
        loadLocations()
      ]);
      hasLoaded.value = true;
    }
    watch([selectedRange, selectedInterval], async () => {
      if (syncWatchLocked.value) return;
      locationPage.value = 1;
      await reloadAll();
    });
    watch(locationPage, async () => {
      if (!hasLoaded.value) return;
      await loadLocations();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9$1;
      const _component_UAlert = _sfc_main$b;
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_SuperAdminMetricListCard = resolveComponent("SuperAdminMetricListCard");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--p-text-muted)]"> Super Admin </p><h1 class="mt-2 text-3xl font-semibold text-[var(--p-text)]"> Analytics dashboard </h1><p class="mt-2 max-w-3xl text-sm leading-6 text-[var(--p-text-dim)]"> Monitor traffic, quote intent, discovery patterns, geo activity, and operational issues from one view. </p></div><div class="flex flex-wrap gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "neutral",
        variant: "soft",
        loading: unref(isLoading),
        onClick: reloadAll
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Refresh data `);
          } else {
            return [
              createTextVNode(" Refresh data ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(hasBlockingError)) {
        _push(ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "soft",
          title: "Analytics could not be loaded",
          description: unref(error) || "The analytics endpoints did not return usable data."
        }, {
          actions: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                color: "error",
                variant: "soft",
                size: "sm",
                onClick: reloadAll
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Retry `);
                  } else {
                    return [
                      createTextVNode(" Retry ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  color: "error",
                  variant: "soft",
                  size: "sm",
                  onClick: reloadAll
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Retry ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!unref(isInitialLoading)) {
        _push(ssrRenderComponent(SuperAdminSummaryCards, {
          summary: unref(summary),
          loading: unref(loading).summary
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "kpi" }, null, _parent));
      }
      _push(ssrRenderComponent(SuperAdminRangeControls, {
        range: unref(selectedRange),
        interval: unref(selectedInterval),
        "onUpdate:range": ($event) => selectedRange.value = $event,
        "onUpdate:interval": ($event) => selectedInterval.value = $event
      }, null, _parent));
      _push(ssrRenderComponent(SuperAdminTimeSeriesChart, {
        "time-series": unref(timeSeries),
        loading: unref(loading).timeSeries,
        error: unref(errors).timeSeries,
        "range-label": unref(currentRangeLabel),
        onRetry: reloadAll
      }, null, _parent));
      _push(ssrRenderComponent(SuperAdminFunnelSection, {
        data: unref(funnel),
        loading: unref(loading).funnel,
        error: unref(errors).funnel,
        onRetry: reloadAll
      }, null, _parent));
      _push(`<div class="grid gap-6 xl:grid-cols-2">`);
      _push(ssrRenderComponent(SuperAdminTopSearches, {
        items: unref(topMetrics)?.top_searched_keywords ?? [],
        loading: unref(loading).topMetrics,
        error: unref(errors).topMetrics,
        onRetry: reloadAll
      }, null, _parent));
      _push(ssrRenderComponent(_component_SuperAdminMetricListCard, {
        title: "Top Paths",
        items: unref(summary)?.top_paths ?? [],
        loading: unref(loading).summary,
        error: unref(errors).summary,
        "error-title": "Path analytics are unavailable.",
        "empty-message": "No path activity yet.",
        onRetry: reloadAll
      }, null, _parent));
      _push(`</div><div class="grid gap-6 xl:grid-cols-2">`);
      _push(ssrRenderComponent(SuperAdminTopProducts, {
        items: unref(topMetrics)?.top_viewed_products ?? [],
        loading: unref(loading).topMetrics,
        error: unref(errors).topMetrics,
        onRetry: reloadAll
      }, null, _parent));
      _push(ssrRenderComponent(SuperAdminTopShops, {
        items: unref(topMetrics)?.top_viewed_shops ?? [],
        loading: unref(loading).topMetrics,
        error: unref(errors).topMetrics,
        onRetry: reloadAll
      }, null, _parent));
      _push(`</div><div class="grid gap-6 xl:grid-cols-2">`);
      _push(ssrRenderComponent(_component_SuperAdminMetricListCard, {
        title: "Top Countries",
        items: unref(locationBreakdown)?.countries ?? [],
        loading: unref(loading).locationBreakdown,
        error: unref(errors).locationBreakdown,
        "error-title": "Country analytics are unavailable.",
        "empty-message": "No country data yet.",
        onRetry: reloadAll
      }, null, _parent));
      _push(ssrRenderComponent(_component_SuperAdminMetricListCard, {
        title: "Top Cities",
        items: unref(locationBreakdown)?.cities ?? [],
        loading: unref(loading).locationBreakdown,
        error: unref(errors).locationBreakdown,
        "error-title": "City analytics are unavailable.",
        "empty-message": "No city data yet.",
        onRetry: reloadAll
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(SuperAdminLocationTable, {
        data: unref(locationBreakdown),
        page: unref(locationPage),
        loading: unref(loading).locationBreakdown,
        error: unref(errors).locationBreakdown,
        "onUpdate:page": ($event) => locationPage.value = $event,
        onRetry: reloadAll
      }, null, _parent));
      _push(ssrRenderComponent(SuperAdminErrorPanel, {
        data: unref(errorAnalytics),
        loading: unref(loading).errorAnalytics,
        error: unref(errors).errorAnalytics,
        onRetry: reloadAll
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/super-admin/analytics.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=analytics-DXt7OlUb.mjs.map
