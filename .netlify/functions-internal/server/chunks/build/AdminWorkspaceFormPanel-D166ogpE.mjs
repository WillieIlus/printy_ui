import { d as _sfc_main$9 } from './server.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AdminWorkspaceFormPanel",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {}
  },
  emits: ["close"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      _push(`<aside${ssrRenderAttrs(mergeProps({ class: "softui-panel floating-form-panel rounded-lg" }, _attrs))}><div class="flex items-start justify-between gap-4 border-b border-white/8 px-5 py-4"><div><p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Editor</p><h2 class="mt-1 text-base font-semibold text-[var(--p-text)] sm:text-lg">${ssrInterpolate(__props.title)}</h2>`);
      if (__props.description) {
        _push(`<p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-lucide-x",
        "aria-label": "Close panel",
        onClick: ($event) => _ctx.$emit("close")
      }, null, _parent));
      _push(`</div><div class="p-4 sm:p-5">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></aside>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/AdminWorkspaceFormPanel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main, { __name: "DashboardAdminWorkspaceFormPanel" });

export { __nuxt_component_6 as _ };
//# sourceMappingURL=AdminWorkspaceFormPanel-D166ogpE.mjs.map
