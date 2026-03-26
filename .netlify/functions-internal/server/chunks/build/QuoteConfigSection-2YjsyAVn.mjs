import { a as _sfc_main$f } from './server.mjs';
import { defineComponent, computed, watch, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderSlot, ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "QuoteConfigModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    title: {},
    description: { default: "" },
    eyebrow: { default: "" },
    size: { default: "lg" }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const panelClasses = computed(() => {
      if (props.size === "md") {
        return "max-h-[92dvh] rounded-t-[1.5rem] sm:max-h-[90dvh] sm:max-w-2xl sm:rounded-[1.75rem]";
      }
      if (props.size === "xl") {
        return "max-h-[96dvh] rounded-t-[1.5rem] sm:max-h-[94dvh] sm:max-w-5xl sm:rounded-[1.75rem]";
      }
      return "max-h-[96dvh] rounded-t-[1.5rem] sm:max-h-[92dvh] sm:max-w-4xl sm:rounded-[1.75rem]";
    });
    watch(() => props.open, (open) => {
      (void 0).body.style.overflow = open ? "hidden" : "";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true"><div class="absolute inset-0 bg-black/55 backdrop-blur-sm" aria-hidden="true"></div><div class="${ssrRenderClass([unref(panelClasses), "modal-panel relative z-10 flex w-full flex-col overflow-hidden border border-[var(--p-border)] bg-[var(--p-surface)] shadow-2xl"])}"><div class="sticky top-0 z-10 border-b border-[var(--p-border)] bg-[var(--p-surface)]/96 px-4 py-4 backdrop-blur sm:px-6"><div class="flex items-start justify-between gap-4"><div class="min-w-0">`);
          if (__props.eyebrow) {
            _push2(`<p class="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">${ssrInterpolate(__props.eyebrow)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<h2 class="mt-1 text-lg font-semibold text-[var(--p-text)] sm:text-xl">${ssrInterpolate(__props.title)}</h2>`);
          if (__props.description) {
            _push2(`<p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(__props.description)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><button type="button" class="rounded-lg p-1.5 text-[var(--p-text-muted)] transition-colors hover:bg-[var(--p-surface-sunken)] hover:text-[var(--p-text)]" aria-label="Close">`);
          _push2(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-x",
            class: "h-5 w-5"
          }, null, _parent));
          _push2(`</button></div></div><div class="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div>`);
          if (_ctx.$slots.footer) {
            _push2(`<div class="border-t border-[var(--p-border)] bg-[var(--p-surface)]/98 px-4 py-4 backdrop-blur sm:px-6">`);
            ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push2, _parent);
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/QuoteConfigModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "QuotesQuoteConfigModal" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "QuoteConfigNotice",
  __ssrInlineRender: true,
  props: {
    tone: { default: "info" },
    title: { default: "" },
    message: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const toneClasses = computed(() => {
      if (props.tone === "success") return "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-200";
      if (props.tone === "warning") return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200";
      if (props.tone === "error") return "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200";
      return "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/30 dark:text-sky-200";
    });
    const iconToneClasses = computed(() => {
      if (props.tone === "success") return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200";
      if (props.tone === "warning") return "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200";
      if (props.tone === "error") return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200";
      return "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200";
    });
    const iconName = computed(() => {
      if (props.tone === "success") return "i-lucide-check";
      if (props.tone === "warning") return "i-lucide-lightbulb";
      if (props.tone === "error") return "i-lucide-alert-triangle";
      return "i-lucide-info";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["rounded-xl border p-4", unref(toneClasses)]
      }, _attrs))}><div class="flex items-start gap-3"><div class="${ssrRenderClass([unref(iconToneClasses), "mt-0.5 rounded-full p-1.5"])}">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: unref(iconName),
        class: "h-4 w-4"
      }, null, _parent));
      _push(`</div><div class="min-w-0 flex-1">`);
      if (__props.title) {
        _push(`<p class="font-semibold">${ssrInterpolate(__props.title)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.message) {
        _push(`<p class="mt-1 text-sm leading-6">${ssrInterpolate(__props.message)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.$slots.default) {
        _push(`<div class="mt-3">`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/QuoteConfigNotice.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$1, { __name: "QuotesQuoteConfigNotice" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "QuoteConfigSection",
  __ssrInlineRender: true,
  props: {
    title: { default: "" },
    description: { default: "" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-4 sm:p-5" }, _attrs))}>`);
      if (__props.title || __props.description) {
        _push(`<div class="mb-4">`);
        if (__props.title) {
          _push(`<h3 class="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--p-text)]">${ssrInterpolate(__props.title)}</h3>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.description) {
          _push(`<p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(__props.description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/QuoteConfigSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "QuotesQuoteConfigSection" });

export { __nuxt_component_0 as _, __nuxt_component_7 as a, __nuxt_component_1 as b };
//# sourceMappingURL=QuoteConfigSection-2YjsyAVn.mjs.map
