import { J as _export_sfc, e as useAuthStore, _ as __nuxt_component_2, a as _sfc_main$f, b as __nuxt_component_3$1 } from './server.mjs';
import { _ as __nuxt_component_0$1, a as __nuxt_component_1$1 } from './PrintyWordmark-CopsaGXJ.mjs';
import { _ as __nuxt_component_4 } from './ThemeCycleButton-DPo1EYBF.mjs';
import { defineComponent, computed, mergeProps, unref, ref, withCtx, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useUserStore } from './user-WuCtWhZS.mjs';
import { u as useNotification } from './useNotification-Dn_AzVKG.mjs';
import '../_/nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
import 'devalue';
import 'consola';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'vue-bundle-renderer/runtime';
import '@iconify/utils';
import 'node:crypto';
import 'fast-xml-parser';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';
import 'pinia';
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './api-error-D1IYk86E.mjs';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    useUserStore();
    const mobileOpen = ref(false);
    const becomingPrinter = ref(false);
    useNotification();
    const isCustomer = computed(() => {
      const u = authStore.user;
      return !u?.role || u.role === "CUSTOMER";
    });
    const navLinks = [
      { label: "How it works", to: "/#how-it-works", icon: "i-lucide-help-circle" },
      { label: "Products Gallery", to: "/gallery", icon: "i-lucide-layout-grid" },
      { label: "Shops", to: "/shops", icon: "i-lucide-store" },
      { label: "Locations", to: "/locations", icon: "i-lucide-map-pin" },
      { label: "Your Quote", to: "/quote-draft", icon: "i-lucide-shopping-cart" }
    ];
    computed(() => {
      const u = authStore.user;
      if (!u) return "User";
      return [u.first_name, u.last_name].filter(Boolean).join(" ") || u.email?.split("@")[0] || "User";
    });
    computed(() => {
      const u = authStore.user;
      if (!u) return "U";
      if (u.first_name && u.last_name) return `${u.first_name[0]}${u.last_name[0]}`.toUpperCase();
      if (u.first_name) return u.first_name.slice(0, 2).toUpperCase();
      if (u.email) return u.email[0]?.toUpperCase() ?? "U";
      return "U";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_2;
      const _component_CommonPrintyLogoMark = __nuxt_component_0$1;
      const _component_CommonPrintyWordmark = __nuxt_component_1$1;
      const _component_UIcon = _sfc_main$f;
      const _component_ThemeCycleButton = __nuxt_component_4;
      const _component_ClientOnly = __nuxt_component_3$1;
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "sticky top-0 z-50 border-b border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm" }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="flex h-16 items-center justify-between">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden" style="${ssrRenderStyle({ "background": "#e13515" })}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CommonPrintyLogoMark, { "img-class": "h-6 w-6" }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex flex-col justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CommonPrintyWordmark, { "img-class": "h-5 sm:h-6 w-auto max-w-[100px] sm:max-w-[120px]" }, null, _parent2, _scopeId));
            _push2(`<span class="hidden text-[11px] text-[var(--p-text-muted)] sm:block mt-0.5" style="${ssrRenderStyle({ "font-family": "var(--font-body)" })}"${_scopeId}>Your Price, Instantly</span></div>`);
          } else {
            return [
              createVNode("div", {
                class: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden",
                style: { "background": "#e13515" }
              }, [
                createVNode(_component_CommonPrintyLogoMark, { "img-class": "h-6 w-6" })
              ]),
              createVNode("div", { class: "flex flex-col justify-center" }, [
                createVNode(_component_CommonPrintyWordmark, { "img-class": "h-5 sm:h-6 w-auto max-w-[100px] sm:max-w-[120px]" }),
                createVNode("span", {
                  class: "hidden text-[11px] text-[var(--p-text-muted)] sm:block mt-0.5",
                  style: { "font-family": "var(--font-body)" }
                }, "Your Price, Instantly")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="hidden items-center gap-2 md:flex"><!--[-->`);
      ssrRenderList(navLinks, (link) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: link.label,
          to: link.to,
          class: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--p-text)] min-w-0"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (link.icon) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: link.icon,
                  class: "h-4 w-4 shrink-0"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span class="truncate"${_scopeId}>${ssrInterpolate(link.label)}</span>`);
            } else {
              return [
                link.icon ? (openBlock(), createBlock(_component_UIcon, {
                  key: 0,
                  name: link.icon,
                  class: "h-4 w-4 shrink-0"
                }, null, 8, ["name"])) : createCommentVNode("", true),
                createVNode("span", { class: "truncate" }, toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">`);
      _push(ssrRenderComponent(_component_ThemeCycleButton, null, null, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/login",
              class: "hidden text-sm font-semibold text-[var(--p-text-dim)] transition-colors hover:text-[#e13515] sm:inline-flex"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Log In `);
                } else {
                  return [
                    createTextVNode(" Log In ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/signup",
              class: "btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg transition-all hover:shadow-[#e13515]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e13515] focus-visible:outline-offset-2"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Get Started `);
                } else {
                  return [
                    createTextVNode(" Get Started ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-2" }, [
                createVNode(_component_NuxtLink, {
                  to: "/auth/login",
                  class: "hidden text-sm font-semibold text-[var(--p-text-dim)] transition-colors hover:text-[#e13515] sm:inline-flex"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Log In ")
                  ]),
                  _: 1
                }),
                createVNode(_component_NuxtLink, {
                  to: "/auth/signup",
                  class: "btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg transition-all hover:shadow-[#e13515]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e13515] focus-visible:outline-offset-2"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Get Started ")
                  ]),
                  _: 1
                })
              ])
            ];
          }
        })
      }, _parent));
      _push(`<button class="rounded-lg p-2 text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] md:hidden" aria-label="Menu">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: unref(mobileOpen) ? "i-lucide-x" : "i-lucide-menu",
        class: "h-6 w-6"
      }, null, _parent));
      _push(`</button></div></div>`);
      if (unref(mobileOpen)) {
        _push(`<div class="border-t border-[var(--p-border)] pb-4 pt-3 md:hidden"><div class="grid gap-1"><!--[-->`);
        ssrRenderList(navLinks, (link) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: link.label,
            to: link.to,
            class: "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[#e13515]",
            onClick: ($event) => mobileOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (link.icon) {
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: link.icon,
                    class: "h-4 w-4 shrink-0"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(` ${ssrInterpolate(link.label)}`);
              } else {
                return [
                  link.icon ? (openBlock(), createBlock(_component_UIcon, {
                    key: 0,
                    name: link.icon,
                    class: "h-4 w-4 shrink-0"
                  }, null, 8, ["name"])) : createCommentVNode("", true),
                  createTextVNode(" " + toDisplayString(link.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
        if (unref(authStore).isAuthenticated && unref(isCustomer)) {
          _push(`<div class="mt-3 grid gap-2 px-3"><button class="btn-primary rounded-xl px-4 py-2.5 text-center text-sm font-semibold flex items-center justify-center gap-2"${ssrIncludeBooleanAttr(unref(becomingPrinter)) ? " disabled" : ""}>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-store",
            class: "h-4 w-4"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(becomingPrinter) ? "Updating..." : "Become a printer")}</button></div>`);
        } else {
          _push(`<!---->`);
        }
        if (!unref(authStore).isAuthenticated) {
          _push(`<div class="mt-3 grid gap-2 px-3">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/auth/login",
            class: "rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)]",
            onClick: ($event) => mobileOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Log In `);
              } else {
                return [
                  createTextVNode(" Log In ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/auth/signup",
            class: "btn-primary rounded-xl px-4 py-2.5 text-center text-sm font-semibold",
            onClick: ($event) => mobileOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Get Started `);
              } else {
                return [
                  createTextVNode(" Get Started ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></nav>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHeader.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "AppHeader" });
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_CommonPrintyLogoMark = __nuxt_component_0$1;
  const _component_CommonPrintyWordmark = __nuxt_component_1$1;
  const _component_NuxtLink = __nuxt_component_2;
  const _component_ClientOnly = __nuxt_component_3$1;
  _push(`<footer${ssrRenderAttrs(mergeProps({
    class: "bg-[#101828] py-12 text-gray-300 sm:py-16",
    style: { "font-family": "var(--font-body)" }
  }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="mb-12 grid grid-cols-2 gap-8 md:grid-cols-5"><div class="col-span-2 md:col-span-1"><div class="mb-4 flex items-center gap-3"><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden" style="${ssrRenderStyle({ "background": "#e13515" })}">`);
  _push(ssrRenderComponent(_component_CommonPrintyLogoMark, { "img-class": "h-6 w-6" }, null, _parent));
  _push(`</div>`);
  _push(ssrRenderComponent(_component_CommonPrintyWordmark, {
    "img-class": "h-6 w-auto max-w-[120px]",
    "dark-only": ""
  }, null, _parent));
  _push(`</div><p class="text-sm leading-relaxed"> Your Price, Instantly. The intelligent quoting and pricing engine for modern print shops. Not a marketplace — a pricing brain. </p></div><div><h4 class="mb-4 font-semibold text-white">Products</h4><ul class="space-y-3 text-sm"><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/shops",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Shops`);
      } else {
        return [
          createTextVNode("Shops")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/products",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`All products`);
      } else {
        return [
          createTextVNode("All products")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/products/business-cards",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Business Cards`);
      } else {
        return [
          createTextVNode("Business Cards")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/products/flyers",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Flyers`);
      } else {
        return [
          createTextVNode("Flyers")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/products/posters",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Posters`);
      } else {
        return [
          createTextVNode("Posters")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/gallery",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Templates`);
      } else {
        return [
          createTextVNode("Templates")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></div><div><h4 class="mb-4 font-semibold text-white">Locations</h4><ul class="space-y-3 text-sm"><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/locations",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`All locations`);
      } else {
        return [
          createTextVNode("All locations")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/locations/nairobi",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Nairobi`);
      } else {
        return [
          createTextVNode("Nairobi")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/locations/mombasa",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Mombasa`);
      } else {
        return [
          createTextVNode("Mombasa")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/locations/westlands",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Westlands`);
      } else {
        return [
          createTextVNode("Westlands")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/locations/kilimani",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Kilimani`);
      } else {
        return [
          createTextVNode("Kilimani")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></div><div><h4 class="mb-4 font-semibold text-white">Company</h4><ul class="space-y-3 text-sm"><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/about",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`About`);
      } else {
        return [
          createTextVNode("About")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/#how-it-works",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`How it works`);
      } else {
        return [
          createTextVNode("How it works")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/#models",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Pricing demo`);
      } else {
        return [
          createTextVNode("Pricing demo")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/terms",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Terms of Service`);
      } else {
        return [
          createTextVNode("Terms of Service")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/privacy",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Privacy Policy`);
      } else {
        return [
          createTextVNode("Privacy Policy")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></div><div><h4 class="mb-4 font-semibold text-white">Support</h4><ul class="space-y-3 text-sm"><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/help",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Help Center`);
      } else {
        return [
          createTextVNode("Help Center")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/quote-draft",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Your Quote`);
      } else {
        return [
          createTextVNode("Your Quote")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/quotes",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`My Quotes`);
      } else {
        return [
          createTextVNode("My Quotes")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/me/favorites",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Saved Shops`);
      } else {
        return [
          createTextVNode("Saved Shops")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/dashboard",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Dashboard`);
      } else {
        return [
          createTextVNode("Dashboard")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></div></div><div class="mb-8 flex flex-wrap gap-3 border-t border-gray-700 pt-8"><span class="w-full text-xs font-medium text-gray-500 sm:w-auto">Popular:</span>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/locations/nairobi/products/business-cards",
    class: "text-sm transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Business cards Nairobi`);
      } else {
        return [
          createTextVNode("Business cards Nairobi")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/locations/nairobi/products/flyers",
    class: "text-sm transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Flyers Nairobi`);
      } else {
        return [
          createTextVNode("Flyers Nairobi")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/locations/nairobi/products/posters",
    class: "text-sm transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Posters Nairobi`);
      } else {
        return [
          createTextVNode("Posters Nairobi")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/locations/mombasa/products/business-cards",
    class: "text-sm transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Business cards Mombasa`);
      } else {
        return [
          createTextVNode("Business cards Mombasa")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="flex flex-col items-center justify-between gap-4 border-t border-gray-700 pt-8 sm:flex-row"><p class="text-sm">© `);
  _push(ssrRenderComponent(_component_ClientOnly, null, {
    fallback: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`2025`);
      } else {
        return [
          createTextVNode("2025")
        ];
      }
    })
  }, _parent));
  _push(` Printy. All rights reserved.</p><div class="flex items-center gap-6 text-sm">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/privacy",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Privacy Policy`);
      } else {
        return [
          createTextVNode("Privacy Policy")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/terms",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Terms of Service`);
      } else {
        return [
          createTextVNode("Terms of Service")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></footer>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]), { __name: "AppFooter" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  props: {
    container: { type: Boolean, default: true },
    showFooter: { type: Boolean, default: true }
  },
  setup(__props) {
    const props = __props;
    const containerClass = computed(
      () => "mx-auto w-full px-4 sm:px-6 lg:px-8" + (props.container ? " max-w-7xl" : "")
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppHeader = __nuxt_component_0;
      const _component_AppFooter = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col bg-[var(--p-bg)] text-[var(--p-text)]" }, _attrs))}>`);
      if (_ctx.$slots.header) {
        _push(`<header class="sticky top-0 z-50 shrink-0">`);
        ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
        _push(`</header>`);
      } else {
        _push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
      }
      if (_ctx.$slots.breadcrumb) {
        _push(`<div class="border-b border-[var(--p-border)] bg-[var(--p-surface)] shrink-0"><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">`);
        ssrRenderSlot(_ctx.$slots, "breadcrumb", {}, null, _push, _parent);
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main class="${ssrRenderClass([unref(containerClass), "flex-1"])}">`);
      if (_ctx.$slots.title || _ctx.$slots.actions) {
        _push(`<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">`);
        if (_ctx.$slots.title) {
          _push(`<div>`);
          ssrRenderSlot(_ctx.$slots, "title", {}, null, _push, _parent);
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (_ctx.$slots.actions) {
          _push(`<div class="shrink-0">`);
          ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      if (_ctx.$slots.footer) {
        _push(`<footer class="shrink-0">`);
        ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push, _parent);
        _push(`</footer>`);
      } else if (__props.showFooter) {
        _push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-CJ_cvkPV.mjs.map
