<template>
  <div class="space-y-6">
    <DashboardPageHeader
      :title="job?.title ?? t('jobs.requestFallbackTitle')"
      :subtitle="job?.location || t('jobs.requestFallbackSubtitle')"
    >
      <template #actions>
        <UButton variant="soft" size="sm" to="/dashboard/jobs">{{ t('common.back') }}</UButton>
      </template>
    </DashboardPageHeader>

    <CommonLoadingSpinner v-if="loading && !job" />
    <div v-else-if="error" class="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
      <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
    </div>
    <template v-else-if="job">
      <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 space-y-4">
        <div class="flex justify-between items-start">
          <UBadge :color="statusColor(job.status)" variant="soft">{{ t(`jobs.status.${job.status}`) }}</UBadge>
          <span v-if="job.deadline" class="text-sm text-[var(--p-text-muted)]">
            {{ t('common.deadline') }}: {{ formatDate(job.deadline) }}
          </span>
        </div>
        <div v-if="Object.keys(job.specs || {}).length" class="text-sm">
          <p class="font-medium text-[var(--p-text-muted)] mb-2">{{ t('common.specs') }}</p>
          <ul class="space-y-1">
            <li v-for="(v, k) in job.specs" :key="k" class="flex gap-2">
              <span class="text-[var(--p-text-dim)] capitalize">{{ k }}:</span>
              <span class="text-[var(--p-text)]">{{ v }}</span>
            </li>
          </ul>
        </div>

        <div v-if="canClaim" class="pt-4 border-t border-[var(--p-border)]">
          <p class="text-sm font-medium text-[var(--p-text-muted)] mb-2">{{ t('jobs.actions.claimThisJob') }}</p>
          <div v-if="!showClaimForm" class="flex gap-2">
            <UButton color="primary" size="sm" @click="showClaimForm = true">
              <UIcon name="i-lucide-hand" class="w-4 h-4 mr-2" />
              {{ t('jobs.actions.claimThisJob') }}
            </UButton>
          </div>
          <form v-else class="space-y-3 max-w-md" @submit.prevent="onSubmitClaim">
            <UFormField :label="t('jobs.fields.messageOptional')">
              <UTextarea v-model="claimMessage" :placeholder="t('jobs.placeholders.message')" :rows="2" />
            </UFormField>
            <UFormField :label="t('jobs.fields.priceOfferOptional')">
              <UInput v-model="claimPrice" type="number" :placeholder="t('jobs.placeholders.price')" />
            </UFormField>
            <div class="flex gap-2">
              <UButton type="submit" color="primary" size="sm" :loading="claiming">
                {{ t('jobs.actions.submitClaim') }}
              </UButton>
              <UButton variant="soft" size="sm" @click="showClaimForm = false">{{ t('common.cancel') }}</UButton>
            </div>
          </form>
        </div>

        <div v-if="isOwner && (job.claims?.length ?? 0) > 0" class="pt-4 border-t border-[var(--p-border)]">
          <p class="text-sm font-medium text-[var(--p-text-muted)] mb-2">{{ t('jobs.labels.claims') }}</p>
          <div class="space-y-2">
            <div
              v-for="c in job.claims"
              :key="c.id"
              class="flex items-center justify-between gap-2 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3"
            >
              <div class="min-w-0">
                <p class="text-sm font-medium text-[var(--p-text)]">{{ c.claimed_by_email }}</p>
                <p v-if="c.message" class="text-xs text-[var(--p-text-muted)] truncate">{{ c.message }}</p>
                <p v-if="c.price_offered" class="text-xs text-[var(--p-text-dim)]">KES {{ c.price_offered }}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <UBadge :color="claimStatusColor(c.status)" variant="soft" size="xs">{{ t(`jobs.claimStatus.${c.status}`) }}</UBadge>
                <template v-if="c.status === 'PENDING'">
                  <UButton size="xs" color="success" @click="onAcceptClaim(c.id)">{{ t('jobs.actions.accept') }}</UButton>
                  <UButton size="xs" variant="soft" color="error" @click="onRejectClaim(c.id)">{{ t('jobs.actions.reject') }}</UButton>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-[var(--p-border)]">
          <p class="text-sm font-medium text-[var(--p-text-muted)] mb-2">{{ t('jobs.labels.share') }}</p>
          <div v-if="shareMessage" class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3 mb-3">
            <p class="text-sm text-[var(--p-text)] whitespace-pre-wrap font-mono">{{ shareMessage }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton
              variant="soft"
              size="sm"
              :loading="loadingShare"
              @click="onShare"
            >
              <UIcon name="i-lucide-message-circle" class="w-4 h-4 mr-2" />
              {{ shareMessage ? t('common.refresh') : t('jobs.actions.shareOnWhatsApp') }}
            </UButton>
            <UButton
              v-if="shareMessage"
              variant="soft"
              size="sm"
              @click="onCopy"
            >
              <UIcon name="i-lucide-copy" class="w-4 h-4 mr-2" />
              {{ t('common.copy') }}
            </UButton>
            <UButton
              v-if="shareMessage"
              variant="soft"
              size="sm"
              @click="onOpenWhatsApp"
            >
              <UIcon name="i-lucide-external-link" class="w-4 h-4 mr-2" />
              {{ t('jobs.actions.openWhatsApp') }}
            </UButton>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import type { JobClaimStatus, JobRequest, JobRequestStatus } from '~/shared/types/job'
import { formatDate } from '~/utils/formatters'
import { getWhatsAppShareUrl } from '~/utils/quoteMessage'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const route = useRoute()
const id = computed(() => Number(route.params.id))
const jobRequests = useJobRequests()
const jobClaims = useJobClaims()
const { user } = useAuth()
const notification = useNotification()
const { t } = useI18n()

const job = ref<JobRequest | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const shareMessage = ref('')
const shareUrl = ref('')
const loadingShare = ref(false)
const showClaimForm = ref(false)
const claimMessage = ref('')
const claimPrice = ref<string | number>('')
const claiming = ref(false)

const isOwner = computed(() => job.value && user.value && job.value.created_by === user.value.id)
const canClaim = computed(() =>
  job.value?.status === 'OPEN' &&
  user.value &&
  job.value.created_by !== user.value.id &&
  !job.value.claims?.some(c => c.claimed_by === user.value?.id)
)

function statusColor(s: JobRequestStatus): 'neutral' | 'success' | 'error' {
  const m: Record<string, 'neutral' | 'success' | 'error'> = {
    OPEN: 'success',
    CLAIMED: 'neutral',
    CLOSED: 'error',
  }
  return m[s] ?? 'neutral'
}

function claimStatusColor(s: JobClaimStatus): 'neutral' | 'success' | 'error' {
  const m: Record<string, 'neutral' | 'success' | 'error'> = {
    PENDING: 'neutral',
    ACCEPTED: 'success',
    REJECTED: 'error',
  }
  return m[s] ?? 'neutral'
}

async function onSubmitClaim() {
  claiming.value = true
  try {
    await jobRequests.createClaim(id.value, {
      message: claimMessage.value.trim() || undefined,
      price_offered: claimPrice.value ? Number(claimPrice.value) : null,
    })
    notification.success(t('jobs.feedback.claimSubmitted'))
    showClaimForm.value = false
    claimMessage.value = ''
    claimPrice.value = ''
    await fetchJob()
  } catch (e) {
    notification.error(e instanceof Error ? e.message : t('jobs.feedback.claimFailed'))
  } finally {
    claiming.value = false
  }
}

async function onAcceptClaim(claimId: number) {
  try {
    await jobClaims.accept(claimId)
    notification.success(t('jobs.feedback.claimAccepted'))
    await fetchJob()
  } catch (e) {
    notification.error(e instanceof Error ? e.message : t('jobs.feedback.acceptFailed'))
  }
}

async function onRejectClaim(claimId: number) {
  try {
    await jobClaims.reject(claimId)
    notification.success(t('jobs.feedback.claimRejected'))
    await fetchJob()
  } catch (e) {
    notification.error(e instanceof Error ? e.message : t('jobs.feedback.rejectFailed'))
  }
}

async function fetchJob() {
  loading.value = true
  error.value = null
  try {
    job.value = await jobRequests.get(id.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('jobs.feedback.loadJobFailed')
    job.value = null
  } finally {
    loading.value = false
  }
}

async function onShare() {
  loadingShare.value = true
  try {
    const res = await jobRequests.whatsappShare(id.value)
    shareMessage.value = res.message
    shareUrl.value = res.public_view_url
    notification.success(t('jobs.feedback.shareLinkReady'))
  } catch (e) {
    notification.error(e instanceof Error ? e.message : t('jobs.feedback.shareFailed'))
  } finally {
    loadingShare.value = false
  }
}

async function onCopy() {
  if (!shareMessage.value) return
  const text = shareUrl.value
    ? `${shareMessage.value}\n\n${shareUrl.value}`
    : shareMessage.value
  try {
    await navigator.clipboard.writeText(text)
    notification.success(t('jobs.feedback.copied'))
  } catch {
    notification.error(t('jobs.feedback.copyFailed'))
  }
}

function onOpenWhatsApp() {
  if (!shareMessage.value) return
  const text = shareUrl.value
    ? `${shareMessage.value}\n\n${shareUrl.value}`
    : shareMessage.value
  const url = getWhatsAppShareUrl(text)
  window.open(url, '_blank', 'noopener,noreferrer')
}

onMounted(() => {
  void fetchJob()
})
</script>
