import { defineComponent, withCtx, renderSlot, mergeProps, createVNode, computed, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { B as BasePage } from './BasePage-6cyv7-ti.mjs';
import { m as useAuthStore, f as __nuxt_component_0$3, _ as __nuxt_component_0$2 } from './server.mjs';
import { P as PrintyLogo } from './PrintyLogo-bSA8QTQF.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@vue/shared';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "PublicFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-[#101828] border-t border-[#1d2939] py-8" }, _attrs))}><div class="max-w-7xl mx-auto px-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">`);
      _push(ssrRenderComponent(PrintyLogo, {
        variant: "light",
        size: "md",
        to: "/"
      }, null, _parent));
      _push(`<div class="flex flex-wrap items-center gap-4 text-sm">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/register",
        class: "text-[#98a2b3] hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Client signup`);
          } else {
            return [
              createTextVNode("Client signup")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/register?role=partner",
        class: "text-[#98a2b3] hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Partner signup`);
          } else {
            return [
              createTextVNode("Partner signup")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/register?role=production",
        class: "text-[#98a2b3] hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Production signup`);
          } else {
            return [
              createTextVNode("Production signup")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><p class="text-xs text-[#667085]">© ${ssrInterpolate(unref(currentYear))} Printy. All rights reserved.</p></div></footer>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/marketing/PublicFooter.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const PublicFooter = Object.assign(_sfc_main$3, { __name: "MarketingPublicFooter" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "PublicHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const primaryNav = [
      { label: "Calculator", href: "#live-estimate" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Track a Job", href: "/track-job" }
    ];
    computed(() => auth.isInitialized && auth.isAuthenticated);
    computed(() => auth.isInitialized && !auth.isAuthenticated);
    computed(() => auth.canReceiveAssignments ? "Jobs" : auth.canManageClients ? "Workspace" : "Dashboard");
    computed(() => auth.homeRoute);
    computed(() => auth.canReceiveAssignments ? "Open workspace" : "New quote");
    computed(() => {
      if (auth.canReceiveAssignments) {
        return auth.homeRoute;
      }
      if (auth.canManageClients) {
        return "/dashboard/partner/quotes";
      }
      return "/dashboard/client";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$3;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#e4e7ec] shadow-sm" }, _attrs))}><div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">`);
      _push(ssrRenderComponent(PrintyLogo, {
        variant: "full",
        size: "md",
        to: "/"
      }, null, _parent));
      _push(`<nav class="hidden md:flex items-center gap-7"><!--[-->`);
      ssrRenderList(primaryNav, (item) => {
        _push(`<a${ssrRenderAttr("href", item.href)} class="text-sm font-medium text-[#344054] hover:text-[#e13515] transition-colors">${ssrInterpolate(item.label)}</a>`);
      });
      _push(`<!--]--></nav><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="h-[42px] w-[160px] sm:w-[260px]" aria-hidden="true"${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", {
                class: "h-[42px] w-[160px] sm:w-[260px]",
                "aria-hidden": "true"
              })
            ];
          }
        })
      }, _parent));
      _push(`</div></div></header>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/marketing/PublicHeader.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const PublicHeader = Object.assign(_sfc_main$2, { __name: "MarketingPublicHeader" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PublicShell",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(BasePage, mergeProps({ variant: "public" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(PublicHeader, null, null, _parent2, _scopeId));
            _push2(`<main${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</main>`);
            _push2(ssrRenderComponent(PublicFooter, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(PublicHeader),
              createVNode("main", null, [
                renderSlot(_ctx.$slots, "default")
              ]),
              createVNode(PublicFooter)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/PublicShell.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const PublicShell = Object.assign(_sfc_main$1, { __name: "LayoutPublicShell" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(PublicShell, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-DTO1Ajcg.mjs.map
