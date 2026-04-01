import { _ as _sfc_main$1 } from './Alert-BD7KCbft.mjs';
import { _ as __nuxt_component_4 } from './SectionCard-_jwDKQ61.mjs';
import { d as _sfc_main$9 } from './server.mjs';
import { defineComponent, ref, watch, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useSuperAdminAnalytics } from './useSuperAdminAnalytics-HnPTIU3l.mjs';
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
import 'vue-i18n';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "locations",
  __ssrInlineRender: true,
  setup(__props) {
    const page = ref(1);
    const {
      locationBreakdown: data,
      loading,
      errors,
      getLocationBreakdown
    } = useSuperAdminAnalytics();
    function formatDate(value) {
      if (!value) return "Unknown";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return date.toLocaleString();
    }
    async function load() {
      await getLocationBreakdown({ page: page.value, page_size: 25 });
    }
    watch(page, async () => {
      await load();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = _sfc_main$1;
      const _component_DashboardSectionCard = __nuxt_component_4;
      const _component_UButton = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--p-text-muted)]">Super Admin Analytics</p><h1 class="mt-2 text-3xl font-semibold text-[var(--p-text)]">Location breakdown</h1><p class="mt-2 text-sm text-[var(--p-text-dim)]">Country, city, and paginated IP activity from the shared analytics stream.</p></div>`);
      if (unref(errors).locationBreakdown) {
        _push(ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "soft",
          title: "Locations unavailable",
          description: unref(errors).locationBreakdown
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid gap-6 xl:grid-cols-2">`);
      _push(ssrRenderComponent(_component_DashboardSectionCard, {
        title: "Countries",
        "col-span": 12
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(data)?.countries ?? [], (item) => {
              _push2(`<div class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3"${_scopeId}><span class="text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.label)}</span><span class="text-sm font-medium text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(item.count)}</span></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(data)?.countries ?? [], (item) => {
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
        title: "Cities",
        "col-span": 12
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(data)?.cities ?? [], (item) => {
              _push2(`<div class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3"${_scopeId}><span class="text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.label)}</span><span class="text-sm font-medium text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(item.count)}</span></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(data)?.cities ?? [], (item) => {
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
        title: "IP address activity",
        "col-span": 12
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="overflow-x-auto"${_scopeId}><table class="min-w-full divide-y divide-[var(--p-border)] text-sm"${_scopeId}><thead${_scopeId}><tr class="text-left text-[var(--p-text-muted)]"${_scopeId}><th class="px-3 py-3 font-medium"${_scopeId}>IP</th><th class="px-3 py-3 font-medium"${_scopeId}>Country</th><th class="px-3 py-3 font-medium"${_scopeId}>City</th><th class="px-3 py-3 font-medium"${_scopeId}>Region</th><th class="px-3 py-3 font-medium"${_scopeId}>Events</th><th class="px-3 py-3 font-medium"${_scopeId}>Last seen</th></tr></thead><tbody class="divide-y divide-[var(--p-border)]"${_scopeId}><!--[-->`);
            ssrRenderList(unref(data)?.ip_addresses.results ?? [], (item) => {
              _push2(`<tr${_scopeId}><td class="px-3 py-3 text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.ip_address || "Unknown")}</td><td class="px-3 py-3 text-[var(--p-text-dim)]"${_scopeId}>${ssrInterpolate(item.country || "Unknown")}</td><td class="px-3 py-3 text-[var(--p-text-dim)]"${_scopeId}>${ssrInterpolate(item.city || "Unknown")}</td><td class="px-3 py-3 text-[var(--p-text-dim)]"${_scopeId}>${ssrInterpolate(item.region || "Unknown")}</td><td class="px-3 py-3 text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.count)}</td><td class="px-3 py-3 text-[var(--p-text-dim)]"${_scopeId}>${ssrInterpolate(formatDate(item.last_seen_at))}</td></tr>`);
            });
            _push2(`<!--]--></tbody></table></div><div class="mt-4 flex items-center justify-between gap-4"${_scopeId}><p class="text-sm text-[var(--p-text-muted)]"${_scopeId}>Showing ${ssrInterpolate(unref(data)?.ip_addresses.results.length ?? 0)} of ${ssrInterpolate(unref(data)?.ip_addresses.count ?? 0)} IP groups.</p><div class="flex gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "soft",
              disabled: unref(page) <= 1 || unref(loading).locationBreakdown,
              onClick: ($event) => page.value -= 1
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Previous`);
                } else {
                  return [
                    createTextVNode("Previous")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "soft",
              disabled: !unref(data)?.ip_addresses.next || unref(loading).locationBreakdown,
              onClick: ($event) => page.value += 1
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Next`);
                } else {
                  return [
                    createTextVNode("Next")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
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
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(data)?.ip_addresses.results ?? [], (item) => {
                      return openBlock(), createBlock("tr", {
                        key: `${item.ip_address}-${item.last_seen_at}`
                      }, [
                        createVNode("td", { class: "px-3 py-3 text-[var(--p-text)]" }, toDisplayString(item.ip_address || "Unknown"), 1),
                        createVNode("td", { class: "px-3 py-3 text-[var(--p-text-dim)]" }, toDisplayString(item.country || "Unknown"), 1),
                        createVNode("td", { class: "px-3 py-3 text-[var(--p-text-dim)]" }, toDisplayString(item.city || "Unknown"), 1),
                        createVNode("td", { class: "px-3 py-3 text-[var(--p-text-dim)]" }, toDisplayString(item.region || "Unknown"), 1),
                        createVNode("td", { class: "px-3 py-3 text-[var(--p-text)]" }, toDisplayString(item.count), 1),
                        createVNode("td", { class: "px-3 py-3 text-[var(--p-text-dim)]" }, toDisplayString(formatDate(item.last_seen_at)), 1)
                      ]);
                    }), 128))
                  ])
                ])
              ]),
              createVNode("div", { class: "mt-4 flex items-center justify-between gap-4" }, [
                createVNode("p", { class: "text-sm text-[var(--p-text-muted)]" }, "Showing " + toDisplayString(unref(data)?.ip_addresses.results.length ?? 0) + " of " + toDisplayString(unref(data)?.ip_addresses.count ?? 0) + " IP groups.", 1),
                createVNode("div", { class: "flex gap-2" }, [
                  createVNode(_component_UButton, {
                    color: "neutral",
                    variant: "soft",
                    disabled: unref(page) <= 1 || unref(loading).locationBreakdown,
                    onClick: ($event) => page.value -= 1
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Previous")
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  createVNode(_component_UButton, {
                    color: "neutral",
                    variant: "soft",
                    disabled: !unref(data)?.ip_addresses.next || unref(loading).locationBreakdown,
                    onClick: ($event) => page.value += 1
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Next")
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/locations.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=locations-k2R8HfN3.mjs.map
