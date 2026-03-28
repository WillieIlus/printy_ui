<template>
  <div class="min-h-screen bg-[var(--p-bg)] p-4 sm:p-6">
    <div class="max-w-xl mx-auto">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm text-[var(--p-text-muted)] hover:text-[var(--p-text)] mb-6">
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        {{ t('jobs.actions.backToPrinty') }}
      </NuxtLink>

      <CommonLoadingSpinner v-if="loading && !job" />
      <div v-else-if="error" class="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">
        <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
      </div>
      <div v-else-if="job" class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 space-y-6">
        <div>
          <h1 class="text-xl font-bold text-[var(--p-text)]">{{ job.title }}</h1>
          <UBadge v-if="job.status" :color="job.status === 'OPEN' ? 'success' : 'neutral'" variant="soft" class="mt-2">
            {{ t(`jobs.status.${job.status}`) }}
          </UBadge>
        </div>

        <div v-if="job.location" class="text-sm">
          <span class="text-[var(--p-text-muted)]">{{ t('common.location') }}:</span>
          <span class="text-[var(--p-text)] ml-2">{{ job.location }}</span>
        </div>
        <div v-if="job.deadline" class="text-sm">
          <span class="text-[var(--p-text-muted)]">{{ t('common.deadline') }}:</span>
          <span class="text-[var(--p-text)] ml-2">{{ formatDate(job.deadline) }}</span>
        </div>

        <div v-if="Object.keys(job.specs || {}).length" class="space-y-2">
          <p class="text-sm font-medium text-[var(--p-text-muted)]">{{ t('common.specs') }}</p>
          <ul class="space-y-1 text-sm">
            <li v-for="(v, k) in job.specs" :key="k" class="flex gap-2">
              <span class="text-[var(--p-text-dim)] capitalize">{{ k }}:</span>
              <span class="text-[var(--p-text)]">{{ v }}</span>
            </li>
          </ul>
        </div>

        <div class="pt-4 border-t border-[var(--p-border)]">
          <p class="text-sm text-[var(--p-text-muted)] mb-3">{{ t('jobs.actions.claimThisJob') }}</p>
          <UButton
            color="primary"
            :to="loginUrl"
          >
            <UIcon name="i-lucide-log-in" class="w-4 h-4 mr-2" />
            {{ t('jobs.actions.signInToClaim') }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import type { PublicJob } from '~/shared/types/job'
import { formatDate } from '~/utils/formatters'

definePageMeta({
  layout: false,
})

const route = useRoute()
const token = computed(() => String(route.params.token))
const publicJob = usePublicJob()
const job = ref<PublicJob | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const { t } = useI18n()

const loginUrl = computed(() => `/auth/login?redirect=${encodeURIComponent(route.fullPath)}`)

async function fetchJob() {
  loading.value = true
  error.value = null
  try {
    job.value = await publicJob.getByToken(token.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('jobs.feedback.jobNotFound')
    job.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void fetchJob()
})
</script>
