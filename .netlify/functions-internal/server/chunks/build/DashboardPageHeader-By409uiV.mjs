import { f as useRoute, _ as __nuxt_component_3$1, a as _sfc_main$f, l as useRuntimeConfig } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DashboardPageHeader",
  __ssrInlineRender: true,
  props: {
    title: {},
    subtitle: {},
    shopSlug: {}
  },
  setup(__props) {
    const config = useRuntimeConfig();
    const route = useRoute();
    const siteUrl = config.public.siteUrl || "https://printy.ke";
    const props = __props;
    const resolvedShopSlug = computed(() => {
      const propSlug = props.shopSlug?.trim();
      if (propSlug) return propSlug;
      if (!route.path.startsWith("/dashboard/shops/")) {
        return null;
      }
      const routeSlug = route.params.slug;
      return typeof routeSlug === "string" && routeSlug.trim() ? routeSlug.trim() : null;
    });
    const publicUrl = computed(() => resolvedShopSlug.value ? `/shops/${resolvedShopSlug.value}` : null);
    const publicUrlDisplay = computed(
      () => resolvedShopSlug.value ? `${siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}/shops/${resolvedShopSlug.value}` : ""
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 overflow-hidden rounded-[30px] border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-6 shadow-sm backdrop-blur-xl sm:p-7" }, _attrs))}><div class="absolute"></div><div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6"><div class="min-w-0 flex-1 space-y-1"><p class="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-300/90"> Printy Workspace </p><h1 class="text-3xl font-semibold tracking-[0.01em] text-[var(--p-text)] sm:text-4xl">${ssrInterpolate(__props.title)}</h1>`);
      if (__props.subtitle) {
        _push(`<p class="max-w-3xl text-[0.95rem] leading-7 text-[var(--p-text-muted)]">${ssrInterpolate(__props.subtitle)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(publicUrl)) {
        _push(`<div class="flex flex-wrap items-center gap-2 pt-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(publicUrl),
          target: "_blank",
          rel: "noopener noreferrer",
          class: "inline-flex items-center gap-1.5 text-sm font-medium text-flamingo-600 transition-colors hover:text-flamingo-700 hover:underline dark:text-flamingo-400 dark:hover:text-flamingo-300"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-external-link",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
              _push2(` View Public Shop `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-external-link",
                  class: "h-4 w-4"
                }),
                createTextVNode(" View Public Shop ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span class="text-[var(--p-text-muted)]">·</span><span class="text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(publicUrlDisplay))}</span></div>`);
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
      _push(`</div>`);
      if (_ctx.$slots.actions) {
        _push(`<div class="shrink-0 flex flex-wrap items-center gap-2">`);
        ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/DashboardPageHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "DashboardPageHeader" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=DashboardPageHeader-By409uiV.mjs.map
