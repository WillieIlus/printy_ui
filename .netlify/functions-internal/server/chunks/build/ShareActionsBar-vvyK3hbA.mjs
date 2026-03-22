import { h as useToast, e as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { g as getWhatsAppShareUrl } from './quoteMessage-Bmp83pcs.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ShareActionsBar",
  __ssrInlineRender: true,
  props: {
    summaryText: {},
    copyLabel: { default: "Copy summary" },
    attachments: { default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const toast = useToast();
    function copySummary() {
      (void 0).clipboard.writeText(props.summaryText).then(
        () => toast.add({ title: "Copied to clipboard", color: "success" }),
        () => toast.add({ title: "Could not copy", color: "error" })
      );
    }
    function openWhatsApp() {
      const url = getWhatsAppShareUrl(props.summaryText);
      (void 0).open(url, "_blank", "noopener,noreferrer");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      if (__props.summaryText) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-wrap items-center gap-2" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_UButton, {
          variant: "soft",
          size: "sm",
          color: "neutral",
          onClick: copySummary
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-copy",
                class: "w-4 h-4 mr-1.5"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(__props.copyLabel)}`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-copy",
                  class: "w-4 h-4 mr-1.5"
                }),
                createTextVNode(" " + toDisplayString(__props.copyLabel), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          variant: "soft",
          size: "sm",
          color: "neutral",
          onClick: openWhatsApp
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-message-circle",
                class: "w-4 h-4 mr-1.5"
              }, null, _parent2, _scopeId));
              _push2(` Send via WhatsApp `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-message-circle",
                  class: "w-4 h-4 mr-1.5"
                }),
                createTextVNode(" Send via WhatsApp ")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (__props.attachments?.length) {
          _push(`<p class="text-xs text-[var(--p-text-muted)] mt-1 w-full"><span class="font-medium">Attachments:</span><!--[-->`);
          ssrRenderList(__props.attachments, (att) => {
            _push(`<a${ssrRenderAttr("href", att.file)} target="_blank" rel="noopener noreferrer" class="ml-1 text-flamingo-600 dark:text-flamingo-400 hover:underline">${ssrInterpolate(att.name || "Download")}</a>`);
          });
          _push(`<!--]--></p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/share/ShareActionsBar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main, { __name: "ShareActionsBar" });

export { __nuxt_component_5 as _ };
//# sourceMappingURL=ShareActionsBar-vvyK3hbA.mjs.map
