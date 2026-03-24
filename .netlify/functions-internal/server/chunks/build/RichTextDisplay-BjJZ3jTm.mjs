import { defineComponent, computed, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RichTextDisplay",
  __ssrInlineRender: true,
  props: {
    html: { default: void 0 },
    contentClass: { default: "" },
    showEmpty: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const displayContent = computed(() => !!props.html?.trim());
    const isHtml = computed(() => /<[a-z][\s\S]*>/i.test(props.html ?? ""));
    const sanitizedHtml = computed(() => {
      if (!props.html?.trim() || !isHtml.value) return "";
      return props.html;
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(displayContent)) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: ["prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400", __props.contentClass]
        }, _attrs))}>`);
        if (unref(isHtml)) {
          _push(`<div>${unref(sanitizedHtml) ?? ""}</div>`);
        } else {
          _push(`<p class="m-0">${ssrInterpolate(__props.html)}</p>`);
        }
        _push(`</div>`);
      } else {
        ssrRenderSlot(_ctx.$slots, "empty", {}, () => {
          if (__props.showEmpty) {
            _push(`<p class="text-sm text-gray-500 dark:text-gray-500 italic">No content</p>`);
          } else {
            _push(`<!---->`);
          }
        }, _push, _parent);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/editor/RichTextDisplay.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main, { __name: "EditorRichTextDisplay" });

export { __nuxt_component_6 as _ };
//# sourceMappingURL=RichTextDisplay-BjJZ3jTm.mjs.map
