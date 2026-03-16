import { a as _sfc_main$f } from './server.mjs';
import { defineComponent, ref, watch, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrInterpolate, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SimpleModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    title: {},
    description: {}
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    ref(null);
    watch(() => props.open, (open) => {
      if (open) (void 0).body.style.overflow = "hidden";
      else (void 0).body.style.overflow = "";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true"><div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden></div><div class="modal-panel relative flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-lg sm:max-h-[90dvh] sm:max-w-lg sm:rounded-xl z-10"><div class="flex items-center justify-between p-4 sm:px-6 border-b border-[var(--p-border)] shrink-0"><div><h2 class="text-lg font-semibold text-[var(--p-text)]">${ssrInterpolate(__props.title)}</h2>`);
          if (__props.description) {
            _push2(`<p class="mt-0.5 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(__props.description)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><button type="button" class="rounded-lg p-1.5 text-[var(--p-text-muted)] hover:text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors" aria-label="Close">`);
          _push2(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-x",
            class: "h-5 w-5"
          }, null, _parent));
          _push2(`</button></div><div class="p-4 sm:p-6 overflow-y-auto flex-1">`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/SimpleModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "CommonSimpleModal" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=SimpleModal-knQEbNC5.mjs.map
