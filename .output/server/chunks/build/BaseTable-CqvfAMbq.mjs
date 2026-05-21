import { defineComponent, mergeProps, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, renderSlot, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderSlot, ssrRenderAttr } from 'vue/server-renderer';
import { b as BaseCard } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseTable",
  __ssrInlineRender: true,
  props: {
    columns: {},
    rows: {},
    loading: { type: Boolean },
    emptyText: {},
    dense: { type: Boolean },
    variant: {},
    rowAction: { type: [Function, null] }
  },
  setup(__props) {
    const props = __props;
    function handleRowClick(row) {
      props.rowAction?.(row);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(BaseCard, mergeProps({
        variant: __props.variant === "dashboard" ? "dashboard" : "default",
        padding: "none",
        radius: "xl",
        class: "overflow-hidden"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="overflow-x-auto"${_scopeId}><table class="w-full"${_scopeId}><thead${_scopeId}><tr class="${ssrRenderClass(__props.variant === "dashboard" ? "bg-slate-50 border-b border-slate-100" : "border-b border-slate-200")}"${_scopeId}><!--[-->`);
            ssrRenderList(__props.columns, (column) => {
              _push2(`<th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400"${_scopeId}>${ssrInterpolate(column.label)}</th>`);
            });
            _push2(`<!--]--></tr></thead>`);
            if (!__props.loading && __props.rows.length) {
              _push2(`<tbody class="divide-y divide-slate-100"${_scopeId}><!--[-->`);
              ssrRenderList(__props.rows, (row, rowIndex) => {
                _push2(`<tr class="${ssrRenderClass([__props.rowAction ? "cursor-pointer" : "", "hover:bg-slate-50"])}"${_scopeId}><!--[-->`);
                ssrRenderList(__props.columns, (column) => {
                  _push2(`<td class="${ssrRenderClass(__props.dense ? "px-6 py-3 text-sm text-slate-600" : "px-6 py-4 text-sm text-slate-600")}"${_scopeId}>`);
                  ssrRenderSlot(_ctx.$slots, `cell-${column.key}`, {
                    row,
                    value: row[column.key],
                    column
                  }, () => {
                    _push2(`${ssrInterpolate(row[column.key] ?? "-")}`);
                  }, _push2, _parent2, _scopeId);
                  _push2(`</td>`);
                });
                _push2(`<!--]--></tr>`);
              });
              _push2(`<!--]--></tbody>`);
            } else {
              _push2(`<tbody${_scopeId}><tr${_scopeId}><td${ssrRenderAttr("colspan", __props.columns.length)} class="px-6 py-10 text-center"${_scopeId}><p class="text-sm font-semibold text-slate-700"${_scopeId}>${ssrInterpolate(__props.loading ? "Loading..." : __props.emptyText)}</p></td></tr></tbody>`);
            }
            _push2(`</table></div>`);
          } else {
            return [
              createVNode("div", { class: "overflow-x-auto" }, [
                createVNode("table", { class: "w-full" }, [
                  createVNode("thead", null, [
                    createVNode("tr", {
                      class: __props.variant === "dashboard" ? "bg-slate-50 border-b border-slate-100" : "border-b border-slate-200"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.columns, (column) => {
                        return openBlock(), createBlock("th", {
                          key: column.key,
                          class: "px-6 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400"
                        }, toDisplayString(column.label), 1);
                      }), 128))
                    ], 2)
                  ]),
                  !__props.loading && __props.rows.length ? (openBlock(), createBlock("tbody", {
                    key: 0,
                    class: "divide-y divide-slate-100"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.rows, (row, rowIndex) => {
                      return openBlock(), createBlock("tr", {
                        key: row.id ?? rowIndex,
                        class: ["hover:bg-slate-50", __props.rowAction ? "cursor-pointer" : ""],
                        onClick: ($event) => handleRowClick(row)
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.columns, (column) => {
                          return openBlock(), createBlock("td", {
                            key: column.key,
                            class: __props.dense ? "px-6 py-3 text-sm text-slate-600" : "px-6 py-4 text-sm text-slate-600"
                          }, [
                            renderSlot(_ctx.$slots, `cell-${column.key}`, {
                              row,
                              value: row[column.key],
                              column
                            }, () => [
                              createTextVNode(toDisplayString(row[column.key] ?? "-"), 1)
                            ])
                          ], 2);
                        }), 128))
                      ], 10, ["onClick"]);
                    }), 128))
                  ])) : (openBlock(), createBlock("tbody", { key: 1 }, [
                    createVNode("tr", null, [
                      createVNode("td", {
                        colspan: __props.columns.length,
                        class: "px-6 py-10 text-center"
                      }, [
                        createVNode("p", { class: "text-sm font-semibold text-slate-700" }, toDisplayString(__props.loading ? "Loading..." : __props.emptyText), 1)
                      ], 8, ["colspan"])
                    ])
                  ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/BaseTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BaseTable = Object.assign(_sfc_main, { __name: "BaseTable" });

export { BaseTable as B };
//# sourceMappingURL=BaseTable-CqvfAMbq.mjs.map
