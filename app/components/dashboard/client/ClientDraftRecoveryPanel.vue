<template>
  <DashboardSectionCard
    title="Continue where you left off"
    description="Resume unfinished calculator requests without re-entering your specs."
  >
    <div v-if="resumePromptVisible && guestDraft" class="rounded-2xl border border-[var(--p-primary)]/20 bg-[var(--p-primary)]/6 p-4">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-1">
          <p class="font-semibold text-[var(--p-text)]">Guest draft ready to attach</p>
          <p class="text-sm text-[var(--p-text-muted)]">You signed in with a saved anonymous request. Attach it to your dashboard, then continue editing from the homepage calculator.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <BaseButton variant="primary" size="sm" :disabled="isAttaching" @click="attachGuestDraft">
            <Icon v-if="isAttaching" name="lucide:loader-2" class="mr-1.5 size-4 animate-spin" />
            Attach draft
          </BaseButton>
          <BaseButton variant="secondary" size="sm" to="/?resumeDraft=guest" @click="draftRecoveryStore.dismissResumePrompt()">Continue locally</BaseButton>
        </div>
      </div>
    </div>

    <div v-if="loading && !drafts.length" class="flex items-center justify-center gap-2 py-10 text-sm text-[var(--p-text-muted)]">
      <Icon name="lucide:loader-2" class="size-4 animate-spin" />
      Loading drafts...
    </div>

    <div v-else-if="drafts.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="draft in drafts"
        :key="draft.id"
        class="flex h-full flex-col justify-between rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5"
      >
        <div class="space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.22em] text-[var(--p-primary)]">{{ getDraftJobTypeLabel(draft) }}</p>
              <p class="mt-1 text-sm text-[var(--p-text-muted)]">Last edited {{ formatDate(draft.updated_at) }}</p>
            </div>
            <BaseBadge tone="neutral">Draft</BaseBadge>
          </div>

          <dl class="grid grid-cols-2 gap-3 text-sm">
            <div class="rounded-2xl bg-[var(--p-bg-soft)] p-3">
              <dt class="text-[10px] font-bold uppercase tracking-widest text-[var(--p-text-muted)]">Quantity</dt>
              <dd class="mt-1 font-semibold text-[var(--p-text)]">{{ getDraftQuantityLabel(draft) }}</dd>
            </div>
            <div class="rounded-2xl bg-[var(--p-bg-soft)] p-3">
              <dt class="text-[10px] font-bold uppercase tracking-widest text-[var(--p-text-muted)]">Size</dt>
              <dd class="mt-1 font-semibold text-[var(--p-text)]">{{ getDraftSizeLabel(draft) }}</dd>
            </div>
          </dl>

          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-[var(--p-text-muted)]">Missing fields</p>
            <p class="mt-1 text-sm text-[var(--p-text)]">
              {{ getMissingFieldsText(draft) }}
            </p>
          </div>
        </div>

        <BaseButton class="mt-5" variant="primary" :to="`/?resumeDraft=${draft.id}`">Continue request</BaseButton>
      </article>
    </div>

    <div v-else class="rounded-3xl border border-dashed border-[var(--p-border)] bg-[var(--p-bg-soft)]/40 p-8 text-center">
      <p class="font-semibold text-[var(--p-text)]">No saved calculator drafts yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Start a request on the homepage and Printy will keep your progress here.</p>
      <BaseButton class="mt-4" variant="primary" to="/">Start a request</BaseButton>
    </div>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { QuoteDraft } from '~/shared/types/buyer'
import DashboardSectionCard from '~/components/dashboard/shared/DashboardSectionCard.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { useCalculatorDraftRecoveryStore } from '~/stores/calculatorDraftRecovery'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import {
  getDraftJobTypeLabel,
  getDraftMissingFields,
  getDraftQuantityLabel,
  getDraftSizeLabel,
} from '~/utils/calculatorDraftRecovery'

const draftRecoveryStore = useCalculatorDraftRecoveryStore()
const quoteInboxStore = useQuoteInboxStore()
const { drafts, loading } = storeToRefs(quoteInboxStore)
const { guestDraft, resumePromptVisible } = storeToRefs(draftRecoveryStore)

const isAttaching = ref(false)

onMounted(async () => {
  await quoteInboxStore.fetchDrafts()
})

async function attachGuestDraft() {
  isAttaching.value = true
  try {
    const draft = await draftRecoveryStore.attachGuestDraftToAccount()
    if (draft?.id) {
      await quoteInboxStore.fetchDrafts()
      await navigateTo({ path: '/', query: { resumeDraft: String(draft.id) } })
    }
  } finally {
    isAttaching.value = false
  }
}

function getMissingFieldsText(draft: QuoteDraft) {
  const missingFields = getDraftMissingFields(draft)
  return missingFields.length ? missingFields.join(', ') : 'None. Ready to continue.'
}

function formatDate(value?: string | null) {
  if (!value) return 'recently'
  return new Date(value).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}
</script>
