import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "IncomingRequestStatusBadge",
  __ssrInlineRender: true,
  props: {
    status: {}
  },
  setup(__props) {
    const props = __props;
    const statusMap = {
      submitted: { label: "New request", color: "primary" },
      awaiting_shop_action: { label: "Action needed", color: "warning" },
      awaiting_client_reply: { label: "Waiting on client", color: "warning" },
      viewed: { label: "Opened", color: "neutral" },
      quoted: { label: "Quote sent", color: "warning" },
      accepted: { label: "Accepted to quote", color: "success" },
      rejected: { label: "Rejected", color: "error" },
      expired: { label: "Expired", color: "error" },
      closed: { label: "Closed", color: "neutral" },
      cancelled: { label: "Cancelled", color: "error" },
      draft: { label: "Draft", color: "neutral" }
    };
    const label = computed(() => statusMap[props.status]?.label ?? props.status);
    const color = computed(() => statusMap[props.status]?.color ?? "neutral");
    const containerClass = computed(() => {
      if (color.value === "primary") return "border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-900/70 dark:bg-primary-950/30 dark:text-primary-100";
      if (color.value === "warning") return "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100";
      if (color.value === "success") return "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-100";
      if (color.value === "error") return "border-red-200 bg-red-50 text-red-900 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-100";
      return "border-[var(--p-border)] bg-[var(--p-surface-sunken)] text-[var(--p-text)]";
    });
    const dotClass = computed(() => {
      if (color.value === "primary") return "bg-primary-500";
      if (color.value === "warning") return "bg-amber-500";
      if (color.value === "success") return "bg-emerald-500";
      if (color.value === "error") return "bg-red-500";
      return "bg-[var(--p-text-muted)]";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["inline-flex items-center gap-3 rounded-full border px-3 py-2", unref(containerClass)]
      }, _attrs))}><span class="${ssrRenderClass([unref(dotClass), "flex h-2.5 w-2.5 rounded-full"])}"></span><div class="flex flex-col"><span class="text-[0.68rem] font-semibold uppercase tracking-[0.14em]"> Request status </span><span class="text-sm font-semibold">${ssrInterpolate(unref(label))}</span></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/incoming/IncomingRequestStatusBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "IncomingRequestStatusBadge" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=IncomingRequestStatusBadge-Cy3uXAqB.mjs.map
