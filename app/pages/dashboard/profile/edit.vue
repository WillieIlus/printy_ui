<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Edit Profile"
      subtitle="Update your profile details, public links, and avatar with the same live account API used by the header and profile screens."
    >
      <template #actions>
        <UButton variant="soft" @click="goBack">Back to Profile</UButton>
      </template>
    </DashboardPageHeader>

    <div class="grid gap-6 xl:grid-cols-[1.2fr_0.85fr]">
      <DashboardFormSection title="Profile Details" description="Name, role, language, phone, address, bio, avatar, and social links are supported here through the live account API.">
        <div class="mb-6 rounded-[24px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-4">
              <div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[var(--p-border)] bg-[var(--p-surface)]">
                <img
                  v-if="avatarPreviewSrc"
                  :src="avatarPreviewSrc"
                  alt="Profile avatar"
                  class="h-full w-full object-cover"
                >
                <span
                  v-else
                  class="inline-flex h-full w-full items-center justify-center bg-[var(--color-primary-600)] text-lg font-semibold text-white"
                >
                  {{ avatarInitials }}
                </span>
              </div>
              <div>
                <p class="text-sm font-semibold text-[var(--p-text)]">Avatar</p>
                <p class="text-sm text-[var(--p-text-muted)]">Upload a profile image to replace the default initial in the header and account screens.</p>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <input
                ref="avatarInput"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                class="hidden"
                @change="onAvatarSelected"
              >
              <UButton variant="soft" :loading="avatarUploading" @click="avatarInput?.click()">
                Choose image
              </UButton>
            </div>
          </div>
          <p v-if="avatarStatus" class="mt-3 text-sm text-[var(--color-primary-700)]">{{ avatarStatus }}</p>
          <p v-if="avatarError" class="mt-2 text-sm text-red-600">{{ avatarError }}</p>
        </div>

        <UAlert
          v-if="saveSuccess"
          color="success"
          variant="soft"
          title="Profile updated"
          :description="saveSuccess"
          icon="i-lucide-check-circle"
        />
        <UAlert
          v-if="saveError"
          color="error"
          variant="soft"
          title="Profile update failed"
          :description="saveError"
          icon="i-lucide-alert-circle"
        />

        <ProfileEditForm
          :profile="profileStore.profile"
          :user="authStore.user"
          :loading="saving || loading"
          @submit="saveProfile"
          @cancel="goBack"
        />
      </DashboardFormSection>

      <div class="space-y-6">
        <DashboardInfoCard
          title="Supported On This Screen"
          description="Full name, avatar, language, role, phone, bio, address, and social links are saved through the current user/profile API."
          icon="i-lucide-check-check"
          tone="blue"
        />
        <DashboardInfoCard
          title="Still Not Exposed"
          description="Password change and advanced account preferences still need dedicated backend endpoints, so this screen only shows features that actually save."
          icon="i-lucide-shield-alert"
          tone="orange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserUpdatePayload } from '~/shared/types'
import { useNotification } from '~/composables/useNotification'
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'
import { useUserStore } from '~/stores/user'
import { useMediaUrl } from '~/utils/media'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const notification = useNotification()
const authStore = useAuthStore()
const profileStore = useProfileStore()
const userStore = useUserStore()

const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref('')
const avatarUploading = ref(false)
const avatarError = ref('')
const avatarStatus = ref('')
const avatarInput = ref<HTMLInputElement | null>(null)
const loading = computed(() => !authStore.user || profileStore.loading)
const getMediaUrl = useMediaUrl()
const avatarPreviewSrc = computed(() => getMediaUrl(profileStore.profile?.avatar ?? authStore.user?.avatar ?? null))
const avatarInitials = computed(() => {
  const fullName = [authStore.user?.first_name, authStore.user?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim()
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'U'
})

function buildFullName(payload: UserUpdatePayload) {
  if (payload.name?.trim()) return payload.name.trim()
  return [payload.first_name?.trim(), payload.last_name?.trim()].filter(Boolean).join(' ').trim()
}

async function loadProfile() {
  await Promise.all([
    authStore.user ? Promise.resolve() : authStore.fetchMe(),
    profileStore.fetchProfile(),
  ])
}

async function saveProfile(payload: UserUpdatePayload) {
  saveError.value = ''
  saveSuccess.value = ''
  saving.value = true

  try {
    const result = await userStore.updateMe({
      ...payload,
      name: buildFullName(payload),
    })

    if (!result.success) {
      saveError.value = result.error ?? 'Profile update failed.'
      return
    }

    await Promise.all([authStore.fetchMe(), profileStore.fetchProfile()])
    saveSuccess.value = 'Your profile details were saved successfully.'
    notification.success('Profile updated successfully.')
    await navigateTo('/dashboard/profile')
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Profile update failed.'
  } finally {
    saving.value = false
  }
}

async function onAvatarSelected(event: Event) {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]
  if (!file) return

  avatarUploading.value = true
  avatarError.value = ''
  avatarStatus.value = ''

  try {
    const result = await profileStore.uploadAvatar(file)
    if (!result.success) {
      avatarError.value = result.error ?? 'Avatar upload failed.'
      return
    }

    await Promise.all([authStore.fetchMe(), profileStore.fetchProfile()])
    avatarStatus.value = 'Avatar updated successfully.'
    notification.success('Avatar updated successfully.')
  } catch (error) {
    avatarError.value = error instanceof Error ? error.message : 'Avatar upload failed.'
  } finally {
    avatarUploading.value = false
    if (input) input.value = ''
  }
}

async function goBack() {
  await navigateTo('/dashboard/profile')
}

onMounted(async () => {
  try {
    await loadProfile()
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Profile could not be loaded.'
  }
})
</script>
