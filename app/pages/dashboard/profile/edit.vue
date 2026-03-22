<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Edit Profile"
      subtitle="Save only the account fields the current backend supports, with one deliberate form and clear feedback."
    >
      <template #actions>
        <UButton variant="soft" @click="goBack">Back to Profile</UButton>
      </template>
    </DashboardPageHeader>

    <div class="grid gap-6 xl:grid-cols-[1.2fr_0.85fr]">
      <DashboardFormSection title="Profile Details" description="Name, role, language, phone, address, bio, and social links are supported here. Unsupported account features stay clearly out of the save flow.">
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
          description="Full name, language, role, phone, bio, address, and social links are saved through the current user/profile API."
          icon="i-lucide-check-check"
          tone="blue"
        />
        <DashboardInfoCard
          title="Intentionally Unavailable"
          description="Avatar upload, password change, and advanced account preferences are not exposed here yet, so this screen does not pretend to save them."
          icon="i-lucide-server-off"
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
const loading = computed(() => !authStore.user || profileStore.loading)

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
