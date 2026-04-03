<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Account</p>
          <h1 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Profile and account details</h1>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">
            {{ introCopy }}
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <UButton v-if="showDashboardCta" variant="soft" to="/dashboard">
            <UIcon name="i-lucide-layout-dashboard" class="mr-2 h-4 w-4" />
            Open Shop Dashboard
          </UButton>
          <UButton variant="soft" :disabled="editDisabled" to="/account/edit">
            <UIcon name="i-lucide-pencil" class="mr-2 h-4 w-4" />
            Edit Profile
          </UButton>
        </div>
      </div>

      <UAlert
        v-if="loadError"
        class="mt-6"
        color="warning"
        variant="soft"
        title="Profile data is partially unavailable"
        :description="loadError"
        icon="i-lucide-alert-triangle"
      />

      <div class="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.2fr]">
        <DashboardFormSection title="Account Summary" description="A clear profile overview for the details the current API reads and saves reliably.">
          <div class="flex items-start gap-4 rounded-[26px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5">
            <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] text-xl font-semibold text-orange-700 dark:border-orange-400/25 dark:bg-orange-500/12 dark:text-orange-100">
              <img v-if="avatarSrc" :src="avatarSrc" :alt="displayName" class="h-full w-full object-cover">
              <span v-else class="inline-flex h-full w-full items-center justify-center bg-orange-50 dark:bg-orange-500/12">
                {{ initials }}
              </span>
            </div>
            <div class="min-w-0">
              <p class="text-xl font-semibold text-[var(--p-text)] dark:text-white">{{ displayName }}</p>
              <p class="mt-1 text-sm text-[var(--p-text-muted)] dark:text-slate-300">{{ authStore.user?.email ?? 'No email available' }}</p>
              <p class="mt-3 text-sm leading-6 text-[var(--p-text-dim)] dark:text-slate-300">
                {{ profile?.bio || 'Add a short bio so shops can quickly understand who is requesting the quote.' }}
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

        <DashboardFormSection title="Supported Now" description="These sections are connected to the live backend and stay in sync with the edit form.">
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
                  <UIcon :name="platformIcon(link.platform)" class="h-4 w-4" />
                  {{ formatPlatform(link.platform) }}
                </a>
              </div>
              <p v-else class="text-sm text-[var(--p-text-dim)] dark:text-slate-300">No social links added yet.</p>
            </div>
          </div>

          <DashboardInfoCard
            title="Available On Edit"
            description="Profile image uploads and social/account details are now editable. Password change and richer account preferences still need dedicated backend endpoints."
            icon="i-lucide-image-up"
            tone="blue"
          />
        </DashboardFormSection>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'
import { useMediaUrl } from '~/utils/media'

definePageMeta({
  layout: 'workspace',
  middleware: 'auth',
})

const authStore = useAuthStore()
const profileStore = useProfileStore()
const PLATFORM_ICONS: Record<string, string> = {
  facebook: 'i-simple-icons-facebook',
  twitter: 'i-simple-icons-x',
  instagram: 'i-simple-icons-instagram',
  linkedin: 'i-simple-icons-linkedin',
  youtube: 'i-simple-icons-youtube',
  tiktok: 'i-simple-icons-tiktok',
  pinterest: 'i-simple-icons-pinterest',
  website: 'i-lucide-globe',
}

const loadError = ref('')
const profile = computed(() => profileStore.profile)
const getMediaUrl = useMediaUrl()
const displayName = computed(() => {
  const fullName = [authStore.user?.first_name, authStore.user?.last_name].filter(Boolean).join(' ').trim()
  return fullName || authStore.user?.name?.trim() || 'Printy User'
})
const initials = computed(() => displayName.value.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || 'PU')
const avatarSrc = computed(() => getMediaUrl(profile.value?.avatar ?? authStore.user?.avatar ?? null))
const preferredLanguageLabel = computed(() => authStore.user?.preferred_language === 'sw' ? 'Swahili' : 'English')
const roleLabel = computed(() => authStore.normalizedRole === 'client' ? 'Client' : authStore.normalizedRole)
const editDisabled = computed(() => !authStore.user && !!loadError.value)
const showDashboardCta = computed(() => authStore.isShopOwner || authStore.isStaffRole)
const introCopy = computed(() => {
  if (showDashboardCta.value) {
    return 'Manage your contact details here, then use the shop dashboard for pricing, quotes, production setup, and shop operations.'
  }
  return 'Manage your contact details, profile image, and public-facing links from the client workspace.'
})
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

function platformIcon(platform: string) {
  return PLATFORM_ICONS[platform.toLowerCase()] ?? 'i-lucide-link'
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
