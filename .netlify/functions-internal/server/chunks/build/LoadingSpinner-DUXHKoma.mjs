import { a as _sfc_main$f } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LoadingSpinner",
  __ssrInlineRender: true,
  props: {
    size: { default: "md" },
    text: {},
    fullScreen: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const sizeClass = computed(() => ({
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8"
    })[props.size]);
    const containerClass = computed(
      () => props.fullScreen ? "fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50 flex items-center justify-center" : ""
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["flex items-center justify-center", unref(containerClass)]
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-loader-2",
        class: ["animate-spin text-gray-500 dark:text-gray-400", unref(sizeClass)]
      }, null, _parent));
      if (__props.text) {
        _push(`<span class="ml-2">${ssrInterpolate(__props.text)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/LoadingSpinner.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "CommonLoadingSpinner" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=LoadingSpinner-DUXHKoma.mjs.map
