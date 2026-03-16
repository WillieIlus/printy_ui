import { _ as __nuxt_component_0 } from './DashboardPageHeader-C_rdBHa1.mjs';
import { c as _sfc_main$9, a as _sfc_main$f, _ as __nuxt_component_3$1 } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$1 } from './Badge-BGajth1Y.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { defineComponent, ref, computed, watch, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { b as formatDate } from './formatters-D5StX5za.mjs';
import { a as useJobRequests, b as useJobClaims } from './useJobRequests-CaMl3x-X.mjs';
import { u as useAuth } from './useAuth-DJctfsm1.mjs';
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
import './profile-CEiUsRUc.mjs';
import './api-error-D1IYk86E.mjs';
import './shop-D6P1awrr.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const jobRequests = useJobRequests();
    const jobClaims = useJobClaims();
    const { user } = useAuth();
    const notification = useNotification();
    const tab = ref("open");
    const jobs = ref([]);
    const claims = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const displayJobs = computed(() => {
      if (tab.value === "open") {
        return jobs.value.filter((j) => j.status === "OPEN");
      }
      if (tab.value === "mine") {
        return jobs.value.filter((j) => j.created_by === user.value?.id);
      }
      return [];
    });
    function statusColor(s) {
      const m = {
        OPEN: "success",
        CLAIMED: "neutral",
        CLOSED: "error"
      };
      return m[s] ?? "neutral";
    }
    const loadingClaims = ref(false);
    function claimStatusColor(s) {
      const m = {
        PENDING: "neutral",
        ACCEPTED: "success",
        REJECTED: "error"
      };
      return m[s] ?? "neutral";
    }
    async function fetchJobs() {
      loading.value = true;
      error.value = null;
      try {
        const res = await jobRequests.list();
        jobs.value = res.results;
      } catch (e) {
        error.value = e instanceof Error ? e.message : "Failed to load jobs";
        jobs.value = [];
      } finally {
        loading.value = false;
      }
    }
    async function fetchClaims() {
      loadingClaims.value = true;
      try {
        const res = await jobClaims.list({ claimed_by: "me" });
        claims.value = res.results;
      } catch {
        claims.value = [];
      } finally {
        loadingClaims.value = false;
      }
    }
    async function onAcceptClaim(claimId) {
      try {
        await jobClaims.accept(claimId);
        notification.success("Claim accepted");
        await fetchJobs();
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to accept");
      }
    }
    async function onRejectClaim(claimId) {
      try {
        await jobClaims.reject(claimId);
        notification.success("Claim rejected");
        await fetchJobs();
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to reject");
      }
    }
    watch(tab, (t) => {
      if (t === "claims") fetchClaims();
      else fetchJobs();
    }, { immediate: false });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UBadge = _sfc_main$1;
      const _component_DashboardEmptyState = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Jobs",
        subtitle: "Production jobs and overflow work sharing"
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              to: "/dashboard/jobs/create"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-2"
                  }, null, _parent3, _scopeId2));
                  _push3(` Create Job Request `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" Create Job Request ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                color: "primary",
                to: "/dashboard/jobs/create"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-2"
                  }),
                  createTextVNode(" Create Job Request ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex gap-2 border-b border-[var(--p-border)] pb-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: unref(tab) === "open" ? "solid" : "soft",
        color: unref(tab) === "open" ? "primary" : "neutral",
        size: "sm",
        onClick: ($event) => tab.value = "open"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Open Jobs `);
          } else {
            return [
              createTextVNode(" Open Jobs ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: unref(tab) === "mine" ? "solid" : "soft",
        color: unref(tab) === "mine" ? "primary" : "neutral",
        size: "sm",
        onClick: ($event) => tab.value = "mine"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` My Job Requests `);
          } else {
            return [
              createTextVNode(" My Job Requests ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: unref(tab) === "claims" ? "solid" : "soft",
        color: unref(tab) === "claims" ? "primary" : "neutral",
        size: "sm",
        onClick: ($event) => tab.value = "claims"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` My Claims `);
          } else {
            return [
              createTextVNode(" My Claims ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loading) && unref(tab) !== "claims") {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4"><p class="text-sm text-red-700 dark:text-red-300">${ssrInterpolate(unref(error))}</p></div>`);
      } else if (unref(tab) === "claims") {
        _push(`<div class="space-y-4">`);
        if (unref(loadingClaims)) {
          _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
        } else if (unref(claims).length) {
          _push(`<div class="space-y-3"><!--[-->`);
          ssrRenderList(unref(claims), (c) => {
            _push(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 flex items-center justify-between gap-4"><div class="min-w-0">`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/dashboard/jobs/${c.job_request}`,
              class: "font-medium text-[var(--p-text)] hover:underline"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(c.job_request_title || `Job #${c.job_request}`)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(c.job_request_title || `Job #${c.job_request}`), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            if (c.message) {
              _push(`<p class="text-sm text-[var(--p-text-muted)] truncate mt-0.5">${ssrInterpolate(c.message)}</p>`);
            } else {
              _push(`<!---->`);
            }
            if (c.price_offered) {
              _push(`<p class="text-xs text-[var(--p-text-dim)]">KES ${ssrInterpolate(c.price_offered)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
            _push(ssrRenderComponent(_component_UBadge, {
              color: claimStatusColor(c.status),
              variant: "soft",
              size: "sm"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(c.status)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(c.status), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(ssrRenderComponent(_component_DashboardEmptyState, {
            title: "No claims yet",
            description: "Claim open jobs to see them here.",
            icon: "i-lucide-hand"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "primary",
                  onClick: ($event) => {
                    tab.value = "open";
                    fetchJobs();
                  }
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Browse jobs`);
                    } else {
                      return [
                        createTextVNode("Browse jobs")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UButton, {
                    color: "primary",
                    onClick: ($event) => {
                      tab.value = "open";
                      fetchJobs();
                    }
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Browse jobs")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`</div>`);
      } else if (unref(displayJobs).length) {
        _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(displayJobs), (job) => {
          _push(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700"><div class="flex justify-between items-start"><h3 class="font-semibold text-[var(--p-text)]">${ssrInterpolate(job.title)}</h3>`);
          _push(ssrRenderComponent(_component_UBadge, {
            color: statusColor(job.status),
            variant: "soft",
            size: "xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(job.status)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(job.status), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
          if (job.location) {
            _push(`<p class="text-sm text-[var(--p-text-muted)] mt-0.5">${ssrInterpolate(job.location)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (job.deadline) {
            _push(`<p class="text-xs text-[var(--p-text-dim)] mt-1"> Deadline: ${ssrInterpolate(unref(formatDate)(job.deadline))}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(tab) === "mine" && (job.claims_count ?? 0) > 0) {
            _push(`<p class="text-xs text-[var(--p-text-muted)] mt-1">${ssrInterpolate(job.claims_count)} claim${ssrInterpolate(job.claims_count === 1 ? "" : "s")}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(tab) === "mine" && (job.claims?.length ?? 0) > 0) {
            _push(`<div class="mt-2 space-y-1.5"><!--[-->`);
            ssrRenderList(job.claims, (c) => {
              _push(`<div class="flex items-center justify-between gap-2 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-2 text-xs"><div class="min-w-0 truncate"><span class="font-medium text-[var(--p-text)]">${ssrInterpolate(c.claimed_by_email)}</span>`);
              if (c.message) {
                _push(`<span class="text-[var(--p-text-muted)]"> · ${ssrInterpolate(c.message)}</span>`);
              } else {
                _push(`<!---->`);
              }
              if (c.price_offered) {
                _push(`<span class="text-[var(--p-text-dim)]"> KES ${ssrInterpolate(c.price_offered)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div><div class="flex items-center gap-1 shrink-0">`);
              _push(ssrRenderComponent(_component_UBadge, {
                color: claimStatusColor(c.status),
                variant: "soft",
                size: "xs"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(c.status)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(c.status), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
              if (c.status === "PENDING") {
                _push(`<!--[-->`);
                _push(ssrRenderComponent(_component_UButton, {
                  size: "xs",
                  color: "success",
                  onClick: ($event) => onAcceptClaim(c.id)
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`Accept`);
                    } else {
                      return [
                        createTextVNode("Accept")
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
                _push(ssrRenderComponent(_component_UButton, {
                  size: "xs",
                  variant: "soft",
                  color: "error",
                  onClick: ($event) => onRejectClaim(c.id)
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`Reject`);
                    } else {
                      return [
                        createTextVNode("Reject")
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
                _push(`<!--]-->`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="mt-3 flex gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "xs",
            to: `/dashboard/jobs/${job.id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View `);
              } else {
                return [
                  createTextVNode(" View ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: unref(tab) === "open" ? "No open jobs" : "No job requests yet",
          description: unref(tab) === "open" ? "Check back later or create your own." : "Create a job request to share overflow work.",
          icon: "i-lucide-briefcase"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(tab) === "mine") {
                _push2(ssrRenderComponent(_component_UButton, {
                  to: "/dashboard/jobs/create",
                  color: "primary"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Create Job Request`);
                    } else {
                      return [
                        createTextVNode("Create Job Request")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                unref(tab) === "mine" ? (openBlock(), createBlock(_component_UButton, {
                  key: 0,
                  to: "/dashboard/jobs/create",
                  color: "primary"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Create Job Request")
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/jobs/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DKIoWefA.mjs.map
