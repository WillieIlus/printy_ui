import { defineComponent, ref, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, createTextVNode, Fragment, renderList, renderSlot, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { _ as __nuxt_component_0$2, b as BaseCard } from './server.mjs';
import { a as DashboardTopbar, D as DashboardSidebar } from './DashboardTopbar-CBNaUx0B.mjs';
import { P as PrintyLogo } from './PrintyLogo-bSA8QTQF.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DashboardSection",
  __ssrInlineRender: true,
  props: {
    title: {},
    subtitle: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(BaseCard, mergeProps({
        variant: "dashboard",
        padding: "none",
        radius: "xl",
        class: "overflow-hidden"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.title || __props.subtitle || _ctx.$slots.actions) {
              _push2(`<div class="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4"${_scopeId}><div${_scopeId}>`);
              if (__props.title) {
                _push2(`<p class="text-base font-bold text-slate-900"${_scopeId}>${ssrInterpolate(__props.title)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.subtitle) {
                _push2(`<p class="mt-0.5 text-xs font-medium text-slate-400"${_scopeId}>${ssrInterpolate(__props.subtitle)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
              if (_ctx.$slots.actions) {
                _push2(`<div class="shrink-0"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push2, _parent2, _scopeId);
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              __props.title || __props.subtitle || _ctx.$slots.actions ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4"
              }, [
                createVNode("div", null, [
                  __props.title ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-base font-bold text-slate-900"
                  }, toDisplayString(__props.title), 1)) : createCommentVNode("", true),
                  __props.subtitle ? (openBlock(), createBlock("p", {
                    key: 1,
                    class: "mt-0.5 text-xs font-medium text-slate-400"
                  }, toDisplayString(__props.subtitle), 1)) : createCommentVNode("", true)
                ]),
                _ctx.$slots.actions ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "shrink-0"
                }, [
                  renderSlot(_ctx.$slots, "actions")
                ])) : createCommentVNode("", true)
              ])) : createCommentVNode("", true),
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/DashboardSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const DashboardSection = Object.assign(_sfc_main$1, { __name: "DashboardSection" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RoleDashboardFrame",
  __ssrInlineRender: true,
  props: {
    title: {},
    badge: {},
    name: {},
    initials: {},
    subtitle: {},
    breadcrumbRoot: {},
    navItems: {},
    supportTitle: {},
    supportCopy: {},
    supportAction: {},
    supportTo: {}
  },
  emits: ["logout"],
  setup(__props) {
    const mobileNavOpen = ref(false);
    function handleNavClick(disabled) {
      if (disabled) {
        return;
      }
      mobileNavOpen.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-slate-50 text-slate-800 antialiased font-sans min-h-screen flex flex-col" }, _attrs))}>`);
      _push(ssrRenderComponent(DashboardTopbar, { tone: "light" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button type="button" class="inline-flex lg:hidden items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm" aria-label="Toggle dashboard navigation"${ssrRenderAttr("aria-expanded", unref(mobileNavOpen) ? "true" : "false")}${_scopeId}><svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h16"${_scopeId}></path></svg></button>`);
            _push2(ssrRenderComponent(PrintyLogo, {
              variant: "full",
              size: "md",
              to: "/"
            }, null, _parent2, _scopeId));
            _push2(`<div class="hidden lg:flex items-center gap-2 ml-4 text-sm text-slate-400"${_scopeId}><span${_scopeId}>${ssrInterpolate(__props.breadcrumbRoot)}</span><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"${_scopeId}></path></svg><span class="text-slate-700 font-medium"${_scopeId}>${ssrInterpolate(__props.title)}</span></div><div class="hidden lg:flex items-center gap-3 ml-auto"${_scopeId}><div class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"${_scopeId}>${ssrInterpolate(__props.badge)}</div><div class="flex items-center gap-2.5 pl-3 border-l border-slate-200"${_scopeId}><div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style="${ssrRenderStyle({ "background": "#101828" })}"${_scopeId}>${ssrInterpolate(__props.initials)}</div><div class="text-sm"${_scopeId}><p class="font-semibold text-slate-800 leading-none"${_scopeId}>${ssrInterpolate(__props.name)}</p><p class="text-slate-400 text-xs mt-0.5"${_scopeId}>${ssrInterpolate(__props.subtitle)}</p></div><button type="button" class="flex items-center"${_scopeId}><svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"${_scopeId}></path></svg></button></div></div>`);
          } else {
            return [
              createVNode("button", {
                type: "button",
                class: "inline-flex lg:hidden items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm",
                "aria-label": "Toggle dashboard navigation",
                "aria-expanded": unref(mobileNavOpen) ? "true" : "false",
                onClick: ($event) => mobileNavOpen.value = !unref(mobileNavOpen)
              }, [
                (openBlock(), createBlock("svg", {
                  class: "h-5 w-5",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M4 7h16M4 12h16M4 17h16"
                  })
                ]))
              ], 8, ["aria-expanded", "onClick"]),
              createVNode(PrintyLogo, {
                variant: "full",
                size: "md",
                to: "/"
              }),
              createVNode("div", { class: "hidden lg:flex items-center gap-2 ml-4 text-sm text-slate-400" }, [
                createVNode("span", null, toDisplayString(__props.breadcrumbRoot), 1),
                (openBlock(), createBlock("svg", {
                  class: "w-3.5 h-3.5",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M9 5l7 7-7 7"
                  })
                ])),
                createVNode("span", { class: "text-slate-700 font-medium" }, toDisplayString(__props.title), 1)
              ]),
              createVNode("div", { class: "hidden lg:flex items-center gap-3 ml-auto" }, [
                createVNode("div", { class: "rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600" }, toDisplayString(__props.badge), 1),
                createVNode("div", { class: "flex items-center gap-2.5 pl-3 border-l border-slate-200" }, [
                  createVNode("div", {
                    class: "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
                    style: { "background": "#101828" }
                  }, toDisplayString(__props.initials), 1),
                  createVNode("div", { class: "text-sm" }, [
                    createVNode("p", { class: "font-semibold text-slate-800 leading-none" }, toDisplayString(__props.name), 1),
                    createVNode("p", { class: "text-slate-400 text-xs mt-0.5" }, toDisplayString(__props.subtitle), 1)
                  ]),
                  createVNode("button", {
                    type: "button",
                    class: "flex items-center",
                    onClick: ($event) => _ctx.$emit("logout")
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-4 h-4 text-slate-400",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "stroke-width": "2"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M19 9l-7 7-7-7"
                      })
                    ]))
                  ], 8, ["onClick"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex flex-1 overflow-hidden">`);
      if (unref(mobileNavOpen)) {
        _push(`<button type="button" class="fixed inset-0 z-30 bg-slate-950/35 lg:hidden" aria-label="Close dashboard navigation"></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(DashboardSidebar, {
        tone: "light",
        class: ["relative z-40", unref(mobileNavOpen) ? "flex" : "hidden"]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<nav class="flex-1 px-3 py-5 space-y-0.5"${_scopeId}><p class="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider"${_scopeId}>Workspace</p><!--[-->`);
            ssrRenderList(__props.navItems, (item) => {
              _push2(ssrRenderComponent(_component_NuxtLink, {
                key: item.label,
                to: item.disabled ? void 0 : item.to,
                class: ["flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150", item.disabled ? "cursor-not-allowed bg-slate-50 text-slate-300" : item.active ? "bg-[#fdf1ee] text-[#e13515] font-semibold" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"],
                "aria-disabled": item.disabled ? "true" : void 0,
                onClick: ($event) => handleNavClick(item.disabled)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (item.icon) {
                      _push3(`<span${_scopeId2}>${item.icon ?? ""}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(` ${ssrInterpolate(item.label)}`);
                  } else {
                    return [
                      item.icon ? (openBlock(), createBlock("span", {
                        key: 0,
                        innerHTML: item.icon
                      }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
                      createTextVNode(" " + toDisplayString(item.label), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></nav><div class="p-4 border-t border-slate-100"${_scopeId}><div class="bg-slate-50 rounded-xl p-3"${_scopeId}><p class="text-xs font-bold text-slate-700 mb-0.5"${_scopeId}>${ssrInterpolate(__props.supportTitle)}</p><p class="text-xs text-slate-400 leading-relaxed"${_scopeId}>${ssrInterpolate(__props.supportCopy)}</p>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: __props.supportTo,
              class: "mt-2.5 w-full inline-flex items-center justify-center text-xs font-bold text-white py-2 rounded-lg transition-colors",
              style: { "background": "#e13515" },
              onClick: ($event) => mobileNavOpen.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.supportAction)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.supportAction), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("nav", { class: "flex-1 px-3 py-5 space-y-0.5" }, [
                createVNode("p", { class: "px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider" }, "Workspace"),
                (openBlock(true), createBlock(Fragment, null, renderList(__props.navItems, (item) => {
                  return openBlock(), createBlock(_component_NuxtLink, {
                    key: item.label,
                    to: item.disabled ? void 0 : item.to,
                    class: ["flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150", item.disabled ? "cursor-not-allowed bg-slate-50 text-slate-300" : item.active ? "bg-[#fdf1ee] text-[#e13515] font-semibold" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"],
                    "aria-disabled": item.disabled ? "true" : void 0,
                    onClick: ($event) => handleNavClick(item.disabled)
                  }, {
                    default: withCtx(() => [
                      item.icon ? (openBlock(), createBlock("span", {
                        key: 0,
                        innerHTML: item.icon
                      }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
                      createTextVNode(" " + toDisplayString(item.label), 1)
                    ]),
                    _: 2
                  }, 1032, ["to", "class", "aria-disabled", "onClick"]);
                }), 128))
              ]),
              createVNode("div", { class: "p-4 border-t border-slate-100" }, [
                createVNode("div", { class: "bg-slate-50 rounded-xl p-3" }, [
                  createVNode("p", { class: "text-xs font-bold text-slate-700 mb-0.5" }, toDisplayString(__props.supportTitle), 1),
                  createVNode("p", { class: "text-xs text-slate-400 leading-relaxed" }, toDisplayString(__props.supportCopy), 1),
                  createVNode(_component_NuxtLink, {
                    to: __props.supportTo,
                    class: "mt-2.5 w-full inline-flex items-center justify-center text-xs font-bold text-white py-2 rounded-lg transition-colors",
                    style: { "background": "#e13515" },
                    onClick: ($event) => mobileNavOpen.value = false
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.supportAction), 1)
                    ]),
                    _: 1
                  }, 8, ["to", "onClick"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<main class="relative z-0 min-w-0 flex-1 overflow-y-auto"><div class="max-w-7xl mx-auto px-4 lg:px-8 py-7 space-y-7">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/RoleDashboardFrame.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RoleDashboardFrame = Object.assign(_sfc_main, { __name: "DashboardRoleDashboardFrame" });

export { DashboardSection as D, RoleDashboardFrame as R };
//# sourceMappingURL=RoleDashboardFrame-z5_-ER2G.mjs.map
