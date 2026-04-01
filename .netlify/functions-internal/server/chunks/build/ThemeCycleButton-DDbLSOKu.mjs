import { b as __nuxt_component_2, a as _sfc_main$f, G as useState } from './server.mjs';
import { defineComponent, computed, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';

const useColorMode = () => {
  return useState("color-mode").value;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ThemeCycleButton",
  __ssrInlineRender: true,
  setup(__props) {
    const colorMode = useColorMode();
    const options = [
      { value: "light", label: "Light", icon: "i-lucide-sun-medium" },
      { value: "dark", label: "Dark", icon: "i-lucide-moon-star" },
      { value: "system", label: "System", icon: "i-lucide-monitor" }
    ];
    const resolvedLabel = computed(() => colorMode.value === "dark" ? "Dark" : "Light");
    const currentOption = computed(() => {
      return options.find((option) => option.value === colorMode.preference) ?? options[2];
    });
    computed(() => {
      if (colorMode.preference === "system") {
        return `Theme: System. Currently following ${resolvedLabel.value} mode.`;
      }
      return `Theme: ${currentOption.value.label}.`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_2;
      const _component_UIcon = _sfc_main$f;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button type="button" class="inline-flex items-center gap-2 rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] px-2.5 py-2 text-sm font-medium text-[var(--p-text)] shadow-sm" aria-label="Cycle theme"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-monitor",
              class: "h-4 w-4 shrink-0"
            }, null, _parent2, _scopeId));
            _push2(`<span class="hidden sm:inline"${_scopeId}>System</span></button>`);
          } else {
            return [
              createVNode("button", {
                type: "button",
                class: "inline-flex items-center gap-2 rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] px-2.5 py-2 text-sm font-medium text-[var(--p-text)] shadow-sm",
                "aria-label": "Cycle theme"
              }, [
                createVNode(_component_UIcon, {
                  name: "i-lucide-monitor",
                  class: "h-4 w-4 shrink-0"
                }),
                createVNode("span", { class: "hidden sm:inline" }, "System")
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ThemeCycleButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main, { __name: "ThemeCycleButton" });

export { __nuxt_component_4 as _, useColorMode as u };
//# sourceMappingURL=ThemeCycleButton-DDbLSOKu.mjs.map
