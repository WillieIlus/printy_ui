import { defineComponent, mergeProps, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { a as _sfc_main$f } from './server.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FormSection",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl sm:p-6" }, _attrs))}>`);
      if (__props.title || __props.description || _ctx.$slots.header) {
        _push(`<div class="mb-5 flex items-start justify-between gap-4">`);
        ssrRenderSlot(_ctx.$slots, "header", {}, () => {
          _push(`<div class="space-y-1">`);
          if (__props.title) {
            _push(`<h2 class="text-lg font-semibold text-white">${ssrInterpolate(__props.title)}</h2>`);
          } else {
            _push(`<!---->`);
          }
          if (__props.description) {
            _push(`<p class="max-w-2xl text-sm text-slate-300">${ssrInterpolate(__props.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }, _push, _parent);
        if (_ctx.$slots.actions) {
          _push(`<div class="shrink-0">`);
          ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-5">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/FormSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$1, { __name: "DashboardFormSection" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InfoCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    icon: { default: "i-lucide-info" },
    tone: { default: "default" }
  },
  setup(__props) {
    const props = __props;
    const toneClass = computed(() => {
      const map = {
        default: "border-white/10 bg-slate-950/50 text-slate-200",
        orange: "border-orange-400/25 bg-orange-500/10 text-orange-100",
        green: "border-emerald-400/25 bg-emerald-500/10 text-emerald-100",
        blue: "border-sky-400/25 bg-sky-500/10 text-sky-100"
      };
      return map[props.tone] ?? map.default;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["rounded-[24px] border p-4 backdrop-blur-xl", toneClass.value]
      }, _attrs))}><div class="flex items-start gap-3"><div class="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: __props.icon,
        class: "h-5 w-5"
      }, null, _parent));
      _push(`</div><div class="min-w-0 space-y-1"><p class="text-sm font-semibold text-white">${ssrInterpolate(__props.title)}</p>`);
      if (__props.description) {
        _push(`<p class="text-sm leading-6 text-slate-200/90">${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.$slots.default) {
        _push(`<div class="pt-1">`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/InfoCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_11 = Object.assign(_sfc_main, { __name: "DashboardInfoCard" });

export { __nuxt_component_2 as _, __nuxt_component_11 as a };
//# sourceMappingURL=InfoCard-K1X9VF5P.mjs.map
