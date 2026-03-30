<template>
  <div class="space-y-6">
    <DashboardPageHeader
      :title="t('jobs.title')"
      :subtitle="t('jobs.subtitle')"
    >
      <template #actions>
        <UButton color="primary" to="/dashboard/jobs/create">
          <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
          {{ t('jobs.actions.createRequest') }}
        </UButton>
      </template>
    </DashboardPageHeader>

    <div class="flex gap-2 border-b border-[var(--p-border)] pb-2">
      <UButton
        :variant="tab === 'open' ? 'solid' : 'soft'"
        :color="tab === 'open' ? 'primary' : 'neutral'"
        size="sm"
        @click="tab = 'open'"
      >
        {{ t('jobs.tabs.open') }}
      </UButton>
      <UButton
        :variant="tab === 'mine' ? 'solid' : 'soft'"
        :color="tab === 'mine' ? 'primary' : 'neutral'"
        size="sm"
        @click="tab = 'mine'"
      >
        {{ t('jobs.tabs.mine') }}
      </UButton>
      <UButton
        :variant="tab === 'claims' ? 'solid' : 'soft'"
        :color="tab === 'claims' ? 'primary' : 'neutral'"
        size="sm"
        @click="tab = 'claims'"
      >
        {{ t('jobs.tabs.claims') }}
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading && tab !== 'claims'" />
    <div v-else-if="error" class="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
      <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
    </div>
    <div v-else-if="tab === 'claims'" class="space-y-4">
      <CommonLoadingSpinner v-if="loadingClaims" />
      <div v-else-if="claims.length" class="space-y-3">
        <div
          v-for="c in claims"
          :key="c.id"
          class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 flex items-center justify-between gap-4"
        >
          <div class="min-w-0">
            <NuxtLink :to="`/dashboard/jobs/${c.job_request}`" class="font-medium text-[var(--p-text)] hover:underline">
              {{ c.job_request_title || t('jobs.labels.jobNumber', { id: c.job_request }) }}
            </NuxtLink>
            <p v-if="c.message" class="text-sm text-[var(--p-text-muted)] truncate mt-0.5">{{ c.message }}</p>
            <p v-if="c.price_offered" class="text-xs text-[var(--p-text-dim)]">{{ formatMoney(c.price_offered) }}</p>
          </div>
          <UBadge :color="claimStatusColor(c.status)" variant="soft" size="sm">{{ t(`jobs.claimStatus.${c.status}`) }}</UBadge>
        </div>
      </div>
      <DashboardEmptyState
        v-else
        :title="t('jobs.empty.noClaimsTitle')"
        :description="t('jobs.empty.noClaimsDescription')"
        icon="i-lucide-hand"
      >
        <UButton color="primary" @click="tab = 'open'; fetchJobs()">{{ t('jobs.actions.browseOpenJobs') }}</UButton>
      </DashboardEmptyState>
    </div>
    <div v-else-if="displayJobs.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="job in displayJobs"
        :key="job.id"
        class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700"
      >
        <div class="flex justify-between items-start">
          <h3 class="font-semibold text-[var(--p-text)]">{{ job.title }}</h3>
          <UBadge :color="statusColor(job.status)" variant="soft" size="xs">{{ t(`jobs.status.${job.status}`) }}</UBadge>
        </div>
        <p v-if="job.location" class="text-sm text-[var(--p-text-muted)] mt-0.5">{{ job.location }}</p>
        <p v-if="job.deadline" class="text-xs text-[var(--p-text-dim)] mt-1">
          {{ t('common.deadline') }}: {{ formatDate(job.deadline) }}
        </p>
        <p v-if="tab === 'mine' && (job.claims_count ?? 0) > 0" class="text-xs text-[var(--p-text-muted)] mt-1">
          {{ (job.claims_count ?? 0) === 1
            ? t('jobs.labels.claimCount_one', { count: job.claims_count ?? 0 })
            : t('jobs.labels.claimCount_other', { count: job.claims_count ?? 0 }) }}
        </p>
        <div v-if="tab === 'mine' && (job.claims?.length ?? 0) > 0" class="mt-2 space-y-1.5">
          <div
            v-for="c in job.claims"
            :key="c.id"
            class="flex items-center justify-between gap-2 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-2 text-xs"
          >
            <div class="min-w-0 truncate">
              <span class="font-medium text-[var(--p-text)]">{{ c.claimed_by_email }}</span>
              <span v-if="c.message" class="text-[var(--p-text-muted)]"> - {{ c.message }}</span>
              <span v-if="c.price_offered" class="text-[var(--p-text-dim)]"> {{ formatMoney(c.price_offered) }}</span>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <UBadge :color="claimStatusColor(c.status)" variant="soft" size="xs">{{ t(`jobs.claimStatus.${c.status}`) }}</UBadge>
              <template v-if="c.status === 'PENDING'">
                <UButton size="xs" color="success" @click.stop="onAcceptClaim(c.id)">{{ t('jobs.actions.accept') }}</UButton>
                <UButton size="xs" variant="soft" color="error" @click.stop="onRejectClaim(c.id)">{{ t('jobs.actions.reject') }}</UButton>
              </template>
            </div>
          </div>
        </div>
        <div class="mt-3 flex gap-2">
          <UButton variant="soft" size="xs" :to="`/dashboard/jobs/${job.id}`">
            {{ t('common.view') }}
          </UButton>
        </div>
      </div>
    </div>
    <DashboardEmptyState
      v-else
      :title="tab === 'open' ? t('jobs.empty.noOpenTitle') : t('jobs.empty.noOwnTitle')"
      :description="tab === 'open' ? t('jobs.empty.noOpenDescription') : t('jobs.empty.noOwnDescription')"
      icon="i-lucide-briefcase"
    >
      <UButton v-if="tab === 'mine'" to="/dashboard/jobs/create" color="primary">{{ t('jobs.actions.createRequest') }}</UButton>
    </DashboardEmptyState>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import type { JobRequest, JobRequestStatus } from '~/shared/types/job'
import { formatDate } from '~/utils/formatters'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const jobRequests = useJobRequests()
const jobClaims = useJobClaims()
const { user } = useAuth()
const notification = useNotification()
const { t } = useI18n()
const tab = ref<'open' | 'mine' | 'claims'>('open')
const jobs = ref<JobRequest[]>([])
const claims = ref<import('~/shared/types/job').JobClaim[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const loadingClaims = ref(false)
const { formatMoney } = useCurrencyFormatter()

const displayJobs = computed(() => {
  if (tab.value === 'open') {
    return jobs.value.filter(j => j.status === 'OPEN')
  }
  if (tab.value === 'mine') {
    return jobs.value.filter(j => j.created_by === user.value?.id)
  }
  return []
})

function statusColor(s: JobRequestStatus): 'neutral' | 'success' | 'error' {
  const m: Record<string, 'neutral' | 'success' | 'error'> = {
    OPEN: 'success',
    CLAIMED: 'neutral',
    CLOSED: 'error',
  }
  return m[s] ?? 'neutral'
}

function claimStatusColor(s: import('~/shared/types/job').JobClaimStatus): 'neutral' | 'success' | 'error' {
  const m: Record<string, 'neutral' | 'success' | 'error'> = {
    PENDING: 'neutral',
    ACCEPTED: 'success',
    REJECTED: 'error',
  }
  return m[s] ?? 'neutral'
}

async function fetchJobs() {
  loading.value = true
  error.value = null
  try {
    const res = await jobRequests.list()
    jobs.value = res.results
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('jobs.feedback.loadFailed')
    jobs.value = []
  } finally {
    loading.value = false
  }
}

async function fetchClaims() {
  loadingClaims.value = true
  try {
    const res = await jobClaims.list({ claimed_by: 'me' })
    claims.value = res.results
  } catch {
    claims.value = []
  } finally {
    loadingClaims.value = false
  }
}

async function onAcceptClaim(claimId: number) {
  try {
    await jobClaims.accept(claimId)
    notification.success(t('jobs.feedback.claimAccepted'))
    await fetchJobs()
  } catch (e) {
    notification.error(e instanceof Error ? e.message : t('jobs.feedback.acceptFailed'))
  }
}

async function onRejectClaim(claimId: number) {
  try {
    await jobClaims.reject(claimId)
    notification.success(t('jobs.feedback.claimRejected'))
    await fetchJobs()
  } catch (e) {
    notification.error(e instanceof Error ? e.message : t('jobs.feedback.rejectFailed'))
  }
}

watch(tab, (nextTab) => {
  if (nextTab === 'claims') {
    void fetchClaims()
    return
  }
  void fetchJobs()
}, { immediate: false })

onMounted(() => {
  if (tab.value === 'claims') {
    void fetchClaims()
    return
  }
  void fetchJobs()
})
</script>
