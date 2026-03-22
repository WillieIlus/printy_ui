<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Edit Profile"
      subtitle="Update the account fields the current API supports cleanly, and keep unsupported profile fields visible with an explicit backend note."
    >
      <template #actions>
        <UButton to="/dashboard/profile" variant="soft">Back to Profile</UButton>
      </template>
    </DashboardPageHeader>

    <div class="grid gap-6 xl:grid-cols-[1.2fr_0.85fr]">
      <DashboardFormSection title="Editable Account Fields" description="This route no longer relies on the broken split between first/last name and the profile compatibility shell.">
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

        <form class="space-y-5" @submit.prevent="saveProfile">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-white">Full Name</label>
            <UInput v-model="editableName" placeholder="Amina Otieno" size="xl" @blur="nameTouched = true" />
            <DashboardInlineError :message="nameError" />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-white">Email Address</label>
            <UInput :model-value="authStore.user?.email ?? ''" readonly size="xl" />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-white">Preferred Language</label>
            <USelectMenu
              v-model="preferredLanguage"
              :items="languageOptions"
              value-key="value"
              label-key="label"
              size="xl"
            />
          </div>

          <DashboardInfoCard
            title="Unsupported fields"
            description="Phone number, business role, address, password change flow, and social links still need backend persistence before this screen can save them reliably."
            icon="i-lucide-server"
            tone="orange"
          />

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Phone Number</label>
              <UInput model-value="" placeholder="Backend support still needed" readonly size="xl" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Business Role</label>
              <UInput model-value="" placeholder="Backend support still needed" readonly size="xl" />
            </div>
          </div>

          <div class="flex justify-end">
            <DashboardLoadingButton type="submit" color="primary" :loading="saving">
              Save Changes
            </DashboardLoadingButton>
          </div>
        </form>
      </DashboardFormSection>

      <div class="space-y-6">
        <DashboardInfoCard
          title="What was fixed"
          description="The save action now uses the actual editable account API shape instead of sending first and last name fields the backend does not recognize."
          icon="i-lucide-wrench"
          tone="blue"
        />
        <DashboardInfoCard
          title="What still needs backend work"
          description="If you want full profile editing here, the API needs real fields for phone, role, address, password updates, and social links."
          icon="i-lucide-database"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '~/composables/useNotification'
import { useAuthStore } from '~/stores/auth'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const notification = useNotification()
const authStore = useAuthStore()
const userStore = useUserStore()

const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref('')
const editableName = ref('')
const preferredLanguage = ref('en')
const nameTouched = ref(false)

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Swahili', value: 'sw' },
]

watch(() => authStore.user, (user) => {
  editableName.value = user?.name?.trim() || ''
  preferredLanguage.value = user?.preferred_language || 'en'
}, { immediate: true })

const nameError = computed(() => {
  if (!nameTouched.value && !saveError.value) return null
  return editableName.value.trim() ? null : 'Full name is required.'
})

async function saveProfile() {
  saveError.value = ''
  saveSuccess.value = ''
  nameTouched.value = true
  if (!editableName.value.trim()) {
    saveError.value = 'Please correct the highlighted fields.'
    return
  }
  saving.value = true

  try {
    const result = await userStore.updateMe({
      name: editableName.value.trim(),
      preferred_language: preferredLanguage.value,
    })

    if (!result.success) {
      saveError.value = result.error ?? 'Profile update failed.'
      return
    }

    await authStore.fetchMe()
    saveSuccess.value = 'Your profile details were saved successfully.'
    notification.success('Profile updated successfully.')
    await navigateTo('/dashboard/profile')
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Profile update failed.'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchMe()
  }
})
</script>
