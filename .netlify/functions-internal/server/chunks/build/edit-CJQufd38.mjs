import { _ as __nuxt_component_0 } from './DashboardPageHeader-C_rdBHa1.mjs';
import { u as useAuthStore, c as _sfc_main$9, n as navigateTo, v as safeLogError } from './server.mjs';
import { _ as __nuxt_component_3 } from './SkeletonState-CnWAboWg.mjs';
import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useProfileStore } from './profile-CEiUsRUc.mjs';
import { u as useUserStore } from './user-WuCtWhZS.mjs';
import { p as parseApiError } from './api-error-D1IYk86E.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const profileStore = useProfileStore();
    const userStore = useUserStore();
    const authStore = useAuthStore();
    const notification = useNotification();
    const saving = ref(false);
    const userForForm = computed(() => authStore.user ?? userStore.currentUser);
    function goBack() {
      navigateTo("/dashboard/profile");
    }
    async function onSubmit(data) {
      saving.value = true;
      try {
        const userResult = await userStore.updateMe({
          first_name: data.first_name,
          last_name: data.last_name
        });
        if (!userResult.success) {
          notification.error(userResult.error ?? "Failed to update name");
          return;
        }
        let profileId = profileStore.profile?.id;
        if (!profileId) {
          const created = await profileStore.createProfile();
          if (created && profileStore.profile) {
            profileId = profileStore.profile.id;
          } else {
            notification.error(profileStore.error ?? "Failed to create profile. Please try again.");
            return;
          }
        }
        if (profileId) {
          const profileResult = await profileStore.updateProfile({
            bio: data.bio ?? null,
            phone: data.phone ?? null,
            address: data.address ?? null,
            city: data.city ?? null,
            state: data.state ?? null,
            country: data.country ?? null,
            postal_code: data.postal_code ?? null
          });
          if (!profileResult.success) {
            notification.error(profileResult.error ?? "Failed to update profile");
            return;
          }
          const existingIds = [...profileStore.profile?.social_links ?? []].map((l) => l.id);
          for (const id of existingIds) {
            const delResult = await profileStore.deleteSocialLink(id);
            if (!delResult.success) {
              notification.error(delResult.error ?? "Failed to remove link");
              return;
            }
          }
          const newLinks = (data.social_links ?? []).filter((l) => l.url?.trim());
          for (const link of newLinks) {
            const addResult = await profileStore.addProfileSocialLink(profileId, {
              platform: link.platform,
              url: link.url
            });
            if (!addResult.success) {
              notification.error(addResult.error ?? "Failed to add link");
              return;
            }
          }
        }
        await userStore.fetchMe();
        await profileStore.fetchProfile();
        if (authStore.user) {
          await authStore.fetchMe();
        }
        notification.success("Profile and social links saved successfully");
        await navigateTo("/dashboard/profile");
      } catch (err) {
        safeLogError(err, "profile.edit");
        notification.error(parseApiError(err, "Update failed"));
      } finally {
        saving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardSkeletonState = __nuxt_component_3;
      const _component_ProfileProfileEditForm = resolveComponent("ProfileProfileEditForm");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Edit profile",
        subtitle: "Update your profile information"
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/dashboard/profile",
              variant: "soft",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back`);
                } else {
                  return [
                    createTextVNode("Back")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: "/dashboard/profile",
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(profileStore).loading && !unref(profileStore).profile) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_ProfileProfileEditForm, {
          profile: unref(profileStore).profile,
          user: unref(userForForm),
          loading: unref(saving),
          onSubmit,
          onCancel: goBack
        }, null, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/profile/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit-CJQufd38.mjs.map
