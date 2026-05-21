import { defineComponent, ref, mergeProps, withCtx, createVNode, isRef, unref, createTextVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { d as UiCard, c as UiButton, n as navigateTo } from './server.mjs';
import { U as UiInput } from './UiInput-DsbispU9.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@vue/shared';
import './BaseInput-BGy7Y2Dg.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "track-job",
  __ssrInlineRender: true,
  setup(__props) {
    const token = ref("");
    async function submit() {
      const value = token.value.trim();
      if (!value) {
        return;
      }
      await navigateTo(`/track-job/${encodeURIComponent(value)}`);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="grid gap-6 lg:grid-cols-[1fr_0.9fr]">`);
      _push(ssrRenderComponent(UiCard, { class: "space-y-5" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="inline-flex w-fit items-center gap-2 rounded-full border border-[#fbc9ad] bg-[#fef1ed] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c92f13]"${_scopeId}> Public job tracking </div><div${_scopeId}><h1 class="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl"${_scopeId}>Track a print job without hunting for updates.</h1><p class="mt-5 max-w-2xl text-base leading-7 text-slate-600"${_scopeId}> Enter the tracking token or reference from your Printy link. This public route stays limited to safe job status and next-step visibility. </p></div><div class="grid gap-4 sm:grid-cols-3"${_scopeId}><div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600"${_scopeId}>Status is shareable without exposing the full account workspace.</div><div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600"${_scopeId}>Use the token exactly as sent in the Printy tracking link.</div><div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600"${_scopeId}>If you need deeper history, sign in to the account that owns the job.</div></div>`);
          } else {
            return [
              createVNode("div", { class: "inline-flex w-fit items-center gap-2 rounded-full border border-[#fbc9ad] bg-[#fef1ed] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c92f13]" }, " Public job tracking "),
              createVNode("div", null, [
                createVNode("h1", { class: "text-4xl font-black tracking-tight text-slate-950 sm:text-5xl" }, "Track a print job without hunting for updates."),
                createVNode("p", { class: "mt-5 max-w-2xl text-base leading-7 text-slate-600" }, " Enter the tracking token or reference from your Printy link. This public route stays limited to safe job status and next-step visibility. ")
              ]),
              createVNode("div", { class: "grid gap-4 sm:grid-cols-3" }, [
                createVNode("div", { class: "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600" }, "Status is shareable without exposing the full account workspace."),
                createVNode("div", { class: "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600" }, "Use the token exactly as sent in the Printy tracking link."),
                createVNode("div", { class: "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600" }, "If you need deeper history, sign in to the account that owns the job.")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(UiCard, { class: "space-y-5" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#e13515]"${_scopeId}>Enter token</p><h2 class="mt-3 text-2xl font-black tracking-tight text-slate-950"${_scopeId}>Open the tracking page</h2></div><form class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(UiInput, {
              modelValue: unref(token),
              "onUpdate:modelValue": ($event) => isRef(token) ? token.value = $event : null,
              label: "Tracking token or reference",
              placeholder: "Paste the token from your Printy link"
            }, null, _parent2, _scopeId));
            _push2(`<p class="text-sm leading-6 text-slate-600"${_scopeId}>Example route format: <span class="font-semibold text-slate-900"${_scopeId}>/track-job/&lt;token&gt;</span></p><div class="flex flex-wrap gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(UiButton, {
              type: "submit",
              size: "lg"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Track this job`);
                } else {
                  return [
                    createTextVNode("Track this job")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(UiButton, {
              to: "/auth/login",
              variant: "secondary",
              size: "lg"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Sign in instead`);
                } else {
                  return [
                    createTextVNode("Sign in instead")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("p", { class: "text-sm font-semibold uppercase tracking-[0.18em] text-[#e13515]" }, "Enter token"),
                createVNode("h2", { class: "mt-3 text-2xl font-black tracking-tight text-slate-950" }, "Open the tracking page")
              ]),
              createVNode("form", {
                class: "space-y-4",
                onSubmit: withModifiers(submit, ["prevent"])
              }, [
                createVNode(UiInput, {
                  modelValue: unref(token),
                  "onUpdate:modelValue": ($event) => isRef(token) ? token.value = $event : null,
                  label: "Tracking token or reference",
                  placeholder: "Paste the token from your Printy link"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode("p", { class: "text-sm leading-6 text-slate-600" }, [
                  createTextVNode("Example route format: "),
                  createVNode("span", { class: "font-semibold text-slate-900" }, "/track-job/<token>")
                ]),
                createVNode("div", { class: "flex flex-wrap gap-3" }, [
                  createVNode(UiButton, {
                    type: "submit",
                    size: "lg"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Track this job")
                    ]),
                    _: 1
                  }),
                  createVNode(UiButton, {
                    to: "/auth/login",
                    variant: "secondary",
                    size: "lg"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Sign in instead")
                    ]),
                    _: 1
                  })
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/track-job.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=track-job-BN_kmMn7.mjs.map
