<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Profile"
      subtitle="Manage the account details Printy currently supports, and keep unsupported account features explicit instead of broken."
    >
      <template #actions>
        <UButton
          variant="soft"
          :disabled="editDisabled"
          @click="openEdit"
        >
          <UIcon name="i-lucide-pencil" class="mr-2 h-4 w-4" />
          Edit Profile
        </UButton>
      </template>
    </DashboardPageHeader>

    <UAlert
      v-if="loadError"
      color="warning"
      variant="soft"
      title="Profile data is partially unavailable"
      :description="loadError"
      icon="i-lucide-alert-triangle"
    />

    <div class="grid gap-6 xl:grid-cols-[0.95fr_1.2fr]">
      <DashboardFormSection title="Account Summary" description="A clear profile overview with only the details the current API can read and save reliably.">
        <div class="flex items-start gap-4 rounded-[26px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-orange-200 bg-orange-50 text-xl font-semibold text-orange-700 dark:border-orange-400/25 dark:bg-orange-500/12 dark:text-orange-100">
            {{ initials }}
          </div>
          <div class="min-w-0">
            <p class="text-xl font-semibold text-[var(--p-text)] dark:text-white">{{ displayName }}</p>
            <p class="mt-1 text-sm text-[var(--p-text-muted)] dark:text-slate-300">{{ authStore.user?.email ?? 'No email available' }}</p>
            <p class="mt-3 text-sm leading-6 text-[var(--p-text-dim)] dark:text-slate-300">
              {{ profile?.bio || 'Add a short bio so collaborators and customers can quickly understand this account.' }}
            </p>
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
            <p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500">Full Name</p>
            <p class="mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white">{{ displayName }}</p>
          </div>
          <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
            <p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500">Preferred Language</p>
            <p class="mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white">{{ preferredLanguageLabel }}</p>
          </div>
          <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
            <p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500">Phone</p>
            <p class="mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white">{{ profile?.phone || 'Not provided yet' }}</p>
          </div>
          <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
            <p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500">Business Role</p>
            <p class="mt-2 text-sm font-semibold text-[var(--p-text)] dark:text-white">{{ roleLabel }}</p>
          </div>
        </div>
      </DashboardFormSection>

      <DashboardFormSection title="Supported Now" description="These sections are connected to current backend support and should stay in sync with the edit form.">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 md:col-span-2">
            <p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500">Address</p>
            <p class="text-sm font-medium text-[var(--p-text)] dark:text-white">{{ addressLines[0] }}</p>
            <p v-if="addressLines[1]" class="text-sm text-[var(--p-text-dim)] dark:text-slate-300">{{ addressLines[1] }}</p>
          </div>
          <div class="space-y-2 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 md:col-span-2">
            <p class="text-xs uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500">Social Links</p>
            <div v-if="profile?.social_links?.length" class="flex flex-wrap gap-2">
              <a
                v-for="link in profile.social_links"
                :key="link.id"
                :href="link.url"
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 dark:border-sky-400/25 dark:bg-sky-500/10 dark:text-sky-100 dark:hover:border-sky-300/40 dark:hover:bg-sky-500/15"
              >
                <UIcon name="i-lucide-link" class="h-4 w-4" />
                {{ formatPlatform(link.platform) }}
              </a>
            </div>
            <p v-else class="text-sm text-[var(--p-text-dim)] dark:text-slate-300">No social links added yet.</p>
          </div>
        </div>

        <DashboardInfoCard
          title="Not Supported Yet"
          description="Avatar uploads, password change, and richer account preferences are not exposed on the current dashboard API. They are intentionally not shown as editable settings here."
          icon="i-lucide-server-off"
          tone="orange"
        />

        <div class="flex justify-end">
          <UButton
            color="primary"
            :disabled="editDisabled"
            @click="openEdit"
          >
            Update Profile
          </UButton>
        </div>
      </DashboardFormSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const authStore = useAuthStore()
const profileStore = useProfileStore()

const loadError = ref('')

const profile = computed(() => profileStore.profile)
const displayName = computed(() => {
  const fullName = [authStore.user?.first_name, authStore.user?.last_name].filter(Boolean).join(' ').trim()
  return fullName || authStore.user?.name?.trim() || 'Printy User'
})
const initials = computed(() => displayName.value.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || 'PU')
const preferredLanguageLabel = computed(() => authStore.user?.preferred_language === 'sw' ? 'Swahili' : 'English')
const roleLabel = computed(() => {
  if (authStore.normalizedRole === 'shop_owner') return 'Shop owner'
  if (authStore.normalizedRole === 'staff') return 'Staff'
  return 'Client'
})
const editDisabled = computed(() => !authStore.user && !!loadError.value)
const addressLines = computed(() => {
  const firstLine = profile.value?.address?.trim() || 'No address saved yet.'
  const secondLineParts = [
    profile.value?.city,
    profile.value?.state,
    profile.value?.country,
    profile.value?.postal_code,
  ].filter(part => part?.trim())

  return [firstLine, secondLineParts.join(', ')]
})

function formatPlatform(platform: string) {
  return platform
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

async function openEdit() {
  if (editDisabled.value) return
  await navigateTo('/dashboard/profile/edit')
}

onMounted(async () => {
  loadError.value = ''

  try {
    await Promise.all([
      authStore.user ? Promise.resolve() : authStore.fetchMe(),
      profileStore.fetchProfile(),
    ])
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Profile could not be loaded.'
  }
})
</script>
