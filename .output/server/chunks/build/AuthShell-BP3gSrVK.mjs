import { defineComponent, computed, mergeProps, withCtx, unref, createVNode, renderSlot, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrRenderSlot } from 'vue/server-renderer';
import { B as BasePage } from './BasePage-6cyv7-ti.mjs';
import { P as PrintyLogo } from './PrintyLogo-bSA8QTQF.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AuthShell",
  __ssrInlineRender: true,
  props: {
    title: {},
    subtitle: {},
    mode: { default: "login" },
    showLogo: { type: Boolean, default: true },
    sidePanel: { type: Boolean, default: true }
  },
  setup(__props) {
    const props = __props;
    const sideWidthClass = computed(() => props.mode === "signup" ? "lg:w-[42%] xl:w-[38%]" : "lg:w-[46%] xl:w-[42%]");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(BasePage, mergeProps({ variant: "auth" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen flex flex-col lg:flex-row"${_scopeId}><div class="${ssrRenderClass([unref(sideWidthClass), "relative lg:w-[46%] xl:w-[42%] bg-[#101828] flex flex-col justify-between px-10 py-12 xl:px-16 xl:py-14 overflow-hidden"])}"${_scopeId}><div class="absolute inset-0 opacity-[0.035]" style="${ssrRenderStyle({ "background-image": "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", "background-size": "36px 36px" })}"${_scopeId}></div><div class="absolute -bottom-40 -left-24 w-[440px] h-[440px] rounded-full bg-[#e13515] opacity-[0.10] blur-3xl pointer-events-none"${_scopeId}></div><div class="absolute top-[-80px] right-[-60px] w-[280px] h-[280px] rounded-full bg-[#e13515] opacity-[0.07] blur-3xl pointer-events-none"${_scopeId}></div><div class="relative z-10"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "logo", {}, () => {
              _push2(ssrRenderComponent(PrintyLogo, {
                variant: "light",
                size: "lg",
                to: "/"
              }, null, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
            _push2(`</div><div class="relative z-10 my-auto py-16"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "side", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div><div class="relative z-10"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "sideFooter", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div></div><div class="flex-1 flex flex-col items-center justify-center px-5 py-12 lg:py-0 bg-[#f2f4f7]"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen flex flex-col lg:flex-row" }, [
                createVNode("div", {
                  class: ["relative lg:w-[46%] xl:w-[42%] bg-[#101828] flex flex-col justify-between px-10 py-12 xl:px-16 xl:py-14 overflow-hidden", unref(sideWidthClass)]
                }, [
                  createVNode("div", {
                    class: "absolute inset-0 opacity-[0.035]",
                    style: { "background-image": "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", "background-size": "36px 36px" }
                  }),
                  createVNode("div", { class: "absolute -bottom-40 -left-24 w-[440px] h-[440px] rounded-full bg-[#e13515] opacity-[0.10] blur-3xl pointer-events-none" }),
                  createVNode("div", { class: "absolute top-[-80px] right-[-60px] w-[280px] h-[280px] rounded-full bg-[#e13515] opacity-[0.07] blur-3xl pointer-events-none" }),
                  createVNode("div", { class: "relative z-10" }, [
                    renderSlot(_ctx.$slots, "logo", {}, () => [
                      createVNode(PrintyLogo, {
                        variant: "light",
                        size: "lg",
                        to: "/"
                      })
                    ])
                  ]),
                  createVNode("div", { class: "relative z-10 my-auto py-16" }, [
                    renderSlot(_ctx.$slots, "side")
                  ]),
                  createVNode("div", { class: "relative z-10" }, [
                    renderSlot(_ctx.$slots, "sideFooter")
                  ])
                ], 2),
                createVNode("div", { class: "flex-1 flex flex-col items-center justify-center px-5 py-12 lg:py-0 bg-[#f2f4f7]" }, [
                  renderSlot(_ctx.$slots, "default")
                ])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/AuthShell.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AuthShell = Object.assign(_sfc_main, { __name: "LayoutAuthShell" });

export { AuthShell as A };
//# sourceMappingURL=AuthShell-BP3gSrVK.mjs.map
