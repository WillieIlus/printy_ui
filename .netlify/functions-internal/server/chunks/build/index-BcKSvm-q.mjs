import { _ as __nuxt_component_0 } from './DashboardPageHeader-DY_0uFAc.mjs';
import { e as _sfc_main$9, a as _sfc_main$f, _ as __nuxt_component_3$1 } from './server.mjs';
import { _ as __nuxt_component_4, a as __nuxt_component_7 } from './EmptyStateCard-BgXxuhOj.mjs';
import { _ as __nuxt_component_2, a as __nuxt_component_11 } from './InfoCard-K1X9VF5P.mjs';
import { _ as _sfc_main$1 } from './Badge-CHxS7t2J.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { u as useSellerStore } from './seller-Bmym44up.mjs';
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
import './seller-B-6aM_bM.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const sellerStore = useSellerStore();
    const machines = ref([]);
    const papers = ref([]);
    const products = ref([]);
    const activeShop = computed(() => sellerStore.shops[0] ?? null);
    const welcomeTitle = computed(() => {
      const baseName = authStore.user?.name?.trim();
      if (baseName) return `Run your print shop with clarity, ${baseName.split(" ")[0]}`;
      return "Run your print shop with clarity";
    });
    const machineCta = computed(() => activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/machines` : "/dashboard/machines");
    const productCta = computed(() => activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/products/create` : "/dashboard/products");
    const papersCta = computed(() => activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/pricing` : "/dashboard/papers");
    const activeMachineCount = computed(() => machines.value.filter((machine) => machine.is_active !== false).length);
    const checklist = computed(() => [
      {
        label: "Add your first shop",
        description: "A shop gives Printy a place to attach your address, pricing, products, and production settings.",
        done: sellerStore.shops.length > 0,
        to: "/dashboard/shops/create",
        action: "Register a shop",
        icon: "i-lucide-store"
      },
      {
        label: "Add a machine",
        description: "Machines define what jobs you can realistically produce and which sheet sizes make sense.",
        done: activeMachineCount.value > 0,
        to: machineCta.value,
        action: "Add machine",
        icon: "i-lucide-printer"
      },
      {
        label: "Define a default paper size",
        description: "Choose parent sheets such as SRA3 so product imposition and costing can start from the right stock.",
        done: papers.value.length > 0,
        to: papersCta.value,
        action: "Add papers",
        icon: "i-lucide-file-stack"
      },
      {
        label: "Create your first product",
        description: "Products tie together size, sides, paper, and machine assumptions so quotes feel production-ready.",
        done: products.value.length > 0,
        to: productCta.value,
        action: "Create product",
        icon: "i-lucide-package"
      }
    ]);
    const recentItems = computed(() => {
      const items = [
        ...sellerStore.shops.slice(0, 2).map((shop) => ({
          type: "shop",
          id: shop.id,
          icon: "i-lucide-store",
          title: shop.name,
          caption: "Shop",
          description: "Business workspace is ready for machines, paper setup, and product configuration."
        })),
        ...machines.value.slice(0, 2).map((machine) => ({
          type: "machine",
          id: machine.id,
          icon: "i-lucide-printer",
          title: machine.name,
          caption: "Machine",
          description: `${machine.machine_type || "Machine"} is now part of your production planning and pricing setup.`
        })),
        ...products.value.slice(0, 2).map((product) => ({
          type: "product",
          id: product.id,
          icon: "i-lucide-package",
          title: product.name,
          caption: "Product",
          description: product.default_sheet_size ? `Defaults to ${product.default_sheet_size} for parent-sheet thinking and quote setup.` : "Ready for size, paper, and finishing refinement."
        }))
      ];
      return items.slice(0, 4);
    });
    const machineReadiness = computed(() => activeMachineCount.value ? `${activeMachineCount.value} active machine${activeMachineCount.value === 1 ? "" : "s"} configured for production planning.` : "No active machines yet. Add at least one digital, offset, or finishing machine.");
    const productReadiness = computed(() => products.value.length ? `${products.value.length} product${products.value.length === 1 ? "" : "s"} configured. Review default sheets and allowed stock to improve quote accuracy.` : "No products configured yet. Start with business cards, flyers, brochures, or banners.");
    const paperReminder = computed(() => papers.value.length ? `${papers.value.length} stock paper entr${papers.value.length === 1 ? "y is" : "ies are"} available. Make sure your default parent sheet matches common shop stock such as SRA3 or A3.` : "Add stock papers and mark the default parent sheet you use most often for imposition.");
    const nextActions = computed(() => {
      if (!sellerStore.shops.length) {
        return [
          {
            label: "Register your first shop",
            description: "Create the business workspace before setting machines, pricing, or products.",
            to: "/dashboard/shops/create",
            icon: "i-lucide-store"
          }
        ];
      }
      const items = [];
      if (!activeMachineCount.value) {
        items.push({
          label: "Add a production machine",
          description: "Capture max sheet size and operating status so jobs can be mapped to real equipment.",
          to: machineCta.value,
          icon: "i-lucide-printer"
        });
      }
      if (!papers.value.length) {
        items.push({
          label: "Set default parent sheets",
          description: "Add stock papers like SRA3 so imposition can estimate fit count and parent sheet usage.",
          to: papersCta.value,
          icon: "i-lucide-file-stack"
        });
      }
      if (!products.value.length) {
        items.push({
          label: "Create your first guided product",
          description: "Build a product with finished size, paper rules, and production defaults.",
          to: productCta.value,
          icon: "i-lucide-package"
        });
      }
      if (!items.length) {
        items.push({
          label: "Review pricing readiness",
          description: "Your basics are in place. Refine price setup so products can be published with confidence.",
          to: "/dashboard/pricing",
          icon: "i-lucide-wallet"
        });
      }
      return items;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_DashboardStatCard = __nuxt_component_4;
      const _component_DashboardFormSection = __nuxt_component_2;
      const _component_UBadge = _sfc_main$1;
      const _component_DashboardEmptyStateCard = __nuxt_component_7;
      const _component_DashboardInfoCard = __nuxt_component_11;
      const _component_NuxtLink = __nuxt_component_3$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: unref(welcomeTitle),
        subtitle: "Printy helps Kenyan print teams set up shops, machines, stock papers, products, and pricing so every job starts with clearer production logic."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/dashboard/shops/create",
              color: "primary",
              class: "justify-center"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-store",
                    class: "mr-2 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` Register New Shop `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-store",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Register New Shop ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              to: unref(machineCta),
              variant: "soft"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-printer",
                    class: "mr-2 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` Add Machine `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-printer",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Add Machine ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              to: unref(productCta),
              variant: "soft"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-package",
                    class: "mr-2 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` Create Product `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-package",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Create Product ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: "/dashboard/shops/create",
                color: "primary",
                class: "justify-center"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-store",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Register New Shop ")
                ]),
                _: 1
              }),
              createVNode(_component_UButton, {
                to: unref(machineCta),
                variant: "soft"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-printer",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Add Machine ")
                ]),
                _: 1
              }, 8, ["to"]),
              createVNode(_component_UButton, {
                to: unref(productCta),
                variant: "soft"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-package",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Create Product ")
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">`);
      _push(ssrRenderComponent(_component_DashboardStatCard, {
        label: "Total Shops",
        value: unref(sellerStore).shops.length,
        icon: "i-lucide-store",
        variant: "flamingo"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardStatCard, {
        label: "Active Machines",
        value: unref(activeMachineCount),
        icon: "i-lucide-printer",
        variant: "orange"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardStatCard, {
        label: "Configured Products",
        value: unref(products).length,
        icon: "i-lucide-package",
        variant: "blue"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardStatCard, {
        label: "Stock Paper Types",
        value: unref(papers).length,
        icon: "i-lucide-file-stack",
        variant: "green"
      }, null, _parent));
      _push(`</div><div class="grid gap-6 xl:grid-cols-[1.4fr_1fr]"><div class="space-y-6">`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Setup Progress",
        description: "Build the operational foundation once so every quote, print run, and finishing plan starts from real shop capability."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(checklist), (item) => {
              _push2(`<div class="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4"${_scopeId}><div class="${ssrRenderClass([item.done ? "bg-emerald-500/12 text-emerald-300" : "bg-white/5 text-orange-300", "mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10"])}"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: item.done ? "i-lucide-check" : item.icon,
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><div class="flex items-center justify-between gap-3"${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>${ssrInterpolate(item.label)}</p>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: item.done ? "success" : "warning",
                variant: "soft",
                size: "xs"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(item.done ? "Done" : "Next")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item.done ? "Done" : "Next"), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div><p class="mt-1 text-sm leading-6 text-slate-300"${_scopeId}>${ssrInterpolate(item.description)}</p>`);
              if (!item.done) {
                _push2(ssrRenderComponent(_component_UButton, {
                  to: item.to,
                  variant: "link",
                  color: "primary",
                  class: "mt-2 px-0"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(item.action)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(item.action), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(checklist), (item) => {
                  return openBlock(), createBlock("div", {
                    key: item.label,
                    class: "flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4"
                  }, [
                    createVNode("div", {
                      class: ["mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10", item.done ? "bg-emerald-500/12 text-emerald-300" : "bg-white/5 text-orange-300"]
                    }, [
                      createVNode(_component_UIcon, {
                        name: item.done ? "i-lucide-check" : item.icon,
                        class: "h-4 w-4"
                      }, null, 8, ["name"])
                    ], 2),
                    createVNode("div", { class: "min-w-0 flex-1" }, [
                      createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                        createVNode("p", { class: "text-sm font-semibold text-white" }, toDisplayString(item.label), 1),
                        createVNode(_component_UBadge, {
                          color: item.done ? "success" : "warning",
                          variant: "soft",
                          size: "xs"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(item.done ? "Done" : "Next"), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"])
                      ]),
                      createVNode("p", { class: "mt-1 text-sm leading-6 text-slate-300" }, toDisplayString(item.description), 1),
                      !item.done ? (openBlock(), createBlock(_component_UButton, {
                        key: 0,
                        to: item.to,
                        variant: "link",
                        color: "primary",
                        class: "mt-2 px-0"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.action), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])) : createCommentVNode("", true)
                    ])
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid gap-6 lg:grid-cols-2">`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Recent Activity",
        description: "A quick view of the resources most likely to need attention next."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(recentItems).length) {
              _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(unref(recentItems), (item) => {
                _push2(`<div class="rounded-2xl border border-white/10 bg-white/5 p-4"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>${ssrInterpolate(item.title)}</p><p class="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500"${_scopeId}>${ssrInterpolate(item.caption)}</p></div>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: item.icon,
                  class: "h-4 w-4 text-orange-300"
                }, null, _parent2, _scopeId));
                _push2(`</div><p class="mt-3 text-sm leading-6 text-slate-300"${_scopeId}>${ssrInterpolate(item.description)}</p></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(ssrRenderComponent(_component_DashboardEmptyStateCard, {
                title: "No activity yet",
                description: "Create your first shop to unlock recent machines, papers, products, and workflow reminders.",
                icon: "i-lucide-clock-3"
              }, null, _parent2, _scopeId));
            }
          } else {
            return [
              unref(recentItems).length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-3"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(recentItems), (item) => {
                  return openBlock(), createBlock("div", {
                    key: `${item.type}-${item.id}`,
                    class: "rounded-2xl border border-white/10 bg-white/5 p-4"
                  }, [
                    createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm font-semibold text-white" }, toDisplayString(item.title), 1),
                        createVNode("p", { class: "mt-1 text-xs uppercase tracking-[0.24em] text-slate-500" }, toDisplayString(item.caption), 1)
                      ]),
                      createVNode(_component_UIcon, {
                        name: item.icon,
                        class: "h-4 w-4 text-orange-300"
                      }, null, 8, ["name"])
                    ]),
                    createVNode("p", { class: "mt-3 text-sm leading-6 text-slate-300" }, toDisplayString(item.description), 1)
                  ]);
                }), 128))
              ])) : (openBlock(), createBlock(_component_DashboardEmptyStateCard, {
                key: 1,
                title: "No activity yet",
                description: "Create your first shop to unlock recent machines, papers, products, and workflow reminders.",
                icon: "i-lucide-clock-3"
              }))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Guidance",
        description: "Production advice based on what is already configured in your workspace."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_DashboardInfoCard, {
              title: "Parent sheet logic",
              description: "Define a default parent sheet such as SRA3, then products can estimate fit count, parent sheets needed, and downstream print cost more reliably.",
              icon: "i-lucide-layout-template",
              tone: "orange"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInfoCard, {
              title: "Machine readiness",
              description: unref(activeMachineCount) ? "Your machine list is live. Keep max sheet sizes aligned with products and stock paper so invalid jobs are caught earlier." : "Add at least one machine so products and pricing can reflect what your shop can actually produce.",
              icon: "i-lucide-settings-2",
              tone: "blue"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInfoCard, {
              title: "Paper coverage",
              description: unref(papers).length ? "Paper stock exists. Mark the parent sheet you reach for most often so imposition defaults stay practical for quoting." : "No stock papers yet. Add SRA3, A3, or other parent sheets you keep in the shop so pricing can map to real stock.",
              icon: "i-lucide-file-stack",
              tone: "green"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                createVNode(_component_DashboardInfoCard, {
                  title: "Parent sheet logic",
                  description: "Define a default parent sheet such as SRA3, then products can estimate fit count, parent sheets needed, and downstream print cost more reliably.",
                  icon: "i-lucide-layout-template",
                  tone: "orange"
                }),
                createVNode(_component_DashboardInfoCard, {
                  title: "Machine readiness",
                  description: unref(activeMachineCount) ? "Your machine list is live. Keep max sheet sizes aligned with products and stock paper so invalid jobs are caught earlier." : "Add at least one machine so products and pricing can reflect what your shop can actually produce.",
                  icon: "i-lucide-settings-2",
                  tone: "blue"
                }, null, 8, ["description"]),
                createVNode(_component_DashboardInfoCard, {
                  title: "Paper coverage",
                  description: unref(papers).length ? "Paper stock exists. Mark the parent sheet you reach for most often so imposition defaults stay practical for quoting." : "No stock papers yet. Add SRA3, A3, or other parent sheets you keep in the shop so pricing can map to real stock.",
                  icon: "i-lucide-file-stack",
                  tone: "green"
                }, null, 8, ["description"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="space-y-6">`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Shop Health",
        description: "A summary of how ready your current workspace is for real production."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><div class="rounded-2xl border border-white/10 bg-white/5 p-4"${_scopeId}><div class="flex items-center justify-between gap-3"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>Machine readiness</p><p class="mt-1 text-sm text-slate-300"${_scopeId}>${ssrInterpolate(unref(machineReadiness))}</p></div>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              color: unref(activeMachineCount) ? "success" : "warning",
              variant: "soft",
              size: "xs"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(activeMachineCount) ? "Ready" : "Attention")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(activeMachineCount) ? "Ready" : "Attention"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="rounded-2xl border border-white/10 bg-white/5 p-4"${_scopeId}><div class="flex items-center justify-between gap-3"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>Product setup completeness</p><p class="mt-1 text-sm text-slate-300"${_scopeId}>${ssrInterpolate(unref(productReadiness))}</p></div>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              color: unref(products).length ? "success" : "warning",
              variant: "soft",
              size: "xs"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(products).length ? "Configured" : "Missing")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(products).length ? "Configured" : "Missing"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="rounded-2xl border border-white/10 bg-white/5 p-4"${_scopeId}><div class="flex items-center justify-between gap-3"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>Paper &amp; imposition reminders</p><p class="mt-1 text-sm text-slate-300"${_scopeId}>${ssrInterpolate(unref(paperReminder))}</p></div>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              color: unref(papers).length ? "success" : "warning",
              variant: "soft",
              size: "xs"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(papers).length ? "Tracked" : "Needed")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(papers).length ? "Tracked" : "Needed"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("div", { class: "rounded-2xl border border-white/10 bg-white/5 p-4" }, [
                  createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-sm font-semibold text-white" }, "Machine readiness"),
                      createVNode("p", { class: "mt-1 text-sm text-slate-300" }, toDisplayString(unref(machineReadiness)), 1)
                    ]),
                    createVNode(_component_UBadge, {
                      color: unref(activeMachineCount) ? "success" : "warning",
                      variant: "soft",
                      size: "xs"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(activeMachineCount) ? "Ready" : "Attention"), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])
                  ])
                ]),
                createVNode("div", { class: "rounded-2xl border border-white/10 bg-white/5 p-4" }, [
                  createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-sm font-semibold text-white" }, "Product setup completeness"),
                      createVNode("p", { class: "mt-1 text-sm text-slate-300" }, toDisplayString(unref(productReadiness)), 1)
                    ]),
                    createVNode(_component_UBadge, {
                      color: unref(products).length ? "success" : "warning",
                      variant: "soft",
                      size: "xs"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(products).length ? "Configured" : "Missing"), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])
                  ])
                ]),
                createVNode("div", { class: "rounded-2xl border border-white/10 bg-white/5 p-4" }, [
                  createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-sm font-semibold text-white" }, "Paper & imposition reminders"),
                      createVNode("p", { class: "mt-1 text-sm text-slate-300" }, toDisplayString(unref(paperReminder)), 1)
                    ]),
                    createVNode(_component_UBadge, {
                      color: unref(papers).length ? "success" : "warning",
                      variant: "soft",
                      size: "xs"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(papers).length ? "Tracked" : "Needed"), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Next Best Actions",
        description: "Recommended moves for the next five minutes."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(nextActions), (action) => {
              _push2(ssrRenderComponent(_component_NuxtLink, {
                key: action.label,
                to: action.to,
                class: "flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-orange-300/30 hover:bg-orange-500/10"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: action.icon,
                      class: "h-4 w-4 text-orange-300"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div class="min-w-0"${_scopeId2}><p class="text-sm font-semibold text-white"${_scopeId2}>${ssrInterpolate(action.label)}</p><p class="mt-1 text-sm leading-6 text-slate-300"${_scopeId2}>${ssrInterpolate(action.description)}</p></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10" }, [
                        createVNode(_component_UIcon, {
                          name: action.icon,
                          class: "h-4 w-4 text-orange-300"
                        }, null, 8, ["name"])
                      ]),
                      createVNode("div", { class: "min-w-0" }, [
                        createVNode("p", { class: "text-sm font-semibold text-white" }, toDisplayString(action.label), 1),
                        createVNode("p", { class: "mt-1 text-sm leading-6 text-slate-300" }, toDisplayString(action.description), 1)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(nextActions), (action) => {
                  return openBlock(), createBlock(_component_NuxtLink, {
                    key: action.label,
                    to: action.to,
                    class: "flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-orange-300/30 hover:bg-orange-500/10"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10" }, [
                        createVNode(_component_UIcon, {
                          name: action.icon,
                          class: "h-4 w-4 text-orange-300"
                        }, null, 8, ["name"])
                      ]),
                      createVNode("div", { class: "min-w-0" }, [
                        createVNode("p", { class: "text-sm font-semibold text-white" }, toDisplayString(action.label), 1),
                        createVNode("p", { class: "mt-1 text-sm leading-6 text-slate-300" }, toDisplayString(action.description), 1)
                      ])
                    ]),
                    _: 2
                  }, 1032, ["to"]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BcKSvm-q.mjs.map
