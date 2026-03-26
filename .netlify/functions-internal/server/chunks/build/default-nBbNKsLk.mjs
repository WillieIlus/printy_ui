import { Q as _export_sfc, c as useAuthStore, _ as __nuxt_component_3$1, a as _sfc_main$f, b as __nuxt_component_2$1 } from './server.mjs';
import { _ as __nuxt_component_1$1, a as __nuxt_component_2 } from './PrintyWordmark-BCsi7_hR.mjs';
import { _ as __nuxt_component_4 } from './ThemeCycleButton-DG1zEPnp.mjs';
import { defineComponent, computed, mergeProps, unref, ref, withCtx, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useUserStore } from './user-yk0wG_HM.mjs';
import { u as useSellerStore } from './seller-DvrkRojT.mjs';
import { u as useShopStore } from './shop-COPLd96Y.mjs';
import { u as useNotification } from './useNotification-B7Z2gs_7.mjs';
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
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './seller-9NDANUZF.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    useUserStore();
    useSellerStore();
    const shopStore = useShopStore();
    const mobileOpen = ref(false);
    const becomingShopOwner = ref(false);
    useNotification();
    const isClient = computed(() => authStore.normalizedRole === "client" || !authStore.user?.role);
    computed(() => {
      if (authStore.isShopOwner || authStore.isStaffRole || (shopStore.myShops?.length ?? 0) > 0) return "/dashboard";
      return "/quote-draft";
    });
    const navLinks = [
      { label: "Home", to: "/", icon: "i-lucide-house" },
      { label: "Products Gallery", to: "/gallery", icon: "i-lucide-layout-grid" },
      { label: "Shops", to: "/shops", icon: "i-lucide-store" },
      { label: "Locations", to: "/locations", icon: "i-lucide-map-pin" },
      { label: "Quote Draft", to: "/quote-draft", icon: "i-lucide-shopping-cart" }
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
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_CommonPrintyLogoMark = __nuxt_component_1$1;
      const _component_CommonPrintyWordmark = __nuxt_component_2;
      const _component_UIcon = _sfc_main$f;
      const _component_ThemeCycleButton = __nuxt_component_4;
      const _component_ClientOnly = __nuxt_component_2$1;
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
              class: "cta-button group inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-flamingo-500/25 transition-all hover:bg-flamingo-400 hover:shadow-flamingo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-flamingo-500 focus-visible:outline-offset-2"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Get Started `);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-right",
                    class: "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createTextVNode(" Get Started "),
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-right",
                      class: "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    })
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
                  class: "cta-button group inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-flamingo-500/25 transition-all hover:bg-flamingo-400 hover:shadow-flamingo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-flamingo-500 focus-visible:outline-offset-2"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Get Started "),
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-right",
                      class: "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    })
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
        if (unref(authStore).isAuthenticated && unref(isClient)) {
          _push(`<div class="mt-3 grid gap-2 px-3"><button class="btn-primary cta-button flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-center text-sm font-semibold"${ssrIncludeBooleanAttr(unref(becomingShopOwner)) ? " disabled" : ""}>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-store",
            class: "h-4 w-4"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(becomingShopOwner) ? "Updating..." : "Become a shop owner")}</button></div>`);
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
            class: "cta-button group inline-flex items-center justify-center gap-2 rounded-xl bg-flamingo-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-flamingo-400",
            onClick: ($event) => mobileOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Get Started `);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-arrow-right",
                  class: "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createTextVNode(" Get Started "),
                  createVNode(_component_UIcon, {
                    name: "i-lucide-arrow-right",
                    class: "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  })
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHeader.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$3, { __name: "AppHeader" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "HomeFooterLinks",
  __ssrInlineRender: true,
  setup(__props) {
    const productLinks = [
      { to: "/products", label: "All products" },
      { to: "/products/business-cards", label: "Business cards" },
      { to: "/products/flyers", label: "Flyers" },
      { to: "/products/brochures", label: "Brochures" },
      { to: "/products/stickers", label: "Stickers" },
      { to: "/products/banners", label: "Banners" },
      { to: "/gallery", label: "Gallery" }
    ];
    const locationLinks = [
      { to: "/locations", label: "All locations" },
      { to: "/locations/nairobi", label: "Nairobi" },
      { to: "/locations/westlands", label: "Westlands" },
      { to: "/locations/kilimani", label: "Kilimani" },
      { to: "/locations/cbd", label: "CBD" },
      { to: "/locations/mombasa", label: "Mombasa" },
      { to: "/locations/kisumu", label: "Kisumu" }
    ];
    const shopLinks = [
      { to: "/shops", label: "Browse shops" },
      { to: "/auth/signup", label: "Add your shop" },
      { to: "/#how-it-works", label: "How it works" },
      { to: "/help", label: "Help" }
    ];
    const legalLinks = [
      { to: "/terms", label: "Terms of Service" },
      { to: "/privacy", label: "Privacy Policy" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-2 gap-8 sm:grid-cols-4" }, _attrs))}><div><h4 class="mb-4 font-semibold text-white">Products</h4><ul class="space-y-3 text-sm text-gray-300"><!--[-->`);
      ssrRenderList(productLinks, (link) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.to,
          class: "transition-colors hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div><h4 class="mb-4 font-semibold text-white">Locations</h4><ul class="space-y-3 text-sm text-gray-300"><!--[-->`);
      ssrRenderList(locationLinks, (link) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.to,
          class: "transition-colors hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div><h4 class="mb-4 font-semibold text-white">Shops</h4><ul class="space-y-3 text-sm text-gray-300"><!--[-->`);
      ssrRenderList(shopLinks, (link) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.to,
          class: "transition-colors hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div><h4 class="mb-4 font-semibold text-white">Legal</h4><ul class="space-y-3 text-sm text-gray-300"><!--[-->`);
      ssrRenderList(legalLinks, (link) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.to,
          class: "transition-colors hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomeFooterLinks.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "HomeFooterLinks" });
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_HomeFooterLinks = __nuxt_component_0;
  const _component_CommonPrintyLogoMark = __nuxt_component_1$1;
  const _component_ClientOnly = __nuxt_component_2$1;
  const _component_NuxtLink = __nuxt_component_3$1;
  _push(`<footer${ssrRenderAttrs(mergeProps({
    class: "relative overflow-hidden bg-[#101828] py-12 text-gray-300 sm:py-16",
    style: { "font-family": "var(--font-body)" }
  }, _attrs))}><div class="pointer-events-none absolute inset-0 opacity-70"><div class="absolute left-[8%] top-10 h-2 w-2 rounded-full bg-flamingo-500/70"></div><div class="absolute left-[18%] top-24 h-1.5 w-1.5 rounded-full bg-flamingo-400/60"></div><div class="absolute left-[72%] top-16 h-2 w-2 rounded-full bg-flamingo-500/55"></div><div class="absolute right-[12%] top-28 h-1.5 w-1.5 rounded-full bg-flamingo-300/55"></div><div class="absolute bottom-20 left-[14%] h-1.5 w-1.5 rounded-full bg-flamingo-500/50"></div><div class="absolute bottom-12 left-[48%] h-2 w-2 rounded-full bg-flamingo-400/45"></div><div class="absolute bottom-24 right-[22%] h-1.5 w-1.5 rounded-full bg-flamingo-500/55"></div><div class="absolute bottom-10 right-[8%] h-2 w-2 rounded-full bg-flamingo-400/40"></div></div><div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="mb-10">`);
  _push(ssrRenderComponent(_component_HomeFooterLinks, null, null, _parent));
  _push(`</div><div class="flex flex-col items-center justify-between gap-4 border-t border-gray-700 pt-8 sm:flex-row"><div class="flex items-center gap-3"><div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-flamingo-600">`);
  _push(ssrRenderComponent(_component_CommonPrintyLogoMark, { "img-class": "h-4 w-4" }, null, _parent));
  _push(`</div><span class="text-sm">© `);
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
  _push(` Printy</span></div><div class="flex items-center gap-6 text-sm">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/privacy",
    class: "transition-colors hover:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Privacy`);
      } else {
        return [
          createTextVNode("Privacy")
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
        _push2(`Terms`);
      } else {
        return [
          createTextVNode("Terms")
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
      const _component_AppHeader = __nuxt_component_0$1;
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
//# sourceMappingURL=default-nBbNKsLk.mjs.map
