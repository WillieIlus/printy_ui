import { d as useAuthStore, b as _sfc_main$9, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_2 } from './FormSection-CG38mMf8.mjs';
import { _ as _sfc_main$1 } from './Alert-BQjQ5uNh.mjs';
import { _ as __nuxt_component_4 } from './ProfileEditForm-28ZWb8EH.mjs';
import { _ as __nuxt_component_11 } from './InfoCard-D-56bxET.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, unref, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useNotification } from './useNotification-DxMfmZhF.mjs';
import { u as useProfileStore } from './profile-v5Kfn5BI.mjs';
import { u as useUserStore } from './user-lxgd7NjH.mjs';
import { u as useMediaUrl } from './media-sdQXCpZi.mjs';
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
import 'vue-i18n';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './FormInput-Ci9MIR6u.mjs';
import './formUi-NbOzRwMW.mjs';
import './SelectMenu-D3Bra_sq.mjs';
import './Input-Hudv-7BP.mjs';
import './FormTextarea-CvR62LkK.mjs';
import 'yup';
import './payload-B_6emhZU.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const notification = useNotification();
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const userStore = useUserStore();
    const saving = ref(false);
    const saveError = ref("");
    const saveSuccess = ref("");
    const avatarUploading = ref(false);
    const avatarError = ref("");
    const avatarStatus = ref("");
    const avatarInput = ref(null);
    const loading = computed(() => !authStore.user || profileStore.loading);
    const getMediaUrl = useMediaUrl();
    const avatarPreviewSrc = computed(() => getMediaUrl(profileStore.profile?.avatar ?? authStore.user?.avatar ?? null));
    const avatarInitials = computed(() => {
      const fullName = [authStore.user?.first_name, authStore.user?.last_name].filter(Boolean).join(" ").trim();
      return fullName.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U";
    });
    function buildFullName(payload) {
      if (payload.name?.trim()) return payload.name.trim();
      return [payload.first_name?.trim(), payload.last_name?.trim()].filter(Boolean).join(" ").trim();
    }
    async function saveProfile(payload) {
      saveError.value = "";
      saveSuccess.value = "";
      saving.value = true;
      try {
        const result = await userStore.updateMe({
          ...payload,
          name: buildFullName(payload)
        });
        if (!result.success) {
          saveError.value = result.error ?? "Profile update failed.";
          return;
        }
        await Promise.all([authStore.fetchMe(), profileStore.fetchProfile()]);
        saveSuccess.value = "Your profile details were saved successfully.";
        notification.success("Profile updated successfully.");
        await navigateTo("/account");
      } catch (error) {
        saveError.value = error instanceof Error ? error.message : "Profile update failed.";
      } finally {
        saving.value = false;
      }
    }
    async function onAvatarSelected(event) {
      const input = event.target;
      const file = input?.files?.[0];
      if (!file) return;
      avatarUploading.value = true;
      avatarError.value = "";
      avatarStatus.value = "";
      try {
        const result = await profileStore.uploadAvatar(file);
        if (!result.success) {
          avatarError.value = result.error ?? "Avatar upload failed.";
          return;
        }
        await Promise.all([authStore.fetchMe(), profileStore.fetchProfile()]);
        avatarStatus.value = "Avatar updated successfully.";
        notification.success("Avatar updated successfully.");
      } catch (error) {
        avatarError.value = error instanceof Error ? error.message : "Avatar upload failed.";
      } finally {
        avatarUploading.value = false;
        if (input) input.value = "";
      }
    }
    async function goBack() {
      await navigateTo("/account");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_DashboardFormSection = __nuxt_component_2;
      const _component_UAlert = _sfc_main$1;
      const _component_ProfileEditForm = __nuxt_component_4;
      const _component_DashboardInfoCard = __nuxt_component_11;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Account</p><h1 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Edit profile</h1><p class="mt-2 text-sm text-[var(--p-text-muted)]"> Update your profile details, public links, and avatar with the same live account API used in the customer workspace. </p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        onClick: goBack
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Back to Account`);
          } else {
            return [
              createTextVNode("Back to Account")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.85fr]">`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Profile Details",
        description: "Name, language, phone, address, bio, avatar, and social links are supported here through the live account API."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-6 rounded-[24px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"${_scopeId}><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"${_scopeId}><div class="flex items-center gap-4"${_scopeId}><div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[var(--p-border)] bg-[var(--p-surface)]"${_scopeId}>`);
            if (unref(avatarPreviewSrc)) {
              _push2(`<img${ssrRenderAttr("src", unref(avatarPreviewSrc))} alt="Profile avatar" class="h-full w-full object-cover"${_scopeId}>`);
            } else {
              _push2(`<span class="inline-flex h-full w-full items-center justify-center bg-[var(--color-primary-600)] text-lg font-semibold text-white"${_scopeId}>${ssrInterpolate(unref(avatarInitials))}</span>`);
            }
            _push2(`</div><div${_scopeId}><p class="text-sm font-semibold text-[var(--p-text)]"${_scopeId}>Avatar</p><p class="text-sm text-[var(--p-text-muted)]"${_scopeId}>Upload a profile image to replace the default initial in the header and account screens.</p></div></div><div class="flex flex-wrap items-center gap-3"${_scopeId}><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="hidden"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              loading: unref(avatarUploading),
              onClick: ($event) => unref(avatarInput)?.click()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Choose image `);
                } else {
                  return [
                    createTextVNode(" Choose image ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
            if (unref(avatarStatus)) {
              _push2(`<p class="mt-3 text-sm text-[var(--color-primary-700)]"${_scopeId}>${ssrInterpolate(unref(avatarStatus))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(avatarError)) {
              _push2(`<p class="mt-2 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(avatarError))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (unref(saveSuccess)) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "success",
                variant: "soft",
                title: "Profile updated",
                description: unref(saveSuccess),
                icon: "i-lucide-check-circle"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(saveError)) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "soft",
                title: "Profile update failed",
                description: unref(saveError),
                icon: "i-lucide-alert-circle"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_ProfileEditForm, {
              profile: unref(profileStore).profile,
              user: unref(authStore).user,
              loading: unref(saving) || unref(loading),
              onSubmit: saveProfile,
              onCancel: goBack
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "mb-6 rounded-[24px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5" }, [
                createVNode("div", { class: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" }, [
                  createVNode("div", { class: "flex items-center gap-4" }, [
                    createVNode("div", { class: "flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[var(--p-border)] bg-[var(--p-surface)]" }, [
                      unref(avatarPreviewSrc) ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: unref(avatarPreviewSrc),
                        alt: "Profile avatar",
                        class: "h-full w-full object-cover"
                      }, null, 8, ["src"])) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "inline-flex h-full w-full items-center justify-center bg-[var(--color-primary-600)] text-lg font-semibold text-white"
                      }, toDisplayString(unref(avatarInitials)), 1))
                    ]),
                    createVNode("div", null, [
                      createVNode("p", { class: "text-sm font-semibold text-[var(--p-text)]" }, "Avatar"),
                      createVNode("p", { class: "text-sm text-[var(--p-text-muted)]" }, "Upload a profile image to replace the default initial in the header and account screens.")
                    ])
                  ]),
                  createVNode("div", { class: "flex flex-wrap items-center gap-3" }, [
                    createVNode("input", {
                      ref_key: "avatarInput",
                      ref: avatarInput,
                      type: "file",
                      accept: "image/png,image/jpeg,image/webp,image/gif",
                      class: "hidden",
                      onChange: onAvatarSelected
                    }, null, 544),
                    createVNode(_component_UButton, {
                      variant: "soft",
                      loading: unref(avatarUploading),
                      onClick: ($event) => unref(avatarInput)?.click()
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Choose image ")
                      ]),
                      _: 1
                    }, 8, ["loading", "onClick"])
                  ])
                ]),
                unref(avatarStatus) ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "mt-3 text-sm text-[var(--color-primary-700)]"
                }, toDisplayString(unref(avatarStatus)), 1)) : createCommentVNode("", true),
                unref(avatarError) ? (openBlock(), createBlock("p", {
                  key: 1,
                  class: "mt-2 text-sm text-red-600"
                }, toDisplayString(unref(avatarError)), 1)) : createCommentVNode("", true)
              ]),
              unref(saveSuccess) ? (openBlock(), createBlock(_component_UAlert, {
                key: 0,
                color: "success",
                variant: "soft",
                title: "Profile updated",
                description: unref(saveSuccess),
                icon: "i-lucide-check-circle"
              }, null, 8, ["description"])) : createCommentVNode("", true),
              unref(saveError) ? (openBlock(), createBlock(_component_UAlert, {
                key: 1,
                color: "error",
                variant: "soft",
                title: "Profile update failed",
                description: unref(saveError),
                icon: "i-lucide-alert-circle"
              }, null, 8, ["description"])) : createCommentVNode("", true),
              createVNode(_component_ProfileEditForm, {
                profile: unref(profileStore).profile,
                user: unref(authStore).user,
                loading: unref(saving) || unref(loading),
                onSubmit: saveProfile,
                onCancel: goBack
              }, null, 8, ["profile", "user", "loading"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="space-y-6">`);
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "Supported On This Screen",
        description: "Full name, avatar, language, role, phone, bio, address, and social links are saved through the current user/profile API.",
        icon: "i-lucide-check-check",
        tone: "flamingo"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "Still Not Exposed",
        description: "Password change and advanced account preferences still need dedicated backend endpoints, so this screen only shows features that actually save.",
        icon: "i-lucide-shield-alert",
        tone: "orange"
      }, null, _parent));
      _push(`</div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/account/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit-DEDj53VJ.mjs.map
