import { _ as __nuxt_component_0 } from './DashboardPageHeader-C_rdBHa1.mjs';
import { c as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_3 } from './SkeletonState-CnWAboWg.mjs';
import { _ as __nuxt_component_2 } from './SectionCard-CE2OEmkZ.mjs';
import { _ as _sfc_main$2 } from './Card-DKHttVBV.mjs';
import { defineComponent, resolveComponent, mergeProps, withCtx, createVNode, createTextVNode, unref, openBlock, createBlock, Fragment, renderList, toDisplayString, renderSlot, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
import { u as useProfileStore } from './profile-CEiUsRUc.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SocialLinksManager",
  __ssrInlineRender: true,
  props: {
    links: {}
  },
  emits: ["remove"],
  setup(__props) {
    const PLATFORM_ICONS = {
      facebook: "i-simple-icons-facebook",
      twitter: "i-simple-icons-x",
      instagram: "i-simple-icons-instagram",
      linkedin: "i-simple-icons-linkedin",
      youtube: "i-simple-icons-youtube",
      tiktok: "i-simple-icons-tiktok",
      pinterest: "i-simple-icons-pinterest",
      website: "i-lucide-globe"
    };
    function platformIcon(platform) {
      return PLATFORM_ICONS[platform.toLowerCase()] ?? "i-lucide-link";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$2;
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      _push(ssrRenderComponent(_component_UCard, _attrs, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Social links</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Social links")
            ];
          }
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "add-button", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "add-button")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.links?.length) {
              _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.links, (link) => {
                _push2(`<div class="flex items-center justify-between rounded-lg border dark:border-gray-700 p-3"${_scopeId}><div class="flex items-center gap-3"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: platformIcon(link.platform),
                  class: "w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0"
                }, null, _parent2, _scopeId));
                _push2(`<div${_scopeId}><p class="font-medium text-gray-900 dark:text-white capitalize"${_scopeId}>${ssrInterpolate(link.platform)}</p><a${ssrRenderAttr("href", link.url)} target="_blank" rel="noopener" class="text-sm text-primary-600 dark:text-primary-400 truncate block max-w-[200px]"${_scopeId}>${ssrInterpolate(link.url)}</a></div></div>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  variant: "soft",
                  color: "error",
                  size: "sm",
                  icon: "i-lucide-trash-2",
                  "aria-label": "Remove",
                  onClick: ($event) => _ctx.$emit("remove", link.id)
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<p class="text-sm text-gray-500 dark:text-gray-400 py-2"${_scopeId}>No social links added.</p>`);
            }
          } else {
            return [
              __props.links?.length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-3"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.links, (link) => {
                  return openBlock(), createBlock("div", {
                    key: link.id,
                    class: "flex items-center justify-between rounded-lg border dark:border-gray-700 p-3"
                  }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode(_component_UIcon, {
                        name: platformIcon(link.platform),
                        class: "w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0"
                      }, null, 8, ["name"]),
                      createVNode("div", null, [
                        createVNode("p", { class: "font-medium text-gray-900 dark:text-white capitalize" }, toDisplayString(link.platform), 1),
                        createVNode("a", {
                          href: link.url,
                          target: "_blank",
                          rel: "noopener",
                          class: "text-sm text-primary-600 dark:text-primary-400 truncate block max-w-[200px]"
                        }, toDisplayString(link.url), 9, ["href"])
                      ])
                    ]),
                    createVNode(_component_UButton, {
                      variant: "soft",
                      color: "error",
                      size: "sm",
                      icon: "i-lucide-trash-2",
                      "aria-label": "Remove",
                      onClick: ($event) => _ctx.$emit("remove", link.id)
                    }, null, 8, ["onClick"])
                  ]);
                }), 128))
              ])) : (openBlock(), createBlock("p", {
                key: 1,
                class: "text-sm text-gray-500 dark:text-gray-400 py-2"
              }, "No social links added."))
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/SocialLinksManager.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$1, { __name: "ProfileSocialLinksManager" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const profileStore = useProfileStore();
    const notification = useNotification();
    async function onRemoveLink(id) {
      const result = await profileStore.deleteSocialLink(id);
      if (result.success) {
        notification.success("Social link removed");
      } else {
        notification.error(result.error ?? "Failed to remove link");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_DashboardSkeletonState = __nuxt_component_3;
      const _component_DashboardSectionCard = __nuxt_component_2;
      const _component_ProfileProfileCard = resolveComponent("ProfileProfileCard");
      const _component_ProfileSocialLinksManager = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Profile",
        subtitle: "View and manage your profile"
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/dashboard/profile/edit",
              variant: "outline",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-edit",
                    class: "w-4 h-4 mr-2"
                  }, null, _parent3, _scopeId2));
                  _push3(` Edit profile `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-edit",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" Edit profile ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: "/dashboard/profile/edit",
                variant: "outline",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-edit",
                    class: "w-4 h-4 mr-2"
                  }),
                  createTextVNode(" Edit profile ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(profileStore).loading) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent));
      } else {
        _push(`<div class="col-span-12 space-y-6">`);
        _push(ssrRenderComponent(_component_DashboardSectionCard, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_ProfileProfileCard, {
                profile: unref(profileStore).profile
              }, {
                actions: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UButton, {
                      to: "/dashboard/profile/edit",
                      variant: "outline",
                      size: "sm"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UIcon, {
                            name: "i-lucide-edit",
                            class: "w-4 h-4 mr-2"
                          }, null, _parent4, _scopeId3));
                          _push4(` Edit profile `);
                        } else {
                          return [
                            createVNode(_component_UIcon, {
                              name: "i-lucide-edit",
                              class: "w-4 h-4 mr-2"
                            }),
                            createTextVNode(" Edit profile ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UButton, {
                        to: "/dashboard/profile/edit",
                        variant: "outline",
                        size: "sm"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-edit",
                            class: "w-4 h-4 mr-2"
                          }),
                          createTextVNode(" Edit profile ")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_ProfileProfileCard, {
                  profile: unref(profileStore).profile
                }, {
                  actions: withCtx(() => [
                    createVNode(_component_UButton, {
                      to: "/dashboard/profile/edit",
                      variant: "outline",
                      size: "sm"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-edit",
                          class: "w-4 h-4 mr-2"
                        }),
                        createTextVNode(" Edit profile ")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["profile"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_DashboardSectionCard, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_ProfileSocialLinksManager, {
                links: unref(profileStore).profile?.social_links,
                onRemove: onRemoveLink
              }, {
                "add-button": withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UButton, {
                      to: "/dashboard/profile/edit",
                      variant: "outline",
                      size: "sm"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Add link`);
                        } else {
                          return [
                            createTextVNode("Add link")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UButton, {
                        to: "/dashboard/profile/edit",
                        variant: "outline",
                        size: "sm"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Add link")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_ProfileSocialLinksManager, {
                  links: unref(profileStore).profile?.social_links,
                  onRemove: onRemoveLink
                }, {
                  "add-button": withCtx(() => [
                    createVNode(_component_UButton, {
                      to: "/dashboard/profile/edit",
                      variant: "outline",
                      size: "sm"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Add link")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["links"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/profile/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D0_s_039.mjs.map
