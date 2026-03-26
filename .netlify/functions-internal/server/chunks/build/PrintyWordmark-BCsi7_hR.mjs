import { defineComponent, mergeProps, computed, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../_/nitro.mjs';
import { b as __nuxt_component_2$1 } from './server.mjs';
import { u as useColorMode } from './ThemeCycleButton-DG1zEPnp.mjs';

const _imports_0$1 = publicAssetsURL("/printy-brand-assets-ready/logo-mark/light/printy-logo-mark-01.svg");
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PrintyLogoMark",
  __ssrInlineRender: true,
  props: {
    imgClass: { default: "h-6 w-6" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<img${ssrRenderAttrs(mergeProps({
        src: _imports_0$1,
        alt: "Printy",
        class: ["object-contain", __props.imgClass]
      }, _attrs))}>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/PrintyLogoMark.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "CommonPrintyLogoMark" });
const _imports_0 = publicAssetsURL("/printy-brand-assets-ready/word-mark/dark/printy-word-mark-04.svg");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PrintyWordmark",
  __ssrInlineRender: true,
  props: {
    imgClass: { default: "h-6" },
    darkOnly: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const colorMode = useColorMode();
    computed(() => {
      if (props.darkOnly) {
        return "/printy-brand-assets-ready/word-mark/light/printy-word-mark-03.svg";
      }
      return colorMode.value === "dark" ? "/printy-brand-assets-ready/word-mark/light/printy-word-mark-03.svg" : "/printy-brand-assets-ready/word-mark/dark/printy-word-mark-04.svg";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_2$1;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Printy" class="${ssrRenderClass([__props.imgClass, "object-contain object-left"])}"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "Printy",
                class: ["object-contain object-left", __props.imgClass]
              }, null, 2)
            ];
          }
        })
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/PrintyWordmark.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "CommonPrintyWordmark" });

export { __nuxt_component_1 as _, __nuxt_component_2 as a };
//# sourceMappingURL=PrintyWordmark-BCsi7_hR.mjs.map
