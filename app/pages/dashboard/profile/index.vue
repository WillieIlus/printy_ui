<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Profile"
      subtitle="Manage the account details Printy can save today, and see which richer profile fields still need backend support."
    >
      <template #actions>
        <UButton to="/dashboard/profile/edit" variant="soft">
          <UIcon name="i-lucide-pencil" class="mr-2 h-4 w-4" />
          Edit Profile
        </UButton>
      </template>
    </DashboardPageHeader>

    <div class="grid gap-6 xl:grid-cols-[0.95fr_1.2fr]">
      <DashboardFormSection title="Account Summary" description="A cleaner profile surface for daily dashboard use.">
        <div class="flex items-start gap-4 rounded-[26px] border border-white/10 bg-white/5 p-5">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-orange-400/25 bg-orange-500/12 text-xl font-semibold text-orange-100">
            {{ initials }}
          </div>
          <div class="min-w-0">
            <p class="text-xl font-semibold text-white">{{ displayName }}</p>
            <p class="mt-1 text-sm text-slate-300">{{ authStore.user?.email ?? 'No email available' }}</p>
            <p class="mt-3 text-sm leading-6 text-slate-300">
              Use this page for the account details the current API supports reliably today.
            </p>
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Full Name</p>
            <p class="mt-2 text-sm font-semibold text-white">{{ displayName }}</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Preferred Language</p>
            <p class="mt-2 text-sm font-semibold text-white">{{ preferredLanguageLabel }}</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Phone</p>
            <p class="mt-2 text-sm font-semibold text-slate-300">Backend support still needed</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Business Role</p>
            <p class="mt-2 text-sm font-semibold text-slate-300">Backend support still needed</p>
          </div>
        </div>
      </DashboardFormSection>

      <DashboardFormSection title="Quick Edit" description="Save what the current API supports, with clear feedback instead of silent failures.">
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
            <UInput v-model="editableName" placeholder="Amina Otieno" size="xl" />
            <DashboardFieldHint text="This is persisted through the current `users/me` API as a single full-name field." />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-white">Email</label>
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
            title="Profile persistence today"
            description="Phone, address, social links, and business role are still not persisted by the current backend profile endpoints. They remain visible here so the gap is explicit, not hidden."
            icon="i-lucide-server"
          />

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Phone Number</label>
              <UInput model-value="" placeholder="Awaiting backend support" readonly size="xl" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Business Role</label>
              <UInput model-value="" placeholder="Awaiting backend support" readonly size="xl" />
            </div>
          </div>

          <div class="flex justify-end">
            <DashboardLoadingButton type="submit" color="primary" :loading="saving">
              Save Profile
            </DashboardLoadingButton>
          </div>
        </form>
      </DashboardFormSection>
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
const editableName = ref('')
const preferredLanguage = ref('en')

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Swahili', value: 'sw' },
]

const displayName = computed(() => authStore.user?.name?.trim() || 'Printy User')
const initials = computed(() => displayName.value.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || 'PU')
const preferredLanguageLabel = computed(() => preferredLanguage.value === 'sw' ? 'Swahili' : 'English')

watch(() => authStore.user, (user) => {
  editableName.value = user?.name?.trim() || ''
  preferredLanguage.value = user?.preferred_language || 'en'
}, { immediate: true })

async function saveProfile() {
  saveError.value = ''
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
    notification.success('Profile updated successfully.')
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
