import { _ as __nuxt_component_3$1, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_4 } from './ThemeCycleButton-DDbLSOKu.mjs';
import { _ as __nuxt_component_1, a as __nuxt_component_2 } from './PrintyWordmark-D0Sy8EK8.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot, ssrRenderStyle } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "auth",
  __ssrInlineRender: true,
  props: {
    backTo: { default: "/" },
    backLabel: { default: "Back" },
    title: { default: void 0 },
    subtitle: { default: void 0 },
    showBranding: { type: Boolean, default: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      const _component_ThemeCycleButton = __nuxt_component_4;
      const _component_CommonPrintyLogoMark = __nuxt_component_1;
      const _component_CommonPrintyWordmark = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col bg-[var(--p-bg)] text-[var(--p-text)]" }, _attrs))}><div class="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--p-border)] bg-[var(--p-surface)]">`);
      if (__props.backTo) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: __props.backTo,
          class: "inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)] transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(__props.backLabel)}`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-arrow-left",
                  class: "w-4 h-4"
                }),
                createTextVNode(" " + toDisplayString(__props.backLabel), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<span></span>`);
      }
      _push(ssrRenderComponent(_component_ThemeCycleButton, null, null, _parent));
      _push(`</div><div class="flex-1 flex items-center justify-center p-4 sm:p-6"><div class="w-full max-w-md">`);
      if (_ctx.$slots.branding || __props.showBranding) {
        _push(`<div class="text-center mb-8">`);
        ssrRenderSlot(_ctx.$slots, "branding", {}, () => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/",
            class: "inline-flex items-center gap-3 group"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="grid h-12 w-12 place-items-center rounded-xl shadow-lg transition-transform group-hover:scale-105 overflow-hidden shrink-0" style="${ssrRenderStyle({ "background": "var(--color-primary-600)" })}"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_CommonPrintyLogoMark, { "img-class": "h-7 w-7" }, null, _parent2, _scopeId));
                _push2(`</span>`);
                _push2(ssrRenderComponent(_component_CommonPrintyWordmark, { "img-class": "h-6 w-auto max-w-[100px]" }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode("span", {
                    class: "grid h-12 w-12 place-items-center rounded-xl shadow-lg transition-transform group-hover:scale-105 overflow-hidden shrink-0",
                    style: { "background": "var(--color-primary-600)" }
                  }, [
                    createVNode(_component_CommonPrintyLogoMark, { "img-class": "h-7 w-7" })
                  ]),
                  createVNode(_component_CommonPrintyWordmark, { "img-class": "h-6 w-auto max-w-[100px]" })
                ];
              }
            }),
            _: 1
          }, _parent));
        }, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.$slots.title || _ctx.$slots.subtitle) {
        _push(`<div class="text-center mb-8">`);
        ssrRenderSlot(_ctx.$slots, "title", {}, () => {
          if (__props.title) {
            _push(`<h1 class="text-2xl font-bold text-[var(--p-text)]">${ssrInterpolate(__props.title)}</h1>`);
          } else {
            _push(`<!---->`);
          }
        }, _push, _parent);
        ssrRenderSlot(_ctx.$slots, "subtitle", {}, () => {
          if (__props.subtitle) {
            _push(`<p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(__props.subtitle)}</p>`);
          } else {
            _push(`<!---->`);
          }
        }, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
      if (_ctx.$slots.footer) {
        _push(`<div class="mt-6 text-center">`);
        ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/auth.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=auth-B4QlPYwF.mjs.map
