import { _ as _sfc_main$1 } from './Alert-CI_a20A7.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-CIaG1dLz.mjs';
import { _ as _sfc_main$2 } from './Badge-DRRvJchD.mjs';
import { defineComponent, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useSuperAdminAnalytics } from './useSuperAdminAnalytics-uIzpAP50.mjs';
import 'reka-ui';
import './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "errors",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      errorAnalytics: data,
      errors
    } = useSuperAdminAnalytics();
    function formatDate(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return date.toLocaleString();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = _sfc_main$1;
      const _component_DashboardSectionCard = __nuxt_component_4;
      const _component_UBadge = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--p-text-muted)]">Super Admin Analytics</p><h1 class="mt-2 text-3xl font-semibold text-[var(--p-text)]">Error analytics</h1><p class="mt-2 text-sm text-[var(--p-text-dim)]">Latest API/frontend failures and the paths or status codes producing the most noise.</p></div>`);
      if (unref(errors).errorAnalytics) {
        _push(ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "soft",
          title: "Errors unavailable",
          description: unref(errors).errorAnalytics
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid gap-6 lg:grid-cols-3">`);
      _push(ssrRenderComponent(_component_DashboardSectionCard, {
        title: "By path",
        "col-span": 12
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(data)?.counts_by_path ?? [], (item) => {
              _push2(`<div class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3"${_scopeId}><span class="truncate text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.label)}</span><span class="text-sm font-medium text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(item.count)}</span></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(data)?.counts_by_path ?? [], (item) => {
                  return openBlock(), createBlock("div", {
                    key: item.label,
                    class: "flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3"
                  }, [
                    createVNode("span", { class: "truncate text-sm text-[var(--p-text)]" }, toDisplayString(item.label), 1),
                    createVNode("span", { class: "text-sm font-medium text-[var(--p-text-muted)]" }, toDisplayString(item.count), 1)
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardSectionCard, {
        title: "By status code",
        "col-span": 12
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(data)?.counts_by_status_code ?? [], (item) => {
              _push2(`<div class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3"${_scopeId}><span class="text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.label)}</span><span class="text-sm font-medium text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(item.count)}</span></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(data)?.counts_by_status_code ?? [], (item) => {
                  return openBlock(), createBlock("div", {
                    key: item.label,
                    class: "flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3"
                  }, [
                    createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(item.label), 1),
                    createVNode("span", { class: "text-sm font-medium text-[var(--p-text-muted)]" }, toDisplayString(item.count), 1)
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardSectionCard, {
        title: "By event type",
        "col-span": 12
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(data)?.counts_by_event_type ?? [], (item) => {
              _push2(`<div class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3"${_scopeId}><span class="text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.label)}</span><span class="text-sm font-medium text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(item.count)}</span></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(data)?.counts_by_event_type ?? [], (item) => {
                  return openBlock(), createBlock("div", {
                    key: item.label,
                    class: "flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3"
                  }, [
                    createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(item.label), 1),
                    createVNode("span", { class: "text-sm font-medium text-[var(--p-text-muted)]" }, toDisplayString(item.count), 1)
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_DashboardSectionCard, {
        title: "Latest errors",
        "col-span": 12
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(data)?.latest_errors.results ?? [], (item) => {
              _push2(`<div class="rounded-xl border border-[var(--p-border-dim)] p-4"${_scopeId}><div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"${_scopeId}><div class="min-w-0"${_scopeId}><p class="truncate text-sm font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.path || "Unknown path")}</p><p class="mt-1 text-xs text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(item.event_type)} | ${ssrInterpolate(item.status_code ?? "unknown")} | ${ssrInterpolate(formatDate(item.created_at))}</p></div>`);
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
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(data)?.latest_errors.results ?? [], (item) => {
                  return openBlock(), createBlock("div", {
                    key: item.id,
                    class: "rounded-xl border border-[var(--p-border-dim)] p-4"
                  }, [
                    createVNode("div", { class: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" }, [
                      createVNode("div", { class: "min-w-0" }, [
                        createVNode("p", { class: "truncate text-sm font-medium text-[var(--p-text)]" }, toDisplayString(item.path || "Unknown path"), 1),
                        createVNode("p", { class: "mt-1 text-xs text-[var(--p-text-muted)]" }, toDisplayString(item.event_type) + " | " + toDisplayString(item.status_code ?? "unknown") + " | " + toDisplayString(formatDate(item.created_at)), 1)
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
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/errors.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=errors-CAYtnAlw.mjs.map
